// Global Variables
let currentEmail = null;
let currentWebsite = null;
let currentQuiz = null;
let currentDifficulty = 'medium';
let emailStreak = 0;
let stats = {
    totalAttempts: 0,
    correctDetections: 0,
    emailScore: { correct: 0, total: 0 },
    websiteScore: { correct: 0, total: 0 },
    quizScore: { correct: 0, total: 0 }
};

// Enhanced Email Templates with difficulty levels
const emailTemplates = {
    easy: {
        legitimate: [
            {
                sender: "ITB Official",
                email: "noreply@itb.ac.id",
                subject: "Jadwal Kuliah Semester Baru",
                preview: "Jadwal kuliah untuk semester genap 2025 telah tersedia...",
                body: "Yth. Mahasiswa TPB ITB,\n\nJadwal kuliah untuk semester genap 2025 telah tersedia di portal akademik. Silakan login ke portal akademik ITB untuk melihat jadwal lengkap Anda.\n\nInformasi lebih lanjut dapat menghubungi bagian akademik.\n\nSalam,\nDirektorat Akademik ITB",
                time: "2 jam lalu",
                isPhishing: false,
                explanation: "Email ini legitimate karena dikirim dari domain resmi ITB (@itb.ac.id), menggunakan bahasa formal yang sesuai dengan institusi pendidikan, dan tidak meminta informasi sensitif."
            },
            {
                sender: "Google",
                email: "no-reply@accounts.google.com",
                subject: "Login dari perangkat baru",
                preview: "Kami mendeteksi login dari perangkat baru di Jakarta...",
                body: "Hai,\n\nKami mendeteksi bahwa Anda baru saja login ke akun Google Anda dari perangkat baru di Jakarta, Indonesia pada 23 September 2025, 14:30 WIB.\n\nJika ini bukan Anda, segera amankan akun Anda di myaccount.google.com\n\nTerima kasih,\nTim Google",
                time: "1 hari lalu",
                isPhishing: false,
                explanation: "Email ini legitimate karena dikirim dari domain resmi Google (@accounts.google.com), memberikan informasi spesifik tentang waktu dan lokasi login, serta menyediakan link resmi Google untuk keamanan akun."
            }
        ],
        phishing: [
            {
                sender: "Bank Mandiri",
                email: "security@bank-mandiri.co.id",
                subject: "URGENT: Akun Anda akan diblokir dalam 24 jam!",
                preview: "Aktivitas mencurigakan terdeteksi. Verifikasi sekarang atau akun diblokir!",
                body: "PERINGATAN KEAMANAN!\n\nAkun Anda menunjukkan aktivitas yang mencurigakan. Untuk mencegah pemblokiran permanen, segera verifikasi identitas Anda dengan mengklik link berikut:\n\nhttp://bankmandiri-verify.tk/login\n\nJika tidak diverifikasi dalam 24 jam, akun akan diblokir permanen!\n\nHubungi kami: +62-XXX-XXXX-XXXX\n\nCustomer Service Bank Mandiri",
                time: "30 menit lalu",
                isPhishing: true,
                redFlags: ["Domain mencurigakan (.tk bukan .co.id)", "Bahasa yang sangat mendesak", "Ancaman pemblokiran dengan deadline", "Link eksternal mencurigakan", "Nomor telepon yang tidak jelas"],
                explanation: "Email ini adalah phishing karena menggunakan domain palsu (.tk), bahasa yang sangat mendesak dengan ancaman, dan meminta verifikasi melalui link eksternal yang mencurigakan."
            }
        ]
    },
    medium: {
        legitimate: [
            {
                sender: "Netflix",
                email: "info@netflix.com",
                subject: "Film baru telah ditambahkan untuk Anda",
                preview: "Berdasarkan riwayat tontonan, kami merekomendasikan...",
                body: "Halo,\n\nBerdasarkan riwayat tontonan Anda, kami telah menambahkan beberapa film dan series baru yang mungkin Anda sukai:\n\n• Stranger Things Season 4\n• The Crown Season 5\n• Wednesday\n\nTonton sekarang di Netflix atau aplikasi mobile Anda.\n\nSelamat menonton!\nTim Netflix",
                time: "3 jam lalu",
                isPhishing: false,
                explanation: "Email ini legitimate karena dari domain resmi Netflix, tidak meminta informasi pribadi, dan sesuai dengan layanan yang biasa diberikan Netflix kepada pelanggan."
            }
        ],
        phishing: [
            {
                sender: "WhatsApp",
                email: "support@whatsap-security.com",
                subject: "Verifikasi Akun WhatsApp Anda",
                preview: "Akun WhatsApp Anda perlu diverifikasi untuk keamanan...",
                body: "Halo,\n\nUntuk menjaga keamanan akun WhatsApp Anda, kami memerlukan verifikasi ulang.\n\nKlik link berikut untuk verifikasi:\nhttp://whatsapp-verify.ml/confirm\n\nMasukkan nomor telepon dan kode verifikasi 6 digit yang akan kami kirim.\n\nProses ini wajib dilakukan dalam 48 jam.\n\nTerima kasih,\nTim WhatsApp Security",
                time: "1 jam lalu",
                isPhishing: true,
                redFlags: ["Typo di domain (whatsap vs whatsapp)", "Domain .ml bukan domain resmi", "Meminta kode verifikasi", "Deadline yang menciptakan urgency", "WhatsApp tidak mengirim email untuk verifikasi"],
                explanation: "Email phishing ini cukup meyakinkan tapi memiliki typo di domain dan meminta kode verifikasi melalui email, padahal WhatsApp tidak pernah melakukan ini."
            }
        ]
    },
    hard: {
        legitimate: [
            {
                sender: "Microsoft Security",
                email: "account-security-noreply@accountprotection.microsoft.com",
                subject: "Aktivitas masuk yang tidak biasa",
                preview: "Kami mendeteksi aktivitas masuk dari lokasi yang tidak biasa...",
                body: "Halo,\n\nKami mendeteksi bahwa akun Microsoft Anda baru saja diakses dari:\n\nLokasi: Jakarta, Indonesia\nPerangkat: Chrome di Windows\nWaktu: 23 September 2025, 15:45 WIB\nIP: 103.XXX.XXX.XXX\n\nJika ini adalah Anda, tidak ada tindakan yang diperlukan. Jika bukan, segera kunjungi https://account.microsoft.com/security untuk mengamankan akun Anda.\n\nTim Keamanan Microsoft",
                time: "2 jam lalu",
                isPhishing: false,
                explanation: "Meskipun domain terlihat panjang, ini adalah subdomain resmi Microsoft untuk notifikasi keamanan. Email memberikan detail spesifik dan mengarahkan ke situs resmi Microsoft."
            }
        ],
        phishing: [
            {
                sender: "PayPal Service",
                email: "service@paypal.com",
                subject: "Konfirmasi pembayaran diperlukan",
                preview: "Pembayaran senilai $299.99 memerlukan konfirmasi Anda...",
                body: "Dear Customer,\n\nPembayaran berikut memerlukan konfirmasi Anda:\n\nJumlah: $299.99\nPenerima: TechStore Inc.\nTanggal: 23 September 2025\nID Transaksi: PP-7X8Y-9Z1A-2B3C\n\nJika Anda tidak melakukan pembayaran ini, segera batalkan dengan mengklik:\nhttps://paypal-secure.verification-center.com/cancel\n\nJika pembayaran ini valid, konfirmasi di:\nhttps://paypal-secure.verification-center.com/confirm\n\nSalam,\nPayPal Customer Service",
                time: "15 menit lalu",
                isPhishing: true,
                redFlags: ["Domain palsu meskipun sender terlihat asli", "URL yang bukan paypal.com resmi", "Meminta konfirmasi untuk pembayaran yang tidak dilakukan", "Mencoba menciptakan urgency dengan nilai transaksi besar", "Subdomain 'verification-center' yang mencurigakan"],
                explanation: "Email phishing canggih yang menggunakan alamat pengirim yang terlihat asli, tapi URL tujuan menggunakan subdomain palsu. PayPal resmi menggunakan paypal.com, bukan verification-center.com."
            }
        ]
    }
};

