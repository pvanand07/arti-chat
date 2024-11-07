import express from 'express';
import cors from 'cors';
import buildRouter from './api/build.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import archiver from 'archiver';
import { createWriteStream } from 'fs';
import fs from 'fs/promises';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 1001;

app.use(cors());
app.use(express.json());

// Serve static files from the renderer directory
app.use('/', express.static(path.join(__dirname, 'public', 'renderer')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'renderer', 'assets')));

// Serve deployment files with proper MIME types
app.use('/d/:deploymentId', (req, res, next) => {
    const ext = path.extname(req.url).toLowerCase();
    switch (ext) {
        case '.js':
            res.set('Content-Type', 'application/javascript');
            break;
        case '.css':
            res.set('Content-Type', 'text/css');
            break;
        case '.json':
            res.set('Content-Type', 'application/json');
            break;
    }
    
    const deploymentPath = path.join(__dirname, '../deployments', req.params.deploymentId);
    express.static(deploymentPath)(req, res, next);
});

// API routes
app.use('/api', buildRouter);

// Deployment route - handle SPA routing
app.get('/d/:deploymentId/*', (req, res) => {
    const deploymentPath = path.join(__dirname, '../deployments', req.params.deploymentId, 'index.html');
    res.sendFile(deploymentPath);
});

app.get('/d/:deploymentId', (req, res) => {
    const deploymentPath = path.join(__dirname, '../deployments', req.params.deploymentId, 'index.html');
    res.sendFile(deploymentPath);
});

// Download route - create and send zip on demand
app.get('/download/:deploymentId', async (req, res) => {
    try {
        const deploymentDir = path.join(__dirname, '../deployments', req.params.deploymentId);
        const zipPath = path.join(__dirname, '../deployments', `${req.params.deploymentId}.zip`);
        
        // Create zip file
        const output = createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', () => {
            // Send the zip file
            res.download(zipPath, 'dist.zip', async (err) => {
                // Cleanup zip file after sending
                try {
                    await fs.unlink(zipPath);
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
            });
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);
        archive.directory(deploymentDir, 'dist');
        await archive.finalize();

    } catch (error) {
        console.error('Download failed:', error);
        res.status(500).json({ error: 'Failed to create download file' });
    }
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'renderer', 'index.html'));
});

const deploymentsDir = path.join(__dirname, '../deployments');
// Ensure deployments directory exists
try {
    await mkdir(deploymentsDir, { recursive: true });
} catch (err) {
    if (err.code !== 'EEXIST') {
        console.error('Error creating deployments directory:', err);
    }
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend available at http://localhost:${PORT}`);
}); 