var myFullpage;

let mediaWrapper = document.getElementById("media-wrapper"),
    mediaText = document.getElementById("media-content"),
    media = document.createElement("video"),
    controlls = document.getElementById("media-controlls"),
    controllBtnPlay = document.createElement("div"),
    controllBtnMute = document.createElement("div"),
    playAnim = "",
    muteAnim = "",
    formates = ["webm", "mp4", "ogv"],
    filePath = "/videos/",
    fileName = "",
    hideMediaText = "",
    ranges = [];

controlls.append(controllBtnPlay);
controlls.append(controllBtnMute);

controllBtnPlay.classList.add("controll-btn");
controllBtnPlay.id = "controll-btn-play";

controllBtnMute.classList.add("controll-btn");
controllBtnMute.id = "controll-btn-mute";
controllBtnMute.addEventListener("click", muteSound, false);

BURGER.addEventListener("click", function() {
    // остановить видео при открытии меню
    if (media.paused == false) {
        setTimeout(function() {
            playAnim.playSegments([29, 44], true);
        }, 450);
        
        media.pause();
        
        clearTimeout(hideMediaText);
        
        $(mediaText).removeClass("media-content--hidden");
    }
}, false);

function loadVideo() {
    media.id = "myvideo";
    media.classList.add("fullscreen-bg__media");
    media.preload = "none";
    media.muted = false;
    media.loop = true;

    // for ios older 10 version
    media.setAttribute("playsinline", "");

    mediaWrapper.prepend(media);

    if (device.mobile()) {
        fileName = "mobile";
        media.poster = "/videos/mobile.jpg";
    } else if (device.tablet()) {
        if (screen.width >= 1024)  {
            fileName = "tabletWide";
            media.poster = "/videos/tabletWide.jpg";
        } else {
            fileName = "tablet";
            media.poster = "/videos/tablet.jpg";
        }
    } else if (device.desktop() && screen.width < 1400) {
        fileName = "smallDesktop";
        media.poster = "/videos/smallDesktop.jpg";
    } else {
        fileName = "desktop";
        media.poster = "/videos/desktop.jpg";
    }

    for (let i = 0; i < formates.length; i++) {
        var currentSource = document.createElement("source");
        currentSource.type = "video/" + formates[i];
        currentSource.src = window.location.origin + filePath + fileName + "." + formates[i] + "?nocache=" + new Date().getTime();
        media.appendChild(currentSource);
    }
}

function muteSound() {
    media.muted = !media.muted;

    muteAnim.loop = false;

    if (media.muted) {
        muteAnim.playSegments([49, 73], true);
    } else {
        muteAnim.playSegments([67, 83], true);
    }
}

function pauseVideo() {
    if (media.paused) {
        media.play();

        playAnim.playSegments([14, 28], false);

        // Задержка для установки события перемещения мыши или тача
        setTimeout(function(){
            mediaWrapper.addEventListener("mousemove", toggleMediaText, false);
        }, 300);

        // Скрыть текст после пуска, если не было движения мыши или тача
        hideMediaText = setTimeout(function () {
            $(mediaText).addClass("media-content--hidden");
        }, 1000);

    } else {
        media.pause();

        playAnim.playSegments([29, 44], false);

        clearTimeout(hideMediaText);
        mediaWrapper.removeEventListener("mousemove", toggleMediaText, false);
        
        $(mediaText).removeClass("media-content--hidden");
    }
}

function toggleMediaText() {
    clearTimeout(hideMediaText);

    $(mediaText).removeClass("media-content--hidden");

    if (media.paused == false) {
        hideMediaText = setTimeout(function () {
            $(mediaText).addClass("media-content--hidden");
        }, 5000);
    }
};

$(window).on('resize orientationchange', function () {
    setTimeout(function() {
        myFullpage.reBuild();
    }, 500);
});

