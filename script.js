document.addEventListener('DOMContentLoaded', () => {

    // Logic for choosing random colors for the helix in the references page //
    const referencesPage = document.getElementById('references-page');
    if (referencesPage) 
    {
        function getRandomColor() {
            // Generate a random hex color
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }

        function getComplimentaryColors(hexColor) {
            // Convert hex to RGB
            const r = parseInt(hexColor.slice(1, 3), 16);
            const g = parseInt(hexColor.slice(3, 5), 16);
            const b = parseInt(hexColor.slice(5, 7), 16);

            // Calculate the inverse of each component
            const rComp = 255 - r;
            const gComp = 255 - g;
            const bComp = 255 - b;

            // Convert back to hex
            const complimentaryHex = `#${rComp.toString(16).padStart(2, '0')}${gComp.toString(16).padStart(2, '0')}${bComp.toString(16).padStart(2, '0')}`;

            // Generate a slightly darker or lighter shade of one of the colors (you can adjust this logic)
            const baseColor = [r, g, b];
            const randomIndex = Math.floor(Math.random() * 3);
            const adjustment = Math.random() > 0.5 ? 20 : -20; // Adjust brightness

            const adjustedColor = baseColor.map((val, index) => {
                if (index === randomIndex) {
                return Math.max(0, Math.min(255, val + adjustment));
                }
                return val;
            });

            const adjustedHex = `#${adjustedColor[0].toString(16).padStart(2, '0')}${adjustedColor[1].toString(16).padStart(2, '0')}${adjustedColor[2].toString(16).padStart(2, '0')}`;

            return [hexColor, complimentaryHex, adjustedHex];
        }

        // Generate a random base color
        const randomBaseColor = getRandomColor();
        const colorSwatch = getComplimentaryColors(randomBaseColor);

        // Apply the random colors using inline styles
        const style = document.createElement('style');
        style.textContent = `
        body.page-references .strand-point { background-color: ${colorSwatch[0]}; }
        body.page-references .strand-point.strand-b { background-color: ${colorSwatch[1]}aa; }
        body.page-references .base-pair { background-color: ${colorSwatch[2]}; }
        `;
        document.head.appendChild(style);
    }
    
    // END OF LOGIC //   
    
    
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