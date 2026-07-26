// To-Do List Application
class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.currentPriority = 'medium';
        this.currentCategory = 'работа';
        this.editingTaskId = null;
        this.init();
    }

    init() {
        this.loadTasks();
        this.attachEventListeners();
        this.render();
    }

    attachEventListeners() {
        // Add task
        document.getElementById('addBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Priority
        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setPriority(e.target.dataset.priority));
        });

        // Category
        document.getElementById('categorySelect').addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
        });

        // Actions
        document.getElementById('clearCompletedBtn').addEventListener('click', () => this.clearCompleted());
        document.getElementById('deleteAllBtn').addEventListener('click', () => this.deleteAll());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTasks());
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        document.getElementById('importFile').addEventListener('change', (e) => this.importTasks(e));

        // Modal
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('saveEditBtn').addEventListener('click', () => this.saveEdit());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target.id === 'editModal') this.closeModal();
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();

        if (!text) {
            alert('Пожалуйста, введите текст задачи');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: this.currentPriority,
            category: this.currentCategory,
            createdAt: new Date().toLocaleDateString('ru-RU')
        };

        this.tasks.unshift(task);
        input.value = '';
        this.saveTasks();
        this.render();
    }

    deleteTask(id) {
        if (confirm('Удалить задачу?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.render();
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.editingTaskId = id;
            document.getElementById('editTaskInput').value = task.text;
            document.getElementById('editModal').style.display = 'block';
        }
    }

    saveEdit() {
        const text = document.getElementById('editTaskInput').value.trim();
        if (!text) {
            alert('Текст не может быть пустым');
            return;
        }

        const task = this.tasks.find(t => t.id === this.editingTaskId);
        if (task) {
            task.text = text;
            this.saveTasks();
            this.render();
            this.closeModal();
        }
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingTaskId = null;
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        this.render();
    }

    setPriority(priority) {
        this.currentPriority = priority;
        document.querySelectorAll('.priority-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }

    getFilteredTasks() {
        let filtered = this.tasks;

        if (this.currentFilter === 'active') {
            filtered = filtered.filter(task => !task.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(task => task.completed);
        }

        return filtered;
    }

    clearCompleted() {
        if (confirm('Удалить все выполненные задачи?')) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.render();
        }
    }

    deleteAll() {
        if (confirm('Удалить ВСЕ задачи? Это действие не может быть отменено!')) {
            this.tasks = [];
            this.saveTasks();
            this.render();
        }
    }

    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `todo-tasks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    if (confirm('Заменить текущие задачи или добавить новые?\nОК = Заменить, Отмена = Добавить')) {
                        this.tasks = imported;
                    } else {
                        this.tasks.push(...imported);
                    }
                    this.saveTasks();
                    this.render();
                    alert('Задачи успешно импортированы!');
                }
            } catch (error) {
                alert('Ошибка при импорте файла');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const active = total - completed;

        document.getElementById('totalCount').textContent = total;
        document.getElementById('activeCount').textContent = active;
        document.getElementById('completedCount').textContent = completed;

        // Progress
        const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = progress + '%';
        if (progress > 0) {
            progressFill.textContent = progress + '%';
        }
        document.getElementById('progressText').textContent = `${progress}% выполнено`;

        // Category stats
        const categories = ['работа', 'дом', 'покупки', 'здоровье', 'обучение', 'прочее'];
        categories.forEach(cat => {
            const count = this.tasks.filter(t => t.category === cat).length;
            const element = document.querySelector(`[data-category="${cat}"]`);
            if (element) {
                element.textContent = count;
            }
        });
    }

    render() {
        const tasksList = document.getElementById('tasksList');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = `
                <li class="empty-state">
                    <p>🎉 Нет задач!</p>
                    <p>${this.currentFilter === 'completed' ? 'Ты еще ничего не выполнил' : 'Добавь первую задачу'}</p>
                </li>
            `;
        } else {
            tasksList.innerHTML = filteredTasks.map(task => `
                <li class="task-item ${task.completed ? 'completed' : ''} task-priority-${task.priority}">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="app.toggleTask(${task.id})">
                    <div class="task-content">
                        <div class="task-text">${this.escapeHtml(task.text)}</div>
                        <div class="task-meta">
                            <span class="task-category">${this.getCategoryEmoji(task.category)} ${task.category}</span>
                            <span class="task-date">📅 ${task.createdAt}</span>
                            <span class="task-priority ${task.priority}">${this.getPriorityLabel(task.priority)}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="task-btn edit" title="Редактировать" onclick="app.editTask(${task.id})">✏️</button>
                        <button class="task-btn delete" title="Удалить" onclick="app.deleteTask(${task.id})">🗑️</button>
                    </div>
                </li>
            `).join('');
        }

        this.updateStats();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getCategoryEmoji(category) {
        const emojis = {
            'работа': '💼',
            'дом': '🏠',
            'покупки': '🛒',
            'здоровье': '💪',
            'обучение': '📚',
            'прочее': '⭐'
        };
        return emojis[category] || '⭐';
    }

    getPriorityLabel(priority) {
        const labels = {
            'high': 'Высокий',
            'medium': 'Средний',
            'low': 'Низкий'
        };
        return labels[priority] || priority;
    }

    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('todoTasks');
        if (saved) {
            try {
                this.tasks = JSON.parse(saved);
            } catch (error) {
                this.tasks = [];
            }
        }
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});
