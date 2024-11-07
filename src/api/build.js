import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import archiver from 'archiver';
import { createWriteStream } from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post('/build', async (req, res) => {
    try {
        const { componentCode } = req.body;
        
        if (!componentCode) {
            return res.status(400).json({ error: 'Component code is required' });
        }

        // Save the component to components directory
        const componentPath = path.join(__dirname, '../components/UserComponent.jsx');
        await fs.writeFile(componentPath, componentCode);
        
        // Update App.jsx to use the new component
        const appPath = path.join(__dirname, '../App.jsx');
        await fs.writeFile(appPath, generateAppCode('UserComponent'));
        
        // Run build command
        await new Promise((resolve, reject) => {
            exec('npm run build', {
                cwd: path.join(__dirname, '../../')
            }, (error, stdout, stderr) => {
                if (error) reject(error);
                else resolve(stdout);
            });
        });
        
        // Create zip file
        const zipPath = path.join(__dirname, '../../dist.zip');
        const output = createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', () => {
            res.download(zipPath, 'dist.zip', async (err) => {
                // Cleanup files after sending
                try {
                    await fs.unlink(zipPath);
                    await fs.unlink(componentPath);
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
            });
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);
        archive.directory(path.join(__dirname, '../../dist/'), 'dist');
        await archive.finalize();
        
    } catch (error) {
        console.error('Build failed:', error);
        res.status(500).json({ error: error.message });
    }
});

function generateAppCode(componentName) {
    return `
        import { useState, useEffect } from 'react'
        import ${componentName} from './components/${componentName}.jsx'

        function App() {
            return (
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col gap-4">
                        <main className="border rounded-lg p-4 bg-white min-h-[600px]">
                            <${componentName} />
                        </main>
                    </div>
                </div>
            )
        }

        export default App
    `;
}

export default router; 