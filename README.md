# Petualangan Pikachu — Game Edukasi 3D v2

## Fitur
- Three.js 3D scene dengan hutan, jalan, fog, pencahayaan, pepohonan, dan sprite hero/musuh sebagai billboard 3D.
- Pikachu bergerak maju otomatis, bergerak kanan-kiri dengan swipe, lompat, dan menembak listrik.
- Musuh bergerak maju dan menembakkan proyektil ke Pikachu.
- 3 nyawa; terkena serangan mengurangi nyawa. Nyawa habis = kalah.
- 2 musuh (mudah), 3 musuh (sedang), 4 musuh (sulit) sebagai target aktif.
- **Pikachu menembak terlebih dahulu. Jika tembakan mengenai musuh, barulah soal muncul.** Pemain mendapat jeda untuk menjawab. Jawaban benar memberi +100 poin dan membuka tembakan berikutnya. Jika salah, poin berkurang 25 dan soal tetap dapat dicoba sampai benar. Tembakan berikutnya hanya bisa dilakukan setelah jawaban benar.
- 10 soal setiap misi; soal muncul setelah tembakan mengenai musuh.
- Kelas 1–6, 10 mapel: PAI, Matematika, Bahasa Indonesia, Pendidikan Pancasila, IPAS, Bahasa Jawa, Bahasa Inggris, PJOK, Koding, Seni Rupa.
- Solo, Duo, Squad (versi saat ini merupakan mode kerja sama bergiliran pada satu perangkat).
- Pause, kembali ke menu, reward bintang, skor.
- Audio dibuat dengan Web Audio API sebagai efek orisinal bertema petualangan/elektrik; tidak menggunakan rekaman audio resmi Pokémon.

## Menjalankan
Ekstrak ZIP, lalu dari folder proyek jalankan:
`python -m http.server 8000`
Kemudian buka:
`http://localhost:8000`

Three.js dan font dimuat dari CDN sehingga koneksi internet diperlukan.

## Kontrol
HP/tablet/papan interaktif:
- Swipe kiri/kanan pada arena = menghindar.
- TEMBAK = listrik.
- LOMPAT = melompat.
- Ketuk arena = menembak. Jika tembakan mengenai musuh, soal muncul. Jawaban benar membuka tembakan berikutnya.

Laptop:
- A/D atau panah kiri/kanan = gerak.
- W/↑ = lompat.
- Spasi = tembak.
- Esc = pause.

## Catatan kurikulum
Bank soal yang disertakan adalah konten starter/prototipe. Untuk penggunaan sekolah/asesmen, guru perlu meninjau dan memperkaya soal per kelas sesuai CP/ATP/modul ajar dan konteks satuan pendidikan. Desain permainan diarahkan pada aktivitas yang berkesadaran, bermakna, dan menggembirakan.
