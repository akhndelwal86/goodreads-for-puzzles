import React from 'react';
import { Card } from '@/components/ui/card';

export default function PopularCategories({ categories }: { categories: string[] }) {
  return (
    <Card className="glass-card p-6">
      <div className="font-semibold mb-4 gradient-text">Popular Categories</div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat}
            className="bg-gray-100/80 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:bg-gray-200/90 transition"
          >
            {cat}
          </span>
        ))}
      </div>
    </Card>
  );
} 