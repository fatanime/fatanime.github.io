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
    document.head.appendChild(style);
})();

// Обработка бургер-меню (для анимации)
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
$(window).on('scroll', function() {
    if ($(window).scrollTop() > 100) { // порог, например, 50px
        $('.navbar').addClass('navbar--scroll');
    } else {
        $('.navbar').removeClass('navbar--scroll');
    }
});
// ========== ОБНОВЛЕНИЕ АКТИВНОГО ПУНКТА МЕНЮ ПРИ СКРОЛЛЕ ==========
function updateActiveMenuItem() {
    var scrollPosition = $(window).scrollTop();
    var windowHeight = $(window).height();
    var offset = 100; // небольшое смещение, чтобы учитывать высоту меню

    // Проходим по всем секциям, у которых есть id
    $('.game_section[id]').each(function() {
        var section = $(this);
        var sectionTop = section.offset().top - offset;
        var sectionBottom = sectionTop + section.outerHeight();

        // Если текущая позиция скролла находится в пределах секции (с учетом меню)
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            var targetId = section.attr('id');
            // Находим соответствующий пункт меню
            var menuLink = $('.navbar-menu__item-link[href="#' + targetId + '"]');
            // Удаляем класс у всех пунктов
            $('.navbar-menu__item-link').removeClass('navbar-menu__item-link--scroll active');
            // Добавляем класс текущему
            if (menuLink.length) {
                menuLink.addClass('navbar-menu__item-link--scroll active');
            }
        }
    });
}

// Вызываем при скролле (с оптимизацией через requestAnimationFrame или throttle)
var scrollTimeout;
$(window).on('scroll', function() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function() {
        updateActiveMenuItem();
    });
});

// Вызываем при загрузке и после изменения размера окна
$(window).on('load resize', function() {
    updateActiveMenuItem();
});

// Также обновляем при клике по пункту меню (перед переходом, но после прокрутки)
$('.navbar-menu__item-link[href^="#"]').on('click', function(e) {
    e.preventDefault();
    var targetId = $(this).attr('href'); // например "#games"
    var targetSection = $(targetId);
    if (targetSection.length) {
        // Плавно прокручиваем к секции с учетом высоты меню (чтобы не перекрывалось)
        var menuHeight = $('.navbar').outerHeight() || 0;
        var targetOffset = targetSection.offset().top - menuHeight - 10;
        $('html, body').animate({
            scrollTop: targetOffset
        }, 400, function() {
            // После завершения анимации обновляем активный пункт
            updateActiveMenuItem();
        });
        // Также сразу обновляем, чтобы пункт подсветился до окончания анимации
        $('.navbar-menu__item-link').removeClass('navbar-menu__item-link--scroll active');
        $(this).addClass('navbar-menu__item-link--scroll active');
    }
});
// Карусель с перетаскиванием (draggable)
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

