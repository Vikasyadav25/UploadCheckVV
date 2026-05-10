const copyButton = document.querySelector('[data-copy]');
const copyStatus = document.querySelector('[data-copy-status]');
const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const unicornProjects = document.querySelectorAll('[data-us-project]');
const pageLoader = document.querySelector('[data-page-loader]');

if (pageLoader) {
  document.body.classList.add('is-loading');
  let loaderHidden = false;

  const hideLoader = () => {
    if (loaderHidden) return;

    loaderHidden = true;
    pageLoader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    window.setTimeout(() => pageLoader.remove(), 500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(hideLoader, 900), { once: true });
  } else {
    window.setTimeout(hideLoader, 900);
  }

  window.addEventListener('load', () => window.setTimeout(hideLoader, 450), { once: true });
  window.setTimeout(hideLoader, 2200);
}

if (unicornProjects.length) {
  const removeUnicornBadge = () => {
    const badgeCandidates = document.querySelectorAll('[data-us-project] a, [data-us-project] button, [data-us-project] span, [data-us-project] div');

    badgeCandidates.forEach((element) => {
      if (element.matches('[data-us-project]') || element.querySelector('canvas, iframe')) return;

      const text = element.textContent?.trim().toLowerCase() || '';
      const href = element.getAttribute('href') || '';
      const label = element.getAttribute('aria-label')?.toLowerCase() || '';
      const isBadgeLink = href.includes('unicorn.studio') || label.includes('unicorn');
      const isBadgeText = text.includes('made with unicorn');

      if (isBadgeLink || isBadgeText) {
        const badge = element.closest('a, button') || element;
        badge.remove();
      }
    });
  };

  const initUnicornStudio = () => {
    if (window.UnicornStudio?.init) {
      window.UnicornStudio.init();
      removeUnicornBadge();
      window.setTimeout(removeUnicornBadge, 800);
      window.setTimeout(removeUnicornBadge, 2000);
    }
  };

  const badgeObserver = new MutationObserver(removeUnicornBadge);
  unicornProjects.forEach((project) => {
    badgeObserver.observe(project, { childList: true, subtree: true });
  });

  if (window.UnicornStudio?.init) {
    initUnicornStudio();
  } else {
    window.UnicornStudio = window.UnicornStudio || { isInitialized: false };

    if (!document.querySelector('script[data-unicorn-studio]')) {
      const unicornScript = document.createElement('script');
      unicornScript.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.12/dist/unicornStudio.umd.js';
      unicornScript.async = true;
      unicornScript.dataset.unicornStudio = 'true';
      unicornScript.addEventListener('load', initUnicornStudio);
      document.head.appendChild(unicornScript);
    }
  }
}

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
