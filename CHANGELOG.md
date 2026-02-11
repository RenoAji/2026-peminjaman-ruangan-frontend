# Changelog

Semua perubahan pada proyek ini akan didokumentasikan di file ini sesuai dengan prinsip Semantic Versioning.

## [0.2.0] - 2026-02-11

### Added

- Implementasi API Service Layer menggunakan **Axios** untuk komunikasi dengan backend.
- Konfigurasi **Axios Instance** dengan dukungan Base URL melalui environment variable.
- Definisi **TypeScript Interfaces** untuk request dan response berdasarkan spesifikasi OpenAPI 3.1.1 (Model Ruangan dan Peminjaman).
- Service functions untuk endpoint `/api/Ruangan` dan `/api/Peminjaman` (GET, POST, PUT, DELETE).

## [0.1.0] - 2026-02-11

### Added

- Inisialisasi proyek frontend menggunakan React/Next.js dengan **TypeScript**.
- Konfigurasi struktur folder standar (`src/components`, `src/services`, `src/hooks`).
- Pengaturan alur kerja Git dengan pembuatan branch `develop` sebagai default branch.
- Penambahan file konfigurasi `.gitignore` dan `.env.example`.

### Documentation

- Pembuatan `README.md` dengan panduan instalasi dan cara menjalankan aplikasi secara lokal.
- Inisialisasi file `CHANGELOG.md` untuk pelacakan versi.
