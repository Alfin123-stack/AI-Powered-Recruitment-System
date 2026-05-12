"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Sparkles,
  Brain,
  Target,
  FileText,
  TrendingUp,
  Zap,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// ── Article Content ───────────────────────────────────────────────────────────
type ArticleContent = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
  tag: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  relatedSlugs: string[];
};

const ARTICLES: ArticleContent[] = [
  {
    slug: "cara-optimasi-cv-lolos-ats",
    title: "Cara Optimasi CV agar Lolos Sistem ATS Perusahaan",
    excerpt:
      "Sebagian besar perusahaan besar kini menggunakan Applicant Tracking System (ATS) untuk menyaring CV secara otomatis. Pelajari cara memformat dan menyusun CV agar tidak gugur di tahap pertama.",
    category: "Tips CV",
    readTime: "7 menit",
    date: "10 Mei 2025",
    featured: true,
    tag: "ATS",
    icon: <Target size={20} />,
    relatedSlugs: [
      "kesalahan-umum-cv-kandidat",
      "tips-cv-fresh-graduate",
      "memahami-job-description",
    ],
    content: (
      <div className="prose-custom">
        <p>
          Lebih dari <strong>75% CV</strong> tidak pernah dibaca oleh manusia.
          Sebelum sampai ke meja rekruter, CV kamu harus melewati satu filter
          pertama yang krusial: Applicant Tracking System, atau yang sering
          disebut ATS.
        </p>
        <h2>Apa Itu ATS?</h2>
        <p>
          ATS adalah perangkat lunak yang digunakan perusahaan untuk menerima,
          menyortir, dan menyaring lamaran kerja secara otomatis. Sistem ini
          mencari kata kunci tertentu, mengevaluasi struktur dokumen, dan
          memberikan skor pada setiap CV sebelum meneruskannya ke tim HR.
        </p>
        <p>
          Perusahaan besar seperti bank, startup unicorn, hingga BUMN hampir
          semuanya menggunakan ATS. Artinya, tidak peduli seberapa bagus
          pengalaman kamu — kalau format CV salah, kamu tidak akan pernah
          dipanggil.
        </p>
        <h2>Mengapa CV Bisa Gagal di ATS?</h2>
        <ul>
          <li>Menggunakan tabel, kolom ganda, atau layout grafis yang rumit</li>
          <li>
            Menyimpan CV dalam format yang salah (JPEG, PNG, atau file desain)
          </li>
          <li>Tidak mencantumkan kata kunci dari job description</li>
          <li>Menggunakan singkatan non-standar tanpa penjelasan</li>
          <li>Header atau footer yang memuat informasi penting</li>
        </ul>
        <h2>5 Langkah Optimasi CV untuk ATS</h2>
        <h3>1. Gunakan Format yang Bersih dan Linear</h3>
        <p>
          ATS membaca CV dari atas ke bawah, kiri ke kanan — sama seperti
          manusia membaca teks biasa. Hindari layout dua kolom karena ATS sering
          membaca kolom kiri dan kanan secara acak, sehingga informasinya jadi
          berantakan.
        </p>
        <p>
          Gunakan format satu kolom yang sederhana. Simpan sebagai{" "}
          <strong>.PDF</strong> (kecuali job posting meminta format lain) atau{" "}
          <strong>.DOCX</strong>.
        </p>
        <h3>2. Cocokkan Kata Kunci dari Job Description</h3>
        <p>
          Baca job description dengan teliti dan identifikasi kata kunci yang
          berulang atau ditekankan. Masukkan kata kunci tersebut secara natural
          ke dalam bagian pengalaman, skill, dan ringkasan profil kamu.
        </p>
        <p>
          Contoh: jika job description menyebut "React.js", "REST API", dan
          "agile methodology" — pastikan ketiga frasa itu muncul di CV kamu
          dalam konteks yang relevan.
        </p>
        <h3>3. Gunakan Judul Seksi yang Standar</h3>
        <p>
          ATS mengenali judul seksi standar seperti:{" "}
          <em>Pengalaman Kerja, Pendidikan, Keahlian, Sertifikasi</em>. Hindari
          judul kreatif seperti "Perjalanan Karier" atau "Apa yang Bisa Saya
          Lakukan" — ATS tidak akan mengenalinya.
        </p>
        <h3>4. Tulis Pencapaian dengan Angka</h3>
        <p>
          ATS memberikan nilai lebih pada CV yang mencantumkan pencapaian
          terukur. Ubah deskripsi umum menjadi pernyataan konkret:
        </p>
        <ul>
          <li>❌ "Bertanggung jawab atas penjualan"</li>
          <li>
            ✅ "Meningkatkan penjualan sebesar 32% dalam 3 bulan melalui
            strategi upselling"
          </li>
        </ul>
        <h3>5. Isi Informasi Kontak Secara Lengkap</h3>
        <p>
          Pastikan nama, email, nomor telepon, dan kota tempat tinggal tercantum
          jelas di bagian atas CV — bukan di header atau footer dokumen, karena
          ATS sering melewatkan konten di area tersebut.
        </p>
        <h2>Cek ATS Score CV Kamu Sekarang</h2>
        <p>
          Daripada menebak-nebak apakah CV kamu sudah ATS-friendly, kamu bisa
          langsung cek menggunakan fitur analisis CV RecruitAI. Sistem kami akan
          mengevaluasi CV kamu dan memberikan ATS Score beserta rekomendasi
          perbaikan yang spesifik per bagian.
        </p>
      </div>
    ),
  },
  {
    slug: "skill-yang-paling-dicari-2025",
    title: "10 Skill yang Paling Dicari Perusahaan Teknologi di 2025",
    excerpt:
      "Lanskap teknologi berubah cepat. Dari AI/ML hingga cloud computing — ini daftar skill yang wajib kamu miliki jika ingin bersaing di pasar kerja tech tahun ini.",
    category: "Tren Industri",
    readTime: "6 menit",
    date: "8 Mei 2025",
    featured: true,
    tag: "Karier",
    icon: <TrendingUp size={20} />,
    relatedSlugs: [
      "cara-optimasi-cv-lolos-ats",
      "bangun-personal-branding-linkedin",
      "memahami-job-description",
    ],
    content: (
      <div className="prose-custom">
        <p>
          Pasar kerja teknologi di Indonesia sedang bergerak cepat. Perusahaan
          tidak lagi hanya mencari programmer — mereka mencari orang yang bisa
          berkolaborasi dengan AI, memahami data, dan beradaptasi dengan
          perubahan cepat.
        </p>
        <h2>Kenapa Daftar Skill Terus Berubah?</h2>
        <p>
          Kemunculan tools AI generatif, pertumbuhan cloud infrastructure, dan
          meningkatnya kebutuhan keamanan siber telah menggeser prioritas hiring
          secara signifikan dalam 12 bulan terakhir. Skill yang "cukup baik" dua
          tahun lalu kini sudah menjadi baseline minimum.
        </p>
        <h2>10 Skill Teratas yang Paling Dicari di 2025</h2>
        <h3>1. Prompt Engineering & AI Literacy</h3>
        <p>
          Kemampuan berinteraksi efektif dengan model AI (ChatGPT, Claude,
          Gemini) dan mengintegrasikannya ke dalam workflow kerja menjadi skill
          yang hampir universal diminta, bukan hanya di posisi teknis.
        </p>
        <h3>2. Cloud Computing (AWS / GCP / Azure)</h3>
        <p>
          Perpindahan infrastruktur ke cloud terus berlanjut. Sertifikasi AWS
          Solutions Architect atau Google Cloud Professional menjadi pembeda
          kuat di antara kandidat dengan latar belakang serupa.
        </p>
        <h3>3. Data Analytics & SQL</h3>
        <p>
          Kemampuan membaca dan menganalisis data menjadi syarat di hampir semua
          posisi — bukan hanya data analyst. Product manager, marketer, hingga
          HR kini diharapkan bisa membaca dashboard dan menarik insight dari
          data.
        </p>
        <h3>4. Machine Learning Engineering</h3>
        <p>
          Bukan sekadar tahu teorinya, tapi bisa deploy model ML ke production.
          PyTorch, TensorFlow, dan MLOps pipeline menjadi skill yang sangat
          dicari di startup dan perusahaan teknologi menengah ke atas.
        </p>
        <h3>5. React / Next.js (Frontend)</h3>
        <p>
          Framework JavaScript ini tetap mendominasi posisi frontend developer.
          Kombinasi React + TypeScript + state management (Zustand/Redux) adalah
          stack standar yang diminta hampir semua job description frontend.
        </p>
        <h3>6. Cybersecurity Fundamentals</h3>
        <p>
          Insiden keamanan yang meningkat membuat perusahaan aktif mencari
          kandidat yang memahami OWASP Top 10, penetration testing dasar, dan
          security-first development practices.
        </p>
        <h3>7. DevOps & CI/CD</h3>
        <p>
          Docker, Kubernetes, GitHub Actions, dan Jenkins — kemampuan membangun
          dan mengelola pipeline deployment menjadi nilai tambah besar bahkan
          untuk posisi backend developer.
        </p>
        <h3>8. UI/UX Design & Figma</h3>
        <p>
          Dengan semakin banyaknya produk digital, kebutuhan desainer yang bisa
          bekerja cepat menggunakan Figma dan memahami prinsip user research
          terus meningkat.
        </p>
        <h3>9. Product Management</h3>
        <p>
          Kombinasi technical literacy + business acumen + kemampuan komunikasi
          membuat product manager menjadi salah satu posisi dengan demand
          tertinggi namun supply paling terbatas.
        </p>
        <h3>10. Communication & Stakeholder Management</h3>
        <p>
          Soft skill ini sering diremehkan, tapi survei rekruter konsisten
          menunjukkan bahwa kemampuan komunikasi yang baik membedakan kandidat
          yang dipromosikan dari yang sekadar kompeten secara teknis.
        </p>
        <h2>Langkah Selanjutnya</h2>
        <p>
          Upload CV kamu dan lihat skill mana yang sudah terdeteksi oleh sistem
          AI kami. Kamu juga bisa langsung melihat lowongan yang paling cocok
          berdasarkan profil skill-mu saat ini.
        </p>
      </div>
    ),
  },
  {
    slug: "tips-cv-fresh-graduate",
    title: "Panduan Lengkap Membuat CV untuk Fresh Graduate",
    excerpt:
      "Belum punya pengalaman kerja tapi ingin CV kamu tetap kuat? Ini strategi yang dipakai fresh graduate untuk menarik perhatian rekruter dan lolos seleksi awal.",
    category: "Tips CV",
    readTime: "8 menit",
    date: "5 Mei 2025",
    tag: "Fresh Graduate",
    icon: <FileText size={20} />,
    relatedSlugs: [
      "cara-optimasi-cv-lolos-ats",
      "kesalahan-umum-cv-kandidat",
      "persiapan-interview-kerja",
    ],
    content: (
      <div className="prose-custom">
        <p>
          Menjadi fresh graduate bukan berarti CV kamu harus kosong atau lemah.
          Rekruter yang baik tahu cara membaca potensi — tugasmu adalah
          menampilkan potensi itu dengan cara yang tepat.
        </p>
        <h2>Mindset yang Harus Diubah</h2>
        <p>
          Banyak fresh graduate terjebak dalam pola pikir "saya tidak punya
          pengalaman". Padahal, kamu punya: proyek kuliah, organisasi, magang,
          freelance, kompetisi, penelitian, dan banyak lagi. Masalahnya bukan
          kurangnya pengalaman — tapi cara mengemasnya.
        </p>
        <h2>Struktur CV Fresh Graduate yang Efektif</h2>
        <h3>1. Professional Summary yang Kuat</h3>
        <p>
          Tulis 3–4 kalimat yang merangkum siapa kamu, apa keahlian utamamu, dan
          apa yang kamu cari. Hindari klise seperti "saya adalah orang yang
          pekerja keras dan mau belajar" — semua orang menulis itu.
        </p>
        <p>
          Contoh yang lebih kuat:{" "}
          <em>
            "Fresh graduate Teknik Informatika dengan pengalaman magang 6 bulan
            sebagai backend developer dan portofolio 3 aplikasi web menggunakan
            Node.js dan React. Tertarik berkontribusi di tim produk yang
            berfokus pada skalabilitas dan user experience."
          </em>
        </p>
        <h3>2. Proyek sebagai Pengganti Pengalaman</h3>
        <p>
          Buat seksi "Proyek" yang menonjol. Untuk setiap proyek, tulis: nama
          proyek, teknologi yang digunakan, kontribusimu, dan hasilnya (kalau
          ada). Sertakan link GitHub atau demo jika memungkinkan.
        </p>
        <h3>3. Pengalaman Organisasi dengan Konteks</h3>
        <p>
          Jangan hanya tulis nama jabatan. Tambahkan konteks: berapa anggota
          yang kamu koordinasi, acara apa yang kamu kelola, dampak apa yang kamu
          hasilkan. Rekruter ingin melihat kemampuan leadership dan kolaborasi,
          bukan sekadar daftar nama organisasi.
        </p>
        <h3>4. Skill Section yang Jujur</h3>
        <p>
          Pisahkan antara hard skill (tools, bahasa pemrograman, software) dan
          soft skill. Jangan berlebihan — jika kamu mencantumkan "Expert Python"
          tapi tidak bisa menjawab pertanyaan dasar di interview, itu akan
          menjadi masalah besar.
        </p>
        <h3>5. Pendidikan dengan Detail yang Relevan</h3>
        <p>
          Selain nama universitas dan jurusan, tambahkan IPK (jika di atas 3.2),
          mata kuliah relevan, penghargaan akademik, atau penelitian/skripsi
          yang berkaitan dengan posisi yang dilamar.
        </p>
        <h2>Kesalahan yang Sering Dilakukan Fresh Graduate</h2>
        <ul>
          <li>Mencantumkan pengalaman SD, SMP, dan SMA yang tidak relevan</li>
          <li>Foto yang tidak profesional atau tidak ada sama sekali</li>
          <li>CV lebih dari 2 halaman padahal pengalaman minim</li>
          <li>Tidak menyesuaikan CV untuk setiap posisi yang dilamar</li>
          <li>
            Mencantumkan referensi "tersedia jika diminta" — ini tidak
            diperlukan
          </li>
        </ul>
        <h2>Satu Tip Terakhir</h2>
        <p>
          Sebelum submit, analisis dulu CV kamu menggunakan RecruitAI. Kamu akan
          tahu persis bagian mana yang perlu diperkuat dan apakah CV kamu sudah
          cukup ATS-friendly untuk posisi yang kamu incar.
        </p>
      </div>
    ),
  },
  {
    slug: "kesalahan-umum-cv-kandidat",
    title: "7 Kesalahan Fatal CV yang Sering Dilakukan Kandidat",
    excerpt:
      "Rekruter hanya menghabiskan 7 detik untuk membaca satu CV. Pastikan CV kamu tidak melakukan kesalahan-kesalahan ini yang langsung mengirimmu ke tumpukan reject.",
    category: "Tips CV",
    readTime: "5 menit",
    date: "2 Mei 2025",
    tag: "CV",
    icon: <Brain size={20} />,
    relatedSlugs: [
      "cara-optimasi-cv-lolos-ats",
      "tips-cv-fresh-graduate",
      "cara-menulis-ringkasan-profesional",
    ],
    content: (
      <div className="prose-custom">
        <p>
          Rata-rata rekruter menghabiskan <strong>7 detik</strong> untuk
          keputusan awal apakah sebuah CV layak dilanjutkan atau tidak. Tujuh
          detik. Dalam waktu sesingkat itu, kesalahan kecil bisa berakhir fatal.
        </p>
        <h2>7 Kesalahan yang Langsung Merusak Kesan Pertama</h2>
        <h3>1. Foto yang Tidak Profesional</h3>
        <p>
          Foto selfie, foto liburan yang di-crop, atau foto dengan ekspresi
          tidak serius langsung menurunkan kredibilitas CV secara dramatis.
          Gunakan foto formal dengan latar belakang netral, pakaian profesional,
          dan ekspresi ramah namun serius.
        </p>
        <h3>2. Objective Statement yang Generik</h3>
        <p>
          "Saya ingin bergabung dengan perusahaan yang baik untuk mengembangkan
          karier saya" — kalimat semacam ini tidak memberikan nilai apapun.
          Ganti dengan professional summary yang spesifik dan relevan dengan
          posisi yang dilamar.
        </p>
        <h3>3. Deskripsi Tugas Tanpa Pencapaian</h3>
        <p>
          Menulis "bertanggung jawab atas pengelolaan media sosial" hanya
          menjelaskan tugas, bukan nilai yang kamu berikan. Ubah menjadi:
          "Mengelola 4 platform media sosial dan meningkatkan engagement rate
          rata-rata 45% dalam 6 bulan."
        </p>
        <h3>4. Typo dan Kesalahan Tata Bahasa</h3>
        <p>
          Ini mungkin terdengar sepele, tapi kesalahan ejaan mengirimkan sinyal
          kuat: kurang teliti dan tidak serius. Baca ulang CV kamu minimal dua
          kali, gunakan grammar checker, dan minta orang lain untuk membacanya
          sebelum dikirim.
        </p>
        <h3>5. Format yang Tidak Konsisten</h3>
        <p>
          Font yang berbeda-beda, ukuran yang tidak seragam, bullet point yang
          tidak sejajar — semua ini membuat CV terlihat berantakan dan tidak
          profesional. Konsistensi visual mencerminkan kerapian dan perhatian
          terhadap detail.
        </p>
        <h3>6. Terlalu Panjang atau Terlalu Pendek</h3>
        <p>
          Untuk kandidat dengan pengalaman di bawah 5 tahun, CV yang ideal
          adalah 1–2 halaman. Lebih dari itu cenderung diisi konten yang tidak
          relevan. Kurang dari satu halaman penuh mungkin menandakan kamu tidak
          cukup menjelaskan value kamu.
        </p>
        <h3>7. Tidak Disesuaikan dengan Posisi</h3>
        <p>
          Mengirim CV yang sama persis ke semua perusahaan adalah kesalahan
          terbesar. Setiap posisi memiliki kebutuhan berbeda — sesuaikan kata
          kunci, urutan skill, dan penekanan pengalaman untuk setiap lamaran.
        </p>
        <h2>Cara Cepat Mengecek CV Kamu</h2>
        <p>
          Tidak yakin apakah CV kamu masih melakukan salah satu kesalahan di
          atas? Analisis CV kamu di RecruitAI dan dapatkan feedback spesifik
          untuk setiap bagian dokumenmu.
        </p>
      </div>
    ),
  },
  {
    slug: "cara-menulis-ringkasan-profesional",
    title: "Cara Menulis Professional Summary yang Bikin Rekruter Tertarik",
    excerpt:
      "Professional summary adalah kesan pertama di CV kamu — 3–5 kalimat yang menentukan apakah rekruter akan terus membaca atau melewatinya.",
    category: "Tips CV",
    readTime: "6 menit",
    date: "28 Apr 2025",
    tag: "CV",
    icon: <FileText size={20} />,
    relatedSlugs: [
      "kesalahan-umum-cv-kandidat",
      "tips-cv-fresh-graduate",
      "cara-optimasi-cv-lolos-ats",
    ],
    content: (
      <div className="prose-custom">
        <p>
          Professional summary adalah 3–5 kalimat pertama yang rekruter baca di
          CV kamu. Ini adalah "elevator pitch" tertulis — kesempatan kamu untuk
          meyakinkan mereka dalam waktu 10 detik bahwa kamu layak dibaca lebih
          lanjut.
        </p>
        <h2>Kenapa Professional Summary Penting?</h2>
        <p>
          Rekruter membaca puluhan hingga ratusan CV per hari. Summary yang kuat
          membantu mereka langsung memahami siapa kamu, apa yang kamu tawarkan,
          dan apakah kamu relevan untuk posisi tersebut — tanpa harus
          mencari-cari informasi di seluruh dokumen.
        </p>
        <h2>Formula Professional Summary yang Efektif</h2>
        <p>Gunakan struktur ini sebagai panduan:</p>
        <ul>
          <li>
            <strong>Kalimat 1:</strong> Siapa kamu (title, tahun pengalaman,
            spesialisasi)
          </li>
          <li>
            <strong>Kalimat 2:</strong> Pencapaian atau keahlian utama yang
            paling relevan
          </li>
          <li>
            <strong>Kalimat 3:</strong> Apa yang kamu cari atau value yang ingin
            kamu bawa
          </li>
        </ul>
        <h2>Contoh Perbandingan</h2>
        <h3>❌ Yang Umum (Hindari):</h3>
        <p>
          <em>
            "Saya adalah individu yang berdedikasi, pekerja keras, dan mampu
            bekerja dalam tim maupun individu. Saya siap belajar hal baru dan
            memberikan kontribusi terbaik untuk perusahaan."
          </em>
        </p>
        <p>
          Ini tidak memberikan informasi spesifik apapun. Semua orang bisa
          menulis ini.
        </p>
        <h3>✅ Yang Kuat:</h3>
        <p>
          <em>
            "Backend developer dengan 3 tahun pengalaman membangun REST API dan
            microservices menggunakan Node.js dan PostgreSQL. Berkontribusi pada
            sistem yang melayani 500K+ pengguna aktif di startup fintech.
            Mencari peran senior engineer di tim yang berorientasi pada
            skalabilitas dan engineering best practices."
          </em>
        </p>
        <h2>Tips Tambahan</h2>
        <ul>
          <li>Sesuaikan summary untuk setiap posisi yang kamu lamar</li>
          <li>Gunakan kata kunci dari job description secara natural</li>
          <li>
            Tulis dalam sudut pandang orang pertama tapi tanpa kata "saya" di
            awal kalimat
          </li>
          <li>
            Hindari klise: "passionate", "team player", "results-driven" tanpa
            bukti konkret
          </li>
        </ul>
        <p>
          Setelah menulis summary baru, coba analisis CV kamu di RecruitAI untuk
          melihat apakah perubahannya meningkatkan skor keseluruhan CV kamu.
        </p>
      </div>
    ),
  },
  {
    slug: "persiapan-interview-kerja",
    title: "Strategi Persiapan Interview Kerja yang Terbukti Efektif",
    excerpt:
      "Lolos seleksi CV adalah setengah perjalanan. Pelajari cara mempersiapkan diri untuk interview, mulai dari riset perusahaan hingga menjawab pertanyaan jebakan.",
    category: "Karier",
    readTime: "9 menit",
    date: "25 Apr 2025",
    tag: "Interview",
    icon: <Zap size={20} />,
    relatedSlugs: [
      "tips-cv-fresh-graduate",
      "cara-optimasi-cv-lolos-ats",
      "bangun-personal-branding-linkedin",
    ],
    content: (
      <div className="prose-custom">
        <p>
          Mendapat undangan interview adalah pencapaian besar. Tapi tanpa
          persiapan yang tepat, bahkan kandidat terkualifikasi pun bisa gagal di
          tahap ini. Persiapan bukan tentang menghafal jawaban — tapi tentang
          membangun kepercayaan diri yang genuine.
        </p>
        <h2>Sebelum Interview: Riset yang Tidak Bisa Dilewati</h2>
        <h3>1. Pelajari Perusahaan Secara Mendalam</h3>
        <p>
          Baca website perusahaan, laporan tahunan (untuk perusahaan publik),
          berita terbaru, dan ulasan di Glassdoor atau LinkedIn. Pahami: apa
          produk/layanan mereka, siapa target pasarnya, apa tantangan industri
          yang mereka hadapi, dan apa values perusahaan.
        </p>
        <h3>2. Pahami Job Description Luar Dalam</h3>
        <p>
          Identifikasi 5 tanggung jawab utama dan 5 kualifikasi yang paling
          ditekankan. Siapkan contoh konkret dari pengalamanmu yang relevan
          dengan setiap poin tersebut.
        </p>
        <h3>3. Riset Pewawancara</h3>
        <p>
          Jika kamu tahu siapa yang akan menginterviewmu, cek LinkedIn mereka.
          Pahami background dan area keahlian mereka — ini membantu kamu
          membangun koneksi yang lebih natural selama wawancara.
        </p>
        <h2>Metode STAR untuk Menjawab Pertanyaan Behavioral</h2>
        <p>
          Pertanyaan seperti "Ceritakan situasi di mana kamu menghadapi konflik
          di tim" paling efektif dijawab dengan metode STAR:
        </p>
        <ul>
          <li>
            <strong>S</strong>ituation — konteks situasinya
          </li>
          <li>
            <strong>T</strong>ask — apa tanggung jawabmu
          </li>
          <li>
            <strong>A</strong>ction — tindakan konkret yang kamu ambil
          </li>
          <li>
            <strong>R</strong>esult — hasil yang bisa diukur
          </li>
        </ul>
        <h2>Pertanyaan Jebakan dan Cara Menjawabnya</h2>
        <h3>"Apa kelemahan terbesar kamu?"</h3>
        <p>
          Jangan bilang "Saya terlalu perfeksionis" — itu klise dan tidak
          dipercaya. Pilih kelemahan nyata yang tidak critical untuk posisi
          tersebut, dan selalu sertakan langkah konkret yang sedang kamu ambil
          untuk memperbaikinya.
        </p>
        <h3>"Kenapa kamu meninggalkan pekerjaan sebelumnya?"</h3>
        <p>
          Selalu framing secara positif — fokus pada apa yang kamu cari
          (pertumbuhan, tantangan baru, lingkungan tertentu) daripada apa yang
          kamu hindari dari tempat lama.
        </p>
        <h2>Pertanyaan yang Harus Kamu Tanyakan Balik</h2>
        <p>
          Interview adalah percakapan dua arah. Siapkan 3–5 pertanyaan bermakna
          tentang: kultur tim, ekspektasi 90 hari pertama, tantangan terbesar
          posisi ini, atau kesempatan pengembangan karier.
        </p>
        <p>
          Pastikan CV yang kamu bawa ke interview sudah dioptimasi — analisis
          dulu dengan RecruitAI agar kamu tahu persis kekuatan dan kelemahan CV
          kamu sebelum berhadapan dengan rekruter.
        </p>
      </div>
    ),
  },
  {
    slug: "memahami-job-description",
    title: "Cara Membaca Job Description dan Menyesuaikan CV",
    excerpt:
      "Mengirim CV yang sama ke semua lowongan adalah kesalahan besar. Pelajari cara membaca job description dengan cermat dan menyesuaikan CV untuk setiap posisi.",
    category: "Tips CV",
    readTime: "7 menit",
    date: "20 Apr 2025",
    tag: "CV",
    icon: <BookOpen size={20} />,
    relatedSlugs: [
      "cara-optimasi-cv-lolos-ats",
      "kesalahan-umum-cv-kandidat",
      "cara-menulis-ringkasan-profesional",
    ],
    content: (
      <div className="prose-custom">
        <p>
          Job description bukan sekadar daftar tugas — ini adalah blueprint
          untuk CV yang sempurna. Setiap kata yang dipilih perusahaan dalam JD
          adalah petunjuk tentang apa yang mereka cari, dan tugasmu adalah
          mencerminkan itu di dalam CV kamu.
        </p>
        <h2>Cara Membaca JD Secara Strategis</h2>
        <h3>Layer 1: Identifikasi Kata Kunci Hard Skill</h3>
        <p>
          Scan seluruh JD dan tandai semua teknologi, tools, bahasa pemrograman,
          sertifikasi, atau metodologi yang disebutkan. Ini adalah kata kunci
          yang dicari ATS. Jika kamu memiliki skill tersebut, pastikan muncul di
          CV dengan frasa yang sama persis.
        </p>
        <h3>Layer 2: Temukan Prioritas Tersembunyi</h3>
        <p>
          Perhatikan urutan dan frekuensi. Skill yang disebut pertama atau
          paling sering biasanya adalah yang paling penting. JD yang menyebut
          "Python" di 4 tempat berbeda jelas menginginkan Python developer yang
          kuat, bukan sekadar familiar.
        </p>
        <h3>Layer 3: Baca Antara Baris untuk Soft Skill</h3>
        <p>
          Frasa seperti "fast-paced environment", "cross-functional team", atau
          "ambiguous situations" adalah kode untuk skill tertentu. Siapkan
          contoh dari pengalamanmu yang menunjukkan kamu bisa handle konteks
          tersebut.
        </p>
        <h2>Template Penyesuaian CV per Posisi</h2>
        <p>
          Buat "master CV" yang berisi semua pengalaman dan skill kamu. Untuk
          setiap lamaran baru:
        </p>
        <ul>
          <li>Sesuaikan professional summary dengan bahasa dari JD</li>
          <li>Urutkan skill berdasarkan relevansi dengan posisi tersebut</li>
          <li>
            Pilih bullet point pengalaman yang paling relevan (jangan masukkan
            semua)
          </li>
          <li>Pastikan kata kunci utama dari JD muncul di CV</li>
        </ul>
        <h2>Berapa Lama Waktu yang Dibutuhkan?</h2>
        <p>
          Penyesuaian CV untuk satu posisi seharusnya memakan waktu 15–30 menit,
          bukan berjam-jam. Jika kamu punya master CV yang baik dan sudah
          memahami cara membaca JD, prosesnya akan sangat efisien.
        </p>
        <p>
          Setelah menyesuaikan CV untuk sebuah posisi, analisis dengan RecruitAI
          untuk memastikan kata kunci yang kamu masukkan sudah terdeteksi dan
          skor kecocokannya optimal.
        </p>
      </div>
    ),
  },
  {
    slug: "bangun-personal-branding-linkedin",
    title:
      "Membangun Personal Branding di LinkedIn untuk Karier yang Lebih Baik",
    excerpt:
      "LinkedIn bukan sekadar CV online — ini platform di mana rekruter aktif mencari kandidat. Pelajari cara mengoptimalkan profil dan membangun jaringan yang bermakna.",
    category: "Karier",
    readTime: "8 menit",
    date: "15 Apr 2025",
    tag: "LinkedIn",
    icon: <TrendingUp size={20} />,
    relatedSlugs: [
      "skill-yang-paling-dicari-2025",
      "persiapan-interview-kerja",
      "cara-menulis-ringkasan-profesional",
    ],
    content: (
      <div className="prose-custom">
        <p>
          Lebih dari <strong>87% rekruter</strong> menggunakan LinkedIn untuk
          menemukan kandidat. Artinya, profil LinkedIn yang kuat bisa membuat
          rekruter datang kepadamu — bukan sebaliknya.
        </p>
        <h2>Elemen Profil LinkedIn yang Wajib Dioptimasi</h2>
        <h3>1. Foto Profil dan Banner</h3>
        <p>
          Foto profil profesional meningkatkan views profil hingga 21x. Gunakan
          foto dengan pencahayaan baik, latar belakang netral, dan ekspresi
          profesional. Banner image adalah ruang gratis untuk menampilkan
          tagline atau visual industri yang kamu geluti.
        </p>
        <h3>2. Headline yang Lebih dari Sekadar Jabatan</h3>
        <p>
          Jangan hanya tulis "Software Engineer at Tokopedia" — itu standar
          minimum. Gunakan headline yang menjelaskan value kamu: "Backend
          Engineer | Node.js & Microservices | Building scalable systems for 1M+
          users".
        </p>
        <h3>3. About Section sebagai Story</h3>
        <p>
          About section bukan tempat untuk copy-paste CV. Tulis dalam gaya
          percakapan yang menjelaskan perjalanan profesionalmu, apa yang kamu
          passionate tentangnya, dan apa yang kamu cari. Sertakan cara terbaik
          untuk menghubungimu.
        </p>
        <h3>4. Experience dengan Pencapaian Terukur</h3>
        <p>
          Sama seperti CV, tulis pencapaian konkret dengan angka. LinkedIn
          memberi kamu lebih banyak ruang dibanding CV — manfaatkan untuk
          bercerita lebih detail tentang kontribusimu.
        </p>
        <h3>5. Skills dan Endorsement</h3>
        <p>
          Tambahkan skill yang relevan dan minta kolega atau atasan untuk
          memberikan endorsement. LinkedIn memprioritaskan profil dengan skill
          yang ter-endorse dalam hasil pencarian rekruter.
        </p>
        <h2>Strategi Konten untuk Membangun Visibility</h2>
        <p>
          Posting konten 2–3 kali per minggu tentang insight industri,
          pembelajaran baru, atau proyek yang sedang kamu kerjakan. Kamu tidak
          perlu viral — cukup konsisten dan relevan untuk audiensmu. Rekruter
          dan hiring manager yang melihat postinganmu secara reguler akan lebih
          mudah ingat namamu saat ada posisi yang cocok.
        </p>
        <h2>Networking yang Bermakna</h2>
        <p>
          Saat mengirim connection request, selalu sertakan pesan personal yang
          menjelaskan kenapa kamu ingin terhubung. "Saya tertarik dengan
          pekerjaan yang kamu lakukan di [perusahaan] dan ingin belajar lebih
          banyak tentang [topik]" jauh lebih efektif daripada request kosong.
        </p>
        <p>
          Pastikan skill yang kamu highlight di LinkedIn konsisten dengan yang
          ada di CV kamu. Analisis CV di RecruitAI untuk tahu skill apa saja
          yang sudah terdeteksi dari dokumenmu.
        </p>
      </div>
    ),
  },
];

