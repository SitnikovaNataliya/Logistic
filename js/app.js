//BildSlider
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
   for (let index = 0; index < sliders.length; index++) {
      let slider = sliders[index];
      if (!slider.classList.contains('swiper-bild')) {
         let slider_items = slider.children;
         if (slider_items) {
            for (let index = 0; index < slider_items.length; index++) {
               let el = slider_items[index];
               el.classList.add('swiper-slide');
            }
         }
         let slider_content = slider.innerHTML;
         let slider_wrapper = document.createElement('div');
         slider_wrapper.classList.add('swiper-wrapper');
         slider_wrapper.innerHTML = slider_content;
         slider.innerHTML = '';
         slider.appendChild(slider_wrapper);
         slider.classList.add('swiper-bild');

         if (slider.classList.contains('_swiper_scroll')) {
            let sliderScroll = document.createElement('div');
            sliderScroll.classList.add('swiper-scrollbar');
            slider.appendChild(sliderScroll);
         }
      }
   }
   sliders_bild_callback();
}

function sliders_bild_callback(params) {}

let sliderScrollItems = document.querySelectorAll('._swiper_scroll');
if (sliderScrollItems.length > 0) {
   for (let index = 0; index < sliderScrollItems.length; index++) {
      const sliderScrollItem = sliderScrollItems[index];
      const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
      const sliderScroll = new Swiper(sliderScrollItem, {
         direction: 'vertical',
         slidesPerView: 'auto',
         freeMode: true,
         scrollbar: {
            el: sliderScrollBar,
            draggable: true,
            snapOnRelease: false
         },
         mousewheel: {
            releaseOnEdges: true,
         },
      });
      sliderScroll.scrollbar.updateSize();
   }
}


function sliders_bild_callback(params) {}

let sliderIntro = new Swiper('.slider-intro', {
   effect: 'fade',
   observer: true,
   observeParents: true,
   autoplay: {
      delay: 3000,
      disableOnInteraction: false,
   },
   spaceBetween: 0,
   speed: 800,
   touchRatio: 1,
   loop: true,
   // Arrows
   navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
   }
});

let reviewsSlider = new Swiper('.reviews-slider', {
   autoplay: {
      delay: 3000,
      disableOnInteraction: false,
   },
   autoHeight: true,
   grabCursor: true,
   observer: true,
   observeParents: true,
   slidesPerView: 1,
   spaceBetween: 0,
   speed: 800,
   touchRatio: 1,
   loop: true,
   // Dotts
   pagination: {
      el: '.swiper-pagination',
      clickable: true,
   }
});
let sections = document.querySelectorAll('._scr-item');
let links = document.querySelectorAll('._goto-block');

let blocks = [];

for (let i = 0; i < links.length; i++) {
   let el = links[i];
   let block_name = el.getAttribute('href').replace('#', '');
   if (block_name != '' && !~blocks.indexOf(block_name)) {
      blocks.push(block_name);
   }

   el.addEventListener('click', function (e) {
      e.preventDefault();

      if (document.querySelector('.menu__body._active')) {
         menu_close();
         body_lock_remove(500);
      }

      let target_block_class = el.getAttribute('href').replace('#', '');
      let target_block = document.querySelector('.' + target_block_class);
      target_block.scrollIntoView({
         behavior: 'smooth',
         block: 'start'
      })
   });
};

window.addEventListener('scroll', function () {

   let scrollValue = pageYOffset;

   let header = document.querySelector('header.header');
   if (header !== null) {
      if (scrollValue > 1) {
         header.classList.add('_scroll');
      } else {
         header.classList.remove('_scroll');
      }
   }

   let old_current_link = document.querySelectorAll('._goto-block._active');
   if (old_current_link) {
      for (let i = 0; i < old_current_link.length; i++) {
         let el = old_current_link[i];
         el.classList.remove('_active');
      }
   }

   for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i];
      let block_item = document.querySelector('.' + block);
      if (block_item) {
         let block_offset = offset(block_item).top;
         let block_height = block_item.offsetHeight;
         if ((pageYOffset > block_offset - window.innerHeight / 2.5) && pageYOffset < (block_offset + block_height) - window.innerHeight / 3) {
            let current_links = document.querySelectorAll('._goto-block[href="#' + block + '"]');
            for (let i = 0; i < current_links.length; i++) {
               let current_link = current_links[i];
               current_link.classList.add('_active');
            }
         }
      }
   }
});


