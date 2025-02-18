document.addEventListener("DOMContentLoaded", () => {
    const messageInput = document.querySelector('.message_input');
    const sendBtn = document.querySelector('.send_btn');
    const messagesContainer = document.querySelector('.messages_container');
    const ipInput = document.querySelector('.input_ip'); 
    const modelSelect = document.querySelector('.select_model');
    let autoScrollEnabled = true;
    let isRequestInProgress = false; // Флаг для отслеживания активного запроса

    function checkScrollPosition(messagesContainer) {
        const atBottom =
            messagesContainer.scrollHeight - messagesContainer.scrollTop === messagesContainer.clientHeight;
        autoScrollEnabled = atBottom;
    }

    function splitTextIntoParts(text, partSize) {
        const parts = [];
        for (let i = 0; i < text.length; i += partSize) {
            parts.push(text.substring(i, i + partSize));
        }
        return parts;
    }

    function sendToNeuralNetwork(message) {
        const partSize = 1000;
        const textParts = splitTextIntoParts(message, partSize);
        const serverAddress = ipInput.value.trim();
        const selectedModel = modelSelect.value;

        console.log(`Сообщение отправлено на ${serverAddress} к ${selectedModel}`);
        return fetch(`http://${serverAddress}/process_task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: textParts, model: selectedModel }),
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

    function formatMarkdownToHTML(markdownText) { 
        let formattedText = markdownText
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/~~(.*?)~~/g, '<del>$1</del>')
            .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/^\d+\.\s(.*)$/gm, '<li>$1</li>')
            .replace(/^- (.*)$/gm, '<li>$1</li>');

        return formattedText.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
    }

    function addMessage(content, isUser = true) {
        const formattedContent = formatMarkdownToHTML(content);

        const messageBox = document.createElement('article');
        messageBox.classList.add(isUser ? 'message_box_user' : 'message_box_ai');

        const messageText = document.createElement('p');
        messageText.classList.add(isUser ? 'message_box_user_text' : 'message_box_ai_text');
        messageText.innerHTML = formattedContent;
        messageBox.appendChild(messageText);
        messagesContainer.appendChild(messageBox);

        if (!isUser && autoScrollEnabled) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        return messageBox;
    }

    function addTypingIndicator() {
        const typingBox = document.createElement('article');
        typingBox.classList.add('message_box_ai_typing');
        const dots = document.createElement('div');
        dots.classList.add('dots');
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('color5');
            dots.appendChild(dot);
        }
        typingBox.appendChild(dots);
        messagesContainer.appendChild(typingBox);

        if (autoScrollEnabled) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        return typingBox;
    }

    function handleSendMessage() {
        // Если запрос уже выполняется, повторная отправка не допускается
        if (isRequestInProgress) {
            return;
        }
        const message = messageInput.value.trim();
        if (message) {
            isRequestInProgress = true;
            addMessage(message, true);
            const typingIndicator = addTypingIndicator();

            sendToNeuralNetwork(message)
                .then(response => {
                    typingIndicator.remove();
                    addMessage(response, false);
                })
                .finally(() => {
                    isRequestInProgress = false;
                });

            // Очистка поля ввода происходит только при успешной отправке нового запроса
            messageInput.value = '';
        }
    }

    sendBtn.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    });

    messagesContainer.addEventListener('scroll', () => {
        checkScrollPosition(messagesContainer);
    });
});
