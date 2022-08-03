const tabs = document.querySelectorAll(".tabheader__item");
const tabsParent = document.querySelector(".tabheader__items");
const tabContent = document.querySelectorAll(".tabcontent");

const hideTabContent = () => {
  tabContent.forEach((item) => {
    item.style.display = "none";
  });
  tabs.forEach((item) => {
    item.classList.remove("tabheader__item_active");
  });
};

const showTabContent = (i = 0) => {
  tabContent[i].style.display = "block";
  tabs[i].classList.add("tabheader__item_active");
};
hideTabContent();
showTabContent();

tabsParent.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("tabheader__item")) {
    tabs.forEach((item, i) => {
      if (target === item) {
        console.log(i);
        hideTabContent();
        showTabContent(i);
      }
    });
  }
});

//* SLIDER

let slideIndex = 0;

tabsParent.addEventListener("click", (event) => {
	const target = event.target;

	if (target.classList.contains("tabheader__item")) {
		tabs.forEach((item, i) => {
			if (target === item) {
				slideIndex = i;
				hideTabContent();
				showTabContent(slideIndex);
			}
		});
	}
});

const timer = () => {
	slideIndex++;
	if (slideIndex > 3) {
		slideIndex = 0;
	}
	hideTabContent()
	showTabContent(slideIndex)
}
setInterval(timer, 2000)

//* MODAL

const modal = document.querySelector(".modal");
const modalTrigger = document.querySelectorAll("[data-modal]");

modalTrigger.forEach((item) => {
  item.addEventListener("click", openModal);
});

function openModal() {
  modal.classList.add("show");
  modal.classList.remove("hide");
  document.body.style.overflow = "hidden";

  clearInterval(modalTimeout);
}

function closeModal() {
  modal.classList.add("hide");
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

modal.addEventListener("click", (event) => {
  if (
    event.target === modal ||
    event.target.classList.contains("modal__close")
  ) {
    closeModal();
  }
});

function openModalScroll() {
  const page = document.documentElement;

  if (page.scrollTop + page.clientHeight >= page.scrollHeight) {
    openModal();

    window.removeEventListener("scroll", openModalScroll);
  }
}

window.addEventListener("scroll", openModalScroll);
const modalTimeout = setTimeout(openModal, 50000);

// ?DEADLINE
const deadline = '2022-6-30'

function getTimeRemaining(deadline) {
	const t = new Date(deadline) - new Date(),
		days = Math.floor((t / (1000 * 60 * 60 * 24))),
		hours = Math.floor((t / (1000 * 60 * 60) % 24)),
		minutes = Math.floor((t / 1000 / 60) % 60),
		seconds = Math.floor((t / 1000) % 60);

	return {
		"total": t,
		"days": days,
		"hours": hours,
		"minutes": minutes,
		"seconds": seconds
	}
}

function setClock(element, deadline) {
	const elem = document.querySelector(element),
		days = elem.querySelector('#days'),
		hours = elem.querySelector('#hours'),
		minutes = elem.querySelector('#minutes'),
		seconds = elem.querySelector('#seconds');

	setInterval(updateClock, 1000);

	updateClock();

	function makeZero(num) {
		if (num > 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

  function updateClock() {
    const t = getTimeRemaining(deadline);
    if (t.total < 0) {
      days.innerHTML = 0;
      hours.innerHTML = 0;
      minutes.innerHTML = 0;
      seconds.innerHTML = 0;
    } else {
      days.innerHTML = makeZero(t.days);
      hours.innerHTML = makeZero(t.hours);
      minutes.innerHTML = makeZero(t.minutes);
      seconds.innerHTML = makeZero(t.seconds);
    }
  }
}
setClock('.timer', deadline)
//? FORM
const forms = document.querySelectorAll('form')
const message = {
	loading: "Loading...",
	success: 'Спасибо, скоро свяжемся !',
	fail: 'Что-то пошло не так'
}

forms.forEach(item => {
	bindPostData(item)
});

const postData = async (url, data) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: data,
  });
  return await res;
}

function bindPostData (form) {
	form.addEventListener('submit', (e) => {
		e.preventDefault()

		const messageBlock = document.createElement('div')
		messageBlock.src = message.loading
    messageBlock.style.cssText = `
    display: block;
    margin: 20px auto 0;
    `;
    form.insertAdjacentElement("afterend", messageBlock);

    const formData = new FormData(form);
    const object = {};

    formData.forEach((item, i) => {
      object[i] = item;
    });

    postData("server-php", JSON.stringify(object))
    .then((data) => {
      console.log(data);
      showThanksModal(message.success);
    })
    .catch(() => {
      showThanksModal(message.fail);
    })
    .finally(() => {
      form.reset();
      messageBlock.remove();
    });
	})
}
function showThanksModal(message) {
  openModal();
  const prevModal = document.querySelector(".modal__dialog");
  prevModal.classList.add("hide");

  const thanksModal = document.createElement("div");
  thanksModal.classList.add("modal__dialog");

  thanksModal.innerHTML = `
		<div class="modal__content">
			<div class="modal__close">x</div>
			<div class="modal__title">${message}</div>
		</div>
	`;
  modal.append(thanksModal);

  setTimeout(() => {
    prevModal.classList.remove("hide");
    closeModal();
    thanksModal.remove();
  }, 2000);
}