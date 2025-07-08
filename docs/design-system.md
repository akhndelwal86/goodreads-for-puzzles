# Goodreads for Puzzles - Design System

## Overview
This document outlines the complete design system for the Goodreads for Puzzles platform, establishing consistent visual language, component patterns, and interaction principles for a modern, engaging puzzle discovery and tracking experience.

---

## 🎨 Color System

### Primary Color Palette

#### **Purple/Violet** - Primary Actions
- **Primary**: `from-violet-500 to-purple-600` / `bg-violet-600`
- **Hover**: `from-violet-600 to-purple-700` / `hover:bg-violet-700`
- **Light**: `bg-violet-100 text-violet-700 border-violet-200`
- **Usage**: Primary CTAs, "Add to List" buttons, main navigation highlights

#### **Emerald/Teal** - Secondary Actions  
- **Primary**: `from-emerald-500 to-teal-600` / `bg-emerald-600`
- **Hover**: `from-emerald-600 to-teal-700` / `hover:bg-emerald-700`
- **Light**: `border-emerald-200 text-emerald-700 hover:bg-emerald-50`
- **Usage**: "Rate It" buttons, "Log Your Puzzle" CTA, secondary actions

#### **Orange** - Special Highlights
- **Primary**: `bg-orange-500`
- **Usage**: Puzzle of the Day badges, star rating icons, special callouts

#### **Blue** - Information Elements
- **Light**: `bg-blue-100 text-blue-700` (legacy - migrating to grey)
- **Primary**: `text-blue-600`
- **Usage**: Links, informational elements (being phased out for grey)

### Neutral Palette

#### **Greys** - Text & Backgrounds
- **Text Primary**: `text-gray-900` (headings, important text)
- **Text Secondary**: `text-gray-600` (body text, descriptions)
- **Text Tertiary**: `text-gray-500` (metadata, less important info)
- **Background Light**: `bg-gray-100` (tags, subtle backgrounds)
- **Background Medium**: `bg-gray-200` (loading states, dividers)
- **Border**: `border-gray-200` (neutral borders)

#### **White/Transparency**
- **Solid**: `bg-white` (full opacity backgrounds)
- **Glassmorphism**: `bg-white/90 backdrop-blur-sm` (modern card effect)
- **Subtle**: `bg-white/80` (lighter transparency)

---

## 📝 Typography

### Font Hierarchy

#### **Headings**
- **H1 (Hero)**: `text-4xl md:text-5xl font-semibold`
- **H2 (Sections)**: `text-xl lg:text-2xl font-semibold` or `text-xl font-semibold`
- **H3 (Cards)**: `text-2xl font-bold` or `text-lg font-medium`

#### **Body Text**
- **Primary**: `text-base` (default)
- **Secondary**: `text-sm` (descriptions, metadata)
- **Small**: `text-xs` (tags, fine print)

#### **Interactive Text**
- **Buttons**: `font-medium` or `font-semibold`
- **Links**: `font-medium` with appropriate color
- **Tags**: `font-medium` with `text-xs`

### Text Colors by Context
- **Data Points**: `text-gray-600 text-sm` (ratings, times, counts)
- **Descriptions**: `text-gray-600`
- **Brand Names**: `text-gray-600`
- **Tags**: `text-gray-600 text-xs`
- **Hashtags**: `text-blue-600 text-sm` (special case)

---

## 🧩 Component Patterns

### Cards & Containers

#### **Glassmorphism Cards** (Primary Pattern)
```css
bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300
```
- **Usage**: Main content cards, Puzzle of the Day, feature sections
- **Benefits**: Modern, depth, subtle transparency
- **Hover**: Enhanced shadow for interactivity

#### **Section Containers**
```css
bg-gradient-to-br from-violet-50/50 via-white to-emerald-50/30 rounded-3xl p-6
```
- **Usage**: Smart Lists section, major content areas
- **Pattern**: Subtle gradient background with generous padding

#### **Legacy Bordered Cards** (Phase Out)
```css
border border-gray-200
```
- **Status**: Being replaced with glassmorphism
- **Migration**: Replace with shadow-based depth

### Buttons

#### **Primary Action Button**
```css
bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 
text-white px-8 py-4 text-lg font-semibold rounded-xl 
shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200
```

#### **Secondary Action Button** 
```css
border-emerald-200 text-emerald-700 hover:bg-emerald-50 
flex items-center justify-center gap-2 h-12 font-medium rounded-xl
```

#### **Dropdown Button**
```css
bg-purple-600 hover:bg-purple-700 text-white 
flex items-center justify-center gap-2 h-12 font-medium rounded-xl
```
- **Must include**: ChevronDown icon
- **States**: Loading (spinner), Status-aware text

### Interactive Elements

#### **Tags**
```css
px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full
```
- **Format**: `#{tag.toLowerCase()}`
- **Spacing**: `gap-2` between tags
- **Container**: `flex flex-wrap`

#### **Badges**
```css
bg-purple-100 text-purple-700 border-purple-200  /* Difficulty */
bg-orange-500 text-white border-0              /* Special */
```

#### **Data Point Display**
```css
flex items-center gap-2
```
- **Icon**: `w-4 h-4` with semantic color
- **Text**: `text-gray-600 text-sm`
- **Grid**: `grid grid-cols-2 gap-4` for 4-point layouts

---

## 📐 Layout & Spacing

