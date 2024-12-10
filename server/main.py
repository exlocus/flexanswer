import os
import webview
import webbrowser
from flask import Flask, request, jsonify
from flask_cors import CORS
from g4f_api import ask  # Импорт функции ask из g4f_api

# Конфигурация Flask
app = Flask(__name__)
CORS(app)

# Фиксированное состояние сервера
current_state = True

@app.route('/process_task', methods=['POST'])
def process_task():
    """
    Обрабатывает POST-запросы для выполнения задания.
    """
    data = request.json
    task = data.get('task', '')
    model = data.get('model', 'gpt_4o')

    if not task:
        return jsonify({'answer': 'Ошибка: Пустое задание.'})

    answer = ask(task, model)
    return jsonify({'answer': answer})

@app.route('/get_state', methods=['GET'])
def get_state():
    """
    Возвращает текущее состояние сервера.
    """
    return jsonify({'state': current_state})

class Api:
    def open_github(self):
        """
        Открывает страницу проекта на GitHub.
        """
        webbrowser.open('https://github.com/exlocus/flexanswer')
        return "GitHub opened"


# Определяем путь к файлу main.html
current_dir = os.path.dirname(os.path.abspath(__file__))
html_file_path = os.path.join(current_dir, 'gui', 'main.html')

if __name__ == '__main__':
    if os.path.exists(html_file_path):
        # Создаём экземпляр API для WebView
        api = Api()

        # Запуск сервера Flask в фоновом режиме
        import threading
        def run_flask():
            app.run(port=5000, use_reloader=False)

        flask_thread = threading.Thread(target=run_flask, daemon=True)
        flask_thread.start()

        # Создаём и запускаем окно WebView
        webview.create_window(
            title='FlexAnswer',
            url=f'file://{html_file_path}',
            width=381,
            height=832,
            resizable=False,
            js_api=api,
        )
        webview.start()
    else:
        print(f"Файл не найден: {html_file_path}")