import React from 'react';

export default function MetricsCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { title: 'Revenue', value: '$12,345', change: '+12%' },
        { title: 'Users', value: '1,234', change: '+5%' },
        { title: 'Orders', value: '567', change: '-2%' }
      ].map(metric => (
        <div key={metric.title} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">{metric.title}</h3>
          <p className="text-2xl font-bold">{metric.value}</p>
          <span className={`text-sm ${
            metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
          }`}>
            {metric.change}
          </span>
        </div>
      ))}
    </div>
  );
}