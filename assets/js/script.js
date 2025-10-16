// CyberHoot - Modern Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menu Toggle (Responsive Nav)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
        // Close menu when clicking outside or a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // Highlight active navigation link
    highlightActiveLink();

    // Animate cards/sections on initial load (fade-in)
    setTimeout(() => {
        const cards = document.querySelectorAll('.card, .resource-item, .tool-card, .feature-item');
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.97)';
            card.style.transition = 'opacity 0.7s cubic-bezier(.42,.14,.53,1.28), transform 0.7s cubic-bezier(.42,.14,.53,1.28)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 150 + i * 80);
        });
    }, 200);

    // Initialize quiz if on quiz page
    if (document.querySelector('.quiz-container')) {
        initQuiz();
    }

    // Initialize contact form if on contact page
    if (document.querySelector('.contact-form')) {
        initContactForm();
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Highlight Active Navigation Link
function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// Quiz Functionality
function initQuiz() {
    const quizForm = document.getElementById('quiz-form');
    const submitBtn = document.getElementById('submit-quiz');
    const resultDiv = document.getElementById('quiz-result');
    const scoreSpan = document.getElementById('score');
    const retryBtn = document.getElementById('retry-quiz');
    if (!quizForm) return;
    const answers = { q1: 'b', q2: 'c', q3: 'b', q4: 'c', q5: 'b' };
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        calculateScore();
    });
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            quizForm.reset();
            resultDiv.classList.remove('show', 'success', 'warning');
        });
    }
    function calculateScore() {
        let score = 0, total = Object.keys(answers).length;
        for (let question in answers) {
            const userAnswer = document.querySelector(`input[name="${question}"]:checked`);
            if (userAnswer && userAnswer.value === answers[question]) score++;
        }
        const percentage = (score / total) * 100;
        scoreSpan.textContent = `${score}/${total}`;
        resultDiv.classList.add('show');
        if (percentage >= 70) {
            resultDiv.classList.add('success');
            resultDiv.classList.remove('warning');
            showToast('Great job! You passed the quiz!', 'success');
        } else {
            resultDiv.classList.add('warning');
            resultDiv.classList.remove('success');
            showToast('Keep learning! Review resources for more.', 'error');
        }
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        if (!validateForm(formData)) return;
        showFormMessage('success', 'Thank you for your message! We will get back to you soon.');
        showToast('Message sent!', 'success');
        contactForm.reset();
    });
}

function validateForm(data) {
    if (!data.name || data.name.trim().length < 2) {
        showFormMessage('error', 'Please enter a valid name.');
        showToast('Name is required.', 'error');
        return false;
    }
    if (!data.email || !isValidEmail(data.email)) {
        showFormMessage('error', 'Please enter a valid email address.');
        showToast('Invalid email address.', 'error');
        return false;
    }
    if (!data.subject || data.subject.trim().length < 3) {
        showFormMessage('error', 'Please enter a subject.');
        showToast('Subject is required.', 'error');
        return false;
    }
    if (!data.message || data.message.trim().length < 10) {
        showFormMessage('error', 'Please enter a message (at least 10 characters).');
        showToast('Message is too short.', 'error');
        return false;
    }
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(type, message) {
    const existingMsg = document.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.padding = '1rem';
    messageDiv.style.marginTop = '1rem';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.textAlign = 'center';
    messageDiv.textContent = message;
    if (type === 'success') {
        messageDiv.style.backgroundColor = 'rgba(40, 167, 69, 0.11)';
        messageDiv.style.border = '2px solid #28a745';
        messageDiv.style.color = '#28a745';
    } else {
        messageDiv.style.backgroundColor = 'rgba(220, 53, 69, 0.09)';
        messageDiv.style.border = '2px solid #dc3545';
        messageDiv.style.color = '#dc3545';
    }
    const form = document.getElementById('contact-form');
    form.appendChild(messageDiv);
    setTimeout(() => { messageDiv.remove(); }, 5000);
}

// Toast Notification (for feedback, quiz, forms, etc.)
function showToast(message, type="info") {
    let toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}
