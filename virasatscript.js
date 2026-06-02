// 1. Theme Configuration Toggling System (NOW DEFAULTS TO DARK MODE)
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('i');

// Verify machine storage configurations on initialization
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
} else {
    document.body.classList.remove('light-theme');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');

    if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        showToast("Switched to Light Mode ☀️");
    } else {
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        showToast("Switched to Night Mode 🌙");
    }
});

// 2. Dynamic Scroll Header Glass Transformation
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 3. Mobile Navigation Side Panel Controller
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
    });
});

// 4. Smooth Scroll Entry Observer
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -20px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// 5. Grid Category Tab Filtering Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// 6. Luxury Shopping Basket State Engine
let cart = [];
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalPriceEl = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const toastContainer = document.getElementById('toast-container');

cartIcon.addEventListener('click', () => { cartModal.classList.add('show-cart'); });
closeCartBtn.addEventListener('click', () => { cartModal.classList.remove('show-cart'); });

function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerText = message;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2800);
}

const addBtns = document.querySelectorAll('.add-to-cart-btn');
addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('.add-to-cart-btn');
        const name = targetBtn.getAttribute('data-name');
        const price = parseInt(targetBtn.getAttribute('data-price'));

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCartUI();
        showToast(`${name} added to your tray!`);
    });
});

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-title">${item.name}</span>
                <span class="cart-item-price">₹${item.price} each</span>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="changeQty(${index}, -1)"><i class="fas fa-minus"></i></button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQty(${index}, 1)"><i class="fas fa-plus"></i></button>
            </div>
        `;
        cartItemsContainer.appendChild(li);
    });

    totalPriceEl.innerText = total;
}

window.changeQty = function (index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1);
    }
    updateCartUI();
}

// 7. Secure WhatsApp Redirection Layer
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your tray is empty! Please select some dishes first.");
        return;
    }

    const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
    const specialNotes = document.getElementById('order-notes').value.trim();

    let rawMessage = `*New Order Confirmation: ${orderId}*\n\nNamaste Virasat! I would like to place an order:\n\n`;
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        rawMessage += `${index + 1}. ${item.quantity}x ${item.name} - ₹${itemTotal}\n`;
        total += itemTotal;
    });

    rawMessage += `\n*Bill Total: ₹${total}*\n`;

    if (specialNotes !== "") {
        rawMessage += `\n*Cooking Notes:* "${specialNotes}"\n`;
    }

    rawMessage += `\nPlease send over the confirmation receipt!`;

    const encodedMessage = encodeURIComponent(rawMessage);
    const whatsappNumber = "918529048982";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
});
