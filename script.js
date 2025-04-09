document.addEventListener('DOMContentLoaded', () => {
    const helixStructure = document.getElementById('dna-helix-structure');
    if (!helixStructure) {
        console.error("Helix structure element not found!");
        return;
    }

    // *** ADD THIS LINE ***
    //console.log("DOM Content Loaded. Setting up Read More listeners...");

    const readMoreLinks = document.querySelectorAll('.blog-post .read-more');

    // *** ADD THIS CHECK ***
    //console.log("Found read more links:", readMoreLinks.length);
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            //console.log('Read More clicked');
            const blogPost = this.parentNode;
            const expandableContent = blogPost.querySelector('.expandable-content');
    
            if (blogPost.classList.contains('expanded')) {
                blogPost.classList.remove('expanded');
                this.textContent = 'Read More';
            } else {
                blogPost.classList.add('expanded');
                this.textContent = 'Read Less';
            }
        });
    });

    // --- Configuration ---
    const rungCount = 150;
    const helixVisualHeight = 3000;
    const turnAngle = 12;
    const verticalSpacing = helixVisualHeight / rungCount;

    // Set the height via CSS variable
    helixStructure.style.setProperty('--helix-visual-height', `${helixVisualHeight}px`);

    // --- Generate DNA Rungs ---
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < rungCount; i++) {
        const rung = document.createElement('div');
        rung.className = 'dna-rung';

        const strandA = document.createElement('div');
        strandA.className = 'strand-point strand-a';
        const strandB = document.createElement('div');
        strandB.className = 'strand-point strand-b';
        const basePair = document.createElement('div');
        basePair.className = 'base-pair';

        rung.appendChild(strandA);
        rung.appendChild(basePair);
        rung.appendChild(strandB);

        const rotationY = i * turnAngle;
        const yPos = i * verticalSpacing;
        rung.style.transform = `translateY(${yPos}px) rotateY(${rotationY}deg)`;
        fragment.appendChild(rung);
    }
    helixStructure.appendChild(fragment);


    //--- Create DNA Particles ---
    function createDNAParticles() {
        const container = document.querySelector('.fixed-helix-background');
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'dna-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(particle);
        }
    }


    // --- Scroll Animation for Helix Rotation ---
    let lastKnownScrollPosition = 0;
    let ticking = false;

    function handleHelixRotation(scrollPos) {
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollPos / scrollHeight) : 0;
        const totalRotationAngle = scrollPercentage * 1080;
        helixStructure.style.transform = `translateX(-50%) rotateY(${totalRotationAngle}deg)`;
    }

    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.scrollY || document.documentElement.scrollTop;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleHelixRotation(lastKnownScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // // Initialize decorative elements
    //createDNAParticles();

    // Initial helix rotation
    handleHelixRotation(window.scrollY || document.documentElement.scrollTop);

});