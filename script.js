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

function clearAllEntries() {
    if (entries.length === 0) {
        alert('No entries to clear.');
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete all ${entries.length} entries? This cannot be undone.`)

    if (confirmed) {
        entries.length = 0;
        nextId = 1;
        renderEntries();
        alert('All entries have been cleared.');
    }
}

const entries = [];
let nextId = 1;
let editingId = null;
let targetGrade = 90;

function handleFormSubmit() {
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
        weightInput.focus();
        return;
    }

    if (editingId !== null) {
        const entryToUpdate = entries.find(e=> e.id === editingId);
        if (entryToUpdate) {
            entryToUpdate.name = name;
            entryToUpdate.score = score;
            entryToUpdate.weight = weight;
        }
        editingId = null;
        document.getElementById('add-entry-button').textContent = 'Add Entry';
    } else {
        entries.push({
            id:nextId++,
            name,
            score,
            weight
        })
    }

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

    if (totalWeight > 100) {
        out.textContent = `${avgRounded} (${letter}) - WARNING: Total weight is ${totalWeight.toFixed(2)}% (over 100%)`;
        out.style.color = 'red';
    } else if (totalWeight < 100) {
        out.textContent = `${avgRounded} (${letter}) - WARNING: Total weight is ${totalWeight.toFixed(2)}% (under 100%)`;
        out.style.color = 'orange';
    } else {
        out.textContent = `${avgRounded} (${letter}) - Total weight: ${totalWeight.toFixed(2)}%`;
        out.style.color = 'black';
    }
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
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.dataset.id = entry.id;
    editBtn.addEventListener('click', () => {
        editingId = entry.id;
        const entryToEdit = entries.find(e => e.id === editingId);
        if (entryToEdit) {
            document.getElementById('assignment-name').value = entryToEdit.name;
            document.getElementById('score').value = entryToEdit.score;
            document.getElementById('weight').value = entryToEdit.weight;
            document.getElementById('add-entry-button').textContent = 'Update Entry';
        }
    });
    tdActions.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = 'Delete';
    delBtn.dataset.id = entry.id;
    delBtn.addEventListener('click', () => {
        const confirmed = confirm(`Are you sure you want to delete "${entry.name}"?`);
        if (confirmed) {
            deleteEntryById(entry.id);
        }
    });
    tdActions.appendChild(delBtn);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });

  updateResults();
  calculateWhatIfScore();
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

function calculateWhatIfScore() {
    const slider = document.getElementById('remaining-weight');
    const sliderValue = document.getElementById('remaining-weight-value');
    const resultElement = document.getElementById('what-if-result');
    const remainingWeight = toNumber(slider.value);
    sliderValue.textContent = remainingWeight.toFixed(0);

    if (entries.length === 0) {
        resultElement.textContent = 'Add some entries to calculate.';
        return;
    }

    const { average: currentAverage, totalWeight: currentWeight } = calculateWeightedAverage();

    if (currentWeight === 0) {
        resultElement.textContent = 'Current weight is 0. Add weights greater than 0';
        return;
    }

    if (remainingWeight === 0) {
        resultElement.textContent = 'Slide to set a remaining assignment weight.';
        return;
    }

    const currentWeightedSum = currentAverage * currentWeight;
    const totalWeightWithRemaining = currentWeight + remainingWeight;

    const neededScore = (targetGrade * totalWeightWithRemaining - currentWeightedSum) / remainingWeight;

    const weightWarning = totalWeightWithRemaining > 100 
        ? ` WARNING: Total weight would be ${totalWeightWithRemaining.toFixed(2)}% (over 100%)!` 
        : totalWeightWithRemaining < 100 
        ? ` Note: Total weight would be ${totalWeightWithRemaining.toFixed(2)}% (under 100%).`
        : '';


    const targetLetter = getLetterGrade(targetGrade);
    if (neededScore > 100) {
        resultElement.textContent = `You need ${neededScore.toFixed(2)}% (impossible - over 100%). A ${targetLetter} may not be achievable.${weightWarning}`;
        resultElement.style.backgroundColor = '#ffcccc'
    } else if (neededScore <= 0) {
        resultElement.textContent = `You already have an ${targetLetter}! You can score as low as 0% and still maintain it.${weightWarning}`;
        resultElement.style.backgroundColor = '#ccffcc';
    } else {
        resultElement.textContent = `You need at least an ${neededScore.toFixed(2)}% on the remaining ${remainingWeight}% weighted section to get an ${targetLetter}.${weightWarning}`;
        resultElement.style.backgroundColor = '#ffffcc';
    }
}

document.getElementById('add-entry-button').addEventListener('click', handleFormSubmit);
document.getElementById('remaining-weight').addEventListener('input', calculateWhatIfScore);
window.addEventListener('load', calculateWhatIfScore);

document.getElementById('grade-scale-header').addEventListener('click', function() {
    const list = document.getElementById('grade-scale-list');
    const arrow = document.getElementById('grade-scale-arrow');

    if (list.style.display === 'none') {
        list.style.display = 'block';
        arrow.textContent = '▲';
    } else {
        list.style.display = 'none';
        arrow.textContent = '▼';
    }
})

document.getElementById('clear-all-button').addEventListener('click', clearAllEntries)

document.getElementById('target-grade-select').addEventListener('change', function() {
    targetGrade = Number(this.value);
    calculateWhatIfScore();
})