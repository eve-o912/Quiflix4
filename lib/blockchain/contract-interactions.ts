import { ethers, providers } from 'ethers';
import QuiflixDDTABI from '@/contracts/QuiflixDDT.json';

// Contract configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_QUIFLIX_DDT_ADDRESS || '';
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || '';

export class QuiflixContract {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(signer: ethers.Signer) {
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }
    
    this.signer = signer;
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, QuiflixDDTABI.abi, signer);
  }

  /**
   * Register a new film on-chain
   */
  async registerFilm(
    title: string,
    filmmakerAddress: string,
    filmHash: string
  ): Promise<{ filmId: number; transactionHash: string }> {
    try {
      const tx = await this.contract.registerFilm(title, filmmakerAddress, filmHash);
      const receipt = await tx.wait();
      
      // Find FilmRegistered event to get filmId
      const event = receipt?.logs.find((log: any) => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed?.name === 'FilmRegistered';
        } catch {
          return false;
        }
      });

      const filmId = event ? Number(event.args[0]) : 0;
      
      return {
        filmId,
        transactionHash: tx.hash,
      };
    } catch (error) {
      console.error('Failed to register film:', error);
      throw error;
    }
  }

  /**
   * Approve a film and mint 500 DDTs
   */
  async approveFilmAndMintDDTs(filmId: number): Promise<string> {
    try {
      const tx = await this.contract.approveFilmAndMintDDTs(filmId);
      const receipt = await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to approve film and mint DDTs:', error);
      throw error;
    }
  }

  /**
   * Register a distributor
   */
  async registerDistributor(
    walletAddress: string,
    companyName: string
  ): Promise<{ distributorId: number; transactionHash: string }> {
    try {
      const tx = await this.contract.registerDistributor(walletAddress, companyName);
      const receipt = await tx.wait();
      
      // Find the DistributorRegistered event to get the distributorId
      const event = receipt?.logs.find((log: any) => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed?.name === 'DistributorRegistered';
        } catch {
          return false;
        }
      });

      const distributorId = event ? Number(event.args[0]) : 0;
      
      return {
        distributorId,
        transactionHash: tx.hash,
      };
    } catch (error) {
      console.error('Failed to register distributor:', error);
      throw error;
    }
  }

  /**
   * Assign 1 DDT to a distributor for a specific film
   */
  async assignDDTToDistributor(
    filmId: number,
    distributorId: number
  ): Promise<string> {
    try {
      const tx = await this.contract.assignDDTToDistributor(filmId, distributorId);
      const receipt = await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to assign DDT to distributor:', error);
      throw error;
    }
  }

  /**
   * Record a sale and distribute revenue
   */
  async recordSaleAndDistributeRevenue(
    filmId: number,
    distributorId: number,
    saleAmount: string
  ): Promise<string> {
    try {
      // Convert USD amount to stablecoin units (USDC/USDT have 6 decimals)
      const amountInStablecoin = ethers.utils.parseUnits(saleAmount, 6);
      const tx = await this.contract.recordSaleAndDistributeRevenue(
        filmId,
        distributorId,
        amountInStablecoin
      );
      const receipt = await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to record sale:', error);
      throw error;
    }
  }

  /**
   * Get film details
   */
  async getFilm(filmId: number) {
    try {
      const film = await this.contract.getFilm(filmId);
      return film;
    } catch (error) {
      console.error('Failed to get film details:', error);
      throw error;
    }
  }

  /**
   * Get distributor details
   */
  async getDistributor(distributorId: number) {
    try {
      const distributor = await this.contract.getDistributor(distributorId);
      return distributor;
    } catch (error) {
      console.error('Failed to get distributor details:', error);
      throw error;
    }
  }

  /**
   * Get distributor by wallet address
   */
  async getDistributorByAddress(walletAddress: string) {
    try {
      const distributor = await this.contract.getDistributorByAddress(walletAddress);
      return distributor;
    } catch (error) {
      console.error('Failed to get distributor by address:', error);
      throw error;
    }
  }

  /**
   * Get distributor holdings for a specific film
   */
  async getDistributorHoldings(distributorId: number, filmId: number) {
    try {
      const holdings = await this.contract.getDistributorHoldings(distributorId, filmId);
      return holdings;
    } catch (error) {
      console.error('Failed to get distributor holdings:', error);
      throw error;
    }
  }

  /**
   * Get all films a distributor holds DDTs for
   */
  async getDistributorFilms(distributorId: number) {
    try {
      const filmIds = await this.contract.getDistributorFilms(distributorId);
      return filmIds;
    } catch (error) {
      console.error('Failed to get distributor films:', error);
      throw error;
    }
  }

  /**
   * Get revenue for a film
   */
  async getFilmRevenue(filmId: number) {
    try {
      const revenue = await this.contract.getFilmRevenue(filmId);
      // Convert from stablecoin units (6 decimals) back to USD
      return ethers.utils.formatUnits(revenue, 6);
    } catch (error) {
      console.error('Failed to get film revenue:', error);
      throw error;
    }
  }

  /**
   * Get total films count
   */
  async getFilmsCount(): Promise<number> {
    try {
      const count = await this.contract.getFilmsCount();
      return Number(count);
    } catch (error) {
      console.error('Failed to get films count:', error);
      throw error;
    }
  }
}

/**
 * Create a contract instance with a provider
 */
export async function createContractInstance(): Promise<QuiflixContract> {
  if (!RPC_URL) {
    throw new Error('RPC URL not configured');
  }

  const provider = new providers.JsonRpcProvider(RPC_URL);
  
  // For server-side operations, use a private key from environment
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Private key not configured for server operations');
  }
  
  const signer = new ethers.Wallet(privateKey, provider);
  
  return new QuiflixContract(signer);
}

/**
 * Create a read-only contract instance
 */
export function createReadOnlyContractInstance() {
  if (!RPC_URL) {
    throw new Error('RPC URL not configured');
  }

  const provider = new providers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, QuiflixDDTABI.abi, provider);
  
  return contract;
}
