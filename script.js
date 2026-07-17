// Ensure script safely executes after DOM construction
document.addEventListener("DOMContentLoaded", function() {

    /* ==========================================================================
       1. STICKY HEADER SCROLL LISTENER & SVG ANIMATION RESET
       ========================================================================= */
    const header = document.querySelector(".site-header");
    const monogramImg = document.querySelector(".logo-monogram");
    const scrollThreshold = 20; 

    function checkScroll() {
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop || window.scrollY;

        if (scrollPos > scrollThreshold) {
            // Only trigger if we aren't already in the scrolled state
            if (!header.classList.contains("scrolled")) {
                header.classList.add("scrolled");
                
                // FORCES ANIMATED SVG TO PLAY: 
                // Appends a cache-busting timestamp to the src to force the browser 
                // to reload the SVG and play its animation from second 0 right as it fades in.
                if (monogramImg) {
                    const baseSrc = monogramImg.src.split('?')[0];
                    monogramImg.src = baseSrc + '?t=' + Date.now();
                }
            }
        } else {
            // Remembers to remove the class when returning to the top
            header.classList.remove("scrolled");
        }
    }

    // Bind to scroll, load, and resize to guarantee state is always accurate
    window.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    checkScroll(); // Run immediately on load

    /* ==========================================================================
       2. INTERSECTION OBSERVER FOR FADE-ON-SCROLL PLACEMENT ICONS
       ========================================================================== */
    const scrollElements = document.querySelectorAll(".fade-on-scroll");

    // Setting up the observer configurations
    const observerOptions = {
        root: null, // Defaults to user viewport
        rootMargin: "0px",
        threshold: 0.15 // Triggers when 15% of the asset element crosses view threshold
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            // If item becomes visible inside window bounds
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                // Stop observing element once animated into position
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Bind initialized instances to watch all placeholder markup targets
    scrollElements.forEach(el => {
        observer.observe(el);
    });

    /* ==========================================================================
       3. SMOOTH SCROLLING FOR HERO CTA BUTTON
       ========================================================================== */
    const heroButton = document.querySelector(".hero-button");
    
    if (heroButton) {
        heroButton.addEventListener("click", function(event) {
            // Prevent default anchor jumping behavior
            event.preventDefault();
            
            // Match the target selector from the href attribute (#contact)
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Determine header height dynamic offset
                const headerHeight = document.querySelector(".site-header").offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                // Perform the smooth scroll behavior
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    }
    // Automatically updates the footer copyright year to the current calendar year
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
