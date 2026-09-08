const whatsappNumber = '6289523245511';
const cart = [];
const toast = document.getElementById('toast');
const bagCount = document.getElementById('bagCount');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartTotal = document.getElementById('cartTotal');

function formatPrice(price) {
  return `Rp ${price.toLocaleString('id-ID')}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function updateBag() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  bagCount.textContent = total;
  bagCount.style.display = total ? 'block' : 'none';
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div><strong>${item.name}</strong><small>${formatPrice(item.price)} / bungkus</small></div>
      <div class="quantity-control"><button type="button" aria-label="Kurangi ${item.name}" data-action="decrease" data-name="${item.name}">−</button><b>${item.quantity}</b><button type="button" aria-label="Tambah ${item.name}" data-action="increase" data-name="${item.name}">+</button></div>
    </div>`).join('');
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = formatPrice(totalPrice);
  cartEmpty.style.display = cart.length ? 'none' : 'block';
  document.getElementById('checkoutButton').disabled = !cart.length;
}

document.querySelectorAll('.add-button').forEach((button) => {
  button.addEventListener('click', () => {
    const existing = cart.find((item) => item.name === button.dataset.name);
    if (existing) existing.quantity += 1;
    else cart.push({ name: button.dataset.name, price: Number(button.dataset.price), quantity: 1 });
    updateBag();
    showToast(`${button.dataset.name} ditambahkan`);
  });
});

document.querySelectorAll('.category').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.category.active').classList.remove('active');
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.product-card').forEach((card) => {
      card.classList.toggle('is-hidden', filter !== 'all' && !card.dataset.category.includes(filter));
    });
  });
});

document.querySelectorAll('.heart').forEach((heart) => {
  heart.addEventListener('click', () => {
    heart.textContent = heart.textContent === '♡' ? '♥' : '♡';
    heart.style.background = heart.textContent === '♥' ? '#ed684f' : '#fffaf3d9';
    heart.style.color = heart.textContent === '♥' ? '#fff' : 'var(--coral)';
  });
});

document.getElementById('bagButton').addEventListener('click', () => {
  cartOverlay.classList.add('open');
  cartOverlay.setAttribute('aria-hidden', 'false');
});

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const item = cart.find((entry) => entry.name === button.dataset.name);
  if (!item) return;
  if (button.dataset.action === 'increase') item.quantity += 1;
  if (button.dataset.action === 'decrease') item.quantity -= 1;
  if (item.quantity <= 0) cart.splice(cart.indexOf(item), 1);
  updateBag();
});

function closeCart() {
  cartOverlay.classList.remove('open');
  cartOverlay.setAttribute('aria-hidden', 'true');
}

document.getElementById('closeCart').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', (event) => {
  if (event.target === cartOverlay) closeCart();
});

document.getElementById('checkoutButton').addEventListener('click', () => {
  if (!cart.length) return;
  const lines = cart.map((item) => `- ${item.name} (${item.quantity}x)`).join('\n');
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Halo Cemilan ku, saya mau pesan:\n${lines}\n\nTotal sementara: ${formatPrice(totalPrice)}\nMohon info total dan ongkirnya ya.`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

document.getElementById('menuButton').addEventListener('click', () => {
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
});
