
        import { useState, useEffect } from 'react'
        import UserComponent from './components/UserComponent.jsx'

        function App() {
            return (
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col gap-4">
                        <main className="border rounded-lg p-4 bg-white min-h-[600px]">
                            <UserComponent />
                        </main>
                    </div>
                </div>
            )
        }

        export default App
    