// Website Templates (unchanged from previous)
const websiteTemplates = [
    {
        type: 'safe',
        url: 'https://www.facebook.com/login',
        title: 'Facebook - Log In',
        isSecure: true
    },
    {
        type: 'phishing',
        url: 'http://faceb00k-login.tk/signin',
        title: 'Facebook - Log In',
        isSecure: false,
        redFlags: ["HTTP bukan HTTPS", "Domain mencurigakan (.tk)", "Typo dalam URL (faceb00k)"]
    },
    {
        type: 'phishing',
        url: 'https://gmai1-security.com/login',
        title: 'Gmail - Sign In',
        isSecure: true,
        redFlags: ["Domain bukan gmail.com", "Typo dalam URL (gmai1)", "Domain .com mencurigakan untuk Gmail"]
    },
    {
        type: 'safe',
        url: 'https://accounts.google.com/signin',
        title: 'Sign in - Google Accounts',
        isSecure: true
    }
];

// Quiz Questions (unchanged from previous)
const quizQuestions = [
    {
        question: "Apa yang harus Anda periksa pertama kali saat menerima email yang meminta informasi pribadi?",
        options: [
            "Alamat pengirim dan domain email",
            "Desain email yang menarik",
            "Jumlah kata dalam email",
            "Waktu email dikirim"
        ],
        correct: 0,
        explanation: "Selalu periksa alamat pengirim dan pastikan domain emailnya legitimate sebelum memberikan informasi pribadi."
    },
    {
        question: "Manakah yang BUKAN tanda-tanda email phishing?",
        options: [
            "Bahasa yang mendesak dan mengancam",
            "Link yang mengarah ke domain mencurigakan",
            "Email yang dipersonalisasi dengan nama Anda",
            "Meminta password atau informasi sensitif"
        ],
        correct: 2,
        explanation: "Email yang dipersonalisasi dengan nama bukan tanda phishing. Justru email phishing sering menggunakan sapaan umum."
    },
    {
        question: "Apa yang sebaiknya dilakukan jika Anda mengklik link phishing secara tidak sengaja?",
        options: [
            "Mengabaikannya saja",
            "Segera ganti password akun terkait",
            "Tunggu beberapa hari untuk melihat apa yang terjadi",
            "Restart komputer"
        ],
        correct: 1,
        explanation: "Jika tidak sengaja mengklik link phishing, segera ganti password semua akun penting untuk mencegah akses tidak sah."
    },
    {
        question: "Protokol mana yang lebih aman untuk transaksi online?",
        options: [
            "HTTP",
            "HTTPS",
            "FTP",
            "Semua sama saja"
        ],
        correct: 1,
        explanation: "HTTPS mengenkripsi data yang dikirim, sehingga lebih aman untuk transaksi online dibanding HTTP biasa."
    },
    {
        question: "Apa yang dimaksud dengan 'domain spoofing'?",
        options: [
            "Membuat website yang cepat loading",
            "Membuat domain yang mirip dengan domain asli untuk menipu",
            "Menggunakan domain gratis",
            "Membeli domain dengan harga murah"
        ],
        correct: 1,
        explanation: "Domain spoofing adalah teknik membuat domain palsu yang mirip dengan domain asli untuk menipu korban."
    },
    {
        question: "Kapan sebaiknya Anda memberikan informasi login kepada pihak lain?",
        options: [
            "Ketika diminta melalui email",
            "Ketika website terlihat profesional",
            "Tidak pernah memberikan ke pihak manapun",
            "Ketika ada urgency"
        ],
        correct: 2,
        explanation: "Jangan pernah memberikan informasi login kepada siapapun. Perusahaan legitimate tidak akan meminta password via email."
    },
    {
        question: "Apa yang harus diperiksa pada URL sebelum memasukkan data sensitif?",
        options: [
            "Panjang URL",
            "Warna website",
            "HTTPS dan nama domain yang benar",
            "Jumlah halaman di website"
        ],
        correct: 2,
        explanation: "Pastikan URL menggunakan HTTPS dan domain yang benar sebelum memasukkan informasi sensitif."
    },
    {
        question: "Bagaimana cara terbaik memverifikasi keaslian email dari bank?",
        options: [
            "Membalas email langsung",
            "Mengklik link yang disediakan",
            "Menghubungi bank melalui nomor resmi mereka",
            "Mempercayai jika logonya mirip"
        ],
        correct: 2,
        explanation: "Cara terbaik adalah menghubungi bank melalui nomor resmi atau datang langsung untuk memverifikasi email tersebut."
    },
    {
        question: "Apa fungsi utama two-factor authentication (2FA)?",
        options: [
            "Mempercepat login",
            "Menambah lapisan keamanan ekstra",
            "Mengurangi penggunaan password",
            "Membuat interface lebih menarik"
        ],
        correct: 1,
        explanation: "2FA menambah lapisan keamanan ekstra dengan memerlukan verifikasi kedua selain password."
    },
    {
        question: "Bagaimana cara mengenali website phishing palsu?",
        options: [
            "Website loading lambat",
            "URL mencurigakan, tidak ada HTTPS, desain yang tidak sempurna",
            "Website menggunakan bahasa Indonesia",
            "Website memiliki banyak gambar"
        ],
        correct: 1,
        explanation: "Website phishing sering memiliki URL mencurigakan, tidak menggunakan HTTPS, dan desain yang tidak sempurna atau tidak konsisten."
    }
];

