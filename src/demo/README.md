# Demo & Testing Files

This folder contains demo pages, test components, and development utilities that were created during the development process.

## 📁 Folder Structure

### `/pages/`
- **`puzzle-creation-demo/`** - Complete two-stage puzzle creation workflow demo
- **`puzzle-log-demo/`** - Puzzle logging form demo  
- **`test-logging/`** - Test page for logging functionality

### `/components/`
- **`debug/`** - Debug components used during development

### `/api-test-db/`
- **Test database API endpoint** - Used for testing database connections

## 🎯 Purpose

These files are kept for:
- **Testing new features** before integrating into production
- **API testing** and debugging
- **Reference implementation** for complex workflows
- **Development examples** for future features

## ⚠️ Important Notes

- These files are **NOT part of the production application**
- They may have **hardcoded values** or **simplified logic**
- Routes may be **temporarily broken** after cleanup
- Use these as **reference only**, not production code

## 🚀 Usage

To access demo pages during development:
1. Copy the page to `src/app/` temporarily
2. Test your changes
3. Move back to `src/demo/` when done
4. Update production code separately

## 🧹 Cleanup

These files can be safely deleted when:
- All functionality has been moved to production
- No longer needed for testing
- Project is ready for production deployment 