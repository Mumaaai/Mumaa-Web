import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  color: 'blue' | 'orange' | 'red' | 'green' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendUp, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
