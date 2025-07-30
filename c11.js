const form = document.getElementById('url-form');
const resultsDiv = document.getElementById('results');
const statisticsDiv = document.getElementById('statistics');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const originalUrl = document.getElementById('original-url').value;

  if (!originalUrl || !originalUrl.startsWith('http')) {
    alert('Invalid URL');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/shorten-url', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl }),
    });

    const data = await response.json();
    const { shortenedUrl, expiryDate } = data;

    const resultHtml = `
      <p>Original URL: ${originalUrl}</p>
      <p>Shortened URL: <a href="${shortenedUrl}" target="_blank">${shortenedUrl}</a></p>
      <p>Expiry Date: ${expiryDate}</p>
    `;
    resultsDiv.innerHTML += resultHtml;

    const statistics = JSON.parse(localStorage.getItem('statistics')) || [];
    statistics.push({ originalUrl, shortenedUrl, expiryDate });
    localStorage.setItem('statistics', JSON.stringify(statistics));

    displayStatistics();
    form.reset();
  } catch (err) {
    console.error('Error:', err);
    alert('Failed to shorten the URL. Make sure your backend is running.');
  }
});

function displayStatistics() {
  const statistics = JSON.parse(localStorage.getItem('statistics')) || [];
  const statisticsHtml = statistics.map(stat => `
    <p>Original URL: ${stat.originalUrl}</p>
    <p>Shortened URL: <a href="${stat.shortenedUrl}" target="_blank">${stat.shortenedUrl}</a></p>
    <p>Expiry Date: ${stat.expiryDate}</p>
    <hr>
  `).join('');
  statisticsDiv.innerHTML = statisticsHtml;
}
