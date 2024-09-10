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
    document
        .querySelector('select#currency')
        .addEventListener('change', changeCurrency);
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
        const decimalPlaces = currencyElements[i]
            .dataset.decimalPlaces || 2;
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
    localStorage.setItem(
        'localisation-data', JSON.stringify({ ...existingData, ...data })
    );
}

function getLocalisationData() {
    return JSON.parse(localStorage.getItem('localisation-data')) || {
        currency: 'PHP'
    };
}

// RSVP form

function initRSVP() {
    const rsvpData = JSON.parse(localStorage.getItem('rsvp-data')) || [];
    const numGuestsToPopulate = rsvpData.length === 0 ? 1 : rsvpData.length;
    for (let i = 0; i < numGuestsToPopulate; i++) {
        cloneGuestRSVP();
        if (rsvpData == null) continue;
        if (rsvpData[i] == null) continue;
        populateGuestData(
            document.querySelector('#rsvp-list').lastElementChild, rsvpData[i]
        );
    }
    document
        .querySelector('.content-section[data-menu="rsvp"] button#add-guest')
        .addEventListener('click', cloneGuestRSVP);
    document
        .querySelector('.content-section[data-menu="rsvp"] button#submit-rsvp')
        .addEventListener('click', submitRSVP);
}

function cloneGuestRSVP() {
    const eachGuestRSVPTemplate = document.querySelector('template#guest-rsvp');

    const eachGuestRSVPClone = document
        .importNode(eachGuestRSVPTemplate.content, true);

    document.querySelector('#rsvp-list').appendChild(eachGuestRSVPClone);
    initNewGuestEvents(document.querySelector('#rsvp-list').lastElementChild);
    resetAllGuestNumbers();
}

function initNewGuestEvents(newGuestRSVPForm) {
    initDietaryRequirementsEvents(newGuestRSVPForm);
    initDeleteButtonEvents(newGuestRSVPForm);
    newGuestRSVPForm
        .querySelector('input[type="text"][name="guest-name"]')
        .addEventListener('keyup', debouncedUpdatedRSVP);
    newGuestRSVPForm
        .querySelectorAll(
            'input[type="radio"][name="attending-welcome-soiree"],' +
            'input[type="radio"][name="attending-wedding-day"]'
        ).forEach(radioEl => {
            radioEl.addEventListener('change', updatedRSVP);
        });
    newGuestRSVPForm
        .querySelector('textarea.rsvp-dietary-requirements')
        .addEventListener('keyup', debouncedUpdatedRSVP);
}

function initDietaryRequirementsEvents(newGuestRSVPForm) {
    const dietaryRequirementsInput = newGuestRSVPForm
        .querySelector('label.dietary-requirements');

    function updateDietaryRequirementsVisibility() {
        const attendingWelcomeSoiree = getRadioButtonValue(
            'attending-welcome-soiree', newGuestRSVPForm
        ) == 'yes';
        const attendingWeddingDay = getRadioButtonValue(
            'attending-wedding-day', newGuestRSVPForm
        ) == 'yes';

        if (attendingWelcomeSoiree || attendingWeddingDay) {
            dietaryRequirementsInput.classList.remove('hidden');
        } else {
            dietaryRequirementsInput.classList.add('hidden');
        }
    }

    newGuestRSVPForm.querySelectorAll(
        'input[name="attending-welcome-soiree"],' +
        'input[name="attending-wedding-day"]'
    ).forEach(radioEl => {
        radioEl.addEventListener('change', updateDietaryRequirementsVisibility);
    });

    updateDietaryRequirementsVisibility();
}

function initDeleteButtonEvents(newGuestRSVPForm) {
    newGuestRSVPForm.querySelector('button.delete').addEventListener('click', () => {
        newGuestRSVPForm.remove();
        resetAllGuestNumbers();
        validateAllRSVPGuests();
    });
}

function resetAllGuestNumbers() {
    const allGuestRSVPForms = document.querySelectorAll('form.guest-rsvp');
    allGuestRSVPForms.forEach((guestRSVPForm, index) => {
        guestRSVPForm.querySelector('h1').textContent = `Guest ${index + 1}`;
    });
}

function populateGuestData(guestRSVPForm, guestData) {
    if (guestData == null) return;
    guestRSVPForm.querySelector(
        'input[type="text"][name="guest-name"]'
    ).value = guestData.guestName;
    setRadioButtonValue(
        'attending-welcome-soiree',
        guestData.attendingWelcomeSoiree,
        guestRSVPForm
    );
    setRadioButtonValue(
        'attending-wedding-day',
        guestData.attendingWeddingDay,
        guestRSVPForm
    );
    guestRSVPForm.querySelector(
        'textarea.rsvp-dietary-requirements'
    ).value = guestData.dietaryRequirements;
    if (
        guestData.attendingWelcomeSoiree === 'yes' ||
        guestData.attendingWeddingDay === 'yes'
    ) {
        guestRSVPForm
            .querySelector('label.dietary-requirements')
            .classList.remove('hidden');
    }
}

