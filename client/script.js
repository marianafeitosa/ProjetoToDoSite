const API_URL = "http://localhost:4000/tasks";

async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task.title}</span>
      <div>
        <button class="edit" onclick="editTask('${task.id}', '${task.title}')">✏️</button>
        <button class="delete" onclick="deleteTask('${task.id}')">🗑️</button>
      </div>
    `;
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const title = input.value.trim();
  if (!title) return;
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  input.value = "";
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadTasks();
}

async function editTask(id, oldTitle) {
  const newTitle = prompt("Editar tarefa:", oldTitle);
  if (newTitle && newTitle.trim() !== "") {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    loadTasks();
  }
}

loadTasks();
