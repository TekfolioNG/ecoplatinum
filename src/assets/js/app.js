document.addEventListener("DOMContentLoaded", function () {
  // Current year functionality
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const menuToggle = document.querySelector(".menu-icon");
  const menu = document.querySelector(".menu");
  const nav = document.querySelector(".hover-underline-menu");

  // Back to top button - Create and append to body
  const backToTopButton = document.createElement("a");
  backToTopButton.className = "back-to-top";
  backToTopButton.href = "#";
  backToTopButton.innerHTML = "<span>BACK TO TOP</span>";
  document.body.appendChild(backToTopButton);

  // Variables for scroll handling
  let lastScroll = 0;
  let isScrolling = false;
  let scrollTimeout;
  const scrollThreshold = 10;

  // Handle menu toggle
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      menu.classList.toggle("is-active");
      menuToggle.classList.toggle("is-active");
      const isExpanded = menu.classList.contains("is-active");
      menuToggle.setAttribute("aria-expanded", isExpanded);
    });
  }

  // Initially hide the menu
  if (nav) {
    nav.classList.add("nav-up");
    window.addEventListener("scroll", handleScroll);

    // Show menu when at top of page
    window.addEventListener("scroll", function () {
      if (window.pageYOffset === 0) {
        nav.classList.remove("nav-up");
        nav.classList.add("nav-down");
      }
    });
  }

  // Back to top button click handler
  backToTopButton.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Show/hide back to top button based on scroll position
  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;
    backToTopButton.style.display = currentScroll > 200 ? "block" : "none";
  });

  // FAQ Accordion functionality
  const accordionItems = document.querySelectorAll(".accordion-item");
  accordionItems.forEach((item) => {
    const title = item.querySelector(".accordion-title");
    const content = item.querySelector(".accordion-content");

    if (title && content) {
      title.addEventListener("click", (e) => {
        e.preventDefault();

        // Check if this item is already open
        const isOpen = title.getAttribute("aria-expanded") === "true";

        // Close all accordion items
        accordionItems.forEach((otherItem) => {
          const otherTitle = otherItem.querySelector(".accordion-title");
          const otherContent = otherItem.querySelector(".accordion-content");

          if (otherTitle && otherContent) {
            otherTitle.setAttribute("aria-expanded", "false");
            otherContent.style.maxHeight = "0px";
            otherContent.style.opacity = "0";
          }
        });

        // Toggle current item
        if (!isOpen) {
          title.setAttribute("aria-expanded", "true");
          content.style.maxHeight = content.scrollHeight + "px";
          content.style.opacity = "1";
        }
      });
    }
  });

  // FAQ Search functionality
  const faqSearch = document.getElementById("faqSearch");
  if (faqSearch) {
    faqSearch.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const accordionItems = document.querySelectorAll(".accordion-item");

      accordionItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const match = text.includes(searchTerm);

        // Smooth transition for showing/hiding items
        if (match) {
          item.style.display = "block";
          setTimeout(() => {
            item.style.opacity = "1";
          }, 10);
        } else {
          item.style.opacity = "0";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });

      // Show/hide "no results" message
      const noResults = document.querySelector(".no-results");
      if (noResults) {
        const visibleItems = Array.from(accordionItems).some(
          (item) => item.style.display !== "none"
        );
        noResults.style.display = visibleItems ? "none" : "block";
      }
    });
  }

  // Image slider functionality
  let currentIndex = 0;
  const slides = document.querySelectorAll(".hero-image-slide");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) {
        slide.classList.add("active");
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  if (slides.length > 0) {
    showSlide(currentIndex);
    setInterval(nextSlide, 5000);
  }

  // Combined scroll handler function for navigation behavior
  function handleScroll() {
    const currentScroll = window.pageYOffset;

    if (!isScrolling) {
      nav?.classList.add("nav-up");
    }

    isScrolling = true;
    clearTimeout(scrollTimeout);

    if (Math.abs(lastScroll - currentScroll) <= scrollThreshold) {
      return;
    }

    if (nav) {
      if (currentScroll > lastScroll && currentScroll > nav.offsetHeight) {
        nav.classList.remove("nav-up");
        nav.classList.add("nav-down");
      } else if (currentScroll < lastScroll) {
        nav.classList.remove("nav-down");
        nav.classList.add("nav-up");
      }
    }

    lastScroll = currentScroll;

    scrollTimeout = setTimeout(function () {
      isScrolling = false;
      if (nav && currentScroll > nav.offsetHeight) {
        nav.classList.remove("nav-down");
        nav.classList.add("nav-up");
      }
    }, 1500);
  }

  function lazyLoadSlide(slide) {
    const bgImage = slide.getAttribute("data-bg");
    if (bgImage) {
      slide.style.backgroundImage = `url('${bgImage}')`;
      slide.removeAttribute("data-bg");
    }
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        lazyLoadSlide(slide);
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });
  }

  
  
});
