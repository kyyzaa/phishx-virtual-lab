<div align="center">
  <br />
    <a href="#" target="_blank">
      <img src="frontend/assets/img/PhishX.png" alt="PhishX Logo" width="200">
    </a>
  <br />

  <br>
  <div>
    <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript" />
    <img src="https://img.shields.io/badge/Education-Cybersecurity-%2300D9FF.svg?style=for-the-badge" alt="Education" />
  </div>

  <h3 align="center">PhishX - Interactive Phishing Awareness Virtual Lab</h3>

   <div align="center">
     Pelajari cara mengenali dan menghindari serangan phishing melalui simulasi interaktif dan materi edukatif yang komprehensif.
     <br><br>
     🌐 <a href="https://phishx.vercel.app" target="_blank"><b>Live Demo</b></a> - Akses langsung tanpa instalasi!
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🎯 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🚀 [Quick Start](#quick-start)
5. 📖 [Usage](#usage)
6. 🛡️ [Learning Objectives](#learning-objectives)

## <a name="introduction">🎯 Introduction</a>

**PhishX** adalah platform pembelajaran virtual interaktif yang dikembangkan untuk meningkatkan literasi digital mahasiswa TPB ITB dalam mengidentifikasi dan menghindari serangan phishing. Dengan menggunakan pendekatan gamifikasi dan simulasi real-time, PhishX menyediakan lingkungan pembelajaran yang aman untuk berlatih mengenali berbagai jenis serangan email phishing.

Platform ini menggabungkan teori keamanan siber dengan praktik langsung melalui email simulator yang realistis, memberikan pengalaman belajar yang mendalam dan aplikatif.

## <a name="tech-stack">⚙️ Tech Stack</a>

**Frontend:**
- HTML5 - Struktur dan semantik web modern
- CSS3 - Styling responsif dengan animasi dan transisi
- JavaScript (Vanilla) - Logika interaktif dan manipulasi DOM

**Backend:**
- Node.js + Express.js - RESTful API server
- Neon PostgreSQL - Cloud database untuk user data dan quiz results
- JWT (jsonwebtoken) - Token-based authentication
- bcryptjs - Password hashing untuk keamanan
- Helmet - HTTP security headers
- CORS - Cross-origin resource sharing
- express-validator - Input validation

**Deployment:**
- Frontend: Vercel (static hosting)
- Backend: Vercel (serverless functions) 
- Database: Neon PostgreSQL (managed cloud database)

## <a name="features">🔋 Features</a>

 **Landing Page dengan Dashboard Statistik**
- Overview kemampuan deteksi phishing
- Tracking progress pembelajaran real-time
- Interface yang user-friendly dan responsive

 **Email Phishing Simulator Interaktif**
- Simulasi email phishing dengan 3 tingkat kesulitan
- Analisis real-time terhadap email suspicious
- Sistem feedback dan penjelasan detail
- Live statistics tracking (akurasi, streak, total analisis)

 **Materi Pembelajaran Komprehensif**
- Panduan lengkap mengenali karakteristik phishing
- Tips dan trik keamanan email
- Best practices untuk digital security
- Interactive learning modules

 **Quiz dan Assessment System**
- Multiple choice questions dengan berbagai skenario
- Progress tracking dan scoring system
- Instant feedback dengan penjelasan jawaban
- **🆕 Backend Integration**: Hasil quiz disimpan ke database
- **🆕 User Authentication**: Login/register untuk tracking progress

 **Gamification Elements**
- Point system dan achievement badges
- Streak counter untuk motivasi berkelanjutan
- Leaderboard dan progress visualization
- Interactive tips dengan navigation system

 **Advanced Features**
- Difficulty selector (Pemula, Menengah, Expert)
- Red flags detection system
- Email classification system
- Responsive modal system untuk detail analysis

## <a name="quick-start">🚀 Quick Start</a>

Ikuti langkah-langkah berikut untuk menjalankan PhishX di mesin lokal Anda:

**Prerequisites**

Pastikan Anda telah menginstall:
- [Node.js](https://nodejs.org/) (version 16 atau lebih baru)
- [Git](https://git-scm.com/) untuk cloning repository
- Database: Akun [Neon PostgreSQL](https://neon.tech/) (gratis)
- Text editor atau IDE (VS Code recommended)

**Cloning the Repository**

```bash
git clone https://github.com/kyyzaa/phishx-virtual-lab.git
cd phishx-virtual-lab
```

**Setup Backend**

1. **Install dependencies**:
```bash
# Install root dependencies
npm install

# Install backend dependencies  
cd backend
npm install
```

2. **Setup Database (Neon PostgreSQL)**:
```bash
# Buat akun di https://neon.tech/ (gratis)
# Buat database baru dan copy connection string
# Contoh: postgresql://username:password@ep-xxx.neon.tech/dbname?sslmode=require
```

3. **Configure Environment**:
```bash
# Di folder backend/, copy .env.example ke .env
cp .env.example .env

# Edit .env dan isi dengan data Anda:
# DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/dbname?sslmode=require
# JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
# PORT=3002
# FRONTEND_URL=http://localhost:3000
```

4. **Run Database Migration**:
```bash
# Masih di folder backend/
node migrations/migrate.js
```

5. **Start Backend Server**:
```bash
npm start
# Server akan berjalan di http://localhost:3002
```

**Setup Frontend**

1. **Di terminal baru**, start frontend:
```bash
# Dari root directory, jalankan Python HTTP server
cd frontend
python -m http.server 3000
# Frontend akan berjalan di http://localhost:3000
```

**Option: Quick Development**

Jalankan frontend dan backend secara bersamaan:
```bash
# Dari root directory
npm run dev
```

**Production Deployment**

**Frontend (Vercel):**
1. Deploy folder `frontend/` ke Vercel
2. Update `API_BASE_URL` di `frontend/assets/js/config.js` dengan URL backend production

**Backend (Vercel):**
1. Connect repository ke Vercel
2. Set environment variables (DATABASE_URL, JWT_SECRET, dll.)
3. Deploy akan otomatis dari folder `backend/`

## <a name="usage">📖 Usage</a>

### Memulai Pembelajaran

1. **Home Page**: Mulai dari halaman utama untuk melihat overview dan statistik
2. **Materi**: Pelajari teori dan panduan mengenali phishing
3. **Email Simulator**: Praktikkan kemampuan dengan email simulator interaktif
4. **Quiz**: Uji pemahaman melalui quiz komprehensif

### Email Simulator Workflow

1. **Pilih Tingkat Kesulitan**:
   - 👶 **Pemula**: Dilengkapi dengan petunjuk red flags
   - 🎯 **Menengah**: Deteksi mandiri dengan hint minimal
   - 🔥 **Expert**: Phishing canggih tanpa bantuan

2. **Analisis Email**: 
   - Periksa sender, subject, dan isi email
   - Identifikasi red flags dan indikator mencurigakan
   - Gunakan tips keamanan yang disediakan

3. **Klasifikasi**: 
   - Tentukan apakah email tersebut legitimate atau phishing
   - Terima feedback instant dengan penjelasan detail

### Tips Penggunaan Optimal

- Mulai dari tingkat pemula untuk memahami konsep dasar
- Perhatikan statistik untuk tracking progress
- Baca materi terlebih dahulu sebelum menggunakan simulator
- Gunakan quiz untuk menguji pemahaman secara menyeluruh

## <a name="learning-objectives">🛡️ Learning Objectives</a>

Setelah menggunakan PhishX, pengguna diharapkan mampu:

- ✅ Mengidentifikasi karakteristik email phishing dengan akurasi tinggi
- ✅ Memahami teknik-teknik umum yang digunakan dalam serangan phishing
- ✅ Menerapkan best practices keamanan email dalam kehidupan sehari-hari
- ✅ Melakukan verifikasi email mencurigakan secara mandiri
- ✅ Meningkatkan awareness terhadap ancaman cybersecurity

---

<div align="center">
  <p><strong>PhishX Virtual Lab</strong></p>
  <p>&copy; 2025 Virtual Lab TPB ITB - Literasi Digital</p>
  <p>Developed with ❤️ for Cybersecurity Education</p>
</div>