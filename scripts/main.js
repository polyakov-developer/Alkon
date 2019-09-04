const HTML = document.querySelector("html");
const BODY = document.body;
const HEADER = document.getElementById("header");
const BURGER = document.getElementById("burger");
const NAVIGATION = document.querySelector("#header .navigation");

BURGER.addEventListener("click", debounce(function() {
    if (BURGER.classList.contains("burger--active")) {
        BURGER.classList.remove("burger--active");
        BURGER.classList.add("burger--unactive");
        NAVIGATION.classList.remove("navigation--visible");
        scrollLock.enablePageScroll();
    } else {
        BURGER.classList.remove("burger--unactive");
        BURGER.classList.add("burger--active");
        NAVIGATION.classList.add("navigation--visible");
        scrollLock.disablePageScroll();
    }
}, 250), false);

let popupVideo = $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    disableOn: 420,
});

function debounce(f, ms) {
    let timer = null;

    return function (...args) {
        const onComplete = () => {
            f.apply(this, args);
            timer = null;
        }

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(onComplete, ms);
    }
}

// --- Наведение на элементы меню
$(".navigation ul").hover(function () {
    $(".navigation ul li a").css({
        opacity: "0.2",
        color: "#FFFFFF"
    });
}, function () {
    $(".navigation ul li a").css({
        opacity: "1",
        color: "#FFFFFF"
    });
});

// --- Для получения координат курсора мыши
window.onload = function () {
    let pageHeight = window.innerHeight,
        topPage = pageHeight / 100 * 35,
        middlePage = topPage + (pageHeight / 100 * 30),
        bottomPage = pageHeight / 100 * 35;

    let locationRange = {
        top: {
            from: 0,
            to: topPage
        },
        middle: {
            from: topPage,
            to: middlePage,
        },
        bottom: {
            from: middlePage,
            to: bottomPage,
        }
    };

    $('#fader').fadeOut(1000);
}