function menu_close() {
   let iconMenu = document.querySelector(".icon-menu");
   let menuBody = document.querySelector(".menu__body");
   iconMenu.classList.remove("_active");
   menuBody.classList.remove("_active");
}

function offset(el) {
   let rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
   return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
   }
}
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi),type (min, max)"
// e.x. data-da="item,767,last,max"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

class DynamicAdapt {
	// массив объектов
	elementsArray = [];
	daClassname = '_dynamic_adapt_';

	constructor(type) {
		this.type = type;
	}

	init() {
		// массив DOM-элементов
		this.elements = [...document.querySelectorAll('[data-da]')];

		// наполнение elementsArray объктами
		this.elements.forEach((element) => {
			const data = element.dataset.da.trim();
			if (data !== '') {
				const dataArray = data.split(',');

				const oElement = {};
				oElement.element = element;
				oElement.parent = element.parentNode;
				oElement.destination = document.querySelector(`.${dataArray[0].trim()}`);
				oElement.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
				oElement.place = dataArray[2] ? dataArray[2].trim() : 'last';

				oElement.index = this.indexInParent(
					oElement.parent, oElement.element,
				);

				this.elementsArray.push(oElement);
			}
		});

		this.arraySort(this.elementsArray);

		// массив уникальных медиа-запросов
		this.mediaArray = this.elementsArray
			.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
			.filter((item, index, self) => self.indexOf(item) === index);

		// навешивание слушателя на медиа-запрос
		// и вызов обработчика при первом запуске
		this.mediaArray.forEach((media) => {
			const mediaSplit = media.split(',');
			const mediaQuerie = window.matchMedia(mediaSplit[0]);
			const mediaBreakpoint = mediaSplit[1];

			// массив объектов с подходящим брейкпоинтом
			const elementsFilter = this.elementsArray.filter(
				({ breakpoint }) => breakpoint === mediaBreakpoint
			);
			mediaQuerie.addEventListener('change', () => {
				this.mediaHandler(mediaQuerie, elementsFilter);
			});
			this.mediaHandler(mediaQuerie, elementsFilter);
		});
	}

	// Основная функция
	mediaHandler(mediaQuerie, elementsFilter) {
		if (mediaQuerie.matches) {
			elementsFilter.forEach((oElement) => {
				// получение индекса внутри родителя
				oElement.index = this.indexInParent(
					oElement.parent, oElement.element,
				);
				this.moveTo(oElement.place, oElement.element, oElement.destination);
			});
		} else {
			elementsFilter.forEach(({ parent, element, index }) => {
				if (element.classList.contains(this.daClassname)) {
					this.moveBack(parent, element, index);
				}
			});
		}
	}

	// Функция перемещения
	moveTo(place, element, destination) {
		element.classList.add(this.daClassname);
		if (place === 'last' || place >= destination.children.length) {
			destination.append(element);
			return;
		}
		if (place === 'first') {
			destination.prepend(element);
			return;
		}
		destination.children[place].before(element);
	}

	// Функция возврата
	moveBack(parent, element, index) {
		element.classList.remove(this.daClassname);
		if (parent.children[index] !== undefined) {
			parent.children[index].before(element);
		} else {
			parent.append(element);
		}
	}

	// Функция получения индекса внутри родителя
	indexInParent(parent, element) {
		return [...parent.children].indexOf(element);
	}

	// Функция сортировки массива по breakpoint и place 
	// по возрастанию для this.type = min
	// по убыванию для this.type = max
	arraySort(arr) {
		if (this.type === 'min') {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}
					if (a.place === 'first' || b.place === 'last') {
						return -1;
					}
					if (a.place === 'last' || b.place === 'first') {
						return 1;
					}
					return a.place - b.place;
				}
				return a.breakpoint - b.breakpoint;
			});
		} else {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}
					if (a.place === 'first' || b.place === 'last') {
						return 1;
					}
					if (a.place === 'last' || b.place === 'first') {
						return -1;
					}
					return b.place - a.place;
				}
				return b.breakpoint - a.breakpoint;
			});
			return;
		}
	}
}

const da = new DynamicAdapt('max');
da.init();
var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");
var isMobile = {
   Android: function () {
      return navigator.userAgent.match(/Android/i);
   },
   BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
   },
   iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
   },
   Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
   },
   Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
   },
   any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
   }
};

function isIE() {
   ua = navigator.userAgent;
   var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
   return is_ie;
}
if (isIE()) {
   document.querySelector('body').classList.add('ie');
}
if (isMobile.any()) {
   document.querySelector('body').classList.add('_touch');
}

//=================