// DOM Elements
let navBtns, sections, emailModal, warningModal, resultModal, closeBtn;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    updateStats();
    generateEmails();
    loadRandomWebsite();
});

function initializeElements() {
    navBtns = document.querySelectorAll('.nav-btn');
    sections = document.querySelectorAll('.section');
    emailModal = document.getElementById('emailModal');
    warningModal = document.getElementById('warningModal');
    resultModal = document.getElementById('resultModal');
    closeBtn = document.querySelector('.close');
}

function initializeEventListeners() {
    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            if (section) showSection(section);
        });
    });

    // Modal close events
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            emailModal.classList.remove('show');
        });
    }

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === emailModal) {
            emailModal.classList.remove('show');
        }
        if (e.target === warningModal) {
            warningModal.classList.remove('show');
        }
        if (e.target === resultModal) {
            resultModal.classList.remove('show');
        }
    });
}

function showSection(sectionId) {
    // Update navigation
    navBtns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Update sections
    sections.forEach(section => section.classList.remove('active'));
    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.classList.add('active');

    // Load specific content based on section
    if (sectionId === 'quiz') {
        initializeQuiz();
    } else if (sectionId === 'results') {
        updateResults();
    }
}

function startLearning() {
    showSection('simulator');
}

// Difficulty Management
function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    generateEmails();
}

