import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import archiver from 'archiver';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post('/build', async (req, res) => {
    try {
        const { componentCode } = req.body;
        const deploymentId = uuidv4();
        
        if (!componentCode) {
            return res.status(400).json({ error: 'Component code is required' });
        }

        // Create deployments directory if it doesn't exist
        const deploymentsDir = path.join(__dirname, '../../deployments');
        await fs.mkdir(deploymentsDir, { recursive: true });

        // Create deployment-specific directory
        const deploymentDir = path.join(deploymentsDir, deploymentId);
        await fs.mkdir(deploymentDir, { recursive: true });

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

        // Copy all contents from dist to deployment directory
        const distDir = path.join(__dirname, '../../dist');
        await fs.cp(distDir, deploymentDir, { recursive: true });

        // Update asset paths in index.html to be relative
        const indexPath = path.join(deploymentDir, 'index.html');
        let indexContent = await fs.readFile(indexPath, 'utf-8');
        
        // Update paths to be relative
        indexContent = indexContent.replace(/src="\/assets\//g, 'src="assets/');
        indexContent = indexContent.replace(/href="\/assets\//g, 'href="assets/');
        
        await fs.writeFile(indexPath, indexContent);

        res.json({
            success: true,
            deploymentId,
            deploymentUrl: `/d/${deploymentId}`,
            downloadUrl: `/download/${deploymentId}`
        });

        // Cleanup temporary files
        try {
            await fs.unlink(componentPath);
        } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
        }
        
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
                <div className="w-screen h-screen">
                    <main className="w-full h-full bg-white">
                        <${componentName} />
                    </main>
                </div>
            )
        }

        export default App
    `;
}

export default router; 