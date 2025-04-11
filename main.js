// Import required modules
import * as d3 from 'd3';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation highlighting
    initializeNavigation();
    
    // Set up smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Initialize tooltips, popovers, etc.
    initializeBootstrapComponents();
    
    // Setup architecture diagram controls
    setupDiagramControls();
});

// Function to initialize navigation highlighting
function initializeNavigation() {
    const sections = document.querySelectorAll('.section-container');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Function to set up smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Function to initialize Bootstrap components
function initializeBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Function to setup architecture diagram controls
function setupDiagramControls() {
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const resetView = document.getElementById('reset-view');
    
    if (zoomIn && zoomOut && resetView) {
        // These will be connected to the visualization.js SVG zoom functionality
        zoomIn.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('diagram-zoom-in'));
        });
        
        zoomOut.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('diagram-zoom-out'));
        });
        
        resetView.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('diagram-reset-view'));
        });
    }
    
    // Setup visualization view switching
    const viewButtons = document.querySelectorAll('.visualization-controls .btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.getAttribute('data-view');
            window.dispatchEvent(new CustomEvent('change-visualization-view', {
                detail: { view: view }
            }));
        });
    });
    
    // Setup role selector for permission visualization
    const roleSelector = document.getElementById('role-selector');
    if (roleSelector) {
        roleSelector.addEventListener('change', function() {
            const selectedRole = this.value;
            window.dispatchEvent(new CustomEvent('change-role-visualization', {
                detail: { role: selectedRole }
            }));
        });
    }
}