// Enhanced Email Simulator Functions
function generateEmails() {
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '';

    // Get emails based on current difficulty
    const difficultyEmails = emailTemplates[currentDifficulty];
    if (!difficultyEmails) return;

    // Mix legitimate and phishing emails
    const allEmails = [...difficultyEmails.legitimate, ...difficultyEmails.phishing];
    const shuffledEmails = shuffleArray([...allEmails]);

    // Update email count
    document.getElementById('emailCount').textContent = `${shuffledEmails.length} emails`;

    shuffledEmails.forEach((email, index) => {
        const emailItem = createEmailItem(email, index);
        emailList.appendChild(emailItem);
    });

    updateEmailStats();
}

function createEmailItem(email, index) {
    const emailDiv = document.createElement('div');
    emailDiv.className = `email-item ${email.isPhishing ? 'phishing' : ''} unread`;
    emailDiv.onclick = () => showEmailDetails(email);

    const avatarColor = getAvatarColor(email.sender);
    const avatarLetter = email.sender.charAt(0).toUpperCase();

    // Determine verification badge
    let verificationBadge = '';
    if (!email.isPhishing) {
        verificationBadge = '<span class="email-verified">✓ Verified</span>';
    } else if (currentDifficulty === 'easy') {
        verificationBadge = '<span class="email-suspicious">⚠ Suspicious</span>';
    }

    // Priority indicator
    const priority = email.isPhishing ? 'high' : (Math.random() > 0.7 ? 'medium' : 'low');

    emailDiv.innerHTML = `
        <div class="email-avatar" style="background-color: ${avatarColor}">
            ${avatarLetter}
        </div>
        <div class="email-content">
            <div class="email-sender">
                ${email.sender}
                ${verificationBadge}
            </div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-preview">${email.preview}</div>
        </div>
        <div class="email-meta">
            <div class="email-time">${email.time}</div>
            <div class="email-priority priority-${priority}"></div>
        </div>
    `;

    return emailDiv;
}

