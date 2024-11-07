import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Sample data
  const data = [
    { date: 'Mon', users: 2400, revenue: 4000, conversions: 240 },
    { date: 'Tue', users: 1398, revenue: 3000, conversions: 139 },
    { date: 'Wed', users: 9800, revenue: 2000, conversions: 980 },
    { date: 'Thu', users: 3908, revenue: 2780, conversions: 390 },
    { date: 'Fri', users: 4800, revenue: 1890, conversions: 480 },
    { date: 'Sat', users: 3800, revenue: 2390, conversions: 380 },
    { date: 'Sun', users: 4300, revenue: 3490, conversions: 430 }
  ];

  const stats = [
    {
      title: 'Total Users',
      value: '34,218',
      change: '+14.2%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Revenue',
      value: '$23,482',
      change: '+8.4%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Conversion Rate',
      value: '12.8%',
      change: '-2.1%',
      icon: TrendingUp,
      trend: 'down'
    }
  ];

  return (
    <div className="p-4 space-y-4 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  name="Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#82ca9d"
                  name="Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#ffc658"
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;