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


let selectedCategory = null;
let selectedProduct = null;

let notes = JSON.parse(
    localStorage.getItem("refillNotes")
) || [];


function renderCategories() {

    const container = document.getElementById("categories");

    container.innerHTML = "";

    Object.entries(products).forEach(([key, category]) => {

        const button = document.createElement("button");

        button.className = "category-button";

        button.textContent = category.name;

        button.addEventListener("click", () => {
            showProducts(key);
        });

        container.appendChild(button);
    });
}


function showProducts(categoryKey) {

    selectedCategory = categoryKey;

    const category = products[categoryKey];

    document.getElementById("categoryTitle").textContent =
        category.name;

    const container = document.getElementById("products");

    container.innerHTML = "";

    category.items.forEach(productName => {

        const button = document.createElement("button");

        button.className = "product-button";

        button.textContent = productName;

        button.addEventListener("click", () => {
            selectProduct(productName);
        });

        container.appendChild(button);
    });

    document
        .getElementById("categoriesScreen")
        .classList.add("hidden");

    document
        .getElementById("productsScreen")
        .classList.remove("hidden");
}


function selectProduct(productName) {

    selectedProduct = productName;

    document.getElementById("productTitle").textContent =
        productName;

    document.getElementById("amountInput").value = "";

    document
        .getElementById("productsScreen")
        .classList.add("hidden");

    document
        .getElementById("amountScreen")
        .classList.remove("hidden");
}


function setAmount(amount) {

    document.getElementById("amountInput").value = amount;

}


function saveNote() {

    const amount = Number(
        document.getElementById("amountInput").value
    );

    if (!amount || amount <= 0) {

        alert("Введите количество в граммах");

        return;
    }

    notes.push({
        id: Date.now(),
        category: selectedCategory,
        product: selectedProduct,
        amount: amount
    });

    localStorage.setItem(
        "refillNotes",
        JSON.stringify(notes)
    );

    renderNotes();

    showCategories();

    selectedCategory = null;
    selectedProduct = null;
}


function renderNotes() {

    const container = document.getElementById("notes");

    container.innerHTML = "";

    if (notes.length === 0) {

        container.innerHTML =
            '<p style="color:#888;">Нет текущих записей</p>';

        return;
    }

    notes.forEach(note => {

        const card = document.createElement("div");

        card.className = "note-card";

        card.innerHTML = `
            <div class="note-category">
                ${products[note.category].name}
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


function completeNote(id) {

    notes = notes.filter(note => note.id !== id);

    localStorage.setItem(
        "refillNotes",
        JSON.stringify(notes)
    );

    renderNotes();
}


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


function showProductsBack() {

    document
        .getElementById("amountScreen")
        .classList.add("hidden");

    document
        .getElementById("productsScreen")
        .classList.remove("hidden");
}


renderCategories();
renderNotes();