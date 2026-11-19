document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Navigation Toggle
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const currentlyOpen = item.classList.contains("is-open");
      faqItems.forEach((other) => {
        other.classList.remove("is-open");
        const otherBtn = other.querySelector(".faq-question");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });

      if (!currentlyOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // 4. Demo Booking Modal + GoHighLevel Webhook Integration
  // Optional: Paste your GoHighLevel Inbound Webhook URL or Formspree URL below
  const WEBHOOK_URL = "";

  const modal = document.getElementById("demo-modal");
  const modalClose = document.getElementById("modal-close");
  const formView = document.getElementById("modal-form-view");
  const successView = document.getElementById("modal-success-view");
  const demoForm = document.getElementById("demo-form");
  const planInput = document.getElementById("lead-plan");
  const errorBox = document.getElementById("form-error");
  const submitBtn = document.getElementById("submit-btn");
  const confirmName = document.getElementById("confirm-name");
  const confirmBusiness = document.getElementById("confirm-business");
  const successDoneBtn = document.getElementById("success-done-btn");

  function openModal(planLabel) {
    if (!modal) return;
    if (planInput && planLabel) {
      planInput.value = planLabel;
    }
    formView.hidden = false;
    successView.hidden = true;
    errorBox.hidden = true;
    modal.hidden = false;
    document.body.style.overflow = "hidden";

    // Close mobile menu if open
    if (navLinks && menuToggle) {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }

    const firstInput = document.getElementById("lead-name");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const plan = trigger.getAttribute("data-open-modal") || "General Demo";
      openModal(plan);
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (successDoneBtn) successDoneBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) {
      closeModal();
    }
  });

  if (demoForm) {
    demoForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorBox.hidden = true;

      const formData = new FormData(demoForm);
      const payload = {
        name: String(formData.get("name") || "").trim(),
        business: String(formData.get("business") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        software: String(formData.get("software") || "").trim(),
        plan: String(formData.get("plan") || "").trim(),
        submittedAt: new Date().toISOString()
      };

      if (!payload.name || !payload.business || !payload.phone || !payload.email) {
        errorBox.textContent = "Please complete all required fields so we can call you for your demo.";
        errorBox.hidden = false;
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Booking Your Demo...";

      try {
        if (WEBHOOK_URL) {
          await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        }

        if (confirmName) confirmName.textContent = payload.name.split(" ")[0];
        if (confirmBusiness) confirmBusiness.textContent = payload.business;

        demoForm.reset();
        formView.hidden = true;
        successView.hidden = false;
      } catch (err) {
        errorBox.textContent = "Something went wrong sending your request. Please try again.";
        errorBox.hidden = false;
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Lock In My 10-Minute Demo";
      }
    });
  }
});