import CodeRenderer from './components/code-renderer'
import './App.css'

function App() {
  const sampleCode = `
import React from 'react';

export default function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">Counter: {count}</h2>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => setCount(count - 1)}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
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
