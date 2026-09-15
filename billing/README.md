# Nota & Faktur

Aplikasi billing pembayaran satu berkas untuk usaha kecil: input transaksi,
lalu cetak **faktur A4**, **nota 80 mm**, atau **bukti bayar** produk digital
dari data yang sama.

Buka `billing/index.html` langsung di browser — tidak perlu server, database,
atau proses build.

## Isi

| Bagian | Fungsi |
| --- | --- |
| Transaksi | Input pelanggan, baris barang/jasa, diskon, ongkir, PPN, dan pembayaran. Pratinjau dokumen ikut berubah saat mengetik. |
| Bukti bayar | Mode khusus produk digital: pulsa, paket data, token listrik, voucher game, top up e-wallet, tagihan, transfer. |
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
A4 dengan margin 14 mm untuk faktur, dan gulungan 80 mm dengan margin 4 mm untuk
nota maupun bukti bayar. Hanya dokumen terpilih yang ikut tercetak.

## Penyimpanan

Data tersimpan di `localStorage` browser. Bila halaman dijalankan sebagai
Artifact di claude.ai, transaksi dan pengaturan ikut tersinkron ke penyimpanan
bersama sehingga terbaca dari perangkat lain, dan tersedia tombol unduh untuk
dokumen `.html` serta cadangan `.json`. Indikator di kanan atas menunjukkan
sumber penyimpanan yang sedang aktif.
