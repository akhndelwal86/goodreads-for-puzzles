# Next.js Cache Management Protocol

## 🚨 **MANDATORY DEVELOPMENT RULES**

### **Rule #1: ALWAYS Stop Server Before Making Changes**
```bash
# BEFORE any code changes:
Ctrl+C  # Stop the development server
```

### **Rule #2: Use Appropriate Cache Management Scripts**

#### **Quick Clean (Daily Use)**
```bash
npm run dev:clean
```
- Use for: Small code changes, component updates
- Clears: `.next` directory only
- Speed: ⚡ Fast

#### **Deep Clean (When Issues Occur)**
```bash
npm run dev:deep
```
- Use for: Cache corruption, missing manifests, vendor errors
- Clears: `.next`, `.swc`, `node_modules/.cache`, npm cache
- Speed: ⚡⚡ Medium

#### **Fresh Start (Nuclear Option)**
```bash
npm run dev:fresh
```
- Use for: Severe corruption, dependency issues, "Cannot find module" errors
- Clears: Everything + reinstalls dependencies
- Speed: ⚡⚡⚡ Slow but thorough

#### **Emergency Recovery**
```bash
npm run fresh
```
- Use for: macOS permission issues, complete system corruption
- Includes: Permission fixes + full reset + auto-start
- Speed: ⚡⚡⚡ Slowest but most complete

## 🔍 **Cache Corruption Warning Signs**

Watch for these errors that indicate cache issues:
- ❌ `Error: ENOENT: no such file or directory, open '.../app-paths-manifest.json'`
- ❌ `Error: Cannot find module './vendor-chunks/@clerk.js'`
- ❌ `Error: Cannot find module 'ts-interface-checker'`
- ❌ `GET /_next/static/css/app/layout.css 404`
- ❌ `GET /_next/static/chunks/main-app.js 404`
- ❌ `middleware-manifest.json not found`

## 📋 **Development Workflow Checklist**

### **Before Making ANY Code Changes:**
- [ ] Stop server with `Ctrl+C`
- [ ] Choose appropriate restart method
- [ ] Make your changes
- [ ] Start with clean cache

### **For Different Change Types:**

#### **Small Component Changes:**
```bash
Ctrl+C
# Make changes
npm run dev:clean
```

#### **Package.json / Dependencies:**
```bash
Ctrl+C
# Make changes
npm run dev:fresh
```

#### **Configuration Changes (next.config.ts, tailwind.config.ts):**
```bash
Ctrl+C
# Make changes
npm run dev:deep
```

#### **After Getting Cache Errors:**
```bash
Ctrl+C
npm run fresh  # This handles everything
```

## 🛠 **Available Scripts**

| Script | Purpose | Speed | Use When |
|--------|---------|-------|----------|
| `npm run dev` | Normal development | ⚡ | First start |
| `npm run dev:clean` | Quick cache clear | ⚡ | Daily development |
| `npm run dev:deep` | Deep cache cleanup | ⚡⚡ | Cache corruption |
| `npm run dev:fresh` | Full reset + dev | ⚡⚡⚡ | Severe issues |
| `npm run fresh` | Complete recovery | ⚡⚡⚡ | Emergency |
| `npm run cache:clear` | Clear cache only | ⚡⚡ | Manual cleanup |
| `npm run fix:permissions` | Fix macOS issues | ⚡ | Permission errors |
| `npm run debug:cache` | Check cache status | ⚡ | Diagnostics |

## 🚫 **What NOT to Do**

- ❌ **Never** make multiple file changes simultaneously
- ❌ **Never** ignore cache corruption warnings
- ❌ **Never** continue development with active cache errors
- ❌ **Never** modify dependencies while server is running
- ❌ **Never** use hot reload when seeing manifest errors

## ✅ **Configuration Changes Made**

### **next.config.ts Updates:**
- ✅ Disabled Turbopack (cache corruption prone)
- ✅ Disabled webpack caching in development
- ✅ Added better module resolution
- ✅ Prevented memory leaks
- ✅ Added development buffer settings

### **Package.json Scripts Added:**
- ✅ Progressive cache management (clean → deep → fresh)
- ✅ macOS permission fixes
- ✅ Emergency recovery workflows
- ✅ Debug and diagnostic tools

## 🚨 **Emergency Recovery Procedure**

If you see ANY cache errors:

1. **Stop immediately**: `Ctrl+C`
2. **Run recovery**: `npm run fresh`
3. **Wait for completion**: Don't interrupt the process
4. **Test basic functionality**: Visit http://localhost:3000
5. **If still broken**: Check for deeper issues (dependencies, Node version, etc.)

## 📊 **Success Indicators**

Your server is healthy when you see:
- ✅ `✓ Ready in [time]ms`
- ✅ `✓ Compiled /page in [time]ms`
- ✅ No 404 errors for `/_next/static/` files
- ✅ No missing manifest file errors
- ✅ Hot reload working properly

---

**Remember**: It's better to spend 30 seconds cleaning the cache than 30 minutes debugging corruption issues!
