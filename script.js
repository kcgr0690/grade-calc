function toNumber(value) {
    return Number(String(value).trim());
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
let editingId = null;

function addEntryFromForm() {
    const nameInput = document.getElementById('assignment-name');
    const scoreInput = document.getElementById('score');
    const weightInput = document.getElementById('weight');

    const name = String(nameInput.value || '').trim();
    const score = toNumber(scoreInput.value);
    const weight = toNumber(weightInput.value);

    if (!name) {
        alert('Please enter an assignment name.');
        nameInput.focus();
        return;
    }

    if (!Number.isFinite(score) || score < 0 || score > 100) {
        alert('Please enter a valid score between 0 and 100.');
        scoreInput.focus();
        return;
    }

    if (!Number.isFinite(weight) || weight < 0 || weight > 100) {
        alert('Please enter a valid weight (0-100).')
        return;
    }

    entries.push({
        id: nextId++,
        name,
        score,
        weight
    });

    nameInput.value = '';
    scoreInput.value = '';
    weightInput.value = '';
    nameInput.focus();

    renderEntries()
}

function updateResults() {
    const out = document.getElementById('final-grade');
    const { average, totalWeight} = calculateWeightedAverage();

    if (entries.length === 0) {
        out.textContent = 'No entries yet.'
        return;
    }

    if (totalWeight === 0) {
        out.textContent = 'Total weight is 0, please add weights greater than 0.';
        return;
    }

    const avgRounded = Number(average).toFixed(2);

    const letter = getLetterGrade(average);

    out.textContent = `${avgRounded} (${letter})`;
}

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

    const tdActions = document.createElement('td');
    const editBtn = document.createElement('td');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.dataset.id = entry.id;
    editBtn.addEventListener('click', () => {
        
    })
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = 'Delete';
    delBtn.dataset.id = entry.id;
    delBtn.addEventListener('click', () => {
        deleteEntryById(entry.id);
    });
    tdActions.appendChild(delBtn);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });

  updateResults();
}

function calculateWeightedAverage() {
    if (entries.length === 0) return {average: null, totalWeight: 0};
    let weightedSum = 0;
    let totalWeight = 0;

    for (const e of entries) {
        const s = toNumber(e.score);
        const w = toNumber(e.weight);

        if (!Number.isFinite(s) || !Number.isFinite(w)) {
            continue;
        }

        weightedSum += s * w;
        totalWeight += w;
    }

    if (totalWeight === 0) {
        return {average: null, totalWeight: 0};
    }

    const average= weightedSum / totalWeight;
    return { average, totalWeight };
}

function getLetterGrade(average) {
    if (average === null) return '-';

    if (average >= 90) return 'A';
    if (average >= 80) return 'B';
    if (average >= 70) return 'C';
    if (average >= 60) return 'D';

    return 'F';
}

document.getElementById('add-entry-button').addEventListener('click', addEntryFromForm);

