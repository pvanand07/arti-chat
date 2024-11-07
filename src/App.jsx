// src/App.jsx
import { useState, useEffect } from 'react'

function App() {
  const [components, setComponents] = useState([])
  const [selectedComponent, setSelectedComponent] = useState('')
  const [Component, setComponent] = useState(null)

  // Load list of available components
  useEffect(() => {
    const loadComponents = async () => {
      const modules = import.meta.glob('./components/*.jsx')
      const componentNames = Object.keys(modules).map(path => {
        // Extract component name from path: './components/DataVisualizer.jsx' -> 'DataVisualizer'
        return path.split('/').pop().replace('.jsx', '')
      })
      setComponents(componentNames)
      // Set first component as default if none selected
      if (componentNames.length && !selectedComponent) {
        setSelectedComponent(componentNames[0])
      }
    }
    loadComponents()
  }, [])

  // Load selected component
  useEffect(() => {
    const loadComponent = async () => {
      if (!selectedComponent) return
      try {
        const module = await import(`./components/${selectedComponent}.jsx`)
        setComponent(() => module.default)
      } catch (error) {
        console.error('Failed to load component:', error)
        setComponent(null)
      }
    }
    loadComponent()
  }, [selectedComponent])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <header className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Component Viewer</h1>
          <select 
            className="px-3 py-2 border rounded-lg"
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
          >
            {components.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </header>

        <main className="border rounded-lg p-4 bg-white min-h-[600px]">
          {Component ? (
            <Component />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {components.length === 0 ? (
                'No components found in ./components directory'
              ) : (
                'Loading component...'
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App