//DEVELOPER: websites.developer@atomicmail.io//
// Отключаем автоматическое восстановление позиции прокрутки браузером
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
// Прокручиваем вверх при полной загрузке страницы
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// Немедленно выполняемая функция, чтобы не засорять глобальную область
(function hideScrollbar() {
    // Создаём элемент <style>
    const style = document.createElement('style');
    style.type = 'text/css';

    // CSS-правила для всех браузеров
    style.textContent = `
        /* Для WebKit (Chrome, Safari, Edge Chromium, Opera) */
        ::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
            background: transparent !important;
        }

        /* Для Firefox */
        html {
            scrollbar-width: none !important;
        }

        /* Для Internet Explorer и старых версий Edge */
        body {
            -ms-overflow-style: none !important;
        }

        /* Дополнительно: всегда включаем вертикальную прокрутку,
           чтобы избежать скачков контента при появлении/исчезновении полосы */
        html {
            overflow-y: scroll;
        }
        body {
            overflow-y: scroll;
        }
    `;

    // Добавляем стили в <head>
    document.head.appendChild(style);
})();
document.addEventListener("DOMContentLoaded", function () {
    var navbarToggler = document.querySelector(".navbar-toggler");
    var navbarCollapse = document.getElementById("navbarNav");

    if (navbarToggler && navbarCollapse) {
        // При открытии меню добавляем класс active
        navbarCollapse.addEventListener("shown.bs.collapse", function () {
            navbarToggler.classList.add("active");
            navbarToggler.setAttribute("aria-expanded", "true");
        });

        // При закрытии меню убираем класс active
        navbarCollapse.addEventListener("hidden.bs.collapse", function () {
            navbarToggler.classList.remove("active");
            navbarToggler.setAttribute("aria-expanded", "false");
        });
    }
});
(function (carousel) {
    // Находим все карусели с классом .draggable (можно привязаться к конкретному id)
    document
        .querySelectorAll(".carousel.draggable")
        .forEach(function (carousel) {
            // Получаем экземпляр Bootstrap Carousel
            const bsCarousel =
                bootstrap.Carousel.getInstance(carousel) ||
                new bootstrap.Carousel(carousel, {
                    touch: false, // отключаем встроенный touch
                });
            let startX = 0;
            let startY = 0;
            let isDragging = false;
            let startTime = 0;
            // Функция для обработки начала перетаскивания
            function onDragStart(e) {
                const point = e.touches ? e.touches[0] : e;
                startX = point.clientX;
                startY = point.clientY;
                startTime = Date.now();
                isDragging = true;
                carousel.classList.add("dragging");
                // Отключаем стандартные события браузера
                e.preventDefault();
            }
            // Функция для обработки движения
            function onDragMove(e) {
                if (!isDragging) return;
                const point = e.touches ? e.touches[0] : e;
                const deltaX = point.clientX - startX;
                const deltaY = point.clientY - startY;
                // Если движение больше по горизонтали, чем по вертикали (чтобы не мешать скроллу)
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    e.preventDefault(); // предотвращаем скролл при горизонтальном свайпе
                }
            }
            // Функция для завершения перетаскивания
            function onDragEnd(e) {
                if (!isDragging) return;
                isDragging = false;
                carousel.classList.remove("dragging");
                // Определяем конечную точку
                const point = e.changedTouches ? e.changedTouches[0] : e;
                const deltaX = point.clientX - startX;
                const deltaY = point.clientY - startY;
                const elapsed = Date.now() - startTime;
                // Проверяем, был ли свайп достаточно быстрым (скорость > 0.3 px/ms) или с большим смещением (> 50px)
                const speed = Math.abs(deltaX) / elapsed; // px/ms
                const threshold = 50; // минимальное смещение для переключения
                if (Math.abs(deltaX) > threshold || speed > 0.3) {
                    if (deltaX < 0) {
                        bsCarousel.next(); // свайп влево -> следующий
                    } else {
                        bsCarousel.prev(); // свайп вправо -> предыдущий
                    }
                }
                // Если смещение маленькое – ничего не делаем
            }
            // Обработчики для touch-событий
            carousel.addEventListener("touchstart", onDragStart, {
                passive: false,
            });
            carousel.addEventListener("touchmove", onDragMove, {
                passive: false,
            });
            carousel.addEventListener("touchend", onDragEnd, {
                passive: false,
            });
            carousel.addEventListener("touchcancel", onDragEnd, {
                passive: false,
            });
            // Обработчики для мыши (drag)
            carousel.addEventListener("mousedown", onDragStart);
            // Для мыши нужно добавить глобальные обработчики, чтобы отслеживать движение вне карусели
            function onMouseMove(e) {
                if (!isDragging) return;
                // Вызываем onDragMove с событием мыши
                onDragMove(e);
            }
            function onMouseUp(e) {
                if (!isDragging) return;
                onDragEnd(e);
                // Удаляем глобальные обработчики после отпускания
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }
            // Подписываемся на глобальные события мыши при mousedown
            carousel.addEventListener("mousedown", function (e) {
                // Добавляем слушатели на документ
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });
            // Отключаем контекстное меню при перетаскивании (для мыши)
            carousel.addEventListener("dragstart", function (e) {
                e.preventDefault();
            });
        });
})();
$(document).ready(function (menu_scroll__fixed) {
    // ---- Функция обновления меню ----
    function updateNavbar(index, sectionElement) {
        var thresholdIndex = 1;
        if (index >= thresholdIndex) {
            $(".navbar").addClass("navbar--scroll");
        } else {
            $(".navbar").removeClass("navbar--scroll");
        }

        $(".navbar-menu__item-link").removeClass(
            "active navbar-menu__item-link--scroll",
        );
        var sectionId = sectionElement ? sectionElement.id : null;
        if (sectionId) {
            var targetLink = $(
                '.navbar-menu__item-link[href="#' + sectionId + '"]',
            );
            if (targetLink.length) {
                targetLink.addClass("active navbar-menu__item-link--scroll");
            }
        }
    }

    // ---- Инициализация fsScroll ----
    $(".fullpage").fsScroll({
        direction: "vertical",
        duration: 350,
        keyboard: true,
    });

    // ---- Обновление меню после завершения анимации переключения секций ----
    $(".fullpage").on("transitionend", function () {
        var instance = $(".fullpage").data("fsScroll");
        if (instance) {
            var index = instance.index;
            var sectionElement = $(".section").eq(index)[0];
            if (sectionElement) {
                updateNavbar(index, sectionElement);
            }
        }
    });

    // ---- Также обновляем при загрузке (на случай, если первая секция активна) ----
    var initialInstance = $(".fullpage").data("fsScroll");
    if (initialInstance) {
        var initialIndex = initialInstance.index;
        var initialSection = $(".section").eq(initialIndex)[0];
        if (initialSection) {
            updateNavbar(initialIndex, initialSection);
        }
    }

    // ---- Функция перехода к секции по индексу (для кликов по меню) ----
    function scrollToSection(index) {
        var instance = $(".fullpage").data("fsScroll");
        if (instance && index >= 0 && index < instance.pagesCount) {
            instance.index = index;
            instance._scrollPage();
            // transitionend сработает автоматически, но на случай если что-то пойдёт не так, обновим вручную
            var allSections = $(".section");
            var sectionElement = allSections.eq(index)[0];
            if (sectionElement) {
                updateNavbar(index, sectionElement);
            }
        }
    }

    // ---- Обработка кликов по пунктам меню ----
    $('.navbar-menu__item-link[href^="#"]').on("click", function (e) {
        e.preventDefault();
        var targetId = $(this).attr("href");
        var targetSection = $(targetId);
        if (targetSection.length) {
            var allSections = $(".section");
            var index = allSections.index(targetSection);
            if (index !== -1) {
                scrollToSection(index);
            }
        }
    });

    // ---- Закрытие мобильного меню после клика (опционально) ----
    $('.navbar-menu__item-link[href^="#"]').on("click", function () {
        var navbarCollapse = $("#navbarNav");
        if (navbarCollapse.hasClass("show")) {
            navbarCollapse.collapse("hide");
        }
    });
    // ===== НОВОЕ: Принудительный переход на первый экран и скрытие прелоадера =====
    // Небольшая задержка, чтобы fsScroll успел инициализироваться и отрендерить страницу
    setTimeout(function () {
        // Переходим на первую секцию (индекс 0)
        scrollToSection(0);

        // Скрываем прелоадер с анимацией
        $("#preloader").addClass("hidden");
        // Или можно сделать fadeOut, если нужна плавность:
        // $('#preloader').fadeOut(500);
    }, 500); // 200 мс – достаточно, можно подогнать под свои ощущения
});
(function (counters) {
    "use strict";

    function animateCounter(element, target, duration) {
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.round(eased * target);
            element.textContent = currentValue.toLocaleString("ru-RU");

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString("ru-RU");
            }
        }

        requestAnimationFrame(update);
    }

    document.addEventListener("DOMContentLoaded", function () {
        const counters = document.querySelectorAll(".counter-value");
        const duration = 5000;

        counters.forEach(function (counter) {
            const target = parseInt(counter.getAttribute("data-target"), 10);
            if (!isNaN(target) && target > 0) {
                animateCounter(counter, target, duration);
            }
        });
    });
})();

// Находим элемент с id="currentYear" и вставляем в него текущий год
        document.addEventListener('DOMContentLoaded', function() {
            const yearSpan = document.getElementById('currentYear');
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }
            const startyearSpan = document.getElementById('startYear');
            if (startyearSpan) {
                startyearSpan.textContent = "2015";
            }
        });
