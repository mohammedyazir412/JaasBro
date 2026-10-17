/* =========================================================
   JAAS BRO ACADEMY — SCRIPT
   1. Program data
   2. Render program cards + tabs
   3. Mobile navigation
   4. Sticky navbar + active link on scroll
   5. Smooth scroll (native CSS handles most; JS closes menu)
   6. Scroll reveal animations (IntersectionObserver)
   7. Back to top button
   8. WhatsApp integration
   9. Contact form validation + submit
   10. Hero typewriter effect
   ========================================================= */

(function () {
  "use strict";

  var WHATSAPP_NUMBER = "919655448899"; /* TODO: confirm preferred WhatsApp number */

  /* ---------- 1. PROGRAM DATA ---------- */
  var PROGRAM_DATA = {
    ug: [
      "B.A. Tamil", "B.A. English", "B.A. History", "B.Com", "B.Com (CA)",
      "BBA", "BBA (Banking)", "B.A. Public Administration", "B.Sc Mathematics",
      "B.Sc Computer Science", "B.Sc Information Technology", "B.Sc Psychology",
      "B.L.I.Sc", "BCA"
    ],
    pg: [
      "M.A. Tamil", "M.A. English", "M.A. History", "M.A. Sociology", "M.Com",
      "M.Com (Finance & Control)", "M.Sc Mathematics", "M.Sc Computer Science",
      "M.Sc Information Technology", "M.Sc Physics", "M.Sc Chemistry",
      "M.Sc Botany", "M.Sc Zoology", "MCA"
    ]
  };

  /* ---------- 2. RENDER PROGRAM MARQUEES ---------- */
  function renderPrograms() {
    function buildTrack(id, items) {
      var track = document.getElementById(id);
      if (!track) return;
      var itemHtml = items.map(function (name) {
        return '<span class="marquee-item">' + name + '</span><span class="marquee-sep" aria-hidden="true">&times;</span>';
      }).join("");
      /* content is doubled so the loop animation (translateX -50%) is seamless */
      track.innerHTML = itemHtml + itemHtml;
    }
    buildTrack("marqueeUG", PROGRAM_DATA.ug);
    buildTrack("marqueePG", PROGRAM_DATA.pg);

    /* populate the contact form's program select */
    var ugGroup = document.getElementById("ugOptions");
    var pgGroup = document.getElementById("pgOptions");
    if (ugGroup) {
      ugGroup.innerHTML = PROGRAM_DATA.ug.map(function (n) { return "<option>" + n + "</option>"; }).join("");
    }
    if (pgGroup) {
      pgGroup.innerHTML = PROGRAM_DATA.pg.map(function (n) { return "<option>" + n + "</option>"; }).join("");
    }
  }

  /* ---------- 2b. UNIVERSITY COUNTRY FILTER (study-mbbs.html) ---------- */
  function initUniversityFilter() {
    var filterButtons = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll(".university-card");
    var emptyMsg = document.getElementById("universityEmpty");
    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        var visibleCount = 0;

        filterButtons.forEach(function (b) { b.classList.toggle("active", b === btn); });

        cards.forEach(function (card) {
          var isMatch = filter === "all" || card.getAttribute("data-country") === filter;
          card.hidden = !isMatch;
          if (isMatch) visibleCount++;
        });

        if (emptyMsg) emptyMsg.hidden = visibleCount > 0;
      });
    });
  }

  /* ---------- 2c. UNIVERSITY SHARE LINKS (study-mbbs.html) ---------- */
  function initUniversityShare() {
    var shareButtons = document.querySelectorAll(".university-share-btn");
    if (!shareButtons.length) return;

    shareButtons.forEach(function (link) {
      var card = link.closest(".university-card");
      var heading = card ? card.querySelector("h3") : null;
      var name = heading ? heading.textContent : document.title;
      var pageUrl = window.location.origin + window.location.pathname + (card ? "#" + card.id : "");
      var network = link.getAttribute("data-share");

      if (network === "facebook") {
        link.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(pageUrl);
      } else if (network === "twitter") {
        link.href = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(pageUrl) + "&text=" + encodeURIComponent(name);
      } else if (network === "linkedin") {
        link.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(pageUrl);
      }
    });
  }

  /* ---------- SYNC NAVBAR HEIGHT ---------- */
  /* Keeps --navbar-h accurate so the fixed mobile menu always starts exactly
     below the navbar, even if the brand text wraps to more lines than expected. */
  function syncNavbarHeight() {
    var navbar = document.getElementById("navbar");
    if (!navbar) return;
    document.documentElement.style.setProperty("--navbar-h", navbar.offsetHeight + "px");
  }

  /* ---------- 3. MOBILE NAVIGATION ---------- */
  function initMobileNav() {
    var hamburger = document.getElementById("hamburger");
    var navMenu = document.getElementById("navMenu");
    var backdrop = document.getElementById("navBackdrop");
    if (!hamburger || !navMenu) return;

    function closeMenu() {
      navMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      if (backdrop) backdrop.classList.remove("active");
      document.body.style.overflow = "";
    }

    function openMenu() {
      navMenu.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      if (backdrop) backdrop.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    hamburger.addEventListener("click", function () {
      var isOpen = navMenu.classList.contains("open");
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    if (backdrop) backdrop.addEventListener("click", closeMenu);

    document.querySelectorAll("[data-nav]").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- 3b. NAV DROPDOWN (Study MBBS) ---------- */
  function initNavDropdown() {
    var dropdown = document.querySelector(".nav-dropdown");
    if (!dropdown) return;
    var toggle = dropdown.querySelector(".nav-dropdown-toggle");
    var menu = dropdown.querySelector(".nav-dropdown-menu");
    if (!toggle || !menu) return;

    function closeDropdown() {
      dropdown.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
    function openDropdown() {
      dropdown.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (dropdown.classList.contains("open")) closeDropdown(); else openDropdown();
    });

    document.addEventListener("click", function (e) {
      if (!dropdown.contains(e.target)) closeDropdown();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDropdown();
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeDropdown);
    });
  }

  /* ---------- 4. STICKY NAVBAR + ACTIVE LINK ---------- */
  function initScrollSpy() {
    var navbar = document.getElementById("navbar");
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var navLinks = document.querySelectorAll(".nav-link[data-nav]");

    function onScroll() {
      if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 8);

      var scrollPos = window.scrollY + 120;
      var current = sections[0] ? sections[0].id : "";
      sections.forEach(function (sec) {
        if (scrollPos >= sec.offsetTop) current = sec.id;
      });

      navLinks.forEach(function (link) {
        var match = link.getAttribute("href") === "#" + current;
        link.classList.toggle("active", match);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 6. SCROLL REVEAL ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || items.length === 0) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 7. BACK TO TOP ---------- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("visible", window.scrollY > 480);
    }, { passive: true });

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 8. WHATSAPP INTEGRATION ---------- */
  function buildWhatsAppLink(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  function initWhatsApp() {
    var floatBtn = document.getElementById("whatsappFloat");
    var defaultMsg = "Hello JAAS BRO Education & Career Services, I am interested in learning more about your programs. Please provide me with more details.";
    if (floatBtn) floatBtn.href = buildWhatsAppLink(defaultMsg);

    var contactBtn = document.getElementById("contactWhatsappBtn");
    if (contactBtn) contactBtn.href = buildWhatsAppLink(defaultMsg);

    /* Program "Enquire" buttons: prefill the contact form's program field */
    document.body.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-program]");
      if (!trigger) return;
      var programSelect = document.getElementById("program");
      if (!programSelect) return;
      var value = trigger.getAttribute("data-program");
      var matched = Array.prototype.some.call(programSelect.options, function (opt) {
        if (opt.value === value || opt.textContent === value) { opt.selected = true; return true; }
        return false;
      });
      if (!matched) programSelect.value = "Other";
    });
  }

  /* ---------- 8b. PREFILL PROGRAM FROM URL (contact.html?program=...) ---------- */
  function applyProgramFromQuery() {
    var programSelect = document.getElementById("program");
    if (!programSelect) return;
    var params = new URLSearchParams(window.location.search);
    var value = params.get("program");
    if (!value) return;
    var matched = Array.prototype.some.call(programSelect.options, function (opt) {
      if (opt.value === value || opt.textContent === value) { opt.selected = true; return true; }
      return false;
    });
    if (!matched) programSelect.value = "Other";
  }

  /* ---------- 9. CONTACT FORM VALIDATION ---------- */
  function initContactForm() {
    var form = document.getElementById("enquiryForm");
    if (!form) return;

    var fields = {
      fullName: { el: document.getElementById("fullName"), msg: "Please enter your full name." },
      phoneNumber: { el: document.getElementById("phoneNumber"), msg: "Please enter a valid 10-digit phone number." },
      email: { el: document.getElementById("email"), msg: "Please enter a valid email address." },
      program: { el: document.getElementById("program"), msg: "Please select your interested program." },
      message: { el: document.getElementById("message"), msg: "Please enter a short message." }
    };

    function setError(key, message) {
      var errEl = document.getElementById("err-" + key);
      fields[key].el.classList.toggle("invalid", !!message);
      if (errEl) errEl.textContent = message || "";
    }

    function validate() {
      var valid = true;

      var name = fields.fullName.el.value.trim();
      if (name.length < 2) { setError("fullName", fields.fullName.msg); valid = false; }
      else setError("fullName", "");

      var phone = fields.phoneNumber.el.value.trim();
      if (!/^[0-9+\s-]{10,15}$/.test(phone)) { setError("phoneNumber", fields.phoneNumber.msg); valid = false; }
      else setError("phoneNumber", "");

      var email = fields.email.el.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", fields.email.msg); valid = false; }
      else setError("email", "");

      var program = fields.program.el.value;
      if (!program) { setError("program", fields.program.msg); valid = false; }
      else setError("program", "");

      var message = fields.message.el.value.trim();
      if (message.length < 5) { setError("message", fields.message.msg); valid = false; }
      else setError("message", "");

      return valid;
    }

    function buildEnquiryMessage() {
      return (
        "New Enquiry - JAAS BRO Education & Career Services\n" +
        "Name: " + fields.fullName.el.value.trim() + "\n" +
        "Phone: " + fields.phoneNumber.el.value.trim() + "\n" +
        "Email: " + fields.email.el.value.trim() + "\n" +
        "Program: " + fields.program.el.value + "\n" +
        "Message: " + fields.message.el.value.trim()
      );
    }

    function showSuccess() {
      var successEl = document.getElementById("formSuccess");
      if (!successEl) return;
      successEl.classList.add("show");
      clearTimeout(successEl._hideTimer);
      successEl._hideTimer = setTimeout(function () {
        successEl.classList.remove("show");
      }, 5000);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      /* Static site: no backend. Validate, confirm locally, and clear the form. */
      showSuccess();
      form.reset();
    });

    var whatsappFormBtn = document.getElementById("whatsappFormBtn");
    if (whatsappFormBtn) {
      whatsappFormBtn.addEventListener("click", function () {
        if (!validate()) return;
        window.open(buildWhatsAppLink(buildEnquiryMessage()), "_blank", "noopener");
      });
    }

    /* live-clear errors as the user fixes a field */
    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener("input", function () {
        if (fields[key].el.classList.contains("invalid")) setError(key, "");
      });
    });
  }

  /* ---------- 10. HERO TYPEWRITER ---------- */
  function initHeroTyping() {
    var el = document.getElementById("typedText");
    if (!el) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return; /* keep the static "Flexible Learning" already in the markup */

    var phrases = ["Flexible Learning", "Career Guidance", "International Education"];
    var phraseIndex = 0;
    var charIndex = phrases[0].length; /* markup already shows the first phrase fully typed */
    var deleting = false;

    var TYPE_MS = 90;
    var DELETE_MS = 45;
    var HOLD_MS = 1800;
    var NEXT_MS = 400;

    function tick() {
      var current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex >= current.length) {
          deleting = true;
          setTimeout(tick, HOLD_MS);
          return;
        }
        setTimeout(tick, TYPE_MS);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, NEXT_MS);
          return;
        }
        setTimeout(tick, DELETE_MS);
      }
    }

    setTimeout(function () { deleting = true; tick(); }, HOLD_MS);
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderPrograms();
    initUniversityFilter();
    initUniversityShare();
    initMobileNav();
    initNavDropdown();
    initScrollSpy();
    initReveal();
    initBackToTop();
    initWhatsApp();
    applyProgramFromQuery();
    initContactForm();
    initHeroTyping();

    syncNavbarHeight();
    window.addEventListener("resize", syncNavbarHeight);
    window.addEventListener("load", syncNavbarHeight);
    var brandLogos = document.querySelectorAll(".brand-logo");
    brandLogos.forEach(function (img) {
      if (img.complete) return;
      img.addEventListener("load", syncNavbarHeight, { once: true });
    });
  });
})();
