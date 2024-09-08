// constants
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

const exchangeRates = {
    AED: 0.066,
    AUD: 0.027,
    CAD: 0.024,
    EUR: 0.016,
    GBP: 0.014,
    JPY: 2.55,
    PHP: 1,
    SGD: 0.023,
    USD: 0.018
};
const nbsp = '\xa0';

// event listeners
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();

    const controller = new ScrollMagic.Controller();
    setupParallax(controller);
    setupMenu(controller);

    loadCurrency();
    document.querySelector('select#currency').addEventListener('change', changeCurrency);
    initRSVP();
});

// functions
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

function loadCurrency() {
    const { currency } = getLocalisationData();
    document.querySelector('select#currency').value = currency;
    changeCurrency({ target: { value: currency } });
}

function changeCurrency(event) {
    const currency = event.target.value;
    saveLocalisationData({ currency });
    const currencyElements = document.querySelectorAll('span[data-pesos]');
    for (let i = 0; i < currencyElements.length; i++) {
        const pesos = currencyElements[i].dataset.pesos;
        const decimalPlaces = currencyElements[i].dataset.decimalPlaces || 2;
        const converted = pesos * exchangeRates[currency];
        currencyElements[i].textContent = currency +
            nbsp +
            converted.toLocaleString('en-US', {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces
            });
    }
}

function saveLocalisationData(data) {
    let existingData = getLocalisationData();
    localStorage.setItem('localisation-data', JSON.stringify({ ...existingData, ...data }));
}

function getLocalisationData() {
    return JSON.parse(localStorage.getItem('localisation-data')) || {
        currency: 'PHP'
    };
}

// RSVP form

function initRSVP() {
    cloneGuestRSVP();
    document.querySelector('#add-guest').addEventListener('click', cloneGuestRSVP);
}

function cloneGuestRSVP() {
    const eachGuestRSVPTemplate = document.querySelector('template#guest-rsvp');
    const eachGuestRSVPClone = document.importNode(eachGuestRSVPTemplate.content, true);
    document.querySelector('#rsvp-list').appendChild(eachGuestRSVPClone);
    initNewGuestEvents(document.querySelector('#rsvp-list').lastElementChild);
    resetAllGuestNumbers();
}

function initNewGuestEvents(newGuestRSVPForm) {
    initDietaryRequirementsEvents(newGuestRSVPForm);
    initDeleteButtonEvents(newGuestRSVPForm);
}

function initDietaryRequirementsEvents(newGuestRSVPForm) {
    newGuestRSVPForm.querySelectorAll('input[type="radio"][name="attending"]').forEach(radioEl => {
        radioEl.addEventListener('change', event => {
            const attending = event.target.value === 'yes';
            const dietaryRequirementsInput = newGuestRSVPForm.querySelector('label.dietary-requirements');
            if (attending) {
                dietaryRequirementsInput.classList.remove('hidden');
            } else {
                dietaryRequirementsInput.classList.add('hidden');
            }
        })
    });
}

function initDeleteButtonEvents(newGuestRSVPForm) {
    newGuestRSVPForm.querySelector('button.delete').addEventListener('click', () => {
        newGuestRSVPForm.remove();
        resetAllGuestNumbers();
    });
}

function resetAllGuestNumbers() {
    const allGuestRSVPForms = document.querySelectorAll('form.guest-rsvp');
    allGuestRSVPForms.forEach((guestRSVPForm, index) => {
        guestRSVPForm.querySelector('h1').textContent = `Guest ${index + 1}`;
    });
}