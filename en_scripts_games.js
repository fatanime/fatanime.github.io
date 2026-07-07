// Disable automatic scroll restoration by the browser
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
// Scroll to top when page is fully loaded
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// Immediately invoked function to avoid polluting global scope
(function hideScrollbar() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
        /* For WebKit (Chrome, Safari, Edge Chromium, Opera) */
        ::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
            background: transparent !important;
        }

        /* For Firefox */
        html {
            scrollbar-width: none !important;
        }

        /* For Internet Explorer and older Edge */
        body {
            -ms-overflow-style: none !important;
        }

        /* Additional: always enable vertical scroll to avoid content jumps */
        html {
            overflow-y: scroll;
        }
        body {
            overflow-y: scroll;
        }
    `;
    document.head.appendChild(style);
})();

// Burger menu handling (for animation)
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
    if ($(window).scrollTop() > 100) { // threshold, e.g., 50px
        $('.navbar').addClass('navbar--scroll');
    } else {
        $('.navbar').removeClass('navbar--scroll');
    }
});
// ========== UPDATE ACTIVE MENU ITEM ON SCROLL ==========
function updateActiveMenuItem() {
    var scrollPosition = $(window).scrollTop();
    var windowHeight = $(window).height();
    var offset = 100; // small offset to account for menu height

    // Loop through all sections with an id
    $('.game_section[id]').each(function() {
        var section = $(this);
        var sectionTop = section.offset().top - offset;
        var sectionBottom = sectionTop + section.outerHeight();

        // If current scroll position is within the section (with menu offset)
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            var targetId = section.attr('id');
            // Find the corresponding menu item
            var menuLink = $('.navbar-menu__item-link[href="#' + targetId + '"]');
            // Remove class from all items
            $('.navbar-menu__item-link').removeClass('navbar-menu__item-link--scroll active');
            // Add class to the current one
            if (menuLink.length) {
                menuLink.addClass('navbar-menu__item-link--scroll active');
            }
        }
    });
}

// Call on scroll (with optimization via requestAnimationFrame or throttle)
var scrollTimeout;
$(window).on('scroll', function() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function() {
        updateActiveMenuItem();
    });
});

// Call on load and resize
$(window).on('load resize', function() {
    updateActiveMenuItem();
});

// Also update on menu item click (before transition, but after scroll)
$('.navbar-menu__item-link[href^="#"]').on('click', function(e) {
    e.preventDefault();
    var targetId = $(this).attr('href'); // e.g. "#games"
    var targetSection = $(targetId);
    if (targetSection.length) {
        // Smooth scroll to the section accounting for menu height (so it isn't covered)
        var menuHeight = $('.navbar').outerHeight() || 0;
        var targetOffset = targetSection.offset().top - menuHeight - 10;
        $('html, body').animate({
            scrollTop: targetOffset
        }, 400, function() {
            // After animation completes, update active item
            updateActiveMenuItem();
        });
        // Also update immediately so the item highlights before animation finishes
        $('.navbar-menu__item-link').removeClass('navbar-menu__item-link--scroll active');
        $(this).addClass('navbar-menu__item-link--scroll active');
    }
});
// Draggable carousel
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

// ========== GENERATE CARDS, FILTER, SEARCH AND MODAL ==========
$(document).ready(function() {

    // Game array (extended)
    const games = [
        {
            title: "Fattening",
            description: "You find yourself in a house with a ghost. But not quite an ordinary one... Your task is to survive and complete the entire story.",
            platform: "Windows",
            year: "2018",
            genres: ["Arcade", "Horror", "Original"],
            categories: ['short', 'arcade', 'original'],
            author: "j8867bbw",
            preview: "./img/games/fattening.jpg",
            image: "./img/games/fattening.jpg",
            downloadLink: "https://disk.yandex.ru/d/eSH_izgeYLNTrg"
        },
        {
            title: "Star Meadow",
            description: "Collect all the stars without getting caught. But remember, the more stars you collect, the harder it gets to move.",
            platform: "Windows",
            year: "2019",
            genres: ["Arcade", "Original"],
            categories: ['short', 'arcade', 'original'],
            author: "Susfishous",
            preview: "./img/games/star.jpg",
            image: "./img/games/star_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/CvAYr4x9P7MdcA"
        },
        {
            title: "Walk with frog wife",
            description: "A Wild West cowboy and his wife, a frog‑human hybrid. She also shoves anything she finds into her mouth, so your job is to clear her path of everything that isn't an insect.",
            platform: "Windows",
            year: "2021",
            genres: ["Arcade", "Rail Shooter", "Indie"],
            categories: ['short', 'arcade', 'original'],
            author: "Burger Kurger",
            preview: "./img/games/WalkwithFrogWife.jpg",
            image: "./img/games/WalkwithFrogWife_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/XLyULHflJ_SwXg"
        },
        {
            title: "Space Eater Force",
            description: "A space shooter where buns drop from destroyed enemy ships. You will gradually fatten up the main heroine alone, or also fatten up her friends.",
            platform: "Windows",
            year: "2019",
            genres: ["Arcade", "Shooter", "Indie"],
            categories: ['long', 'arcade', 'original'],
            author: "uajaka",
            preview: "./img/games/SpaceEaterForce.jpg",
            image: "./img/games/SpaceEaterForce_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/RjTnp2YWCa9cBw"
        },
        {
            title: "FattFatt",
            description: "The main character falls into a world made entirely of food. Her task is to get out and not get too fat...",
            platform: "Windows",
            year: "2018",
            genres: ["Arcade", "Indie"],
            categories: ['short', 'arcade', 'original'],
            author: "j8867bbw",
            preview: "./img/games/FattFatt.jpg",
            image: "./img/games/FattFatt.jpg",
            downloadLink: "https://disk.yandex.ru/d/d0F7bu_KzXyyOw"
        },
        {
            title: "Feeding Lila",
            description: "Lila falls into the clutches of a monster that makes her gain weight in seconds. Your task is to balance the indicators, not letting them overflow from time to time.",
            platform: "Windows",
            year: "2019",
            genres: ["Arcade", "Indie"],
            categories: ['short', 'arcade', 'original'],
            author: "RounderSofter",
            preview: "./img/games/FeedingLila.jpg",
            image: "./img/games/FeedingLila_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/NQ1b7ilYeHUQow"
        },
        {
            title: "Culinary Combat",
            description: "A certain Miss Taraban receives an invitation to a chef position. They say it's all about her ultra‑calorie food...",
            platform: "Windows",
            year: "2019",
            genres: ["Arcade", "Indie"],
            categories: ['short', 'arcade', 'original'],
            author: "sometimescozy",
            preview: "./img/games/CulinaryCombat.jpg",
            image: "./img/games/CulinaryCombat_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/LytOO_Fg4fwrJg"
        },
        {
            title: "Food Fighter Hansa GIB",
            description: "You are the fairy Hansa and your task is to make it to the festival. But trouble strikes: the magical forest is overrun by goblins. Good thing there's plenty of strawberries, though they make Hansa gain weight quickly...",
            platform: "Windows",
            year: "2018",
            genres: ["RPG", "Indie"],
            categories: ['short', 'rpg', 'original'],
            author: "Omega-8 Fatty Acid",
            preview: "./img/games/FoodFighterHansaGJB.jpg",
            image: "./img/games/FoodFighterHansaGJB_full.jpg",
            downloadLink: "https://yadi.sk/d/njxt0xPrF0b8Aw"
        },
        {
            title: "Amoeblaster",
            description: "Match four in a row and the character's chest will grow – simple! Just don't get thrown off by the increasing tempo and difficulty.",
            platform: "Windows",
            year: "2019",
            genres: ["Casual", "Indie"],
            categories: ['short', 'arcade', 'original'],
            author: "Burger Kurger",
            preview: "./img/games/Amoeblaster.jpg",
            image: "./img/games/Amoeblaster_full.jpg",
            downloadLink: "https://yadi.sk/d/uLb8F-70tZu-gQ"
        },
        {
            title: "Five Nights with Fatties 18+",
            description: "A parody of FNAF, but instead of the usual animatronics, there are full‑bodied female robots...",
            platform: "Windows",
            year: "2020",
            genres: ["Horror", "Quest", "Fan Version"],
            categories: ['long', 'rpg', 'fan'],
            author: "Poppu",
            preview: "./img/games/FNWF.jpg",
            image: "./img/games/FNWF_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/LoxdIbKConsc_A"
        },
        {
            title: "Lickety Split",
            description: "You are an ice cream vendor, but your product has a curious feature: it makes people gain weight fast.",
            platform: "Windows",
            year: "2020",
            genres: ["Casual", "Indie"],
            categories: ['short', 'arcade', 'original'],
            author: "Jakethesnake0101",
            preview: "./img/games/LicketySplit.jpg",
            image: "./img/games/LicketySplit_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/IIdoBBI4Qururw"
        },
        {
            title: "Feed the crown",
            description: "You are a simple knight who has been honoured to feed the queen with the food you find for three days after difficult raids into the enemy castle. The more food you bring, the fatter she gets...",
            platform: "Windows",
            year: "2021",
            genres: ["Platformer", "Indie"],
            categories: ['short', 'arcade', 'original'],
            author: "SofterCode",
            preview: "./img/games/FeedtheCrown.jpg",
            image: "./img/games/FeedtheCrown_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/sI-qwrsmw8vNHQ"
        },
        {
            title: "Baby Fat Games 18+",
            description: "You are a nameless hero hired by Zoe's mother to be her nanny. Zoe is quite an unusual girl, as you will soon find out... By downloading this set of games, you confirm that you are 18 years of age or older!",
            platform: "Windows",
            year: "2020",
            genres: ["Quest", "Vore", "Indie"],
            categories: ['short', 'rpg', 'original'],
            author: "Adjectivenouncombo",
            preview: "./img/games/BabyFatGames.jpg",
            image: "./img/games/BabyFatGames_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/dopeUvoJvE-pDQ"
        },
        {
            title: "Yulitide Sophia",
            description: "Tetris with weight‑gain elements. More score – more belly!",
            platform: "Windows",
            year: "2020",
            genres: ["Casual", "Indie"],
            categories: ['short', 'arcade', 'original'],
            author: "Hexalt",
            preview: "./img/games/YulitideSophia.jpg",
            image: "./img/games/YulitideSophia_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/0fpYILQyhc5PQQ"
        },
        {
            title: "Love at first bite 18+",
            description: "The character is in love with a girl of ample curves. Suddenly chocolate bars start falling from the sky. Catch them all! By downloading this game, you confirm that you are 18 years of age or older!",
            platform: "Windows",
            year: "2021",
            genres: ["Casual", "Indie"],
            categories: ['short', 'arcade', 'original'],
            author: "lachevite",
            preview: "./img/games/Loveatfirstbite.jpg",
            image: "./img/games/YulitideSophia_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/DGxy7eMzixPVVg"
        },
        {
            title: "Overstuffed Overtime",
            description: "You work at a factory that turns jelly into edible treats using a flavour machine. The routine is nearing its end when a trainee drops by and you decide to feed her...",
            platform: "Windows",
            year: "2019",
            genres: ["Casual", "Indie"],
            categories: ['short', 'arcade', 'original'],
            author: "lachevite",
            preview: "./img/games/Overstuffedovertime.jpg",
            image: "./img/games/Overstuffedovertime_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/LyXgPu6K5uHVlQ"
        },
        {
            title: "Fattaker",
            description: "You dream of a harem of luxurious full‑figured she‑devils. Solve difficult puzzles, choose the right words, and watch your she‑devil grow like yeast!",
            platform: "Windows",
            year: "2021",
            genres: ["Quest", "Fan Version"],
            categories: ['short', 'rpg', 'fan'],
            author: "LazerCamel",
            preview: "./img/games/Fattaker.jpg",
            image: "./img/games/Fattaker_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/EfZPcESw9YGVSQ"
        },
        {
            title: "Feeder Fantasy",
            description: "You are an elf who dreams of fattening up half the city, knowing the secrets of the Aura of Weight Gain. However, you won't be alone in this pursuit. Knowledge of English is required!",
            platform: "Windows",
            year: "2021",
            genres: ["Quest", "Indie Version"],
            categories: ['long', 'rpg', 'original'],
            author: "Fallboy",
            preview: "./img/games/FantasyFeeder.jpg",
            image: "./img/games/FantasyFeeder.jpg",
            downloadLink: "https://disk.yandex.ru/d/OM3irWOs1PYgAg"
        },
        {
            title: "Luciferpancakes",
            description: "Feed the demon pancakes and watch his belly grow. Avoid the fireballs!",
            platform: "Windows",
            year: "2021",
            genres: ["Arcade", "Indie"],
            categories: ['short', 'arcade', 'original'],
            author: "Blunder Jub",
            preview: "./img/games/LuciferPancakes.jpg",
            image: "./img/games/LuciferPancakes_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/8pto7uCpIeS7Fw"
        },
        {
            title: "MSDumplingdelivery",
            description: "You play as a cute chubby courier. Make your way through numerous obstacles and deliver the order!",
            platform: "Windows",
            year: "2019",
            genres: ["Quest", "Indie"],
            categories: ['short', 'rpg', 'original'],
            author: "grip5",
            preview: "./img/games/MsDumplingDelivery.jpg",
            image: "./img/games/MsDumplingDelivery_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/JzZbHGXmegzAdg"
        },
        {
            title: "DDLC - Monika's Special Day",
            description: "A fan version of DDLC, but with a plump Monika, pleasant voice acting, and a familiar setting!",
            platform: "Windows",
            year: "2018",
            genres: ["Quest", "Fan Version"],
            categories: ['long', 'rpg', 'fan'],
            author: "HighKalorie",
            preview: "./img/games/DDLC.jpg",
            image: "./img/games/DDLC_full.jpg",
            downloadLink: "https://disk.yandex.ru/d/zJmqFOfEyGc2tg"
        },
    ];

    const grid = $('#gamesGrid');
    const modal = new bootstrap.Modal(document.getElementById('gameModal'));

    // Global variables for filter and search
    let currentFilter = 'all';
    let currentSearch = '';

    // Function to render cards
    function renderGames() {
        grid.empty();

        // 1. Filter by categories
        let filtered = games;
        if (currentFilter !== 'all') {
            filtered = games.filter(game => game.categories.includes(currentFilter));
        }

        // 2. Search by title (case‑insensitive)
        if (currentSearch.trim() !== '') {
            const searchLower = currentSearch.trim().toLowerCase();
            filtered = filtered.filter(game => game.title.toLowerCase().includes(searchLower));
        }

        if (filtered.length === 0) {
            grid.html(`
                <div class="col-12 text-center py-5">
                    <h5>No games found</h5>
                </div>
            `);
            return;
        }

        // Render cards preserving original index
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

    // Filter button click handlers
    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');
        renderGames();
    });

    // === LIVE SEARCH (on input) ===
    $('#searchInput').on('input', function() {
        currentSearch = $(this).val();
        renderGames();
    });

    // === SEARCH ON ENTER KEY ===
    $('#searchInput').on('keypress', function(e) {
        if (e.which === 13) {
            currentSearch = $(this).val();
            renderGames();
        }
    });

    // === SEARCH ON MAGNIFYING GLASS CLICK ===
    $('#searchButton').on('click', function() {
        currentSearch = $('#searchInput').val();
        renderGames();
    });

    // Open modal on card click
    grid.on('click', '.game-card', function() {
        const index = $(this).data('index');
        if (index === undefined) return;
        const game = games[index];
        if (!game) return;

        // Fill modal
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

    // Initial render of all games
    renderGames();
});

// Insert current year and start year
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

// Hide preloader after full page load
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});