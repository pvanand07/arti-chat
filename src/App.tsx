import CodeRenderer from './components/code-renderer'
import './App.css'

function App() {
  const sampleCode = `
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, DollarSign, ShoppingCart } from 'lucide-react';

const Dashboard = () => {
  const chartData = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 1398 },
    { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 3908 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 3800 },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      icon: DollarSign,
      change: "+20.1%",
    },
    {
      title: "Active Users",
      value: "2,350",
      icon: Users,
      change: "+10.5%"
    },
    {
      title: "Sales",
      value: "12,234",
      icon: ShoppingCart,
      change: "+15.2%"
    },
    {
      title: "Active Now",
      value: "573",
      icon: Activity,
      change: "+8.1%"
    }
  ];

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <p className="text-xs text-gray-500">
                <span className={stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                {' '}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                  <div className="flex-1">
                    <p className="text-sm">
                      User {i + 1} completed action {Math.floor(Math.random() * 100)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.floor(Math.random() * 60)} minutes ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
`;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Code Renderer Demo</h1>
        
        {/* Render preview only */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Preview Mode:</h2>
          <div className="h-[300px]">
            <CodeRenderer code={sampleCode} />
          </div>
        </div>

        {/* Render with editor */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Editor Mode:</h2>
          <CodeRenderer code={sampleCode} showEditor={true} />
        </div>
      </div>
    </div>
  )
}

export default App
