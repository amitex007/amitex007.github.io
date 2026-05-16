const DASHBOARD_API_URL = 'https://amitosh.dev/api/dashboard';

const nav = document.querySelector(".nav");
const navMenu = document.querySelector(".nav-items");
const btnToggleNav = document.querySelector(".menu-btn");
const yearEl = document.getElementById("footer-year");

window.addEventListener('load', () => {
  let preloader = document.getElementById('preloader');
  preloader.classList.add('post-finish');
  loadDashboardData();
});

const lightThemeClassIcon = "fa-sun";
const darkThemeClassIcon = "fa-lightbulb";

const toggleNav = () => {
  nav.classList.toggle("hidden");
  document.body.classList.toggle("lock-screen");

  if (nav.classList.contains("hidden")) {
    btnToggleNav.innerHTML = '<i class="fas fa-bars"></i>';
  } else {
    setTimeout(() => {
      btnToggleNav.innerHTML = '<i class="fas fa-times"></i>';
    }, 475);
  }
};

btnToggleNav.addEventListener("click", toggleNav);

navMenu.addEventListener("click", (e) => {
  if (e.target.localName === "a") {
    toggleNav();
  }
});

document.body.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !nav.classList.contains("hidden")) {
    toggleNav();
  }
});

const switchThemeEl = document.querySelector('input[type="checkbox"]');
const storedTheme = localStorage.getItem("theme");

switchThemeEl.checked = storedTheme === "dark" || storedTheme === null;

const darkToggleButton = document.getElementById('dark-mode-toggle');
const toggleIcon = document.getElementById('toggle-icon');

let themeToggleState = storedTheme === "dark" || storedTheme === null;

if (themeToggleState) {
  toggleIcon.classList.remove(lightThemeClassIcon);
  toggleIcon.classList.add(darkThemeClassIcon);
  localStorage.setItem("theme", "dark");
} else {
  toggleIcon.classList.remove(darkThemeClassIcon);
  toggleIcon.classList.add(lightThemeClassIcon);
}

const themeToggleHandler = () => {
  if (themeToggleState) {
    toggleIcon.classList.remove(darkThemeClassIcon);
    toggleIcon.classList.add(lightThemeClassIcon);

    document.body.classList.remove("dark");
    document.body.classList.add("light");
    localStorage.setItem("theme", "light");
    switchThemeEl.checked = false;
    themeToggleState = false;
  } else {
    toggleIcon.classList.remove(lightThemeClassIcon);
    toggleIcon.classList.add(darkThemeClassIcon);
    toggleIcon.classList.add('dark-selection');

    document.body.classList.add("dark");
    document.body.classList.remove("light");
    localStorage.setItem("theme", "dark");
    switchThemeEl.checked = true;
    themeToggleState = true;
  }
};

darkToggleButton.addEventListener('click', themeToggleHandler);
switchThemeEl.addEventListener("click", themeToggleHandler);

const lastFocusedEl = document.querySelector('a[data-focused="last-focused"]');

document.body.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && document.activeElement === lastFocusedEl) {
    e.preventDefault();
    btnToggleNav.focus();
  }
});

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

