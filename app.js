// Portfolio JavaScript for Mukesh Biswas - Updated Version

// ======= Helper Functions =======
const select = (selector, scope = document) => scope.querySelector(selector);
const selectAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// ======= Resume Download Functionality =======
const downloadResumeBtn = select('#download-resume');
if (downloadResumeBtn) {
  downloadResumeBtn.addEventListener('click', () => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Mukesh Biswas - Staff Technical Writer Resume\n\nThis is a placeholder resume file. Please replace with actual resume PDF.';
    link.download = 'Mukesh_Biswas_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Resume download initiated!');
  });
}

// ======= Navigation Toggle (Mobile) =======
const navToggle = select('#nav-toggle');
const navMenu = select('#nav-menu');
const navLinks = selectAll('.nav-link');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    // Close mobile menu after navigating
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });
});

// ======= Dark / Light Mode Toggle =======
const themeToggleBtn = select('#theme-toggle');
const htmlElement = document.documentElement;

function currentTheme() {
  return htmlElement.getAttribute('data-color-scheme');
}

function toggleTheme() {
  const isDark = currentTheme() === 'dark';
  htmlElement.setAttribute('data-color-scheme', isDark ? 'light' : 'dark');
  // Update icon
  themeToggleBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  
  // Save preference to localStorage if available
  try {
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  } catch (e) {
    // localStorage not available, continue without saving
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', toggleTheme);
  
  // Initialize theme based on saved preference or system preference
  let initialTheme = 'light';
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? 'dark' : 'light';
    }
  } catch (e) {
    // localStorage not available, use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    initialTheme = prefersDark ? 'dark' : 'light';
  }
  
  if (!currentTheme()) {
    htmlElement.setAttribute('data-color-scheme', initialTheme);
  }
  themeToggleBtn.innerHTML = currentTheme() === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// ======= Navbar Background and Visibility on Scroll - FIXED =======
const navbar = select('#navbar');
let lastScrollY = window.scrollY;

function updateNavbar() {
  const currentScrollY = window.scrollY;
  
  // Change background based on scroll position
  if (currentScrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScrollY = currentScrollY;
}

// ======= Active Navigation Link on Scroll - ENHANCED =======
const sections = selectAll('section[id]');

function activateNavLink() {
  const scrollY = window.pageYOffset;
  let activeSection = null;
  
  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150; // Offset for navbar height
    const sectionId = section.getAttribute('id');
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      activeSection = sectionId;
    }
  });
  
  // Update active nav link
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    if (linkHref === `#${activeSection}`) {
      link.classList.add('active');
    }
  });
}

// ======= Scroll-Triggered Animations =======
const skillSection = select('#skills');
const skillProgressBars = selectAll('.skill-progress');
let skillsAnimated = false;

function animateSkillBars() {
  if (skillsAnimated) return;
  skillProgressBars.forEach((bar, index) => {
    const level = bar.dataset.level;
    setTimeout(() => {
      bar.style.width = level + '%';
    }, index * 100); // Stagger animations
  });
  skillsAnimated = true;
}

const observerOptions = {
  threshold: 0.3,
};

if (skillSection) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkillBars();
      }
    });
  }, observerOptions);
  sectionObserver.observe(skillSection);
}

// Fade-in / slide-in animations for elements with classes
const animatedElements = selectAll('.fade-in, .slide-in-left, .slide-in-right');
if (animatedElements.length > 0) {
  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animationObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedElements.forEach((el) => animationObserver.observe(el));
}

// ======= Smooth Scroll for Navigation Links =======
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    if (link.hash !== '') {
      e.preventDefault();
      const target = document.querySelector(link.hash);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20; // Extra offset for better positioning
        window.scrollTo({ 
          top: targetPosition, 
          behavior: 'smooth' 
        });
      }
    }
  });
});

