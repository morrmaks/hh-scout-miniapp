(function () {
  const tg = window.Telegram?.WebApp;
  const scheme = tg?.colorScheme ?? 'dark';

  document.documentElement.dataset.theme = `${scheme}-orange`;
})();
