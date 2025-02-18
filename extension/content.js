// Создаем контейнер
const container = document.createElement('div');
container.className = 'flex_answer_container';
container.style.position = 'fixed';
container.style.bottom = '0px';
container.style.right = '30px';
container.style.width = '403px';
container.style.height = '40px';
container.style.zIndex = '10000';
container.style.transition = 'height 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';

// Создаем iframe
const iframe = document.createElement('iframe');
iframe.className = 'flex_answer_window';
iframe.src = chrome.runtime.getURL('inject/main.html');
iframe.style.width = '100%';
iframe.style.height = '100%';
iframe.style.border = 'none';
iframe.style.position = 'absolute';
iframe.style.zIndex = '1';
iframe.style.borderRadius = '16px 16px 0 0';

// Создаем overlay
const overlay = document.createElement('div');
overlay.className = 'flex_answer_overlay';
overlay.style.position = 'absolute';
overlay.style.display = 'unset';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '40px';
overlay.style.cursor = 'pointer';
overlay.style.zIndex = '2';

// Добавляем обработчик кликов на overlay для переключения высоты контейнера
overlay.addEventListener('click', () => {
  if (container.style.height === '40px') {
    container.style.height = '542px';
  } else {
    container.style.height = '40px';
  }
});

// Исходные стили для отслеживания изменений
const originalOverlayStyles = 'position: absolute; display: unset; top: 0px; left: 0px; width: 100%; height: 40px; cursor: pointer; z-index: 2;';
const originalIframeStyles = 'width: 100%; height: 100%; border: none; position: absolute; z-index: 1; border-radius: 16px 16px 0px 0px; --darkreader-inline-border-top: none; --darkreader-inline-border-right: none; --darkreader-inline-border-bottom: none; --darkreader-inline-border-left: none;';
const originalContainerStyles = 'position: fixed; bottom: 0px; right: 30px; width: 403px; height: 40px; z-index: 10000; transition: height 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);';

// Наблюдатель за изменениями стилей overlay, iframe и контейнера
const observer = new MutationObserver(() => {
  if (overlay.style.cssText !== originalOverlayStyles) {
    overlay.style.cssText = originalOverlayStyles;
  }
  if (iframe.style.cssText !== originalIframeStyles) {
    iframe.style.cssText = originalIframeStyles;
  }
  if (container.style.cssText !== originalContainerStyles) {
    container.style.cssText = originalContainerStyles;
  }
});
observer.observe(overlay, {
  attributes: true,
  attributeFilter: ['style']
});

// Собираем контейнер и добавляем его на страницу
container.appendChild(iframe);
container.appendChild(overlay);
document.body.appendChild(container);

// Функция для проверки режима fullscreen
function checkFullscreen() {
  // Проверяем, запрошен ли полноэкранный режим через API
  const fullscreenElement = document.fullscreenElement ||
                            document.webkitFullscreenElement ||
                            document.mozFullScreenElement ||
                            document.msFullscreenElement;
  // Проверяем полноэкранный режим браузера (F11): сравниваем высоту окна и экрана
  const isBrowserFullscreen = Math.abs(window.innerHeight - screen.height) < 10;

  // Если обнаружен fullscreen, скрываем контейнер, иначе показываем
  if (fullscreenElement || isBrowserFullscreen) {
    container.style.display = 'none';
  } else {
    container.style.display = 'block';
  }
}

// События для отслеживания изменений fullscreen режима
document.addEventListener('fullscreenchange', checkFullscreen);
document.addEventListener('webkitfullscreenchange', checkFullscreen);
document.addEventListener('mozfullscreenchange', checkFullscreen);
document.addEventListener('MSFullscreenChange', checkFullscreen);

// Отслеживаем изменение размеров окна (например, при нажатии F11)
window.addEventListener('resize', checkFullscreen);
