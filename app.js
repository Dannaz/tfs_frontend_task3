"use strict";

var listElement = document.querySelector('.list');
var filtersElement = document.querySelector('filters');
var statisticElement = document.querySelector('.statistic');
var itemElementList = listElement.children;
var todoListEvents = {
    ON_ADD: 'add',
    ON_REMOVE: 'remove',
    ON_DONE: 'done',
    ON_UNDONE: 'undone'
};

var templateElement = document.getElementById('todoTemplate');
var templateContainer = 'content' in templateElement ? templateElement.content : templateElement;

// сформируем задачки
var todoList = [
    {
        name: 'Позвонить в сервис',
        status: 'todo'
    },
    {
        name: 'Купить хлеб',
        status: 'done'
    },
    {
        name: 'Захватить мир',
        status: 'todo'
    },
    {
        name: 'Добавить тудушку в список',
        status: 'todo'
    }
];

// функция по генерации элементов
function addTodoFromTemplate(todo) {
    var newElement = templateContainer.querySelector('.task').cloneNode(true);
    newElement.querySelector('.task__name').textContent = todo.name;
    setTodoStatusClassName(newElement, todo.status === 'todo');

    return newElement;
}

function setTodoStatusClassName(todo, flag) {
    todo.classList.toggle('task_todo', flag);
    todo.classList.toggle('task_done', !flag);
}

function onListClick(event) {
    var target = event.target;
    var element;

    if (isStatusBtn(target)) {
        element = target.parentNode;
        changeTodoStatus(element);
        updateStatistic();
    }

    if (isDeleteBtn(target)) {
        element = target.parentNode;
        deleteTodo(element);
        updateStatistic();
    }
}

function onFiltersClick(event) {
    var target = event.target;
    var currentSelection
}

function isStatusBtn(target) {
    return target.classList.contains('task__status');
}

function isDeleteBtn(target) {
    return target.classList.contains('task__delete-button');
}

function changeTodoStatus(element) {
    var isTodo = element.classList.contains('task_todo');
    setTodoStatusClassName(element, !isTodo);
}

function deleteTodo(element) {
    listElement.removeChild(element);
}

function onInputKeydown(event) {
    if (event.keyCode !== 13) {
        return;
    }

    var ENTER_KEYCODE = 13;
    if (event.keyCode !== ENTER_KEYCODE) {
        return;
    }

    var todoName = inputElement.value.trim();
    inputElement.value = '';

    if (todoName.length === 0 || checkIfTodoAlreadyExists(todoName)) {
        return;
    }

    var todo = createNewTodo(todoName);
    insertTodoElement(addTodoFromTemplate(todo));
    updateStatistic();

}

function checkIfTodoAlreadyExists(todoName) {
    var todoElements = listElement.querySelectorAll('.task__name');
    var namesList = Array.prototype.map.call(todoElements, function (element) {
        return element.textContent;
    });
    return namesList.indexOf(todoName) > -1;
}

function createNewTodo(name) {
    return {
        name: name,
        status: 'todo'
    }
}

todoList
    .map(addTodoFromTemplate)
    .forEach(insertTodoElement);
updateStatistic();

listElement.addEventListener('click', onListClick);

var inputElement = document.querySelector('.add-task__input');
inputElement.addEventListener('keydown', onInputKeydown);

// Задача:
// исправьте багу с добавлением insertBefore в пустой массив
// создайте статистику
function insertTodoElement(elem) {
    if (listElement.children) {
        listElement.insertBefore(elem, listElement.firstElementChild);
    } else {
        listElement.appendChild(elem);
    }
}

function updateStatistic() {
    var total = statisticElement.querySelector('.statistic__total');
    var todo = statisticElement.querySelector('.statistic__done');
    var done = statisticElement.querySelector('.statistic__left');

    total.textContent = listElement.querySelectorAll('.list__item, .task').length.toString();
    todo.textContent = listElement.querySelectorAll('.task_done').length.toString();
    done.textContent = listElement.querySelectorAll('.task_todo').length.toString();
}