function getAvatarColor(sender) {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#84cc16'];
    const hash = sender.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
}

function showEmailDetails(email) {
    currentEmail = email;
    const emailDetails = document.getElementById('emailDetails');
    
    // Format email body with better styling
    const formattedBody = email.body
        .replace(/\n/g, '<br>')
        .replace(/(http[s]?:\/\/[^\s]+)/g, '<a href="#" onclick="return false;">$1</a>');

    emailDetails.innerHTML = `
        <div class="email-header-full">
            <div class="email-from-full">
                <div class="sender-info">
                    <div class="sender-name">${email.sender}</div>
                    <div class="sender-email">&lt;${email.email}&gt;</div>
                </div>
                <div class="email-timestamp">${email.time}</div>
            </div>
            <div class="email-subject-detail">${email.subject}</div>
        </div>
        <div class="email-body-full">
            ${formattedBody}
        </div>
    `;

    // Show red flags for phishing emails in easy mode or after wrong answer
    const redFlagsPanel = document.getElementById('redFlagsPanel');
    if (email.isPhishing && currentDifficulty === 'easy') {
        const redFlagsList = document.getElementById('redFlagsList');
        redFlagsList.innerHTML = email.redFlags.map(flag => `<li>${flag}</li>`).join('');
        redFlagsPanel.style.display = 'block';
    } else {
        redFlagsPanel.style.display = 'none';
    }

    emailModal.classList.add('show');
}

function classifyEmail(classification) {
    if (!currentEmail) return;

    const isCorrect = (classification === 'phishing') === currentEmail.isPhishing;
    
    stats.totalAttempts++;
    stats.emailScore.total++;
    
    if (isCorrect) {
        stats.correctDetections++;
        stats.emailScore.correct++;
        emailStreak++;
        showResult(true, currentEmail);
    } else {
        emailStreak = 0;
        showResult(false, currentEmail);
    }

    updateStats();
    updateEmailStats();
    emailModal.classList.remove('show');
}

function showResult(isCorrect, email) {
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const resultExplanation = document.getElementById('resultExplanation');
    const resultRedFlags = document.getElementById('resultRedFlags');

    if (isCorrect) {
        resultIcon.textContent = '✅';
        resultIcon.style.color = '#10b981';
        resultTitle.textContent = 'Jawaban Benar!';
        resultTitle.style.color = '#10b981';
        resultMessage.textContent = email.isPhishing 
            ? 'Selamat! Anda berhasil mengidentifikasi email phishing ini.'
            : 'Tepat! Email ini memang legitimate dan aman.';
    } else {
        resultIcon.textContent = '❌';
        resultIcon.style.color = '#ef4444';
        resultTitle.textContent = 'Jawaban Salah';
        resultTitle.style.color = '#ef4444';
        resultMessage.textContent = email.isPhishing 
            ? 'Sayang sekali. Email ini sebenarnya adalah phishing.'
            : 'Tidak tepat. Email ini sebenarnya legitimate dan aman.';
    }

    // Show explanation
    resultExplanation.innerHTML = `<strong>Penjelasan:</strong><br>${email.explanation}`;

    // Show red flags for phishing emails when user got it wrong
    if (email.isPhishing && (!isCorrect || currentDifficulty === 'easy')) {
        resultRedFlags.innerHTML = `
            <h4>🚩 Red Flags yang Harus Diperhatikan:</h4>
            <ul>
                ${email.redFlags.map(flag => `<li>${flag}</li>`).join('')}
            </ul>
        `;
        resultRedFlags.style.display = 'block';
    } else {
        resultRedFlags.style.display = 'none';
    }

    resultModal.classList.add('show');
}

