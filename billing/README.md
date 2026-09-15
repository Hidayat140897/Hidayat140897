# Nota & Faktur

Aplikasi billing pembayaran satu berkas untuk usaha kecil: input transaksi,
lalu cetak **faktur A4**, **nota 80 mm**, atau **bukti bayar** produk digital
dari data yang sama.

Buka `billing/index.html` langsung di browser — tidak perlu server, database,
atau proses build. Bisa juga dipasang sebagai aplikasi dan diterbitkan ke
GitHub Pages; keduanya dijelaskan di bawah.

## Struktur berkas

```
billing/
  index.html              aplikasi lengkap dalam satu berkas
  manifest.webmanifest    identitas aplikasi saat dipasang
  sw.js                   service worker, penyedia mode luring
  icon.svg, icon-*.png    ikon aplikasi dan layar utama
.github/workflows/
  pages.yml               penerbitan otomatis ke GitHub Pages
```

## Isi

| Bagian | Fungsi |
| --- | --- |
| Transaksi | Input pelanggan, baris barang/jasa, diskon, ongkir, PPN, dan pembayaran. Pratinjau dokumen ikut berubah saat mengetik. |
| Bukti bayar | Mode khusus produk digital: pulsa, paket data, token listrik, voucher game, top up e-wallet, tagihan, transfer. |
| Model & ukuran | Empat model nota dan empat ukuran kertas, dipilih di atas pratinjau. |
| Riwayat | Daftar transaksi tersimpan dengan pencarian, filter status, buka kembali, duplikat, dan hapus. |
| Pengaturan | Identitas usaha, NPWP, rekening pembayaran, prefiks nomor, tarif PPN default, dan teks penutup nota. |

Ringkasan di atas halaman menampilkan nilai transaksi bulan berjalan, uang yang
sudah diterima, piutang, dan jumlah dokumen.

## Detail yang mengikuti kebiasaan dokumen Indonesia

- Nomor faktur berpola `INV/2026/IX/0001` — tahun, bulan romawi, nomor urut,
  dihitung otomatis dari transaksi tahun berjalan.
- Baris **Terbilang** pada faktur mengeja total dalam bahasa Indonesia
  (`Tiga juta tujuh ratus lima belas ribu delapan ratus tiga puluh enam rupiah`).
- PPN 11% sebagai default yang bisa dimatikan atau diubah tarifnya.
- Stempel **LUNAS** muncul di faktur begitu sisa tagihan nol.
- Nota memakai lebar 80 mm dan huruf monospace seperti keluaran printer termal.

## Model nota & ukuran kertas

Dua pilihan di atas pratinjau mengubah tampilan nota tanpa menyentuh datanya.

**Model** — empat gaya yang dipilih lewat menu Model:

| Model | Tampilan | Cocok untuk |
| --- | --- | --- |
| Struk termal | Huruf monospace, garis putus-putus, kepala di tengah | Printer termal di kasir |
| Ringkas | Huruf sans, garis tipis, nominal rata kanan | Nota rapi tanpa hiasan |
| Nota kontan | Berbingkai, tabel Banyaknya–Nama Barang–Harga–Jumlah, kolom Tanda Terima dan Hormat Kami | Pengganti buku nota karbon |
| Modern | Nama usaha berwarna, rincian bergaris titik, blok total bernada warna | Nota yang dikirim sebagai gambar |

**Ukuran** — 58 mm, 80 mm, A5, dan A4. Pilihan ini mengatur lebar pratinjau
sekaligus ukuran halaman saat dicetak:

| Ukuran | Halaman cetak | Lebar dokumen |
| --- | --- | --- |
| 58 mm | gulungan 58 mm, margin 3 mm | 52 mm |
| 80 mm | gulungan 80 mm, margin 4 mm | 72 mm |
| A5 | A5, margin 10 mm | selebar area cetak |
| A4 | A4, margin 14 mm | selebar area cetak |

Ukuran juga berlaku untuk bukti bayar. Model apa pun bisa dipasangkan dengan
ukuran apa pun — Nota kontan paling enak dibaca di A5 atau A4, sedangkan Struk
termal dirancang untuk 58 mm dan 80 mm. Pilihan terakhir ikut tersimpan bersama
pengaturan usaha, jadi tidak perlu diatur ulang tiap transaksi.

## Bukti bayar produk digital

Pilih dokumen **Bukti bayar** dan form berganti ke data satu transaksi digital —
jenis transaksi, nama produk, nomor pelanggan, serial number, order ID, waktu,
dan status — menggantikan tabel barang. Bagian barang/jasa tidak terhapus,
hanya disembunyikan, dan kembali muncul saat dokumen lain dipilih.

Dua kolom harga memisahkan yang penting bagi konter:

- **Harga modal** — yang terpotong dari saldo Anda ke provider.
- **Atur harga akhir** — yang tercetak di bukti bayar untuk pelanggan.

