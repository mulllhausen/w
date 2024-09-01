document.addEventListener('DOMContentLoaded', function () {
    // Initialize ScrollMagic Controller
    const controller = new ScrollMagic.Controller();

    // Define the background images for each section
    const sectionImages = {
        'home': 'https://lh3.googleusercontent.com/pw/AP1GczNqCR-5qzTOoHOHItmJ_oyCJMos6X4Ik56X84JOim0wFR9Nhki6rbKnaoUgLs91pnHvlvNRZzDc7MgdQ2iIewyQQGToFga0D77-8qPPa7PA-r49bsK-wYQ-YPI_fm0eUk-INP7MTym5uv98rRWNG_rI=w1245-h934-s-no-gm?authuser=0',
        'how-to-get-there': 'https://lh3.googleusercontent.com/pw/AP1GczP8qdFrU4hmAYO85zXpO7MQaPcCMv8d-wyXCBfEN5TL7OlPsXFQd7LQXoRoevFlfDq21yMtWe7kAquCbmOC27AlLLEYe6M5cUJzgQ_et16SHcbYou_YIZ9VGbP7ljOojk9UO_-6N01qpVGyD8PGa1cJ=w1245-h934-s-no-gm?authuser=0',
        'rsvp': 'https://lh3.googleusercontent.com/pw/AP1GczPorK6_fE_b-tcABvo48-G3J4rpC8V-DVy3bluacZx8m_QxR1LQSCNdt5Q8UhkA7MkL_Z4Rtbe1-ZLp2I8oB3o7Uwdu4WIh9Uw6Q7aO8epB6yfPNF-NwkcV8As23VfLj03l7QHVedx81I0EKGafNI2k=w1245-h934-s-no-gm?authuser=0'
    };
    // Create scenes for each parallax section
    Object.keys(sectionImages).forEach(sectionId => {
        new ScrollMagic.Scene({
            triggerElement: `#${sectionId}`, // The section to trigger the background change
            duration: '50%', // The effect lasts throughout the entire section
            triggerHook: 1  // The effect triggers as soon as the section enters the viewport
        })
            .setClassToggle(`#${sectionId}`, 'active') // Optional: add a class for styling
            .on('enter', () => {
                document.getElementById('parallaxImage').style.backgroundImage =
                    `url('${sectionImages[sectionId]}')`;
            })
            .on('leave', event => {
                if (event.scrollDirection === 'REVERSE') {
                    const prevSectionId = Object.keys(sectionImages)[Object.keys(sectionImages).indexOf(sectionId) - 1];
                    if (prevSectionId) {
                        document.getElementById('parallaxImage').style.backgroundImage =
                            `url('${sectionImages[prevSectionId]}')`;
                    }
                }
            })
            .addTo(controller);
    });
});
