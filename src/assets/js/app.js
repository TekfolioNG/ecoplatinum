document.addEventListener("DOMContentLoaded", function () {
  // Current year functionality
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Menu toggle functionality
  const menuToggle = document.querySelector(".menu-icon");
  const menu = document.querySelector(".menu");
  const nav = document.querySelector(".hover-underline-menu");
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      menu.classList.toggle("is-active");
      menuToggle.classList.toggle("is-active");
      menuToggle.setAttribute(
        "aria-expanded",
        menu.classList.contains("is-active")
      );
    });
  }

  // Back to top button
  const backToTopButton = document.createElement("a");
  backToTopButton.className = "back-to-top";
  backToTopButton.href = "#";
  backToTopButton.innerHTML = "<span>BACK TO TOP</span>";
  document.body.appendChild(backToTopButton);

  window.addEventListener("scroll", () => {
    backToTopButton.style.display = window.pageYOffset > 200 ? "block" : "none";
  });

  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // FAQ Accordion functionality
  const accordionItems = document.querySelectorAll(".accordion-item");
  accordionItems.forEach((item) => {
    const title = item.querySelector(".accordion-title");
    const content = item.querySelector(".accordion-content");

    if (title && content) {
      title.addEventListener("click", (e) => {
        e.preventDefault();
        const isOpen = title.getAttribute("aria-expanded") === "true";

        accordionItems.forEach((otherItem) => {
          const otherTitle = otherItem.querySelector(".accordion-title");
          const otherContent = otherItem.querySelector(".accordion-content");
          if (otherTitle && otherContent) {
            otherTitle.setAttribute("aria-expanded", "false");
            otherContent.style.maxHeight = "0";
          }
        });

        if (!isOpen) {
          title.setAttribute("aria-expanded", "true");
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }
  });

  // FAQ Search functionality
  const faqSearch = document.getElementById("faqSearch");
  if (faqSearch) {
    faqSearch.addEventListener("input", () => {
      const searchTerm = faqSearch.value.toLowerCase();
      const accordionItems = document.querySelectorAll(".accordion-item");
      accordionItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? "block" : "none";
      });

      const noResults = document.querySelector(".no-results");
      if (noResults) {
        const hasVisibleItems = Array.from(accordionItems).some(
          (item) => item.style.display === "block"
        );
        noResults.style.display = hasVisibleItems ? "none" : "block";
      }
    });
  }

  // Image Slider with Lazy Load
  const slides = document.querySelectorAll(".hero-image-slide");
  let currentSlideIndex = 0;

  function lazyLoadSlide(slide) {
    const bgImage = slide.getAttribute("data-bg");
    if (bgImage) {
      slide.style.backgroundImage = `url('${bgImage}')`;
      slide.removeAttribute("data-bg");
    }
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) {
        lazyLoadSlide(slide);
        slide.classList.add("active");
      }
    });
  }

  function startSlider() {
    setInterval(() => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      showSlide(currentSlideIndex);
    }, 5000);
  }

  if (slides.length > 0) {
    slides[0].style.backgroundImage = `url('${
      slides[0].getAttribute("data-bg") || "/assets/img/Cocoa Ecoplatinum.webp"
    }')`;
    slides[0].classList.add("active");
    startSlider();
  }

  
});
