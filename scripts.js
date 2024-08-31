document.addEventListener('DOMContentLoaded', resizeHeadings);

function resizeHeadings() {
    const sections = document.querySelectorAll('.parallax-section');
    const menuLinks = document.querySelectorAll('.menu a');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const menuLink = document.querySelector(`.menu a[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                menuLinks.forEach(link => link.classList.remove('active'));
                menuLink.classList.add('active');
            }
        });
    }, {
        threshold: 0.6 // trigger when 60% of the section is in view
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}