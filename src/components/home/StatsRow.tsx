import React from 'react';
import { Card } from '@/components/ui/card';

export interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <section className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 px-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="glass-card flex flex-col items-center py-6 hover:-translate-y-1 hover:shadow-2xl">
          <div className="mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
          <div className="text-xs text-gray-700 font-medium uppercase tracking-wide">{stat.label}</div>
        </Card>
      ))}
    </section>
  );
} 