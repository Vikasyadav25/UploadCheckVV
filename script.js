const copyButton = document.querySelector('[data-copy]');
const copyStatus = document.querySelector('[data-copy-status]');

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
