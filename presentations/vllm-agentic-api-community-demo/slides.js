(() => {
  const deck = document.querySelector(".deck");
  const slides = [...document.querySelectorAll(".slide")];
  const progress = document.querySelector(".progress span");
  const currentSlide = document.querySelector(".current-slide");
  const notesText = document.querySelector(".notes-panel p");
  let index = 0;
  let touchStartX = null;

  const clampIndex = (candidate) => Math.max(0, Math.min(candidate, slides.length - 1));

  function render(candidate, updateHash = true) {
    index = clampIndex(candidate);
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      if (!isActive) slide.querySelectorAll("video").forEach((video) => video.pause());
    });
    currentSlide.textContent = String(index + 1);
    progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    notesText.textContent = slides[index].dataset.notes ?? "";
    document.title = `${slides[index].querySelector("h1, h2").textContent.trim()} — vLLM Agentic API`;
    if (updateHash) history.replaceState(null, "", `#${index + 1}`);
  }

  function fromHash() {
    const requested = Number.parseInt(location.hash.slice(1), 10);
    return Number.isFinite(requested) ? requested - 1 : 0;
  }

  function toggleNotes() {
    deck.dataset.showNotes = deck.dataset.showNotes === "true" ? "false" : "true";
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await deck.requestFullscreen();
    }
  }

  document.addEventListener("keydown", (event) => {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLVideoElement
    ) {
      return;
    }

    if (["ArrowRight", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      render(index + 1);
    } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
      event.preventDefault();
      render(index - 1);
    } else if (event.key === "Home") {
      render(0);
    } else if (event.key === "End") {
      render(slides.length - 1);
    } else if (event.key.toLowerCase() === "f") {
      toggleFullscreen();
    } else if (event.key.toLowerCase() === "n") {
      toggleNotes();
    }
  });

  document.querySelector(".controls").addEventListener("click", (event) => {
    const action = event.target.closest("button")?.dataset.action;
    if (action === "previous") render(index - 1);
    if (action === "next") render(index + 1);
    if (action === "notes") toggleNotes();
    if (action === "fullscreen") toggleFullscreen();
  });

  deck.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  });

  deck.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 48) render(index + (delta < 0 ? 1 : -1));
    touchStartX = null;
  });

  window.addEventListener("hashchange", () => render(fromHash(), false));
  render(fromHash(), false);
})();
