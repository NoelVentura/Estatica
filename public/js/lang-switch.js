(function () {
  const STORAGE_KEY = 'lang';

  function htmlLang(code) {
    return code === 'en' ? 'en' : 'es-MX';
  }

  function getMessages(lang) {
    const data = window.I18N_MESSAGES || {};
    return data[lang] || data.es || {};
  }

  function applyTranslations(lang) {
    const messages = getMessages(lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const value = messages[key];
      if (value == null) return;

      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-attr');
      const attr = el.getAttribute('data-i18n-target-attr') || 'aria-label';
      const value = messages[key];
      if (value != null) el.setAttribute(attr, value);
    });

    ['aria-label', 'title', 'placeholder'].forEach(function (attr) {
      document.querySelectorAll('[data-i18n-' + attr + ']').forEach(function (el) {
        const key = el.getAttribute('data-i18n-' + attr);
        const value = messages[key];
        if (value != null) el.setAttribute(attr, value);
      });
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      const value = messages[key];
      if (value != null) el.placeholder = value;
    });

    var copyright = document.querySelector('[data-i18n-copyright]');
    if (copyright) {
      var yearEl = document.getElementById('current-year');
      var year = yearEl ? yearEl.textContent : new Date().getFullYear();
      copyright.innerHTML = '&copy; ' + year + ' ' + (messages['footer.copyright'] || '');
    }
  }

  function setActiveLang(lang) {
    const code = lang === 'en' ? 'en' : 'es';

    document.querySelectorAll('.lang-switch').forEach(function (btn) {
      const active = btn.getAttribute('data-lang') === code;
      btn.classList.toggle('ring-2', active);
      btn.classList.toggle('ring-primary-500', active);
      btn.classList.toggle('ring-offset-1', active);
      btn.classList.toggle('ring-offset-white', active);
      btn.classList.toggle('dark:ring-offset-slate-900', active);
      btn.classList.toggle('opacity-80', !active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    document.documentElement.lang = htmlLang(code);
    applyTranslations(code);

    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (_) {}
  }

  try {
    const initial = localStorage.getItem(STORAGE_KEY) || 'es';
    document.documentElement.lang = htmlLang(initial);
  } catch (_) {}

  window.setSiteLanguage = setActiveLang;
  window.applySiteTranslations = applyTranslations;

  document.addEventListener('DOMContentLoaded', function () {
    const saved = localStorage.getItem(STORAGE_KEY) || 'es';
    setActiveLang(saved);

    document.querySelectorAll('.lang-switch').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setActiveLang(btn.getAttribute('data-lang'));
      });
    });
  });
})();
