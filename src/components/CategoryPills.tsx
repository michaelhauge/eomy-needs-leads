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
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-2 pb-2 sm:pb-0 sm:flex-wrap">
        {categories.map((cat) => {
          const isActive = cat.slug === currentCategory;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`h-10 px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 ease-out ${
                isActive
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50 hover:border-teal-200'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
