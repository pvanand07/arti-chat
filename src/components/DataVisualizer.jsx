import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { groupBy, sumBy, map, orderBy } from 'lodash';

// Sample CSV data - in real app, this would come from a file
const sampleCSV = `date,category,sales,units
2024-01-01,Electronics,1200,5
2024-01-01,Books,300,10
2024-01-02,Electronics,800,3
2024-01-02,Books,400,12
2024-01-03,Electronics,1500,6
2024-01-03,Books,200,8
2024-01-04,Electronics,900,4
2024-01-04,Books,600,15`;

const App = () => {
  const [data, setData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    // Parse CSV string into array of objects
    const parseCSV = (csv) => {
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          // Convert numeric strings to numbers
          const value = values[index];
          obj[header] = /^\d+$/.test(value) ? Number(value) : value;
          return obj;
        }, {});
      });
    };

    // Process the data
    const rawData = parseCSV(sampleCSV);
    setData(rawData);

    // Process daily totals
    const byDate = groupBy(rawData, 'date');
    const dailyTotals = map(byDate, (items, date) => ({
      date,
      totalSales: sumBy(items, 'sales'),
      totalUnits: sumBy(items, 'units')
    }));
    setDailyData(orderBy(dailyTotals, 'date'));

    // Process category totals
    const byCategory = groupBy(rawData, 'category');
    const categoryTotals = map(byCategory, (items, category) => ({
      category,
      totalSales: sumBy(items, 'sales'),
      totalUnits: sumBy(items, 'units'),
      avgPrice: sumBy(items, 'sales') / sumBy(items, 'units')
    }));
    setCategoryData(orderBy(categoryTotals, 'totalSales', 'desc'));
  }, []);

  return (
    <div className="p-4 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Daily Sales Trends</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="totalSales" 
                stroke="#8884d8" 
                name="Sales ($)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="totalUnits" 
                stroke="#82ca9d" 
                name="Units"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Sales by Category</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="totalSales" 
                fill="#8884d8" 
                name="Total Sales ($)"
              />
              <Bar 
                yAxisId="right"
                dataKey="totalUnits" 
                fill="#82ca9d" 
                name="Units Sold"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Category Analysis</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="p-2">Category</th>
              <th className="p-2 text-right">Total Sales</th>
              <th className="p-2 text-right">Units Sold</th>
              <th className="p-2 text-right">Avg Price/Unit</th>
            </tr>
          </thead>
          <tbody>
            {categoryData.map(cat => (
              <tr key={cat.category} className="border-t">
                <td className="p-2">{cat.category}</td>
                <td className="p-2 text-right">${cat.totalSales.toLocaleString()}</td>
                <td className="p-2 text-right">{cat.totalUnits}</td>
                <td className="p-2 text-right">${cat.avgPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;