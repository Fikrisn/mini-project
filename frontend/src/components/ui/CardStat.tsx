// components/ui/CardStat.tsx
import React from 'react';

export default function CardStat({ title, value, icon }: { title: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 hover:shadow-lg transition">
      <div className="text-3xl text-blue-600">{icon}</div>
      <div>
        <h3 className="text-gray-700 font-semibold">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
