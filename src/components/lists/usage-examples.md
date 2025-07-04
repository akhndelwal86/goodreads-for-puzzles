# Smart Lists - Modular Component Usage

## 🎯 **Basic Usage**

### Individual Lists
```typescript
import { MostCompletedList, TrendingList, RecentlyAddedList } from '@/components/lists'

// Basic usage
<MostCompletedList />
<TrendingList />
<RecentlyAddedList />

// With custom limits
<MostCompletedList limit={5} />
<TrendingList limit={10} />

// Without container (just the list items)
<MostCompletedList showContainer={false} />

// With click handlers
<TrendingList onPuzzleClick={(id) => router.push(`/puzzles/${id}`)} />

// With view all handler
<MostCompletedList onViewAll={() => router.push('/lists/most-completed')} />
```

### Combined Section
```typescript
import { SmartListsSection } from '@/components/home/smart-lists-section'

<SmartListsSection 
  onPuzzleClick={(id) => router.push(`/puzzles/${id}`)}
  onViewAll={(type) => router.push(`/lists/${type}`)}
/>
```

## 🎨 **Advanced Usage**

### Custom Styling
```typescript
<MostCompletedList 
  className="bg-blue-50 border-blue-200"
  limit={3}
/>
```

### Responsive Layouts
```typescript
// Mobile: Stacked, Desktop: Side by side
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <TrendingList />
  <MostCompletedList />
</div>

// Three columns on large screens
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  <TrendingList />
  <MostCompletedList />
  <RecentlyAddedList />
</div>
```

### Future Extensions
```typescript
// Easy to add new list types
<TopRatedList limit={5} />
<UserFavoritesList userId="123" />
<BrandPopularList brandId="ravensburger" />
<CategoryTrendingList category="landscape" />
```

## 🔧 **Component Architecture**

### Base Components
- `SmartListContainer`: Wrapper with header, loading states, "View All" button
- `PuzzleListItem`: Individual puzzle item with rank, image, title, brand, metric

### List Components
- `MostCompletedList`: Shows puzzles by completion count
- `TrendingList`: Shows puzzles by recent activity
- `RecentlyAddedList`: Shows newest puzzles

### Hooks
- `useMostCompleted(limit)`: Fetches most completed data
- `useTrending(limit)`: Fetches trending data  
- `useRecentlyAdded(limit)`: Fetches recently added data
- `useSmartLists()`: Fetches all three lists at once

## 📱 **Responsive Design**

All components are fully responsive:
- Mobile: Single column, stacked layout
- Tablet: Two column grid
- Desktop: Three column grid
- Large screens: Maintains aspect ratios

## 🚀 **Performance**

- **Client-side data fetching** with loading states
- **5-minute caching** to reduce server requests
- **Error boundaries** for graceful failure handling
- **Optimistic loading** with skeleton states 