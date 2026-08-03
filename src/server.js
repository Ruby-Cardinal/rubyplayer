import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import { appConfig, loadServerConfig } from './config/config.js';
import { scanAndParseServerFolder } from './services/mediaScanner.js';
import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import systemRoutes from './routes/systemRoutes.js';

loadServerConfig(true);

const app = express();
const PORT = 3001;

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);

const DEFAULT_ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
]);

app.use(cors((req, callback) => {
  const origin = req.header('Origin');
  if (!origin) {
    return callback(null, { origin: true, credentials: true });
  }

  const customAllowed = Array.isArray(appConfig.AllowedOrigins) ? appConfig.AllowedOrigins : [];
  const isAllowed = DEFAULT_ALLOWED_ORIGINS.has(origin) || customAllowed.includes(origin);

  if (isAllowed) {
    return callback(null, { origin: true, credentials: true });
  }

  return callback(null, { origin: false });
}));

app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', authRoutes);
app.use('/api', mediaRoutes);
app.use('/api', systemRoutes);

const DIST_DIR = path.join(process.cwd(), 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html') || filePath.endsWith('sw.js') || filePath.endsWith('manifest.json')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`RubyPlayer Server listening on http://0.0.0.0:${PORT} (all network interfaces)`);
  console.log(`[Server Ready] MusicLocation: "${appConfig.MusicLocation || appConfig.mediaFolder}"`);
  try {
    const { files, playlists } = await scanAndParseServerFolder();
    console.log(`[Server Ready] Media library primed with ${files.length} track(s) and ${playlists.length} playlist(s).`);
  } catch (err) {
    console.error('[Server Scanner] Startup scan notice:', err);
  }
});
