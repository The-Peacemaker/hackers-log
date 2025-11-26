# 🖥️ Benedii's Hacker Blog - Terminal UI

A hacker-themed blog/portfolio built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Features a retro terminal interface with multiple themes, Matrix rain effects, and interactive command-line interface.

## ✨ Features

- 🎨 **4 Themes**: GitHub (default), Dracula, Gruvbox, and Hacker
- ⌨️ **Interactive CLI**: Command bar with built-in commands
- 🔑 **Arrow Key Navigation**: Navigate blog posts like a file manager
- 💻 **Terminal UI**: Complete TUI experience with file list and preview pane
- 🎬 **Matrix Rain Effect**: Toggleable Matrix-style falling code animation
- ⚡ **Fast & Modern**: Built on Next.js 14 with SSR and optimal performance
- 📱 **Responsive Design**: Works on all screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Commands

Type these commands in the command bar at the bottom:

- `help` - Show available commands
- `theme [name]` - Switch themes (dracula, gruvbox, hacker, github)
- `matrix` - Toggle Matrix rain effect
- `music` - Toggle background music loop
- `go dark` - Activate the hidden hacker protocol (Glitch + Matrix + Hacker theme)
- `whoami` - Display current user
- `hack [target]` - Simulate a hack sequence (just for fun!)
- `sudo` - Try it and see 😉

## ⌨️ Keyboard Shortcuts

- **Arrow Up/Down** - Navigate through blog posts
- **Enter** (when not in command bar) - Focus command input
- **Click anywhere** - Focus command input

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles and theme variables
│   ├── layout.tsx           # Root layout with ThemeProvider
│   └── page.tsx             # Main page component
├── components/
│   ├── CommandBar.tsx       # Interactive command-line interface
│   ├── FileList.tsx         # Left sidebar file navigator
│   ├── MatrixRain.tsx       # Matrix falling code effect
│   ├── PreviewPane.tsx      # Right content preview area
│   ├── TerminalWindow.tsx   # Main terminal container
│   ├── ThemeProvider.tsx    # Theme context and state management
│   └── TopBar.tsx           # Terminal window title bar
├── lib/
│   └── fileSystem.ts        # Blog posts data structure
├── types/
│   └── index.ts             # TypeScript type definitions
└── package.json
```

## 🎨 Customization

### Adding New Blog Posts

Edit `lib/fileSystem.ts` and add new entries:

```typescript
{
  id: 'your-post-id',
  name: '04_your_post.md',
  type: 'md', // or 'file', 'dir', 'link'
  content: `
    <h1>Your Post Title</h1>
    <span class="tag">YOUR_TAG</span>
    <p>Your content here...</p>
  `
}
```

### Changing Themes

Themes are defined in `app/globals.css` using CSS custom properties. You can modify existing themes or add new ones.

### Modifying Commands

Edit `components/CommandBar.tsx` to add new commands in the `handleCommand` function.

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 🚢 Deployment

This Next.js app can be deployed to:

- **Vercel** (Recommended - Zero config)
- **Netlify**
- **AWS Amplify**
- **Docker Container**
- Any Node.js hosting platform

### Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

## 🎯 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Font**: JetBrains Mono
- **Content**: HTML/MDX support ready

## 📝 License

MIT License - Feel free to use this for your own portfolio!

## 🙌 Credits

Created by Benedii (@benedii)

---

**root@benedict:~$ █**
