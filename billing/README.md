# Nota & Faktur

Aplikasi billing pembayaran satu berkas untuk usaha kecil: input transaksi,
lalu cetak **faktur A4** dan **nota 80 mm** dari data yang sama.

Buka `billing/index.html` langsung di browser — tidak perlu server, database,
atau proses build.

## Isi

| Bagian | Fungsi |
| --- | --- |
| Transaksi | Input pelanggan, baris barang/jasa, diskon, ongkir, PPN, dan pembayaran. Pratinjau dokumen ikut berubah saat mengetik. |
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

## Mencetak

Tombol **Cetak** menyesuaikan ukuran halaman dengan dokumen yang sedang dipilih:
A4 dengan margin 14 mm untuk faktur, dan gulungan 80 mm dengan margin 4 mm untuk
nota. Hanya dokumen terpilih yang ikut tercetak.

## Penyimpanan

Data tersimpan di `localStorage` browser. Bila halaman dijalankan sebagai
Artifact di claude.ai, transaksi dan pengaturan ikut tersinkron ke penyimpanan
bersama sehingga terbaca dari perangkat lain, dan tersedia tombol unduh untuk
dokumen `.html` serta cadangan `.json`. Indikator di kanan atas menunjukkan
sumber penyimpanan yang sedang aktif.
