document.addEventListener("DOMContentLoaded", () => {
    const serverStatusText = document.querySelector('.server_status_text');
    const serverStatusIcon = document.querySelector('.server_status_icon');
    const inputIp = document.querySelector('.input_ip');

    function checkServerStatus() {
        const ip = inputIp.value;
        const url = `http://${ip}/get_state`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.state === true) {
                    serverStatusText.textContent = 'Сервер онлайн';
                    serverStatusIcon.classList.remove('offline');
                } else {
                    throw new Error('Сервер оффлайн');
                }
            })
            .catch(() => {
                serverStatusText.textContent = 'Сервер офлайн';
                serverStatusIcon.classList.add('offline');
            });
    }

    setInterval(checkServerStatus, 5000);

    checkServerStatus();
});
