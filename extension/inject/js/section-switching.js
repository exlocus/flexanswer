document.addEventListener("DOMContentLoaded", () => {
    const settingsBtn = document.querySelector('.settings_btn');
    const backBtn = document.querySelector('.back_btn');
    const sectionSettings = document.querySelector('.section-settings');
    const sectionChat = document.querySelector('.section-chat');

    function switchSectionsWithAnimation(hideSection, showSection, hideBtn, showBtn) {
        animateSection(hideSection, 'fade-out');
        setTimeout(() => {
            hideSection.style.display = 'none';
            showSection.style.display = 'block';
            animateSection(showSection, 'fade-in');
            hideBtn.style.display = 'none';
            showBtn.style.display = 'inline-block';
        }, 600);
    }

    function animateSection(section, animationClass) {
        const elements = section.querySelectorAll('.element');
        elements.forEach((element) => {
            element.classList.add(animationClass);
            element.addEventListener('animationend', () => {
                element.classList.remove(animationClass);
            }, { once: true });
        });
    }

    settingsBtn.addEventListener('click', () => {
        switchSectionsWithAnimation(sectionChat, sectionSettings, settingsBtn, backBtn);
    });

    backBtn.addEventListener('click', () => {
        switchSectionsWithAnimation(sectionSettings, sectionChat, backBtn, settingsBtn);
    });
});
