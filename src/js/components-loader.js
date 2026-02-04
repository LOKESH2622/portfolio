/**
 * Component Loader Script
 * Dynamically loads component HTML files into their designated containers
 */

// Define component paths
const components = {
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
    // Initialize contact form
    if (typeof initializeContactForm === 'function') {
        console.log('Initializing contact form...');
        initializeContactForm();
    }

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
}

/**
 * Navigate to a specific page
 */
function navigateToPage(pageId) {
    const pagesContainer = document.getElementById('pagesContainer');
    const pageSection = document.getElementById(`page-${pageId}`);
    const fixedTitle = document.getElementById('fixedSectionTitle');
    
    if (pageSection && pagesContainer) {
        // Hide all pages and show only the selected one
        document.querySelectorAll('.page-section').forEach(page => {
            page.style.display = 'none';
        });
        pageSection.style.display = 'flex';
        pageSection.style.flexDirection = 'column';
        pageSection.style.justifyContent = 'center';
        pageSection.style.alignItems = 'center';
        
        // Update fixed section title
        if (fixedTitle) {
            const sectionNames = {
                'about-me': 'About-me',
                'works': 'Projects',
                'skills': 'Skills',
                'contacts': 'Contacts'
            };
            
            const titleElement = fixedTitle.querySelector('.section-name');
            if (titleElement) {
                // Hide title for home page, show for others
                if (pageId === 'home') {
                    fixedTitle.classList.remove('active');
                } else {
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
