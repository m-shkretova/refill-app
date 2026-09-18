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


/* =====================================================
   СОСТОЯНИЕ ПРИЛОЖЕНИЯ
===================================================== */

let selectedCategory = null;
let selectedProduct = null;
let notes = [];


/* =====================================================
   РАБОТА С СОХРАНЕНИЕМ
===================================================== */

function loadNotes() {

    try {

        const saved = localStorage.getItem("refillNotes");

        if (!saved) {
            return [];
        }

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed) ? parsed : [];

    } catch (error) {

        console.error("Ошибка чтения записей:", error);

        return [];
    }
}


function saveNotes() {

    try {

        localStorage.setItem(
            "refillNotes",
            JSON.stringify(notes)
        );

        return true;

    } catch (error) {

        console.error("Ошибка сохранения:", error);

        alert(
            "Не удалось сохранить запись. " +
            "Проверьте память браузера."
        );

        return false;
    }
}


/* =====================================================
   КАТЕГОРИИ
===================================================== */

function renderCategories() {

    const container =
        document.getElementById("categories");

    if (!container) {
        console.error("Не найден блок categories");
        return;
    }

    container.innerHTML = "";

    Object.entries(products).forEach(
        ([key, category]) => {

            const button =
                document.createElement("button");

            button.className = "category-button";

            button.textContent = category.name;

            button.addEventListener(
                "click",
                function () {
                    showProducts(key);
                }
            );

            container.appendChild(button);
        }
    );
}


/* =====================================================
   ТОВАРЫ КАТЕГОРИИ
===================================================== */

function showProducts(categoryKey) {
    alert("Нажата категория: " + categoryKey);

const category = products[categoryKey];

alert("Категория: " + category.name);

selectedCategory = categoryKey;

document.getElementById("categoryTitle").textContent =
    category.name;

const container = document.getElementById("products");

container.innerHTML = "";

category.items.forEach(function(productName) {

    const button = document.createElement("button");

    button.className = "product-button";

    button.textContent = productName;

    button.onclick = function() {
        selectProduct(productName);
    };

    container.appendChild(button);
});

document.getElementById("categoriesScreen")
    .classList.add("hidden");

document.getElementById("productsScreen")
    .classList.remove("hidden");
}

/* =====================================================
   ВЫБОР СРЕДСТВА
===================================================== */

function selectProduct(productName) {

    selectedProduct = productName;

    document.getElementById(
        "productTitle"
    ).textContent = productName;

    document.getElementById(
        "amountInput"
    ).value = "";

    document
        .getElementById("productsScreen")
        .classList.add("hidden");

    document
        .getElementById("amountScreen")
        .classList.remove("hidden");
}


/* =====================================================
   БЫСТРОЕ КОЛИЧЕСТВО
===================================================== */

function setAmount(amount) {

    const input =
        document.getElementById("amountInput");

    input.value = amount;
}


/* =====================================================
   СОХРАНЕНИЕ ЗАПИСИ
===================================================== */

function saveNote() {

    const input =
        document.getElementById("amountInput");

    const amount = Number(input.value);

    /* Проверяем категорию */

    if (!selectedCategory) {

        alert("Сначала выберите категорию.");

        return;
    }

    /* Проверяем средство */

    if (!selectedProduct) {

        alert("Сначала выберите средство.");

        return;
    }

    /* Проверяем количество */

    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Введите количество в граммах.");

        input.focus();

        return;
    }


    /* Создаём запись */

    const newNote = {

        id: Date.now(),

        category: selectedCategory,

        product: selectedProduct,

        amount: amount
    };


    /* Добавляем запись */

    notes.push(newNote);


    /* Сохраняем */

    const saved = saveNotes();


    /* Если сохранить не удалось —
       НЕ сбрасываем данные */

    if (!saved) {

        notes.pop();

        return;
    }


    /* Обновляем список */

    renderNotes();


    /* Очищаем выбор */

    selectedCategory = null;
    selectedProduct = null;


    /* Возвращаемся на главный экран */

    showCategories();
}


/* =====================================================
   ОТОБРАЖЕНИЕ ЗАПИСЕЙ
===================================================== */

function renderNotes() {

    const container =
        document.getElementById("notes");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    if (notes.length === 0) {

        container.innerHTML =
            '<p style="color:#888;">Нет текущих записей</p>';

        return;
    }


    notes.forEach(note => {

        const card =
            document.createElement("div");

        card.className = "note-card";


        const category =
            products[note.category];


        /* Защита от старых/повреждённых записей */

        const categoryName =
            category
                ? category.name
                : "Неизвестная категория";


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


/* =====================================================
   ЗАПИСЬ ИСПОЛЬЗОВАНА
===================================================== */

function completeNote(id) {

    const oldNotes = [...notes];


    notes = notes.filter(
        note => note.id !== id
    );


    if (!saveNotes()) {

        /* Если сохранение не удалось —
           возвращаем запись */

        notes = oldNotes;

        renderNotes();

        return;
    }


    renderNotes();
}


/* =====================================================
   ГЛАВНЫЙ ЭКРАН
===================================================== */

function showCategories() {

    document
        .getElementById("categoriesScreen")
        .classList.remove("hidden");

    document
        .getElementById("productsScreen")
        .classList.add("hidden");

    document
        .getElementById("amountScreen")
        .classList.add("hidden");
}


/* =====================================================
   НАЗАД К ТОВАРАМ
===================================================== */

function showProductsBack() {

    document
        .getElementById("amountScreen")
        .classList.add("hidden");

    document
        .getElementById("productsScreen")
        .classList.remove("hidden");
}


/* =====================================================
   СОВМЕСТИМОСТЬ С КНОПКОЙ В HTML
===================================================== */

/* В index.html у тебя вызывается showProducts().
   Поэтому оставляем эту функцию тоже. */

function showProducts() {

    showProductsBack();
}


/* =====================================================
   ЗАПУСК
===================================================== */

notes = loadNotes();

renderCategories();

renderNotes();