const ARTICLE_MAP = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

// ── ✅ FIX: Next.js 14 App Router — params must be unwrapped with `use()` ────
interface Props {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: Props) {
  // ✅ Unwrap the params Promise with React.use()
  const { slug } = use(params);
  const article = ARTICLE_MAP[slug];

  if (!article) notFound();

  const related = article.relatedSlugs
    .map((s) => ARTICLE_MAP[s])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <Navbar />

      <style>{`
        .prose-custom { color: #b8cfc0; font-size: 0.95rem; line-height: 1.82; }
        .prose-custom p { margin-bottom: 1.2rem; }
        .prose-custom h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.3rem;
          color: #e8f0ec;
          margin: 2.2rem 0 0.9rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(16,185,129,0.12);
        }
        .prose-custom h3 {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: #d4e8d8;
          margin: 1.6rem 0 0.6rem;
        }
        .prose-custom ul { list-style: none; padding: 0; margin: 0 0 1.2rem; }
        .prose-custom ul li {
          padding-left: 1.4rem;
          position: relative;
          margin-bottom: 0.5rem;
        }
        .prose-custom ul li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.6rem;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #10b981;
        }
        .prose-custom strong { color: #e8f0ec; font-weight: 700; }
        .prose-custom em { color: #9ab5a5; font-style: italic; }
        .prose-custom a { color: #34d399; text-decoration: underline; }
      `}</style>

      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="max-w-[760px] mx-auto px-6 pt-10 pb-0">
          <nav
            className="flex items-center gap-2 text-[0.75rem] text-[#4a6b58]"
            aria-label="Breadcrumb">
            <Link
              href="/"
              className="hover:text-emerald-400 transition-colors no-underline">
              Beranda
            </Link>
            <ChevronRight size={12} />
            <Link
              href="/blog"
              className="hover:text-emerald-400 transition-colors no-underline">
              Blog
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#7a9585]">{article.category}</span>
          </nav>
        </div>

