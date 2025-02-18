document.addEventListener("DOMContentLoaded", () => {
    const currentVersion = '1.0.1bp';
  
    // Проверяет наличие новой версии.
    async function checkForUpdates() {
        const response = await fetch(
          'https://raw.githubusercontent.com/exlocus/flexanswer/refs/heads/main/get_version.json'
        );
        const data = await response.json();
  
        if (data.current_version !== currentVersion) {
          const lastUpdateTime = localStorage.getItem('lastUpdateReminder');
          const now = Date.now();
  
          if (!lastUpdateTime || now - lastUpdateTime >= 3 * 60 * 60 * 1000) {
            showUpdateNotification(data.current_version);
          }
        }
    }
  
    // Показывает уведомление о новой версии.
    function showUpdateNotification(newVersion) {
        showNotification({
          title: `Доступно обновление v${newVersion}`,
          description: `Доступно новое обновление! Версия ${newVersion}. Установите сейчас, чтобы получить новые функции и улучшения!`,
          buttons: ["update_notification_popup_plate_content_buttons_okey_button", "notification_popup_plate_content_buttons_github_button"],
        });
    
        // Скрываем основную кнопку "Окей"
        document
          .querySelector(".notification_popup_plate_content_buttons_okey_button")
          .style.display = "none";
    
        // Показываем специальную кнопку "Окей" для обновлений
        document
          .querySelector(".update_notification_popup_plate_content_buttons_okey_button")
          .style.display = "inline-block";
    
        // Привязываем событие к кнопке "Окей" в обновлении
        document
          .querySelector(".update_notification_popup_plate_content_buttons_okey_button")
          .addEventListener("click", () => {
            localStorage.setItem('lastUpdateReminder', Date.now());
            hideNotification();
          });
    }
  
    // Функция отображения уведомления.
    function showNotification({ title, description, buttons = [] }) {
      const notificationPopup = document.querySelector(".notification_popup");
      const titleElement = notificationPopup.querySelector(
        ".notification_popup_plate_content_title_plate_title_text"
      );
      const descriptionElement = notificationPopup.querySelector(
        ".notification_popup_plate_content_description_plate"
      );
  
      // Устанавливаем текст заголовка и описания
      titleElement.textContent = title;
      descriptionElement.textContent = description;
  
      // Скрываем все дополнительные кнопки по умолчанию
      const allButtons = notificationPopup.querySelectorAll(
        ".notification_popup_plate_content_buttons button"
      );
      allButtons.forEach((btn) => {
        if (!btn.classList.contains("notification_popup_plate_content_buttons_okey_button")) {
          btn.style.display = "none";
        }
      });
  
      // Показываем переданные дополнительные кнопки
      buttons.forEach((buttonClass) => {
        const button = notificationPopup.querySelector(`.${buttonClass}`);
        if (button) {
          button.style.display = "inline-block";
        }
      });
  
      // Показываем окно уведомления с анимацией
      notificationPopup.style.display = "block";
      requestAnimationFrame(() => {
        notificationPopup.classList.add("active");
      });
    }
  
    // Функция скрытия уведомления.
    function hideNotification() {
      const notificationPopup = document.querySelector(".notification_popup");
      notificationPopup.classList.remove("active");

      setTimeout(() => {
        notificationPopup.style.display = "none";
      }, 400);
    }

    // Cобытия на основной кнопке "Окей".
    document
    .querySelector(".notification_popup_plate_content_buttons_okey_button")
    .addEventListener("click", () => {
      hideNotification();
    });
  
    // Инициализируем проверку обновлений
    checkForUpdates();
  
    // Cобытия на кнопке "Гитхаб"
    document
      .querySelector(".notification_popup_plate_content_buttons_github_button")
      .addEventListener("click", () => {
        window.open('https://github.com/exlocus/flexanswer', '_blank');
      });
  });
  
