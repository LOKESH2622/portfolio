# Portfolio Website - Project Structure

## Overview
This is a modular, component-based portfolio website for Elias, a web designer and front-end developer. The project follows modern web development practices with separated concerns for HTML, CSS, and JavaScript.

## Project Structure

```
portfolio/
├── index.html                 # Main HTML file with component containers
├── src/
│   ├── components/           # Individual component HTML files
│   │   ├── header.html       # Navigation sidebar and header
│   │   ├── hero.html         # Hero section with introduction
│   │   ├── projects.html     # Projects showcase section
│   │   ├── skills.html       # Skills and expertise section
│   │   └── about.html        # About and contact sections
│   ├── css/                  # Modular CSS files
│   │   ├── global.css        # Global styles, reset, and utilities
│   │   ├── header.css        # Header and navigation styles
│   │   ├── hero.css          # Hero section styles
│   │   ├── projects.css      # Projects grid and card styles
│   │   ├── skills.css        # Skills section styles
│   │   └── about.css         # About and contact section styles
│   ├── js/                   # JavaScript files
│   │   └── components-loader.js  # Dynamic component loading system
│   └── assets/               # Images, icons, and media files (optional)
└── README.md                 # Project documentation
```

## Key Features

### 1. **Modular Component Architecture**
   - Each section of the website is in a separate HTML file
   - Components are dynamically loaded into the main index.html
   - Easy to maintain and update individual components

### 2. **Organized CSS**
   - `global.css` - Contains reset styles and shared utilities
   - Component-specific CSS files for easy styling management
   - Responsive design with mobile-first approach
   - Consistent color scheme (#9370db for primary color, #fff for text on dark bg)

### 3. **Dynamic Component Loading**
   - `components-loader.js` loads all components asynchronously
   - Smooth scroll behavior for navigation links
   - Active link highlighting based on scroll position
   - Contact form submission handling

### 4. **Responsive Design**
   - Fully responsive layout
   - Mobile breakpoints at 768px and 1024px
   - Adaptive grid layouts for different screen sizes

## Components Breakdown

### Header (`header.html`, `header.css`)
- Fixed sidebar with social icons
- Navigation bar with smooth scrolling
- Language selector dropdown
- Sticky positioning for easy navigation

### Hero Section (`hero.html`, `hero.css`)
- Introduction with name and title
- Call-to-action button
- Profile image with geometric decorations
- Status indicator
- Inspirational quote section

### Projects Section (`projects.html`, `projects.css`)
- 3-column grid layout (responsive)
- Project cards with:
  - Featured image
  - Technology tags
  - Project name and description
  - Live and source code links
- Hover effects and smooth transitions

### Skills Section (`skills.html`, `skills.css`)
- Decorative geometric shapes
- 3-column skill categories:
  - Languages
  - Databases
  - Tools
  - Other
  - Frameworks
  - Specializations
- Hover effects on skill cards

### About & Contact Section (`about.html`, `about.css`)
- About section with personal story
- Contact information
- Contact form with fields for:
  - Name
  - Email
  - Message
- Form validation and submission handling

## CSS Color Scheme

- **Primary Color**: `#9370db` (Medium Purple)
- **Background**: Linear gradient (`#1a1a2e` to `#16213e`)
- **Text Primary**: `#fff` (White)
- **Text Secondary**: `#b0b0c0` (Light Gray)
- **Dark Background**: `rgba(20, 20, 30, 0.8-0.9)` (Dark Navy with opacity)
- **Border Color**: `rgba(147, 112, 219, 0.3)` (Purple with transparency)

## JavaScript Features

### Component Loader
- Fetches HTML components asynchronously
- Injects HTML into designated containers
- Error handling and logging

### Event Listeners
- Smooth scroll navigation
- Active link highlighting
- Form submission handling
- Responsive scroll tracking

## How to Use

1. **Opening the Website**
   ```bash
   # Simply open index.html in a web browser
   ```

2. **Adding New Components**
   - Create new HTML file in `src/components/`
   - Create corresponding CSS file in `src/css/`
   - Update `components-loader.js` to include new component
   - Add container div with matching ID in `index.html`

3. **Modifying Styles**
   - Edit the relevant CSS file in `src/css/`
   - Global styles in `global.css`
   - Component-specific styles in their respective files

4. **Updating Content**
   - Edit the component HTML files in `src/components/`
   - Update project information in `projects.html`
   - Modify skills in `skills.html`
   - Update about and contact info in `about.html`

## Responsive Breakpoints

```css
/* Mobile (Default) */
/* 0px - 768px */

/* Tablet & Small Desktop */
@media (max-width: 1024px)

/* Mobile Devices */
@media (max-width: 768px)
```

## Browser Compatibility

- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Modern mobile browsers

## Performance Optimizations

- Async component loading prevents blocking
- CSS organized for minimal specificity conflicts
- Smooth animations using CSS transitions
- Optimized SVG placeholders for images

## Future Enhancements

- Add more projects to showcase
- Implement dark/light mode toggle
- Add multi-language support
- Implement backend form submission
- Add portfolio filtering
- Implement animations on scroll
- Add blog section
- Integrate with CMS

## Maintenance Tips

1. Keep component HTML files focused on structure only
2. Place all styling in corresponding CSS files
3. Use consistent class naming conventions
4. Update README when adding new features
5. Test responsive design on multiple devices
6. Validate HTML and CSS regularly

## License

© 2026 Elias. All rights reserved.

---

**Last Updated**: January 26, 2026
**Version**: 1.0.0
