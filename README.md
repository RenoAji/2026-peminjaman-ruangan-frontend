# Frontend - Sistem Peminjaman Ruangan

Aplikasi frontend untuk Sistem Peminjaman Ruangan menggunakan React, TypeScript, dan Vite.

## Docker

Untuk menjalankan dengan Docker Compose (backend + frontend + database), lihat [repository infrastructure](https://github.com/RenoAji/2026-peminjaman-ruangan-infrastructure).

## Prerequisites

- **Node.js** v20+ ([Download](https://nodejs.org/))
- **npm** v9+

Verifikasi instalasi:

```bash
node --version
npm --version
```

## Instalasi

1. Clone repository dan masuk ke folder frontend:

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Konfigurasi

1. Buat file `.env` dari template:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` sesuai kebutuhan:
   ```env
   VITE_PROXY_TARGET=http://localhost:5000/api # URL backend API
   ```

## Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Akses aplikasi di: `http://localhost:5173`

### Build Production

```bash
npm run build
npm run preview
```

## Commands

| Command           | Deskripsi                |
| ----------------- | ------------------------ |
| `npm install`     | Install dependencies     |
| `npm run dev`     | Start development server |
| `npm run build`   | Build production         |
| `npm run preview` | Preview production build |
| `npm run lint`    | Check code quality       |

## Integrasi Backend

Frontend berkomunikasi dengan backend melalui Vite proxy:

```
Browser → Vite (5173) → Backend (5000)
```

Pastikan backend berjalan di `http://localhost:5000` sebelum start frontend.

## Troubleshooting

### Port sudah digunakan

```bash
# Gunakan port lain
npm run dev -- --port 3000
```

### Module not found

```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS errors

- Check backend sudah running
- Verify file `.env`
- Restart dev server

## Struktur Folder

```
src/
├── pages/          # Halaman aplikasi
├── services/       # API service layer
├── types/          # TypeScript types
└── App.tsx         # Main app & routing
```
