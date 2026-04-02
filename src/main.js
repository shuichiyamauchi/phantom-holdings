import './style.css';
import games from './games.json';

// ========================================
// Particle Background
// ========================================
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  const particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    };
  }

  function init() {
    resize();
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
}

// ========================================
// Status Labels
// ========================================
const STATUS_MAP = {
  released: { label: 'Released', class: 'released' },
  dev: { label: 'In Dev', class: 'dev' },
  coming: { label: 'Coming Soon', class: 'coming' },
};

// ========================================
// Format Date
// ========================================
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
  });
}

// ========================================
// Render Game Cards
// ========================================
function renderGames(filteredGames) {
  const grid = document.getElementById('games-grid');
  if (!grid) return;

  if (filteredGames.length === 0) {
    grid.innerHTML = '<div class="empty-state">該当するゲームが見つかりません</div>';
    return;
  }

  grid.innerHTML = filteredGames
    .map(
      (game, i) => `
    <a
      href="${game.url}"
      target="_blank"
      rel="noopener noreferrer"
      class="game-card"
      id="game-card-${game.id}"
      style="--card-color: ${game.color}; animation: cardFadeIn 0.5s ${i * 0.08}s var(--ease-out) both;"
    >
      <div class="game-card-thumbnail">
        <img src="${game.thumbnail}" alt="${game.title}" loading="lazy" />
        <span class="game-card-status ${STATUS_MAP[game.status]?.class || 'released'}">
          ${STATUS_MAP[game.status]?.label || game.status}
        </span>
      </div>
      <div class="game-card-body">
        <h3 class="game-card-title">${game.title}</h3>
        <p class="game-card-subtitle">${game.subtitle}</p>
        <p class="game-card-description">${game.description}</p>
        <div class="game-card-tags">
          ${game.tags.map((t) => `<span class="game-card-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="game-card-footer">
        <span class="game-card-date">${formatDate(game.releaseDate)}</span>
        <span class="game-card-play">
          プレイする
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </div>
    </a>
  `
    )
    .join('');
}

// ========================================
// Render Filter Bar
// ========================================
function renderFilters() {
  const filterBar = document.getElementById('filter-bar');
  if (!filterBar) return;

  // Collect unique tags
  const allTags = new Set();
  games.forEach((g) => g.tags.forEach((t) => allTags.add(t)));

  const tags = ['すべて', ...Array.from(allTags)];

  filterBar.innerHTML = tags
    .map(
      (tag, i) => `
    <button
      class="filter-btn${i === 0 ? ' active' : ''}"
      data-tag="${tag}"
      id="filter-${tag}"
    >${tag}</button>
  `
    )
    .join('');

  // Event listeners
  filterBar.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const tag = btn.dataset.tag;
      if (tag === 'すべて') {
        renderGames(games);
      } else {
        renderGames(games.filter((g) => g.tags.includes(tag)));
      }
    });
  });
}

// ========================================
// Render About Stats
// ========================================
function renderStats() {
  const statsEl = document.getElementById('about-stats');
  if (!statsEl) return;

  const releasedCount = games.filter((g) => g.status === 'released').length;
  const totalTags = new Set();
  games.forEach((g) => g.tags.forEach((t) => totalTags.add(t)));

  statsEl.innerHTML = `
    <div class="about-stat">
      <div class="about-stat-value">${games.length}</div>
      <div class="about-stat-label">Total Projects</div>
    </div>
    <div class="about-stat">
      <div class="about-stat-value">${releasedCount}</div>
      <div class="about-stat-label">Released</div>
    </div>
    <div class="about-stat">
      <div class="about-stat-value">${totalTags.size}</div>
      <div class="about-stat-label">Categories</div>
    </div>
  `;
}

// ========================================
// Header Scroll Effect
// ========================================
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(8, 9, 14, 0.92)';
    } else {
      header.style.background = 'rgba(8, 9, 14, 0.7)';
    }
  });
}

// ========================================
// Intersection Observer for Animations
// ========================================
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.section-header, .about-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)';
    observer.observe(el);
  });
}

// ========================================
// Init
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  renderFilters();
  renderGames(games);
  renderStats();
  initHeaderScroll();

  // Delay scroll animations to avoid flash
  requestAnimationFrame(() => {
    initScrollAnimations();
  });
});
