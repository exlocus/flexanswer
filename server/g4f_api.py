import g4f
from g4f import models

g4f.debug.logging = True
MODEL_MAP = {
    'gpt_4o': models.gpt_4o,
    'gpt_4o_mini': models.gpt_4o_mini,
    'gpt_3.5_turbo': models.gpt_35_turbo,
    'o1_preview': models.o1_preview,
    'llama_3.1_405b': models.llama_3_1_405b,
}

def ask(message: str, model: str) -> str:
    """
    Отправляет запрос к модели и возвращает ответ.
    
    :param message: Строка с текстом задания.
    :param model: Название модели из MODEL_MAP.
    :return: Ответ модели в виде строки.
    """
    try:
        response = g4f.ChatCompletion.create(
            model=MODEL_MAP.get(model, models.gpt_4o),
            messages=[{
                "role": "user",
                "content": f"Привет! {message}. Ответь на русском языке, не превышая 1000 символов."
            }]
        )
        return response
    except Exception as e:
        return f'Ошибка: {str(e)}'
