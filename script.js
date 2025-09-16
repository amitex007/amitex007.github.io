const nav = document.querySelector(".nav");
const navMenu = document.querySelector(".nav-items");
const btnToggleNav = document.querySelector(".menu-btn");
const workEls = document.querySelectorAll(".work-box");
const workImgs = document.querySelectorAll(".work-img");

const educationEls = document.querySelectorAll(".education-box");
const educationImgs = document.querySelectorAll(".education-img");
const mainEl = document.querySelector("main");
const yearEl = document.querySelector(".footer-text span");

window.addEventListener('load', () => {
  let preloader = document.getElementById('preloader');
  preloader.classList.add('post-finish');
})


const lightThemeClassIcon = "fa-sun"
const darkThemeClassIcon = "fa-lightbulb"

const toggleNav = () => {
  nav.classList.toggle("hidden");

  // Prevent screen from scrolling when menu is opened
  document.body.classList.toggle("lock-screen");

  if (nav.classList.contains("hidden")) {
    btnToggleNav.innerHTML = '<i class="fas fa-bars"></i>';
  } else {
    // When menu is opened after transition change text respectively
    setTimeout(() => {
      btnToggleNav.innerHTML = '<i class="fas fa-times"></i>';
    }, 475);
  }
};

btnToggleNav.addEventListener("click", toggleNav);

navMenu.addEventListener("click", (e) => {
  if (e.target.localName === "a") {
    toggleNav();
  }
});

document.body.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !nav.classList.contains("hidden")) {
    toggleNav();
  }
});

// Animating work instances on scroll

workImgs.forEach((workImg) => workImg.classList.add("transform"));

let observer = new IntersectionObserver(
  (entries) => {
    const [entry] = entries;
    const [textbox, picture] = Array.from(entry.target.children);
    if (entry.isIntersecting) {
      picture.classList.remove("transform");
      Array.from(textbox.children).forEach(
        (el) => (el.style.animationPlayState = "running")
      );
    }
  },
  { threshold: 0.3 }
);

workEls.forEach((workEl) => {
  console.log('hello2', workEl);
  observer.observe(workEl);
});

// Animating Education instances on scroll

educationImgs.forEach((eduImg) => eduImg.classList.add("transform"));

let educobserver = new IntersectionObserver(
  (entries) => {
    const [entry] = entries;
    const [textbox, picture] = Array.from(entry.target.children);
    if (entry.isIntersecting) {
      picture.classList.remove("transform");
      Array.from(textbox.children).forEach(
        (el) => (el.style.animationPlayState = "running")
      );
    }
  },
  { threshold: 0.3 }
);

educationEls.forEach((eduEl) => {
  educobserver.observe(eduEl);
})
  ;

// Toggle theme and store user preferred theme for future

const switchThemeEl = document.querySelector('input[type="checkbox"]');
const storedTheme = localStorage.getItem("theme");

switchThemeEl.checked = storedTheme === "dark" || storedTheme === null;


const darkToggleButton = document.getElementById('dark-mode-toggle');
const toggleIcon = document.getElementById('toggle-icon');


let themeToggleState = storedTheme === "dark" || storedTheme === null;

if (themeToggleState) {
  toggleIcon.classList.remove(lightThemeClassIcon);
  toggleIcon.classList.add(darkThemeClassIcon);
  localStorage.setItem("theme", "dark");
} else {
  toggleIcon.classList.remove(darkThemeClassIcon);
  toggleIcon.classList.add(lightThemeClassIcon);
}

const themeToggleHandler = () => {
  if (themeToggleState) {
    toggleIcon.classList.remove(darkThemeClassIcon);
    toggleIcon.classList.add(lightThemeClassIcon);
    

    document.body.classList.remove("dark");
    document.body.classList.add("light");
    localStorage.setItem("theme", "light");
    switchThemeEl.checked = false;
    themeToggleState = false;
  } else {
    toggleIcon.classList.remove(lightThemeClassIcon);
    toggleIcon.classList.add(darkThemeClassIcon);
    toggleIcon.classList.add('dark-selection');

    document.body.classList.add("dark");
    document.body.classList.remove("light");
    localStorage.setItem("theme", "dark");
    switchThemeEl.checked = true;
    themeToggleState = true;

  }
}

darkToggleButton.addEventListener('click',themeToggleHandler);
switchThemeEl.addEventListener("click",themeToggleHandler);


// Trap the tab when menu is opened

const lastFocusedEl = document.querySelector('a[data-focused="last-focused"]');

document.body.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && document.activeElement === lastFocusedEl) {
    e.preventDefault();
    btnToggleNav.focus();
  }
});

// Rotating logos animation

const logosWrappers = document.querySelectorAll(".logo-group");

const sleep = (number) => new Promise((res) => setTimeout(res, number));

logosWrappers.forEach(async (logoWrapper, i) => {
  const logos = Array.from(logoWrapper.children);
  await sleep(1400 * i);
  setInterval(() => {
    let temp = logos[0];
    logos[0] = logos[1];
    logos[1] = logos[2];
    logos[2] = temp;
    logos[0].classList.add("hide", "to-top");
    logos[1].classList.remove("hide", "to-top", "to-bottom");
    logos[2].classList.add("hide", "to-bottom");
  }, 5600);
});

yearEl.textContent = new Date().getFullYear();


$(document).ready(function () {
  $("#successRequest").hide();
  $("#failureRequest").hide();
  $("#cvloader").hide();
  $("#contact-submit-btn").show();

  console.log('Started mapping')

  $("#contact-request").submit(function (e) {
    e.preventDefault();
    
    $("#contact-submit-btn").hide();
    $("#cvloader").show();
    
    // Generate reCAPTCHA v3 token
    grecaptcha.ready(function() {
      grecaptcha.execute('6LeFgcsrAAAAABiX-wOC7ew4OTrJ543Mcilauq9l', {action: 'contact_form'}).then(function(token) {
        // Set the token in the hidden input
        $('#recaptcha-token').val(token);
        
        // Submit the form with the token
        var formData = $("#contact-request").serialize();
        
        $.post($("#contact-request").attr('action'), formData, function (response) {
          console.log(response);

          $("#cvloader").hide();

          if (response.result == "success") {
            $("#successRequest").show();
            // Reset form
            $("#contact-request")[0].reset();
          } else {
            $("#failureRequest").show();
          }
        }, 'json').fail(function() {
          $("#cvloader").hide();
          $("#failureRequest").show();
        });
      });
    });
    
    return false;
  })
});