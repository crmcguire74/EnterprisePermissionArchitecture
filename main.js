document.addEventListener('DOMContentLoaded', () => {
    // Table of Contents elements
    const toc = document.querySelector('.table-of-contents');
    const tocToggle = document.querySelector('.toc-toggle');
    const mainContent = document.querySelector('.col-lg-9');
    const sections = document.querySelectorAll('section[id]');
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    
    // Visualization view buttons
    const viewButtons = document.querySelectorAll('.visualization-controls .btn-group .btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Dispatch event to update visualization
            window.dispatchEvent(new CustomEvent('change-visualization-view', {
                detail: { view: button.getAttribute('data-view') }
            }));
        });
    });
    
    // Toggle table of contents
    tocToggle.addEventListener('click', () => {
        toc.classList.toggle('collapsed');
        const isCollapsed = toc.classList.contains('collapsed');
        tocToggle.setAttribute('aria-expanded', !isCollapsed);
    });

    // Handle keyboard navigation
    tocToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tocToggle.click();
        }
    });
    
    const updateActiveSection = () => {
        const scrollPosition = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                tocLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding link
                const correspondingLink = document.querySelector(`.table-of-contents a[href="#${section.id}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    };

    // Update active section on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveSection);
    });
    
    // Smooth scroll for table of contents links
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Initialize active section
    updateActiveSection();
});
