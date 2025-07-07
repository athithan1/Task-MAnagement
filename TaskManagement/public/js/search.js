document.addEventListener('DOMContentLoaded', function() {
  let documents = [];

  fetch('/lunr.json')
    .then(response => response.json())
    .then(data => {
      documents = data;
    });

  document.getElementById('search-box').addEventListener('input', function() {
    const query = this.value.trim();
    const resultsList = document.getElementById('search-results');
    resultsList.innerHTML = '';
    if (!query) return;
    // Show suggestions for any substring match in title (case-insensitive)
    const suggestions = documents.filter(doc => doc.title.toLowerCase().includes(query.toLowerCase()));
    suggestions.forEach(function(doc) {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${doc.uri}">${doc.title}</a>`;
      resultsList.appendChild(li);
    });
  });
});
