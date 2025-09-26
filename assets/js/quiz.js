// Quiz Data and State Management
let currentQuestionIndex = 0;
let userAnswers = [];
let quizScore = 0;
let startTime = Date.now();

// Quiz Questions Data
const quizQuestions = [
    // Multiple Choice Questions
    {
        type: 'multiple-choice',
        question: 'Email ini phishing atau legitimate?',
        emailContent: {
            sender: 'security@paypaI-verification.com',
            subject: 'URGENT: Verify your PayPal account immediately',
            body: 'Your PayPal account has been temporarily suspended due to suspicious activity. Click the link below to verify your account within 24 hours or it will be permanently closed.'
        },
        options: [
            {
                icon: '✅',
                text: 'Legitimate',
                description: 'Email ini aman dan asli',
                correct: false
            },
            {
                icon: '⚠️',
                text: 'Phishing',
                description: 'Email ini mencurigakan dan berbahaya',
                correct: true
            },
            {
                icon: '❓',
                text: 'Tidak Yakin',
                description: 'Perlu analisis lebih lanjut',
                correct: false
            },
            {
                icon: '🔍',
                text: 'Butuh Investigasi',
                description: 'Perlu memeriksa sumber lebih detail',
                correct: false
            }
        ],
        explanation: 'Email ini adalah phishing karena menggunakan domain palsu (paypaI dengan huruf "I" besar), bahasa yang mendesak, dan ancaman penutupan akun.',
        points: 10
    },
    {
        type: 'multiple-choice',
        question: 'Manakah tanda-tanda email phishing yang paling jelas?',
        options: [
            {
                icon: '📧',
                text: 'Domain Mencurigakan',
                description: 'Email dari domain yang mirip tapi bukan asli',
                correct: true
            },
            {
                icon: '⏰',
                text: 'Waktu Pengiriman',
                description: 'Email dikirim pada malam hari',
                correct: false
            },
            {
                icon: '📝',
                text: 'Panjang Email',
                description: 'Email yang terlalu panjang',
                correct: false
            },
            {
                icon: '🎨',
                text: 'Warna Background',
                description: 'Menggunakan warna yang mencolok',
                correct: false
            }
        ],
        explanation: 'Domain mencurigakan adalah red flag utama. Penyerang sering menggunakan domain yang mirip dengan yang asli untuk menipu korban.',
        points: 15
    },
    
    // Drag and Drop Questions
    {
        type: 'drag-drop',
        question: 'Cocokkan red flags berikut dengan contoh yang sesuai:',
        dragItems: [
            { id: 'urgent-language', text: '🚨 Bahasa Mendesak', category: 'language' },
            { id: 'suspicious-domain', text: '🌐 Domain Mencurigakan', category: 'technical' },
            { id: 'grammar-error', text: '❌ Kesalahan Tata Bahasa', category: 'language' },
            { id: 'fake-attachment', text: '📎 Attachment Mencurigakan', category: 'technical' }
        ],
        dropZones: [
            {
                id: 'language',
                title: 'Indikator Bahasa',
                accepts: ['urgent-language', 'grammar-error'],
                example: 'Penggunaan kata-kata seperti "URGENT", "SEGERA", atau kesalahan ejaan'
            },
            {
                id: 'technical',
                title: 'Indikator Teknis',
                accepts: ['suspicious-domain', 'fake-attachment'],
                example: 'Domain palsu, link mencurigakan, atau file berbahaya'
            }
        ],
        points: 20
    },
    
    // Scenario-based Questions
    {
        type: 'scenario',
        question: 'Anda menerima email dari "bank" yang meminta verifikasi kartu kredit. Apa yang harus dilakukan?',
        scenario: {
            title: '🏦 Skenario: Email Verifikasi Bank',
            description: 'Anda menerima email yang mengaku dari bank Anda dengan subject "Verifikasi Segera - Kartu Kredit Akan Diblokir". Email meminta Anda mengklik link untuk memasukkan data kartu kredit dalam 2 jam atau kartu akan diblokir permanen.'
        },
        options: [
            {
                icon: '🖱️',
                text: 'Langsung Klik Link',
                description: 'Mengklik link yang ada di email',
                correct: false,
                feedback: 'Berbahaya! Jangan pernah mengklik link mencurigakan dari email.'
            },
            {
                icon: '📞',
                text: 'Hubungi Bank Langsung',
                description: 'Menghubungi customer service bank melalui nomor resmi',
                correct: true,
                feedback: 'Benar! Selalu verifikasi langsung ke bank melalui nomor resmi.'
            },
            {
                icon: '📧',
                text: 'Reply Email',
                description: 'Membalas email untuk bertanya',
                correct: false,
                feedback: 'Salah! Membalas email phishing bisa mengonfirmasi email Anda aktif.'
            },
            {
                icon: '⏰',
                text: 'Tunggu dan Lihat',
                description: 'Menunggu tanpa melakukan apapun',
                correct: false,
                feedback: 'Kurang tepat. Lebih baik aktif memverifikasi ke pihak bank.'
            }
        ],
        points: 25
    },
    
    {
        type: 'scenario',
        question: 'Teman Anda mengirim link "video lucu" yang terlihat aneh. Bagaimana respons Anda?',
        scenario: {
            title: '👥 Skenario: Link dari Teman',
            description: 'Teman dekat Anda tiba-tiba mengirim pesan dengan link video yang judulnya aneh dan meminta Anda segera menontonnya. Link tersebut mengarah ke situs yang tidak Anda kenal.'
        },
        options: [
            {
                icon: '🖱️',
                text: 'Langsung Buka Link',
                description: 'Membuka link karena dari teman',
                correct: false,
                feedback: 'Berbahaya! Akun teman mungkin sudah diretas.'
            },
            {
                icon: '📱',
                text: 'Tanya Teman Secara Langsung',
                description: 'Konfirmasi via telepon atau chat terpisah',
                correct: true,
                feedback: 'Benar! Selalu verifikasi link mencurigakan meski dari teman.'
            },
            {
                icon: '🔄',
                text: 'Share ke Teman Lain',
                description: 'Meneruskan link ke teman lain',
                correct: false,
                feedback: 'Salah! Ini bisa menyebarkan malware ke lebih banyak orang.'
            },
            {
                icon: '🗑️',
                text: 'Hapus Pesan',
                description: 'Menghapus pesan tanpa melakukan apapun',
                correct: false,
                feedback: 'Kurang tepat. Lebih baik beri tahu teman bahwa akunnya mungkin bermasalah.'
            }
        ],
        points: 25
    },
    
    // More Multiple Choice
    {
        type: 'multiple-choice',
        question: 'Mana yang BUKAN merupakan ciri-ciri URL yang aman?',
        options: [
            {
                icon: '🔒',
                text: 'Dimulai dengan HTTPS',
                description: 'Memiliki sertifikat keamanan',
                correct: false
            },
            {
                icon: '🏢',
                text: 'Domain Resmi Perusahaan',
                description: 'Menggunakan domain yang terverifikasi',
                correct: false
            },
            {
                icon: '🔢',
                text: 'Menggunakan IP Address',
                description: 'URL berupa angka-angka IP',
                correct: true
            },
            {
                icon: '📜',
                text: 'Memiliki Sertifikat SSL',
                description: 'Terenkripsi dan terverifikasi',
                correct: false
            }
        ],
        explanation: 'URL yang menggunakan IP Address (seperti 192.168.1.1) alih-alih nama domain proper adalah tanda bahaya. Website legit menggunakan nama domain.',
        points: 15
    },
    
    // Advanced Drag and Drop
    {
        type: 'drag-drop',
        question: 'Kelompokkan teknik phishing berikut berdasarkan jenisnya:',
        dragItems: [
            { id: 'email-spoofing', text: '📧 Email Spoofing', category: 'email' },
            { id: 'fake-website', text: '🌐 Website Palsu', category: 'web' },
            { id: 'sms-phishing', text: '📱 SMS Phishing', category: 'mobile' },
            { id: 'pharming', text: '🔀 Pharming', category: 'web' },
            { id: 'vishing', text: '📞 Voice Phishing', category: 'mobile' },
            { id: 'typosquatting', text: '⌨️ Typosquatting', category: 'web' }
        ],
        dropZones: [
            {
                id: 'email',
                title: 'Email-based Phishing',
                accepts: ['email-spoofing'],
                example: 'Serangan melalui email palsu'
            },
            {
                id: 'web',
                title: 'Web-based Phishing',
                accepts: ['fake-website', 'pharming', 'typosquatting'],
                example: 'Serangan melalui website atau domain palsu'
            },
            {
                id: 'mobile',
                title: 'Mobile/Voice Phishing',
                accepts: ['sms-phishing', 'vishing'],
                example: 'Serangan melalui SMS atau telepon'
            }
        ],
        points: 30
    },
    
    // Final Multiple Choice
    {
        type: 'multiple-choice',
        question: 'Apa langkah pertama yang harus dilakukan saat menerima email mencurigakan?',
        options: [
            {
                icon: '🗑️',
                text: 'Langsung Hapus',
                description: 'Menghapus email tanpa membaca',
                correct: false
            },
            {
                icon: '🔍',
                text: 'Periksa Pengirim',
                description: 'Verifikasi alamat email dan domain pengirim',
                correct: true
            },
            {
                icon: '📤',
                text: 'Forward ke Teman',
                description: 'Meneruskan ke orang lain untuk meminta pendapat',
                correct: false
            },
            {
                icon: '💾',
                text: 'Download Attachment',
                description: 'Mengunduh lampiran untuk diperiksa',
                correct: false
            }
        ],
        explanation: 'Langkah pertama adalah selalu memeriksa alamat pengirim dan domain email. Ini adalah cara tercepat untuk mengidentifikasi email mencurigakan.',
        points: 10
    }
];

