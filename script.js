const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.mobile-menu a');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Project card touch handling for mobile
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    let touchTimeout;

    card.addEventListener('touchstart', (e) => {
        // Mark that we're touching
        card.dataset.touching = 'true';

        // Clear any pending click prevention
        clearTimeout(touchTimeout);

        // Small delay to allow scroll to be detected
        touchTimeout = setTimeout(() => {
            card.dataset.touching = 'false';
        }, 300);
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
        // If this was a tap (not a scroll), allow navigation
        // If it was a scroll, prevent the click
        const touch = e.changedTouches[0];
        const rect = card.getBoundingClientRect();

        // Check if touch stayed within card bounds (was a tap)
        const wasTap = (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
        );

        if (!wasTap) {
            e.preventDefault();
        }
    });

    // Prevent ghost clicks on mobile
    card.addEventListener('click', (e) => {
        // On mobile devices, the browser might trigger hover + click together
        // This prevents unexpected navigation
        const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

        if (isMobile) {
            // On mobile, we let the natural click behavior work (navigation)
            // But we prevent any double-fire issues
            e.stopPropagation();
        }
    });
});
