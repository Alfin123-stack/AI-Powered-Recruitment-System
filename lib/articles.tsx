export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
  tag: string;
  iconName: string; // string biar tidak error saat di-pass antar file
  relatedSlugs: string[];
  content: React.ReactNode;
};

export const ARTICLES: Article[] = [
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
    iconName: "Target",
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
    iconName: "TrendingUp",
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
          secara signifikan dalam 12 bulan terakhir.
        </p>
        <h2>10 Skill Teratas yang Paling Dicari di 2025</h2>
        <h3>1. Prompt Engineering & AI Literacy</h3>
        <p>
          Kemampuan berinteraksi efektif dengan model AI (ChatGPT, Claude,
          Gemini) dan mengintegrasikannya ke dalam workflow kerja menjadi skill
          yang hampir universal diminta.
        </p>
        <h3>2. Cloud Computing (AWS / GCP / Azure)</h3>
        <p>
          Perpindahan infrastruktur ke cloud terus berlanjut. Sertifikasi AWS
          Solutions Architect atau Google Cloud Professional menjadi pembeda
          kuat di antara kandidat.
        </p>
        <h3>3. Data Analytics & SQL</h3>
        <p>
          Kemampuan membaca dan menganalisis data menjadi syarat di hampir semua
          posisi — bukan hanya data analyst.
        </p>
        <h3>4. Machine Learning Engineering</h3>
        <p>
          Bukan sekadar tahu teorinya, tapi bisa deploy model ML ke production.
          PyTorch, TensorFlow, dan MLOps pipeline menjadi skill yang sangat
          dicari.
        </p>
        <h3>5. React / Next.js (Frontend)</h3>
        <p>
          Framework JavaScript ini tetap mendominasi posisi frontend developer.
          Kombinasi React + TypeScript + state management adalah stack standar
          yang diminta hampir semua job description frontend.
        </p>
        <h3>6. Cybersecurity Fundamentals</h3>
        <p>
          Insiden keamanan yang meningkat membuat perusahaan aktif mencari
          kandidat yang memahami OWASP Top 10 dan security-first development
          practices.
        </p>
        <h3>7. DevOps & CI/CD</h3>
        <p>
          Docker, Kubernetes, GitHub Actions — kemampuan membangun dan mengelola
          pipeline deployment menjadi nilai tambah besar.
        </p>
        <h3>8. UI/UX Design & Figma</h3>
        <p>
          Dengan semakin banyaknya produk digital, kebutuhan desainer yang bisa
          bekerja cepat menggunakan Figma terus meningkat.
        </p>
        <h3>9. Product Management</h3>
        <p>
          Kombinasi technical literacy + business acumen + kemampuan komunikasi
          membuat product manager menjadi salah satu posisi dengan demand
          tertinggi.
        </p>
        <h3>10. Communication & Stakeholder Management</h3>
        <p>
          Soft skill ini sering diremehkan, tapi survei rekruter konsisten
          menunjukkan bahwa kemampuan komunikasi yang baik membedakan kandidat
          yang dipromosikan.
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
    iconName: "FileText",
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
          freelance, kompetisi, penelitian, dan banyak lagi.
        </p>
        <h2>Struktur CV Fresh Graduate yang Efektif</h2>
        <h3>1. Professional Summary yang Kuat</h3>
        <p>
          Tulis 3–4 kalimat yang merangkum siapa kamu, apa keahlian utamamu, dan
          apa yang kamu cari. Hindari klise seperti "saya adalah orang yang
          pekerja keras dan mau belajar".
        </p>
        <p>
          Contoh yang lebih kuat:{" "}
          <em>
            "Fresh graduate Teknik Informatika dengan pengalaman magang 6 bulan
            sebagai backend developer dan portofolio 3 aplikasi web menggunakan
            Node.js dan React."
          </em>
        </p>
        <h3>2. Proyek sebagai Pengganti Pengalaman</h3>
        <p>
          Buat seksi "Proyek" yang menonjol. Untuk setiap proyek, tulis: nama
          proyek, teknologi yang digunakan, kontribusimu, dan hasilnya. Sertakan
          link GitHub atau demo jika memungkinkan.
        </p>
        <h3>3. Pengalaman Organisasi dengan Konteks</h3>
        <p>
          Jangan hanya tulis nama jabatan. Tambahkan konteks: berapa anggota
          yang kamu koordinasi, acara apa yang kamu kelola, dampak apa yang kamu
          hasilkan.
        </p>
        <h3>4. Skill Section yang Jujur</h3>
        <p>
          Pisahkan antara hard skill dan soft skill. Jangan berlebihan — jika
          kamu mencantumkan "Expert Python" tapi tidak bisa menjawab pertanyaan
          dasar di interview, itu akan menjadi masalah besar.
        </p>
        <h3>5. Pendidikan dengan Detail yang Relevan</h3>
        <p>
          Selain nama universitas dan jurusan, tambahkan IPK (jika di atas 3.2),
          mata kuliah relevan, penghargaan akademik, atau penelitian yang
          berkaitan dengan posisi yang dilamar.
        </p>
        <h2>Kesalahan yang Sering Dilakukan Fresh Graduate</h2>
        <ul>
          <li>Mencantumkan pengalaman SD, SMP, dan SMA yang tidak relevan</li>
          <li>Foto yang tidak profesional atau tidak ada sama sekali</li>
          <li>CV lebih dari 2 halaman padahal pengalaman minim</li>
          <li>Tidak menyesuaikan CV untuk setiap posisi yang dilamar</li>
        </ul>
        <h2>Satu Tip Terakhir</h2>
        <p>
          Sebelum submit, analisis dulu CV kamu menggunakan RecruitAI. Kamu akan
          tahu persis bagian mana yang perlu diperkuat dan apakah CV kamu sudah
          cukup ATS-friendly.
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
    iconName: "Brain",
    relatedSlugs: [
      "cara-optimasi-cv-lolos-ats",
      "tips-cv-fresh-graduate",
      "cara-menulis-ringkasan-profesional",
    ],
    content: (
      <div className="prose-custom">
        <p>
          Rata-rata rekruter menghabiskan <strong>7 detik</strong> untuk
          keputusan awal apakah sebuah CV layak dilanjutkan atau tidak.
        </p>
        <h2>7 Kesalahan yang Langsung Merusak Kesan Pertama</h2>
        <h3>1. Foto yang Tidak Profesional</h3>
        <p>
          Foto selfie, foto liburan yang di-crop, atau foto dengan ekspresi
          tidak serius langsung menurunkan kredibilitas CV secara dramatis.
          Gunakan foto formal dengan latar belakang netral.
        </p>
        <h3>2. Objective Statement yang Generik</h3>
        <p>
          "Saya ingin bergabung dengan perusahaan yang baik untuk mengembangkan
          karier saya" — kalimat semacam ini tidak memberikan nilai apapun.
          Ganti dengan professional summary yang spesifik.
        </p>
        <h3>3. Deskripsi Tugas Tanpa Pencapaian</h3>
        <p>
          Menulis "bertanggung jawab atas pengelolaan media sosial" hanya
          menjelaskan tugas. Ubah menjadi: "Mengelola 4 platform media sosial
          dan meningkatkan engagement rate rata-rata 45% dalam 6 bulan."
        </p>
        <h3>4. Typo dan Kesalahan Tata Bahasa</h3>
        <p>
          Kesalahan ejaan mengirimkan sinyal kuat: kurang teliti dan tidak
          serius. Baca ulang CV kamu minimal dua kali dan minta orang lain
          membacanya sebelum dikirim.
        </p>
        <h3>5. Format yang Tidak Konsisten</h3>
        <p>
          Font yang berbeda-beda, ukuran yang tidak seragam, bullet point yang
          tidak sejajar — semua ini membuat CV terlihat berantakan.
        </p>
        <h3>6. Terlalu Panjang atau Terlalu Pendek</h3>
        <p>
          Untuk kandidat dengan pengalaman di bawah 5 tahun, CV yang ideal
          adalah 1–2 halaman.
        </p>
        <h3>7. Tidak Disesuaikan dengan Posisi</h3>
        <p>
          Mengirim CV yang sama persis ke semua perusahaan adalah kesalahan
          terbesar. Setiap posisi memiliki kebutuhan berbeda.
        </p>
        <h2>Cara Cepat Mengecek CV Kamu</h2>
        <p>
          Analisis CV kamu di RecruitAI dan dapatkan feedback spesifik untuk
          setiap bagian dokumenmu.
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
    iconName: "FileText",
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
          meyakinkan mereka dalam waktu 10 detik.
        </p>
        <h2>Kenapa Professional Summary Penting?</h2>
        <p>
          Rekruter membaca puluhan hingga ratusan CV per hari. Summary yang kuat
          membantu mereka langsung memahami siapa kamu tanpa harus mencari-cari
          informasi di seluruh dokumen.
        </p>
        <h2>Formula Professional Summary yang Efektif</h2>
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
            bekerja dalam tim maupun individu."
          </em>
        </p>
        <h3>✅ Yang Kuat:</h3>
        <p>
          <em>
            "Backend developer dengan 3 tahun pengalaman membangun REST API dan
            microservices menggunakan Node.js dan PostgreSQL. Berkontribusi pada
            sistem yang melayani 500K+ pengguna aktif di startup fintech."
          </em>
        </p>
        <h2>Tips Tambahan</h2>
        <ul>
          <li>Sesuaikan summary untuk setiap posisi yang kamu lamar</li>
          <li>Gunakan kata kunci dari job description secara natural</li>
          <li>
            Hindari klise: "passionate", "team player" tanpa bukti konkret
          </li>
        </ul>
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
    iconName: "Zap",
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
          tahap ini.
        </p>
        <h2>Sebelum Interview: Riset yang Tidak Bisa Dilewati</h2>
        <h3>1. Pelajari Perusahaan Secara Mendalam</h3>
        <p>
          Baca website perusahaan, laporan tahunan (untuk perusahaan publik),
          berita terbaru, dan ulasan di Glassdoor atau LinkedIn. Pahami apa
          produk/layanan mereka dan tantangan industri yang mereka hadapi.
        </p>
        <h3>2. Pahami Job Description Luar Dalam</h3>
        <p>
          Identifikasi 5 tanggung jawab utama dan 5 kualifikasi yang paling
          ditekankan. Siapkan contoh konkret dari pengalamanmu yang relevan.
        </p>
        <h3>3. Riset Pewawancara</h3>
        <p>
          Jika kamu tahu siapa yang akan menginterviewmu, cek LinkedIn mereka.
          Ini membantu kamu membangun koneksi yang lebih natural.
        </p>
        <h2>Metode STAR untuk Pertanyaan Behavioral</h2>
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
          Pilih kelemahan nyata yang tidak critical untuk posisi tersebut, dan
          selalu sertakan langkah konkret yang sedang kamu ambil untuk
          memperbaikinya.
        </p>
        <h3>"Kenapa kamu meninggalkan pekerjaan sebelumnya?"</h3>
        <p>
          Selalu framing secara positif — fokus pada apa yang kamu cari daripada
          apa yang kamu hindari dari tempat lama.
        </p>
        <h2>Pertanyaan yang Harus Kamu Tanyakan Balik</h2>
        <p>
          Siapkan 3–5 pertanyaan bermakna tentang: kultur tim, ekspektasi 90
          hari pertama, tantangan terbesar posisi ini, atau kesempatan
          pengembangan karier.
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
    iconName: "BookOpen",
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
          adalah petunjuk tentang apa yang mereka cari.
        </p>
        <h2>Cara Membaca JD Secara Strategis</h2>
        <h3>Layer 1: Identifikasi Kata Kunci Hard Skill</h3>
        <p>
          Scan seluruh JD dan tandai semua teknologi, tools, bahasa pemrograman,
          sertifikasi, atau metodologi yang disebutkan. Ini adalah kata kunci
          yang dicari ATS.
        </p>
        <h3>Layer 2: Temukan Prioritas Tersembunyi</h3>
        <p>
          Perhatikan urutan dan frekuensi. Skill yang disebut pertama atau
          paling sering biasanya adalah yang paling penting.
        </p>
        <h3>Layer 3: Baca Antara Baris untuk Soft Skill</h3>
        <p>
          Frasa seperti "fast-paced environment" atau "cross-functional team"
          adalah kode untuk skill tertentu. Siapkan contoh dari pengalamanmu.
        </p>
        <h2>Template Penyesuaian CV per Posisi</h2>
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
          bukan berjam-jam.
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
    iconName: "TrendingUp",
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
          profesional.
        </p>
        <h3>2. Headline yang Lebih dari Sekadar Jabatan</h3>
        <p>
          Jangan hanya tulis "Software Engineer at Tokopedia". Gunakan headline
          yang menjelaskan value kamu secara spesifik.
        </p>
        <h3>3. About Section sebagai Story</h3>
        <p>
          About section bukan tempat untuk copy-paste CV. Tulis dalam gaya
          percakapan yang menjelaskan perjalanan profesionalmu.
        </p>
        <h3>4. Experience dengan Pencapaian Terukur</h3>
        <p>
          Sama seperti CV, tulis pencapaian konkret dengan angka. LinkedIn
          memberi kamu lebih banyak ruang untuk bercerita lebih detail.
        </p>
        <h3>5. Skills dan Endorsement</h3>
        <p>
          Tambahkan skill yang relevan dan minta kolega atau atasan untuk
          memberikan endorsement.
        </p>
        <h2>Strategi Konten untuk Membangun Visibility</h2>
        <p>
          Posting konten 2–3 kali per minggu tentang insight industri,
          pembelajaran baru, atau proyek yang sedang kamu kerjakan.
        </p>
        <h2>Networking yang Bermakna</h2>
        <p>
          Saat mengirim connection request, selalu sertakan pesan personal yang
          menjelaskan kenapa kamu ingin terhubung.
        </p>
      </div>
    ),
  },
];

export const ARTICLE_MAP: Record<string, Article> = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a]),
);
