import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';

export interface LeaderboardUser {
  name: string;
  puzzles: number;
  avatar: string;
}

export default function Leaderboard({ leaderboard }: { leaderboard: LeaderboardUser[] }) {
  return (
    <Card className="glass-card p-6">
      <div className="font-semibold mb-4 flex items-center gap-2 gradient-text">
        <Trophy className="text-yellow-400" /> Monthly Leaderboard
      </div>
      <ol className="space-y-2">
        {leaderboard.map((user, i) => (
          <li key={user.name} className={`flex items-center gap-2 ${i < 3 ? 'font-bold' : ''}`}>
            <span className="w-6 text-center">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
            <Avatar className="w-7 h-7" />
            <span>{user.name}</span>
            <span className="ml-auto text-xs text-gray-500">{user.puzzles} puzzles</span>
          </li>
        ))}
      </ol>
    </Card>
  );
} 