// Leaderboard Data
let leaderboard = [
    { name: 'Alex Chen', score: 250, accuracy: 95 },
    { name: 'Maria Rodriguez', score: 235, accuracy: 92 },
    { name: 'David Kim', score: 220, accuracy: 88 },
    { name: 'Sarah Johnson', score: 205, accuracy: 85 },
    { name: 'Michael Brown', score: 190, accuracy: 82 }
];

// Initialize Quiz
function initializeQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    quizScore = 0;
    startTime = Date.now();
    
    updateStats();
    renderQuestion();
    updateControls();
}

// Render Current Question
function renderQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const container = document.getElementById('quizContent');
    
    let questionHTML = `
        <div class="quiz-card">
            <div class="question-header">
                <div class="question-number">${currentQuestionIndex + 1}</div>
                <span class="question-type">${getQuestionTypeLabel(question.type)}</span>
            </div>
            <h2 class="question-title">${question.question}</h2>
    `;
    
    // Render based on question type
    switch (question.type) {
        case 'multiple-choice':
            questionHTML += renderMultipleChoice(question);
            break;
        case 'drag-drop':
            questionHTML += renderDragDrop(question);
            break;
        case 'scenario':
            questionHTML += renderScenario(question);
            break;
    }
    
    questionHTML += '</div>';
    
    container.innerHTML = questionHTML;
    
    // Add event listeners based on question type
    if (question.type === 'multiple-choice' || question.type === 'scenario') {
        addMultipleChoiceListeners();
    } else if (question.type === 'drag-drop') {
        addDragDropListeners();
    }
    
    // Restore previous answer if exists
    restorePreviousAnswer();
}

