/**
 * Component Loader Script
 * Dynamically loads component HTML files into their designated containers
 */

// Define component paths
const components = {
    header: 'src/components/header.html',
    hero: 'src/components/hero.html',
    projects: 'src/components/projects.html',
    skills: 'src/components/skills.html',
    about: 'src/components/about.html',
    contact: 'src/components/contact.html'
};

/**
 * Load a component from an HTML file and inject it into the DOM
 * @param {string} componentId - The ID of the container element
 * @param {string} componentPath - The path to the HTML file
 */

async function loadComponent(componentId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}: ${response.statusText}`);
        }
        const html = await response.text();
        const container = document.getElementById(componentId);
        if (container) {
            container.innerHTML = html;
        } else {
            console.warn(`Container with ID '${componentId}' not found`);
        }
    } catch (error) {
        console.error(`Error loading component ${componentId}:`, error);
    }
}

/**
 * Load all components
 */
async function loadAllComponents() {
    const componentPromises = Object.entries(components).map(([componentId, componentPath]) => {
        return loadComponent(componentId, componentPath);
    });

    try {
        await Promise.all(componentPromises);
        console.log('All components loaded successfully');
        initializeEventListeners();
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

/**
 * Initialize event listeners and functionality
 */
function initializeEventListeners() {
    // Skill icon click handlers with page navigation
    const iconLinks = document.querySelectorAll('.icon-link');
    iconLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            navigateToPage(targetSection);
            
            // Update active state
            iconLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Form submission handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            console.log('Form submitted:', data);
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Keyboard navigation (optional)
    document.addEventListener('keydown', function (e) {
        const pages = ['about-me', 'works', 'skills', 'contacts'];
        const currentPage = document.querySelector('.page-section:in-viewport') || document.querySelector('.page-section');
        const currentIndex = Array.from(document.querySelectorAll('.page-section')).indexOf(currentPage);
        
        if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
            navigateToPage(pages[currentIndex + 1]);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            navigateToPage(pages[currentIndex - 1]);
        }
    });
}

/**
 * Navigate to a specific page
 */
function navigateToPage(pageId) {
    const pagesContainer = document.getElementById('pagesContainer');
    const pageSection = document.getElementById(`page-${pageId}`);
    const fixedTitle = document.getElementById('fixedSectionTitle');
    
    if (pageSection && pagesContainer) {
        pageSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update fixed section title
        if (fixedTitle) {
            // Hide title for home page, show for other pages
            if (pageId === 'home') {
                fixedTitle.classList.remove('active');
            } else {
                const sectionNames = {
                    'about-me': '#about-me',
                    'works': '#projects',
                    'skills': '#skills',
                    'contacts': '#contact'
                };
                
                const titleElement = fixedTitle.querySelector('.section-name');
                if (titleElement) {
                    titleElement.textContent = sectionNames[pageId] || pageId;
                    fixedTitle.classList.add('active');
                }
            }
        }
        
        // Update active icon
        const activeIcon = document.querySelector(`[data-section="${pageId}"]`);
        if (activeIcon) {
            document.querySelectorAll('.icon-link').forEach(icon => {
                icon.classList.remove('active');
            });
            activeIcon.classList.add('active');
        }
    }
}

/**
 * Update active navigation link based on current page
 */
function updateActiveNavLink() {
    // This function is no longer needed with page-based navigation
    // Active state is managed by icon click handlers
    console.log('Page-based navigation active');
}

// Load components when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllComponents);
} else {
    loadAllComponents();
}
