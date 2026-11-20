document.addEventListener("DOMContentLoaded", () => {
  // 1. Copyright Year
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // 2. Mobile Menu
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
  }

  // 3. Hero Interactive Missed-Call Simulator
  const simBtn = document.getElementById("sim-trigger-btn");
  const simStatus = document.getElementById("sim-status");
  const msg1 = document.getElementById("sim-msg-1");
  const msg2 = document.getElementById("sim-msg-2");
  const msg3 = document.getElementById("sim-msg-3");
  const simFooter = document.getElementById("sim-footer");

  if (simBtn && msg1 && msg2 && msg3 && simFooter && simStatus) {
    simBtn.addEventListener("click", () => {
      simBtn.disabled = true;
      simBtn.textContent = "Simulating Call...";
      simStatus.textContent = "Incoming Call (Example): +61 4XX XXX XXX";
      [msg1, msg2, msg3, simFooter].forEach((el) => el.classList.add("is-hidden"));

      setTimeout(() => {
        simStatus.textContent = "Missed Call Detected • Sending +61 SMS...";
      }, 900);
      setTimeout(() => {
        simStatus.textContent = "Example SMS Sent in 9 Seconds";
        msg1.classList.remove("is-hidden");
      }, 1700);
      setTimeout(() => {
        msg2.classList.remove("is-hidden");
      }, 2800);
      setTimeout(() => {
        msg3.classList.remove("is-hidden");
        simFooter.classList.remove("is-hidden");
        simStatus.textContent = "Simulated Call • Inspection Booked";
        simBtn.disabled = false;
        simBtn.textContent = "▶ Replay Example Demo";
      }, 3900);
    });
  }

  // 4. Conservative 4-Input ROI Calculator
  const callsSlider = document.getElementById("calc-calls");
  const genuineSlider = document.getElementById("calc-genuine");
  const winSlider = document.getElementById("calc-win");
  const valueSlider = document.getElementById("calc-value");

  function updateCalculator() {
    if (!callsSlider || !genuineSlider || !winSlider || !valueSlider) return;
    const missed = Number(callsSlider.value);
    const genuinePct = Number(genuineSlider.value);
    const winPct = Number(winSlider.value);
    const jobVal = Number(valueSlider.value);

    const monthlyJobs = +(missed * 4.33 * (genuinePct / 100) * (winPct / 100)).toFixed(1);
    const monthlyRev = Math.round(monthlyJobs * jobVal);
    const annualRev = monthlyRev * 12;

    const set = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };
    set("calc-calls-val", `${missed} / week`);
    set("calc-genuine-val", `${genuinePct}%`);
    set("calc-win-val", `${winPct}%`);
    set("calc-value-val", `$${jobVal.toLocaleString("en-AU")}`);
    set("calc-annual", `$${annualRev.toLocaleString("en-AU")}`);
    set("calc-monthly", `$${monthlyRev.toLocaleString("en-AU")}/mo`);
    set("calc-jobs", `~${monthlyJobs} jobs/mo`);
  }

  if (callsSlider && genuineSlider && winSlider && valueSlider) {
    [callsSlider, genuineSlider, winSlider, valueSlider].forEach((s) =>
      s.addEventListener("input", updateCalculator)
    );
    updateCalculator();
  }

  // 5. Workflow Tabs
  const tabBtns = document.querySelectorAll("[data-tab-target]");
  const tabPanels = document.querySelectorAll("[data-tab-panel]");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab-target");
      tabBtns.forEach((b) => b.classList.remove("is-active"));
      tabPanels.forEach((p) => p.classList.remove("is-active"));
      btn.classList.add("is-active");
      const panel = document.querySelector(`[data-tab-panel="${target}"]`);
      if (panel) panel.classList.add("is-active");
    });
  });

  // 6. FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const wasOpen = item.classList.contains("is-open");
      faqItems.forEach((o) => {
        o.classList.remove("is-open");
        const q = o.querySelector(".faq-question");
        if (q) q.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // 7. Booking Form (?plan= Prefill + Webhook)
  const WEBHOOK_URL = ""; // Paste GoHighLevel Inbound Webhook or Formspree URL here
  const planSelect = document.getElementById("lead-plan");
  if (planSelect) {
    const planParam = new URLSearchParams(window.location.search).get("plan");
    if (planParam) {
      Array.from(planSelect.options).forEach((opt) => {
        if (opt.value.toLowerCase().includes(planParam.toLowerCase())) {
          planSelect.value = opt.value;
        }
      });
    }
  }

  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("booking-error");
      const btn = document.getElementById("booking-submit-btn");
      errEl.hidden = true;

      const fd = new FormData(bookingForm);
      const payload = Object.fromEntries(fd.entries());
      if (!payload.name?.trim() || !payload.business?.trim() || !payload.phone?.trim() || !payload.email?.trim()) {
        errEl.textContent = "Please complete your name, business name, Australian mobile, and email.";
        errEl.hidden = false;
        return;
      }

      btn.disabled = true;
      btn.textContent = "Locking In Your Demo...";
      try {
        if (WEBHOOK_URL) {
          await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        }
        document.getElementById("confirm-name").textContent = payload.name.trim().split(" ")[0];
        document.getElementById("confirm-business").textContent = payload.business.trim();
        document.getElementById("booking-form-wrap").hidden = true;
        document.getElementById("booking-success-wrap").hidden = false;
      } catch {
        errEl.textContent = "Could not send request. Please try again.";
        errEl.hidden = false;
      } finally {
        btn.disabled = false;
        btn.textContent = "Book My 10-Minute Live Demo";
      }
    });
  }
});
