// App logic for "Megg Through The Years" (Light Theme)
document.addEventListener('DOMContentLoaded', () => {
  const data = window.MEGG_DATA;
  if (!data) {
    console.error('Data not loaded');
    return;
  }

  // State
  let currentFilter = 'all';
  let searchQuery = '';
  let activeLightboxIndex = 0;
  let filteredPhotos = [...data.photos];
  const likedPhotos = JSON.parse(localStorage.getItem('megg_liked_photos') || '{}');
  let loveCount = parseInt(localStorage.getItem('megg_love_count') || '1314', 10);

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Ambient Canvas: Rose Petals & Golden Stardust
  initCanvasParticles();

  // 2. Custom Cursor & Heart Trail
  initCustomCursor();

  // 3. Audio Player UI
  initAudioPlayer();

  // 4. Hero Photo Switcher
  initHeroSwitcher();

  // 5. Filmstrip Reel
  renderFilmstrip();

  // 6. Eras Bento Cards
  renderEras();

  // 7. Video Feature
  initVideoFeature();

  // 8. Polaroid Photo Wall (Scrapbook)
  initPhotoWall();

  // 9. Interactive Wax-Sealed Letter
  initWaxEnvelope();

  // 10. 10 Reasons Flip Cards
  renderReasons();

  // 11. Love Quiz
  initQuiz();

  // 12. Love Counter & Button
  initLoveCounter();

  // 13. Celebration Confetti Cannon
  initCelebrationButton();

  // 14. Lightbox Modal
  initLightbox();

  // 15. Smooth Navigation
  initFloatingNav();

  // -------------------------------------------------------------
  // FUNCTIONS IMPLEMENTATION
  // -------------------------------------------------------------

  // --- 1. Canvas Particles (Rose Petals & Golden Stardust) ---
  function initCanvasParticles() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(width < 768 ? 20 : 40, 45);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 7 + 4,
        speedY: Math.random() * 0.7 + 0.3,
        speedX: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.45 + 0.2,
        type: Math.random() > 0.45 ? 'petal' : 'star',
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.02 + 0.01
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.swing += p.swingSpeed;
        p.y += p.speedY;
        p.x += Math.sin(p.swing) * 0.7 + p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'petal') {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.size, -p.size, -p.size * 1.4, p.size, 0, p.size * 1.8);
          ctx.bezierCurveTo(p.size * 1.4, p.size, p.size, -p.size, 0, 0);
          const grad = ctx.createLinearGradient(0, -p.size, 0, p.size * 1.8);
          grad.addColorStop(0, `rgba(255, 120, 67, ${p.opacity})`);
          grad.addColorStop(1, `rgba(244, 63, 94, ${p.opacity * 0.7})`);
          ctx.fillStyle = grad;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 161, 120, ${p.opacity})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(255, 120, 67, 0.6)';
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  // --- 2. Custom Cursor & Heart Trail ---
  function initCustomCursor() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    if (!cursorDot || !cursorRing) return;

    if (window.matchMedia('(pointer: coarse)').matches) {
      cursorDot.style.display = 'none';
      cursorRing.style.display = 'none';
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let lastHeartTime = 0;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      const now = Date.now();
      if (now - lastHeartTime > 140) {
        spawnCursorHeart(mouseX, mouseY);
        lastHeartTime = now;
      }
    });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(renderRing);
    }
    renderRing();

    document.addEventListener('mouseover', e => {
      const target = e.target.closest('button, a, .figma-glass, .polaroid-item, input');
      if (target) {
        cursorRing.classList.add('cursor-hover');
      } else {
        cursorRing.classList.remove('cursor-hover');
      }
    });

    window.addEventListener('click', e => {
      cursorRing.classList.add('cursor-click');
      setTimeout(() => cursorRing.classList.remove('cursor-click'), 250);
      spawnCursorHeart(e.clientX, e.clientY, true);
    });
  }

  function spawnCursorHeart(x, y, isClick = false) {
    const heart = document.createElement('div');
    heart.className = 'cursor-heart-particle pointer-events-none select-none fixed z-[99999]';
    heart.innerHTML = isClick ? '🧡' : (Math.random() > 0.5 ? '✨' : '🌸');
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = isClick ? '18px' : '12px';
    heart.style.opacity = '0.9';
    heart.style.transform = `translate(-50%, -50%) scale(${isClick ? 1.4 : 0.8})`;
    heart.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    document.body.appendChild(heart);

    const destX = (Math.random() - 0.5) * (isClick ? 50 : 25);
    const destY = -30 - Math.random() * (isClick ? 40 : 20);

    requestAnimationFrame(() => {
      heart.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => heart.remove(), 850);
  }

  // --- 3. Audio Player UI ---
  function initAudioPlayer() {
    const playBtn = document.getElementById('music-toggle-btn');
    const eqBars = document.getElementById('music-eq-bars');
    if (!playBtn) return;

    playBtn.addEventListener('click', () => {
      const isPlaying = window.romanticAudio.toggle();
      updateAudioUI(isPlaying);
    });

    function updateAudioUI(playing) {
      if (playing) {
        playBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF7843] text-white border border-[#FF7843] shadow-md shadow-orange-500/25 text-xs font-semibold transition-all focus:outline-none';
        playBtn.innerHTML = `
          <i data-lucide="volume-2" class="w-3.5 h-3.5 text-white animate-pulse"></i>
          <span class="text-[11px] font-bold">Playing</span>
        `;
        if (eqBars) eqBars.classList.remove('opacity-0');
      } else {
        playBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-semibold text-stone-700 transition-all focus:outline-none';
        playBtn.innerHTML = `
          <i data-lucide="music" class="w-3.5 h-3.5 text-[#FF7843]"></i>
          <span class="text-[11px] hidden lg:inline">Music</span>
        `;
        if (eqBars) eqBars.classList.add('opacity-0');
      }
      if (window.lucide) window.lucide.createIcons();
    }
  }

  // --- 4. Hero Photo Switcher ---
  function initHeroSwitcher() {
    window.switchHeroPhoto = function(src, btn) {
      const img = document.getElementById('hero-main-photo');
      if (!img) return;

      window.romanticAudio.playPopSound();

      img.style.opacity = '0';
      img.style.transform = 'scale(0.96)';

      setTimeout(() => {
        img.src = src;
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }, 250);

      document.querySelectorAll('.hero-photo-switch-btn').forEach(b => {
        b.className = 'hero-photo-switch-btn px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all';
      });
      if (btn) {
        btn.className = 'hero-photo-switch-btn px-3 py-1 rounded-full text-xs font-bold bg-[#FF7843] text-white shadow-sm transition-all';
      }
    };
  }

  // --- 5. Filmstrip Reel ---
  function renderFilmstrip() {
    const track = document.getElementById('filmstrip-track');
    if (!track) return;

    const reelPhotos = [...data.photos.slice(0, 16), ...data.photos.slice(0, 16)];

    track.innerHTML = reelPhotos.map((photo, i) => `
      <div class="filmstrip-frame flex-shrink-0 w-48 md:w-56 bg-[#FAF8F5] border border-stone-200 rounded-2xl p-2.5 shadow-sm hover:shadow-md relative cursor-pointer group hover:border-[#FF7843]/60 transition-all duration-300"
           onclick="openLightboxById('${photo.id}')">
        <!-- Film Sprockets Top -->
        <div class="flex justify-between px-2 pb-1.5 opacity-60">
          <span class="w-2.5 h-1.5 rounded-sm bg-stone-300"></span>
          <span class="w-2.5 h-1.5 rounded-sm bg-stone-300"></span>
          <span class="w-2.5 h-1.5 rounded-sm bg-stone-300"></span>
          <span class="w-2.5 h-1.5 rounded-sm bg-stone-300"></span>
        </div>
        <!-- Photo -->
        <div class="relative w-full h-56 md:h-64 rounded-xl bg-stone-100 overflow-hidden shadow-inner">
          <img src="${photo.src}" alt="${photo.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
          <div class="absolute inset-0 bg-[#FF7843]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="absolute bottom-2 left-2 text-[10px] text-stone-800 font-mono font-bold tracking-widest bg-white/90 px-2 py-0.5 rounded-md border border-stone-200 shadow-sm">
            #${String((i % 16) + 1).padStart(2, '0')}
          </div>
        </div>
        <!-- Film Sprockets Bottom -->
        <div class="flex justify-between px-2 pt-1.5 opacity-60">
          <span class="w-2.5 h-1.5 rounded-sm bg-stone-300"></span>
          <span class="w-2.5 h-1.5 rounded-sm bg-stone-300"></span>
          <span class="w-2.5 h-1.5 rounded-sm bg-stone-300"></span>
          <span class="w-2.5 h-1.5 rounded-sm bg-stone-300"></span>
        </div>
      </div>
    `).join('');
  }

  // --- 6. Eras Bento Cards (Light Theme Bento) ---
  function renderEras() {
    const container = document.getElementById('eras-container');
    if (!container) return;

    container.innerHTML = data.eras.map(era => `
      <div class="figma-glass figma-glass-hover rounded-[28px] p-6 flex flex-col justify-between transition-all duration-500 group relative overflow-hidden" id="era-${era.id}">
        
        <div class="space-y-4">
          <!-- Header Badge -->
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-mono font-bold tracking-wider px-3 py-1 rounded-full uppercase bg-[#FFF5F0] text-[#E85B24] border border-orange-200 shadow-sm">
              Chapter ${era.number}
            </span>
            <span class="text-xs text-stone-500 font-bold">${era.photos.length} Photos</span>
          </div>

          <!-- Cover Image in Rounded Frame -->
          <div class="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 shadow-md border border-stone-200 cursor-pointer group-hover:scale-[1.02] transition-transform duration-500"
               onclick="openLightboxBySrc('${era.coverImage}')">
            <img src="${era.coverImage}" alt="${era.title}" class="w-full h-full object-cover" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity"></div>
            <div class="absolute bottom-3 left-3 right-3 text-center">
              <span class="text-[11px] font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-md inline-flex items-center gap-1.5 shadow-sm">
                <i data-lucide="maximize-2" class="w-3 h-3 text-[#FFA178]"></i>
                <span>Enlarge</span>
              </span>
            </div>
          </div>

          <!-- Title & Tagline -->
          <div class="space-y-1.5">
            <h3 class="text-xl font-bold text-stone-900 group-hover:text-[#E85B24] transition-colors leading-snug">
              ${era.title}
            </h3>
            <p class="text-xs text-stone-600 line-clamp-2 leading-relaxed font-normal">
              ${era.tagline}
            </p>
          </div>
        </div>

        <!-- Action Button -->
        <div class="pt-5 mt-2 border-t border-stone-100">
          <button onclick="filterGalleryByEra('${era.title}', '${era.id}')"
                  class="w-full py-2.5 px-4 rounded-full bg-stone-50 hover:bg-[#FF7843] text-stone-700 hover:text-white text-xs font-bold tracking-wide transition-all duration-300 flex items-center justify-between group/btn border border-stone-200 hover:border-[#FF7843] shadow-sm">
            <span>View This Era's Photos</span>
            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"></i>
          </button>
        </div>

      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  // --- 7. Video Feature ---
  function initVideoFeature() {
    const video = document.getElementById('featured-video');
    const playBtn = document.getElementById('video-custom-play-btn');
    const glow = document.getElementById('video-ambient-glow');
    if (!video || !playBtn) return;

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.play();
    });

    video.addEventListener('play', () => {
      playBtn.classList.add('opacity-0', 'pointer-events-none');
      if (glow) glow.classList.add('opacity-70');
    });

    video.addEventListener('pause', () => {
      playBtn.classList.remove('opacity-0', 'pointer-events-none');
      if (glow) glow.classList.remove('opacity-70');
    });

    video.addEventListener('ended', () => {
      playBtn.classList.remove('opacity-0', 'pointer-events-none');
      if (glow) glow.classList.remove('opacity-70');
    });
  }

  // --- 8. Polaroid Photo Wall (Scrapbook) ---
  function initPhotoWall() {
    renderFilters();
    renderPhotoGrid();

    const searchInput = document.getElementById('photo-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFilterAndSearch();
      });
    }
  }

  function renderFilters() {
    const filterContainer = document.getElementById('gallery-filter-buttons');
    if (!filterContainer) return;

    const filters = [
      { id: 'all', label: 'All Captured Moments', count: data.photos.length },
      { id: 'yellow-bloom', label: 'Yellow Blossom', count: data.photos.filter(p => p.eraId === 'yellow-bloom').length },
      { id: 'curls-and-confidence', label: 'Bouncy Curls', count: data.photos.filter(p => p.eraId === 'curls-and-confidence').length },
      { id: 'golden-sunsets', label: 'Golden Sunsets', count: data.photos.filter(p => p.eraId === 'golden-sunsets').length },
      { id: 'sweet-beginnings', label: 'Sweet Throwbacks', count: data.photos.filter(p => p.eraId === 'sweet-beginnings').length }
    ];

    filterContainer.innerHTML = filters.map(f => `
      <button class="filter-tab-btn px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border ${f.id === currentFilter ? 'bg-[#FF7843] text-white border-[#FF7843] shadow-md shadow-orange-500/25' : 'bg-white text-stone-700 border-stone-200 hover:border-[#FF7843]/50 shadow-sm'}"
              data-filter="${f.id}">
        ${f.label} <span class="opacity-60 ml-1 font-bold">(${f.count})</span>
      </button>
    `).join('');

    filterContainer.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-filter');
        filterContainer.querySelectorAll('.filter-tab-btn').forEach(b => {
          b.className = 'filter-tab-btn px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border bg-white text-stone-700 border-stone-200 hover:border-[#FF7843]/50 shadow-sm';
        });
        btn.className = 'filter-tab-btn px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border bg-[#FF7843] text-white border-[#FF7843] shadow-md shadow-orange-500/25';
        applyFilterAndSearch();
      });
    });
  }

  function applyFilterAndSearch() {
    filteredPhotos = data.photos.filter(p => {
      const matchFilter = (currentFilter === 'all') || (p.eraId === currentFilter);
      const matchSearch = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery) || 
        p.caption.toLowerCase().includes(searchQuery) ||
        p.era.toLowerCase().includes(searchQuery) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery));
      return matchFilter && matchSearch;
    });
    renderPhotoGrid();
  }

  function renderPhotoGrid() {
    const grid = document.getElementById('polaroid-photo-grid');
    const counterEl = document.getElementById('gallery-match-count');
    if (!grid) return;

    if (counterEl) {
      counterEl.innerText = `Showing ${filteredPhotos.length} of ${data.photos.length} memories`;
    }

    if (filteredPhotos.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-20 text-center text-stone-500">
          <i data-lucide="heart-off" class="w-10 h-10 mx-auto text-[#FF7843]/50 mb-3"></i>
          <p class="text-base font-bold text-stone-700">No moments found matching "${searchQuery}".</p>
          <button onclick="clearSearch()" class="mt-4 px-5 py-2 rounded-full bg-[#FF7843] text-white text-xs font-bold shadow-md">Clear Search</button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const tilts = ['-1.2deg', '1.4deg', '-2.0deg', '1.6deg', '-0.8deg', '2.2deg'];

    grid.innerHTML = filteredPhotos.map((photo, index) => {
      const tilt = tilts[index % tilts.length];
      const isLiked = likedPhotos[photo.id];

      return `
        <div class="polaroid-item group relative bg-white text-stone-900 rounded-2xl p-3 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:z-20 cursor-pointer border border-stone-200"
             style="transform: rotate(${tilt});"
             data-id="${photo.id}"
             data-index="${index}">
          
          <!-- Washi Tape -->
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4.5 bg-[#FFD7C7]/80 border-t border-b border-[#FFA178]/50 shadow-sm backdrop-blur-sm -rotate-2 z-10 opacity-90 pointer-events-none"></div>

          <!-- Photo Container -->
          <div class="relative w-full aspect-[4/5] rounded-xl bg-stone-100 overflow-hidden shadow-inner"
               onclick="openLightboxById('${photo.id}')">
            <img src="${photo.src}" alt="${photo.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
              <span class="text-xs text-white bg-black/70 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 font-bold shadow-sm">
                <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-[#FFA178]"></i>
                <span>Enlarge</span>
              </span>
            </div>
          </div>

          <!-- Polaroid Bottom Label -->
          <div class="pt-3 pb-1 px-1">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h4 class="font-handwritten text-xl font-bold text-stone-900 leading-tight group-hover:text-[#E85B24] transition-colors">${photo.title}</h4>
                <p class="text-[10px] font-sans text-stone-500 font-bold tracking-wider uppercase mt-0.5">${photo.era}</p>
              </div>

              <!-- Like Button -->
              <button class="like-btn p-1.5 rounded-full transition-transform active:scale-125 hover:bg-orange-50"
                      onclick="togglePhotoLike(event, '${photo.id}')"
                      title="Favorite this memory">
                <i data-lucide="heart" class="w-4 h-4 ${isLiked ? 'text-[#FF7843] fill-[#FF7843]' : 'text-stone-300 hover:text-[#FF7843]'}"></i>
              </button>
            </div>
            
            <p class="font-sans text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
              ${photo.caption}
            </p>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  // --- 9. Interactive Wax-Sealed Letter ---
  function initWaxEnvelope() {
    const seal = document.getElementById('wax-seal-btn');
    const envelope = document.getElementById('envelope-container');
    const letter = document.getElementById('letter-content');
    if (!seal || !envelope || !letter) return;

    seal.addEventListener('click', () => {
      window.romanticAudio.playEnvelopeUnsealSound();
      envelope.classList.add('envelope-opened');
      
      if (window.confetti) {
        window.confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#FF7843', '#FFA178', '#FFE2D6', '#FAF7F2']
        });
      }
    });
  }

  // --- 10. 10 Reasons Flip Cards (Light Mode) ---
  function renderReasons() {
    const container = document.getElementById('reasons-container');
    if (!container) return;

    container.innerHTML = data.reasons.map((reason, i) => `
      <div class="reason-card-wrapper h-56 perspective group cursor-pointer" onclick="this.classList.toggle('flipped')">
        <div class="reason-card-inner relative w-full h-full transition-transform duration-700 preserve-3d">
          
          <!-- Front Face -->
          <div class="absolute inset-0 bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between backface-hidden shadow-md hover:shadow-xl hover:border-orange-200 transition-all">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-mono font-bold tracking-widest text-[#E85B24] px-2.5 py-1 rounded-md bg-[#FFF5F0] border border-orange-200 shadow-sm">
                #${reason.number}
              </span>
              <i data-lucide="heart" class="w-4 h-4 text-[#FF7843]"></i>
            </div>
            <div>
              <h4 class="text-base font-bold text-stone-900 group-hover:text-[#E85B24] transition-colors leading-snug">${reason.title}</h4>
            </div>
            <div class="text-[10px] text-stone-400 flex items-center gap-1 font-bold uppercase tracking-wider">
              <span>Tap to reveal</span>
              <i data-lucide="corner-down-right" class="w-3 h-3 text-[#FF7843]"></i>
            </div>
          </div>

          <!-- Back Face -->
          <div class="absolute inset-0 bg-gradient-to-br from-[#FFF5F0] via-white to-[#FFF5F0] border border-orange-300 rounded-2xl p-5 flex flex-col justify-between backface-hidden rotate-y-180 shadow-xl">
            <span class="text-[10px] font-mono text-[#E85B24] font-bold">#${reason.number} • Forever True</span>
            <p class="text-xs text-stone-700 leading-relaxed font-medium">
              "${reason.description}"
            </p>
            <div class="text-right">
              <span class="text-xs text-[#E85B24] font-handwritten font-bold text-base">Always Megg 🧡</span>
            </div>
          </div>

        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  // --- 11. Love Quiz ---
  function initQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    let currentQ = 0;
    let score = 0;

    function renderQuestion() {
      if (currentQ >= data.quiz.length) {
        renderQuizComplete();
        return;
      }

      const q = data.quiz[currentQ];
      quizContainer.innerHTML = `
        <div class="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-xl">
          <div class="flex items-center justify-between pb-4 border-b border-stone-100">
            <span class="text-xs font-mono font-bold text-[#E85B24]">QUESTION ${currentQ + 1} OF ${data.quiz.length}</span>
            <span class="text-xs text-stone-500 font-bold">Score: ${score}</span>
          </div>

          <h3 class="text-lg md:text-xl font-bold text-stone-900 mt-6 mb-6">
            ${q.question}
          </h3>

          <div class="space-y-3">
            ${q.options.map((opt, i) => `
              <button class="quiz-option-btn w-full text-left p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs md:text-sm font-semibold hover:border-[#FF7843] hover:bg-[#FFF5F0] transition-all flex items-center justify-between group shadow-sm"
                      data-index="${i}">
                <span>${opt}</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-stone-400 group-hover:text-[#FF7843] transition-colors"></i>
              </button>
            `).join('')}
          </div>

          <div id="quiz-feedback" class="mt-4 hidden p-4 rounded-xl text-xs md:text-sm font-medium"></div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      quizContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.getAttribute('data-index'), 10);
          handleAnswer(selected, q);
        });
      });
    }

    function handleAnswer(selected, q) {
      const feedback = document.getElementById('quiz-feedback');
      const allBtns = quizContainer.querySelectorAll('.quiz-option-btn');
      allBtns.forEach(b => b.disabled = true);

      if (selected === q.correct) {
        score++;
        window.romanticAudio.playPopSound();
        if (window.confetti) {
          window.confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
        }
        feedback.className = 'mt-4 p-4 rounded-xl text-xs md:text-sm bg-emerald-50 border border-emerald-300 text-emerald-800 block font-semibold';
        feedback.innerHTML = `<strong>Correct! ✨</strong> ${q.fact}`;
      } else {
        feedback.className = 'mt-4 p-4 rounded-xl text-xs md:text-sm bg-rose-50 border border-rose-300 text-rose-800 block font-semibold';
        feedback.innerHTML = `<strong>Close!</strong> ${q.fact}`;
      }

      setTimeout(() => {
        currentQ++;
        renderQuestion();
      }, 1800);
    }

    function renderQuizComplete() {
      if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
      quizContainer.innerHTML = `
        <div class="bg-white border border-stone-200 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-xl">
          <div class="w-16 h-16 rounded-full bg-[#FFF5F0] border border-orange-300 mx-auto flex items-center justify-center text-3xl mb-4 shadow-sm">
            👑
          </div>
          <h3 class="text-2xl font-bold text-stone-900 mb-2">Megg's #1 Certified Fan</h3>
          <p class="text-stone-600 text-xs sm:text-sm mb-6 font-medium">
            You scored <strong>${score} out of ${data.quiz.length}</strong>! You know every single shade, smile, and moment of Megg through the years.
          </p>
          <button id="restart-quiz-btn" class="px-6 py-2.5 rounded-full bg-[#FF7843] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#E85B24] transition-all shadow-md shadow-orange-500/25">
            Play Again ↻
          </button>
        </div>
      `;

      document.getElementById('restart-quiz-btn')?.addEventListener('click', () => {
        currentQ = 0;
        score = 0;
        renderQuestion();
      });
    }

    renderQuestion();
  }

  // --- 12. Love Counter & Button ---
  function initLoveCounter() {
    const countEl = document.getElementById('love-counter-display');
    const sendLoveBtn = document.getElementById('send-love-heart-btn');
    if (!countEl || !sendLoveBtn) return;

    countEl.innerText = loveCount.toLocaleString();

    sendLoveBtn.addEventListener('click', e => {
      loveCount++;
      localStorage.setItem('megg_love_count', loveCount.toString());
      countEl.innerText = loveCount.toLocaleString();

      window.romanticAudio.playPopSound();
      spawnFloatingHeartAt(e.clientX, e.clientY);

      sendLoveBtn.style.transform = 'scale(0.92)';
      setTimeout(() => sendLoveBtn.style.transform = 'scale(1)', 150);
    });
  }

  function spawnFloatingHeartAt(x, y) {
    const count = 5;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'fixed pointer-events-none z-[99999] text-[#FF7843] select-none';
      heart.innerHTML = ['🧡', '💖', '✨', '🌸', '💝'][Math.floor(Math.random() * 5)];
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.fontSize = `${Math.random() * 16 + 18}px`;
      heart.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      document.body.appendChild(heart);

      const destX = (Math.random() - 0.5) * 120;
      const destY = -120 - Math.random() * 100;

      requestAnimationFrame(() => {
        heart.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 1250);
    }
  }

  // --- 13. Celebration Confetti Cannon ---
  function initCelebrationButton() {
    const celebrateBtn = document.getElementById('celebrate-megg-btn');
    if (!celebrateBtn) return;

    celebrateBtn.addEventListener('click', () => {
      window.romanticAudio.playEnvelopeUnsealSound();
      if (window.confetti) {
        const duration = 3.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          const particleCount = 50 * (timeLeft / duration);
          window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
          window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
      }
    });

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
  }

  // --- 14. Lightbox Modal ---
  function initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    if (!modal) return;

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', prevLightboxPhoto);
    nextBtn?.addEventListener('click', nextLightboxPhoto);

    window.addEventListener('keydown', e => {
      if (!modal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevLightboxPhoto();
        if (e.key === 'ArrowRight') nextLightboxPhoto();
      }
    });

    modal.addEventListener('click', e => {
      if (e.target === modal) closeLightbox();
    });
  }

  window.openLightboxById = function(photoId) {
    const idx = data.photos.findIndex(p => p.id === photoId);
    if (idx !== -1) {
      activeLightboxIndex = idx;
      updateLightboxContent();
      const modal = document.getElementById('lightbox-modal');
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  window.openLightboxBySrc = function(src) {
    const idx = data.photos.findIndex(p => p.src === src);
    if (idx !== -1) {
      window.openLightboxById(data.photos[idx].id);
    } else {
      window.openLightboxById(data.photos[0].id);
    }
  };

  function updateLightboxContent() {
    const photo = data.photos[activeLightboxIndex];
    if (!photo) return;

    const img = document.getElementById('lightbox-img');
    const title = document.getElementById('lightbox-title');
    const caption = document.getElementById('lightbox-caption');
    const era = document.getElementById('lightbox-era');
    const counter = document.getElementById('lightbox-counter');
    const likeBtn = document.getElementById('lightbox-like-btn');

    if (img) img.src = photo.src;
    if (title) title.innerText = photo.title;
    if (caption) caption.innerText = photo.caption;
    if (era) era.innerText = photo.era;
    if (counter) counter.innerText = `${activeLightboxIndex + 1} of ${data.photos.length}`;

    if (likeBtn) {
      const isLiked = likedPhotos[photo.id];
      likeBtn.innerHTML = `
        <i data-lucide="heart" class="w-4 h-4 ${isLiked ? 'text-[#FF7843] fill-[#FF7843]' : 'text-stone-300'}"></i>
        <span class="text-xs text-stone-200">${isLiked ? 'Favorited' : 'Favorite'}</span>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    modal?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function prevLightboxPhoto() {
    activeLightboxIndex = (activeLightboxIndex - 1 + data.photos.length) % data.photos.length;
    updateLightboxContent();
  }

  function nextLightboxPhoto() {
    activeLightboxIndex = (activeLightboxIndex + 1) % data.photos.length;
    updateLightboxContent();
  }

  window.togglePhotoLike = function(event, photoId) {
    if (event) event.stopPropagation();
    likedPhotos[photoId] = !likedPhotos[photoId];
    if (!likedPhotos[photoId]) delete likedPhotos[photoId];
    localStorage.setItem('megg_liked_photos', JSON.stringify(likedPhotos));

    window.romanticAudio.playPopSound();
    if (likedPhotos[photoId]) {
      spawnFloatingHeartAt(event ? event.clientX : window.innerWidth / 2, event ? event.clientY : window.innerHeight / 2);
    }
    renderPhotoGrid();
    updateLightboxContent();
  };

  window.filterGalleryByEra = function(eraTitle, eraId) {
    currentFilter = eraId;
    const filterButtons = document.querySelectorAll('#gallery-filter-buttons .filter-tab-btn');
    filterButtons.forEach(b => {
      if (b.getAttribute('data-filter') === eraId) {
        b.className = 'filter-tab-btn px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border bg-[#FF7843] text-white border-[#FF7843] shadow-md shadow-orange-500/25';
      } else {
        b.className = 'filter-tab-btn px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border bg-white text-stone-700 border-stone-200 hover:border-[#FF7843]/50 shadow-sm';
      }
    });

    applyFilterAndSearch();
    document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  window.clearSearch = function() {
    searchQuery = '';
    const input = document.getElementById('photo-search-input');
    if (input) input.value = '';
    applyFilterAndSearch();
  };

  // --- 15. Smooth Nav + Scroll-Spy + Scroll-Reveal + Back-to-Top ---
  function initFloatingNav() {
    const nav = document.getElementById('floating-navbar');
    if (!nav) return;

    // Nav shadow on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 150) {
        nav.classList.add('shadow-xl', 'backdrop-blur-2xl');
      } else {
        nav.classList.remove('shadow-xl');
      }
    });

    // --- Scroll-Spy: highlight active nav pill ---
    const sections = [
      { id: 'hero',           href: '#hero' },
      { id: 'eras-section',   href: '#eras-section' },
      { id: 'video-section',  href: '#video-section' },
      { id: 'gallery-section',href: '#gallery-section' },
      { id: 'letter-section', href: '#letter-section' },
      { id: 'reasons-section',href: '#reasons-section' }
    ];
    const navLinks = nav.querySelectorAll('a[href^="#"]');

    function updateActiveLink() {
      let current = 'hero';
      sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el && window.scrollY >= el.offsetTop - 160) current = s.id;
      });
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${current}`;
        if (isActive) {
          link.className = 'px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#FF7843] shadow-md shadow-orange-500/25 transition-all';
        } else {
          link.className = 'px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all hidden sm:inline';
          if (link.getAttribute('href') === '#hero') {
            link.className = 'px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all';
          }
        }
      });
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  // --- 16. Scroll-Reveal Entrance Animations ---
  function initScrollReveal() {
    const style = document.createElement('style');
    style.textContent = `
      .reveal-hidden {
        opacity: 0;
        transform: translateY(32px);
        transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .reveal-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);

    const targets = document.querySelectorAll('section, footer');
    targets.forEach((el, i) => {
      el.classList.add('reveal-hidden');
      el.style.transitionDelay = `${(i % 3) * 60}ms`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07 });

    targets.forEach(el => observer.observe(el));
  }

  // --- 17. Back-to-Top Button ---
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
      </svg>
      <span style="font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-top:1px;">Top</span>
    `;
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '28px',
      right: '20px',
      zIndex: '9000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg,#FF7843,#FFA178)',
      color: '#fff',
      border: '2px solid rgba(255,255,255,0.4)',
      boxShadow: '0 6px 24px -4px rgba(255,120,67,0.5)',
      cursor: 'pointer',
      opacity: '0',
      transform: 'translateY(16px) scale(0.85)',
      transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      pointerEvents: 'none'
    });
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      const show = window.scrollY > 400;
      btn.style.opacity = show ? '1' : '0';
      btn.style.transform = show ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.85)';
      btn.style.pointerEvents = show ? 'auto' : 'none';
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.romanticAudio) window.romanticAudio.playPopSound();
    });
  }

  // --- 18. Lightbox Touch Swipe (Mobile) ---
  function initLightboxSwipe() {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;
    let touchStartX = null;

    modal.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    modal.addEventListener('touchend', e => {
      if (touchStartX === null) return;
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextLightboxPhoto();
        else prevLightboxPhoto();
      }
      touchStartX = null;
    }, { passive: true });
  }

  // Kick off finishing features
  initDaysTogether();
  initScrollReveal();
  initBackToTop();
  initLightboxSwipe();

  // --- Days-Together Live Counter (GMT+3 aware) ---
  function initDaysTogether() {
    const el = document.getElementById('days-together-count');
    if (!el) return;
    function update() {
      el.textContent = getDaysTogetherGMT3().toLocaleString() + ' days';
    }
    update();
    setInterval(update, 60000);
  }

  // Calculate days since Mar 15, 2025 using GMT+3 date (day flips at GMT+3 midnight)
  function getDaysTogetherGMT3() {
    const now = new Date();
    // Shift 'now' into GMT+3
    const gmt3 = new Date(now.getTime() + (3 * 60 - now.getTimezoneOffset()) * 60000);
    // Build a plain UTC date representing today in GMT+3 (no time component)
    const todayGMT3 = Date.UTC(gmt3.getUTCFullYear(), gmt3.getUTCMonth(), gmt3.getUTCDate());
    // Start date: March 15, 2025 (plain UTC date)
    const startGMT3 = Date.UTC(2025, 2, 15);
    return Math.floor((todayGMT3 - startGMT3) / 86400000);
  }

  // --- Live GMT+3 Clock ---
  function initGMT3Clock() {
    const clockEl    = document.getElementById('gmt3-clock');
    const dateEl     = document.getElementById('gmt3-date');
    const clockEl2   = document.getElementById('gmt3-clock-footer');
    const dateEl2    = document.getElementById('gmt3-date-footer');
    const daysFooter = document.getElementById('days-together-footer');

    const dayNames   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    function tick() {
      const now  = new Date();
      // Convert to GMT+3
      const gmt3 = new Date(now.getTime() + (3 * 60 - now.getTimezoneOffset()) * 60000);

      const h = String(gmt3.getUTCHours()).padStart(2, '0');
      const m = String(gmt3.getUTCMinutes()).padStart(2, '0');
      const s = String(gmt3.getUTCSeconds()).padStart(2, '0');
      const timeStr = `${h}:${m}:${s}`;

      const dow     = dayNames[gmt3.getUTCDay()];
      const d       = gmt3.getUTCDate();
      const mon     = monthNames[gmt3.getUTCMonth()];
      const yr      = gmt3.getUTCFullYear();
      const dateStr = `${dow}, ${d} ${mon} ${yr}`;

      if (clockEl)  clockEl.textContent  = timeStr;
      if (dateEl)   dateEl.textContent   = dateStr;
      if (clockEl2) clockEl2.textContent = timeStr;
      if (dateEl2)  dateEl2.textContent  = dateStr;

      // Days counter also uses GMT+3 — ticks up at GMT+3 midnight
      if (daysFooter) {
        daysFooter.textContent = getDaysTogetherGMT3().toLocaleString() + ' days';
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  initDaysTogether();
  initGMT3Clock();
});