Selisihnya tampil sebagai **margin** di bawah kedua kolom, dan berubah merah
menjadi "rugi" bila harga akhir di bawah modal. Hanya harga akhir yang muncul di
dokumen; modal dan margin tinggal di aplikasi.

Order ID terisi otomatis berpola `TRX` + stempel waktu + 4 angka acak, dan tetap
bisa ditimpa dengan nomor asli dari provider. Status `Sukses` menandai transaksi
lunas; `Pending` dan `Gagal` tidak dihitung sebagai uang masuk maupun piutang.

Identitas di kepala bukti bayar diambil dari **Pengaturan** — nama usaha, ID
outlet, dan tagline — bukan merek aplikasi penyedia mana pun.

## Pasang sebagai aplikasi

Aplikasi ini sebuah PWA: begitu dibuka lewat alamat `https://`, ia bisa dipasang
dan dijalankan seperti aplikasi biasa — ada ikonnya di layar utama, terbuka
tanpa bilah alamat, dan tetap jalan tanpa internet.

| Perangkat | Caranya |
| --- | --- |
| Android (Chrome, Edge) | Tombol **Pasang aplikasi** muncul di kanan atas, atau menu ⋮ → *Tambahkan ke layar utama* |
| iPhone / iPad (Safari) | Tombol bagikan → *Add to Home Screen* |
| Windows / macOS (Chrome, Edge) | Ikon pasang di ujung kanan bilah alamat |

Setelah terpasang, seluruh aplikasi disimpan di perangkat oleh `sw.js`, jadi
transaksi tetap bisa dibuat dan nota tetap bisa dicetak saat sinyal hilang —
berguna di konter yang internetnya putus-nyambung. Menu tekan-lama pada ikon
menyediakan pintasan **Transaksi baru** dan **Riwayat**.

Setiap kali `index.html` diubah, naikkan `VERSI` di `sw.js` agar perangkat yang
sudah memasang menarik versi baru. Aplikasi akan memberi tahu lewat pesan
"Versi baru tersedia — muat ulang halaman."

Ini aplikasi web, bukan berkas APK di Play Store. Kalau memang perlu APK,
PWA ini sudah memenuhi syarat untuk dibungkus jadi TWA lewat PWABuilder tanpa
perubahan kode.

## Hosting

Berkas `.github/workflows/pages.yml` menerbitkan folder `billing/` ke GitHub
Pages setiap kali ada perubahan yang masuk ke `main`.

Sekali saja sebelum dipakai: buka **Settings → Pages** pada repositori ini, lalu
setel **Source** menjadi **GitHub Actions**. Sesudah itu setiap push ke `main`
yang menyentuh `billing/` akan menerbitkan ulang dengan sendirinya, dan alamatnya
muncul di ringkasan Actions.

Aplikasi terbit di `https://<pengguna>.github.io/`. Ingin di
`https://<pengguna>.github.io/billing/`? Ganti `path: billing` menjadi `path: .`
pada workflow — semua tautan di dalam aplikasi sudah relatif, jadi keduanya
sama-sama jalan.

Hosting lain juga bisa: unggah isi folder `billing/` ke Netlify, Vercel, Cloudflare
Pages, atau hosting cPanel biasa. Tidak ada proses build dan tidak ada backend.
Syaratnya satu saja, `https://` — service worker dan pemasangan aplikasi tidak
aktif di `http://` biasa maupun saat berkas dibuka langsung dari `file://`
(aplikasinya tetap jalan, hanya mode luring dan tombol pasangnya yang mati).

## Perhitungan

```
subtotal   = Σ qty × harga × (1 − diskon_baris%)
diskon     = rupiah, atau persen dari subtotal (dibatasi maksimal subtotal)
dpp        = subtotal − diskon + ongkir
ppn        = dpp × tarif%          (bila PPN diaktifkan)
total      = bulat(dpp + ppn)
sisa       = total − dibayar       kembalian = dibayar − total
```

Status ditentukan dari sisa: `Lunas`, `Bayar sebagian`, `Belum bayar`, dan
`Jatuh tempo` bila tanggal jatuh tempo sudah lewat sementara sisa masih ada.

Transaksi digital memakai jalur terpisah: total sama dengan harga akhir, tanpa
diskon dan PPN, dan pembayaran dianggap lunas di tempat selama statusnya
`Sukses` — sesuai cara konter bekerja.

## Mencetak

Tombol **Cetak** menyesuaikan ukuran halaman dengan dokumen yang sedang dipilih:
faktur selalu A4 dengan margin 14 mm, sedangkan nota dan bukti bayar mengikuti
pilihan Ukuran di atas pratinjau. Hanya dokumen terpilih yang ikut tercetak.

## Penyimpanan

Data tersimpan di `localStorage` browser. Bila halaman dijalankan sebagai
Artifact di claude.ai, transaksi dan pengaturan ikut tersinkron ke penyimpanan
bersama sehingga terbaca dari perangkat lain, dan tersedia tombol unduh untuk
dokumen `.html` serta cadangan `.json`. Indikator di kanan atas menunjukkan
sumber penyimpanan yang sedang aktif.
