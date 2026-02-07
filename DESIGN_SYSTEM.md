# Quiflix Design System

## Philosophy
Quiflix uses a **premium, cinematic aesthetic** inspired by Netflix, Vimeo, and FilmHub. The design prioritizes visual hierarchy, smooth interactions, and a dark, immersive experience suitable for a film marketplace.

---

## Color Palette

### Primary Colors
- **Primary**: `oklch(0.65 0.32 38)` - Deep Red/Warm Accent
  - Used for CTAs, interactive elements, key highlights
  - Evokes cinema and film production
  - RGB Equivalent: ~E63946

- **Accent**: `oklch(0.72 0.28 28)` - Orange/Amber
  - Used for secondary actions and hover states
  - Creates warm, inviting feel
  - RGB Equivalent: ~F4A261

### Neutral Colors (Dark Mode Default)
- **Background**: `oklch(0.06 0 0)` - Deep Black (nearly pure black)
  - Similar to Netflix dark mode
  - Reduces eye strain for video content
  
- **Card**: `oklch(0.09 0 0)` - Very Dark Gray
  - Provides subtle contrast from background
  - Used for cards, containers, modals
  
- **Foreground**: `oklch(0.99 0 0)` - White/Off-white
  - Primary text color
  - High contrast for readability

- **Muted Foreground**: `oklch(0.65 0 0)` - Medium Gray
  - Secondary text, descriptions
  - Less prominent information

- **Border**: `oklch(0.14 0 0)` - Dark Gray
  - Subtle borders between elements
  - Used sparingly to maintain dark aesthetic

### Semantic Colors
- **Destructive**: Red (oklch(0.577 0.245 27.325))
  - Errors, deletions, warnings
  - High contrast for critical actions

---

## Typography

### Font Stack
- **Sans Serif (Body)**: Geist, Geist Fallback
- **Monospace (Code)**: Geist Mono, Geist Mono Fallback

### Type Scale
```
H1: 3.5rem / 56px  (text-5xl)   - Page titles
H2: 2rem / 32px    (text-2xl)   - Section headers
H3: 1.5rem / 24px  (text-xl)    - Subsections
H4: 1.25rem / 20px (text-lg)    - Card titles
Body: 1rem / 16px  (text-base)  - Standard text
Small: 0.875rem / 14px (text-sm) - Secondary info
```

### Typography Best Practices
- Use `font-bold` for emphasis
- Use `tracking-tight` for large headlines
- Use `text-balance` for optimal line breaks
- Apply `text-pretty` for body text
- Line height: 1.4-1.6 (`leading-relaxed`)

---

## Component Styling

### Buttons
- **Primary Button**: Red background, white text
  - Hover: Slightly darker red
  - Focus: Ring outline with primary color
  
- **Secondary Button**: Outline style
  - Border: `border-border`
  - Hover: Background color slightly changed

### Cards
- **Background**: Card color (oklch(0.09 0 0))
- **Border**: Subtle border (oklch(0.14 0 0))
- **Border Radius**: 0.625rem (sm rounded)
- **Hover**: Light shadow lift effect
- **Padding**: 24px (p-6) standard

### Role Selection Cards (New)
- **Unique Features**:
  - Gradient background overlay on hover
  - Icon display (emojis)
  - Smooth transitions (300ms)
  - Shimmer effect during loading
  - Arrow indicator that translates on hover

### Inputs
- **Background**: Input color (oklch(0.09 0 0))
- **Border**: Border color (oklch(0.14 0 0))
- **Focus**: Ring with primary color
- **Placeholder**: Muted foreground color

---

## Animations

### Utility Classes
- `.animate-fadeIn` - Fade in effect (600ms)
- `.animate-slideUp` - Slide up from bottom (500ms)
- `.animate-slideDown` - Slide down from top (500ms)
- `.animate-slideIn` - Slide in from left (500ms)
- `.animate-pulse-glow` - Pulsing glow effect
- `.animate-shimmer` - Shimmer effect
- `.animate-float` - Floating animation
- `.animate-glow` - Text glow effect
- `.animate-spin-slow` - Slow rotation

### Transition Properties
- Use `transition-all` for general elements
- Use `duration-300` for most interactions
- Use `duration-500` for page transitions
- Use `ease-out` for entrance animations
- Use `ease-in-out` for continuous animations

---

## Spacing