async function loadDashboardData() {
  const loadingEl = document.getElementById('dashboard-loading');
  const errorEl = document.getElementById('dashboard-error');
  const contentEl = document.getElementById('dashboard-content');

  loadingEl.style.display = 'flex';
  errorEl.style.display = 'none';

  const existingCards = contentEl.querySelectorAll('.dashboard-card');
  existingCards.forEach(card => card.remove());

  try {
    const response = await fetch(DASHBOARD_API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    loadingEl.style.display = 'none';
    renderDashboard(data);
    
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    loadingEl.style.display = 'none';
    errorEl.style.display = 'flex';
  }
}

function renderDashboard(data) {
  const contentEl = document.getElementById('dashboard-content');
  
  if (data.currentlyReading) {
    contentEl.appendChild(createBookCard(data.currentlyReading));
  }

  if (data.currentlyListening) {
    contentEl.appendChild(createMusicCard(data.currentlyListening));
  }

  if (data.currentlyWatching) {
    contentEl.appendChild(createWatchingCard(data.currentlyWatching));
  }

  if (data.currentlyPlaying) {
    contentEl.appendChild(createGamingCard(data.currentlyPlaying));
  }

  if (data.currentlyLearning) {
    contentEl.appendChild(createLearningCard(data.currentlyLearning));
  }

  if (data.recentActivity) {
    contentEl.appendChild(createActivityCard(data.recentActivity));
  }

  if (data.stats) {
    contentEl.appendChild(createStatsCard(data.stats));
  }

  if (data.quote) {
    contentEl.appendChild(createQuoteCard(data.quote));
  }
}

function createBookCard(book) {
  const card = document.createElement('div');
  card.className = 'dashboard-card reading-card';
  
  let coverHtml = '';
  if (book.coverUrl) {
    coverHtml = `<img src="${escapeHtml(book.coverUrl)}" alt="${escapeHtml(book.title)} cover" class="card-cover" />`;
  } else {
    coverHtml = `<div class="card-cover-placeholder"><i class="fas fa-book"></i></div>`;
  }
  
  let progressHtml = '';
  if (book.progress !== undefined) {
    progressHtml = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${book.progress}%"></div>
      </div>
      <span class="progress-text">${book.progress}% complete</span>
    `;
  }
  
  card.innerHTML = `
    <div class="card-header">
      <i class="fas fa-book-open card-icon"></i>
      <h3 class="h4">Currently Reading</h3>
    </div>
    <div class="card-content">
      <div class="card-media">
        ${coverHtml}
        <div class="card-details">
          <h4 class="card-title">${escapeHtml(book.title)}</h4>
          ${book.author ? `<p class="card-subtitle">by ${escapeHtml(book.author)}</p>` : ''}
          ${book.genre ? `<span class="card-tag">${escapeHtml(book.genre)}</span>` : ''}
        </div>
      </div>
      ${progressHtml}
    </div>
    ${book.link ? `<a href="${escapeHtml(book.link)}" target="_blank" rel="noopener" class="card-link">View on Goodreads <i class="fas fa-external-link-alt"></i></a>` : ''}
  `;
  
  return card;
}

function createMusicCard(music) {
  const card = document.createElement('div');
  card.className = 'dashboard-card music-card';
  
  let coverHtml = '';
  if (music.albumArt) {
    coverHtml = `<img src="${escapeHtml(music.albumArt)}" alt="${escapeHtml(music.album || music.track)} cover" class="card-cover" />`;
  } else {
    coverHtml = `<div class="card-cover-placeholder"><i class="fas fa-music"></i></div>`;
  }
  
  let isPlaying = music.isPlaying !== false;
  let statusHtml = isPlaying 
    ? '<span class="now-playing"><span class="playing-indicator"></span> Now Playing</span>'
    : '<span class="recently-played">Recently Played</span>';
  
  card.innerHTML = `
    <div class="card-header">
      <i class="fas fa-headphones card-icon"></i>
      <h3 class="h4">Currently Listening</h3>
    </div>
    <div class="card-content">
      <div class="card-media">
        ${coverHtml}
        <div class="card-details">
          <h4 class="card-title">${escapeHtml(music.track)}</h4>
          ${music.artist ? `<p class="card-subtitle">by ${escapeHtml(music.artist)}</p>` : ''}
          ${music.album ? `<p class="card-album">${escapeHtml(music.album)}</p>` : ''}
          ${statusHtml}
        </div>
      </div>
    </div>
    ${music.link ? `<a href="${escapeHtml(music.link)}" target="_blank" rel="noopener" class="card-link">Listen on Spotify <i class="fas fa-external-link-alt"></i></a>` : ''}
  `;
  
  return card;
}

function createWatchingCard(watching) {
  const card = document.createElement('div');
  card.className = 'dashboard-card watching-card';
  
  let coverHtml = '';
  if (watching.posterUrl) {
    coverHtml = `<img src="${escapeHtml(watching.posterUrl)}" alt="${escapeHtml(watching.title)} poster" class="card-cover" />`;
  } else {
    coverHtml = `<div class="card-cover-placeholder"><i class="fas fa-tv"></i></div>`;
  }
  
  let episodeInfo = '';
  if (watching.season && watching.episode) {
    episodeInfo = `<span class="card-tag">S${watching.season}E${watching.episode}</span>`;
  }
  
  card.innerHTML = `
    <div class="card-header">
      <i class="fas fa-tv card-icon"></i>
      <h3 class="h4">Currently Watching</h3>
    </div>
    <div class="card-content">
      <div class="card-media">
        ${coverHtml}
        <div class="card-details">
          <h4 class="card-title">${escapeHtml(watching.title)}</h4>
          ${watching.type ? `<p class="card-subtitle">${escapeHtml(watching.type)}</p>` : ''}
          ${episodeInfo}
          ${watching.platform ? `<span class="card-platform">${escapeHtml(watching.platform)}</span>` : ''}
        </div>
      </div>
    </div>
    ${watching.link ? `<a href="${escapeHtml(watching.link)}" target="_blank" rel="noopener" class="card-link">View Details <i class="fas fa-external-link-alt"></i></a>` : ''}
  `;
  
  return card;
}

function createGamingCard(game) {
  const card = document.createElement('div');
  card.className = 'dashboard-card gaming-card';
  
  let coverHtml = '';
  if (game.coverUrl) {
    coverHtml = `<img src="${escapeHtml(game.coverUrl)}" alt="${escapeHtml(game.title)} cover" class="card-cover" />`;
  } else {
    coverHtml = `<div class="card-cover-placeholder"><i class="fas fa-gamepad"></i></div>`;
  }
  
  let hoursHtml = '';
  if (game.hoursPlayed !== undefined) {
    hoursHtml = `<span class="card-stat"><i class="fas fa-clock"></i> ${game.hoursPlayed} hours</span>`;
  }
  
  card.innerHTML = `
    <div class="card-header">
      <i class="fas fa-gamepad card-icon"></i>
      <h3 class="h4">Currently Playing</h3>
    </div>
    <div class="card-content">
      <div class="card-media">
        ${coverHtml}
        <div class="card-details">
          <h4 class="card-title">${escapeHtml(game.title)}</h4>
          ${game.platform ? `<p class="card-subtitle">${escapeHtml(game.platform)}</p>` : ''}
          ${hoursHtml}
          ${game.achievement ? `<span class="card-achievement"><i class="fas fa-trophy"></i> ${escapeHtml(game.achievement)}</span>` : ''}
        </div>
      </div>
    </div>
    ${game.link ? `<a href="${escapeHtml(game.link)}" target="_blank" rel="noopener" class="card-link">View on Steam <i class="fas fa-external-link-alt"></i></a>` : ''}
  `;
  
  return card;
}

function createLearningCard(learning) {
  const card = document.createElement('div');
  card.className = 'dashboard-card learning-card';
  
  let coverHtml = '';
  if (learning.imageUrl) {
    coverHtml = `<img src="${escapeHtml(learning.imageUrl)}" alt="${escapeHtml(learning.topic)} image" class="card-cover" />`;
  } else {
    coverHtml = `<div class="card-cover-placeholder"><i class="fas fa-graduation-cap"></i></div>`;
  }
  
  let progressHtml = '';
  if (learning.progress !== undefined) {
    progressHtml = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${learning.progress}%"></div>
      </div>
      <span class="progress-text">${learning.progress}% complete</span>
    `;
  }
  
  card.innerHTML = `
    <div class="card-header">
      <i class="fas fa-graduation-cap card-icon"></i>
      <h3 class="h4">Currently Learning</h3>
    </div>
    <div class="card-content">
      <div class="card-media">
        ${coverHtml}
        <div class="card-details">
          <h4 class="card-title">${escapeHtml(learning.topic)}</h4>
          ${learning.platform ? `<p class="card-subtitle">on ${escapeHtml(learning.platform)}</p>` : ''}
          ${learning.instructor ? `<p class="card-instructor">by ${escapeHtml(learning.instructor)}</p>` : ''}
        </div>
      </div>
      ${progressHtml}
    </div>
    ${learning.link ? `<a href="${escapeHtml(learning.link)}" target="_blank" rel="noopener" class="card-link">View Course <i class="fas fa-external-link-alt"></i></a>` : ''}
  `;
  
  return card;
}

function createActivityCard(activities) {
  const card = document.createElement('div');
  card.className = 'dashboard-card activity-card wide-card';
  
  const activityList = Array.isArray(activities) ? activities : [activities];
  
  const activitiesHtml = activityList.slice(0, 5).map(activity => `
    <li class="activity-item">
      <span class="activity-icon"><i class="${getActivityIcon(activity.type)}"></i></span>
      <span class="activity-text">${escapeHtml(activity.description)}</span>
      <span class="activity-time">${formatTimeAgo(activity.timestamp)}</span>
    </li>
  `).join('');
  
  card.innerHTML = `
    <div class="card-header">
      <i class="fas fa-stream card-icon"></i>
      <h3 class="h4">Recent Activity</h3>
    </div>
    <div class="card-content">
      <ul class="activity-list">
        ${activitiesHtml}
      </ul>
    </div>
  `;
  
  return card;
}

function createStatsCard(stats) {
  const card = document.createElement('div');
  card.className = 'dashboard-card stats-card';
  
  const statsHtml = Object.entries(stats).map(([key, value]) => `
    <div class="stat-item">
      <span class="stat-value">${escapeHtml(String(value))}</span>
      <span class="stat-label">${formatStatLabel(key)}</span>
    </div>
  `).join('');
  
  card.innerHTML = `
    <div class="card-header">
      <i class="fas fa-chart-bar card-icon"></i>
      <h3 class="h4">Stats</h3>
    </div>
    <div class="card-content">
      <div class="stats-grid">
        ${statsHtml}
      </div>
    </div>
  `;
  
  return card;
}

function createQuoteCard(quote) {
  const card = document.createElement('div');
  card.className = 'dashboard-card quote-card wide-card';
  
  card.innerHTML = `
    <div class="card-header">
      <i class="fas fa-quote-left card-icon"></i>
      <h3 class="h4">Quote of the Day</h3>
    </div>
    <div class="card-content">
      <blockquote class="dashboard-quote">
        "${escapeHtml(quote.text)}"
      </blockquote>
      ${quote.author ? `<p class="quote-author">— ${escapeHtml(quote.author)}</p>` : ''}
    </div>
  `;
  
  return card;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getActivityIcon(type) {
  const icons = {
    'commit': 'fas fa-code-commit',
    'pr': 'fas fa-code-pull-request',
    'issue': 'fas fa-circle-exclamation',
    'star': 'fas fa-star',
    'fork': 'fas fa-code-fork',
    'comment': 'fas fa-comment',
    'review': 'fas fa-eye',
    'release': 'fas fa-tag',
    'default': 'fas fa-circle'
  };
  return icons[type] || icons['default'];
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return '';
  
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatStatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
