import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Users } from 'lucide-react';

export interface PuzzleOfTheDayProps {
  image: string;
  title: string;
  tags: string[];
  description: string;
  rating: number;
  reviews: number;
  solved: number;
}

export default function PuzzleOfTheDay({ image, title, tags, description, rating, reviews, solved }: PuzzleOfTheDayProps) {
  return (
    <section className="max-w-5xl mx-auto mb-12 px-4 grid md:grid-cols-2 gap-8 items-center">
      <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-gradient-to-br from-violet-200/60 to-emerald-100/40 flex items-center justify-center">
        <img src={image} alt={title} className="object-cover w-full h-full" />
      </div>
      <div>
        <h3 className="text-2xl font-bold gradient-text mb-2">{title}</h3>
        <div className="mb-2 flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="bg-violet-100 text-violet-700 px-2 py-1 rounded-full text-xs font-medium">{tag}</span>
          ))}
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="flex gap-2 mb-4">
          <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold">Add to List</Button>
          <Button variant="outline" className="font-semibold">Rate It</Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Star className="text-yellow-400 w-4 h-4" /> {rating} ({reviews} reviews)
          <span className="mx-2">•</span>
          <Users className="text-emerald-500 w-4 h-4" /> {solved} solved
        </div>
      </div>
    </section>
  );
} 