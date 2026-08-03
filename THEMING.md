# RubyPlayer Theming Guide

Welcome to the **RubyPlayer Modular Theme System**! 🎨

RubyPlayer features a modular, extensible theme system built into `src/themes/`. Themes are self-contained ES modules that can customize accent colors, global CSS styles, custom vinyl record center labels, animated background components, and theme-specific options.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Quick Start: Creating a New Theme](#quick-start-creating-a-new-theme)
3. [Theme Module Schema](#theme-module-schema)
4. [Advanced Features](#advanced-features)
   - [CSS Custom Properties (Layer 1)](#1-css-custom-properties-layer-1)
   - [Injected CSS Overrides (Layer 2)](#2-injected-css-overrides-layer-2)
   - [Custom Animated Background Components](#3-custom-animated-background-components)
   - [Vinyl Record Center Labels](#4-vinyl-record-center-labels)
   - [Theme Options & Toggles](#5-theme-options--toggles)
5. [Complete Theme Example](#complete-theme-example)
6. [Future Roadmap: Per-Song Reactive Themes](#future-roadmap-per-song-reactive-themes)

---

## Architecture Overview

Themes live in subdirectories under **`src/themes/`**:

```text
src/themes/
├── rainbow/
│   └── index.js
├── retro/
│   └── index.js
├── sakura/
│   ├── index.js
│   └── Background.jsx
├── adaptive/
│   └── index.js
└── my-custom-theme/      <-- Add your new theme folder here!
    ├── index.js
    └── Background.jsx    (optional)
```

At build/dev time, Vite automatically discovers all theme modules via `import.meta.glob('../themes/*/index.js')`. 

> **Zero Configuration Required**: Simply create a folder with an `index.js` file inside `src/themes/`, restart the dev server (`npm run dev`), and your theme will appear in the **Theme Personalization** modal!

---

## Quick Start: Creating a New Theme

To create a new theme named **"Cyber Neon"**:

### Step 1: Create a Theme Folder
Create `src/themes/cyber-neon/index.js`.

### Step 2: Write the Theme Definition
Add the following content to `src/themes/cyber-neon/index.js`:

```javascript
import { Zap } from 'lucide-react';

export default {
  id: 'cyber-neon',
  name: 'Cyber Neon ⚡',
  Icon: Zap,
  previewGradient: 'linear-gradient(135deg, #00f2fe, #4facfe, #6b11ff)',
  previewTextColor: '#ffffff',
  bodyClass: 'theme-cyber-neon',

  vars: {
    '--accent-ruby': '#00f2fe',
    '--accent-ruby-dark': '#00a8b3',
    '--accent-ruby-glow': 'rgba(0, 242, 254, 0.65)',
    '--accent-ruby-bg-glow': 'rgba(0, 242, 254, 0.15)',
    '--border-glow': 'rgba(0, 242, 254, 0.4)',
    '--shadow-ruby': '0 0 30px rgba(0, 242, 254, 0.45)',
  },

  css: `
    body.theme-cyber-neon {
      background-color: #050714 !important;
    }
  `,

  vinylLabel: null,
  Background: null,
  options: [],
};
```

---

## Theme Module Schema

Every theme exports a default object with the following properties:

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (e.g., `'sakura'`, `'retro'`). Used in state and `localStorage`. |
| `name` | `string` | Display name shown in the Theme Personalization UI. |
| `Icon` | `LucideIcon` | A React component from `lucide-react` rendered on the theme button. |
| `previewGradient` | `string` | CSS gradient string used for the theme swatch in settings. |
| `previewTextColor` | `string` | Text color overlaid on the swatch button (e.g. `#ffffff` or `#000000`). |
| `bodyClass` | `string` | Class added to `<body>` when theme is active (e.g., `'theme-sakura'`). |
| `vars` | `object` | Dictionary of CSS custom properties applied to `:root`. |
| `css` | `string` | Raw CSS injected into `<style id="ruby-theme-override">` when active. |
| `vinylLabel` | `object \| null` | Fixed vinyl record center label configuration object. |
| `getDynamicVinylLabel` | `function \| null` | Function `(track) => labelObject \| null` for per-track dynamic labels. |
| `Background` | `function \| null` | Lazy import factory: `() => import('./Background.jsx')`. |
| `options` | `array` | Array of configurable option objects for this theme. |
| `type` | `string` | Special engine type (e.g. `'animated'` for Rainbow, `'adaptive'` for cover-art extraction). |

---

## Advanced Features

### 1. CSS Custom Properties (Layer 1)
The player relies on standard CSS variables defined in `:root`. Your theme can override any of these in `vars`:

- `--accent-ruby`: Primary accent color (buttons, active track highlights, visualizers).
- `--accent-ruby-dark`: Darker shade for pressed states and borders.
- `--accent-ruby-glow`: Semi-transparent box-shadow and text-shadow glow color.
- `--accent-ruby-bg-glow`: Soft background glow color for container highlights.
- `--border-glow`: Border glow for active cards and vinyl outer ring.
- `--shadow-ruby`: Main glow shadow string.
- `--bg-primary`: Application background color.
- `--text-primary`: Primary text color.

### 2. Injected CSS Overrides (Layer 2)
For deep component styling that CSS variables alone cannot cover (e.g., glassmorphism panels, card background gradients, custom hover styles), provide a CSS string in the `css` field.

`themeService` automatically injects this string into a `<style id="ruby-theme-override">` element in `<head>` when your theme is selected, and removes it cleanly when switching themes.

### 3. Custom Animated Background Components
Themes can include React components for full-screen visual effects (e.g., falling Sakura petals, floating snow, stars, or matrix rain).

1. Create `Background.jsx` in your theme directory:
   ```jsx
   import React from 'react';

   export default function MyBackground() {
     return (
       <div className="my-custom-canvas" style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
         {/* Animated SVG / Canvas elements */}
       </div>
     );
   }
   ```
2. Reference it lazily in `index.js`:
   ```javascript
   Background: () => import('./Background.jsx'),
   ```
Vite automatically code-splits the background component so it only loads into browser memory when your theme is active!

### 4. Vinyl Record Center Labels
By default (`vinylLabel: null`), the vinyl record displays the song's album cover art. You can customize the vinyl center label:

#### Fixed Vinyl Label:
```javascript
vinylLabel: {
  name: 'Custom Theme Label',
  background: 'radial-gradient(circle at 38% 35%, #ffb7c5 0%, #f472b6 100%)',
  textColor: '#2d0c1e',
  subtextColor: 'rgba(45, 12, 30, 0.85)',
  dividerColor: 'rgba(45, 12, 30, 0.4)',
  spindleBg: '#180712',
  spindleBorder: 'rgba(255, 183, 197, 0.6)',
}
```

#### Dynamic / Per-Track Vinyl Label:
```javascript
getDynamicVinylLabel: (track) => { }
```

### 5. Theme Options & Toggles
Themes can expose custom user toggles in the Theme Personalization dialog.

Declare option objects in `options`:
```javascript
options: [
  {
    id: 'enableParticles',
    label: 'Enable Particle Sparkles',
    description: 'Renders additional particle effects in the background.',
  },
]
```

Access the option value inside your theme or background component using `getSavedThemeOption`:
```javascript
import { getSavedThemeOption } from '../../services/themeService';

const isParticlesOn = getSavedThemeOption('my-theme-id', 'enableParticles', true);
```

---

## Complete Theme Example

Here is a complete example of an **"Autumn Leaves 🍂"** theme with animated falling leaves and a toggle option:

`src/themes/autumn/index.js`:
```javascript
import { Leaf } from 'lucide-react';
import { getSavedThemeOption } from '../../services/themeService';

export default {
  id: 'autumn',
  name: 'Autumn Leaves 🍂',
  Icon: Leaf,
  previewGradient: 'linear-gradient(135deg, #3a1c02, #b84c0b, #dd6b20, #271201)',
  previewTextColor: '#ffffff',
  bodyClass: 'theme-autumn',
  vars: {
    '--accent-ruby': '#dd6b20',
    '--accent-ruby-dark': '#9c3f04',
    '--accent-ruby-glow': 'rgba(221, 107, 32, 0.6)',
    '--accent-ruby-bg-glow': 'rgba(221, 107, 32, 0.15)',
    '--border-glow': 'rgba(221, 107, 32, 0.4)',
    '--shadow-ruby': '0 0 28px rgba(221, 107, 32, 0.4)',
    '--bg-primary': '#160b03',
  },
  css: `
    body.theme-autumn .navbar {
      background: rgba(26, 12, 3, 0.88) !important;
    }
  `,
  vinylLabel: null,
  getDynamicVinylLabel: () => {
    const isRetroLabel = getSavedThemeOption('autumn', 'retroLabel', false);
    if (isRetroLabel) {
      return {
        name: 'Autumn Oak',
        background: 'radial-gradient(circle, #dd6b20 0%, #7c3104 100%)',
        textColor: '#fff5ea',
        subtextColor: 'rgba(255,245,234,0.8)',
        dividerColor: 'rgba(255,245,234,0.4)',
        spindleBg: '#1c0800',
        spindleBorder: 'rgba(255,180,120,0.5)',
      };
    }
    return null;
  },
  Background: () => import('./Background.jsx'),
  options: [
    {
      id: 'retroLabel',
      label: 'Use Autumn Vinyl Label',
      description: 'Displays custom autumn vinyl center label instead of cover art.',
    },
  ],
};
```

---

## Future Roadmap: Per-Song Reactive Themes

The modular `src/themes/` system lays the foundation for **song-triggered reactive themes** (e.g. Halloween theme for horror soundtracks, Snowflake theme for winter songs, Sakura theme for lo-fi tracks).

To activate a theme programmatically for a specific song:
```javascript
import { applyTheme } from './services/themeService';

if (track.reactiveTheme) {
  applyTheme(track.reactiveTheme, track);
}
```
