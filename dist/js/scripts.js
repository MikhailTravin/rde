function initTabs() {
  const tabsBlocks = document.querySelectorAll('[data-tabs]');

  tabsBlocks.forEach(tabsBlock => {
    const titles = tabsBlock.querySelectorAll('[data-tabs-title]');
    const contents = tabsBlock.querySelectorAll('[data-tabs-body] .tabs__body');

    // Установить начальное состояние: показываем первый активный таб
    contents.forEach((content, index) => {
      content.hidden = !titles[index].classList.contains('_tab-active');
    });

    // Назначаем обработчики кликов на заголовки
    titles.forEach((title, index) => {
      title.addEventListener('click', () => {
        if (!title.classList.contains('_tab-active')) {
          // Удаляем активный класс у всех
          titles.forEach(t => t.classList.remove('_tab-active'));
          // Скрываем все контенты
          contents.forEach(c => c.hidden = true);

          // Добавляем активный класс текущему
          title.classList.add('_tab-active');
          // Показываем соответствующий контент
          contents[index].hidden = false;
        }
      });
    });
  });
}

initTabs();

Fancybox.bind("[data-fancybox]", {
  // опции
});

if (document.querySelector('.block-inner__slider')) {
  const swiperInner = new Swiper('.block-inner__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 400,
    effect: 'fade',
    autoplay: {
      delay: 15000,
      disableOnInteraction: false,
    },
  });
}

if (document.querySelector('.block-reviews__slider')) {
  const swiper = new Swiper('.block-reviews__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 2,
    spaceBetween: 30,
    speed: 400,
    loop: true,
    lazy: true,

    pagination: {
      el: '.block-reviews__dotts',
      type: 'custom',
      renderCustom: function (swiper, current, total) {
        const pad = (num) => num < 10 ? '0' + num : num.toString();

        document.querySelector('.block-reviews__current').textContent = pad(current);
        document.querySelector('.block-reviews__all').textContent = pad(total);

        let bulletsHTML = '';
        for (let i = 1; i <= total; i++) {
          bulletsHTML += `<span class="swiper-pagination-bullet ${i === current ? 'swiper-pagination-bullet-active' : ''}" data-index="${i}"></span>`;
        }

        return bulletsHTML;
      }
    },

    navigation: {
      prevEl: '.block-reviews__arrow-prev',
      nextEl: '.block-reviews__arrow-next',
    },

    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 15,
      },
      1200: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    },
  });

  // --- КЛИК ПО БУЛЛЕТАМ ---
  document.querySelector('.block-reviews__dotts').addEventListener('click', function (e) {
    if (e.target.classList.contains('swiper-pagination-bullet')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      swiper.slideToLoop(index - 1); // <-- ВАЖНО! Используем slideToLoop()
    }
  });

  // --- ОБНОВЛЕНИЕ АКТИВНОГО БУЛЛЕТА ПРИ СМЕНЕ СЛАЙДА ---
  swiper.on('slideChange', () => {
    const bullets = document.querySelectorAll('.swiper-pagination-bullet');
    const realCurrent = swiper.realIndex + 1;

    bullets.forEach((bullet, i) => {
      bullet.classList.toggle('swiper-pagination-bullet-active', i + 1 === realCurrent);
    });
  });
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function spollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    }));
    if (spollersRegular.length) initSpollers(spollersRegular);
    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_spoller-init");
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener("click", setSpollerAction);
        } else {
          spollersBlock.classList.remove("_spoller-init");
          initSpollerBody(spollersBlock, false);
          spollersBlock.removeEventListener("click", setSpollerAction);
        }
      }));
    }
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
      if (spollerTitles.length) {
        spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
        spollerTitles.forEach((spollerTitle => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            spollerTitle.nextElementSibling.hidden = false;
          }
        }));
      }
    }
    function setSpollerAction(e) {
      const el = e.target;
      if (el.closest("[data-spoller]")) {
        const spollerTitle = el.closest("[data-spoller]");
        const spollersBlock = spollerTitle.closest("[data-spollers]");
        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
        if (!spollersBlock.querySelectorAll("._slide").length) {
          if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
          spollerTitle.classList.toggle("_spoller-active");
          _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
        }
        e.preventDefault();
      }
    }
    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
      if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
        spollerActiveTitle.classList.remove("_spoller-active");
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
      }
    }
    const spollersClose = document.querySelectorAll("[data-spoller-close]");
    if (spollersClose.length) document.addEventListener("click", (function (e) {
      const el = e.target;
      if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
        const spollersBlock = spollerClose.closest("[data-spollers]");
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
        spollerClose.classList.remove("_spoller-active");
        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
      }));
    }));
  }
}
spollers()