const input = document.getElementById('task-input');
const addBtn = document.getElementById('task-add');
const list = document.getElementById('task-list');
const remainingEl = document.getElementById('task-remaining');

const storageNotice = document.getElementById('storage-notice');
let persistent = true;
let tasks = [];
try {
  const saved = JSON.parse(localStorage.getItem('tasks') || '[]');
  if (Array.isArray(saved)) tasks = saved.filter(t => t && typeof t.text === 'string' && typeof t.completed === 'boolean');
} catch { persistent = false; }
function describeStorage() {
  storageNotice.textContent = persistent ? 'Tasks saved in this browser.' : 'Session only: this preview blocks storage. Tasks will reset when reloaded. Open in Chrome to keep them.';
}


function save() {
  if (persistent) { try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch { persistent = false; } }
  describeStorage();
  render();
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  input.value = '';
  save();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  save();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  save();
}

function render() {
  list.innerHTML = '';
  let remaining = 0;
  tasks.forEach((task, index) => {
    if (!task.completed) remaining++;
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'task-row');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.setAttribute('data-testid', 'task-toggle');
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Complete task: ' + task.text);
    checkbox.addEventListener('change', () => toggleTask(index));
    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) span.classList.add('completed');
    const del = document.createElement('button');
    del.setAttribute('data-testid', 'task-delete');
    del.textContent = 'Delete';
    del.addEventListener('click', () => deleteTask(index));
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
  remainingEl.textContent = String(remaining);
}

addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTask(); });

describeStorage();
render();