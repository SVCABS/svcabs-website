// Loader functionality
window.onload = function () {
  const loader = document.getElementById("loader");
  const mainContent = document.getElementById("mainContent");

  // Fade out the loader by reducing opacity
  setTimeout(function () {
    loader.style.opacity = "0"; // Start fade out
  }, 500); // Loader duration (.5 second)

  // Hide the loader and show main content after opacity transition completes (0.5s later)
  setTimeout(function () {
    loader.style.visibility = "hidden"; // Hide loader
    mainContent.style.display = "block"; // Show main content
  }, 1000); // 1 second + 0.5 second for transition delay
};

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".navbar-nav .nav-link");

  links.forEach((link) => {
    link.addEventListener("click", () => {
      // Remove active class from all links
      links.forEach((item) => item.classList.remove("active"));

      // Add active class to the clicked link
      link.classList.add("active");
    });
  });
});

// Add transition effect when scrolling
window.onscroll = function () {
  stickyNavbar();

  // Show or hide the "Go to Top" button based on scroll position
  const goToTopButton = document.getElementById("goToTop");
  const whatsappbutton = document.getElementById("whatsappChat");
  if (
    document.body.scrollTop > 500 ||
    document.documentElement.scrollTop > 500
  ) {
    goToTopButton.style.display = "flex";
    whatsappbutton.style.display = "flex";

  } else {
    goToTopButton.style.display = "none";
    whatsappbutton.style.display = "none";
  }

  const footer = document.querySelector(".footer");
  const footerRect = footer.getBoundingClientRect();

  // Change color when reaching the footer
  if (footerRect.top <= window.innerHeight && footerRect.top >= 0) {
    goToTop.classList.add("active");
  } else {
    goToTop.classList.remove("active");
  }
};

// Smooth scroll to top
document.getElementById("goToTop").onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

var navbar = document.getElementById("mainNavbar");
var sticky = navbar.offsetTop;

function stickyNavbar() {
  if (window.scrollY > sticky) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
}

// JavaScript to add the show class after loading the hero section
window.addEventListener("load", () => {
  document.querySelector(".hero-content").classList.add("show");
  document.querySelector(".about-us-section").classList.add("show");
  document.querySelector(".stats-section").classList.add("show");
});


//   Carousel script
$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    loop: true,
    margin: 20,
    nav: false,
    dot: false,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
  });
});

document.getElementById('queryForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  const form = event.target;
  const formData = new FormData(form);

  fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
          'Accept': 'application/json'
      }
  }).then(response => {
      if (response.ok) {
          document.getElementById('alertBanner').classList.remove('d-none'); // Show success banner
          form.reset(); // Reset form
      } else {
          alert("There was a problem submitting the form.");
      }
  }).catch(error => {
      alert("There was an error sending your message.");
  });
});

const heroContent = [
  {
      heading: "Professional and Reliable Transportation",
      description: "With more than 25 years of experience, S.V CABS is dedicated to providing seamless cab services to both businesses and individuals. Whether it's a busy workday or a relaxed family trip, we ensure your journey is comfortable and worry-free.",
      buttonText: "Explore Our Services",
      buttonLink: "#services"
  },
  {
      heading: "Your Trusted Travel Partner",
      description: "Count on us for punctuality and comfort during every ride. Your safety is our top priority.",
      buttonText: "Learn More",
      buttonLink: "#about-us"
  }
];

let currentIndex = 0;

function updateHeroContent() {
  const currentContent = heroContent[currentIndex];
  document.getElementById("hero-heading").textContent = currentContent.heading;
  document.getElementById("hero-description").textContent = currentContent.description;
  document.getElementById("hero-button").textContent = currentContent.buttonText;
  document.getElementById("hero-button").href = currentContent.buttonLink;

  currentIndex = (currentIndex + 1) % heroContent.length;
}

setInterval(updateHeroContent, 5000); // Change every 5 seconds