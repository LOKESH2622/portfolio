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

    // Initialize Read More functionality
    initReadMore();
    initProjectsAutoScroll();
    initTechRadarReveal();

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

function initTechRadarReveal() {
    const radar = document.querySelector('.tech-radar');
    const items = Array.from(document.querySelectorAll('.tech-radar-item'));

    if (!radar || items.length === 0 || radar.dataset.revealReady === 'true') {
        return;
    }

    radar.dataset.revealReady = 'true';

    const sweepDuration = 5500;
    const sweepArc = 62;
    const sweepStartOffset = 86;
    const litLead = 4;
    const previewLead = 20; // Zone where text shows before light reaches it

    function toSweepAngle(pointX, pointY, centerX, centerY) {
        const angle = Math.atan2(pointX - centerX, centerY - pointY) * 180 / Math.PI;
        return (angle + 360) % 360;
    }

    function isAngleInSweep(angle, sweepStart, sweepEnd) {
        if (sweepStart <= sweepEnd) {
            return angle >= sweepStart && angle <= sweepEnd;
        }

        return angle >= sweepStart || angle <= sweepEnd;
    }

    function updateRadarLabels() {
        const rect = radar.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const elapsed = performance.now() % sweepDuration;
        const sweepStart = (sweepStartOffset + (elapsed / sweepDuration) * 360) % 360;
        const sweepEnd = (sweepStart + sweepArc) % 360;
        const activationStart = (sweepStart - litLead + 360) % 360;
        const previewStart = (sweepStart - previewLead + 360) % 360;

        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemX = itemRect.left + itemRect.width / 2;
            const itemY = itemRect.top + itemRect.height / 2;
            const itemAngle = toSweepAngle(itemX, itemY, centerX, centerY);
            const isAboutToLight = isAngleInSweep(itemAngle, previewStart, activationStart);
            const isLit = isAngleInSweep(itemAngle, activationStart, sweepEnd);

            item.classList.toggle('is-lit', isLit);
            item.classList.toggle('about-to-light', isAboutToLight && !isLit);
        });

        requestAnimationFrame(updateRadarLabels);
    }

    requestAnimationFrame(updateRadarLabels);
}

/**
 * Auto-scroll projects horizontally, pausing while the user interacts with it.
 */
function initProjectsAutoScroll() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || projectsGrid.dataset.autoScrollReady === 'true') {
        return;
    }

    projectsGrid.dataset.autoScrollReady = 'true';
    const projectCards = Array.from(projectsGrid.children);

    projectCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a, button').forEach(element => {
            element.setAttribute('tabindex', '-1');
        });
        projectsGrid.appendChild(clone);
    });

    const allProjectCards = Array.from(projectsGrid.children);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    let isPaused = false;
    let previousTime = null;
    const speed = 35;

    function setPaused(value) {
        isPaused = value;
    }

    projectsGrid.addEventListener('mouseover', event => {
        if (event.target.closest('.project-card')) {
            setPaused(true);
        }
    });
    projectsGrid.addEventListener('mouseout', event => {
        const nextElement = event.relatedTarget;

        if (!nextElement || !nextElement.closest || !nextElement.closest('.project-card')) {
            setPaused(false);
        }
    });
    projectsGrid.addEventListener('focusin', () => setPaused(true));
    projectsGrid.addEventListener('focusout', () => setPaused(false));
    projectsGrid.addEventListener('touchstart', () => setPaused(true), { passive: true });
    projectsGrid.addEventListener('touchend', () => setPaused(false));

    function updateCardDepth() {
        const gridRect = projectsGrid.getBoundingClientRect();
        const gridCenter = gridRect.left + gridRect.width / 2;
        const maxDistance = gridRect.width / 2;

        allProjectCards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.max(-1, Math.min(1, (cardCenter - gridCenter) / maxDistance));
            const depth = 1 - Math.min(1, Math.abs(distance));
            const rotateY = distance * -24;
            const scale = 0.88 + depth * 0.12;
            const translateY = (1 - depth) * 18;
            const opacity = 0.64 + depth * 0.36;

            card.style.setProperty('--card-rotate-y', `${rotateY}deg`);
            card.style.setProperty('--card-scale', scale.toFixed(3));
            card.style.setProperty('--card-translate-y', `${translateY.toFixed(1)}px`);
            card.style.setProperty('--card-opacity', opacity.toFixed(3));
            card.style.zIndex = String(Math.round(depth * 10));
        });
    }

    function autoScroll(currentTime) {
        if (previousTime === null) {
            previousTime = currentTime;
        }

        const elapsedSeconds = (currentTime - previousTime) / 1000;
        previousTime = currentTime;
        const loopWidth = projectCards.length > 0
            ? projectsGrid.children[projectCards.length].offsetLeft - projectCards[0].offsetLeft
            : 0;

        if (!isPaused && loopWidth > 0) {
            projectsGrid.scrollLeft += speed * elapsedSeconds;

            if (projectsGrid.scrollLeft >= loopWidth) {
                projectsGrid.scrollLeft -= loopWidth;
            }
        }

        updateCardDepth();
        requestAnimationFrame(autoScroll);
    }

    requestAnimationFrame(autoScroll);
}

/**
 * Initialize Read More button - toggles expanded content visibility
 */
function initReadMore() {
    const readMoreBtn = document.getElementById('read-more-btn');
    const expandedContainer = document.getElementById('about-expanded');
    const aboutSection = document.getElementById('about-me');
    const fixedTitle = document.getElementById('fixedSectionTitle');
    
    if (!readMoreBtn || !expandedContainer || !aboutSection) {
        return;
    }
    
    let isExpanded = false;
    
    function bindDidYouKnow() {
        const toggle = document.getElementById('did-you-know-toggle');
        const text = document.getElementById('did-you-know-text');
        if (!toggle || !text) {
            return;
        }
        toggle.addEventListener('click', () => {
            text.classList.toggle('is-visible');
        });
    }

    // Close expanded content
    function closeExpanded() {
        // Animate collapse by setting max-height to 0
        expandedContainer.style.maxHeight = expandedContainer.scrollHeight + 'px';
        // Force reflow to apply the new max-height before collapsing
        void expandedContainer.offsetWidth;
        expandedContainer.style.maxHeight = '0px';
        expandedContainer.classList.remove('visible');
        aboutSection.classList.remove('hidden');
        readMoreBtn.textContent = 'Read more →';
        readMoreBtn.classList.remove('expanded');
        isExpanded = false;

        // Show fixed title again
        if (fixedTitle) {
            fixedTitle.classList.add('active');
        }

        // Scroll back to the about section after collapse
        setTimeout(() => {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 400);
    }
    
    // Bind show less button inside expanded content
    function bindShowLessBtn() {
        const showLessBtn = document.getElementById('show-less-btn');
        if (showLessBtn) {
            showLessBtn.addEventListener('click', closeExpanded);
        }
    }
    
    // Button click handler
    readMoreBtn.addEventListener('click', function() {
        if (!isExpanded) {
            // Dynamically set max-height for smooth transition
            expandedContainer.style.maxHeight = expandedContainer.scrollHeight + 'px';
            expandedContainer.classList.add('visible');
            aboutSection.classList.add('hidden');
            readMoreBtn.textContent = 'Show less ←';
            readMoreBtn.classList.add('expanded');
            isExpanded = true;

            // Hide the fixed "About Me" title
            if (fixedTitle) {
                fixedTitle.classList.remove('active');
            }

            bindDidYouKnow();
            bindShowLessBtn();

            // Smooth scroll to expanded content after animation
            setTimeout(() => {
                expandedContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 350);
        } else {
            closeExpanded();
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
