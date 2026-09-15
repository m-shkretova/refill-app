/* ===================================================== ДАННЫЕ НАШЕГО ПРИЛОЖЕНИЯ
Здесь мы храним все категории и средства.
Название слева — внутреннее название категории. Справа — название, которое увидит пользователь. */
const products = {
dish: {
    name: "Посуда",

    items: [
        'Гель "Лимон"',
        'Гель-бальзам "Гранат-абрикос"',
        "Детская посуда"
    ]
},


laundry: {
    name: "Стирка",

    items: [
        "2 в 1",
        "Универсальный",
        "Joy / Радость",
        "Детский кондиционер"
    ]
},


floor: {
    name: "Пол",

    items: [
        "Средство для пола"
    ]
},


soap: {
    name: "Мыло",

    items: [
        "Вишня",
        "Миндальное молочко",
        "Лавандовое поле"
    ]
},


shower: {
    name: "Гель для душа",

    items: [
        "Пачули и бергамот",
        "Сандал и можжевельник",
        "Инжир и лотос",
        "Карамельное яблоко и ваниль",
        "Кофе и зеленый лайм"
    ]
},


shampoo: {
    name: "Шампунь",

    items: [
        "Питание и восстановление",
        "Увлажнение и блеск",
        "Объем и укрепление",
        "Мужской 2в1"
    ]
}
};
/* ===================================================== ПЕРЕМЕННЫЕ ===================================================== */
/* Здесь мы будем временно хранить:
какую категорию выбрали;
какое средство выбрали. */
let selectedCategory = null; let selectedProduct = null;
/* ===================================================== ПОЛУЧАЕМ СОХРАНЁННЫЕ ЗАПИСИ ===================================================== */
/* localStorage — встроенное хранилище браузера.
Благодаря ему записи не исчезнут, если закрыть браузер или приложение.
Если записей ещё нет — используем пустой массив []. */
let notes = JSON.parse( localStorage.getItem("refillNotes") ) || [];
/* ===================================================== ПОКАЗЫВАЕМ КАТЕГОРИИ ===================================================== */
function renderCategories() {
// Находим контейнер категорий
const container = document.getElementById("categories");

// Очищаем его
container.innerHTML = "";


/*
   Object.entries превращает наш объект products
   в список пар:

   dish → Посуда
   laundry → Стирка
   и т.д.
*/

Object.entries(products).forEach(
    ([key, category]) => {

        // Создаём кнопку
        const button = document.createElement("button");

        // Добавляем CSS-класс
        button.className = "category-button";

        // Пишем название категории
        button.textContent = category.name;


        /*
           При нажатии вызываем функцию
           выбора категории.
        */

        button.onclick = function () {

            showProducts(key);

        };


        // Добавляем кнопку на страницу
        container.appendChild(button);

    }
);
}
/* ===================================================== ОТКРЫВАЕМ СПИСОК СРЕДСТВ ===================================================== */
function showProducts(categoryKey) {
// Запоминаем выбранную категорию
selectedCategory = categoryKey;


// Получаем данные категории
const category = products[categoryKey];


// Меняем заголовок
document.getElementById(
    "categoryTitle"
).textContent = category.name;


// Получаем контейнер средств
const container = document.getElementById("products");


// Очищаем предыдущие средства
container.innerHTML = "";


// Создаём кнопку для каждого средства
category.items.forEach(productName => {

    const button = document.createElement("button");

    button.className = "product-button";

    button.textContent = productName;


    // При нажатии выбираем средство
    button.onclick = function () {

        selectProduct(productName);

    };


    container.appendChild(button);

});


// Показываем экран средств
document
    .getElementById("categoriesScreen")
    .classList.add("hidden");

document
    .getElementById("productsScreen")
    .classList.remove("hidden");
}
/* ===================================================== ВЫБИРАЕМ СРЕДСТВО ===================================================== */
function selectProduct(productName) {
    // Запоминаем выбранное средство
selectedProduct = productName;


// Показываем его название
document.getElementById(
    "productTitle"
).textContent = productName;


// Очищаем поле количества
document.getElementById(
    "amountInput"
).value = "";


// Переходим к экрану количества

document
    .getElementById("productsScreen")
    .classList.add("hidden");

document
    .getElementById("amountScreen")
    .classList.remove("hidden");


// Сразу ставим курсор в поле
document
    .getElementById("amountInput")
    .focus();
}
/* ===================================================== БЫСТРАЯ КНОПКА КОЛИЧЕСТВА ===================================================== */
function setAmount(amount) {
document.getElementById(
    "amountInput"
).value = amount;
}
/* ===================================================== СОХРАНЕНИЕ ЗАПИСИ ===================================================== */
function saveNote() {
// Получаем количество
const amount = Number(
    document.getElementById("amountInput").value
);


/*
   Проверяем, ввёл ли пользователь количество.
*/

if (!amount || amount <= 0) {

    alert("Введите количество в граммах");

    return;
}


/*
   Создаём новую запись.
*/

const newNote = {

    // Уникальный ID записи
    id: Date.now(),

    // Например: dish
    category: selectedCategory,

    // Например: Гель "Лимон"
    product: selectedProduct,

    // Например: 750
    amount: amount

};


// Добавляем запись в массив
notes.push(newNote);


// Сохраняем массив в памяти браузера
localStorage.setItem(
    "refillNotes",
    JSON.stringify(notes)
);


// Обновляем список карточек
renderNotes();


// Возвращаемся на главный экран
showCategories();


// Очищаем выбранные значения
selectedCategory = null;
selectedProduct = null;
}
/* ===================================================== ПОКАЗ СОХРАНЁННЫХ ЗАПИСЕЙ ===================================================== */
function renderNotes() {
const container =
    document.getElementById("notes");


// Очищаем старые карточки
container.innerHTML = "";


/*
   Если записей нет,
   показываем соответствующее сообщение.
*/

if (notes.length === 0) {

    container.innerHTML =
        '<p style="color:#888;">Нет текущих записей</p>';

    return;
}


/*
   Перебираем все сохранённые записи.
*/

notes.forEach(note => {

    const card =
        document.createElement("div");

    card.className = "note-card";


    /*
       Получаем нормальное название категории.
    */

    const categoryName =
        products[note.category].name;


    /*
       Создаём содержимое карточки.
    */

    card.innerHTML = `

        <div class="note-category">
            ${categoryName}
        </div>

        <div class="note-product">
            ${note.product}
        </div>

        <div class="note-amount">
            ${note.amount} г
        </div>

        <button
            class="complete-button"
            onclick="completeNote(${note.id})"
        >
            ✓ Использовано
        </button>

    `;


    container.appendChild(card);

});
}
/* ===================================================== УДАЛЕНИЕ / ЗАВЕРШЕНИЕ ЗАПИСИ ===================================================== */
function completeNote(id) {
/*
   Оставляем все записи,
   кроме той, которую использовали.
*/

notes = notes.filter(
    note => note.id !== id
);


// Обновляем localStorage
localStorage.setItem(
    "refillNotes",
    JSON.stringify(notes)
);


// Обновляем экран
renderNotes();
}
/* ===================================================== ВОЗВРАТ К КАТЕГОРИЯМ ===================================================== */
function showCategories() {
// Показываем категории
document
    .getElementById("categoriesScreen")
    .classList.remove("hidden");


// Прячем список средств
document
    .getElementById("productsScreen")
    .classList.add("hidden");


// Прячем экран количества
document
    .getElementById("amountScreen")
    .classList.add("hidden");
}

/* ===================================================== ВОЗВРАТ К СПИСКУ СРЕДСТВ ===================================================== */
function showProducts() {
// Прячем экран количества
document
    .getElementById("amountScreen")
    .classList.add("hidden");


// Показываем средства
document
    .getElementById("productsScreen")
    .classList.remove("hidden");
}
/* ===================================================== ЗАПУСК ПРИЛОЖЕНИЯ ===================================================== */
/* Эти функции запускаются, когда страница открывается. */
renderCategories();
renderNotes();