/* =====================================================
   ДАННЫЕ ПРИЛОЖЕНИЯ
===================================================== */

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
   ПЕРЕМЕННЫЕ
===================================================== */

let selectedCategory = null;
let selectedProduct = null;


/* =====================================================
   СОХРАНЁННЫЕ ЗАПИСИ
===================================================== */

let notes = JSON.parse(
    localStorage.getItem("refillNotes")
) || [];


/* =====================================================
   ПОКАЗЫВАЕМ КАТЕГОРИИ
===================================================== */

function renderCategories() {

    const container = document.getElementById("categories");

    container.innerHTML = "";

    Object.entries(products).forEach(
        ([key, category]) => {

            const button = document.createElement("button");

            button.className = "category-button";

            button.textContent = category.name;

            button.onclick = function () {
                showProducts(key);
            };

            container.appendChild(button);

        }
    );
}


/* =====================================================
   ОТКРЫВАЕМ СПИСОК СРЕДСТВ
===================================================== */

function showProducts(categoryKey) {

    selectedCategory = categoryKey;

    const category = products[categoryKey];

    document.getElementById(
        "categoryTitle"
    ).textContent = category.name;

    const container = document.getElementById("products");

    container.innerHTML = "";

    category.items.forEach(productName => {

        const button = document.createElement("button");

        button.className = "product-button";

        button.textContent = productName;

        button.onclick = function () {
            selectProduct(productName);
        };

        container.appendChild(button);

    });

    document
        .getElementById("categoriesScreen")
        .classList.add("hidden");

    document
        .getElementById("productsScreen")
        .classList.remove("hidden");
}


/* =====================================================
   ВЫБИРАЕМ СРЕДСТВО
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

    document
        .getElementById("amountInput")
        .focus();
}


/* =====================================================
   БЫСТРАЯ КНОПКА КОЛИЧЕСТВА
===================================================== */

function setAmount(amount) {

    document.getElementById(
        "amountInput"
    ).value = amount;

}


/* =====================================================
   СОХРАНЕНИЕ ЗАПИСИ
===================================================== */

function saveNote() {

    const amount = Number(
        document.getElementById("amountInput").value
    );

    if (!amount || amount <= 0) {

        alert("Введите количество в граммах");

        return;
    }

    const newNote = {

        id: Date.now(),

        category: selectedCategory,

        product: selectedProduct,

        amount: amount

    };

    notes.push(newNote);

    localStorage.setItem(
        "refillNotes",
        JSON.stringify(notes)
    );

    renderNotes();

    showCategories();

    selectedCategory = null;
    selectedProduct = null;
}


/* =====================================================
   ПОКАЗЫВАЕМ СОХРАНЁННЫЕ ЗАПИСИ
===================================================== */

function renderNotes() {

    const container =
        document.getElementById("notes");

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

        const categoryName =
            products[note.category].name;

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
   ЗАВЕРШЕНИЕ ЗАПИСИ
===================================================== */

function completeNote(id) {

    notes = notes.filter(
        note => note.id !== id
    );

    localStorage.setItem(
        "refillNotes",
        JSON.stringify(notes)
    );

    renderNotes();
}


/* =====================================================
   ВОЗВРАТ К КАТЕГОРИЯМ
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
   ВОЗВРАТ К СПИСКУ СРЕДСТВ
===================================================== */

function showProducts() {

    document
        .getElementById("amountScreen")
        .classList.add("hidden");

    document
        .getElementById("productsScreen")
        .classList.remove("hidden");
}


/* =====================================================
   ЗАПУСК ПРИЛОЖЕНИЯ
===================================================== */

renderCategories();

renderNotes();