// Render Multiple Choice Question
function renderMultipleChoice(question) {
    let html = '';
    
    // Add email content if exists
    if (question.emailContent) {
        html += `
            <div class="scenario-container">
                <div class="scenario-title">📧 Email Content</div>
                <div class="scenario-description">
                    <strong>From:</strong> ${question.emailContent.sender}<br>
                    <strong>Subject:</strong> ${question.emailContent.subject}<br><br>
                    ${question.emailContent.body}
                </div>
            </div>
        `;
    }
    
    html += '<div class="options-grid">';
    
    question.options.forEach((option, index) => {
        html += `
            <div class="option-card" data-option="${index}">
                <div class="option-icon">${option.icon}</div>
                <div class="option-text">${option.text}</div>
                <div class="option-description">${option.description}</div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Render Drag and Drop Question
function renderDragDrop(question) {
    let html = `
        <div class="drag-drop-container">
            <div class="drag-items">
                <h3>🎯 Drag Items</h3>
    `;
    
    question.dragItems.forEach(item => {
        html += `
            <div class="drag-item" draggable="true" data-item="${item.id}" data-category="${item.category}">
                ${item.text}
            </div>
        `;
    });
    
    html += `
            </div>
            <div class="drop-zones">
                <h3>📋 Drop Zones</h3>
    `;
    
    question.dropZones.forEach(zone => {
        html += `
            <div class="drop-zone" data-zone="${zone.id}">
                <div>
                    <strong>${zone.title}</strong><br>
                    <small>${zone.example}</small>
                </div>
            </div>
        `;
    });
    
    html += '</div></div>';
    return html;
}

// Render Scenario Question
function renderScenario(question) {
    let html = `
        <div class="scenario-container">
            <div class="scenario-title">${question.scenario.title}</div>
            <div class="scenario-description">${question.scenario.description}</div>
        </div>
        
        <div class="scenario-actions">
    `;
    
    question.options.forEach((option, index) => {
        html += `
            <div class="scenario-action" data-option="${index}">
                <div class="option-icon">${option.icon}</div>
                <div class="option-text">${option.text}</div>
                <div class="option-description">${option.description}</div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Add Multiple Choice Event Listeners
function addMultipleChoiceListeners() {
    document.querySelectorAll('.option-card, .scenario-action').forEach(option => {
        option.addEventListener('click', function() {
            // Remove previous selections
            document.querySelectorAll('.option-card, .scenario-action').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selection to clicked option
            this.classList.add('selected');
            
            // Store answer
            const optionIndex = parseInt(this.dataset.option);
            userAnswers[currentQuestionIndex] = optionIndex;
            
            // Add animation
            this.classList.add('bounce-in');
            setTimeout(() => this.classList.remove('bounce-in'), 600);
        });
    });
}

// Add Drag and Drop Event Listeners
function addDragDropListeners() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    dragItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.item);
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const itemId = e.dataTransfer.getData('text/plain');
            const dragItem = document.querySelector(`[data-item="${itemId}"]`);
            
            if (dragItem) {
                // Add item to drop zone
                this.innerHTML = `
                    <div class="dropped-item" data-item="${itemId}">
                        ${dragItem.textContent}
                    </div>
                `;
                this.classList.add('filled');
                
                // Hide original item
                dragItem.style.display = 'none';
                
                // Store answer
                if (!userAnswers[currentQuestionIndex]) {
                    userAnswers[currentQuestionIndex] = {};
                }
                userAnswers[currentQuestionIndex][this.dataset.zone] = itemId;
            }
        });
    });
}

