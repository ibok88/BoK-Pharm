import express, { type Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from 'http-proxy-middleware';
import { setupVite, serveStatic, log } from "./vite";
import { spawn, ChildProcess } from 'child_process';

const app = express();

let pythonProcess: ChildProcess | null = null;

// Start Python backend
function startPythonBackend() {
  log("Starting Python FastAPI backend on port 5001...");
  
  pythonProcess = spawn('uvicorn', ['fastapi_app:app', '--host', '0.0.0.0', '--port', '5001', '--reload'], {
    cwd: './python_server',
    env: { ...process.env, PORT: '5001' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  pythonProcess.stdout?.on('data', (data) => {
    console.log(`[Python] ${data.toString().trim()}`);
  });

  pythonProcess.stderr?.on('data', (data) => {
    console.error(`[Python Error] ${data.toString().trim()}`);
  });

  pythonProcess.on('error', (error) => {
    console.error('Failed to start Python backend:', error);
  });

  pythonProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`Python backend exited with code ${code}`);
    }
  });
}

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Proxy /api requests to Python backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  logLevel: 'silent',
  onError: (err, req, res: any) => {
    console.error('[Proxy Error]:', err.message);
    res.status(503).json({ 
      error: 'Backend service unavailable. Python backend may be starting up.' 
    });
  },
  onProxyReq: (proxyReq, req) => {
    // Pass through all headers
    if (req.headers['x-user-id']) {
      proxyReq.setHeader('X-User-ID', req.headers['x-user-id'] as string);
    }
    if (req.headers['authorization']) {
      proxyReq.setHeader('Authorization', req.headers['authorization'] as string);
    }
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Start Python backend first
  startPythonBackend();
  
  // Wait a bit for Python to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  const server = app.listen({
    port: 0,
    host: "0.0.0.0",
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup vite in development
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Close the temporary server and start on the correct port
  server.close();

  const port = parseInt(process.env.PORT || '5000', 10);
  const finalServer = app.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    log(`Python backend proxied from http://localhost:5001`);
  });

  // Cleanup on exit
  process.on('SIGTERM', () => {
    if (pythonProcess) {
      pythonProcess.kill('SIGTERM');
    }
    finalServer.close();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    if (pythonProcess) {
      pythonProcess.kill('SIGINT');
    }
    finalServer.close();
    process.exit(0);
  });
})();
