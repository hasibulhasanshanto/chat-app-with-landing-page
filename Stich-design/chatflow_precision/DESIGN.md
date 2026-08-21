---
name: ChatFlow Precision
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#464555'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is rooted in a **Minimalist / Modern SaaS** aesthetic. It prioritizes clarity, speed, and focus, ensuring that the interface recedes to let user conversations take center stage. The visual language evokes a sense of high-performance reliability through generous whitespace, precise alignment, and a sophisticated color palette.

The target audience consists of professionals and teams who value efficiency and a clutter-free environment. The emotional response is one of calm productivity—reducing the cognitive load often associated with dense messaging platforms.

## Colors
This design system utilizes a high-clarity light mode base. 
- **Primary Indigo (#4F46E5):** Used for primary actions, active navigation states, and sender message bubbles.
- **Surface Neutrals:** Use `#FFFFFF` for the primary content area (message thread) and `#F8F9FA` for secondary surfaces like sidebars and search bars to create subtle structural contrast.
- **Interaction States:** Hover states on neutral elements should use a subtle grey tint (`#F3F4F6`), while primary elements use a localized overlay. Focus states must always use a 2px offset ring of the primary indigo.
- **Status Indicators:** The "Online" status uses a vibrant green, specifically tuned for legibility against both white and light-grey backgrounds.

## Typography
The system relies on **Inter** to provide a systematic, utilitarian feel that remains highly readable at small sizes. 
- **Hierarchy:** Use `700` weight for primary headings and `600` for names in contact lists to ensure immediate scannability. 
- **Message Text:** All primary chat text uses `body-lg` for readability. 
- **Metadata:** Timestamps and status text use `label-sm` with a medium-gray color (#6B7280).
- **Letter Spacing:** Larger headlines use negative tracking to maintain a tight, premium editorial feel.

## Layout & Spacing
The design system employs a **Fixed-Fluid Hybrid** model.
- **Sidebar:** Fixed width of 320px for high-density contact navigation.
- **Main Content:** Fluid width with a max-content constraint of 1200px for optimal line length in conversations.
- **Grid:** Use an 8px base grid. Message bubbles should have 12px internal padding and 8px vertical spacing between consecutive messages from the same sender, increasing to 16px when the sender changes.
- **Responsive:** On mobile, the sidebar transitions to a bottom-sheet or a full-screen overlay, and horizontal margins shrink to 16px.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Subtle Shadows** rather than heavy gradients.
- **Level 0 (Base):** Primary background (#FFFFFF).
- **Level 1 (Sub-surface):** Sidebar and secondary panels (#F8F9FA).
- **Level 2 (Floating):** Popovers, dropdowns, and cards use a soft shadow: `0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.03)`.
- **Outlines:** Use a 1px border of `#E5E7EB` for all input fields and container separations to maintain a crisp, structured appearance.

## Shapes
The shape language is "Rounded-Soft."
- **Containers/Cards:** 12px (`1rem`) corner radius to soften the professional aesthetic.
- **Message Bubbles:** 12px radius, but the "tail" corner (bottom-right for sender, bottom-left for receiver) is reduced to 4px to indicate directionality.
- **Avatars:** Strictly 100% circular (pill-shaped) to provide a distinct organic contrast against the geometric UI.
- **Inputs:** 8px radius for a focused, modern tool look.

## Components
- **Avatars:** Must include a 2px white border (stroke) when overlapping or when the online status badge is present. The status badge is positioned at the bottom-right (4 o'clock position).
- **Message Bubbles:**
    - *Sender:* Primary Indigo background, White text.
    - *Receiver:* Neutral Gray (#F3F4F6) background, Dark Gray (#1F2937) text.
- **Search Inputs:** Should feature a left-aligned magnifying glass icon in `#9CA3AF`. The background should be `#F3F4F6` with no border until focused, at which point it transitions to `#FFFFFF` with a primary indigo border.
- **List Items (Contacts):** 16px padding. Active state uses a 2px vertical "indicator" bar on the far left in Primary Indigo.
- **Buttons:** Primary buttons use a solid indigo fill. Secondary buttons use a ghost style (transparent fill, indigo border/text) to maintain the minimal aesthetic.
- **Scrollbars:** Custom thin-width (6px) scrollbars with `#E5E7EB` tracks and `#D1D5DB` thumbs to avoid visual clutter in long chat threads.