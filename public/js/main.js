// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Tabs Functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');

        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showNotification('Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again later.', 'error');
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        font-weight: 600;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        padding: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step-card, .use-case-layout').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add fadeInUp animation
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animationStyle);

// Workflow Data Loading (if on workflows page)
async function loadWorkflows() {
    try {
        const response = await fetch('/api/workflows');
        const workflows = await response.json();
        displayWorkflows(workflows);
    } catch (error) {
        console.error('Error loading workflows:', error);
    }
}

function displayWorkflows(workflows) {
    const container = document.getElementById('workflows-container');
    if (!container) return;

    container.innerHTML = workflows.map(workflow => `
        <div class="workflow-card">
            <div class="workflow-header">
                <h3>${workflow.title}</h3>
                <span class="complexity-badge complexity-${workflow.complexity.toLowerCase()}">${workflow.complexity}</span>
            </div>
            <p>${workflow.description}</p>
            <div class="workflow-footer">
                <span class="category"><i class="fas fa-tag"></i> ${workflow.category}</span>
                <span class="time"><i class="fas fa-clock"></i> ${workflow.estimatedTime}</span>
            </div>
        </div>
    `).join('');
}

// Guide Data Loading
async function loadGuide() {
    try {
        const response = await fetch('/api/guide');
        const guide = await response.json();
        displayGuide(guide);
    } catch (error) {
        console.error('Error loading guide:', error);
    }
}

function displayGuide(guide) {
    const container = document.getElementById('guide-container');
    if (!container) return;

    container.innerHTML = guide.steps.map(step => `
        <div class="guide-step">
            <div class="guide-step-number">${step.step}</div>
            <h3>${step.title}</h3>
            <p>${step.description}</p>
            ${step.commands ? `
                <div class="commands">
                    ${step.commands.map(cmd => `<code>${cmd}</code>`).join('')}
                </div>
            ` : ''}
            ${step.tips ? `
                <ul class="tips">
                    ${step.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            ` : ''}
            ${step.requirements ? `
                <ul class="requirements">
                    ${step.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
            ` : ''}
            ${step.checklist ? `
                <ul class="checklist">
                    ${step.checklist.map(item => `<li><input type="checkbox"> ${item}</li>`).join('')}
                </ul>
            ` : ''}
        </div>
    `).join('');
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('workflows-container')) {
        loadWorkflows();
    }
    if (document.getElementById('guide-container')) {
        loadGuide();
    }
});

// Scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    z-index: 1000;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'translateY(-5px)';
    scrollToTopBtn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'translateY(0)';
    scrollToTopBtn.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
});
