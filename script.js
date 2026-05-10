const copyButton = document.querySelector('[data-copy]');
const copyStatus = document.querySelector('[data-copy-status]');
const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

if (siteHeader && menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.toggle('is-menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteHeader.classList.remove('is-menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

if (copyButton && copyStatus) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.copy;

    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = 'Email copied: ' + email;
    } catch {
      copyStatus.textContent = email;
    }
  });
}

document.querySelectorAll('[data-summary-slider]').forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll('.summary-card'));
  const dots = Array.from(slider.querySelectorAll('[data-summary-dot]'));
  const previousButton = slider.querySelector('[data-summary-prev]');
  const nextButton = slider.querySelector('[data-summary-next]');
  const summaryLabel = slider.querySelector('[data-summary-label]');
  const summaryContext = slider.querySelector('[data-summary-context]');
  let activeIndex = 0;

  const setActiveSlide = (nextIndex) => {
    if (!slides.length) return;

    activeIndex = (nextIndex + slides.length) % slides.length;
    const previousIndex = (activeIndex - 1 + slides.length) % slides.length;
    const nextSlideIndex = (activeIndex + 1) % slides.length;

    slides.forEach((slide, index) => {
      let status = 'hidden';

      if (index === activeIndex) status = 'active';
      if (index === previousIndex) status = 'previous';
      if (index === nextSlideIndex) status = 'next';

      slide.dataset.slideStatus = status;
      slide.classList.toggle('is-active', index === activeIndex);
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    if (summaryLabel) {
      summaryLabel.textContent = slides[activeIndex].dataset.summaryTitle || '';
    }

    if (summaryContext) {
      summaryContext.textContent = slides[activeIndex].dataset.summaryType || '';
    }
  };

  previousButton?.addEventListener('click', () => setActiveSlide(activeIndex - 1));
  nextButton?.addEventListener('click', () => setActiveSlide(activeIndex + 1));
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => setActiveSlide(index));
  });

  setActiveSlide(activeIndex);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
