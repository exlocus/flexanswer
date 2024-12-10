document.addEventListener("DOMContentLoaded", () => {
    const attachBtn = document.querySelector('.attach_btn');
    const attachWindow = document.querySelector('.attach_file_window');

    attachBtn.addEventListener('click', () => {
        if (attachWindow.style.display === 'none' || attachWindow.style.display === '') {
            attachWindow.style.display = 'flex';
            attachWindow.style.animation = 'bounceUp 0.5s ease-out forwards';
        } else {
            attachWindow.style.animation = 'fallDown 0.5s ease-out forwards';
            setTimeout(() => {
                attachWindow.style.display = 'none';
            }, 500);
        }
    });
});
