document.addEventListener("DOMContentLoaded", () => {
    const inputIp = document.querySelector(".input_ip");
    const selectModel = document.querySelector(".select_model");
    const resetButton = document.querySelector(".reset_to_default_btn");

    const defaultSettings = {
        ip: "localhost:5000",
        model: "gpt_4o"
    };

    const saveSettings = () => {
        const settings = {
            ip: inputIp.value,
            model: selectModel.value
        };
        localStorage.setItem("settings", JSON.stringify(settings));
    };

    const loadSettings = () => {
        const savedSettings = JSON.parse(localStorage.getItem("settings"));
        if (savedSettings) {
            inputIp.value = savedSettings.ip;
            selectModel.value = savedSettings.model;
        } else {
            inputIp.value = defaultSettings.ip;
            selectModel.value = defaultSettings.model;
        }
    };

    const resetSettings = () => {
        localStorage.removeItem("settings");
        inputIp.value = defaultSettings.ip;
        selectModel.value = defaultSettings.model;
    };

    inputIp.addEventListener("input", saveSettings);
    selectModel.addEventListener("change", saveSettings);
    resetButton.addEventListener("click", resetSettings);

    loadSettings();
});