// ========== ГЕНЕРАЦИЯ КАРТОЧЕК, ФИЛЬТРАЦИЯ, ПОИСК И МОДАЛКА ==========
$(document).ready(function() {

    // Массив игр (расширенный)
    const games = [
        {
            title: "Fattening",
            description: "Вы попадаете в дом с призраком. Но не совсем обычным... Ваша задача выжить и пройти весь сюжет до конца.",
            platform: "Windows",
            year: "2018",
            genres: ["Аркада", "Хоррор", "Оригинальные игры"],
            categories: ['short', 'arcade', 'original'],
            author: "j8867bbw",
            preview: "./img/games/fattening.jpg",
            image: "./img/games/fattening.jpg",
            downloadLink: "https://disk.yandex.ru/d/eSH_izgeYLNTrg"
        },
        {
            title: "Star Meadow",
            description: "Соберите все звездочки, не дав себя поймать. Но помните, что чем больше звезд вы соберете - тем сложнее будет идти.",
            platform: "Windows",
            year: "2019",
            genres: ["Аркада", "Оригинальные игры"],
            categories: ['short', 'arcade', 'original'],
            author: "Susfishous",
            preview: "./img/games/star.jpg",
            image: "./img/games/star_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/CvAYr4x9P7MdcA"
        },
        {
            title: "Walk with frog wife",
            description: "Ковбой Дикого Запада и его жена человеколягушка. А еще она тянет в рот все что попадается под руку, так что ваша задача убирать с ее пути все, что не является насекомым.",
            platform: "Windows",
            year: "2021",
            genres: ["Аркада", "Рельсовый Шутер", "Инди"],
            categories: ['short', 'arcade', 'original'],
            author: "Burger Kurger",
            preview: "./img/games/WalkwithFrogWife.jpg",
            image: "./img/games/WalkwithFrogWife_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/XLyULHflJ_SwXg"
        },
        {
            title: "Space Eater Force",
            description: "Космический шутер, где из подбитых вражеских кораблей выпадают булочки. Вам предстоит плавно раскормить главную героиню в одиночку или раскормить еще и ее подруг.",
            platform: "Windows",
            year: "2019",
            genres: ["Аркада", "Шутер", "Инди"],
            categories: ['long', 'arcade', 'original'],
            author: "uajaka",
            preview: "./img/games/SpaceEaterForce.jpg",
            image: "./img/games/SpaceEaterForce_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/RjTnp2YWCa9cBw"
        },
        {
            title: "FattFatt",
            description: "Главная героиня попадает в мир, целиком и полностью состоящий из еды. Ее задача - выбраться оттуда и нерастолстеть до предела...",
            platform: "Windows",
            year: "2018",
            genres: ["Аркада", "Инди"],
            categories: ['short', 'arcade', 'original'],
            author: "j8867bbw",
            preview: "./img/games/FattFatt.jpg",
            image: "./img/games/FattFatt.jpg",
            downloadLink: "https://disk.yandex.ru/d/d0F7bu_KzXyyOw"
        },
        {
            title: "Feeding Lila",
            description: "Лила попала в лапы монстра, заставляющего ее набирать вес в считанные секунды. Ваша задача балансировать между показателями, не давая им переполняться время от времени.",
            platform: "Windows",
            year: "2019",
            genres: ["Аркада", "Инди"],
            categories: ['short', 'arcade', 'original'],
            author: "RounderSofter",
            preview: "./img/games/FeedingLila.jpg",
            image: "./img/games/FeedingLila_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/NQ1b7ilYeHUQow"
        },
        {
            title: "Culinary Combat",
            description: "Некто по имени Мисс Тарабан получает приглашение на должность повара. Говорят, что все дело в ее сверх калорийной еде...",
            platform: "Windows",
            year: "2019",
            genres: ["Аркада", "Инди"],
            categories: ['short', 'arcade', 'original'],
            author: "sometimescozy",
            preview: "./img/games/CulinaryCombat.jpg",
            image: "./img/games/CulinaryCombat_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/LytOO_Fg4fwrJg"
        },
        {
            title: "Food Fighter Hansa GIB",
            description: "Вы - фея Ханса и ваша задача успеть на фестиваль. Но вот беда, волшебный лес наводнили гоблины. Хорошо, что любимая клубника в избытке, правда от нее Ханса быстро набирает вес...",
            platform: "Windows",
            year: "2018",
            genres: ["RPG", "Инди"],
            categories: ['short', 'rpg', 'original'],
            author: "Omega-8 Fatty Acid",
            preview: "./img/games/FoodFighterHansaGJB.jpg",
            image: "./img/games/FoodFighterHansaGJB_full.jpg",
            downloadLink: "https://yadi.sk/d/njxt0xPrF0b8Aw"
        },
        {
            title: "Amoeblaster",
            description: "Собирайте четыре в ряд и грудь персонажа будет расти - все просто! Главное не сбиваться из-за растущего ритма и сложности.",
            platform: "Windows",
            year: "2019",
            genres: ["Казуал", "Инди"],
            categories: ['short', 'arcade', 'original'],
            author: "Burger Kurger",
            preview: "./img/games/Amoeblaster.jpg",
            image: "./img/games/Amoeblaster_full.jpg",
            downloadLink: "https://yadi.sk/d/uLb8F-70tZu-gQ"
        },
        {
            title: "Five Nights with Fatties 18+",
            description: "Пародия на FNAF, но вместо привычных аниматроников полные женоподобные роботы...",
            platform: "Windows",
            year: "2020",
            genres: ["Хоррор", "Квест", "Фан версия"],
            categories: ['long', 'rpg', 'fan'],
            author: "Poppu",
            preview: "./img/games/FNWF.jpg",
            image: "./img/games/FNWF_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/LoxdIbKConsc_A"
        },
        {
            title: "Lickety Split",
            description: "Вы - мороженщик, но ваш продукт имеет интересную особенность: от него быстро набираешь вес.",
            platform: "Windows",
            year: "2020",
            genres: ["Казуал", "Инди"],
            categories: ['short', 'arcade', 'original'],
            author: "Jakethesnake0101",
            preview: "./img/games/LicketySplit.jpg",
            image: "./img/games/LicketySplit_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/IIdoBBI4Qururw"
        },
        {
            title: "Feed the crown",
            description: "Вы простой рыцарь, удостоенный чести в течении трех дней после непростых вылазок в вражеский замок кормить королеву найденной едой. Чем больше еды вы принесете, тем толще она станет...",
            platform: "Windows",
            year: "2021",
            genres: ["Платформер", "Инди"],
            categories: ['short', 'arcade', 'original'],
            author: "SofterCode",
            preview: "./img/games/FeedtheCrown.jpg",
            image: "./img/games/FeedtheCrown_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/sI-qwrsmw8vNHQ"
        },
        {
            title: "Baby Fat Games 18+",
            description: "Вы - безымянный герой, который был нанят нянькой для Зои ее матерью. Зоя весьма необычная девушка, о чем вы скоро сами поймете...Скачивая этот набор игр, вы подтверждаете, что вам исполнилось 18 лет!",
            platform: "Windows",
            year: "2020",
            genres: ["Квест", "Vore","Инди"],
            categories: ['short', 'rpg', 'original'],
            author: "Adjectivenouncombo",
            preview: "./img/games/BabyFatGames.jpg",
            image: "./img/games/BabyFatGames_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/dopeUvoJvE-pDQ"
        },
        {
            title: "Yulitide Sophia",
            description: "Тетрис с элементами набора веса. Больше счет - больше живот!",
            platform: "Windows",
            year: "2020",
            genres: ["Казуал", "Инди"],
            categories: ['short', 'arcade', 'original'],
            author: "Hexalt",
            preview: "./img/games/YulitideSophia.jpg",
            image: "./img/games/YulitideSophia_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/0fpYILQyhc5PQQ"
        },
        {
            title: "Love at first bite 18+",
            description: "Персонаж влюблен в : девушку выразительных форм. Как с неба полетели шоколадки. Поймай их всех! Скачивая эту игру, вы подтверждаете, что вам исполнилось 18 лет!",
            platform: "Windows",
            year: "2021",
            genres: ["Казуал", "Инди"],
            categories: ['short', 'arcade', 'original'],
            author: "lachevite",
            preview: "./img/games/Loveatfirstbite.jpg",
            image: "./img/games/YulitideSophia_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/DGxy7eMzixPVVg"
        },
        {
            title: "Overstuffed Overtime",
            description: "Вы работаете на фабрике, превращающей желе с помощью машины вкусов в съедобную вкусность. Рутина подходит к концу, когда к вам наведывается стажер, которую вы решаетесь накормить...",
            platform: "Windows",
            year: "2019",
            genres: ["Казуал", "Инди"],
            categories: ['short', 'arcade', 'original'],
            author: "lachevite",
            preview: "./img/games/Overstuffedovertime.jpg",
            image: "./img/games/Overstuffedovertime_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/LyXgPu6K5uHVlQ"
        },
        {
            title: "Fattaker",
            description: "Вы мечтаете о гореме из роскошных полных дьяволиц. Пройдите сложные головоломки, подбирайте правильно слова и следите, как ваша дьяволица растет как на дрожах!",
            platform: "Windows",
            year: "2021",
            genres: ["Квест", "Фан версия"],
            categories: ['short', 'rpg', 'fan'],
            author: "LazerCamel",
            preview: "./img/games/Fattaker.jpg",
            image: "./img/games/Fattaker_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/EfZPcESw9YGVSQ"
        },
        {
            title: "Feeder Fantasy",
            description: "Вы эльфийка, мечтающая раскормить добрую половину города, зная секреты Ауры набора веса. Впрочем, в этом стремлении вы будете не одиноки. Знание английского необходимо!",
            platform: "Windows",
            year: "2021",
            genres: ["Квест", "Инди версия"],
            categories: ['long', 'rpg', 'original'],
            author: "Fallboy",
            preview: "./img/games/FantasyFeeder.jpg",
            image: "./img/games/FantasyFeeder.jpg",
            downloadLink: "https://disk.yandex.ru/d/OM3irWOs1PYgAg"
        },
        {
            title: "Luciferpancakes",
            description: "Кормите демона блинчиками и следите за растущим животом. Избегайте огоньков!",
            platform: "Windows",
            year: "2021",
            genres: ["Аркада", "Инди"],
            categories: ['short', 'arcade', 'original'],
            author: "Blunder Jub",
            preview: "./img/games/LuciferPancakes.jpg",
            image: "./img/games/LuciferPancakes_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/8pto7uCpIeS7Fw"
        },
        {
            title: "MSDumplingdelivery",
            description: "Вы играете за милую пышку - курьера. Пройдите через множество препятствий и доставьте заказ!",
            platform: "Windows",
            year: "2019",
            genres: ["Квест", "Инди"],
            categories: ['short', 'rpg', 'original'],
            author: "grip5",
            preview: "./img/games/MsDumplingDelivery.jpg",
            image: "./img/games/MsDumplingDelivery_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/JzZbHGXmegzAdg"
        },
        {
            title: "DDLC - Monika's Special Day",
            description: "Фан версия игры DDLC, только с полненькой Моникой, приятной озвучкой в знакомом сеттинге!",
            platform: "Windows",
            year: "2018",
            genres: ["Квест", "Фан версия"],
            categories: ['long', 'rpg', 'fan'],
            author: "HighKalorie",
            preview: "./img/games/DDLC.jpg",
            image: "./img/games/DDLC_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/zJmqFOfEyGc2tg"
        },
    ];

    const grid = $('#gamesGrid');
    const modal = new bootstrap.Modal(document.getElementById('gameModal'));

    // Глобальные переменные для фильтра и поиска
    let currentFilter = 'all';
    let currentSearch = '';

    // Функция отрисовки карточек
    function renderGames() {
        grid.empty();

        // 1. Фильтрация по категориям
        let filtered = games;
        if (currentFilter !== 'all') {
            filtered = games.filter(game => game.categories.includes(currentFilter));
        }

        // 2. Поиск по названию (регистронезависимый)
        if (currentSearch.trim() !== '') {
            const searchLower = currentSearch.trim().toLowerCase();
            filtered = filtered.filter(game => game.title.toLowerCase().includes(searchLower));
        }

        if (filtered.length === 0) {
            grid.html(`
                <div class="col-12 text-center py-5">
                    <h5>Игры не найдены</h5>
                </div>
            `);
            return;
        }

        // Отрисовка карточек с сохранением исходного индекса
        filtered.forEach((game) => {
            const originalIndex = games.indexOf(game);
            const card = `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div class="card game-card" data-index="${originalIndex}">
                        <img src="${game.preview}" class="card-img-top" alt="${game.title}">
                        <div class="card-body">
                            <h5 class="card-title">${game.title}</h5>
                            <p class="card-text">${game.platform}, ${game.year}</p>
                        </div>
                    </div>
                </div>
            `;
            grid.append(card);
        });
    }

    // Обработчики кликов по кнопкам фильтра
    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');
        renderGames();
    });

    // === ЖИВОЙ ПОИСК (при вводе) ===
    $('#searchInput').on('input', function() {
        currentSearch = $(this).val();
        renderGames();
    });

    // === ПОИСК ПО НАЖАТИЮ ENTER ===
    $('#searchInput').on('keypress', function(e) {
        if (e.which === 13) {
            currentSearch = $(this).val();
            renderGames();
        }
    });

    // === ПОИСК ПО КЛИКУ НА ЛУПУ ===
    $('#searchButton').on('click', function() {
        currentSearch = $('#searchInput').val();
        renderGames();
    });

    // Открытие модального окна при клике на карточку
    grid.on('click', '.game-card', function() {
        const index = $(this).data('index');
        if (index === undefined) return;
        const game = games[index];
        if (!game) return;

        // Заполняем модалку
        $('#gameModalLabel').text(game.title);
        $('#modallinkImage').attr('href', game.image);
        if ($('#modallinkImage').length && typeof Fancybox !== 'undefined') {
            Fancybox.bind('#modallinkImage', {});
        }
        $('#modalImage').attr('src', game.image).attr('alt', game.title);
        $('#modalDescription').text(game.description);
        $('#modalPlatform').text(game.platform);
        $('#modalYear').text(game.year);
        $('#modalGenres').text(game.genres.join(', '));
        $('#modalAuthor').text(game.author);
        $('#modalDownloadLink').attr('href', game.downloadLink);

        modal.show();
    });

    // Первоначальная отрисовка всех игр
    renderGames();
});

// Вставка текущего года и начального года
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

// Скрытие прелоадера после полной загрузки страницы
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});