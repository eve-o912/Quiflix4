// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title QuiflixDDT - Digital Distribution Token
 * @notice A hybrid Web2-Web3 system for film distribution rights management.
 *         Each token represents an exclusive distribution license for a specific film.
 *         500 DDTs are created per approved film, distributed to qualified distributors.
 *         All payments are settled in USDC (6 decimals).
 *
 * @dev Audit fixes applied + USDC payment integration:
 *   [C1] safeTransferFrom → _safeTransferFrom (contract cannot approve itself)
 *   [C2] USDC pull-payment settlement via claimEarnings() using SafeERC20
 *   [H1] Single owner replaced with AccessControl (ADMIN, PLATFORM, FINANCE roles)
 *   [H2] Token ID is now 1:1 with filmId (no magic *1000 multiplier / collision risk)
 *   [H3] DDT assignment checks remaining contract balance before transfer
 *   [M1] whenNotPaused applied to all state-mutating functions
 *   [M2] Revenue rounding remainder assigned to Quiflix
 *   [M3] salesHistory unbounded array replaced with event-only pattern
 *   [L1] Typo in RevenuePaid event fixed (filmakerAmount → filmmakerAmount)
 *   [L2] Redundant uri() override removed
 *   [L3] Redundant filmToFilmmaker mapping removed
 *   [L4] heldFilmIds deduplication uses explicit boolean guard mapping
 *   [L5] Zero-address check added for _filmmaker in registerFilm
 */
