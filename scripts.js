document.addEventListener('DOMContentLoaded', preloadImages);
document.addEventListener('DOMContentLoaded', initGlobals);
document.addEventListener('DOMContentLoaded', applyStyles);
document.addEventListener('DOMContentLoaded', setupEnterObserver);
document.addEventListener('DOMContentLoaded', setupLeaveObserver);

const sectionImages = {
    'home': 'https://lh3.googleusercontent.com/pw/AP1GczNqCR-5qzTOoHOHItmJ_oyCJMos6X4Ik56X84JOim0wFR9Nhki6rbKnaoUgLs91pnHvlvNRZzDc7MgdQ2iIewyQQGToFga0D77-8qPPa7PA-r49bsK-wYQ-YPI_fm0eUk-INP7MTym5uv98rRWNG_rI=w1245-h934-s-no-gm?authuser=0',
    'how-to-get-there': 'https://lh3.googleusercontent.com/pw/AP1GczP8qdFrU4hmAYO85zXpO7MQaPcCMv8d-wyXCBfEN5TL7OlPsXFQd7LQXoRoevFlfDq21yMtWe7kAquCbmOC27AlLLEYe6M5cUJzgQ_et16SHcbYou_YIZ9VGbP7ljOojk9UO_-6N01qpVGyD8PGa1cJ=w1245-h934-s-no-gm?authuser=0',
    'rsvp': 'https://lh3.googleusercontent.com/pw/AP1GczPorK6_fE_b-tcABvo48-G3J4rpC8V-DVy3bluacZx8m_QxR1LQSCNdt5Q8UhkA7MkL_Z4Rtbe1-ZLp2I8oB3o7Uwdu4WIh9Uw6Q7aO8epB6yfPNF-NwkcV8As23VfLj03l7QHVedx81I0EKGafNI2k=w1245-h934-s-no-gm?authuser=0'
};
let menuLinks;
let parallaxSections;
let contentSections;
function initGlobals() {
    menuLinks = document.querySelectorAll('.menu a');
    parallaxSections = document.querySelectorAll('.parallax-section');
    contentSections = document.querySelectorAll('.content-section');
}

function preloadImages() {
    Object.values(sectionImages).forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

function applyStyles() {
    const activeSection = getActiveSection();
    if (activeSection) {
        console.log('active section', getMenuForSection(activeSection));
        resizeHeadings({ target: activeSection });
        swapBackgroundImage({ target: activeSection });
    } else {
        console.log('no active section');
    }
}

function getActiveSection() {
    let activeSection = null;
    parallaxSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < 10) {
            activeSection = section;
        }
    });
    return activeSection;
}

function getMenuForSection(sectionEl) {
    return sectionEl.getAttribute('data-menu');
}

function isBottomOrTop(entry) {
    return (entry.boundingClientRect.top < 0) ? 'top' : 'bottom';
}

function setupEnterObserver() {
    const observer = new IntersectionObserver(([intersection]) => {
        if (intersection.isIntersecting) {
            const bottomOrTop = isBottomOrTop(intersection);
            console.log(
                `enterObserver - entering from the ${bottomOrTop}`,
                getMenuForSection(intersection.target)
            );
            switch (bottomOrTop) {
                case 'top':
                    resizeHeadings(intersection); // on the way up
                    break;
                case 'bottom':
                    swapBackgroundImage(intersection); // on the way down
                    break;
            }
        }
    });
    [...parallaxSections, ...contentSections]
        .forEach(section => observer.observe(section));
}

function setupLeaveObserver() {
    const observer = new IntersectionObserver(([intersection]) => {
        if (intersection.isIntersecting) {
            const bottomOrTop = isBottomOrTop(intersection);
            console.log(
                `leaveObserver - entering from the ${bottomOrTop}`,
                getMenuForSection(intersection.target)
            );
            resizeHeadings(intersection);
            switch (bottomOrTop) {
                case 'top':
                    swapBackgroundImage(intersection); // on the way back up
                    break;
            }
        }
    }, {
        root: null,
        // a thin box just above the top of the page
        rootMargin: `-10px 0px -${window.innerHeight}px 0px`,
        threshold: 0
    });
    [...parallaxSections, ...contentSections]
        .forEach(section => observer.observe(section));
}

function resizeHeadings(entry) {
    const id = getMenuForSection(entry.target);
    const menuLink = document.querySelector(`.menu a[href="#${id}"]`);
    menuLinks.forEach(link => link.classList.remove('active'));
    menuLink.classList.add('active');
}

function swapBackgroundImage(entry) {
    const id = getMenuForSection(entry.target);
    document.getElementById('parallaxImage').style.backgroundImage =
        `url('${sectionImages[id]}')`;
}
