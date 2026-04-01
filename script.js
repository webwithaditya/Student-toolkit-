// Global Script for Student Toolkit - by webwithaditya

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbar();
    initRevealAnimations();
    initFeedback();
    initSmoothScroll();
    initMobileMenu();
    setupCommonTools();
});

// Theme Management
function initTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    
    body.classList.add(savedTheme);
    updateThemeIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                body.classList.replace('light-mode', 'dark-mode');
                localStorage.setItem('theme', 'dark-mode');
                updateThemeIcon('dark-mode');
            } else {
                body.classList.replace('dark-mode', 'light-mode');
                localStorage.setItem('theme', 'light-mode');
                updateThemeIcon('light-mode');
            }
        });
    }
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (!icon) return;
    if (theme === 'dark-mode') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Navbar Scroll Effect
function initNavbar() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// Reveal Animations (Intersection Observer)
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

// Feedback System
function initFeedback() {
    const feedbackForm = document.getElementById('feedback-form');
    if (!feedbackForm) return;

    const stars = document.querySelectorAll('#star-rating i');
    const submitBtn = feedbackForm.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('feedback-success');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = star.dataset.rating;
            updateStars(selectedRating);
        });

        star.addEventListener('mouseover', () => {
            updateStars(star.dataset.rating);
        });
    });

    const starContainer = document.getElementById('star-rating');
    if (starContainer) {
        starContainer.addEventListener('mouseleave', () => {
            updateStars(selectedRating);
        });
    }

    function updateStars(rating) {
        stars.forEach(s => {
            if (s.dataset.rating <= rating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    }

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const feedbackMessage = document.getElementById('feedback-message').value.trim();
        const feedbackName = document.getElementById('feedback-name').value.trim();

        if (selectedRating === 0) {
            alert('Please select a star rating!');
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSffFfJpuN087YbfhEiyr2iWRVeeeVlYlaTjYUscJwxYzpgYrA/formResponse';
        
        const formData = new URLSearchParams();
        formData.append('entry.1119127552', feedbackName || 'Anonymous');
        formData.append('entry.1776065547', selectedRating);
        formData.append('entry.1955009921', feedbackMessage);

        fetch(FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        })
        .then(() => {
            setTimeout(() => {
                feedbackForm.style.display = 'none';
                successMsg.style.display = 'block';
                feedbackForm.reset();
                selectedRating = 0;
                updateStars(0);
            }, 500);
        })
        .catch(error => {
            console.error('Error submitting feedback:', error);
            alert('Something went wrong. Please try again!');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
    });
}

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hash = this.hash;
            if (hash !== "") {
                if (document.querySelector(hash)) {
                    e.preventDefault();
                    document.querySelector(hash).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Mobile Menu Toggle Logic
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (menuToggle.querySelector('i')) {
                    menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                }
            });
        });
    }
}

// Helper to show/hide loader
window.showLoader = (text = "Processing...") => {
    const loader = document.getElementById('loader-overlay');
    const loaderText = document.getElementById('loader-text');
    if (loader) {
        if (loaderText) loaderText.textContent = text;
        loader.style.display = 'flex';
    }
};

window.hideLoader = () => {
    const loader = document.getElementById('loader-overlay');
    if (loader) loader.style.display = 'none';
};

// Common tool behaviors
function setupCommonTools() {
    // Add success message behavior if needed
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                btn.innerHTML = originalContent;
            }, 2000);
        });
    });
}