function closeResultModal() {
    resultModal.classList.remove('show');
    // Generate new emails after closing result
    setTimeout(() => {
        generateEmails();
    }, 500);
}

function updateEmailStats() {
    document.getElementById('emailCorrect').textContent = stats.emailScore.correct;
    document.getElementById('emailTotal').textContent = stats.emailScore.total;
    document.getElementById('emailStreak').textContent = emailStreak;
}

// Utility Functions
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function updateStats() {
    // Update overall statistics
    const totalAttemptsEl = document.getElementById('totalAttempts');
    const correctDetectionsEl = document.getElementById('correctDetections');
    const accuracyEl = document.getElementById('accuracy');
    
    if (totalAttemptsEl) totalAttemptsEl.textContent = stats.totalAttempts;
    if (correctDetectionsEl) correctDetectionsEl.textContent = stats.correctDetections;
    if (accuracyEl) {
        const accuracy = stats.totalAttempts > 0 ? Math.round((stats.correctDetections / stats.totalAttempts) * 100) : 0;
        accuracyEl.textContent = `${accuracy}%`;
    }

    // Update mini statistics in illustration panel
    const correctCountEl = document.getElementById('correctCount');
    const wrongCountEl = document.getElementById('wrongCount');
    const accuracyRateEl = document.getElementById('accuracyRate');
    
    if (correctCountEl) correctCountEl.textContent = stats.correctDetections;
    if (wrongCountEl) wrongCountEl.textContent = stats.totalAttempts - stats.correctDetections;
    if (accuracyRateEl) {
        const accuracy = stats.totalAttempts > 0 ? Math.round((stats.correctDetections / stats.totalAttempts) * 100) : 0;
        accuracyRateEl.textContent = `${accuracy}%`;
    }
}

// Website Simulator Functions
function loadRandomWebsite() {
    currentWebsite = websiteTemplates[Math.floor(Math.random() * websiteTemplates.length)];
    
    const websiteFrame = document.getElementById('websiteFrame');
    const websiteUrl = document.getElementById('websiteUrl');
    
    if (websiteFrame && websiteUrl) {
        websiteUrl.textContent = currentWebsite.url;
        websiteUrl.className = currentWebsite.isSecure ? 'secure' : 'insecure';
        
        // Simulate website content
        websiteFrame.innerHTML = `
            <div class="website-content">
                <h3>${currentWebsite.title}</h3>
                <p>This is a simulated website for educational purposes.</p>
                ${currentWebsite.type === 'phishing' ? '<div class="warning">⚠️ This would be a phishing site in real scenario</div>' : ''}
            </div>
        `;
    }
}

function classifyWebsite(classification) {
    if (!currentWebsite) return;

    const isCorrect = (classification === 'phishing') === (currentWebsite.type === 'phishing');
    
    stats.totalAttempts++;
    stats.websiteScore.total++;
    
    if (isCorrect) {
        stats.correctDetections++;
        stats.websiteScore.correct++;
    }

    updateStats();
    
    // Show result
    showWarning(isCorrect ? 'Correct!' : 'Wrong!', 
               isCorrect ? 'You identified this website correctly.' : 'This website was misidentified.');
    
    // Load next website
    setTimeout(() => {
        loadRandomWebsite();
    }, 2000);
}

