import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface SmartList {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function SmartLists({ lists }: { lists: SmartList[] }) {
  return (
    <section className="max-w-6xl mx-auto mb-12 px-4">
      <h2 className="text-2xl font-bold gradient-text mb-4">Smart Lists</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {lists.map((list) => (
          <Card key={list.title} className="glass-card min-w-[220px] p-6 flex flex-col items-start hover:-translate-y-1 hover:shadow-2xl">
            <div className="font-semibold mb-2 flex items-center gap-2">{list.icon} {list.title}</div>
            <div className="text-gray-600 text-sm mb-4">{list.description}</div>
            <Button variant="outline" size="sm">Browse</Button>
          </Card>
        ))}
      </div>
    </section>
  );
} 