// Navigation Functions
function nextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        updateStats();
        renderQuestion();
        updateControls();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateStats();
        renderQuestion();
        updateControls();
    }
}

// Submit Quiz
function submitQuiz() {
    calculateFinalScore();
    showResults();
    updateLeaderboard();
}

// Calculate Final Score
function calculateFinalScore() {
    quizScore = 0;
    
    quizQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        
        if (question.type === 'multiple-choice' || question.type === 'scenario') {
            if (userAnswer !== undefined && question.options[userAnswer].correct) {
                quizScore += question.points;
            }
        } else if (question.type === 'drag-drop') {
            if (userAnswer) {
                let correctMatches = 0;
                let totalExpected = 0;
                
                question.dropZones.forEach(zone => {
                    totalExpected += zone.accepts.length;
                    if (userAnswer[zone.id] && zone.accepts.includes(userAnswer[zone.id])) {
                        correctMatches++;
                    }
                });
                
                const accuracy = correctMatches / totalExpected;
                quizScore += Math.round(question.points * accuracy);
            }
        }
    });
}

// Show Results
function showResults() {
    const totalPossibleScore = quizQuestions.reduce((sum, q) => sum + q.points, 0);
    const accuracy = Math.round((quizScore / totalPossibleScore) * 100);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    // Determine performance level
    let performanceClass, performanceText, performanceEmoji;
    if (accuracy >= 90) {
        performanceClass = 'performance-excellent';
        performanceText = 'Excellent!';
        performanceEmoji = '🏆';
    } else if (accuracy >= 75) {
        performanceClass = 'performance-good';
        performanceText = 'Good Job!';
        performanceEmoji = '⭐';
    } else if (accuracy >= 60) {
        performanceClass = 'performance-average';
        performanceText = 'Not Bad!';
        performanceEmoji = '👍';
    } else {
        performanceClass = 'performance-poor';
        performanceText = 'Keep Trying!';
        performanceEmoji = '💪';
    }
    
    const resultHTML = `
        <div class="quiz-card">
            <div class="text-center">
                <h2 class="quiz-result-title">🎉 Quiz Completed!</h2>
                
                <div class="performance-badge ${performanceClass}">
                    ${performanceEmoji} ${performanceText}
                </div>
                
                <div class="quiz-result-stats">
                    <div class="result-stat-card">
                        <span class="result-stat-number">${quizScore}</span>
                        <span class="result-stat-label">Final Score</span>
                    </div>
                    <div class="result-stat-card">
                        <span class="result-stat-number">${accuracy}%</span>
                        <span class="result-stat-label">Accuracy</span>
                    </div>
                    <div class="result-stat-card">
                        <span class="result-stat-number">${timeTaken}s</span>
                        <span class="result-stat-label">Time Taken</span>
                    </div>
                </div>
                
                <div class="quiz-controls">
                    <button class="quiz-btn btn-primary" onclick="initializeQuiz()">
                        🔄 Retake Quiz
                    </button>
                    <button class="quiz-btn btn-secondary" onclick="showLeaderboard()">
                        🏆 View Leaderboard
                    </button>
                    <button class="quiz-btn btn-secondary" onclick="shareResults(${accuracy}, ${quizScore})">
                        📤 Share Results
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('quizContent').innerHTML = resultHTML;
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';
}

// Update Stats Display
function updateStats() {
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = quizQuestions.length;
    
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Calculate current score and accuracy
    let tempScore = 0;
    let answered = 0;
    
    userAnswers.forEach((answer, index) => {
        if (answer !== undefined) {
            answered++;
            const question = quizQuestions[index];
            
            if (question.type === 'multiple-choice' || question.type === 'scenario') {
                if (question.options[answer].correct) {
                    tempScore += question.points;
                }
            }
        }
    });
    
    document.getElementById('currentScore').textContent = tempScore;
    
    const currentAccuracy = answered > 0 ? Math.round((tempScore / (answered * 20)) * 100) : 0;
    document.getElementById('accuracy').textContent = currentAccuracy + '%';
}

// Update Controls
function updateControls() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }
}

// Restore Previous Answer
function restorePreviousAnswer() {
    const answer = userAnswers[currentQuestionIndex];
    
    if (answer !== undefined) {
        const question = quizQuestions[currentQuestionIndex];
        
        if (question.type === 'multiple-choice' || question.type === 'scenario') {
            const option = document.querySelector(`[data-option="${answer}"]`);
            if (option) option.classList.add('selected');
        }
    }
}

// Utility Functions
function getQuestionTypeLabel(type) {
    switch (type) {
        case 'multiple-choice': return '📝 Multiple Choice';
        case 'drag-drop': return '🎯 Drag & Drop';
        case 'scenario': return '🎭 Scenario';
        default: return '❓ Question';
    }
}

// Show Leaderboard
function showLeaderboard() {
    document.getElementById('leaderboard').style.display = 'block';
    
    const content = document.getElementById('leaderboardContent');
    let html = '';
    
    leaderboard.forEach((player, index) => {
        let rankClass = '';
        let rankEmoji = '';
        
        if (index === 0) {
            rankClass = 'gold';
            rankEmoji = '🥇';
        } else if (index === 1) {
            rankClass = 'silver';
            rankEmoji = '🥈';
        } else if (index === 2) {
            rankClass = 'bronze';
            rankEmoji = '🥉';
        }
        
        html += `
            <div class="leaderboard-item">
                <div class="leaderboard-rank ${rankClass}">
                    ${index < 3 ? rankEmoji : index + 1}
                </div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${player.name}</div>
                    <div class="leaderboard-score">Accuracy: ${player.accuracy}%</div>
                </div>
                <div class="leaderboard-points">${player.score}</div>
            </div>
        `;
    });
    
    content.innerHTML = html;
    
    // Scroll to leaderboard
    document.getElementById('leaderboard').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Update Leaderboard
function updateLeaderboard() {
    const playerName = prompt('Enter your name for the leaderboard:') || 'Anonymous';
    const totalPossibleScore = quizQuestions.reduce((sum, q) => sum + q.points, 0);
    const accuracy = Math.round((quizScore / totalPossibleScore) * 100);
    
    leaderboard.push({
        name: playerName,
        score: quizScore,
        accuracy: accuracy
    });
    
    // Sort leaderboard by score
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 10
    leaderboard = leaderboard.slice(0, 10);
    
    showLeaderboard();
}

// Share Results Function
function shareResults(accuracy, score) {
    const message = `🎉 I just completed the PhishX Quiz!\n\n📊 My Results:\n• Score: ${score} points\n• Accuracy: ${accuracy}%\n• Quiz: Phishing Detection Challenge\n\n🛡️ Test your cybersecurity skills too!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'PhishX Quiz Results',
            text: message
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(message).then(() => {
            alert('Results copied to clipboard! 📋');
        }).catch(() => {
            // Final fallback - show in alert
            alert(message);
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
});