function testWebP(callback) {
   var webP = new Image();
   webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
   };
   webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
   if (support == true) {
      document.querySelector('body').classList.add('_webp');
   } else {
      document.querySelector('body').classList.add('_no-webp');
   }
});


if (document.querySelector('.wrapper')) {
   document.querySelector('.wrapper').classList.add('_loaded');
}

let unlock = true;

//=================
//BodyLock

function body_lock(delay) {
   let body = document.querySelector("body");
   if (body.classList.contains('_lock')) {
      body_lock_remove(delay);
   } else {
      body_lock_add(delay);
   }
}

function body_lock_remove(delay) {
   let body = document.querySelector("body");
   if (unlock) {
      let lock_padding = document.querySelectorAll("._lp");
      setTimeout(() => {
         for (let index = 0; index < lock_padding.length; index++) {
            const el = lock_padding[index];
            el.style.paddingRight = '0px';
         }
         body.style.paddingRight = '0px';
         body.classList.remove("_lock");
      }, delay);

      unlock = false;
      setTimeout(function () {
         unlock = true;
      }, delay);
   }
}

function body_lock_add(delay) {
   let body = document.querySelector("body");
   if (unlock) {
      let lock_padding = document.querySelectorAll("._lp");
      for (let index = 0; index < lock_padding.length; index++) {
         const el = lock_padding[index];
         el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
      }
      body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
      body.classList.add("_lock");

      unlock = false;
      setTimeout(function () {
         unlock = true;
      }, delay);
   }
}

//=================

//Menu
let iconMenu = document.querySelector(".icon-menu");
if (iconMenu != null) {
   let delay = 500;
   let menuBody = document.querySelector(".menu__body");
   iconMenu.addEventListener("click", function (e) {
      if (unlock) {
         body_lock(delay);
         iconMenu.classList.toggle("_active");
         menuBody.classList.toggle("_active");
      }
   });
};



// Nav 

let menuLinks = document.querySelectorAll('._goto-block');

if (menuLinks) {
   let blocks = [];
   for (let index = 0; index < menuLinks.length; index++) {
      let el = menuLinks[index];
      let block_name = el.getAttribute('href').replace('#', '');
      if (block_name != '' && !~blocks.indexOf(block_name)) {
         blocks.push(block_name);
      }

      el.addEventListener('click', function (e) {

         if (document.querySelector('.menu__body._active')) {
            menu_close();
            body_lock_remove(500);
         }

         let target_block_class = el.getAttribute('href').replace('#', '');
         let target_block = document.querySelector('.' + target_block_class);
         let targetH = target_block.getBoundingClientRect().top - window.innerHeight / 3;

         for (let index = 0; index < menuLinks.length; index++) {
            let el = menuLinks[index];
            el.classList.remove('_active');
         }

         window.scrollBy({
            top: targetH,
            behavior: 'smooth'
         });
         e.preventDefault();
      })
   }
};


//Placeholders

let inputs = document.querySelectorAll('input[placeholder]');

if (inputs.length > 0) {
   for (let index = 0; index < inputs.length; index++) {
      const input = inputs[index];
      if (input.classList.contains('_phone')) {
         //'+7(999) 999 9999'
         //'+375 (99) 9999999'
         //'+375(99)999-99-99'
         input.classList.add('_mask');
         Inputmask("+38(999) 999 9999", {
            clearIncomplete: true,
            clearMaskOnLostFocus: true,
            "placeholder": "+38(___) ____ __ __",
            showMaskOnHover: false,
         }).mask(input);
      }
   }
};


// Modal & Form validation

let bodyClass = document.querySelector('body');

let becomeClientsBtn = document.querySelectorAll('#becomeClient');
let thanksBtn = document.querySelectorAll('#thanksForm');

let modalRequest = document.querySelector('#modalRequest');
let modalThanks = document.querySelector('#modalThanks');

let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

// opening a modal window Thanks

