'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Category } from '@/lib/db';

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }

    router.push(`/?${params.toString()}`);
    setIsOpen(false);
  };

  const selectedCategory = categories.find((c) => c.slug === currentCategory);
  const displayLabel = selectedCategory ? selectedCategory.name : 'Category';
  const isActive = !!currentCategory;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 h-10 px-4 rounded-full border transition-all duration-200 text-sm font-medium ${
          isActive
            ? 'bg-teal-100 text-teal-700 border-teal-300'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        <span>{displayLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 min-w-[180px] bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
          <button
            type="button"
            onClick={() => handleSelect('')}
            className={`w-full flex items-center justify-between h-11 px-4 text-left text-sm transition-colors ${
              !currentCategory
                ? 'bg-teal-50 text-teal-700 font-medium'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
            {!currentCategory && (
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelect(cat.slug)}
              className={`w-full flex items-center justify-between h-11 px-4 text-left text-sm transition-colors ${
                currentCategory === cat.slug
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              {currentCategory === cat.slug && (
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
