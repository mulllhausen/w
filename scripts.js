const sectionImages = {
    'home': 'https://lh3.googleusercontent.com/pw/AP1GczNqCR-5qzTOoHOHItmJ_oyCJMos6X4Ik56X84JOim0wFR9Nhki6rbKnaoUgLs91pnHvlvNRZzDc7MgdQ2iIewyQQGToFga0D77-8qPPa7PA-r49bsK-wYQ-YPI_fm0eUk-INP7MTym5uv98rRWNG_rI=w1245-h934-s-no-gm?authuser=0',
    'how-to-get-there': 'https://lh3.googleusercontent.com/pw/AP1GczP8qdFrU4hmAYO85zXpO7MQaPcCMv8d-wyXCBfEN5TL7OlPsXFQd7LQXoRoevFlfDq21yMtWe7kAquCbmOC27AlLLEYe6M5cUJzgQ_et16SHcbYou_YIZ9VGbP7ljOojk9UO_-6N01qpVGyD8PGa1cJ=w1245-h934-s-no-gm?authuser=0',
    'accommodation': 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/216176382.jpg?k=9eb3a66232f44bb91b2dac3532fecd408c0f29cc5983c4aa4cd6bb5e0b6e2e38&o=&hp=1',
    'events': 'https://petapixel.com/assets/uploads/2016/05/2-Firedance-12.jpg',
    'gifts': 'https://eclecticstyle.com.au/wp-content/uploads/2023/07/wp-image-14571386536015.png',
    'rsvp': 'https://lh3.googleusercontent.com/pw/AP1GczPorK6_fE_b-tcABvo48-G3J4rpC8V-DVy3bluacZx8m_QxR1LQSCNdt5Q8UhkA7MkL_Z4Rtbe1-ZLp2I8oB3o7Uwdu4WIh9Uw6Q7aO8epB6yfPNF-NwkcV8As23VfLj03l7QHVedx81I0EKGafNI2k=w1245-h934-s-no-gm?authuser=0'
};
document.addEventListener('DOMContentLoaded', preloadImages);
document.addEventListener('DOMContentLoaded', () => {
    const controller = new ScrollMagic.Controller();
    setupParallax(controller);
    setupMenu(controller);
});

function preloadImages() {
    Object.values(sectionImages).forEach(imageUrl => {
        const img = new Image();
        img.src = imageUrl;
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
                document.getElementById('parallaxImage').style.backgroundImage =
                    `url('${sectionImages[sectionId]}')`;
            })
            .on('leave', event => {
                if (event.scrollDirection === 'REVERSE') {
                    const prevSectionId = Object.keys(sectionImages)
                    [Object.keys(sectionImages).indexOf(sectionId) - 1];

                    if (prevSectionId) {
                        document.getElementById('parallaxImage').style.backgroundImage =
                            `url('${sectionImages[prevSectionId]}')`;
                    }
                }
            })
            .addTo(controller);
    });
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
