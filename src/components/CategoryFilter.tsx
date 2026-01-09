'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/db';

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (e.target.value) {
      params.set('category', e.target.value);
    } else {
      params.delete('category');
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <select
      value={currentCategory}
      onChange={handleChange}
      className="w-full sm:w-auto min-h-[48px] px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer text-base"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.slug}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
