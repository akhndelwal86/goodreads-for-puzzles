import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Upload } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="max-w-4xl mx-auto pt-12 pb-8 px-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text mb-4">Discover, Log & Share Your Puzzle Journey</h1>
      <p className="text-lg sm:text-xl text-gray-700 mb-8">Join the world's most vibrant puzzle community. Find your next challenge, log your solves, and get AI-powered recommendations!</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Card className="glass-card flex-1 p-6 flex flex-col items-center hover:-translate-y-1 hover:shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-emerald-400 animate-pulse" />
            <span className="font-semibold text-lg gradient-text">Find Your Next Puzzle</span>
          </div>
          <input
            type="text"
            className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
            placeholder="Describe your perfect puzzle..."
          />
          <Button className="mt-4 w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-semibold shadow-md">Ask AI</Button>
        </Card>
        <Card className="glass-card flex-1 p-6 flex flex-col items-center hover:-translate-y-1 hover:shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="text-violet-500" />
            <span className="font-semibold text-lg gradient-text">Log Your Puzzle</span>
          </div>
          <p className="text-gray-600 mb-2">Share your latest solve with a photo!</p>
          <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-md">Upload Photo</Button>
        </Card>
      </div>
    </section>
  );
} 