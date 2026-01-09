'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/db';

interface CategoryPillsProps {
  categories: Category[];
}

export default function CategoryPills({ categories }: CategoryPillsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === currentCategory) {
      // Clicking active category clears it
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.push(`/recommend?${params.toString()}`);
  };

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = cat.slug === currentCategory;
        return (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-teal-600 text-white'
                : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
