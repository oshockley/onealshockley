// ============================================
// GITHUB API INTEGRATION
// ============================================
async function fetchGitHubProjects() {
    const username = 'oshockley';
    const container = document.getElementById('githubProjects');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        
        container.innerHTML = repos.map(repo => `
            <div class="github-card reveal-animation">
                <div class="github-card-header">
                    <i class="fab fa-github"></i>
                    <div class="github-card-title">
                        <h3>${repo.name}</h3>
                        <p>Updated ${new Date(repo.updated_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="github-card-description">
                    ${repo.description || 'No description provided'}
                </div>
                <div class="github-card-footer">
                    <div class="github-stats">
                        <div class="github-stat">
                            <i class="fas fa-star"></i>
                            <span>${repo.stargazers_count}</span>
                        </div>
                        <div class="github-stat">
                            <i class="fas fa-code-branch"></i>
                            <span>${repo.forks_count}</span>
                        </div>
                    </div>
                    ${repo.language ? `
                        <div class="github-language">
                            <span class="github-language-dot"></span>
                            <span>${repo.language}</span>
                        </div>
                    ` : ''}
                </div>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="position: absolute; inset: 0; z-index: 10;"></a>
            </div>
        `).join('');
        
        // Trigger animations
        setTimeout(() => {
            document.querySelectorAll('.github-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 100}ms`;
            });
        }, 100);
        
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        container.innerHTML = `
            <div style="text-align: center; color: var(--color-text-muted); padding: 2rem;">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem; color: var(--color-accent);"></i>
                <p>Unable to load projects. Please visit my <a href="https://github.com/${username}" target="_blank" style="color: var(--color-accent);">GitHub profile</a> directly.</p>
            </div>
        `;
    }
}

// Load GitHub projects when page loads
if (document.getElementById('githubProjects')) {
    fetchGitHubProjects();
}

// ============================================
// CODE SNIPPET COPY FUNCTIONALITY
// ============================================
function copyCode(elementId) {
    const codeBlock = document.getElementById(elementId);
    const code = codeBlock.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        // Find the button that was clicked
        const button = event.target.closest('.copy-code');
        const originalHTML = button.innerHTML;
        
        // Show success feedback
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.background = 'var(--color-accent)';
        button.style.color = 'white';
        
        // Reset after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
    });
}

// ============================================
// MAGNETIC BUTTON EFFECT (ENHANCED)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const magneticButtons = document.querySelectorAll('.cta-magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.3;
            const moveY = y * 0.3;
            
            button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });
});

// ============================================
// STAGGERED REVEAL ON SCROLL
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-animation');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Observe elements for staggered reveal
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.code-card, .github-card, .cta-content > *');
    revealElements.forEach((el, index) => {
        el.classList.add(`delay-${(index % 5 + 1) * 100}`);
        revealObserver.observe(el);
    });
});

// ============================================
// PARALLAX SCROLL EFFECT FOR PROJECT IMAGES
// ============================================
let ticking = false;

function updateParallax() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        
        if (scrollPercent > 0 && scrollPercent < 1) {
            const image = card.querySelector('.project-image');
            if (image) {
                const moveY = (scrollPercent - 0.5) * 20;
                image.style.transform = `translateY(${moveY}px)`;
            }
        }
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ============================================
// ENHANCED BUTTON INTERACTIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// TECH MARQUEE PAUSE ON HOVER
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const marqueeContent = document.querySelector('.marquee-content');
    
    if (marqueeContent) {
        marqueeContent.addEventListener('mouseenter', () => {
            marqueeContent.style.animationPlayState = 'paused';
        });
        
        marqueeContent.addEventListener('mouseleave', () => {
            marqueeContent.style.animationPlayState = 'running';
        });
    }
});

// ============================================
// SMOOTH SCROLL TO SECTIONS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
// Skip to main content
document.addEventListener('DOMContentLoaded', () => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--color-accent);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 0 0 4px 0;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if not exists
    const mainSection = document.querySelector('#home') || document.querySelector('section');
    if (mainSection && !document.getElementById('main-content')) {
        mainSection.id = 'main-content';
    }
});

// ============================================
// CONSOLE MESSAGE FOR RECRUITERS
// ============================================
console.log('%c👋 Hello there!', 'font-size: 24px; font-weight: bold; color: #10b981;');
console.log('%cI see you\'re checking out the code. I like your style! 🚀', 'font-size: 16px; color: #94a3b8;');
console.log('%cThis portfolio is built with vanilla JavaScript, semantic HTML5, and modern CSS. No frameworks needed! ⚡', 'font-size: 14px; color: #cbd5e1;');
console.log('%cInterested in working together? Let\'s connect!', 'font-size: 14px; color: #10b981; font-weight: bold;');
console.log('%cEmail: shockleyoneal@gmail.com', 'font-size: 12px; color: #94a3b8;');
