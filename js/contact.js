(function () {
  const form = document.getElementById("contact-form");
  const turnstileTarget = document.getElementById("contact-turnstile");
  const status = document.getElementById("contact-status");

  if (!form || !turnstileTarget || !status) return;

  const submit = form.querySelector("button[type='submit']");
  let turnstileToken = "";

  function setStatus(message, type) {
    status.textContent = message;
    status.classList.toggle("is-error", type === "error");
    status.classList.toggle("is-success", type === "success");
  }

  function loadTurnstile(siteKey) {
    if (!siteKey) {
      turnstileTarget.innerHTML = "<p class='contact-turnstile-note'>Spam protection activates when the live form is configured.</p>";
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = function () {
      if (!window.turnstile) return;
      window.turnstile.render(turnstileTarget, {
        sitekey: siteKey,
        theme: "light",
        callback: function (token) { turnstileToken = token; },
        "expired-callback": function () { turnstileToken = ""; },
        "error-callback": function () { turnstileToken = ""; },
      });
    };
    document.head.appendChild(script);
  }

  fetch("/api/contact-config", { cache: "no-store" })
    .then(function (response) { return response.ok ? response.json() : {}; })
    .then(function (config) { loadTurnstile(config.siteKey || ""); })
    .catch(function () { loadTurnstile(""); });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (name.length < 2 || !email.includes("@") || message.length < 30) {
      setStatus("Please add your name, a valid email, and a little context.", "error");
      return;
    }
    if (!turnstileToken) {
      setStatus("Please complete spam protection before sending.", "error");
      return;
    }

    data.append("turnstileToken", turnstileToken);
    submit.disabled = true;
    setStatus("Sending context…");

    fetch(form.action, { method: "POST", body: data })
      .then(function (response) { return response.json().then(function (body) { return { ok: response.ok, body: body }; }); })
      .then(function (result) {
        if (!result.ok) throw new Error(result.body.error || "Unable to send the message.");
        form.reset();
        turnstileToken = "";
        setStatus(result.body.message || "Context received. I will get back to you soon.", "success");
      })
      .catch(function (error) { setStatus(error.message || "Unable to send the message.", "error"); })
      .finally(function () { submit.disabled = false; });
  });
})();