// Quiz Functions
function initializeQuiz() {
    if (quizQuestions.length === 0) return;
    
    currentQuiz = {
        currentQuestion: 0,
        score: 0,
        answers: []
    };
    
    showQuizQuestion();
}

function showQuizQuestion() {
    const question = quizQuestions[currentQuiz.currentQuestion];
    const quizContainer = document.getElementById('quizContainer');
    
    if (!quizContainer || !question) return;
    
    quizContainer.innerHTML = `
        <div class="quiz-question">
            <h3>Pertanyaan ${currentQuiz.currentQuestion + 1}/${quizQuestions.length}</h3>
            <p>${question.question}</p>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <button class="quiz-option" onclick="selectQuizAnswer(${index})">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function selectQuizAnswer(answerIndex) {
    const question = quizQuestions[currentQuiz.currentQuestion];
    const isCorrect = answerIndex === question.correct;
    
    if (isCorrect) {
        currentQuiz.score++;
        stats.quizScore.correct++;
    }
    
    stats.quizScore.total++;
    currentQuiz.answers.push({
        question: currentQuiz.currentQuestion,
        selected: answerIndex,
        correct: question.correct,
        isCorrect: isCorrect
    });
    
    // Show feedback
    showQuizFeedback(isCorrect, question.explanation);
    
    currentQuiz.currentQuestion++;
    
    if (currentQuiz.currentQuestion < quizQuestions.length) {
        setTimeout(() => {
            showQuizQuestion();
        }, 3000);
    } else {
        setTimeout(() => {
            showQuizResults();
        }, 3000);
    }
}

function showQuizFeedback(isCorrect, explanation) {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;
    
    quizContainer.innerHTML = `
        <div class="quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}">
            <h3>${isCorrect ? '✅ Benar!' : '❌ Salah'}</h3>
            <p>${explanation}</p>
        </div>
    `;
}

function showQuizResults() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;
    
    const percentage = Math.round((currentQuiz.score / quizQuestions.length) * 100);
    
    quizContainer.innerHTML = `
        <div class="quiz-results">
            <h3>Hasil Quiz</h3>
            <div class="score-circle">
                <span class="score">${percentage}%</span>
            </div>
            <p>Anda menjawab ${currentQuiz.score} dari ${quizQuestions.length} pertanyaan dengan benar.</p>
            <button onclick="initializeQuiz()" class="btn-primary">Ulangi Quiz</button>
        </div>
    `;
    
    updateStats();
}

// Modal and UI Functions
function showWarning(title, message) {
    const warningTitle = document.getElementById('warningTitle');
    const warningMessage = document.getElementById('warningMessage');
    
    if (warningTitle && warningMessage) {
        warningTitle.textContent = title;
        warningMessage.textContent = message;
        warningModal.classList.add('show');
    }
}

function closeWarning() {
    warningModal.classList.remove('show');
}

function updateResults() {
    const emailAccuracy = stats.emailScore.total > 0 ? 
        Math.round((stats.emailScore.correct / stats.emailScore.total) * 100) : 0;
    const websiteAccuracy = stats.websiteScore.total > 0 ? 
        Math.round((stats.websiteScore.correct / stats.websiteScore.total) * 100) : 0;
    const quizAccuracy = stats.quizScore.total > 0 ? 
        Math.round((stats.quizScore.correct / stats.quizScore.total) * 100) : 0;
    
    // Update result displays
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="results-grid">
                <div class="result-card">
                    <h3>📧 Email Detection</h3>
                    <div class="result-stats">
                        <div class="stat">
                            <span class="stat-label">Correct:</span>
                            <span class="stat-value">${stats.emailScore.correct}/${stats.emailScore.total}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Accuracy:</span>
                            <span class="stat-value">${emailAccuracy}%</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Current Streak:</span>
                            <span class="stat-value">${emailStreak}</span>
                        </div>
                    </div>
                </div>
                
                <div class="result-card">
                    <h3>🌐 Website Detection</h3>
                    <div class="result-stats">
                        <div class="stat">
                            <span class="stat-label">Correct:</span>
                            <span class="stat-value">${stats.websiteScore.correct}/${stats.websiteScore.total}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Accuracy:</span>
                            <span class="stat-value">${websiteAccuracy}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="result-card">
                    <h3>📝 Quiz Results</h3>
                    <div class="result-stats">
                        <div class="stat">
                            <span class="stat-label">Correct:</span>
                            <span class="stat-value">${stats.quizScore.correct}/${stats.quizScore.total}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Accuracy:</span>
                            <span class="stat-value">${quizAccuracy}%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="overall-stats">
                <h3>Overall Performance</h3>
                <p>Total Attempts: ${stats.totalAttempts}</p>
                <p>Correct Detections: ${stats.correctDetections}</p>
                <p>Overall Accuracy: ${stats.totalAttempts > 0 ? Math.round((stats.correctDetections / stats.totalAttempts) * 100) : 0}%</p>
            </div>
        `;
    }
}

