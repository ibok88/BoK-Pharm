import express, { type Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Middleware to capture raw JSON body
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// Proxy /api requests to Python backend
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:5001", // Python backend runs independently
    changeOrigin: true,
    logLevel: "silent",
    onError: (err, _req, res: any) => {
      console.error("[Proxy Error]:", err.message);
      res.status(503).json({
        error: "Backend service unavailable. Python backend may be down.",
      });
    },
    onProxyReq: (proxyReq, req) => {
      // Pass through important headers
      if (req.headers["x-user-id"]) {
        proxyReq.setHeader("X-User-ID", req.headers["x-user-id"] as string);
      }
      if (req.headers["authorization"]) {
        proxyReq.setHeader("Authorization", req.headers["authorization"] as string);
      }
    },
  })
);

// Logging middleware for API requests
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

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

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  throw err;
});

(async () => {
  // Frontend server port
  const port = parseInt(process.env.PORT || "5000", 10);

  // Setup Vite in development, otherwise serve static files
  if (app.get("env") === "development") {
    const server = app.listen(0, "127.0.0.1"); // temporary server for Vite
    await setupVite(app, server);
    server.close();
  } else {
    serveStatic(app);
  }

  // Start frontend server
  const finalServer = app.listen(port, "127.0.0.1", () => {
    log(`Frontend server running on http://127.0.0.1:${port}`);
    log(`Python backend proxied from http://localhost:5001`);
  });

  // Cleanup on exit
  process.on("SIGTERM", () => {
    finalServer.close();
    process.exit(0);
  });

  process.on("SIGINT", () => {
    finalServer.close();
    process.exit(0);
  });
})();
