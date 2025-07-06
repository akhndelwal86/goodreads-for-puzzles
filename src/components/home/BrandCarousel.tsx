import React from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export interface Brand {
  id: number;
  name: string;
  emoji: string;
  count: number;
}

export default function BrandCarousel({ brands }: { brands: Brand[] }) {
  return (
    <section className="max-w-6xl mx-auto mb-12 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold gradient-text">Browse by Brands</h2>
        <Link href="/brands" className="text-emerald-600 font-semibold hover:underline">View All Brands</Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {brands.map((brand) => (
          <Card key={brand.id} className="glass-card min-w-[160px] flex flex-col items-center p-4 hover:-translate-y-1 hover:shadow-2xl">
            <div className="text-3xl mb-2">{brand.emoji}</div>
            <div className="font-semibold text-base mb-1">{brand.name}</div>
            <div className="text-xs text-gray-500">{brand.count} puzzles</div>
          </Card>
        ))}
      </div>
    </section>
  );
} 