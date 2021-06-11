'use strict';

const todoControl = document.querySelector('.todo-control');
const headerInput = document.querySelector('.header-input');
const todoList = document.querySelector('.todo-list');
const todoCompleted = document.querySelector('.todo-completed');

let todoData = [];

const render = function () {
localStorage.setItem('todoData', JSON.stringify(todoData));

  todoList.textContent = '';
  todoCompleted.textContent = '';

  todoData.forEach(function (item) {
    let li = document.createElement('li');
    li.classList.add('todo-item');

    li.innerHTML = `<span class="text-todo">${item.value}</span>
      <div class="todo-buttons">
				<button class="todo-remove"></button>
				<button class="todo-complete"></button>
			</div>`

    if (item.completed) {
      todoCompleted.append(li);
    } else {
      todoList.append(li);
    }

    const todoComplete = li.querySelector('.todo-complete');
    todoComplete.addEventListener('click', function () {
      item.completed = !item.completed;
      render();
    });

    const todoRemove = li.querySelector('.todo-remove');
    todoRemove.addEventListener('click', function () {
      let index = todoData.indexOf(item);
      todoData.splice(index, 1);
      render();
    });
  });

  headerInput.value = '';



};


todoControl.addEventListener('submit', function (evt) {
  evt.preventDefault();

  let newTodo =
  {
    value: headerInput.value,
    completed: false
  };

  if (headerInput.value !== '') {
    todoData.push(newTodo);
  }

  render();
});

if (localStorage.getItem('todoData') !== null) {
  todoData = JSON.parse(localStorage.getItem('todoData'));
}
render();