// Email Analysis Modal Functions
function closeEmailModal() {
    const emailModal = document.getElementById('emailModal');
    if (emailModal) {
        emailModal.classList.remove('show');
    }
}

// Toolbar Action Functions
function archiveEmail() {
    if (!currentEmail) return;
    
    showNotification('Email archived successfully', 'success');
    setTimeout(() => {
        closeEmailModal();
    }, 1000);
}

function reportSpam() {
    if (!currentEmail) return;
    
    showNotification('Email reported as spam', 'success');
    setTimeout(() => {
        closeEmailModal();
    }, 1000);
}

function deleteEmail() {
    if (!currentEmail) return;
    
    showNotification('Email deleted', 'success');
    setTimeout(() => {
        closeEmailModal();
    }, 1000);
}

function replyEmail() {
    if (!currentEmail) return;
    
    showNotification('Reply feature coming soon!', 'info');
}

function forwardEmail() {
    if (!currentEmail) return;
    
    showNotification('Forward feature coming soon!', 'info');
}

// Security Analysis Functions
function startSecurityAnalysis() {
    if (!currentEmail) return;
    
    const analysisSpinner = document.getElementById('analysisSpinner');
    const statusText = document.getElementById('statusText');
    const analysisAction = document.getElementById('analysisAction');
    const analysisResults = document.getElementById('analysisResults');
    const threatLevel = document.getElementById('threatLevel');
    const threatScore = document.getElementById('threatScore');
    const severityBadge = document.getElementById('severityBadge');
    const redFlagsList = document.getElementById('redFlagsList');
    
    // Show spinner and update status
    analysisSpinner.style.display = 'block';
    statusText.textContent = 'Analyzing email security...';
    analysisAction.style.display = 'none';
    
    // Simulate analysis delay
    setTimeout(() => {
        analysisSpinner.style.display = 'none';
        statusText.textContent = 'Analysis complete';
        analysisResults.style.display = 'block';
        
        // Set threat level based on email type
        if (currentEmail.isPhishing) {
            threatLevel.className = 'threat-level high';
            threatScore.textContent = 'High Risk';
            severityBadge.textContent = 'High Risk';
            severityBadge.className = 'severity-indicator high';
            
            // Show red flags
            if (currentEmail.redFlags) {
                redFlagsList.innerHTML = currentEmail.redFlags.map(flag => 
                    `<li>⚠️ ${flag}</li>`
                ).join('');
            }
        } else {
            threatLevel.className = 'threat-level';
            threatScore.textContent = 'Low Risk';
            severityBadge.textContent = 'Safe';
            severityBadge.className = 'severity-indicator';
            
            redFlagsList.innerHTML = '<li>✅ No security threats detected</li><li>✅ Sender domain verified</li><li>✅ No suspicious links found</li>';
        }
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#6366f1';
    }
}
