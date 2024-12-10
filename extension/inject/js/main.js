document.addEventListener('DOMContentLoaded', () => {
    const attachBtn = document.querySelector('.attach_btn');
    const attachWindow = document.querySelector('.attach_file_window');
    const messageInput = document.querySelector('.message_input');
    const sendBtn = document.querySelector('.send_btn');
    const messagesContainer = document.querySelector('.messages_container');
    const settingsBtn = document.querySelector('.settings_btn');
    const backBtn = document.querySelector('.back_btn');
    const sectionSettings = document.querySelector('.section-settings');
    const sectionChat = document.querySelector('.section-chat');
    let autoScrollEnabled = true;
    
    // Переключение секций с анимацией
    function switchSectionsWithAnimation(hideSection, showSection, hideBtn, showBtn) {
        // Анимация исчезновения для текущей секции
        animateSection(hideSection, 'fade-out');
    
        // Установка таймера на окончание анимации исчезновения
        setTimeout(() => {
            hideSection.style.display = 'none'; // Скрываем текущую секцию
            showSection.style.display = 'block'; // Показываем следующую секцию
    
            // Анимация появления для новой секции
            animateSection(showSection, 'fade-in');
    
            // Переключение видимости кнопок
            hideBtn.style.display = 'none';
            showBtn.style.display = 'inline-block';
        }, 600); // Длительность анимации fade-out
    }
    
    // Применение анимаций к элементам секции
    function animateSection(section, animationClass) {
        const elements = section.querySelectorAll('.element'); // Выбираем элементы внутри секции
    
        elements.forEach((element) => {
            // Применяем анимацию сразу, без задержки
            element.classList.add(animationClass);
    
            // Убираем класс после завершения анимации
            element.addEventListener('animationend', () => {
                element.classList.remove(animationClass);
            }, { once: true });
        });
    }
    
    // Переключение в настройки
    settingsBtn.addEventListener('click', () => {
        switchSectionsWithAnimation(sectionChat, sectionSettings, settingsBtn, backBtn);
    });
    
    // Переключение назад в чат
    backBtn.addEventListener('click', () => {
        switchSectionsWithAnimation(sectionSettings, sectionChat, backBtn, settingsBtn);
    });    

    // Обработчик прокрутки
    messagesContainer.addEventListener('scroll', () => {
        checkScrollPosition(messagesContainer);
      });
    
    // Функция для проверки положения прокрутки
    function checkScrollPosition(messagesContainer) {
        const atBottom =
          messagesContainer.scrollHeight - messagesContainer.scrollTop === messagesContainer.clientHeight;
        autoScrollEnabled = atBottom;
      }

    // Функция для разбивки текста на части
    function splitTextIntoParts(text, partSize) {
        const parts = [];
        for (let i = 0; i < text.length; i += partSize) {
            parts.push(text.substring(i, i + partSize));
        }
        return parts;
    }

    // Функция для отправки сообщения в нейросеть
    function sendToNeuralNetwork(message) {
    const partSize = 1000;
    const textParts = splitTextIntoParts(message, partSize); 

    return fetch('http://localhost:5000/process_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: textParts, model: "default-model" }),
    })
        .then(response => response.json())
        .then(data => {
        if (data.answer) {
            return data.answer;
        } else {
            throw new Error('Ошибка получения ответа от AI');
        }
        })
        .catch(error => {
        console.error('Ошибка при обработке задания:', error.message);
        return 'Ошибка: не удалось получить ответ от AI.';
        });
    }

    // Показать/скрыть окно attach с анимациями
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

    // Функция для добавления сообщений в messages
    function addMessage(content, isUser = true) {
        const messageBox = document.createElement('article');
        messageBox.classList.add(isUser ? 'message_box_user' : 'message_box_ai');
        
        const messageText = document.createElement('p');
        messageText.classList.add(isUser ? 'message_box_user_text' : 'message_box_ai_text');
        messageText.textContent = content;
    
        messageBox.appendChild(messageText);
        messagesContainer.appendChild(messageBox);

        if (!isUser && autoScrollEnabled) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
  
    // Обработчик нажатия кнопки Send или клавиши Enter
    function handleSendMessage() {
        const message = messageInput.value.trim();
      
        if (message) {
            addMessage(message, true);
            sendToNeuralNetwork(message).then(response => {
                addMessage(response, false);
            });

            messageInput.value = '';
        }
    }      
  
    // Обработчик кнопки Send
    sendBtn.addEventListener('click', handleSendMessage);
  
    // Обработчик нажатия клавиши Enter
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            handleSendMessage();
        }
    }); 
  });

document.addEventListener("DOMContentLoaded", () => {
    const inputIp = document.querySelector(".input_ip");
    const selectModel = document.querySelector(".select_model");

    // Функция для сохранения настроек
    const saveSettings = () => {
        const settings = {
            ip: inputIp.value,
            model: selectModel.value
        };
        localStorage.setItem("settings", JSON.stringify(settings));
    };

    // Автоматическое сохранение при изменении значения IP
    inputIp.addEventListener("input", saveSettings);

    // Автоматическое сохранение при изменении выбора модели
    selectModel.addEventListener("change", saveSettings);

    // Загрузка настроек при загрузке страницы
    const savedSettings = JSON.parse(localStorage.getItem("settings"));
    if (savedSettings) {
        inputIp.value = savedSettings.ip;
        selectModel.value = savedSettings.model;
    }
});
