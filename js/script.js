document.addEventListener("DOMContentLoaded", () => {
   const body = document.body;
   const headerHeight = document.querySelector(".header").offsetHeight;

   // ================ Плавний скрол до секцій ===================
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
         e.preventDefault();

         const target = document.querySelector(this.getAttribute('href'));
         if (!target) return;

         const targetPosition = target.getBoundingClientRect().top + window.scrollY;

         window.scrollTo({
            top: targetPosition - headerHeight,
            behavior: "smooth",
         });
      });
   });

   // ============= Блокування скролу ==================
   function toggleBodyLock(state) {
      if (state) {
         body.classList.add("lock");
      } else {
         body.classList.remove("lock");
      }
   }

   // ============= Управління блоком деталей у "services" =============
   const detailSections = document.querySelectorAll(".details");
   const btnsMore = document.querySelectorAll(".btn");

   btnsMore.forEach(btn => {
      btn.addEventListener("click", (e) => {
         e.preventDefault();

         detailSections.forEach(section => section.classList.remove("visible", "animate"));

         const targetId = btn.getAttribute("data-target");
         const targetSection = document.querySelector(targetId);

         if (targetSection) {
            // Завантажуємо зображення при відкритті секції
            loadImages(targetSection);

            targetSection.classList.add("visible");
            setTimeout(() => targetSection.classList.add("animate"), 10);
            toggleBodyLock(true);
         }
      });
   });

   detailSections.forEach(section => {
      const closeBtn = section.querySelector(".details__close");
      if (closeBtn) {
         closeBtn.addEventListener("click", () => {
            section.classList.remove("animate");
            section.addEventListener("transitionend", () => {
               section.classList.remove("visible");
               toggleBodyLock(false);
            }, { once: true });
         });
      }
   });



   // ============= Функція для завантаження зображень в details з використанням IntersectionObserver =============

   function loadImages(section) {
      const images = section.querySelectorAll("img[data-src]");

      const observer = new IntersectionObserver((entries, observer) => {
         entries.forEach(entry => {
            if (entry.isIntersecting) {
               // Завантажуємо зображення
               const img = entry.target;
               img.src = img.getAttribute("data-src");
               img.removeAttribute("data-src");
               observer.unobserve(img); // Зупиняємо спостереження за цим зображенням
            }
         });
      }, { threshold: 0.1 }); // 10% зображення мають бути видимі для активації

      images.forEach(img => {
         observer.observe(img);
      });
   }

   // ============= Галерея: відкриття фото на весь екран =============

   document.querySelectorAll(".gallery-item").forEach(item => {
      item.addEventListener("click", () => {
         // Видаляємо попереднє зображення, якщо воно є
         document.querySelector(".fullscreen-clone")?.remove();
         document.querySelector(".fullscreen-overlay")?.remove();

         // Створюємо елемент overlay і клон зображення
         const overlay = document.createElement("div");
         overlay.classList.add("fullscreen-overlay");

         const clone = item.cloneNode(true);
         clone.classList.add("fullscreen-clone");

         // Додаємо overlay та клон на сторінку
         document.body.append(overlay, clone);

         // Плавне появлення
         setTimeout(() => {
            overlay.classList.add("fullscreen-active");
            clone.classList.add("fullscreen-active");
         }, 10);

         // Закриття по кліку
         [overlay, clone].forEach(el => el.addEventListener("click", () => {
            overlay.classList.remove("fullscreen-active");
            clone.classList.remove("fullscreen-active");
            setTimeout(() => {
               overlay.remove();
               clone.remove();
            }, 300);
         }));
      });
   });

   // ============= Навігація меню =============
   const sections = document.querySelectorAll("section");
   const navLinks = document.querySelectorAll(".header__menu a");

   function setActiveSection() {
      let index = sections.length;
      while (--index && window.scrollY + headerHeight + 1 < sections[index].offsetTop) { }

      navLinks.forEach(link => link.classList.remove("active"));
      if (navLinks[index]) {
         navLinks[index].classList.add("active");
      }
   }

   window.addEventListener("scroll", setActiveSection);
   navLinks.forEach(link => {
      link.addEventListener("click", (event) => {
         event.preventDefault();
         const targetId = link.getAttribute("href").substring(1);
         const targetSection = document.getElementById(targetId);

         if (targetSection) {
            window.scrollTo({
               top: targetSection.offsetTop - headerHeight,
               behavior: "smooth",
            });
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
         }
      });
   });

   setActiveSection();

   // ============= Слайдер (Swiper) =============
   const swiper = new Swiper('.swiper-container', {
      slidesPerView: 2,
      spaceBetween: 20,
      loop: true,
      navigation: {
         nextEl: '.swiper-button-next',
         prevEl: '.swiper-button-prev',
      },
      pagination: {
         el: '.swiper-pagination',
         clickable: true,
      },
      autoplay: {
         delay: 5000, // Автопрокрутка кожні 5 секунд
         disableOnInteraction: false,
      },
      breakpoints: {
         320: { slidesPerView: 1, spaceBetween: 10 },
         768: { slidesPerView: 2, spaceBetween: 20 },
         1024: { slidesPerView: 2, spaceBetween: 30 },
         1440: { slidesPerView: 3, spaceBetween: 40 },
         1920: { slidesPerView: 4, spaceBetween: 20 },
      },
   });

   // ============= Галерея: вкладки (з плавним переходом) =============
   const tabButtons = document.querySelectorAll('.tab-button');
   const galleryGrids = document.querySelectorAll('.gallery-grid');

   // Активуємо першу вкладку за замовчуванням
   const defaultTab = document.querySelector('.tab-button[data-tab="buildings"]');
   const defaultGrid = document.querySelector('.gallery-grid#buildings');

   if (defaultTab && defaultGrid) {
      defaultTab.classList.add('active');
      defaultGrid.style.display = 'grid';
      defaultGrid.style.opacity = '1';
      defaultGrid.style.transform = 'translateY(0)';
   }

   // Створюємо спостерігач для завантаження зображень
   const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            observer.unobserve(img); // Зупиняємо спостереження після завантаження
         }
      });
   }, { threshold: 0.1 }); // Завантажуємо, коли 10% зображення потрапляє в область видимості

   tabButtons.forEach(button => {
      button.addEventListener('click', () => {
         tabButtons.forEach(btn => btn.classList.remove('active'));
         button.classList.add('active');

         const activeTab = button.dataset.tab;
         galleryGrids.forEach(grid => {
            if (grid.id === activeTab) {
               grid.style.display = 'grid';
               setTimeout(() => {
                  grid.style.opacity = '1';
                  grid.style.transform = 'translateY(0)';
               }, 10);

               // Спостерігаємо за зображеннями, щоб завантажити їх, коли вони стають видимими
               grid.querySelectorAll("img[data-src]").forEach(img => {
                  observer.observe(img);
               });

            } else {
               grid.style.opacity = '0';
               grid.style.transform = 'translateY(10px)';
               setTimeout(() => {
                  grid.style.display = 'none';
               }, 400); // Чекаємо завершення анімації перед приховуванням
            }
         });
      });
   });

   // ============= Галерея: завантаження відео тільки при кліку (фасади) =============

   document.querySelectorAll('.video-item').forEach(item => {
      item.querySelector('.play-button').addEventListener('click', function () {
         const videoId = item.getAttribute('data-video');
         const iframe = document.createElement('iframe');
         iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
         iframe.setAttribute('frameborder', '0');
         iframe.setAttribute('allowfullscreen', 'true');
         iframe.style.width = '100%';
         iframe.style.height = '100%';
         iframe.style.borderRadius = '10px';

         // Замінити прев’ю на iframe
         item.querySelector('.video-preview').innerHTML = '';
         item.querySelector('.video-preview').appendChild(iframe);
      });
   });

   // ============= Меню-бургер =============
   document.querySelector('.header__burger').addEventListener('click', () => {
      document.querySelector('.header__burger').classList.toggle('active');
      document.querySelector('.header__menu').classList.toggle('active');
      document.body.classList.toggle('lock');
   });

   document.querySelectorAll('.header__menu ul li a').forEach(link => {
      link.addEventListener('click', () => {
         document.querySelector('.header__burger').classList.remove('active');
         document.querySelector('.header__menu').classList.remove('active');
         document.body.classList.remove('lock');
      });
   });
});