if (thanksBtn.length > 0) {
   for (let i = 0; i < thanksBtn.length; i++) {

      const btn = thanksBtn[i];
      let formParent = btn.parentElement;

      let fieldPhone = formParent.querySelector('#input_call');
      let fieldEmail = formParent.querySelector('#input_mail');

      let errorMessage = formParent.querySelector('.error-message');
      let errorMessageEmail = formParent.querySelector('.error-message_email');
      let modalBody = modalThanks.querySelector('.modal__body');

      btn.addEventListener("click", function (e) {
         e.preventDefault();

         if (fieldPhone.value == "" & fieldEmail.value == "") {
            errorMessage.classList.add('_show');
         } else {
            if (fieldPhone.value == "" & fieldEmail.value != "") {
               let emailAddress = fieldEmail.value;
               if (reg.test(emailAddress) == false) {
                  errorMessageEmail.classList.add('_show');
               } else {
                  errorMessageEmail.classList.remove('_show');
                  if (modalRequest.classList.contains('_show')) {
                     modalRequest.classList.remove('_show');
                  }
                  modalOpen(modalThanks, modalBody);
               }
            } else {
               if (fieldPhone.value != "" & fieldEmail.value == "") {
                  errorMessageEmail.classList.remove('_show');
                  errorMessage.classList.remove('_show');
                  if (modalRequest.classList.contains('_show')) {
                     modalRequest.classList.remove('_show');
                  }
                  modalOpen(modalThanks, modalBody);
               } else {
                  if (modalRequest.classList.contains('_show')) {
                     modalRequest.classList.remove('_show');
                  }
                  errorMessageEmail.classList.remove('_show');
                  errorMessage.classList.remove('_show');
                  modalOpen(modalThanks, modalBody);
               }
            }
         }
      });
   }
}


// opening a modal window with form Request
if (becomeClientsBtn.length > 0) {
   for (let i = 0; i < becomeClientsBtn.length; i++) {
      const btn = becomeClientsBtn[i];
      btn.addEventListener("click", function (e) {
         let modalBody = modalRequest.querySelector('.modal__body');
         modalOpen(modalRequest, modalBody);
      });
   }
}


//opening a modal window

function modalOpen(modalName, modalBody) {
   bodyClass.classList.add('_lock');
   modalName.classList.add('_show');
   setTimeout(function () {
      modalBody.classList.add('_show');
   }, 300);
}


//closing the modal window on the cross

let modalCloseBtn = document.querySelectorAll('.modal__close');

if (modalCloseBtn.length > 0) {

   for (let i = 0; i < modalCloseBtn.length; i++) {

      const btn = modalCloseBtn[i];
      let modalBody = btn.parentElement;
      let modalInner = modalBody.parentElement;
      let modalName = modalInner.parentElement;

      btn.addEventListener('click', function (e) {
         e.preventDefault();
         modalBody.classList.remove('_show');
         setTimeout(function () {
            modalName.classList.remove('_show');
            bodyClass.classList.remove('_lock');
         }, 300);

         let forms = document.querySelectorAll('form');
         for (let i = 0; i < forms.length; i++) {
            forms[i].reset();
         }
      });
   }
}


// cancellation of closing the modal window when clicking on the form

let modalsBody = document.querySelectorAll('.modal__body');

if (modalsBody.length > 0) {
   for (let i = 0; i < modalsBody.length; i++) {
      modalsBody[i].addEventListener('click', function (event) {
         event.stopPropagation();
      });
   }
}


// closing the modal outside the form

let modals = document.querySelectorAll('.modal');

if (modals.length > 0) {
   for (let i = 0; i < modals.length; i++) {
      modals[i].addEventListener('click', function () {
         let modalBody = modals[i].querySelector('.modal__body');
         modalBody.classList.remove('_show');
         let modalnner = modalBody.parentElement;
         let modalParent = modalnner.parentElement;
         setTimeout(function () {
            modalParent.classList.remove('_show');
            bodyClass.classList.remove('_lock');
         }, 300);
         let forms = document.querySelectorAll('form');
         for (let i = 0; i < forms.length; i++) {
            forms[i].reset();
         }
      });
   }
}


/* -----------------------AOS js -------------------- */
/* https://github.com/michalsnik/aos */

AOS.init({
   disable: 'phone', //  accepts following values: false,'mobile', 'tablet', , boolean, expression or function
   // disable: function () {
   //    var maxWidth = 800;
   //    return window.innerWidth < maxWidth;
   // },
   startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
   initClassName: 'aos-init', // class applied after initialization
   animatedClassName: 'aos-animate', // class applied on animation
   useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
   disableMutationObserver: false, // disables automatic mutations' detections (advanced)
   debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
   throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)


   // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
   offset: 80, // offset (in px) from the original trigger point
   delay: 0, // values from 0 to 3000, with step 50ms
   duration: 800, // values from 0 to 3000, with step 50ms
   easing: 'ease', // default easing for AOS animations
   once: false, // whether animation should happen only once - while scrolling down
   mirror: false, // whether elements should animate out while scrolling past them
   anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});

window.onresize = function () {
   AOS.refresh();
}
