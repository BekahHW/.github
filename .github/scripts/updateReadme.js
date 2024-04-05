const fs = require('fs');
const axios = require('axios');
const path = require('path');

async function fetchLatestHighlight() {
  try {
    const response = await axios.get('https://api.opensauced.pizza/v2/users/bekahhw/highlights?page=1&limit=3&range=30&prev_days_start_date=0', {
      headers: { Accept: 'application/json' }
    });
    if (response.data.data && response.data.data.length) {
      return response.data.data[0].highlight; // Assuming the first item is the latest
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch the latest highlight:', error);
    return null;
  }
}

async function updateReadme(highlight) {
  const readmePath = path.join(process.cwd(), 'README.md');
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  const markerStart = '<!-- OPENSAUCED_START -->';
  const markerEnd = '<!-- OPENSAUCED_END -->';
  const startIndex = readmeContent.indexOf(markerStart) + markerStart.length;
  const endIndex = readmeContent.indexOf(markerEnd);

  if (startIndex < markerStart.length || endIndex < 0 || endIndex <= startIndex) {
    console.error('Markers not found in README');
    return;
  }

  // Replace content between markers with the new highlight
  readmeContent = readmeContent.substring(0, startIndex) + '\n' + highlight + '\n' + readmeContent.substring(endIndex);
  fs.writeFileSync(readmePath, readmeContent);
  console.log('README updated with the latest highlight');
}

(async () => {
  const highlight = await fetchLatestHighlight();
  if (highlight) {
    await updateReadme(highlight);
  } else {
    console.log('No new highlight to update');
  }
})();
