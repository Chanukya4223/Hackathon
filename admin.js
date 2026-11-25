const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {

    window.location.href = "index.html";

}

const DEFAULT_PRODUCTS = [
    { id: 1, name: "Dell Inspiron 15 Laptop", brand: "Dell", category: "Electronics", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80", price: 54990, amazonPrice: 56990, flipkartPrice: 55999, meeshoPrice: 57999, quantity: 10, supplier: "Dell Suppliers" },
    { id: 2, name: "Logitech G213 Gaming Keyboard", brand: "Logitech", category: "Accessories", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80", price: 4499, amazonPrice: 4299, flipkartPrice: 4399, meeshoPrice: 4599, quantity: 25, supplier: "Tech World" },
    { id: 3, name: "Logitech MX Master 3S Mouse", brand: "Logitech", category: "Accessories", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80", price: 9999, amazonPrice: 10499, flipkartPrice: 9899, meeshoPrice: 10999, quantity: 30, supplier: "Tech World" },
    { id: 4, name: "Dell UltraSharp 24\" Monitor", brand: "Dell", category: "Electronics", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80", price: 18999, amazonPrice: 19499, flipkartPrice: 19999, meeshoPrice: 18499, quantity: 8, supplier: "Display Hub" },
    { id: 5, name: "Sony WH-1000XM5 Headphones", brand: "Sony", category: "Accessories", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", price: 27990, amazonPrice: 26990, flipkartPrice: 28499, meeshoPrice: 28999, quantity: 15, supplier: "Audio World" },
    { id: 6, name: "Logitech C920 HD Pro Webcam", brand: "Logitech", category: "Electronics", image: "https://images-cdn.ubuy.co.in/635125dd0f248c4416034d5c-logitech-c920-hd-pro-webcam-1080p.jpg", price: 6999, amazonPrice: 7299, flipkartPrice: 6899, meeshoPrice: 7499, quantity: 12, supplier: "Tech World" },
    { id: 7, name: "Samsung T7 1TB Portable SSD", brand: "Samsung", category: "Electronics", image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80", price: 8999, amazonPrice: 9299, flipkartPrice: 9499, meeshoPrice: 8799, quantity: 18, supplier: "Storage Hub" },
    { id: 8, name: "HP LaserJet Pro Wireless Printer", brand: "HP", category: "Electronics", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80", price: 24999, amazonPrice: 25999, flipkartPrice: 24499, meeshoPrice: 26999, quantity: 7, supplier: "HP Enterprise" }
];

let products = JSON.parse(localStorage.getItem("products")) || DEFAULT_PRODUCTS;

// Upgrade the original four-item demo catalog while retaining stock counts.
if (localStorage.getItem("catalogRefreshV1") !== "done") {
products = products.map(product => {
    const name = String(product.name || "").toLowerCase();
    const keyword = ["laptop", "keyboard", "mouse", "monitor", "headphone", "webcam", "ssd", "printer"]
        .find(word => name.includes(word));
    const canonical = DEFAULT_PRODUCTS.find(item =>
        item.name.toLowerCase() === name ||
        (keyword && item.name.toLowerCase().includes(keyword)) ||
        (Number(item.id) === Number(product.id) && (!name || ["laptop", "keyboard", "mouse", "monitor"].includes(name)))
    );
    if (!canonical) return product;
    return {
        ...product,
        name: ["laptop", "keyboard", "mouse", "monitor"].includes(name) ? canonical.name : product.name,
        brand: product.brand || canonical.brand,
        category: product.category || canonical.category,
        image: canonical.image,
        price: canonical.price,
        amazonPrice: canonical.amazonPrice,
        flipkartPrice: canonical.flipkartPrice,
        meeshoPrice: canonical.meeshoPrice
    };
});
localStorage.setItem("products", JSON.stringify(products));
localStorage.setItem("catalogRefreshV1", "done");
}

if (localStorage.getItem("catalogRefreshV2") !== "done") {
    products.forEach(product => {
        if (String(product.name || "").toLowerCase().includes("webcam")) {
            product.image = DEFAULT_PRODUCTS[5].image;
        }
    });
    const existingIds = new Set(products.map(product => String(product.id)));
    DEFAULT_PRODUCTS.forEach(product => {
        if (!existingIds.has(String(product.id))) products.push({ ...product });
    });
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("catalogRefreshV2", "done");
}


let suppliers =
    JSON.parse(localStorage.getItem("suppliers")) || [

        {
            id: 1,
            name: "Dell Suppliers",
            contact: "9876543210"
        },

        {
            id: 2,
            name: "Tech World",
            contact: "9876501234"
        },

        {
            id: 3,
            name: "Display Hub",
            contact: "9123456780"
        }

    ];

let orders =
    JSON.parse(
        localStorage.getItem("orders")
    ) || [];

function saveData() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );


    localStorage.setItem(
        "suppliers",
        JSON.stringify(suppliers)
    );


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

}

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".section");


    sections.forEach(section => {

        section.classList.add("hidden");

    });


    document
        .getElementById(sectionId)
        .classList.remove("hidden");


    if (sectionId === "dashboardSection") {

        updateDashboard();

    }


    if (sectionId === "productsSection") {

        displayProducts();

    }


    if (sectionId === "suppliersSection") {

        displaySuppliers();

    }


    if (sectionId === "ordersSection") {

        displayOrders();

    }

}


function updateDashboard() {

    document.getElementById(
        "totalProducts"
    ).textContent =
        products.length;


    const lowStock =
        products.filter(
            product =>
                product.quantity < 10
        ).length;


    document.getElementById(
        "lowStock"
    ).textContent =
        lowStock;


    document.getElementById(
        "totalSuppliers"
    ).textContent =
        suppliers.length;


    document.getElementById(
        "totalOrders"
    ).textContent =
        orders.length;

}

function openProductForm() {

    document.getElementById(
        "productModal"
    ).classList.remove("hidden");


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Product";


    document.getElementById(
        "productId"
    ).value = "";


    document.getElementById(
        "productName"
    ).value = "";


    document.getElementById(
        "productCategory"
    ).value = "";


    document.getElementById(
        "productPrice"
    ).value = "";


    document.getElementById(
        "productQuantity"
    ).value = "";


    document.getElementById(
        "productSupplier"
    ).value = "";

}

function closeProductForm() {

    document.getElementById(
        "productModal"
    ).classList.add("hidden");

}


function saveProduct(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "productId"
        ).value;


    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const category =
        document.getElementById(
            "productCategory"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "productPrice"
            ).value
        );


    const quantity =
        Number(
            document.getElementById(
                "productQuantity"
            ).value
        );


    const supplier =
        document.getElementById(
            "productSupplier"
        ).value.trim();


    if (id) {

        const product =
            products.find(
                p =>
                    p.id === Number(id)
            );


        if (product) {

            product.name =
                name;

            product.category =
                category;

            product.price =
                price;

            product.quantity =
                quantity;

            product.supplier =
                supplier;

        }

    }

    else {

        products.push({

            id: Date.now(),

            name: name,

            category: category,

            price: price,

            quantity: quantity,

            supplier: supplier

        });

    }


    saveData();

    closeProductForm();

    displayProducts();

    updateDashboard();

    alert(
        id
            ? "Product updated successfully!"
            : "Product added successfully!"
    );

}

function displayProducts() {

    const table =
        document.getElementById(
            "productsTable"
        );


    if (products.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="7">

                    No products available.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        products.map(product => `

            <tr>

                <td>
                    ${product.id}
                </td>

                <td>
                    <strong>
                        ${product.name}
                    </strong>
                </td>

                <td>
                    ${product.category}
                </td>

                <td>
                    ₹${product.price.toLocaleString("en-IN")}
                </td>

                <td>
                    ${product.quantity}
                </td>

                <td>
                    ${product.supplier}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editProduct(${product.id})">

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${product.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `).join("");

}

function editProduct(id) {

    const product =
        products.find(
            p => p.id === id
        );


    if (!product) return;


    document.getElementById(
        "productModal"
    ).classList.remove("hidden");


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Product";


    document.getElementById(
        "productId"
    ).value =
        product.id;


    document.getElementById(
        "productName"
    ).value =
        product.name;


    document.getElementById(
        "productCategory"
    ).value =
        product.category;


    document.getElementById(
        "productPrice"
    ).value =
        product.price;


    document.getElementById(
        "productQuantity"
    ).value =
        product.quantity;


    document.getElementById(
        "productSupplier"
    ).value =
        product.supplier;

}


function deleteProduct(id) {

    const product =
        products.find(
            p => p.id === id
        );


    if (!product) return;


    const confirmation =
        confirm(
            "Delete " +
            product.name +
            "?"
        );


    if (!confirmation) {

        return;

    }


    products =
        products.filter(
            p => p.id !== id
        );


    saveData();

    displayProducts();

    updateDashboard();

}

function addSupplier() {

    const name =
        prompt(
            "Enter supplier name:"
        );


    if (!name) return;


    const contact =
        prompt(
            "Enter supplier contact number:"
        );


    if (!contact) return;


    suppliers.push({

        id: Date.now(),

        name: name,

        contact: contact

    });


    saveData();

    displaySuppliers();

    updateDashboard();


    alert(
        "Supplier added successfully!"
    );

}

function displaySuppliers() {

    const container =
        document.getElementById(
            "suppliersContainer"
        );


    if (suppliers.length === 0) {

        container.innerHTML =
            "<p>No suppliers found.</p>";

        return;

    }


    container.innerHTML =
        suppliers.map(supplier => `

            <div class="supplier-card">

                <h3>
                    🚚 ${supplier.name}
                </h3>

                <p>
                    📞 ${supplier.contact}
                </p>

                <button
                    class="delete-btn"
                    onclick="deleteSupplier(${supplier.id})">

                    Delete

                </button>

            </div>

        `).join("");
        }

function deleteSupplier(id) {

    const confirmation =
        confirm(
            "Delete this supplier?"
        );


    if (!confirmation) return;


    suppliers =
        suppliers.filter(
            supplier =>
                supplier.id !== id
        );


    saveData();

    displaySuppliers();

    updateDashboard();

}


function displayOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    if (orders.length === 0) {

        container.innerHTML = `

            <div class="dashboard-box">

                <h3>
                    No customer orders yet.
                </h3>

            </div>

        `;

        return;

    }


    container.innerHTML =
        orders
            .slice()
            .reverse()
            .map(order => `

                <div class="order-card">

                    <div class="order-header">

                        <div>

                            <h3>
                                ${order.id}
                            </h3>

                            <p>
                                Customer:
                                ${order.customerName}
                            </p>

                            <p>
                                Username:
                                ${order.username}
                            </p>

                            <p>
                                Date:
                                ${order.date}
                            </p>

                        </div>


                        <span class="status">

                            ${order.status}

                        </span>

                    </div>


                    <div>

                        ${order.items.map(item => `

                            <div class="order-item">

                                ${item.name}

                                ×

                                ${item.quantity}

                                &nbsp; -

                                ₹${item.total.toLocaleString("en-IN")}

                            </div>

                        `).join("")}

                    </div>


                    <h3 style="margin-top:15px;">

                        Total:
                        ₹${order.total.toLocaleString("en-IN")}

                    </h3>


                    ${
                        order.status === "Pending"

                        ?

                        `
                        <button
                            class="complete-btn"
                            onclick="completeOrder('${order.id}')">

                            Mark as Completed

                        </button>
                        `

                        :

                        ""
                    }

                </div>

            `).join("");

}

function completeOrder(orderId) {

    const order =
        orders.find(
            o =>
                o.id === orderId
        );


    if (!order) return;


    order.status =
        "Completed";


    saveData();

    displayOrders();

}

function logout() {

    localStorage.removeItem(
        "currentUser"
    );


    window.location.href =
        "index.html";

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        document.getElementById(
            "welcomeAdmin"
        ).textContent =
            "Welcome, " +
            (currentUser.name || currentUser.username);

        document.getElementById(
            "adminName"
        ).textContent =
            currentUser.username;
        updateDashboard();
        displayProducts();
        displaySuppliers();
        displayOrders();
    }
);