// ======= Project Cards Interaction =======
const projectCards = selectAll('.project-card');
projectCards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-8px)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// ======= Contact Section Email Copy =======
const emailLink = select('.contact-item a[href^="mailto:"]');
if (emailLink) {
  emailLink.addEventListener('click', (e) => {
    const email = emailLink.href.replace('mailto:', '');
    
    // Try to copy email to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        showNotification('Email copied to clipboard!');
      }).catch(() => {
        // Clipboard API failed, continue with normal mailto behavior
      });
    }
  });
}

// ======= Notification System =======
function showNotification(message) {
  // Remove existing notifications
  const existingNotification = select('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-success);
    color: white;
    padding: 1rem 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    font-weight: var(--font-weight-medium);
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// ======= Combined Scroll Event Handler =======
function handleScroll() {
  updateNavbar();
  activateNavLink();
}

// ======= Performance Optimization =======
// Throttle scroll events for better performance
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply throttling to scroll events
const throttledHandleScroll = throttle(handleScroll, 16); // ~60fps

window.addEventListener('scroll', throttledHandleScroll);

// ======= Initialize on DOM Content Loaded =======
document.addEventListener('DOMContentLoaded', () => {
  // Set initial state
  updateNavbar();
  activateNavLink();
  
  // Add fade-in animation to page sections
  const pageElements = selectAll('.hero, .about, .skills, .experience, .projects, .contact');
  pageElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });
  
  // Initialize skill bars animation observer
  if (skillSection && skillProgressBars.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !skillsAnimated) {
          animateSkillBars();
        }
      });
    }, { threshold: 0.5 });
    
    skillObserver.observe(skillSection);
  }
});

// ======= Handle External Links =======
const externalLinks = selectAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
externalLinks.forEach((link) => {
  if (!link.hasAttribute('target')) {
    link.setAttribute('target', '_blank');
  }
  if (!link.hasAttribute('rel')) {
    link.setAttribute('rel', 'noopener noreferrer');
  }
});

// ======= Accessibility Improvements =======
// Add focus management for mobile menu
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      // Focus the first navigation link when menu opens
      const firstNavLink = select('.nav-link', navMenu);
      if (firstNavLink) {
        setTimeout(() => firstNavLink.focus(), 100);
      }
    }
  });
  
  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.focus();
    }
  });
}

// ======= Enhanced Navigation Visibility =======
// Ensure navigation links are always visible and properly highlighted
function enhanceNavVisibility() {
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  
  // If there's a hash in the URL, scroll to that section
  if (currentHash) {
    const targetSection = select(currentHash);
    if (targetSection) {
      setTimeout(() => {
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight - 20;
        window.scrollTo({ 
          top: targetPosition, 
          behavior: 'smooth' 
        });
      }, 100);
    }
  }
}

// ======= Initialize Enhanced Features =======
window.addEventListener('load', () => {
  enhanceNavVisibility();
  updateNavbar();
  activateNavLink();
});

// ======= Handle Hash Changes =======
window.addEventListener('hashchange', () => {
  enhanceNavVisibility();
});

// ======= Error Handling =======
window.addEventListener('error', (e) => {
  console.error('Portfolio error:', e.error);
});

// ======= Intersection Observer for Section Visibility =======
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const sectionId = entry.target.getAttribute('id');
      const navLink = select(`.nav-link[href="#${sectionId}"]`);
      
      if (entry.isIntersecting) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        // Add active class to current section's link
        if (navLink) {
          navLink.classList.add('active');
        }
      }
    });
  },
  {
    rootMargin: '-20% 0px -20% 0px', // Only trigger when section is prominently visible
    threshold: 0.3
  }
);

// Observe all sections
sections.forEach((section) => {
  sectionObserver.observe(section);
});

// ======= Smooth Scrolling Enhancement =======
// Add smooth scrolling behavior to all internal links
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link && link.getAttribute('href') !== '#') {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const target = select(targetId);
    
    if (target) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.offsetTop - navHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL hash
      history.pushState(null, null, targetId);
    }
  }
});

// ======= Preload Critical Resources =======
function preloadCriticalResources() {
  const criticalResources = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
  ];
  
  criticalResources.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = url;
    document.head.appendChild(link);
  });
}

// Initialize preloading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', preloadCriticalResources);
} else {
  preloadCriticalResources();
}