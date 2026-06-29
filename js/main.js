(function($) {
    "use strict";
    
    /*--
     Menu Sticky
     -----------------------------------*/
     $(window).on('scroll',function() {    
        var scroll = $(window).scrollTop();
        if (scroll < 245) { 
            $(".sticker").removeClass("stick");
        }else{
            $(".sticker").addClass("stick");
        }
    });

    /*--
     One Page Menu
     -----------------------------------*/
     var TopOffsetId = $('.header-area').height() - -50;
     $('#main-menu nav').onePageNav({
        currentClass: 'active',
        scrollThreshold: 0.2,
        scrollSpeed: 1000,
        scrollOffset: TopOffsetId,
    });


    /*--
    Bootstrap Menu Fix For Mobile
    -----------------------------------*/
    $(document).on('click', '.navbar-collapse.in', function(e) {
        if ($(e.target).is('a')) {
            $(this).collapse('hide');
        }
    });
    
    
    /* imagesLoaded & isotope active  */
    $('.grid').imagesLoaded(function() {
        // filter items on button click
        $('.portfolio-menu').on('click', 'button', function() {
            var filterValue = $(this).attr('data-filter');
            $grid.isotope({
                filter: filterValue
            });
        });
        // init Isotope
        var $grid = $('.grid').isotope({
            itemSelector: '.grid-item',
            percentPosition: true,
            masonry: {
                // use outer width of grid-sizer for columnWidth
                columnWidth: '.grid-item',
            }
        });
    });
    
    /* portfolio menu active  */
    $('.portfolio-menu button').on('click', function(event) {
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
        event.preventDefault();
    });
    
    
    /* slider active  */
    $('.slider-active').owlCarousel({
        loop: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        loop:true,
        autoplay:true,
        autoplayTimeout:7000,
        items: 1,
        dots: true,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })
    
    
    /* testimonial active  */
    $('.testimonial-active').owlCarousel({
        loop: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        dots: true,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })
    
    
    /* blog active  */
    $('.blog-active').owlCarousel({
        loop: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        dots: false,
        nav: true,
        navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    })
    
    
    /*----------------------------
    wow js active
    ------------------------------ */
    new WOW().init(); 
    
    
    
    
    /*--
    Magnific Popup
    ------------------------*/
    $('.img-poppu').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });
    
    
    /*--
    Smooth Scroll
    -----------------------------------*/
    $('.scroll-down').on('click', function(e) {
        e.preventDefault();
        var link = this;
        $.smoothScroll({
            offset: -80,
            scrollTarget: link.hash
        });
    });
    
    
    /*-------------------------------------------
    	03. scrollUp jquery active
        --------------------------------------------- */
        $.scrollUp({
            scrollText: '<i class="fa fa-angle-up"></i>',
            easingType: 'linear',
            scrollSpeed: 900,
            animation: 'fade'
        });



    /*--------------------------
    counterUp
    ---------------------------- */	
    $('.count').counterUp({
        delay: 10,
        time: 5000
    }); 
    
    
    
    
    


})(jQuery);


/*  gallery */
$(document).ready(function(){

    $(".filter-button").click(function(){
        var value = $(this).attr('data-filter');
        
        if(value == "all")
        {
            $('.filter').show('1000');
        }
        else
        {
            $(".filter").not('.'+value).hide('3000');
            $('.filter').filter('.'+value).show('3000');
            
        }

        if ($(".filter-button").removeClass("active")) {
            $(this).removeClass("active");
        }
        $(this).addClass("active");
    });
});
/*  end gallery */

$(document).ready(function(){
    $(".fancybox").fancybox({
        openEffect: "none",
        closeEffect: "none"
    });
});

let card_1 = document.querySelector(".card-1");
let card_2 = document.querySelector(".card-2");
let card_3 = document.querySelector(".card-3");
let card_4 = document.querySelector(".card-4");
let card_5 = document.querySelector(".card-5");
let card_6 = document.querySelector(".card-6");
let card_7 = document.querySelector(".card-7");
let card_8 = document.querySelector(".card-8");
let card_9 = document.querySelector(".card-9");
let card_10 = document.querySelector(".card-10");
let card_11 = document.querySelector(".card-11");
let card_12 = document.querySelector(".card-12");
let card_13 = document.querySelector(".card-13");
let card_14 = document.querySelector(".card-14");
let card_15 = document.querySelector(".card-15");
let card_16 = document.querySelector(".card-16");
let card_17 = document.querySelector(".card-17");
let card_18 = document.querySelector(".card-18");
let card_19 = document.querySelector(".card-19");
let card_20 = document.querySelector(".card-20");
let card_21 = document.querySelector(".card-21");
let card_22 = document.querySelector(".card-22");
var playing = false;

card_1.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_1,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_2.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_2,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_3.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_3,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_4.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_4,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_5.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_5,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_6.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_6,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_7.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_7,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_8.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_8,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_9.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_9,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_10.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_10,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_11.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_11,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_12.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_12,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_13.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_13,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_14.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_14,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_15.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_15,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_16.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_16,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_17.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_17,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_18.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_18,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_19.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_19,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_20.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_20,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});

card_21.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_21,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});
card_22.addEventListener('click',function() {
  if(playing)
    return;

playing = true;
anime({
    targets: card_22,
    scale: [{value: 1}, {value: 1.1}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
     playing = false;
 }
});
});