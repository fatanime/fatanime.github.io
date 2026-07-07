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
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
        ::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
            background: transparent !important;
        }
        html {
            scrollbar-width: none !important;
        }
        body {
            -ms-overflow-style: none !important;
        }
        html {
            overflow-y: scroll;
        }
        body {
            overflow-y: scroll;
        }
    `;
    document.head.appendChild(style);
})();

document.addEventListener("DOMContentLoaded", function () {
    var navbarToggler = document.querySelector(".navbar-toggler");
    var navbarCollapse = document.getElementById("navbarNav");

    if (navbarToggler && navbarCollapse) {
        navbarCollapse.addEventListener("shown.bs.collapse", function () {
            navbarToggler.classList.add("active");
            navbarToggler.setAttribute("aria-expanded", "true");
        });
        navbarCollapse.addEventListener("hidden.bs.collapse", function () {
            navbarToggler.classList.remove("active");
            navbarToggler.setAttribute("aria-expanded", "false");
        });
    }
});

(function (carousel) {
    document.querySelectorAll(".carousel.draggable").forEach(function (carousel) {
        const bsCarousel = bootstrap.Carousel.getInstance(carousel) || new bootstrap.Carousel(carousel, { touch: false });
        let startX = 0, startY = 0, isDragging = false, startTime = 0;

        function onDragStart(e) {
            const point = e.touches ? e.touches[0] : e;
            startX = point.clientX;
            startY = point.clientY;
            startTime = Date.now();
            isDragging = true;
            carousel.classList.add("dragging");
            e.preventDefault();
        }

        function onDragMove(e) {
            if (!isDragging) return;
            const point = e.touches ? e.touches[0] : e;
            const deltaX = point.clientX - startX;
            const deltaY = point.clientY - startY;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault();
            }
        }

        function onDragEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            carousel.classList.remove("dragging");
            const point = e.changedTouches ? e.changedTouches[0] : e;
            const deltaX = point.clientX - startX;
            const deltaY = point.clientY - startY;
            const elapsed = Date.now() - startTime;
            const speed = Math.abs(deltaX) / elapsed;
            const threshold = 50;

            if (Math.abs(deltaX) > threshold || speed > 0.3) {
                if (deltaX < 0) bsCarousel.next();
                else bsCarousel.prev();
            }
        }

        carousel.addEventListener("touchstart", onDragStart, { passive: false });
        carousel.addEventListener("touchmove", onDragMove, { passive: false });
        carousel.addEventListener("touchend", onDragEnd, { passive: false });
        carousel.addEventListener("touchcancel", onDragEnd, { passive: false });

        carousel.addEventListener("mousedown", onDragStart);

        function onMouseMove(e) {
            if (!isDragging) return;
            onDragMove(e);
        }

        function onMouseUp(e) {
            if (!isDragging) return;
            onDragEnd(e);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }

        carousel.addEventListener("mousedown", function (e) {
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        carousel.addEventListener("dragstart", function (e) {
            e.preventDefault();
        });
    });
})();

$(document).ready(function (menu_scroll__fixed) {
    // ---- Обновление меню (для десктопа, где работает fullpage) ----
    function updateNavbar(index, sectionElement) {
        var threshold = 770; // порог, при котором fullpage отключается
        var isMobile = $(window).width() < threshold;

        // На десктопе управляем классом navbar--scroll через индекс секции
        if (!isMobile) {
            var thresholdIndex = 1;
            if (index >= thresholdIndex) {
                $(".navbar").addClass("navbar--scroll");
            } else {
                $(".navbar").removeClass("navbar--scroll");
            }
        }

        // Активный пункт меню обновляем всегда
        $(".navbar-menu__item-link").removeClass("active navbar-menu__item-link--scroll");
        var sectionId = sectionElement ? sectionElement.id : null;
        if (sectionId) {
            var targetLink = $('.navbar-menu__item-link[href="#' + sectionId + '"]');
            if (targetLink.length) {
                targetLink.addClass("active navbar-menu__item-link--scroll");
            }
        }
    }

    // ---- Инициализация fsScroll с адаптивностью ----
    $(".fullpage").fsScroll({
        direction: "vertical",
        duration: 350,
        keyboard: true,
        responsiveWidth: 770 // при ширине < 770 fullpage отключается
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

    // ---- Обновление при загрузке ----
    var initialInstance = $(".fullpage").data("fsScroll");
    if (initialInstance) {
        var initialIndex = initialInstance.index;
        var initialSection = $(".section").eq(initialIndex)[0];
        if (initialSection) {
            updateNavbar(initialIndex, initialSection);
        }
    }

    // ---- Функция перехода к секции по индексу ----
    function scrollToSection(index) {
        var instance = $(".fullpage").data("fsScroll");
        if (instance && index >= 0 && index < instance.pagesCount) {
            instance.index = index;
            instance._scrollPage();
            var allSections = $(".section");
            var sectionElement = allSections.eq(index)[0];
            if (sectionElement) {
                updateNavbar(index, sectionElement);
            }
        }
    }

    // ---- Обработка кликов по меню ----
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

    // ---- Закрытие мобильного меню после клика ----
    $('.navbar-menu__item-link[href^="#"]').on("click", function () {
        var navbarCollapse = $("#navbarNav");
        if (navbarCollapse.hasClass("show")) {
            navbarCollapse.collapse("hide");
        }
    });

    // ---- Принудительный переход на первый экран и скрытие прелоадера ----
    setTimeout(function () {
        scrollToSection(0);
        $("#preloader").addClass("hidden");
    }, 500);
});

// ========== ОБРАБОТЧИК СКРОЛЛА ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ ==========
// Когда fullpage отключён (responsiveWidth), управляем классом через обычный скролл
function handleScrollForMobile() {
    var threshold = 770;
    var isMobile = $(window).width() < threshold;
    if (isMobile) {
        if ($(window).scrollTop() > 100) {
            $('.navbar').addClass('navbar--scroll');
        } else {
            $('.navbar').removeClass('navbar--scroll');
        }
    }
}

// Подписываемся на события скролла и изменения размера окна
$(window).on('scroll resize', handleScrollForMobile);
$(document).ready(handleScrollForMobile);
$(window).on('load', handleScrollForMobile);

// ========== АНИМАЦИЯ СЧЁТЧИКОВ ==========
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

// ========== ВСТАВКА ГОДА В ФУТЕР ==========
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