window.onload = function () {
    setTimeout(function() {
        myFullpage = new fullpage("#fullpage", {
            autoScrolling: true,
            verticalCentered: true,
            bigSectionsDestination: "bottom",
            fixedElements: "#recaptcha, .grecaptcha-badge",
            normalScrollElements: "#recaptcha, .grecaptcha-badge",
            onLeave: function (origin, destination, direction) {
                // не менять слайды, если меню открыто
                if (BURGER.classList.contains("burger--active")) {
                    return false;
                }

                // если переход с видео, и видео воспроизведено, остановим его
                if (origin.index == 0 && media.paused == false) {
                    setTimeout(function () {
                        playAnim.playSegments([29, 44], false);
                        media.pause();
                        clearTimeout(hideMediaText);
                        $(mediaText).removeClass("media-content--hidden");
                    }, 900);
                }
            },
            afterRender: function() {
                swiper.init();
                loadVideo();
                scrollLock.enablePageScroll();
            }
        });

        // объявление прогресс бара для кнопки play
        var controllPlay = new ProgressBar.Circle("#" + controllBtnPlay.id, {
            strokeWidth: 3,
            color: "#FFF",
            easing: 'easeOut',
            svgStyle: {
                cursor: "pointer",
                height: "100%",
            },
            text: {
                value: '0',
                style: {
                    display: "none"
                }
            }
        });

        controllPlay.svg.id = "play-button__progressbar";

        // анимация прогресс бара, у кнопки play
        controllPlay.animate(1, {
            duration: 2500,
        }, function() {
            controllBtnPlay.addEventListener("click", pauseVideo, false);
            
            // объяление анимации кнопки play/pause lottie.js
            playAnim = bodymovin.loadAnimation({
                container: document.getElementById(controllBtnPlay.id),
                renderer: "svg",
                loop: false,
                autoplay: false,
                autoloadSegments: true,
                path: "../playpause.json",
                rendererSettings: {
                    className: "animation-play"
                }
            });

            // проиграть все фреймы
            playAnim.goToAndStop(46, true);

            // перейти к первому состоянию
            playAnim.playSegments([0, 13], false);
        });

        // Controll Mute
        muteAnim = bodymovin.loadAnimation({
            container: controllBtnMute,
            renderer: "svg",
            loop: true,
            autoplay: false,
            autoloadSegments: true,
            path: "../sound.json",
        });

        // проиграть все фреймы
        muteAnim.goToAndStop(83, true);

        // перейти к пульсирующему состоянию
        muteAnim.playSegments([8, 51], false);

        // если звук включен, то запустить анимацию динамика
        muteAnim.addEventListener("complete", function() {
            if (media.muted == false) {
                muteAnim.loop = true;
                muteAnim.playSegments([8, 51], false);
            }
        }, false);

        if (device.desktop() == false) {
            for (let i = 0; i < swiper.slides.length; i++) {
                swiper.slides[i].onclick = function() {
                    if (swiper.slides[i].classList.contains("active")) {
                        swiper.slides[i].classList.remove("active");
                    } else {
                        swiper.slides[i].classList.add("active");
                    }
                };
            }
        }

        $('#fader').fadeOut(1000);

        // Возможно поможет в Safari ios
        myFullpage.reBuild();
    }, 500);
}

var swiper = new Swiper('.swiper-container', {
    init: false,
    freeMode: true,
    freeModeSticky: true,
    slidesPerView: 4,
    spaceBetween: 0,
    breakpoints: {
        680: {
            slidesPerView: 1,
        },
        1023: {
            slidesPerView: 2,
        },
        1366: {
            slidesPerView: 3,
            spaceBetween: 0,
        }
    },
    on: {
        slideChange: function() {
            swiper.slides[swiper.previousIndex].classList.remove("active");
        }
    }
});

// Drag & move scroll in section "Constacts"

$(function(){
    const slider = document.getElementById("contacts-wrapper");
    let isDown = false,
        startX,
        scrollLeft;

    slider.addEventListener("mousedown", (e) => {
        isDown = true;
        slider.classList.add("grabbable");
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("touchstart", (e) => {
        isDown = true;
        slider.classList.add("grabbable");
        startX = e.changedTouches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.classList.remove("grabbable");
    });

    slider.addEventListener("touchend", () => {
        isDown = false;
        slider.classList.remove("grabbable");
    });

    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;

        e.preventDefault();
        
        let x = e.pageX - slider.offsetLeft;
        let move = (x - startX) * 2.5;

        TweenMax.to(slider, .5, {
			scrollLeft: scrollLeft - move
        });
    });

    slider.addEventListener("touchmove", (e) => {
        if (!isDown) return;

        e.preventDefault();
        
        let x = e.changedTouches[0].pageX - slider.offsetLeft;
        let move = (x - startX) * 2;
        
        TweenMax.to(slider, .5, {
			scrollLeft: scrollLeft - move
        });
    });
});