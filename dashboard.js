const DASHBOARD_API_URL = 'https://amitosh.dev/api/dashboard';

document.addEventListener('DOMContentLoaded', () => {
  fetchDashboardData();
});

async function fetchDashboardData() {
  try {
    const response = await fetch(DASHBOARD_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    renderDashboard(data);
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    renderError();
  }
}

function renderDashboard(data) {
  renderListeningCard(data.currentlyPlayingSong);
  renderReadingCard(data.currentlyReading);
  renderLastUpdated(data.updatedAt);
}

function renderListeningCard(song) {
  const container = document.getElementById('listening-content');
  const statusIndicator = document.getElementById('playing-status');
  
  if (!song) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-music"></i>
        <p>Not listening to anything right now</p>
      </div>
    `;
    statusIndicator.classList.add('inactive');
    statusIndicator.querySelector('.status-text').textContent = 'Offline';
    return;
  }

  if (song.isPlaying) {
    statusIndicator.classList.remove('inactive');
    statusIndicator.querySelector('.status-text').textContent = 'Live';
  } else {
    statusIndicator.classList.add('inactive');
    statusIndicator.querySelector('.status-text').textContent = 'Paused';
  }

  const trackUrl = song.trackUrl || '#';
  const albumArtUrl = song.albumArtUrl || 'assets/images/default-album.png';
  
  container.innerHTML = `
    <a href="${trackUrl}" target="_blank" rel="noopener" class="song-link">
      <div class="song-info">
        <div class="album-art-wrapper">
          <img src="${albumArtUrl}" alt="${song.album || 'Album Art'}" class="album-art" />
          ${song.isPlaying ? '<div class="playing-animation"><span></span><span></span><span></span></div>' : ''}
        </div>
        <div class="song-details">
          <h3 class="song-name">${song.name || 'Unknown Track'}</h3>
          <p class="song-artist">${song.artist || 'Unknown Artist'}</p>
          <p class="song-album">${song.album || 'Unknown Album'}</p>
        </div>
      </div>
      <div class="spotify-badge">
        <i class="fab fa-spotify"></i>
        <span>Play on Spotify</span>
      </div>
    </a>
  `;
}

function renderReadingCard(books) {
  const container = document.getElementById('reading-content');
  
  if (!books || books.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-book"></i>
        <p>No books in progress right now</p>
        <span class="empty-hint">Check back later!</span>
      </div>
    `;
    return;
  }

  const booksHtml = books.map(book => `
    <div class="book-item">
      ${book.coverUrl ? `<img src="${book.coverUrl}" alt="${book.title}" class="book-cover" />` : '<div class="book-cover-placeholder"><i class="fas fa-book"></i></div>'}
      <div class="book-details">
        <h3 class="book-title">${book.title || 'Unknown Title'}</h3>
        <p class="book-author">${book.author || 'Unknown Author'}</p>
        ${book.progress ? `<div class="book-progress"><div class="progress-bar" style="width: ${book.progress}%"></div><span>${book.progress}%</span></div>` : ''}
      </div>
    </div>
  `).join('');

  container.innerHTML = `<div class="books-list">${booksHtml}</div>`;
}

function renderLastUpdated(timestamp) {
  const container = document.getElementById('last-updated');
  
  if (!timestamp) {
    container.innerHTML = `
      <i class="fas fa-clock"></i>
      <span>Last updated: Unknown</span>
    `;
    return;
  }

  const date = new Date(timestamp);
  const timeAgo = getTimeAgo(date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  container.innerHTML = `
    <i class="fas fa-clock"></i>
    <span>Last updated: ${timeAgo}</span>
    <span class="update-date">(${formattedDate})</span>
  `;
}

function getTimeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minute${Math.floor(seconds / 60) !== 1 ? 's' : ''} ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) !== 1 ? 's' : ''} ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) !== 1 ? 's' : ''} ago`;
  return `${Math.floor(seconds / 604800)} week${Math.floor(seconds / 604800) !== 1 ? 's' : ''} ago`;
}

function renderError() {
  const listeningContainer = document.getElementById('listening-content');
  const readingContainer = document.getElementById('reading-content');
  const statusIndicator = document.getElementById('playing-status');
  const lastUpdated = document.getElementById('last-updated');

  statusIndicator.classList.add('inactive');
  statusIndicator.querySelector('.status-text').textContent = 'Offline';

  const errorHtml = `
    <div class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <p>Unable to load data</p>
      <button class="retry-btn" onclick="fetchDashboardData()">
        <i class="fas fa-redo"></i> Retry
      </button>
    </div>
  `;

  listeningContainer.innerHTML = errorHtml;
  readingContainer.innerHTML = errorHtml;

  lastUpdated.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i>
    <span>Failed to fetch updates</span>
  `;
}
