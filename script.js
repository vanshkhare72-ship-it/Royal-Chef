const API_URL = "https://script.google.com/macros/s/AKfycbzsRJ-_68jiXN9aY8TDZdWXadC8WtCUj5Es_6lMRl6XBvPmRwj2NGyF-61TfhcMlTZB/exec";

let cart = [];
let userLocation = "Not Added";

const menuItems = [
  {
    id: 1,
    name: "Cheese Pizza",
    price: 199,
    category: "Pizza",
    desc: "Loaded with extra cheese and fresh toppings.",
    img: "https://images.unsplash.com/photo-1601924582975-7d1e6b1a1e77?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Paneer Pizza",
    price: 249,
    category: "Pizza",
    desc: "Spicy paneer chunks with premium sauce.",
    img: "https://images.unsplash.com/photo-1548365328-8b849e6fcd1b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Veg Burger",
    price: 149,
    category: "Burger",
    desc: "Crispy patty with lettuce and mayo.",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Chicken Burger",
    price: 199,
    category: "Burger",
    desc: "Juicy chicken patty with special sauce.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Veg Biryani",
    price: 219,
    category: "Biryani",
    desc: "Aromatic rice cooked with spices and veggies.",
    img: "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    name: "Chicken Biryani",
    price: 299,
    category: "Biryani",
    desc: "Hyderabadi style chicken biryani.",
    img: "https://images.unsplash.com/photo-1633945274309-2c16f3d8d6b9?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 7,
    name: "Chocolate Cake",
    price: 159,
    category: "Dessert",
    desc: "Soft chocolate cake with premium cream.",
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 8,
    name: "Cold Coffee",
    price: 99,
    category: "Drinks",
    desc: "Chilled coffee with ice and milk.",
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80"
  }
];

function scrollToSection(id){
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function renderMenu(items){
  const menuGrid = document.getElementById("menuGrid");
  menuGrid.innerHTML = "";

  items.forEach(item => {
    menuGrid.innerHTML += `
      <div class="menu-card">
        <img src="${item.img}" alt="${item.name}">
        <div class="menu-content">
          <h3>${item.name}</h3>
          <p>${item.desc}</p>

          <div class="price-row">
            <span>₹${item.price}</span>
            <button class="add-btn" onclick="addToCart(${item.id})">+ Add</button>
          </div>
        </div>
      </div>
    `;
  });
}

function filterCategory(category){
  document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));

  const clicked = Array.from(document.querySelectorAll(".cat-btn")).find(b => b.innerText === category);
  if(clicked) clicked.classList.add("active");

  if(category === "All"){
    renderMenu(menuItems);
  } else {
    const filtered = menuItems.filter(item => item.category === category);
    renderMenu(filtered);
  }
}

function addToCart(id){
  const item = menuItems.find(m => m.id === id);

  const already = cart.find(c => c.id === id);
  if(already){
    already.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  renderCart();
}

function increaseQty(id){
  const item = cart.find(c => c.id === id);
  if(item){
    item.qty++;
  }
  renderCart();
}

function decreaseQty(id){
  const item = cart.find(c => c.id === id);
  if(item){
    item.qty--;
    if(item.qty <= 0){
      cart = cart.filter(c => c.id !== id);
    }
  }
  renderCart();
}

function renderCart(){
  const cartItems = document.getElementById("cartItems");
  const summaryItems = document.getElementById("summaryItems");

  cartItems.innerHTML = "";
  summaryItems.innerHTML = "";

  if(cart.length === 0){
    cartItems.innerHTML = `<p class="empty-cart">Your cart is empty. Add something delicious 😋</p>`;
    summaryItems.innerHTML = `<p style="color:#aaa;">No items selected</p>`;
    updateTotal();
    return;
  }

  cart.forEach(item => {
    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <p>₹${item.price} x ${item.qty}</p>
        </div>

        <div class="qty-controls">
          <button class="qty-btn" onclick="decreaseQty(${item.id})">−</button>
          <span class="qty-count">${item.qty}</span>
          <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>
        </div>
      </div>
    `;

    summaryItems.innerHTML += `
      <div class="summary-item">
        <span>${item.name} (${item.qty})</span>
        <span>₹${item.price * item.qty}</span>
      </div>
    `;
  });

  updateTotal();
}

function updateTotal(){
  let subtotal = 0;
  cart.forEach(item => subtotal += item.price * item.qty);

  const delivery = cart.length > 0 ? 30 : 0;
  const total = subtotal + delivery;

  document.getElementById("subTotal").innerText = subtotal;
  document.getElementById("deliveryFee").innerText = delivery;
  document.getElementById("totalPrice").innerText = total;

  document.getElementById("summarySubtotal").innerText = subtotal;
  document.getElementById("summaryDelivery").innerText = delivery;
  document.getElementById("summaryTotal").innerText = total;
}

function getLocation(){
  const locationText = document.getElementById("locationText");
  locationText.innerText = "Location: Fetching...";

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        userLocation = `Lat: ${lat}, Long: ${lon}`;

        locationText.innerText = "Location Added ✅";
      },
      () => {
        userLocation = "Not Allowed";
        locationText.innerText = "Location Permission Denied ❌";
      }
    );
  } else {
    userLocation = "Not Supported";
    locationText.innerText = "Location not supported ❌";
  }
}

async function placeOrder(){
  const msgBox = document.getElementById("msgBox");
  msgBox.style.color = "#00ff99";
  msgBox.innerText = "";

  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const notes = document.getElementById("custNotes").value.trim();

  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  if(cart.length === 0){
    msgBox.style.color = "red";
    msgBox.innerText = "❌ Cart is empty!";
    return;
  }

  if(name === "" || phone === "" || address === ""){
    msgBox.style.color = "red";
    msgBox.innerText = "❌ Please fill Name, Phone, Address!";
    return;
  }

  let subtotal = 0;
  cart.forEach(item => subtotal += item.price * item.qty);
  const delivery = 30;
  const total = subtotal + delivery;

  const itemsText = cart.map(i => `${i.name} x${i.qty} (₹${i.price*i.qty})`).join(" | ");

  const orderData = {
    name: name,
    phone: phone,
    address: address,
    items: itemsText,
    total: total,
    location: userLocation,
    notes: notes,
    payment: paymentMethod
  };

  msgBox.innerText = "⏳ Placing order...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(orderData),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();

    if(data.result === "success"){
      msgBox.style.color = "#00ff99";
      msgBox.innerText = "✅ Order Placed Successfully!";

      cart = [];
      renderCart();

      document.getElementById("custName").value = "";
      document.getElementById("custPhone").value = "";
      document.getElementById("custAddress").value = "";
      document.getElementById("custNotes").value = "";
      document.getElementById("locationText").innerText = "Location: Not Added";
      userLocation = "Not Added";
    } else {
      msgBox.style.color = "red";
      msgBox.innerText = "❌ Error: " + data.message;
    }

  } catch (err) {
    msgBox.style.color = "red";
    msgBox.innerText = "❌ Network Error. Try again!";
  }
}

renderMenu(menuItems);
renderCart();