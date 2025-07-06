import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

export interface Activity {
  user: string;
  action: string;
  time: string;
  image: string;
}

export default function ActivityFeed({ feed }: { feed: Activity[] }) {
  return (
    <div className="flex flex-col gap-6">
      {feed.map((item, idx) => (
        <Card key={idx} className="glass-card p-6 flex gap-4 items-center">
          <Avatar className="w-10 h-10" />
          <div>
            <div className="font-semibold">{item.user}</div>
            <div className="text-gray-600 text-sm">{item.action} <span className="text-xs text-gray-400 ml-2">{item.time}</span></div>
            <div className="mt-2 flex gap-2">
              <img src={item.image} alt={item.action} className="w-24 h-16 object-cover rounded-lg" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 