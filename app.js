"use strict";

var listElement = document.querySelector('.list');

var filtersElement = document.querySelector('.filters');
var statisticElement = document.querySelector('.statistic');

var templateElement = document.getElementById('todoTemplate');
var templateContainer = 'content' in templateElement ? templateElement.content : templateElement;

// описание фильтров
var filters = {
    ALL: 'all',
    DONE: 'done',
    LEFT: 'todo'
};

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
        updateToDoList();
    }

    if (isDeleteBtn(target)) {
        element = target.parentNode;
        deleteTodo(element);
        updateToDoList();
    }
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
    updateToDoList();

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
filtersElement.addEventListener('click', onFiltersClick);

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
//Обновление статистики
function updateStatistic() {
    var total = statisticElement.querySelector('.statistic__total');
    var todo = statisticElement.querySelector('.statistic__done');
    var done = statisticElement.querySelector('.statistic__left');

    total.textContent = listElement.querySelectorAll('.list__item, .task').length.toString();
    todo.textContent = listElement.querySelectorAll('.task_done').length.toString();
    done.textContent = listElement.querySelectorAll('.task_todo').length.toString();
}
//Перерисовывает список задач в зависимости от текущего фильтра
function renderToDoList(filter) {
    switch (filter) {
        case filters.ALL:
            showAllToDos();
            break;
        case filters.DONE:
            showCompletedToDos();
            break;
        case filters.LEFT:
            showLeftToDos();
            break;
    }
}
//Обновляет список вместе со статистикой
function updateToDoList() {
    var currentFilter = getCurentFilter();
    updateStatistic();
    renderToDoList(currentFilter);
}

//Обработчик клика по фильтрам
function onFiltersClick(event) {
    var target = event.target;
    if (isFilterItem(target)) {
        target.parentNode.querySelector('.filters__item_selected').classList.remove('filters__item_selected');
        target.classList.add('filters__item_selected');
        renderToDoList(target.dataset.filter);
    }
}
//Функции отображения определенного типа задач
function showAllToDos() {
    Array.prototype.forEach.call(listElement.children, function(listItem){
        listItem.classList.remove('list__item_hidden');
    });
}

function showCompletedToDos() {
    //Показываем все выполненные задачки
    Array.prototype.filter.call(listElement.children, filterByDone)
        .forEach(showListItem);
    //Скрываем все не выполненные задачки
    Array.prototype.filter.call(listElement.children, filterByLeft)
        .forEach(hideListItem);
}

function showLeftToDos() {
    //Показываем все выполненные задачки
    Array.prototype.filter.call(listElement.children, filterByLeft)
        .forEach(showListItem);
    //Скрываем все не выполненные задачки
    Array.prototype.filter.call(listElement.children, filterByDone)
        .forEach(hideListItem);
}
//Вспомогательные функции
function isFilterItem(target) {
    return target.classList.contains('filters__item');
}

function getCurentFilter() {
    return filtersElement.querySelector('.filters__item_selected').dataset.filter;
}

function filterByDone(element) {
    return element.classList.contains('task_done');
}
function filterByLeft(element) {
    return element.classList.contains('task_todo');
}

function showListItem(item) {
    item.classList.remove('list__item_hidden');
}

function hideListItem(item) {
    item.classList.add('list__item_hidden');
}