contract QuiflixDDT is ERC1155, AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ==================== ROLES ====================

    bytes32 public constant ADMIN_ROLE    = keccak256("ADMIN_ROLE");
    bytes32 public constant PLATFORM_ROLE = keccak256("PLATFORM_ROLE");
    bytes32 public constant FINANCE_ROLE  = keccak256("FINANCE_ROLE");

    // ==================== CONSTANTS ====================

    uint256 public constant DDT_PER_FILM = 500;

    uint256 public constant FILMMAKER_PERCENTAGE   = 70;
    uint256 public constant DISTRIBUTOR_PERCENTAGE = 20;
    uint256 public constant QUIFLIX_PERCENTAGE     = 10;

    /// @notice USDC has 6 decimals — amounts throughout are in USDC base units (1 USDC = 1_000_000)
    uint256 public constant USDC_DECIMALS = 6;

    // ==================== STATE VARIABLES ====================

    /// @notice The USDC ERC20 contract used for all payments
    IERC20 public immutable usdc;

    uint256 private _filmCounter        = 1;
    uint256 private _distributorCounter = 1;

    struct Film {
        uint256 filmId;
        string  title;
        address filmmaker;
        string  filmHash;        // IPFS hash of film metadata
        uint256 createdAt;
        bool    approved;
        uint256 totalSalesValue; // in USDC base units
    }

    struct Distributor {
        uint256   distributorId;
        address   walletAddress;
        string    companyName;
        uint256[] heldFilmIds;
        uint256   totalEarnings; // in USDC base units
        uint256   joinedAt;
    }

    struct DDTHolding {
        uint256 filmId;
        uint256 balance;          // DDTs held
        uint256 salesAttributed;  // total sales attributed, in USDC base units
        uint256 earnedAmount;     // total distributor share earned, in USDC base units
    }

    // ==================== MAPPINGS ====================

    mapping(uint256 => Film)        public films;
    mapping(uint256 => Distributor) public distributors;
    mapping(address => uint256)     public addressToDistributorId;

    /// @dev filmId => total USDC revenue accumulated (base units)
    mapping(uint256 => uint256) public filmRevenue;

    /// @dev distributorId => filmId => DDTHolding
    mapping(uint256 => mapping(uint256 => DDTHolding)) public distributorHoldings;

    /// @dev distributorId => filmId => already added to heldFilmIds
    mapping(uint256 => mapping(uint256 => bool)) private _filmInPortfolio;

    /// @dev address => claimable USDC balance (base units)
    mapping(address => uint256) public pendingWithdrawals;

    /// @notice Quiflix treasury wallet
    address public quiflixWallet;

    // ==================== EVENTS ====================

    event FilmRegistered(uint256 indexed filmId, string title, address filmmaker);
    event FilmApproved(uint256 indexed filmId, string title);
    event DistributorRegistered(uint256 indexed distributorId, address wallet, string companyName);
    event DDTAssigned(uint256 indexed filmId, uint256 indexed distributorId, uint256 amount);
    event SaleRecorded(
        uint256 indexed filmId,
        uint256 indexed distributorId,
        uint256 saleAmount,   // USDC base units
        uint256 timestamp
    );
    event RevenueSplit(
        uint256 indexed filmId,
        uint256 indexed distributorId,
        uint256 filmmakerAmount,   // USDC base units
        uint256 distributorAmount, // USDC base units
        uint256 quiflixAmount      // USDC base units
    );
    event EarningsClaimed(address indexed recipient, uint256 amount); // USDC base units
    event QuiflixWalletUpdated(address indexed oldWallet, address indexed newWallet);
    event USDCAddressSet(address indexed usdcAddress);

    // ==================== MODIFIERS ====================

    modifier filmExists(uint256 filmId) {
        require(films[filmId].filmmaker != address(0), "Film does not exist");
        _;
    }

    modifier distributorExists(uint256 distributorId) {
        require(distributors[distributorId].walletAddress != address(0), "Distributor does not exist");
        _;
    }

    // ==================== CONSTRUCTOR ====================

    /**
     * @param _usdcAddress   USDC contract address on the target network
     *                       Mainnet:  0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
     *                       Polygon:  0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
     *                       Arbitrum: 0xaf88d065e77c8cC2239327C5EDb3A432268e5831
     *                       Base:     0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
     * @param _quiflixWallet Treasury address that receives platform fees
     * @param _adminAddress  Initial admin — should be a Gnosis Safe / multi-sig
     */
    constructor(
        address _usdcAddress,
        address _quiflixWallet,
        address _adminAddress
    ) ERC1155("ipfs://QmQuiflix/{id}.json") {
        require(_usdcAddress   != address(0), "Invalid USDC address");
        require(_quiflixWallet != address(0), "Invalid quiflix wallet");
        require(_adminAddress  != address(0), "Invalid admin address");

        usdc          = IERC20(_usdcAddress);
        quiflixWallet = _quiflixWallet;

        _grantRole(DEFAULT_ADMIN_ROLE, _adminAddress);
        _grantRole(ADMIN_ROLE,         _adminAddress);
        _grantRole(PLATFORM_ROLE,      _adminAddress);
        _grantRole(FINANCE_ROLE,       _adminAddress);

        emit USDCAddressSet(_usdcAddress);
    }

    // ==================== FILM MANAGEMENT ====================

    /**
     * @notice Register a new film.
     * @param _title      Film title
     * @param _filmmaker  Filmmaker wallet address
     * @param _filmHash   IPFS hash of film metadata
     */
    function registerFilm(
        string  memory _title,
        address        _filmmaker,
        string  memory _filmHash
    ) external onlyRole(PLATFORM_ROLE) whenNotPaused returns (uint256) {
        require(_filmmaker != address(0), "Invalid filmmaker address");

        uint256 filmId = _filmCounter++;

        films[filmId] = Film({
            filmId:          filmId,
            title:           _title,
            filmmaker:       _filmmaker,
            filmHash:        _filmHash,
            createdAt:       block.timestamp,
            approved:        false,
            totalSalesValue: 0
        });

        emit FilmRegistered(filmId, _title, _filmmaker);
        return filmId;
    }

    /**
     * @notice Approve a film and mint the initial DDT pool to this contract.
     * @param _filmId Film ID to approve
     */
    function approveFilmAndMintDDTs(uint256 _filmId)
        external
        onlyRole(PLATFORM_ROLE)
        whenNotPaused
        filmExists(_filmId)
    {
        require(!films[_filmId].approved, "Film already approved");

        films[_filmId].approved = true;
        _mint(address(this), _filmId, DDT_PER_FILM, "");

        emit FilmApproved(_filmId, films[_filmId].title);
    }

    // ==================== DISTRIBUTOR MANAGEMENT ====================

    /**
     * @notice Register a distributor after off-chain approval.
     * @param _walletAddress Distributor wallet
     * @param _companyName   Company name
     */
    function registerDistributor(
        address        _walletAddress,
        string  memory _companyName
    ) external onlyRole(PLATFORM_ROLE) whenNotPaused returns (uint256) {
        require(_walletAddress != address(0), "Invalid wallet address");
        require(addressToDistributorId[_walletAddress] == 0, "Distributor already registered");

        uint256 distributorId = _distributorCounter++;

        distributors[distributorId] = Distributor({
            distributorId:  distributorId,
            walletAddress:  _walletAddress,
            companyName:    _companyName,
            heldFilmIds:    new uint256[](0),
            totalEarnings:  0,
            joinedAt:       block.timestamp
        });

        addressToDistributorId[_walletAddress] = distributorId;

        emit DistributorRegistered(distributorId, _walletAddress, _companyName);
        return distributorId;
    }

    /**
     * @notice Assign 1 DDT to an approved distributor for a specific film.
     * @param _filmId        Film ID
     * @param _distributorId Distributor ID
     */
    function assignDDTToDistributor(uint256 _filmId, uint256 _distributorId)
        external
        onlyRole(PLATFORM_ROLE)
        whenNotPaused
        filmExists(_filmId)
        distributorExists(_distributorId)
    {
        require(films[_filmId].approved, "Film must be approved first");
        require(
            balanceOf(address(this), _filmId) >= 1,
            "No DDTs remaining for this film"
        );

        address distributorWallet = distributors[_distributorId].walletAddress;
        _safeTransferFrom(address(this), distributorWallet, _filmId, 1, "");

        if (!_filmInPortfolio[_distributorId][_filmId]) {
            _filmInPortfolio[_distributorId][_filmId] = true;
            distributors[_distributorId].heldFilmIds.push(_filmId);
        }

        distributorHoldings[_distributorId][_filmId].balance += 1;
        distributorHoldings[_distributorId][_filmId].filmId   = _filmId;

        emit DDTAssigned(_filmId, _distributorId, 1);
    }

    // ==================== SALES & REVENUE ====================

    /**
     * @notice Record a sale and allocate USDC revenue to claimable balances.
     *
     * @dev IMPORTANT — caller must approve this contract to spend `_saleAmount`
     *      USDC before calling this function:
     *
     *        usdc.approve(address(quiflixDDT), _saleAmount);
     *
     *      The FINANCE_ROLE backend wallet holds the USDC collected from the
     *      Web2 payment layer and calls this function to settle on-chain.
     *
     *      Revenue is split as:
     *        Filmmaker:   70%
     *        Distributor: 20%
     *        Quiflix:     10% + any rounding remainder
     *
     * @param _filmId        Film ID
     * @param _distributorId Distributor ID
     * @param _saleAmount    Sale amount in USDC base units (1 USDC = 1_000_000)
     */
    function recordSaleAndDistributeRevenue(
        uint256 _filmId,
        uint256 _distributorId,
        uint256 _saleAmount
    )
        external
        onlyRole(FINANCE_ROLE)
        whenNotPaused
        filmExists(_filmId)
        distributorExists(_distributorId)
        nonReentrant
    {
        require(
            distributorHoldings[_distributorId][_filmId].balance > 0,
            "Distributor holds no DDTs for this film"
        );
        require(_saleAmount > 0, "Sale amount must be > 0");

        // Pull USDC from the FINANCE_ROLE caller into this contract
        usdc.safeTransferFrom(msg.sender, address(this), _saleAmount);

        // Calculate splits; remainder goes to Quiflix (no stranded wei)
        uint256 filmmakerShare   = (_saleAmount * FILMMAKER_PERCENTAGE)   / 100;
        uint256 distributorShare = (_saleAmount * DISTRIBUTOR_PERCENTAGE) / 100;
        uint256 quiflixShare     = _saleAmount - filmmakerShare - distributorShare;

        // Update accounting
        films[_filmId].totalSalesValue                                += _saleAmount;
        filmRevenue[_filmId]                                          += _saleAmount;
        distributorHoldings[_distributorId][_filmId].salesAttributed += _saleAmount;
        distributorHoldings[_distributorId][_filmId].earnedAmount    += distributorShare;
        distributors[_distributorId].totalEarnings                   += distributorShare;

        // Credit pull-payment balances in USDC
        address filmmaker         = films[_filmId].filmmaker;
        address distributorWallet = distributors[_distributorId].walletAddress;

        pendingWithdrawals[filmmaker]         += filmmakerShare;
        pendingWithdrawals[distributorWallet] += distributorShare;
        pendingWithdrawals[quiflixWallet]     += quiflixShare;

        emit SaleRecorded(_filmId, _distributorId, _saleAmount, block.timestamp);
        emit RevenueSplit(_filmId, _distributorId, filmmakerShare, distributorShare, quiflixShare);
    }

    /**
     * @notice Claim all pending USDC earnings for the caller.
     * @dev Pull-payment pattern. Balance zeroed before transfer to prevent reentrancy.
     */
    function claimEarnings() external nonReentrant whenNotPaused {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "Nothing to claim");

        pendingWithdrawals[msg.sender] = 0;

        usdc.safeTransfer(msg.sender, amount);

        emit EarningsClaimed(msg.sender, amount);
    }

    // ==================== VIEW FUNCTIONS ====================

    function getFilmsCount() external view returns (uint256) {
        return _filmCounter - 1;
    }

    function getFilm(uint256 _filmId) external view returns (Film memory) {
        return films[_filmId];
    }

    function getDistributor(uint256 _distributorId) external view returns (Distributor memory) {
        return distributors[_distributorId];
    }

    function getDistributorByAddress(address _wallet) external view returns (Distributor memory) {
        uint256 distributorId = addressToDistributorId[_wallet];
        return distributors[distributorId];
    }

    function getDistributorHoldings(uint256 _distributorId, uint256 _filmId)
        external
        view
        returns (DDTHolding memory)
    {
        return distributorHoldings[_distributorId][_filmId];
    }

    function getDistributorFilms(uint256 _distributorId) external view returns (uint256[] memory) {
        return distributors[_distributorId].heldFilmIds;
    }

    function getFilmRevenue(uint256 _filmId) external view returns (uint256) {
        return filmRevenue[_filmId];
    }

    /// @notice Returns how many DDTs are still unassigned for a film
    function getRemainingDDTs(uint256 _filmId) external view returns (uint256) {
        return balanceOf(address(this), _filmId);
    }

    /// @notice Convenience: returns pending USDC claimable by an address (base units)
    function getPendingEarnings(address _wallet) external view returns (uint256) {
        return pendingWithdrawals[_wallet];
    }

    // ==================== ADMIN FUNCTIONS ====================

    /**
     * @notice Update the Quiflix treasury wallet.
     * @dev Call claimEarnings() from the old wallet before updating to avoid
     *      losing access to any pending balance still mapped to it.
     */
    function setQuiflixWallet(address _newWallet) external onlyRole(ADMIN_ROLE) {
        require(_newWallet != address(0), "Invalid address");
        emit QuiflixWalletUpdated(quiflixWallet, _newWallet);
        quiflixWallet = _newWallet;
    }

    function pause()   external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    // ==================== OVERRIDES ====================

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override whenNotPaused {
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}