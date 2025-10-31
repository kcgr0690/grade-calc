function toNumber(value) {
    return Numver(String(value).trim());
}

function deleteEntryById(id) {
    const idx = entries.findIndex(e => e.id === id);
    if (idx !== -1) {
        entries.splice(idx, 1);
        renderEntries();
    }
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
    tdScore.textContent = Number(entry.score).toFixed(2);
    tr.appendChild(tdScore);

    const tdWeight = document.createElement('td');
    tdWeight.textContent = Number(entry.weight).toFixed(2);
    tr.appendChild(tdWeight);

    //im gonna try to add a delete button

    const tdActions = document.createElement('td');
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = 'Delete';
    delBtn.dataset.id = entry.id;
    delBtn.addEventListener('click', () => {
        delEntryById(entry.id);
    });
    tdActions.appendChild(tdActions);

    tbody.appendChild(tr);

});

    updateResults();
}