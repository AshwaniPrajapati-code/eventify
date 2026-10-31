// Captcha Click Handling
function triggerCaptcha() {
  const box = document.getElementById("captchaBox");
  const checkmark = document.getElementById("captchaCheck");
  const label = document.getElementById("captchaLabel");
  const gateway = document.getElementById("securityGateway");

  if (box.classList.contains("loading") || box.classList.contains("verified")) {
    return;
  }

  // Loader state
  box.classList.add("loading");
  label.innerText = "Verifying...";

  // 1.2s delay to simulate cloud check
  setTimeout(() => {
    box.classList.remove("loading");
    box.classList.add("verified");
    checkmark.innerHTML = "✓";
    checkmark.style.color = "#fff";
    checkmark.style.fontSize = "16px";
    checkmark.style.fontWeight = "bold";
    label.innerText = "Verified! Opening...";

    // Screen Fade-out
    setTimeout(() => {
      gateway.style.transition = "opacity 0.5s ease";
      gateway.style.opacity = "0";
      setTimeout(() => {
        gateway.style.display = "none";
      }, 500);
    }, 600);
  }, 1200);
}