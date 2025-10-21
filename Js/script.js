// ======== ELEMENT REFERENCES ========
const toggle = document.getElementById('menu-toggle');
const menuList = document.getElementById("menu-list");
const navbar = document.querySelector('.navbar');
const icon = toggle.querySelector('i');
const navLinksArray = document.querySelectorAll(".navbar a");
const sections = document.querySelectorAll("section");
const header = document.querySelector("header");

// ======== TOGGLE MENU (HAMBURGER)  and scroll ========
toggle.addEventListener('click', () => {
  // toggle menu dan ubah ikon
  navbar.classList.toggle('active');

  const isActive = navbar.classList.contains('active');
  icon.classList.toggle('fa-bars', !isActive);
  icon.classList.toggle('fa-xmark', isActive);
});

// ======== SCROLL BEHAVIOR ========
let lastScrollY = window.scrollY;
let ticking = false;
const scrollThreshold = 50; // seberapa sensitif navbar muncul

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScroll = window.scrollY;

      // 🔹 Sembunyikan navbar jika scroll ke bawah
      if (currentScroll > lastScrollY && currentScroll > scrollThreshold) {
        header.style.top = "-100px";
      }
      // 🔹 Tampilkan navbar jika scroll ke atas sedikit
      else if (currentScroll < lastScrollY) {
        header.style.top = "0";
      }

      lastScrollY = currentScroll;
      ticking = false;
    });

    ticking = true;
  }

  // 🔹 Highlight link aktif sesuai posisi scroll
  const navbarHeight = header.offsetHeight;
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbarHeight - 100;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinksArray.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
});


// ======== SMOOTH SCROLL (JAVASCRIPT ONLY) ========
function smoothScroll(target, duration = 800) {
  const targetElement = document.querySelector(target);
  if (!targetElement) return;

  const startPosition = window.pageYOffset;
  const navbarHeight = header.offsetHeight;
  const targetPosition = targetElement.getBoundingClientRect().top - navbarHeight;
  const startTime = performance.now();

  function animation(currentTime) {
    const elapsed = currentTime - startTime;
    const ease = easeInOutCubic(elapsed / duration);
    window.scrollTo(0, startPosition + targetPosition * ease);

    if (elapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, startPosition + targetPosition);
    }
  }

  requestAnimationFrame(animation);
}

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Klik link navbar → smooth scroll + tutup menu mobile
navLinksArray.forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.getAttribute('href');
    smoothScroll(target, 1000);

    navbar.classList.remove("active");
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-xmark');
  });
});

// ======== NAVBAR ACTIVE ON SCROLL ========
window.addEventListener("scroll", () => {
  const navbarHeight = header.offsetHeight;
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbarHeight - 100;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinksArray.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ======== ANIMASI MUNCUL SECTION ========
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    } else {
      entry.target.classList.remove("visible");
    }
  });
}, {
  threshold: 0.2,
  rootMargin: '0px 0px -10% 0px'
});

sections.forEach(section => observer.observe(section));

// ======== FILTER PROJECT ========
document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Hapus class active dari semua tombol
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach(card => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});


document.addEventListener("DOMContentLoaded", function() {
  const popup = document.getElementById("popup");
  const submitBtn = document.getElementById("submitBtn");
  const usernameInput = document.getElementById("usernameInput");
  const usernameDisplay = document.getElementById("usernameDisplay");

  // Show popup only if user not entered name before
  if (!localStorage.getItem("username")) {
    popup.style.display = "flex";
  } else {
    usernameDisplay.textContent = `${localStorage.getItem("username")},`;
  }

  // Fungsi submit
  function submitName() {
    const name = usernameInput.value.trim();
    if (name) {
      localStorage.setItem("username", name);
      usernameDisplay.textContent = `${name},`;
      popup.style.display = "none";
    } else {
      alert("Please enter your name!");
    }
  }

  // Klik tombol Submit
  submitBtn.addEventListener("click", submitName);

  // Tekan Enter di input
  usernameInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitName(); // Jalankan fungsi submit
    }
  });
});

// ======== CONTACT FORM VALIDATION ========
document.addEventListener("DOMContentLoaded", function() {
  // 🔹 Ganti dengan PUBLIC KEY kamu dari EmailJS
  emailjs.init("v_dJy9WOYntXhFT_v");

  const form = document.querySelector(".contact-form");
  const nameInput = form.querySelector('input[placeholder="Name"]');
  const emailInput = form.querySelector('input[placeholder="E-mail"]');
  const messageInput = form.querySelector('textarea[placeholder="Description"]');

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // ===== VALIDASI =====
    if (!name || !email || !message) {
      alert("⚠️ Please fill in all fields!");
      return;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      alert("❌ Name must contain only letters!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("📧 Please enter a valid email address!");
      return;
    }

    // ===== KIRIM EMAIL MELALUI EMAILJS =====
    const params = {
      name: name,
      email: email,
      message: message,
      time: new Date().toLocaleString()
    };

    const serviceID = "service_gmail";
    const templateID = "template_gmail";

    emailjs.send(serviceID, templateID, params)
      .then((res) => {
        alert("✅ Your message has been sent successfully!");
        console.log("SUCCESS:", res.status, res.text);
        form.reset();
      })
      .catch((error) => {
        console.error("❌ EmailJS Error:", error);
        alert("Failed to send message. Please try again later.");
      });
  });
});