        {/* Article header */}
        <header className="max-w-[760px] mx-auto px-6 pt-8 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center gap-3 flex-wrap mb-5">
              {article.featured && (
                <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 text-amber-400 px-[10px] py-[4px] rounded-full text-[0.65rem] font-bold tracking-[0.08em] uppercase">
                  <Sparkles size={9} /> Pilihan Editor
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-[10px] py-[4px] rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.07em]">
                {article.category}
              </span>
              <span className="bg-emerald-500/[0.07] border border-emerald-500/15 text-emerald-300/70 px-[9px] py-[3px] rounded-full text-[0.63rem] font-medium">
                {article.tag}
              </span>
            </div>

            <h1 className="font-syne font-extrabold text-[clamp(1.7rem,4vw,2.4rem)] leading-[1.2] tracking-tight text-[#e8f0ec] mb-5">
              {article.title}
            </h1>

            <p className="text-[#7a9585] text-[1rem] leading-[1.7] mb-6 border-l-2 border-emerald-500/30 pl-4">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-4 text-[#4a6b58] text-[0.78rem] pb-6 border-b border-emerald-500/10">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {article.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {article.readTime} baca
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-600">
                <Sparkles size={11} /> RecruitAI Editorial
              </span>
            </div>
          </motion.div>
        </header>

        {/* Article body */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[760px] mx-auto px-6 pb-12">
          {article.content}
        </motion.article>

        {/* CTA Block */}
        <section className="max-w-[760px] mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#0f1612] border border-emerald-500/20 rounded-[18px] p-8 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.07)_0%,transparent_65%)]" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={16} className="text-emerald-400" />
                <span className="text-emerald-400 text-[0.75rem] font-bold uppercase tracking-[0.09em]">
                  Coba Langsung
                </span>
              </div>
              <h3 className="font-syne font-extrabold text-[1.25rem] text-[#e8f0ec] mb-3 leading-[1.3]">
                Sudah tahu tipsnya? Sekarang terapkan ke CV kamu.
              </h3>
              <p className="text-[#7a9585] text-[0.875rem] leading-[1.7] mb-6 max-w-[480px]">
                Upload PDF CV kamu dan dalam 30 detik kamu akan tahu Resume
                Score, ATS Score, dan rekomendasi perbaikan spesifik yang bisa
                langsung diterapkan.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.9rem] px-6 py-[11px] rounded-[10px] no-underline transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(16,185,129,0.28)]">
                  <FileText size={15} /> Analisis CV Sekarang
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/[0.06] px-5 py-[10px] rounded-[10px] no-underline text-[0.875rem] transition-all">
                  Lihat Lowongan <ArrowRight size={13} />
                </Link>
              </div>
              <p className="text-[#4a6b58] text-[0.72rem] mt-4 flex items-center gap-2">
                <CheckCircle2 size={11} className="text-emerald-700" /> Gratis
                untuk kandidat · Tidak perlu kartu kredit
              </p>
            </div>
          </motion.div>
        </section>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="bg-[#0f1612] py-[60px]">
            <div className="max-w-[1180px] mx-auto px-6">
              <div className="flex items-center gap-3 mb-7">
                <span className="font-syne font-bold text-[0.85rem] text-[#e8f0ec]">
                  Artikel Terkait
                </span>
                <div className="flex-1 h-[1px] bg-emerald-500/10" />
              </div>
              <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="no-underline block">
                    <article className="bg-[#0a0f0d] border border-emerald-500/10 rounded-[14px] p-5 flex flex-col gap-3 transition-all duration-300 hover:border-emerald-500/25 hover:-translate-y-[2px] group cursor-pointer h-full">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.63rem] text-emerald-500/70 font-semibold uppercase tracking-[0.08em]">
                          {r.category}
                        </span>
                      </div>
                      <h4 className="font-syne font-bold text-[0.9rem] leading-[1.45] text-[#c8d9d0] group-hover:text-emerald-400 transition-colors">
                        {r.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[#4a6b58] text-[0.72rem] mt-auto">
                        <Clock size={10} /> {r.readTime}
                        <span className="ml-auto text-emerald-500/40 group-hover:text-emerald-400 transition-colors">
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] px-5 py-[9px] rounded-[9px] no-underline text-[0.84rem] transition-all">
                  <ArrowLeft size={13} /> Kembali ke Semua Artikel
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
