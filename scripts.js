const sectionImages = {
    'home': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/216174658.jpg?k=64d4e9e4164733463d51da1272b43491c9d05aa4f85df0058ef2702e637807f2&o=&hp=1',
    'about-bohol': 'https://www.travelandleisure.com/thmb/Uyi3xc1u5Z3hUbSGSDqaJMoOV9s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chocolate-hills-PHIL0116-3a853dd3c6704d84bb5162bb37404279.jpg',
    'how-to-get-there': 'https://lh3.googleusercontent.com/pw/AP1GczNM3B74ScROEdhk3RskYUi19Uz1LEmemU4780S5l-uZw4orUTfCdks5Q3lwDvvu4ajmf28yHnugm3bq3HfNeeJmHIF5UD_gdYu4rkJNafmBJxPTnZzyIBgMmO3XpkRhQ8nnJN44L9iN01xWBFMo7Ah_=w821-h934-s-no-gm?authuser=0',
    'accommodation': 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/216176382.jpg?k=9eb3a66232f44bb91b2dac3532fecd408c0f29cc5983c4aa4cd6bb5e0b6e2e38&o=&hp=1',
    'events': 'https://scontent.fadl6-1.fna.fbcdn.net/v/t39.30808-6/456280335_1044585141005149_1199629259613576740_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4G2NYGLDLYwQ7kNvgGl7wUy&_nc_ht=scontent.fadl6-1.fna&_nc_gid=Aoi6tO6Y4Rc_miZ2NqGtCjW&oh=00_AYDBbzMo0-qZj6dj416VmFfHNEJUiSy9diP4iTkF8qp_yQ&oe=66E0BBC4',
    'gifts': 'https://eclecticstyle.com.au/wp-content/uploads/2023/07/wp-image-14571386536015.png',
    'rsvp': 'https://oceanicaresortpanglao.com/wp-content/uploads/2023/10/landing-gallery-04.jpg'
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
