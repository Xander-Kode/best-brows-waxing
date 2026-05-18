(function () {
  const panels = Array.from(document.querySelectorAll('.panel'));
  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const indicator = document.querySelector('.nav-indicator');

  let currentIndex = 0;
  let isAnimating = false;
  const draggables = [];

  // ── Heading language fade ─────────────────────────────────────────────────────

  function fadeToSpanish(panel, duration = 1.1) {
    const en = panel.querySelector('.panel-content h1 .en');
    const es = panel.querySelector('.panel-content h1 .es');
    if (!en || !es) return;
    gsap.killTweensOf([en, es]);
    gsap.to(en, { opacity: 0, y: -10, duration, ease: 'sine.inOut' });
    gsap.to(es, { opacity: 1, y: 0,   duration, ease: 'sine.inOut' });
  }

  function fadeToEnglish(panel, duration = 1.1) {
    const en = panel.querySelector('.panel-content h1 .en');
    const es = panel.querySelector('.panel-content h1 .es');
    if (!en || !es) return;
    gsap.killTweensOf([en, es]);
    gsap.to(en, { opacity: 1, y: 0,  duration, ease: 'sine.inOut' });
    gsap.to(es, { opacity: 0, y: 10, duration, ease: 'sine.inOut' });
  }

  // ── Auto-cycle language every 5 seconds ──────────────────────────────────────

  let langCycleTimer = null;
  let isSpanish = false;

  function startLangCycle(panel) {
    stopLangCycle();
    isSpanish = false;
    langCycleTimer = setInterval(() => {
      isSpanish = !isSpanish;
      isSpanish ? fadeToSpanish(panel) : fadeToEnglish(panel);
    }, 5000);
  }

  function stopLangCycle() {
    clearInterval(langCycleTimer);
    langCycleTimer = null;
  }

  // ── Nav indicator ────────────────────────────────────────────────────────────

  function positionIndicator(navItem, animate) {
    const { offsetLeft, offsetWidth } = navItem;
    if (animate) {
      gsap.to(indicator, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.4,
        ease: 'power2.out'
      });
    } else {
      gsap.set(indicator, { x: offsetLeft, width: offsetWidth });
    }
  }

  // ── Panel slide transitions ───────────────────────────────────────────────────

  function resetReveal(panel) {
    const revealPanel = panel.querySelector('.reveal-panel');
    const dragHandle = panel.querySelector('.drag-handle');
    const prices = panel.querySelectorAll('.service-price');
    if (revealPanel) gsap.set(revealPanel, { width: 0 });
    if (prices.length) gsap.set(prices, { x: 0 });
    if (dragHandle) {
      gsap.set(dragHandle, { x: 0 });
      const d = Draggable.get(dragHandle);
      if (d) d.update();
    }
  }

  function goToPanel(targetIndex) {
    if (targetIndex === currentIndex || isAnimating) return;
    isAnimating = true;

    stopLangCycle();

    const direction = targetIndex > currentIndex ? 1 : -1;
    const outgoing = panels[currentIndex];
    const incoming = panels[targetIndex];

    resetReveal(outgoing);

    gsap.set(incoming, { x: direction * 100 + '%', autoAlpha: 1 });

    positionIndicator(navItems[targetIndex], true);

    // Flash Spanish on incoming panel then settle back to English
    fadeToSpanish(incoming, 0.3);

    const tl = gsap.timeline({
      onComplete: () => {
        outgoing.classList.remove('active');
        incoming.classList.add('active');
        navItems[currentIndex].classList.remove('active');
        navItems[targetIndex].classList.add('active');
        currentIndex = targetIndex;
        isAnimating = false;
        fadeToEnglish(incoming, 0.5);
        startLangCycle(incoming);
      }
    });

    tl.to(outgoing, { x: direction * -100 + '%', duration: 0.6, ease: 'power2.inOut' }, 0)
      .to(incoming, { x: '0%', duration: 0.6, ease: 'power2.inOut' }, 0);
  }

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetIndex = parseInt(item.dataset.index, 10);
      if (isNaN(targetIndex)) return;
      goToPanel(targetIndex);
    });
  });

  // ── Draggable reveal ──────────────────────────────────────────────────────────

  // Per-panel threshold (fraction of viewport width) before prices start sliding in
  const revealThresholds = { 0: 0.18, 1: 0.26, 2: 0.30, 3: 0.23 };

  function initReveal(panel) {
    const revealPanel = panel.querySelector('.reveal-panel');
    const dragHandle = panel.querySelector('.drag-handle');
    if (!revealPanel || !dragHandle) return;

    const prices = panel.querySelectorAll('.service-price');
    const panelIndex = parseInt(dragHandle.dataset.panel, 10);
    const thresholdRatio = revealThresholds[panelIndex] ?? 0.45;

    const instance = Draggable.create(dragHandle, {
      type: 'x',
      bounds: { minX: 0, maxX: window.innerWidth },
      cursor: 'grab',
      activeCursor: 'grabbing',
      onDrag: function () {
        gsap.set(revealPanel, { width: this.x });
        if (prices.length) {
          const threshold = window.innerWidth * thresholdRatio;
          const priceX = this.x <= threshold
            ? -(window.innerWidth - threshold)
            : this.x - window.innerWidth;
          gsap.set(prices, { x: priceX });
        }
      },
      onDragEnd: function () {
        if (this.x < window.innerWidth * 0.08) {
          const d = Draggable.get(dragHandle);
          gsap.to(dragHandle, {
            x: 0,
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => { if (d) d.update(); }
          });
          gsap.to(revealPanel, { width: 0, duration: 0.35, ease: 'power2.out' });
          if (prices.length) gsap.to(prices, { x: 0, duration: 0.35, ease: 'power2.out' });
        }
      },
      onClick: function () {
        const half = window.innerWidth * 0.5;
        const isOpen = this.x >= window.innerWidth * 0.08;
        const d = Draggable.get(dragHandle);

        if (isOpen) {
          // Already open — click closes it
          gsap.to(dragHandle, {
            x: 0, duration: 0.45, ease: 'power2.inOut',
            onComplete: () => { if (d) d.update(); }
          });
          gsap.to(revealPanel, { width: 0, duration: 0.45, ease: 'power2.inOut' });
          if (prices.length) gsap.to(prices, { x: 0, duration: 0.45, ease: 'power2.inOut' });
        } else {
          // Closed — click snaps to half the page
          const threshold = window.innerWidth * thresholdRatio;
          const priceX = half <= threshold
            ? -(window.innerWidth - threshold)
            : half - window.innerWidth;
          gsap.to(dragHandle, {
            x: half, duration: 0.45, ease: 'power2.inOut',
            onComplete: () => { if (d) d.update(); }
          });
          gsap.to(revealPanel, { width: half, duration: 0.45, ease: 'power2.inOut' });
          if (prices.length) gsap.to(prices, { x: priceX, duration: 0.45, ease: 'power2.inOut' });
        }
      }
    });

    draggables.push(instance[0]);
  }

  // Single shared resize listener
  window.addEventListener('resize', () => {
    draggables.forEach((d) => {
      if (d) d.applyBounds({ minX: 0, maxX: window.innerWidth });
    });
  });

  // ── Brand name entrance animation ────────────────────────────────────────────

  const brandWords = document.querySelectorAll('.brand-word');
  gsap.fromTo(brandWords,
    { opacity: 0, y: -12 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.12,
      delay: 0.3
    }
  );

  // ── Initialize ────────────────────────────────────────────────────────────────

  panels.forEach((panel, i) => {
    if (i !== 0) gsap.set(panel, { x: '100%' });
    initReveal(panel);
  });

  positionIndicator(navItems[0], false);
  startLangCycle(panels[0]);
})();
