function toNumber(value) {
    return Numver(String(value).trim());
}

const entries = [];
let nextId = 1;

function renderEntries() {
  const tbody = document.getElementById('entries-tbody');
  tbody.innerHTML = '';

  entries.forEach((entry, i) => {
    const tr = document.createElement('tr');

    const thIndex = document.createElement('th');
    thIndex.scope = 'row';
    thIndex.textContent = i + 1;
    tr.appendChild(thIndex);
    
    const tdName = document.createElement('td');
    tdName.textContent = entry.name;
    tr.appendChild(tdName);

    const tdScore = document.createElement('td');
});
}