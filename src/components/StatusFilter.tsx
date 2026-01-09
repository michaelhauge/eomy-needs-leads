'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const statuses = ['Open', 'Has Leads', 'Resolved'];

export default function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (e.target.value) {
      params.set('status', e.target.value);
    } else {
      params.delete('status');
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer"
    >
      <option value="">All Statuses</option>
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