### Container System
- **Max Width**: `max-w-7xl mx-auto`
- **Padding**: `px-4` (mobile) to `px-6` (desktop)
- **Section Spacing**: `space-y-8` or `py-8`

### Component Spacing
- **Card Padding**: `p-6` (standard), `p-5` (compact)
- **Button Height**: `h-12` (standard), `h-9` (compact)
- **Margins**: `mb-4` (section headers), `mb-6` (content blocks)
- **Gaps**: `gap-2` (tags), `gap-3` (buttons), `gap-4` (data points)

### Border Radius
- **Large Components**: `rounded-3xl` (cards, containers)
- **Medium Components**: `rounded-xl` (buttons, inputs)
- **Small Components**: `rounded-full` (tags, icons)
- **Images**: `rounded-xl` (standard), `rounded-2xl` (larger)

---

## ⚡ Interactions & Animations

### Hover Effects
- **Cards**: `hover:shadow-xl transition-all duration-300`
- **Buttons**: `hover:scale-105 transition-all duration-200`
- **Enhanced**: `transform hover:scale-105` for prominent CTAs

### Loading States
- **Spinner**: `animate-spin` for active operations
- **Skeleton**: `animate-pulse bg-gray-200` for content loading
- **Text**: "Updating..." with appropriate icon

### Transitions
- **Standard**: `transition-all duration-300`
- **Quick**: `transition-all duration-200`
- **Property Specific**: `transition-transform`, `transition-shadow`

---

## 🎯 Component-Specific Patterns

### Puzzle of the Day
- **Container**: Glassmorphism card with section header outside
- **Layout**: `grid grid-cols-1 lg:grid-cols-2`
- **Image**: Badge overlay with `absolute top-4 left-4`
- **Stats**: 4-point grid with icons and small text
- **Tags**: Grey pills with hashtag format
- **Actions**: Purple dropdown + Green outline button

### Navigation & Headers
- **Section Headers**: Outside cards with icon + title
- **Icon**: Colored circle background with white icon
- **Typography**: `text-xl font-semibold text-gray-900`

### Dropdowns
- **Trigger**: Button with ChevronDown icon
- **Content**: `w-48` minimum width
- **Items**: Icons + text + optional check mark
- **Separators**: Before "View Details" type actions

### Forms & Inputs
- **Style**: Clean, rounded inputs with focus states
- **Heights**: Consistent with button heights (`h-12`)
- **Focus**: Ring-based focus indicators

---

## 🔍 Status & State Management

### Interactive States
- **Default**: Base styling
- **Hover**: Enhanced shadows, slight scale
- **Active**: Pressed state with subtle animation
- **Loading**: Spinner icon with "Updating..." text
- **Disabled**: Reduced opacity, no interactions

### Status Indicators
- **Wishlist**: Pink heart icon
- **Library**: Blue book icon  
- **In Progress**: Amber clock icon
- **Completed**: Green check icon
- **Default**: Plus icon for "Add to List"

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: Base styles, single column layouts
- **Tablet**: `md:` prefix for medium screens
- **Desktop**: `lg:` prefix for large screens
- **Wide**: `xl:` prefix for extra large screens

### Mobile-First Approach
- Start with mobile layout
- Progressive enhancement for larger screens
- Grid transitions: `grid-cols-1 lg:grid-cols-2`
- Text scaling: `text-lg md:text-xl`

---

## 🚫 Anti-Patterns (Avoid These)

### Visual
- ❌ Hard borders on main content cards (use shadows instead)
- ❌ Multiple different border radius values in same component
- ❌ Inconsistent color usage (grey vs blue for similar elements)
- ❌ Bold text for data points (use normal weight)

### Layout  
- ❌ Section headers inside cards (keep outside)
- ❌ Inconsistent spacing between similar components
- ❌ Missing hover states on interactive elements
- ❌ Poor alignment with container edges

### Typography
- ❌ Too many font weights in one component
- ❌ Inconsistent text sizes for similar content types
- ❌ Missing text hierarchy

---

## ✅ Implementation Checklist

### New Component Creation
- [ ] Uses appropriate color scheme (purple primary, emerald secondary)
- [ ] Implements glassmorphism for cards (`bg-white/90 backdrop-blur-sm`)
- [ ] Includes proper hover effects and transitions
- [ ] Follows typography hierarchy
- [ ] Uses consistent spacing system
- [ ] Implements loading/error states
- [ ] Mobile-responsive design
- [ ] Proper semantic HTML

### Component Updates
- [ ] Replace borders with shadows where appropriate
- [ ] Update button colors to match system
- [ ] Ensure tags use grey pill style
- [ ] Check data point text sizing (text-sm)
- [ ] Verify section header placement (outside cards)
- [ ] Add missing interaction states

---

## 🎨 Quick Reference

### Most Common Patterns
```css
/* Glassmorphism Card */
bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300

/* Primary Button */
bg-purple-600 hover:bg-purple-700 text-white h-12 font-medium rounded-xl

/* Secondary Button */
border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-12 font-medium rounded-xl

/* Data Point */
flex items-center gap-2
text-gray-600 text-sm

/* Tag */
px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full

/* Section Header */
flex items-center gap-3 mb-4
text-xl font-semibold text-gray-900
```

---

This design system ensures consistency, scalability, and a cohesive user experience across the entire Goodreads for Puzzles platform. All components should follow these patterns to maintain visual harmony and intuitive interactions.