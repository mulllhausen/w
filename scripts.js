const sectionImages = {
    'home': {
        url: 'img/parallax/home.jpg',
        backgroundPosition: '68% center'
    },
    'about-bohol': {
        url: 'img/parallax/about-bohol.jpg',
        backgroundPosition: '0% center'
    },
    'how-to-get-there': {
        url: 'img/parallax/how-to-get-there.jpeg',
        backgroundPosition: 'center'
    },
    'accommodation': {
        url: 'img/parallax/accommodation.jpg',
        backgroundPosition: '70% center'
    },
    'events': {
        url: 'img/parallax/events.jpg',
        backgroundPosition: 'center'
    },
    'gifts': {
        url: 'img/parallax/gifts.png',
        backgroundPosition: 'center'
    },
    'rsvp': {
        url: 'img/parallax/rsvp.jpg',
        backgroundPosition: '16% center'
    },
    'end': {
        url: 'img/parallax/end.jpg',
        backgroundPosition: '67% center'
    }
};
document.addEventListener('DOMContentLoaded', preloadImages);
document.addEventListener('DOMContentLoaded', () => {
    const controller = new ScrollMagic.Controller();
    setupParallax(controller);
    setupMenu(controller);
});

function preloadImages() {
    Object.values(sectionImages).forEach(imageData => {
        const img = new Image();
        img.src = imageData.url;
    });
}

function setupParallax(controller) {
    Object.keys(sectionImages).forEach(sectionId => {
        new ScrollMagic.Scene({
            triggerElement: `#${sectionId}`,
            duration: '50%',
            triggerHook: 1
        })
            .setClassToggle(`#${sectionId}`, 'active')
            .on('enter', () => {
                setParallaxImageStyles(
                    document.getElementById('parallaxImage'),
                    sectionImages[sectionId]
                );
            })
            .on('leave', event => {
                if (event.scrollDirection === 'REVERSE') {
                    const prevSectionId = Object.keys(sectionImages)
                    [Object.keys(sectionImages).indexOf(sectionId) - 1];

                    if (prevSectionId) setParallaxImageStyles(
                        document.getElementById('parallaxImage'),
                        sectionImages[prevSectionId]
                    );
                }
            })
            .addTo(controller);
    });
}

function setParallaxImageStyles(el, imageData) {
    el.style.backgroundImage = `url('${imageData.url}')`;
    el.style.backgroundPosition = imageData.backgroundPosition;
}

function setupMenu(controller) {
    Array
        .from(document.querySelectorAll('.parallax-section, .content-section'))
        .forEach(section => {
            const menuID = section.dataset.menu;
            if (!menuID) return;
            new ScrollMagic.Scene({
                triggerElement: section,
                triggerHook: 0.1,
                duration: section.clientHeight
            })
                .on('enter', () => {
                    document
                        .querySelectorAll('.menu a')
                        .forEach(link => link.classList.remove('active'));

                    document
                        .querySelector(`.menu a[href="#${menuID}"]`)
                        .classList
                        .add('active');
                })
                .on('leave', () => {
                    document
                        .querySelector(`.menu a[href="#${menuID}"]`)
                        .classList
                        .remove('active');
                })
                .addTo(controller);
        });
}
