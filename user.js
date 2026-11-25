"use strict";

const currentUser = readStoredArrayOrObject("currentUser", null);

if (!currentUser || currentUser.role !== "user") {
    window.location.href = "index.html";
}

function readStoredArrayOrObject(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch {
        return fallback;
    }
}

const DEFAULT_PRODUCTS = [
    { id: 1, name: "Dell Inspiron 15 Laptop", brand: "Dell", category: "Electronics", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80", price: 54990, amazonPrice: 56990, flipkartPrice: 55999, meeshoPrice: 57999, nextSaleName: "Year-End Tech Sale", nextSaleWindow: "Late Dec", expectedSalePrice: 51999, quantity: 10, supplier: "Dell Suppliers" },
    { id: 2, name: "Logitech G213 Gaming Keyboard", brand: "Logitech", category: "Accessories", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80", price: 4499, amazonPrice: 4299, flipkartPrice: 4399, meeshoPrice: 4599, nextSaleName: "Republic Day Tech Fest", nextSaleWindow: "January", expectedSalePrice: 3899, quantity: 25, supplier: "Tech World" },
    { id: 3, name: "Logitech MX Master 3S Mouse", brand: "Logitech", category: "Accessories", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80", price: 9999, amazonPrice: 10499, flipkartPrice: 9899, meeshoPrice: 10999, nextSaleName: "Mega Electronics Days", nextSaleWindow: "Next Month", expectedSalePrice: 8999, quantity: 30, supplier: "Tech World" },
    { id: 4, name: "Dell UltraSharp 24\" Monitor", brand: "Dell", category: "Electronics", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80", price: 18999, amazonPrice: 19499, flipkartPrice: 19999, meeshoPrice: 18499, nextSaleName: "Great Indian / Big Billion Sale", nextSaleWindow: "Festive Season", expectedSalePrice: 16999, quantity: 8, supplier: "Display Hub" },
    { id: 5, name: "Sony WH-1000XM5 Headphones", brand: "Sony", category: "Accessories", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", price: 27990, amazonPrice: 26990, flipkartPrice: 28499, meeshoPrice: 28999, nextSaleName: "New Year Audio Drop", nextSaleWindow: "Early Jan", expectedSalePrice: 24999, quantity: 15, supplier: "Audio World" },
    { id: 6, name: "Logitech C920 HD Pro Webcam", brand: "Logitech", category: "Electronics", image: "https://images-cdn.ubuy.co.in/635125dd0f248c4416034d5c-logitech-c920-hd-pro-webcam-1080p.jpg", price: 6999, amazonPrice: 7299, flipkartPrice: 6899, meeshoPrice: 7499, nextSaleName: "Work-From-Home Fest", nextSaleWindow: "January", expectedSalePrice: 5999, quantity: 12, supplier: "Tech World" },
    { id: 7, name: "Samsung T7 1TB Portable SSD", brand: "Samsung", category: "Electronics", image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80", price: 8999, amazonPrice: 9299, flipkartPrice: 9499, meeshoPrice: 8799, nextSaleName: "Super Value Tech Days", nextSaleWindow: "Next Month", expectedSalePrice: 7999, quantity: 18, supplier: "Storage Hub" },
    { id: 8, name: "HP LaserJet Pro Wireless Printer", brand: "HP", category: "Electronics", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80", price: 24999, amazonPrice: 25999, flipkartPrice: 24499, meeshoPrice: 26999, nextSaleName: "Office & College Sale", nextSaleWindow: "February", expectedSalePrice: 21999, quantity: 7, supplier: "HP Enterprise" }
];

let storedProducts = readStoredArrayOrObject("products", null);
let products = Array.isArray(storedProducts) ? storedProducts : DEFAULT_PRODUCTS;

// Bring the older demo catalog in localStorage up to date. Preserve stock and
// supplier edits while refreshing the sample prices, marketplace comparisons,
// and product-specific image URLs.
if (localStorage.getItem("catalogRefreshV1") !== "done") {
products = products.map(product => {
    const name = String(product.name || "").toLowerCase();
    const aliases = ["laptop", "keyboard", "mouse", "monitor", "headphone", "webcam", "ssd", "printer"];
    const canonical = DEFAULT_PRODUCTS.find(item => {
        const itemName = item.name.toLowerCase();
        const alias = aliases.find(word => itemName.includes(word));
        return (name === itemName || (alias && name.includes(alias)) ||
            (Number(product.id) === Number(item.id) && (!name || aliases.some(word => name === word))));
    });
    if (!canonical) return product;
    return {
        ...product,
        name: name === "laptop" ? canonical.name : name === "keyboard" ? canonical.name :
            name === "mouse" ? canonical.name : name === "monitor" ? canonical.name : product.name,
        brand: product.brand || canonical.brand,
        category: product.category || canonical.category,
        image: canonical.image,
        price: canonical.price,
        amazonPrice: canonical.amazonPrice,
        flipkartPrice: canonical.flipkartPrice,
        meeshoPrice: canonical.meeshoPrice,
        nextSaleName: canonical.nextSaleName,
        nextSaleWindow: canonical.nextSaleWindow,
        expectedSalePrice: canonical.expectedSalePrice
    };
});
localStorage.setItem("products", JSON.stringify(products));
localStorage.setItem("catalogRefreshV1", "done");
}

// Ensure older installations also receive every item in the current sample catalog.
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

const cartKey = "cart_" + String(currentUser.username || "");
let storedCart = readStoredArrayOrObject(cartKey, []);
let cart = Array.isArray(storedCart) ? storedCart : [];

let storedOrders = readStoredArrayOrObject("orders", []);
let orders = Array.isArray(storedOrders) ? storedOrders : [];

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function getProductImage(product) {
    if (product.image && String(product.image).trim() && !/^https?:\/\/(www\.)?unsplash\.com\/?(?:\?.*)?$/i.test(product.image.trim())) {
        return product.image;
    }
    const name = String(product.name || "").toLowerCase();
    const fallback = DEFAULT_PRODUCTS.find(item => name.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(name));
    if (fallback) return fallback.image;
    if (name.includes("keyboard")) return DEFAULT_PRODUCTS[1].image;
    if (name.includes("mouse")) return DEFAULT_PRODUCTS[2].image;
    if (name.includes("monitor")) return DEFAULT_PRODUCTS[3].image;
    if (name.includes("headphone")) return DEFAULT_PRODUCTS[4].image;
    if (name.includes("webcam") || name.includes("camera")) return DEFAULT_PRODUCTS[5].image;
    if (name.includes("ssd") || name.includes("storage")) return DEFAULT_PRODUCTS[6].image;
    if (name.includes("printer")) return DEFAULT_PRODUCTS[7].image;
    return DEFAULT_PRODUCTS[0].image;
}

function getMarketAnalysis(product) {
    const ourPrice = Number(product.price) || 0;
    const amazon = Number(product.amazonPrice) || Math.round(ourPrice * 1.06);
    const flipkart = Number(product.flipkartPrice) || Math.round(ourPrice * 0.97);
    const meesho = Number(product.meeshoPrice) || Math.round(ourPrice * 1.03);

    const platforms = [
        { name: "Our Store", price: ourPrice },
        { name: "Amazon", price: amazon },
        { name: "Flipkart", price: flipkart },
        { name: "Meesho", price: meesho }
    ].sort((a, b) => a.price - b.price);

    const lowest = platforms[0];
    const runnerUp = platforms[1];
    const isCheapestHere = lowest.name === "Our Store";
    const diffFromLowest = ourPrice - lowest.price;
    const savingsHere = Math.max(0, runnerUp.price - ourPrice);
    const nextSaleName = product.nextSaleName || "Upcoming Festival Sale";
    const nextSaleWindow = product.nextSaleWindow || "Next Festive Season";
    const expectedSalePrice = Number(product.expectedSalePrice) || Math.round(lowest.price * 0.88);
    const potentialSaleSavings = Math.max(0, ourPrice - expectedSalePrice);

    return {
        ourPrice,
        amazon,
        flipkart,
        meesho,
        lowest,
        isCheapestHere,
        diffFromLowest,
        savingsHere,
        nextSaleName,
        nextSaleWindow,
        expectedSalePrice,
        potentialSaleSavings
    };
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function saveCart() {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
}

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.add("hidden");
    });

    const selected = document.getElementById(sectionId);
    if (selected) selected.classList.remove("hidden");

    document.querySelectorAll(".sidebar button:not(.logout-btn)").forEach(button => {
        const action = button.getAttribute("onclick") || "";
        const active = action.includes(sectionId);
        button.style.background = active ? "rgba(255, 255, 255, 0.22)" : "transparent";
        button.style.fontWeight = active ? "700" : "500";
    });

    if (sectionId === "productsSection") {
        const latestProducts = readStoredArrayOrObject("products", products);
        if (Array.isArray(latestProducts)) products = latestProducts;
        displayProducts();
    }

    if (sectionId === "cartSection") displayCart();

    if (sectionId === "ordersSection") {
        loadOrders();
        displayOrders();
    }

    updateDashboard();
}

function loadOrders() {
    const savedOrders = readStoredArrayOrObject("orders", []);
    orders = Array.isArray(savedOrders) ? savedOrders : [];
}

function displayProducts() {
    const container = document.getElementById("productsContainer");
    if (!container) return;

    const searchInput = document.getElementById("searchProduct");
    const search = searchInput ? searchInput.value.trim().toLowerCase() : "";

    const filtered = products.filter(product => {
        const name = String(product.name || "").toLowerCase();
        const category = String(product.category || "").toLowerCase();
        const brand = String(product.brand || "").toLowerCase();
        return name.includes(search) || category.includes(search) || brand.includes(search);
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="welcome-box" style="grid-column: 1 / -1; text-align: center;">
                <h2>No products found</h2>
                <p>Try searching by brand or product name.</p>
            </div>`;
        return;
    }

    container.innerHTML = filtered.map(product => {
        const m = getMarketAnalysis(product);
        const stock = Number(product.quantity) || 0;
        const stockLabel = stock <= 0
            ? `<span class="higher-pill">Out of stock</span>`
            : stock < 10
                ? `<span class="higher-pill">Only ${stock} left</span>`
                : "";

        const badge = m.isCheapestHere
            ? `<span class="savings-pill">Lowest here (save &#8377;${m.savingsHere.toLocaleString("en-IN")})</span>`
            : `<span class="higher-pill">&#8377;${m.diffFromLowest.toLocaleString("en-IN")} less on ${escapeHtml(m.lowest.name)}</span>`;

        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${escapeHtml(getProductImage(product))}"
                         alt="${escapeHtml(product.name)}"
                         onerror="this.onerror=null;this.parentElement.textContent='No Image';">
                </div>
                <div class="product-details">
                    <h3>${escapeHtml(product.name)}</h3>
                    <p class="category">${escapeHtml(product.category || "")}</p>
                    <p class="price">&#8377;${m.ourPrice.toLocaleString("en-IN")}</p>
                    <div class="price-compare-box">
                        <div class="compare-header"><span>Sample Price Comparison</span>${badge}</div>
                        <div class="compare-row ${m.lowest.name === "Amazon" ? "cheapest-platform" : ""}">
                            <span>Amazon ${m.lowest.name === "Amazon" ? "(Lowest)" : ""}</span>
                            <span>&#8377;${m.amazon.toLocaleString("en-IN")}</span>
                        </div>
                        <div class="compare-row ${m.lowest.name === "Flipkart" ? "cheapest-platform" : ""}">
                            <span>Flipkart ${m.lowest.name === "Flipkart" ? "(Lowest)" : ""}</span>
                            <span>&#8377;${m.flipkart.toLocaleString("en-IN")}</span>
                        </div>
                        <div class="compare-row ${m.lowest.name === "Meesho" ? "cheapest-platform" : ""}">
                            <span>Meesho ${m.lowest.name === "Meesho" ? "(Lowest)" : ""}</span>
                            <span>&#8377;${m.meesho.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                    <p class="sale-forecast">
                        ${escapeHtml(m.nextSaleName)} (${escapeHtml(m.nextSaleWindow)}):
                        ~&#8377;${m.expectedSalePrice.toLocaleString("en-IN")}
                    </p>
                    <p>${stockLabel}</p>
                    <button class="shop-btn" onclick="addToCart(${Number(product.id)})" ${stock <= 0 ? "disabled" : ""}>
                        ${stock <= 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                </div>
            </div>`;
    }).join("");
}

function addToCart(productId) {
    const product = products.find(item => Number(item.id) === Number(productId));
    if (!product) {
        alert("Product not found.");
        return;
    }

    const stock = Number(product.quantity) || 0;
    if (stock <= 0) {
        alert("This product is out of stock.");
        return;
    }

    const existing = cart.find(item => Number(item.productId) === Number(productId));
    if (existing) {
        if (Number(existing.quantity) >= stock) {
            alert("You cannot add more than the available stock.");
            return;
        }
        existing.quantity = Number(existing.quantity) + 1;
    } else {
        cart.push({ productId: product.id, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    updateDashboard();
    alert(product.name + " added to cart.");
}

function displayCart() {
    const container = document.getElementById("cartContainer");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="welcome-box">
                <h2>Your cart is empty</h2>
                <p>Browse products and add items to your cart.</p>
                <button class="shop-btn" onclick="showSection('productsSection')">Start Shopping</button>
            </div>`;
        return;
    }

    let total = 0;
    let lowestMarketTotal = 0;
    let expectedFestivalTotal = 0;
    let html = "";

    cart.forEach(item => {
        const product = products.find(p => Number(p.id) === Number(item.productId));
        if (!product) return;

        const m = getMarketAnalysis(product);
        const quantity = Number(item.quantity) || 0;
        const itemTotal = m.ourPrice * quantity;

        total += itemTotal;
        lowestMarketTotal += m.lowest.price * quantity;
        expectedFestivalTotal += m.expectedSalePrice * quantity;

        const hint = m.isCheapestHere
            ? `<span style="color:#16a34a;font-weight:600;">(Best price across platforms!)</span>`
            : `<span style="color:#d97706;font-weight:600;">(Cheapest on ${escapeHtml(m.lowest.name)}: &#8377;${m.lowest.price.toLocaleString("en-IN")})</span>`;

        html += `
            <div class="cart-item">
                <div style="display:flex;align-items:center;gap:14px;">
                    <img src="${escapeHtml(getProductImage(product))}" alt="${escapeHtml(product.name)}"
                         style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;"
                         onerror="this.style.display='none';">
                    <div class="cart-info">
                        <h3>${escapeHtml(product.name)}</h3>
                        <p>&#8377;${m.ourPrice.toLocaleString("en-IN")} each ${hint}</p>
                    </div>
                </div>
                <div class="quantity-controls">
                    <button onclick="decreaseQuantity(${Number(product.id)})">-</button>
                    <strong>${quantity}</strong>
                    <button onclick="increaseQuantity(${Number(product.id)})">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${Number(product.id)})">Remove</button>
                </div>
                <strong>&#8377;${itemTotal.toLocaleString("en-IN")}</strong>
            </div>`;
    });

    const marketDiff = total - lowestMarketTotal;
    const festivalSavings = Math.max(0, total - expectedFestivalTotal);

    const banner = marketDiff <= 0
        ? `<p style="color:#15803d;font-weight:700;">Your cart beats or matches the lowest prices across Amazon, Flipkart, and Meesho.</p>`
        : `<p style="color:#b45309;font-weight:700;">Cheapest individual picks elsewhere cost &#8377;${lowestMarketTotal.toLocaleString("en-IN")} (&#8377;${marketDiff.toLocaleString("en-IN")} less).</p>`;

    html += `
        <div class="cart-total">
            ${banner}
            <p style="color:#4338ca;font-size:13.5px;font-weight:600;">
                Festival forecast: ~&#8377;${expectedFestivalTotal.toLocaleString("en-IN")}
                (potential savings: &#8377;${festivalSavings.toLocaleString("en-IN")}).
            </p>
            <h2>Total: &#8377;${total.toLocaleString("en-IN")}</h2>
            <button class="checkout-btn" onclick="placeOrder()">Place Order</button>
        </div>`;

    container.innerHTML = html;
}

function increaseQuantity(productId) {
    const product = products.find(p => Number(p.id) === Number(productId));
    const item = cart.find(i => Number(i.productId) === Number(productId));
    if (!product || !item) return;

    if (Number(item.quantity) >= Number(product.quantity)) {
        alert("Maximum available stock reached.");
        return;
    }

    item.quantity = Number(item.quantity) + 1;
    saveCart();
    displayCart();
    updateDashboard();
}

function decreaseQuantity(productId) {
    const item = cart.find(i => Number(i.productId) === Number(productId));
    if (!item) return;

    item.quantity = Number(item.quantity) - 1;
    if (item.quantity <= 0) {
        cart = cart.filter(i => Number(i.productId) !== Number(productId));
    }

    saveCart();
    displayCart();
    updateCartCount();
    updateDashboard();
}

function removeFromCart(productId) {
    cart = cart.filter(item => Number(item.productId) !== Number(productId));
    saveCart();
    displayCart();
    updateCartCount();
    updateDashboard();
}

function placeOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const latestProducts = readStoredArrayOrObject("products", products);
    if (Array.isArray(latestProducts)) products = latestProducts;
    loadOrders();

    for (const item of cart) {
        const product = products.find(p => Number(p.id) === Number(item.productId));
        if (!product) {
            alert("One of the products is no longer available.");
            return;
        }
        if (Number(item.quantity) > Number(product.quantity)) {
            alert(product.name + " does not have enough stock.");
            displayCart();
            return;
        }
    }

    let total = 0;
    const orderItems = cart.map(item => {
        const product = products.find(p => Number(p.id) === Number(item.productId));
        const quantity = Number(item.quantity);
        const price = Number(product.price);
        const itemTotal = price * quantity;

        total += itemTotal;
        product.quantity = Number(product.quantity) - quantity;

        return {
            productId: product.id,
            name: product.name,
            category: product.category,
            price,
            quantity,
            total: itemTotal
        };
    });

    const newOrder = {
        id: "ORD-" + Date.now(),
        username: currentUser.username,
        customerName: currentUser.name || currentUser.username,
        email: currentUser.email || "",
        items: orderItems,
        total,
        status: "Pending",
        date: new Date().toLocaleString("en-IN")
    };

    orders.push(newOrder);
    saveOrders();
    saveProducts();

    cart = [];
    saveCart();

    alert("Order placed successfully!\n\nOrder ID: " + newOrder.id);
    updateCartCount();
    updateDashboard();
    displayCart();
    showSection("ordersSection");
}

function displayOrders() {
    const container = document.getElementById("ordersContainer");
    if (!container) return;

    loadOrders();

    const username = String(currentUser.username || "").toLowerCase();
    const myOrders = orders.filter(order =>
        String(order.username || "").toLowerCase() === username
    );

    if (myOrders.length === 0) {
        container.innerHTML = `
            <div class="welcome-box">
                <h2>No orders yet</h2>
                <p>Your placed orders will appear here.</p>
                <button class="shop-btn" onclick="showSection('productsSection')">Start Shopping</button>
            </div>`;
        return;
    }

    container.innerHTML = myOrders.slice().reverse().map(order => {
        const items = Array.isArray(order.items) ? order.items : [];
        const done = order.status === "Completed";
        const statusStyle = done
            ? "background:#dcfce7;color:#166534;"
            : "background:#fef3c7;color:#92400e;";

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h3>${escapeHtml(order.id)}</h3>
                        <p>${escapeHtml(order.date || "")}</p>
                    </div>
                    <span class="order-status" style="${statusStyle}">${escapeHtml(order.status || "Pending")}</span>
                </div>
                <div class="order-items">
                    ${items.map(item => `
                        <div class="order-product">
                            <strong>${escapeHtml(item.name)}</strong><br>
                            Quantity: ${Number(item.quantity) || 0} x &#8377;${(Number(item.price) || 0).toLocaleString("en-IN")}<br>
                            Subtotal: &#8377;${(Number(item.total) || 0).toLocaleString("en-IN")}
                        </div>`).join("")}
                </div>
                <div style="margin-top:15px;padding-top:15px;border-top:1px solid #e2e8f0;">
                    <h3>Order Total: &#8377;${(Number(order.total) || 0).toLocaleString("en-IN")}</h3>
                </div>
            </div>`;
    }).join("");
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const cartCount = document.getElementById("cartCount");
    const dashboardCart = document.getElementById("dashboardCart");

    if (cartCount) cartCount.textContent = count;
    if (dashboardCart) dashboardCart.textContent = count;
}

function updateDashboard() {
    const totalProducts = document.getElementById("totalProducts");
    const dashboardCart = document.getElementById("dashboardCart");
    const totalOrders = document.getElementById("totalOrders");
    const cartValue = document.getElementById("cartValue");

    if (totalProducts) {
        totalProducts.textContent = products.filter(p => Number(p.quantity) > 0).length;
    }

    if (dashboardCart) {
        dashboardCart.textContent = cart.reduce(
            (sum, item) => sum + (Number(item.quantity) || 0),
            0
        );
    }

    loadOrders();
    const username = String(currentUser.username || "").toLowerCase();
    const myOrders = orders.filter(order =>
        String(order.username || "").toLowerCase() === username
    );

    if (totalOrders) totalOrders.textContent = myOrders.length;

    const value = cart.reduce((sum, item) => {
        const product = products.find(p => Number(p.id) === Number(item.productId));
        return product
            ? sum + (Number(product.price) || 0) * (Number(item.quantity) || 0)
            : sum;
    }, 0);

    if (cartValue) cartValue.textContent = "\u20B9" + value.toLocaleString("en-IN");
    updateCartCount();
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const welcomeUser = document.getElementById("welcomeUser");
    if (welcomeUser) welcomeUser.textContent = "Welcome, " + (currentUser.name || currentUser.username);

    const usernameDisplay = document.getElementById("usernameDisplay");
    if (usernameDisplay) usernameDisplay.textContent = currentUser.username || "";

    const savedProducts = readStoredArrayOrObject("products", products);
    if (Array.isArray(savedProducts)) products = savedProducts;

    loadOrders();

    const savedCart = readStoredArrayOrObject(cartKey, []);
    cart = Array.isArray(savedCart) ? savedCart : [];

    updateDashboard();
    displayProducts();
    updateCartCount();
});
