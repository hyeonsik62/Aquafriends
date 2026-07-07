document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       1. Show 섹션 (이미지 호버 및 클릭 탭)
       ========================================== */
    const showLists = document.querySelectorAll('.show_list_section > ul > li');
    const showImages = document.querySelectorAll('.show_image_section > img');

    if (showImages.length > 0) {
        showImages[0].classList.add('active');
    }

    showLists.forEach((list, index) => {
        list.addEventListener('mouseenter', () => changeImage(index));
        list.addEventListener('click', (e) => {
            e.preventDefault();
            changeImage(index);
        });
    });

    function changeImage(index) {
        showImages.forEach((img) => img.classList.remove('active'));
        if (showImages[index]) showImages[index].classList.add('active');
    }


    /* ==========================================
       2. Swiper 슬라이드 동기화 
       ========================================== */
    if (typeof Swiper !== 'undefined') {
        var textSwiper = new Swiper('.textSwiper', {
            direction: 'vertical',
            loop: true,
            autoplay: {
            delay: 3000, // 3초마다 자동 슬라이드
            disableOnInteraction: false, // 사용자 조작 후에도 자동 재생 유지
        },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });

        var imageSwiper = new Swiper('.imageSwiper', {
            direction: 'horizontal',
            loop: true,
            allowTouchMove: false,
        });

        textSwiper.controller.control = imageSwiper;
        imageSwiper.controller.control = textSwiper;
    }


    /* ==========================================
       3. 해파리 대화 및 잠금 해제 기능
       ========================================== */
    const dialogues = [
        "안녕! <br> 아쿠아프렌즈에 <br> 온 걸 환영해!",
        "나는 이곳의 관리자 <br>'젤리'야",
        "아래로 내려가서 <br> 아쿠아프렌즈에 대해 <br> 소개해줄게",
        "그럼 출발~"
    ];

    let currentDialogueIndex = 0;
    let isDialogueFinished = false;

    const arrowBtn = document.querySelector('.dialogue_arrow');
    const speechBubble = document.querySelector('.Outocean_jelly_speech_bubble');
    const dialogueText = document.querySelector('.dialogue_text');
    const inocean = document.getElementById('Inocean');
    const jellyImage = document.querySelector('.jelly_wrapper');

    // 1. 화살표 클릭 이벤트
    if (arrowBtn && speechBubble) {
        arrowBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (currentDialogueIndex < dialogues.length) {
                speechBubble.classList.add('active');
                dialogueText.innerHTML = dialogues[currentDialogueIndex];
                currentDialogueIndex++;
            } else {
                speechBubble.classList.remove('active');
                arrowBtn.style.display = 'none';
                isDialogueFinished = true;

                if (jellyImage) {
                    jellyImage.classList.add('animate__animated', 'animate__backOutDown');
                }

                setTimeout(() => {
                    window.scrollTo({
                        top: inocean.offsetTop,
                        behavior: 'smooth'
                    });
                }, 800);
            }
        });
    }

    /* ==========================================
       4. 🌟 강력한 풀페이지 스크롤 + 방어벽 잠금
       ========================================== */
    let isScrolling = false;

    // 1. 브라우저의 스크롤 위치 기억 기능 강제 종료 ('auto'를 'manual'로 변경)
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // 2. 페이지가 로드될 때 무조건 (0, 0) 좌표인 맨 위 메인 배너로 이동시킴
    window.addEventListener('load', function () {
        // 혹시 모를 딜레이를 방지하기 위해 setTimeout으로 한 번 더 확실하게 잡아줍니다.
        setTimeout(function () {
            window.scrollTo(0, 0);
        }, 10);
    });

    window.addEventListener('wheel', function (e) {
        const ocean = document.getElementById('Outocean');
        if (!ocean) return;

        const oceanTop = Math.round(ocean.offsetTop);
        const scrollTop = Math.round(window.scrollY);

        // 🌟 [절대 방어벽]: 대화가 안 끝났는데 Outocean 위치에 도달했거나 더 밑으로 가려고 할 때
        // (오차 범위를 넉넉하게 10px로 잡아서 절대 빠져나가지 못하게 합니다)
        if (!isDialogueFinished && scrollTop >= oceanTop - 10) {
            e.preventDefault(); // 스크롤 강제 정지

            // 위(탈출)로 가든 아래(뚫기)로 가든 무조건 Outocean 제자리로 강제 고정
            if (Math.abs(scrollTop - oceanTop) > 2) {
                window.scrollTo({ top: oceanTop });
            }
            return; // 여기서 로직 종료
        }

        // 🌟 [배너 ~ Outocean 간의 부드러운 스냅 이동]
        if (scrollTop < oceanTop + 10) {

            // 대화가 다 끝났고, Outocean에 있는데 밑으로 휠을 내린다면? 
            // -> 이때는 자유 스크롤 구역이므로 통과시킴!
            if (isDialogueFinished && Math.abs(scrollTop - oceanTop) <= 10 && e.deltaY > 0) {
                return;
            }

            e.preventDefault(); // 그 외에는 스냅을 위해 기본 스크롤 방지

            if (isScrolling) return;
            isScrolling = true;

            if (e.deltaY > 0) {
                // 내릴 때 -> Outocean으로 훅!
                window.scrollTo({ top: oceanTop, behavior: 'smooth' });
            } else {
                // 올릴 때 -> 배너로 훅!
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            setTimeout(() => { isScrolling = false; }, 800);
        }
    }, { passive: false });

});

