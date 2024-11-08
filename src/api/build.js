import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from 'fs/promises';
import crypto from 'crypto';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cache frequently used paths
const PATHS = {
    deployments: path.join(__dirname, '../../deployments'),
    dist: path.join(__dirname, '../../dist'),
    component: path.join(__dirname, '../components/UserComponent.jsx'),
    app: path.join(__dirname, '../App.jsx'),
    buildCache: path.join(__dirname, '../../.build-cache')
};

// Initialize build cache
async function initializeBuildCache() {
    await mkdir(PATHS.buildCache, { recursive: true });
}
initializeBuildCache().catch(console.error);

// Generate hash for component code
function generateHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}

// Check if build exists in cache
async function getBuildFromCache(hash) {
    try {
        const cachePath = path.join(PATHS.buildCache, hash);
        await fs.access(cachePath);
        return cachePath;
    } catch {
        return null;
    }
}

// Save build to cache
async function saveBuildToCache(hash, distPath) {
    const cachePath = path.join(PATHS.buildCache, hash);
    await fs.cp(distPath, cachePath, { 
        recursive: true,
        filter: (src) => !src.includes('node_modules') && !src.includes('.git')
    });
    return cachePath;
}

router.post('/build', async (req, res) => {
    const { componentCode } = req.body;
    const deploymentId = uuidv4();
    
    if (!componentCode) {
        return res.status(400).json({ error: 'Component code is required' });
    }

    try {
        // Generate hash for the component code
        const codeHash = generateHash(componentCode);
        
        // Create deployment directory
        const deploymentDir = path.join(PATHS.deployments, deploymentId);
        await mkdir(deploymentDir, { recursive: true });

        // Check build cache
        const cachedBuildPath = await getBuildFromCache(codeHash);
        
        if (cachedBuildPath) {
            // Use cached build
            console.log('Using cached build:', codeHash);
            await fs.cp(cachedBuildPath, deploymentDir, { recursive: true });
        } else {
            // Perform new build
            console.log('Creating new build:', codeHash);
            
            // Write files in parallel
            await Promise.all([
                fs.writeFile(PATHS.component, componentCode),
                fs.writeFile(PATHS.app, generateAppCode('UserComponent'))
            ]);

            // Run build
            await runBuild();

            // Save to cache and copy to deployment directory
            await Promise.all([
                saveBuildToCache(codeHash, PATHS.dist),
                fs.cp(PATHS.dist, deploymentDir, { 
                    recursive: true,
                    filter: (src) => !src.includes('node_modules') && !src.includes('.git')
                })
            ]);
        }

        // Update index.html paths
        const indexPath = path.join(deploymentDir, 'index.html');
        let indexContent = await fs.readFile(indexPath, 'utf-8');
        indexContent = indexContent
            .replace(/src="\/assets\//g, 'src="assets/')
            .replace(/href="\/assets\//g, 'href="assets/');
        
        await fs.writeFile(indexPath, indexContent);

        // Send response
        res.json({
            success: true,
            deploymentId,
            deploymentUrl: `/d/${deploymentId}`,
            downloadUrl: `/download/${deploymentId}`,
            fromCache: !!cachedBuildPath
        });

        // Cleanup in background
        if (!cachedBuildPath) {
            cleanup(PATHS.component).catch(err => 
                console.error('Cleanup error:', err)
            );
        }
        
    } catch (error) {
        console.error('Build failed:', error);
        await cleanup(PATHS.component);
        res.status(500).json({ error: error.message });
    }
});

// Cache maintenance - clean old cache entries (older than 7 days)
async function cleanupOldCache() {
    try {
        const cacheEntries = await fs.readdir(PATHS.buildCache);
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

        for (const entry of cacheEntries) {
            const cachePath = path.join(PATHS.buildCache, entry);
            const stats = await fs.stat(cachePath);
            if (now - stats.mtime.getTime() > maxAge) {
                await fs.rm(cachePath, { recursive: true });
            }
        }
    } catch (error) {
        console.error('Cache cleanup error:', error);
    }
}

// Run cache cleanup daily
setInterval(cleanupOldCache, 24 * 60 * 60 * 1000);

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

async function runBuild() {
    return new Promise((resolve, reject) => {
        exec('npm run build', {
            cwd: path.join(__dirname, '../../'),
            maxBuffer: 1024 * 1024 * 10,
            env: { ...process.env, NODE_ENV: 'production' }
        }, (error, stdout, stderr) => {
            if (error) reject(error);
            else resolve(stdout);
        });
    });
}

async function cleanup(componentPath) {
    try {
        await fs.unlink(componentPath);
    } catch (error) {
        console.error('Cleanup error:', error);
    }
}

export default router;