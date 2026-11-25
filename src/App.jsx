import { useEffect, useState } from "react";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Dell Inspiron 15 Laptop", brand: "Dell", category: "Electronics", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80", price: 54990, amazonPrice: 56990, flipkartPrice: 55999, meeshoPrice: 57999, nextSaleName: "Year-End Tech Sale", nextSaleWindow: "Late December", expectedSalePrice: 51999, quantity: 10, supplier: "Dell Suppliers" },
  { id: 2, name: "Logitech G213 Gaming Keyboard", brand: "Logitech", category: "Accessories", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80", price: 4499, amazonPrice: 4299, flipkartPrice: 4399, meeshoPrice: 4599, nextSaleName: "Republic Day Tech Fest", nextSaleWindow: "January", expectedSalePrice: 3899, quantity: 25, supplier: "Tech World" },
  { id: 3, name: "Logitech MX Master 3S Mouse", brand: "Logitech", category: "Accessories", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80", price: 9999, amazonPrice: 10499, flipkartPrice: 9899, meeshoPrice: 10999, nextSaleName: "Mega Electronics Days", nextSaleWindow: "Next month", expectedSalePrice: 8999, quantity: 30, supplier: "Tech World" },
  { id: 4, name: 'Dell UltraSharp 24" Monitor', brand: "Dell", category: "Electronics", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80", price: 18999, amazonPrice: 19499, flipkartPrice: 19999, meeshoPrice: 18499, nextSaleName: "Festive Electronics Sale", nextSaleWindow: "Festive season", expectedSalePrice: 16999, quantity: 8, supplier: "Display Hub" },
  { id: 5, name: "Sony WH-1000XM5 Headphones", brand: "Sony", category: "Accessories", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", price: 27990, amazonPrice: 26990, flipkartPrice: 28499, meeshoPrice: 28999, nextSaleName: "New Year Audio Drop", nextSaleWindow: "Early January", expectedSalePrice: 24999, quantity: 15, supplier: "Audio World" },
  { id: 6, name: "Logitech C920 HD Pro Webcam", brand: "Logitech", category: "Electronics", image: "https://images-cdn.ubuy.co.in/635125dd0f248c4416034d5c-logitech-c920-hd-pro-webcam-1080p.jpg", price: 6999, amazonPrice: 7299, flipkartPrice: 6899, meeshoPrice: 7499, nextSaleName: "Work-From-Home Fest", nextSaleWindow: "January", expectedSalePrice: 5999, quantity: 12, supplier: "Tech World" },
  { id: 7, name: "Samsung T7 1TB Portable SSD", brand: "Samsung", category: "Electronics", image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80", price: 8999, amazonPrice: 9299, flipkartPrice: 9499, meeshoPrice: 8799, nextSaleName: "Super Value Tech Days", nextSaleWindow: "Next month", expectedSalePrice: 7999, quantity: 18, supplier: "Storage Hub" },
  { id: 8, name: "HP LaserJet Pro Wireless Printer", brand: "HP", category: "Electronics", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80", price: 24999, amazonPrice: 25999, flipkartPrice: 24499, meeshoPrice: 26999, nextSaleName: "Office & College Sale", nextSaleWindow: "February", expectedSalePrice: 21999, quantity: 7, supplier: "HP Enterprise" }
];

const DEFAULT_SUPPLIERS = [
  { id: 1, name: "Dell Suppliers", contact: "9876543210" },
  { id: 2, name: "Tech World", contact: "9876501234" },
  { id: 3, name: "Display Hub", contact: "9123456780" }
];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    return fallback;
  }
}

function currency(value) {
  return `₹${(Number(value) || 0).toLocaleString("en-IN")}`;
}

function getInitialProducts() {
  const saved = readStorage("products", null);
  if (!Array.isArray(saved)) return DEFAULT_PRODUCTS;
  const products = saved.map(product => {
    const name = String(product.name || "").toLowerCase();
    const canonical = DEFAULT_PRODUCTS.find(item =>
      item.name.toLowerCase() === name ||
      (name && ["laptop", "keyboard", "mouse", "monitor", "headphone", "webcam", "ssd", "printer"].some(word =>
        name.includes(word) && item.name.toLowerCase().includes(word)))
    );
    return canonical && name.includes("webcam") ? { ...product, image: canonical.image } : product;
  });
  const ids = new Set(products.map(product => String(product.id)));
  DEFAULT_PRODUCTS.forEach(product => {
    if (!ids.has(String(product.id))) products.push({ ...product });
  });
  return products;
}

function marketAnalysis(product) {
  const price = Number(product.price) || 0;
  const id = Number(product.id) || 1;
  const calculated = [
    Math.round(price * (id % 3 === 0 ? 0.96 : 1.06)),
    Math.round(price * (id % 3 === 1 ? 0.96 : 1.03)),
    Math.round(price * (id % 3 === 2 ? 0.96 : 1.05))
  ];
  const offers = [
    { name: "Our Store", price },
    { name: "Amazon", price: Number(product.amazonPrice) || calculated[0] },
    { name: "Flipkart", price: Number(product.flipkartPrice) || calculated[1] },
    { name: "Meesho", price: Number(product.meeshoPrice) || calculated[2] }
  ].sort((a, b) => a.price - b.price);
  return {
    price,
    amazon: offers.find(item => item.name === "Amazon").price,
    flipkart: offers.find(item => item.name === "Flipkart").price,
    meesho: offers.find(item => item.name === "Meesho").price,
    cheapest: offers[0],
    nextSale: Number(product.expectedSalePrice) || Math.round(offers[0].price * 0.9)
  };
}

function samplePlatformReviews(product) {
  const id = Number(product.id) || 1;
  return [
    { name: "Our Store", rating: (4.2 + (id % 6) * 0.1).toFixed(1), count: 24 + id * 17 },
    { name: "Amazon", rating: (4.0 + (id % 7) * 0.1).toFixed(1), count: 180 + id * 83 },
    { name: "Flipkart", rating: (3.9 + (id % 6) * 0.1).toFixed(1), count: 120 + id * 61 },
    { name: "Meesho", rating: (3.8 + (id % 7) * 0.1).toFixed(1), count: 45 + id * 34 }
  ];
}

function App() {
  const [currentUser, setCurrentUser] = useState(() => readStorage("currentUser", null));
  const [accounts, setAccounts] = useState(() => {
    const value = readStorage("accounts", []);
    return Array.isArray(value) ? value : [];
  });
  const [products, setProducts] = useState(getInitialProducts);
  const [suppliers, setSuppliers] = useState(() => {
    const value = readStorage("suppliers", DEFAULT_SUPPLIERS);
    return Array.isArray(value) ? value : DEFAULT_SUPPLIERS;
  });
  const [orders, setOrders] = useState(() => {
    const value = readStorage("orders", []);
    return Array.isArray(value) ? value : [];
  });
  const [cart, setCart] = useState(() => {
    const user = readStorage("currentUser", null);
    if (!user?.username) return [];
    const value = readStorage(`cart_${user.username}`, []);
    return Array.isArray(value) ? value : [];
  });

  useEffect(() => localStorage.setItem("accounts", JSON.stringify(accounts)), [accounts]);
  useEffect(() => localStorage.setItem("products", JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem("suppliers", JSON.stringify(suppliers)), [suppliers]);
  useEffect(() => localStorage.setItem("orders", JSON.stringify(orders)), [orders]);
  useEffect(() => {
    if (currentUser?.username) {
      localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);
  useEffect(() => {
    document.body.className = currentUser ? `${currentUser.role}-app` : "login-app";
    return () => { document.body.className = ""; };
  }, [currentUser]);

  function login(username, password) {
    const account = accounts.find(user =>
      String(user.username).toLowerCase() === username.trim().toLowerCase() && user.password === password
    );
    if (!account || !["user", "admin"].includes(account.role)) {
      alert("Invalid username or password.");
      return;
    }
    localStorage.setItem("currentUser", JSON.stringify(account));
    setCurrentUser(account);
    const savedCart = readStorage(`cart_${account.username}`, []);
    setCart(Array.isArray(savedCart) ? savedCart : []);
  }

  function signup(account) {
    if (account.password !== account.confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }
    if (accounts.some(user => user.username.toLowerCase() === account.username.toLowerCase())) {
      alert("Username already exists.");
      return false;
    }
    if (accounts.some(user => user.email.toLowerCase() === account.email.toLowerCase())) {
      alert("Email is already registered.");
      return false;
    }
    const savedAccount = {
      id: Date.now(), name: account.name.trim(), username: account.username.trim(),
      email: account.email.trim(), password: account.password, role: account.role
    };
    setAccounts(previous => [...previous, savedAccount]);
    alert("Account created. Please log in.");
    return true;
  }

  function logout() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setCart([]);
  }

  if (!currentUser) return <Auth onLogin={login} onSignup={signup} />;
  if (currentUser.role === "admin") {
    return <AdminDashboard user={currentUser} products={products} setProducts={setProducts} suppliers={suppliers} setSuppliers={setSuppliers} orders={orders} setOrders={setOrders} onLogout={logout} />;
  }
  if (currentUser.role === "user") {
    return <UserDashboard user={currentUser} products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} cart={cart} setCart={setCart} onLogout={logout} />;
  }
  return <Auth onLogin={login} onSignup={signup} />;
}

function Auth({ onLogin, onSignup }) {
  const [screen, setScreen] = useState("login");
  const [loginFields, setLoginFields] = useState({ username: "", password: "" });
  const [signupFields, setSignupFields] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "", role: "" });
  const change = setter => event => setter(previous => ({ ...previous, [event.target.name]: event.target.value }));

  function submitSignup(event) {
    event.preventDefault();
    if (onSignup(signupFields)) {
      setLoginFields(previous => ({ ...previous, username: signupFields.username }));
      setSignupFields({ name: "", username: "", email: "", password: "", confirmPassword: "", role: "" });
      setScreen("login");
    }
  }

  return (
    <main className="auth-container">
      <div className="auth-card">
        {screen === "login" ? <>
          <div className="logo"><h1>Inventory Hub</h1><p>Login to continue</p></div>
          <form onSubmit={event => { event.preventDefault(); onLogin(loginFields.username, loginFields.password); }}>
            <label htmlFor="loginUsername">Username</label>
            <input id="loginUsername" name="username" value={loginFields.username} onChange={change(setLoginFields)} placeholder="Enter username" required />
            <label htmlFor="loginPassword">Password</label>
            <input id="loginPassword" name="password" type="password" value={loginFields.password} onChange={change(setLoginFields)} placeholder="Enter password" required />
            <button className="primary-btn" type="submit">Login</button>
          </form>
          <p className="signup-text">Don't have an account? <button className="link-btn" onClick={() => setScreen("signup")}>Sign Up</button></p>
        </> : <>
          <div className="logo"><h1>Create Account</h1><p>Register for Inventory Management System</p></div>
          <form onSubmit={submitSignup}>
            <label htmlFor="signupName">Full Name</label><input id="signupName" name="name" value={signupFields.name} onChange={change(setSignupFields)} required />
            <label htmlFor="signupUsername">Username</label><input id="signupUsername" name="username" value={signupFields.username} onChange={change(setSignupFields)} required />
            <label htmlFor="signupEmail">Email</label><input id="signupEmail" name="email" type="email" value={signupFields.email} onChange={change(setSignupFields)} required />
            <label htmlFor="signupPassword">Password</label><input id="signupPassword" name="password" type="password" value={signupFields.password} onChange={change(setSignupFields)} required />
            <label htmlFor="signupConfirmPassword">Confirm Password</label><input id="signupConfirmPassword" name="confirmPassword" type="password" value={signupFields.confirmPassword} onChange={change(setSignupFields)} required />
            <label htmlFor="signupRole">Select Role</label>
            <select id="signupRole" name="role" value={signupFields.role} onChange={change(setSignupFields)} required>
              <option value="">Select Role</option><option value="user">User</option><option value="admin">Admin</option>
            </select>
            <button className="primary-btn" type="submit">Create Account</button>
          </form>
          <p className="signup-text">Already have an account? <button className="link-btn" onClick={() => setScreen("login")}>Login</button></p>
        </>}
      </div>
    </main>
  );
}

function Sidebar({ role, section, setSection, onLogout, cartCount = 0 }) {
  const items = role === "admin"
    ? [["dashboard", "🏠 Dashboard"], ["products", "📦 Manage Products"], ["suppliers", "🚚 Suppliers"], ["orders", "🛒 Customer Orders"]]
    : [["dashboard", "🏠 Dashboard"], ["products", "🛒 Shop Products"], ["cart", "🛍️ My Cart"], ["orders", "📦 My Orders"]];
  return <aside className="sidebar">
    <div className="sidebar-logo"><h2>Inventory</h2><p>{role === "admin" ? "Admin Panel" : "User Panel"}</p></div>
    {items.map(([id, label]) => <button key={id} className={section === id ? "nav-active" : ""} onClick={() => setSection(id)}>{label}{id === "cart" && <span id="cartCount">{cartCount}</span>}</button>)}
    <button onClick={onLogout} className="logout-btn">🚪 Logout</button>
  </aside>;
}

function Header({ title, welcome, username, admin = false }) {
  return <div className="topbar"><div><h1>{title}</h1><p>{welcome}</p></div><div className={admin ? "admin-info" : "user-info"}>{admin ? "👨‍💼" : "👤"} <span>{username}</span></div></div>;
}

function UserDashboard({ user, products, setProducts, orders, setOrders, cart, setCart, onLogout }) {
  const [section, setSection] = useState("dashboard");
  const [search, setSearch] = useState("");
  const ownOrders = orders.filter(order => String(order.username).toLowerCase() === String(user.username).toLowerCase());
  const cartItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const cartValue = cart.reduce((sum, item) => {
    const product = products.find(candidate => Number(candidate.id) === Number(item.productId));
    return sum + (product ? Number(product.price) * Number(item.quantity) : 0);
  }, 0);

  function addToCart(product) {
    const found = cart.find(item => Number(item.productId) === Number(product.id));
    if (Number(product.quantity) <= 0) return alert("This product is out of stock.");
    if (found && Number(found.quantity) >= Number(product.quantity)) return alert("Available stock limit reached.");
    setCart(previous => found
      ? previous.map(item => Number(item.productId) === Number(product.id) ? { ...item, quantity: Number(item.quantity) + 1 } : item)
      : [...previous, { productId: product.id, quantity: 1 }]);
  }

  function changeQuantity(productId, delta) {
    const product = products.find(item => Number(item.id) === Number(productId));
    setCart(previous => previous.map(item => Number(item.productId) === Number(productId)
      ? { ...item, quantity: Math.min(Number(product?.quantity) || 0, Number(item.quantity) + delta) }
      : item).filter(item => item.quantity > 0));
  }

  function placeOrder() {
    if (!cart.length) return alert("Your cart is empty.");
    for (const item of cart) {
      const product = products.find(candidate => Number(candidate.id) === Number(item.productId));
      if (!product || Number(item.quantity) > Number(product.quantity)) return alert(`${product?.name || "An item"} does not have enough stock.`);
    }
    let total = 0;
    const orderItems = cart.map(item => {
      const product = products.find(candidate => Number(candidate.id) === Number(item.productId));
      const amount = Number(product.price) * Number(item.quantity);
      total += amount;
      return { productId: product.id, name: product.name, category: product.category, price: Number(product.price), quantity: Number(item.quantity), total: amount };
    });
    const order = { id: `ORD-${Date.now()}`, username: user.username, customerName: user.name || user.username, email: user.email || "", items: orderItems, total, status: "Pending", date: new Date().toLocaleString("en-IN") };
    setProducts(previous => previous.map(product => {
      const ordered = cart.find(item => Number(item.productId) === Number(product.id));
      return ordered ? { ...product, quantity: Number(product.quantity) - Number(ordered.quantity) } : product;
    }));
    setOrders(previous => [...previous, order]);
    setCart([]);
    alert(`Order placed successfully!\n\nOrder ID: ${order.id}`);
    setSection("orders");
  }

  const filteredProducts = products.filter(product => `${product.name} ${product.category} ${product.brand || ""}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="app-layout">
    <Sidebar role="user" section={section} setSection={setSection} onLogout={onLogout} cartCount={cartItems} />
    <main className="main">
      <Header title="User Dashboard" welcome={`Welcome, ${user.name || user.username}`} username={user.username} />
      {section === "dashboard" && <section className="section">
        <h2>Dashboard</h2>
        <div className="stats">
          <Stat title="Available Products" value={products.filter(product => Number(product.quantity) > 0).length} />
          <Stat title="Cart Items" value={cartItems} />
          <Stat title="My Orders" value={ownOrders.length} />
          <Stat title="Cart Value" value={currency(cartValue)} />
        </div>
        <div className="welcome-box"><h2>Welcome to the Shop 🛍️</h2><p>Browse available products, add items to your cart, and place your order.</p><button className="shop-btn" onClick={() => setSection("products")}>Start Shopping</button></div>
      </section>}
      {section === "products" && <section className="section">
        <div className="section-header"><div><h2>Available Products</h2><p>Select products and add them to your cart.</p></div><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products..." /></div>
        <div className="products-grid">
          {filteredProducts.map(product => <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />)}
          {!filteredProducts.length && <div className="welcome-box"><h2>No products found</h2><p>Try another search.</p></div>}
        </div>
      </section>}
      {section === "cart" && <section className="section"><h2>My Shopping Cart</h2>
        {!cart.length ? <div className="welcome-box"><h2>Your cart is empty</h2><p>Browse products and add items to your cart.</p><button className="shop-btn" onClick={() => setSection("products")}>Start Shopping</button></div> : <>
          {cart.map(item => {
            const product = products.find(candidate => Number(candidate.id) === Number(item.productId));
            if (!product) return null;
            return <div className="cart-item" key={item.productId}><div className="cart-info"><h3>{product.name}</h3><p>{currency(product.price)} each</p></div><div className="quantity-controls"><button onClick={() => changeQuantity(product.id, -1)}>-</button><strong>{item.quantity}</strong><button onClick={() => changeQuantity(product.id, 1)}>+</button><button className="remove-btn" onClick={() => setCart(previous => previous.filter(line => Number(line.productId) !== Number(product.id)))}>×</button></div><strong>{currency(Number(product.price) * Number(item.quantity))}</strong></div>;
          })}
          <div className="cart-total"><h2>Total: {currency(cartValue)}</h2><button className="checkout-btn" onClick={placeOrder}>Place Order</button></div>
        </>}
      </section>}
      {section === "orders" && <section className="section"><h2>My Orders</h2>{ownOrders.length ? ownOrders.slice().reverse().map(order => <OrderCard key={order.id} order={order} />) : <div className="welcome-box"><h2>No orders yet</h2><p>Your placed orders will appear here.</p><button className="shop-btn" onClick={() => setSection("products")}>Start Shopping</button></div>}</section>}
    </main>
  </div>;
}

function ProductCard({ product, onAdd }) {
  const market = marketAnalysis(product);
  const reviews = samplePlatformReviews(product);
  const nextSaleName = product.nextSaleName || "Upcoming promotional sale";
  const nextSaleWindow = product.nextSaleWindow || "Dates to be announced";
  const nextSalePrice = Number(product.expectedSalePrice) || Math.round(market.cheapest.price * 0.9);
  const image = product.image || DEFAULT_PRODUCTS.find(item => String(product.name).toLowerCase().includes(item.name.split(" ").at(-1).toLowerCase()))?.image || DEFAULT_PRODUCTS[0].image;
  const cheapestHere = market.cheapest.name === "Our Store";
  return <article className="product-card">
    <div className="product-image"><img src={image} alt={product.name} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = DEFAULT_PRODUCTS[0].image; }} /></div>
    <div className="product-details"><h3>{product.name}</h3><p className="category">{product.category}</p><p className="price">{currency(market.price)}</p>
      <div className="price-compare-box"><div className="compare-header"><span>Sample Price Comparison</span>{cheapestHere ? <span className="savings-pill">Lowest here</span> : <span className="higher-pill">Cheaper on {market.cheapest.name}</span>}</div>
        {[ ["Amazon", market.amazon], ["Flipkart", market.flipkart], ["Meesho", market.meesho] ].map(([name, amount]) => {
          const review = reviews.find(item => item.name === name);
          return <div key={name} className={`compare-row compare-platform ${market.cheapest.name === name ? "cheapest-platform" : ""}`}><span>{name}{market.cheapest.name === name ? " (Lowest)" : ""}<small>★ {review.rating} · {review.count.toLocaleString("en-IN")} ratings</small></span><strong>{currency(amount)}</strong></div>;
        })}
      </div>
      <div className="sale-forecast"><strong>Next offer: {nextSaleName}</strong><span>Expected timing: {nextSaleWindow}</span><span>Estimated sale price: <b>{currency(nextSalePrice)}</b></span><small>Forecast only; sale details may change.</small></div>
      <details className="review-details"><summary>Platform ratings <small>(sample data)</small></summary><div>{reviews.map(review => <p key={review.name}><span>{review.name}</span><strong>★ {review.rating}</strong><small>{review.count.toLocaleString("en-IN")} ratings</small></p>)}</div></details>
      <p className="stock">{Number(product.quantity) > 0 ? `In stock: ${product.quantity}` : "Out of stock"}</p>
      <button className="shop-btn" disabled={Number(product.quantity) <= 0} onClick={onAdd}>{Number(product.quantity) > 0 ? "Add to Cart" : "Out of Stock"}</button>
    </div>
  </article>;
}

function OrderCard({ order, onComplete }) {
  return <article className="order-card"><div className="order-header"><div><h3>{order.id}</h3><p>{order.date}</p>{order.username && <p>Customer: {order.customerName || order.username} ({order.username})</p>}</div><span className="status">{order.status}</span></div>
    {(order.items || []).map((item, index) => <div key={`${item.productId || item.name}-${index}`} className="order-item">{item.name} × {item.quantity} — {currency(item.total)}</div>)}
    <h3 style={{ marginTop: 15 }}>Total: {currency(order.total)}</h3>
    {onComplete && order.status === "Pending" && <button className="complete-btn" onClick={onComplete}>Mark as Completed</button>}
  </article>;
}

function AdminDashboard({ user, products, setProducts, suppliers, setSuppliers, orders, setOrders, onLogout }) {
  const [section, setSection] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const blank = { name: "", category: "", price: "", quantity: "", supplier: "", image: "", nextSaleName: "", nextSaleWindow: "", expectedSalePrice: "" };
  const [form, setForm] = useState(blank);

  function openForm(product = null) {
    setEditingId(product?.id ?? null);
    setForm(product ? { ...blank, ...product } : blank);
    setShowModal(true);
  }

  function saveProduct(event) {
    event.preventDefault();
    if (editingId !== null) {
      setProducts(previous => previous.map(product => Number(product.id) === Number(editingId) ? { ...product, ...form, price: Number(form.price), quantity: Number(form.quantity), expectedSalePrice: Number(form.expectedSalePrice) || 0 } : product));
    } else {
      setProducts(previous => [...previous, { ...form, id: Date.now(), price: Number(form.price), quantity: Number(form.quantity), expectedSalePrice: Number(form.expectedSalePrice) || 0 }]);
    }
    setShowModal(false);
  }

  function removeProduct(product) {
    if (window.confirm(`Delete ${product.name}?`)) setProducts(previous => previous.filter(item => item.id !== product.id));
  }

  function addSupplier() {
    const name = window.prompt("Enter supplier name:");
    if (!name?.trim()) return;
    const contact = window.prompt("Enter supplier contact number:");
    if (!contact?.trim()) return;
    setSuppliers(previous => [...previous, { id: Date.now(), name: name.trim(), contact: contact.trim() }]);
  }

  function completeOrder(orderId) {
    setOrders(previous => previous.map(order => order.id === orderId ? { ...order, status: "Completed" } : order));
  }

  return <div className="app-layout">
    <Sidebar role="admin" section={section} setSection={setSection} onLogout={onLogout} />
    <main className="main">
      <Header title="Admin Dashboard" welcome={`Welcome, ${user.name || user.username}`} username={user.username} admin />
      {section === "dashboard" && <section className="section"><h2>Dashboard</h2><div className="stats"><Stat title="Total Products" value={products.length} /><Stat title="Low Stock" value={products.filter(product => Number(product.quantity) < 10).length} /><Stat title="Suppliers" value={suppliers.length} /><Stat title="Total Orders" value={orders.length} /></div><div className="dashboard-box"><h2>Inventory Overview</h2><p>Manage products, suppliers, and customer orders from the admin panel.</p></div></section>}
      {section === "products" && <section className="section"><div className="section-header"><div><h2>Manage Products</h2><p>Add, edit, and delete inventory products.</p></div><button className="add-btn" onClick={() => openForm()}>+ Add Product</button></div><div className="table-container"><table><thead><tr><th>ID</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Supplier</th><th>Actions</th></tr></thead><tbody>{products.map(product => <tr key={product.id}><td>{product.id}</td><td><strong>{product.name}</strong></td><td>{product.category}</td><td>{currency(product.price)}</td><td>{product.quantity}</td><td>{product.supplier}</td><td><button className="edit-btn" onClick={() => openForm(product)}>Edit</button><button className="delete-btn" onClick={() => removeProduct(product)}>Delete</button></td></tr>)}</tbody></table></div></section>}
      {section === "suppliers" && <section className="section"><div className="section-header"><div><h2>Manage Suppliers</h2><p>Add and remove suppliers.</p></div><button className="add-btn" onClick={addSupplier}>+ Add Supplier</button></div><div className="supplier-grid">{suppliers.map(supplier => <article key={supplier.id} className="supplier-card"><h3>🚚 {supplier.name}</h3><p>📞 {supplier.contact}</p><button className="delete-btn" onClick={() => setSuppliers(previous => previous.filter(item => item.id !== supplier.id))}>Delete</button></article>)}</div></section>}
      {section === "orders" && <section className="section"><h2>Customer Orders</h2>{orders.length ? orders.slice().reverse().map(order => <OrderCard key={order.id} order={order} onComplete={() => completeOrder(order.id)} />) : <div className="dashboard-box"><h3>No customer orders yet.</h3></div>}</section>}
    </main>
    {showModal && <div className="modal" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setShowModal(false); }}><div className="modal-content"><div className="modal-header"><h2>{editingId === null ? "Add Product" : "Edit Product"}</h2><button type="button" onClick={() => setShowModal(false)}>×</button></div><form onSubmit={saveProduct}>
      <label htmlFor="productName">Product Name</label><input id="productName" value={form.name} onChange={event => setForm(previous => ({ ...previous, name: event.target.value }))} required />
      <label htmlFor="productCategory">Category</label><input id="productCategory" value={form.category} onChange={event => setForm(previous => ({ ...previous, category: event.target.value }))} required />
      <label htmlFor="productPrice">Price</label><input id="productPrice" type="number" min="0" value={form.price} onChange={event => setForm(previous => ({ ...previous, price: event.target.value }))} required />
      <label htmlFor="productQuantity">Quantity</label><input id="productQuantity" type="number" min="0" value={form.quantity} onChange={event => setForm(previous => ({ ...previous, quantity: event.target.value }))} required />
      <label htmlFor="productSupplier">Supplier</label><input id="productSupplier" value={form.supplier} onChange={event => setForm(previous => ({ ...previous, supplier: event.target.value }))} required />
      <label htmlFor="productImage">Image URL (optional)</label><input id="productImage" type="url" value={form.image || ""} onChange={event => setForm(previous => ({ ...previous, image: event.target.value }))} />
      <label htmlFor="nextSaleName">Next Offer Name</label><input id="nextSaleName" value={form.nextSaleName || ""} onChange={event => setForm(previous => ({ ...previous, nextSaleName: event.target.value }))} placeholder="Example: Year-End Sale" />
      <label htmlFor="nextSaleWindow">Expected Offer Timing</label><input id="nextSaleWindow" value={form.nextSaleWindow || ""} onChange={event => setForm(previous => ({ ...previous, nextSaleWindow: event.target.value }))} placeholder="Example: Late December" />
      <label htmlFor="expectedSalePrice">Estimated Sale Price</label><input id="expectedSalePrice" type="number" min="0" value={form.expectedSalePrice || ""} onChange={event => setForm(previous => ({ ...previous, expectedSalePrice: event.target.value }))} />
      <button type="submit" className="save-btn">Save Product</button>
    </form></div></div>}
  </div>;
}

function Stat({ title, value }) {
  return <div className="stat-card"><h3>{title}</h3><p>{value}</p></div>;
}

export default App;