### Spacing Scale
```
2px   -> gap-0.5, px-0.5
4px   -> gap-1, px-1
6px   -> gap-1.5, px-1.5
8px   -> gap-2, px-2
12px  -> gap-3, px-3
16px  -> gap-4, px-4
24px  -> gap-6, px-6
32px  -> gap-8, px-8
48px  -> gap-12, px-12
64px  -> gap-16, px-16
```

### Layout Patterns
- **Horizontal spacing**: Use `gap-x-*` classes
- **Vertical spacing**: Use `gap-y-*` or `space-y-*`
- **Equal spacing**: Use `gap-*` directly
- **Card padding**: Standard `p-6`
- **Section padding**: `px-6 py-8` or `px-4 py-6` mobile

---

## Responsive Design

### Breakpoints (Tailwind Standard)
- **Mobile First**: Design for 320px up
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Responsive Patterns in Quiflix
```tsx
// Grid example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Typography example
<h1 className="text-3xl md:text-4xl lg:text-5xl">

// Spacing example
<div className="px-4 md:px-6 lg:px-8">
```

---

## Accessibility

### ARIA Labels
- All interactive elements must have descriptive labels
- Use `aria-label` for icon-only buttons
- Use `aria-describedby` for complex descriptions
- Use `role="status"` for dynamic content

### Screen Reader Text
```tsx
<span className="sr-only">Additional information for screen readers</span>
```

### Keyboard Navigation
- All buttons and links must be keyboard accessible
- Tab order should follow logical flow
- Focus indicators must be visible
- Avoid `pointer-events-none` on interactive elements

### Color Contrast
- Minimum WCAG AA: 4.5:1 for text
- Minimum WCAG AAA: 7:1 for text
- Primary (red) text on dark background: Passes
- Secondary (orange) text on dark background: Passes

---

## Dark Mode (Default)

Quiflix operates in **dark mode by default**. Light mode support can be added but is not priority.

### Dark Mode Variables
```css
.dark {
  --background: oklch(0.06 0 0);      /* Deep black */
  --card: oklch(0.09 0 0);            /* Dark gray */
  --foreground: oklch(0.99 0 0);      /* White */
  --primary: oklch(0.65 0.32 38);     /* Red accent */
  --accent: oklch(0.72 0.28 28);      /* Orange accent */
}
```

---

## Component Library Usage

### Shadcn/UI Components
We use Shadcn/UI for consistent, accessible components:

- `Button` - For all clickable actions
- `Card` - For content containers
- `Input` - For text inputs
- `Select` - For dropdowns
- `Dialog` - For modals
- `Tabs` - For tabbed content
- `Dropdown Menu` - For action menus

All components are customized with the color tokens above.

---

## Gradient Usage

### When to Use Gradients
- Background accents in hero sections
- Hover effects on important buttons
- Text gradients for emphasis (rare)
- Background overlays (subtle)

### Gradient Examples
```tsx
// Text gradient
<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
  Quiflix
</h1>

// Background gradient
<div className="bg-gradient-to-br from-background via-background to-card opacity-40" />

// Button gradient
<button className="bg-gradient-to-r from-primary to-primary/90">
```

---

## Loading States

### Spinner
```tsx
<Loader className="h-8 w-8 animate-spin text-primary" />
```

### Shimmer Overlay
```tsx
<div className="animate-shimmer" />
```

### Loading Text
```tsx
{loading ? 'Loading...' : 'Ready'}
```

---

## Example Components Using This System

### Role Selection Card
```tsx
<button className="group relative">
  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
  
  <div className="relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
    <div className="text-5xl mb-4">🎬</div>
    <h3 className="text-xl font-bold text-foreground">Filmmaker</h3>
    <p className="text-sm text-muted-foreground">Share your films...</p>
  </div>
</button>
```

### Hero Section
```tsx
<div className="bg-gradient-to-br from-background via-background to-card opacity-40">
  <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
    Welcome to Quiflix
  </h1>
</div>
```

---

## Future Enhancements

- [ ] Light mode support
- [ ] Cinematic loading screens
- [ ] Advanced animations (Framer Motion)
- [ ] Custom video player styling
- [ ] Film thumbnail animations
- [ ] Category/genre visual design
- [ ] Creator profile designs
- [ ] Advanced filter UI

---

## Resources

- **Color Generator**: https://oklch.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Shadcn/UI**: https://ui.shadcn.com/
- **Netflix Design**: Analyzed for dark mode & typography
- **Vimeo Design**: Analyzed for minimalism
- **FilmHub Design**: Analyzed for marketplace layout

---