document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("posterModal");
    const posterImg = document.getElementById("posterImage");
    const closeBtn = document.querySelector(".close_btn");
    const animalImages = document.querySelectorAll(".animal_box img");

    if (!modal || !posterImg || !closeBtn) {
        console.log("모달 요소를 찾을 수 없습니다. HTML 위치를 확인해주세요.");
        return;
    }

    animalImages.forEach(function (img) {
        img.addEventListener("click", function () {
            const animalName = this.alt;

            if (animalName === "Humboldt_penguin") {
                posterImg.src = "./images/Humboldt_penguin_Poster.png";
            } else if (animalName === "Ray") {
                posterImg.src = "./images/Pitted_stingray_Poster.png";
            } else if (animalName === "Zentoo_Penguin") {
                posterImg.src = "./images/Gentoo_penguin_poster.png";
            } else if (animalName === "Beluga") {
                posterImg.src = "./images/Beluga_Poster.png";
            } else if (animalName === "sudal") {
                posterImg.src = "./images/Sudal_Poster.png";
            }

            modal.style.display = "block";
        });
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

});

document.addEventListener("DOMContentLoaded", function () {

    // 1. scroll-effect 클래스가 붙은 '모든' 요소를 한 번에 싹 다 찾습니다.
    const animateElements = document.querySelectorAll('.scroll-effect');

    const options = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries, observerInstance) {
        entries.forEach(function (entry) {

            if (entry.isIntersecting) {
                // 🌟 핵심: HTML에 적어둔 data-animate 값(애니메이션 이름)을 읽어옵니다.
                const animationName = entry.target.getAttribute('data-animate');

                // 해당 요소에 기본 애니메이션 클래스와 읽어온 이름표 클래스를 같이 붙여줍니다.
                entry.target.classList.add('animate__animated', animationName);

                // 실행된 요소는 깜빡이지 않게 감시를 종료합니다.
                observerInstance.unobserve(entry.target);
            }

        });
    }, options);

    // 2. 찾은 요소들을 하나씩 꺼내서 전부 관찰자(Observer)에게 감시하라고 던져줍니다.
    animateElements.forEach(function (el) {
        observer.observe(el);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // 새로 만든 모바일 버튼과 모바일 서브메뉴를 찾습니다.
    const menuBtn = document.querySelector('.mobile_menu_btn');
    const mobileMenu = document.querySelector('.mobile_sub_menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // 버튼을 누를 때마다 모바일 메뉴창이 열렸다 닫혔다 합니다.
            mobileMenu.classList.toggle('active');
        });
    }
});