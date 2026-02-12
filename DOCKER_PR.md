# Docker Support & Production Deployment

## Summary

Implementasi Docker containerization untuk frontend dengan multi-stage build, Nginx web server, dan integrasi penuh ke Docker Compose stack bersama backend dan database PostgreSQL.

## Changes

### New Files

- **`Dockerfile`**: Multi-stage build dengan Node.js Alpine (builder) dan Nginx Alpine (production)
- **`nginx.conf`**: Konfigurasi Nginx dengan API proxy, security headers, gzip compression, dan asset caching
- **`.dockerignore`**: Exclude files untuk optimasi Docker build size
- **`.env`**: Added `VITE_PROXY_TARGET` untuk konfigurasi proxy backend

### Modified Files

- **`docker-compose.yml`**: Added frontend service dengan port 3000, depends on backend, connected to app-network
- **`vite.config.ts`**: Proxy target sekarang dibaca dari environment variable `VITE_PROXY_TARGET`
- **`src/services/api/axios.config.ts`**: Base URL diubah dari `http://localhost:5000` ke `/api`
- **`CHANGELOG.md`**: Added v0.6.0 entry

## Docker Architecture

### Multi-Stage Build

```dockerfile
# Stage 1: Build Stage
- Base: node:20-alpine
- Install dependencies dengan npm ci
- Build production bundle dengan Vite
- Output: /app/dist

# Stage 2: Production Stage
- Base: nginx:alpine
- Copy built assets dari stage 1
- Copy nginx.conf
- Expose port 80
- Lightweight: ~40MB total
```

### Networking Flow

```
Browser (localhost:3000)
    ↓ HTTP request to /api/*
Frontend Container (Nginx)
    ↓ proxy_pass to http://backend/api/*
Backend Container (port 80) [Docker Internal Network]
    ↓ response
Frontend Container
    ↓ response
Browser
```

## Features

### Nginx Configuration

- ✅ **API Proxy**: Forwards `/api/*` to backend service via Docker DNS
- ✅ **SPA Routing**: `try_files` fallback to `index.html` for React Router
- ✅ **Gzip Compression**: Enabled for text/css/js/json files
- ✅ **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- ✅ **Asset Caching**: 1 year cache for static assets (js/css/images)
- ✅ **No-Cache index.html**: Ensures users get latest version

### Docker Compose Integration

- ✅ **Service Dependencies**: Frontend depends on backend service
- ✅ **Network Isolation**: All services on `app-network` bridge
- ✅ **Port Mapping**: Host 3000 → Container 80
- ✅ **Container Names**: `peminjaman-ruangan-frontend`

### Environment Variables

```bash
# .env (Development)
VITE_API_URL=/api
VITE_PROXY_TARGET=http://localhost:5000

# Docker (Production)
# Uses /api as baseURL (fallback)
# Nginx proxies to backend service
```

## Technical Details

### Why Nginx Proxy?

1. **No CORS Issues**: Browser thinks frontend and API are same origin
2. **Docker Internal Network**: Backend not exposed to host, only accessible via service name
3. **Security**: Backend not directly exposed to public internet
4. **Production Ready**: Same pattern used in cloud deployments
5. **SSL Termination**: Can add HTTPS at nginx layer later

### Build vs Runtime

| Aspect         | Development                  | Docker Production              |
| -------------- | ---------------------------- | ------------------------------ |
| **Server**     | Vite dev server (port 5173)  | Nginx (port 80)                |
| **API Proxy**  | Vite proxy to localhost:5000 | Nginx proxy to backend service |
| **Env Vars**   | Read from .env at runtime    | Baked into JS at build time    |
| **Hot Reload** | ✅ Yes                       | ❌ No (static files)           |
| **Network**    | Host network                 | Docker internal network        |

### API Base URL Resolution

```typescript
// axios.config.ts
baseURL: import.meta.env.VITE_API_URL || "/api";

// Development: reads .env → "/api" → Vite proxy → localhost:5000
// Docker: no .env → fallback "/api" → Nginx proxy → backend:80
```

## How to Use

### Build and Run

```bash
# Navigate to infrastructure folder
cd infrastructure

# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f frontend
```

### Rebuild Frontend Only

```bash
docker-compose up -d --build frontend
```

### Stop Services

```bash
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000 (optional direct access)
- **PostgreSQL**: localhost:5432

## Testing

### Verify API Communication

1. Open http://localhost:3000/rooms
2. Open Browser DevTools → Network tab
3. Should see requests to `/api/Ruangan` returning 200 OK
4. No CORS errors in console

### Verify Docker Network

```bash
# Check if frontend can resolve backend hostname
docker-compose exec frontend ping backend

# Check nginx logs
docker-compose logs frontend

# Check if backend is accessible
docker-compose exec frontend wget -O- http://backend/api/Ruangan
```

### Verify Nginx Configuration

```bash
# Test nginx config syntax
docker-compose exec frontend nginx -t

# Reload nginx
docker-compose exec frontend nginx -s reload
```

## Files Changed

### New Files

- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `frontend/.dockerignore`

### Modified Files

- `infrastructure/docker-compose.yml`
- `frontend/vite.config.ts`
- `frontend/.env`
- `frontend/src/services/api/axios.config.ts`
- `frontend/CHANGELOG.md`

## Production Considerations

### Optimization

- ✅ Multi-stage build reduces image size (~40MB final)
- ✅ Static asset caching with 1 year expiry
- ✅ Gzip compression enabled
- ✅ `.dockerignore` excludes unnecessary files

### Security

- ✅ Security headers configured
- ✅ Backend not directly exposed to public
- ✅ Container runs as non-root (nginx default)

### Scalability

- ✅ Stateless frontend (can scale horizontally)
- ✅ All config externalized via env vars
- ✅ Ready for cloud deployment (AWS ECS, Azure Container Apps, etc.)

## Related Issues

- Closes #6 (Docker support)
- Related to #5 (Room availability feature)

## Checklist

- [x] Dockerfile created and tested
- [x] Nginx configuration working correctly
- [x] Docker Compose integration complete
- [x] API proxy working without CORS issues
- [x] Environment variables configured
- [x] Build optimization implemented
- [x] Security headers added
- [x] Static asset caching configured
- [x] Documentation updated
- [x] Changelog updated

## Notes

### Why Not Use Vite Preview?

- Vite preview is for testing, not production
- Nginx is industry-standard for serving static files
- Nginx provides better performance and features (proxy, caching, compression)
- Smaller image size (Nginx Alpine vs Node.js)

### Future Improvements

- [ ] Add HTTPS support with Let's Encrypt
- [ ] Implement health checks for frontend service
- [ ] Add environment-specific Dockerfiles (dev/staging/prod)
- [ ] Implement CI/CD pipeline for automated builds
- [ ] Add monitoring and logging (Prometheus, Grafana)