function submitRSVP() {
    saveRSVP();

    const validatedAllGood = validateAllRSVPGuests();
    if (!validatedAllGood) return;

    const to = deobfuscate(
        '109-97-103-97-100-97-110-106-104-111-110-101-' +
        '115-115-97-64-103-109-97-105-108-46-99-111-109'
    );
    const cc = deobfuscate(
        '112-101-116-101-114-109-105-108-108-101-114-49-57-56-54-64-103-109-97-' +
        '105-108-46-99-111-109'
    );
    const subject = 'RSVP for Peter and Jhonessa\'s Wedding';
    const body = formatEmailBody(getAllGuestData()).join('\n\n');

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailtoURL = `mailto:${to}?cc=${cc}&subject=${encodedSubject}&body=${encodedBody}`;

    const anchor = document.createElement('a');
    anchor.href = mailtoURL;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

function saveRSVP() {
    const rsvpData = getAllGuestData();
    localStorage.setItem('rsvp-data', JSON.stringify(rsvpData));
}

function getAllGuestData() {
    return Array
        .from(document.querySelectorAll('form.guest-rsvp'))
        .map(guestRSVPForm => get1GuestData(guestRSVPForm))
        .filter(oneGuestData => oneGuestData !== null);
}

function get1GuestData(guestRSVPForm) {
    const guestName = guestRSVPForm
        .querySelector('input[type="text"][name="guest-name"]')
        .value.trim();
    const attendingWelcomeSoiree = getRadioButtonValue(
        'attending-welcome-soiree', guestRSVPForm
    );
    const attendingWeddingDay = getRadioButtonValue(
        'attending-wedding-day', guestRSVPForm
    );
    const dietaryRequirements = guestRSVPForm
        .querySelector('textarea.rsvp-dietary-requirements')
        .value.trim();;

    if (
        guestName === '' &&
        attendingWelcomeSoiree == null &&
        attendingWeddingDay == null &&
        dietaryRequirements === ''
    ) return null;

    return {
        guestName,
        attendingWelcomeSoiree,
        attendingWeddingDay,
        dietaryRequirements
    };
}

const debouncedUpdatedRSVP = debounce(updatedRSVP, 1000);

function updatedRSVP() {
    saveRSVP();
    validateAllRSVPGuests();
}

function debounce(function_, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            function_.apply(context, args);
        }, wait);
    };
}

function formatEmailBody(rsvpData) {
    return rsvpData
        .map((guestData, index) => {
            return format1GuestData(guestData, index);
        });
}

function format1GuestData(guestData, index) {
    const formattedDietaryRequirements = (
        guestData.attendingWelcomeSoiree === 'yes' ||
        guestData.attendingWeddingDay === 'yes'
    ) ? `Dietary Requirements: ${guestData.dietaryRequirements}` : '';
    return `${guestData.guestName}
Attending the Welcome Soirée: ${guestData.attendingWelcomeSoiree}
Attending on the Wedding Day: ${guestData.attendingWeddingDay}
${formattedDietaryRequirements}`;
}

function getRadioButtonValue(radioGroupName, parentElement) {
    if (parentElement == null) {
        parentElement = document;
    }
    return parentElement
        .querySelector(`input[type="radio"][name="${radioGroupName}"]:checked`)?.value;
}

function setRadioButtonValue(radionGroupName, value, parentElement) {
    if (value == null) return;
    if (parentElement == null) {
        parentElement = document;
    }
    parentElement
        .querySelector(`input[type="radio"][name="${radionGroupName}"][value="${value}"]`)
        .checked = true;
}

function validateAllRSVPGuests() {
    const allGuestRSVPForms = document.querySelectorAll('form.guest-rsvp');
    let allErrors = [];
    allGuestRSVPForms.forEach((guestRSVPForm, index) => {
        allErrors = allErrors.concat(validate1GuestForm(guestRSVPForm, index + 1));
    });
    let validationErrorListHTML = '';
    if (allErrors.length > 0) {
        validationErrorListHTML =
            '<p><mark>Please enter the following missing information:</mark></p>\n' +
            '<ul>\n' +
            '<li><mark>' +
            allErrors.join('</mark></li>\n<li><mark>') +
            '</mark></li>\n' +
            '</ul>';
    }
    document.querySelector('#rsvp-errors').innerHTML = validationErrorListHTML;
    return allErrors.length === 0;
}

function validate1GuestForm(guestForm, guestNumber) {
    let errors = [];
    const guestNameInput = guestForm.querySelector(
        'input[type="text"][name="guest-name"]'
    );
    const attendingWelcomeSoiree = getRadioButtonValue('attending-welcome-soiree', guestForm);
    const attendingWeddingDay = getRadioButtonValue('attending-wedding-day', guestForm);

    let guestName = `Guest ${guestNumber}`;
    if (guestNameInput.value.trim() === '') {
        errors.push(`Please enter the Name of ${guestName}.`);
    } else {
        guestName = guestNameInput.value.trim();
    }

    if (attendingWelcomeSoiree == null) {
        errors.push(`Please select if ${guestName} is attending the Welcome Soirée.`);
    }

    if (attendingWeddingDay == null) {
        errors.push(`Please select if ${guestName} is attending the Wedding Day.`);
    }

    return errors;
}

function obfuscate(str) {
    let obfuscated = [];
    for (var i = 0; i < str.length; i++) {
        obfuscated.push(str.charCodeAt(i));
    }
    return obfuscated.join('-');
}

function deobfuscate(str) {
    return str.split('-')
        .map(code => String.fromCharCode(code)).join('');
}