# Next.js 15 Cache Corruption - Complete Fix Guide

## 🧹 Nuclear Clean Script (Save This!)

Create this script in your project root as `clean.sh`:

```bash
#!/bin/bash
echo "🧹 Nuclear cleaning Next.js 15 caches..."

# Stop any running processes
pkill -f "next dev" || true

# Remove all cache directories
rm -rf .next
rm -rf .turbo
rm -rf .vercel
rm -rf node_modules/.cache
rm -rf .swc
rm -rf out

# Clear npm/yarn cache
npm cache clean --force
# yarn cache clean  # if using yarn

# Clear system temp (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  rm -rf ~/Library/Caches/com.vercel.next
  rm -rf /tmp/next-*
fi

# Clear Cursor caches
rm -rf ~/.cursor/logs/renderer*
rm -rf ~/.cursor/CachedData

echo "✅ All caches cleared!"
echo "💡 Run: npm install && npm run dev"
```

Make it executable:
```bash
chmod +x clean.sh
```

## 🔧 Fix Your Next.js Config

Create/update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack in development (fixes most cache issues)
  experimental: {
    turbo: false,
  },
  
  // Disable caching in development
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 0,
      pagesBufferLength: 0,
    },
  }),
  
  // Clear webpack cache on config changes
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.cache = false
    }
    return config
  },
  
  // Disable static optimization in dev
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Typescript config
  typescript: {
    // Only ignore build errors in development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // ESLint config
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig
```

## 🎯 Update Your package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbo=false",
    "dev:turbo": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean": "./clean.sh",
    "fresh": "./clean.sh && npm install && npm run dev",
    "reset": "rm -rf .next .turbo node_modules package-lock.json && npm install"
  }
}
```

## 🚀 Development Workflow (Follow This!)

### 1. Daily Startup Routine
```bash
# Start fresh every day
npm run fresh
```

### 2. When Making Config Changes
```bash
# Stop server (Ctrl+C)
rm -rf .next .turbo
npm run dev
```

### 3. When Installing Packages
```bash
# Stop server first
npm install package-name
rm -rf .next
npm run dev
```

### 4. When Things Break
```bash
# Nuclear option
npm run clean
npm install
npm run dev
```

### 5. Before Committing Code
```bash
# Make sure build works
npm run build
# If build fails, clean and try again
npm run fresh
npm run build
```

## 🛡️ Prevention Strategies

### 1. Cursor-Specific Settings

Add to your `.cursorrules`:

```
# Next.js Development Guidelines
- Always stop the dev server before making config changes
- Never modify next.config.js, tailwind.config.ts, and package.json simultaneously
- After package installations, always restart the dev server
- Use 'npm run fresh' when experiencing cache issues
- Disable Turbopack in development to prevent cache corruption
- Test builds regularly with 'npm run build'
```

### 2. Git Ignore Cache Files

Add to `.gitignore`:
```
# Next.js cache files
.next/
.turbo/
.vercel/
.swc/
out/

# Cache directories
node_modules/.cache/
.npm/
.eslintcache

# System cache
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
/tmp/
```

### 3. Environment Management

Create `.env.development`:
```bash
# Development settings
NEXT_TELEMETRY_DISABLED=1
DISABLE_ESLINT_PLUGIN=true
FAST_REFRESH=true
```

## 🔥 Emergency Cache Fix Commands

When your app completely breaks:

```bash
# Level 1: Quick clean
rm -rf .next && npm run dev

# Level 2: Deep clean
rm -rf .next .turbo node_modules/.cache && npm run dev

# Level 3: Nuclear option
npm run clean && npm install && npm run dev

# Level 4: Complete reset (last resort)
rm -rf node_modules package-lock.json .next .turbo
npm install
npm run dev
```

## 📊 Cache Issue Indicators

Watch for these warning signs:

- ❌ "Module not found" errors for existing files
- ❌ "Cannot resolve module" with correct imports
- ❌ Tailwind classes not applying
- ❌ TypeScript errors for valid code
- ❌ Hot reload stops working
- ❌ Changes not reflecting in browser
- ❌ Build errors that don't make sense

## 🎯 Cursor-Specific Tips

1. **Save frequently** - Don't let Cursor make too many changes at once
2. **Restart dev server** after major component generations
3. **Use branches** for experimental AI-generated features
4. **Test manually** after AI-generated code blocks
5. **Keep clean script handy** in your terminal history

## 🏆 Pro Tips

- **Use `npm run fresh`** instead of just `npm run dev` when starting work
- **Commit working states** before letting AI make major changes
- **Keep Next.js config simple** during development
- **Monitor your terminal** for cache-related warnings
- **Don't trust the first error** - clean and retry before debugging

## 🎪 Quick Fix Aliases

Add to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
# Next.js aliases
alias nclean="rm -rf .next .turbo"
alias nfresh="rm -rf .next .turbo && npm run dev"
alias nnuke="rm -rf .next .turbo node_modules/.cache .swc && npm run dev"
```

After sourcing: `source ~/.zshrc`

Usage:
```bash
nclean  # Quick cache clear
nfresh  # Clean and restart
nnuke   # Nuclear option
```
