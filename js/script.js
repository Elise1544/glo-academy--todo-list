'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted, todoContainer) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoContainer = document.querySelector(todoContainer);
    this.todoData = new Map(JSON.parse(localStorage.getItem(`toDoList`)));
  }

  addTodo(evt) {
    evt.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.render();
      this.input.value = ``;
    } else {
      alert(`Нельзя добавить пустое дело`);
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  render() {
    this.todoList.textContent = ``;
    this.todoCompleted.textContent = ``;
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }

  createItem(todo) {
    const li = document.createElement(`li`);
    li.classList.add(`todo-item`);
    li.key = todo.key;
    li.insertAdjacentHTML(`beforeend`, `
    <span class='text-todo'>${todo.value}</span>
    <div class='todo-buttons'>
      <button class='todo-edit'></button>
      <button class='todo-remove'></button>
      <button class='todo-complete'></button>
    </div>
    `);

    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addToStorage() {
    localStorage.setItem(`toDoList`, JSON.stringify([...this.todoData]));
  }

  deleteItem(item) {
    this.animate({
      duration: 500,
      timing(timeFraction) {
        return timeFraction;
      },
      draw: function (progress) {
        item.style.transform = `translate(-${progress * 100}%)`
      }
    });
    this.todoData.delete(item.key);
    setTimeout(() => {
      this.render()
    }, 500);
  }

  completedItem(item) {
    if (item.closest(`.todo-list`)) {
      this.todoCompleted.append(item);
      this.animate({
        duration: 500,
        timing(timeFraction) {
          return timeFraction;
        },
        draw: function (progress) {
          item.style.top = item.clientHeight * progress + 'px'
        }
      });
    } else {
      this.todoList.append(item);
      item.style.top = '0';
    }
  }

  animate({ timing, draw, duration }) {
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      let progress = timing(timeFraction);
      draw(progress);
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  }

  editItem(item) {
    item.contentEditable = true;
    item.addEventListener(`blur`, () => {
      item.contentEditable = false;
    });
  }

  handler() {
    this.todoContainer.addEventListener(`click`, (evt) => {
      const target = evt.target;
      if (target.classList.contains(`todo-remove`)) {
        this.deleteItem(target.closest(`.todo-item`));
      } else if (target.classList.contains(`todo-complete`)) {
        this.completedItem(target.closest(`.todo-item`));
      } else if (target.classList.contains(`todo-edit`)) {
        this.editItem(target.closest(`.todo-item`));
      }
    });
  }

  init() {
    this.form.addEventListener(`submit`, this.addTodo.bind(this));
    this.render();
    this.handler();
  }
}

const todo = new Todo(`.todo-control`, `.header-input`, `.todo-list`, `.todo-completed`, `.todo-container`);

todo.init();
