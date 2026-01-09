'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import BottomNav from '@/components/BottomNav';
import { Category } from '@/lib/db';

export default function NewRecommendationPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    address: '',
    website_url: '',
    contact_info: '',
    recommended_by: '',
  });

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (e) {
        console.error('Failed to fetch categories:', e);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setSuccess(true);
      // Redirect after short delay
      setTimeout(() => {
        router.push('/recommend');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h2>
            <p className="text-slate-600">Your recommendation has been submitted.</p>
            <p className="text-slate-500 text-sm mt-2">Redirecting to recommendations...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 py-4 sm:py-8">
        {/* Back link */}
        <Link
          href="/recommend"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4 transition-colors text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Recommendations
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 sm:px-6 py-4 sm:py-5">
            <h1 className="text-lg sm:text-xl font-bold text-white">Add a Recommendation</h1>
            <p className="text-teal-100 text-sm mt-1">Share a business or service you recommend</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-400 ring-2 ring-red-400/20 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Business Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., ABC Consulting"
                className="w-full h-[52px] px-4 py-3 border-[1.5px] border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-base placeholder:text-slate-400 transition-all duration-200"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full h-[52px] px-4 py-3 border-[1.5px] border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none bg-white cursor-pointer text-base text-slate-700 transition-all duration-200"
              >
                <option value="" className="text-slate-400">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What services do they offer? Why do you recommend them?"
                className="w-full min-h-[120px] px-4 py-3 border-[1.5px] border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none text-base placeholder:text-slate-400 transition-all duration-200"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g., Level 10, Menara XYZ, Jalan Ampang, 50450 Kuala Lumpur"
                className="w-full min-h-[120px] px-4 py-3 border-[1.5px] border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none text-base placeholder:text-slate-400 transition-all duration-200"
              />
            </div>

            {/* Website URL */}
            <div>
              <label htmlFor="website_url" className="block text-sm font-medium text-slate-700 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website_url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="e.g., www.example.com"
                className="w-full h-[52px] px-4 py-3 border-[1.5px] border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-base placeholder:text-slate-400 transition-all duration-200"
              />
            </div>

            {/* Contact Info */}
            <div>
              <label htmlFor="contact_info" className="block text-sm font-medium text-slate-700 mb-2">
                Contact Information
              </label>
              <textarea
                id="contact_info"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleChange}
                placeholder="Phone, email, website, address, etc."
                className="w-full min-h-[120px] px-4 py-3 border-[1.5px] border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none text-base placeholder:text-slate-400 transition-all duration-200"
              />
            </div>

            {/* Your Name */}
            <div>
              <label htmlFor="recommended_by" className="block text-sm font-medium text-slate-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="recommended_by"
                name="recommended_by"
                required
                value={formData.recommended_by}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full h-[52px] px-4 py-3 border-[1.5px] border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-base placeholder:text-slate-400 transition-all duration-200"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 px-8 bg-teal-600 text-white text-base rounded-lg font-semibold hover:bg-teal-700 hover:shadow-md active:bg-teal-800 active:scale-[0.98] focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Recommendation'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
