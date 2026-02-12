# Changelog

Semua perubahan pada proyek ini akan didokumentasikan di file ini sesuai dengan prinsip Semantic Versioning.

## [0.4.0] - 2026-02-12

### Added

- Halaman Manajemen Peminjaman (Booking Management UI) lengkap: daftar, filter, detail, form tambah/edit, dan status update.
- Komponen tabel responsif dan kartu mobile untuk peminjaman.
- Modal detail peminjaman dan modal update status (admin).
- Filter status (All, Pending, Approved, Rejected, Completed) dengan badge dan counter.
- Navigasi antara halaman ruangan dan peminjaman.

### Fixed

- Perbaikan bug konversi waktu pada form booking: waktu yang diinput user sekarang tidak bergeser 7 jam (waktu lokal dikirim ke backend tanpa konversi UTC).

## [0.3.0] - 2026-02-12

### Added

- Implementasi halaman Manajemen Ruangan (CRUD) lengkap dengan tabel desktop dan kartu mobile responsif.
- Modal form untuk tambah/edit ruangan dengan validasi input dan state loading.
- Desain UI profesional: header, empty state, badge kapasitas, serta aksi edit/hapus.
- Konfigurasi proxy Vite untuk rute `/api` agar terhubung ke backend lokal.

### Fixed

- Normalisasi ID ruangan dari respons API agar operasi update/delete tidak mengarah ke URL `undefined`.

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
