const products = [
  {
    id: "bag",
    name: "ARIANNE 丝绒手袋",
    category: "leather",
    line: "曜石黑 / 限量编号",
    price: 28500,
    tag: "LIMITED",
    imageClass: "image-bag",
  },
  {
    id: "ring",
    name: "AURUM 极简指环",
    category: "jewelry",
    line: "18K 黄金 / 手工打磨",
    price: 12800,
    tag: "NEW IN",
    imageClass: "image-ring",
  },
  {
    id: "blazer",
    name: "ESSENTIAL 亚麻西装",
    category: "fashion",
    line: "象牙白 / 精裁系列",
    price: 15200,
    tag: "ATELIER",
    imageClass: "image-blazer",
  },
  {
    id: "gown",
    name: "曜影黑丝绒长裙",
    category: "fashion",
    line: "桑蚕丝绒 / 高级成衣",
    price: 38500,
    tag: "COUTURE",
    imageClass: "image-gown",
  },
  {
    id: "watch",
    name: "PRIVILEGE 金质腕表",
    category: "jewelry",
    line: "黄金表壳 / 鳄鱼皮表带",
    price: 82600,
    tag: "VIP",
    imageClass: "image-watch",
  },
  {
    id: "atelier",
    name: "定制皮革旅行箱",
    category: "leather",
    line: "小牛皮 / 手工包边",
    price: 56800,
    tag: "MADE TO ORDER",
    imageClass: "image-atelier",
  },
];

const catalog = document.querySelector("#catalog");
const filters = document.querySelectorAll(".filter");
const cartDrawer = document.querySelector(".cart-drawer");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const bagCount = document.querySelector(".bag-count");
const scrim = document.querySelector(".scrim");
const cart = new Map();

const yuan = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0,
});

function renderCatalog(category = "all") {
  const visible = category === "all" ? products : products.filter((product) => product.category === category);
  catalog.innerHTML = visible
    .map(
      (product) => `
        <article class="product-card" data-product-id="${product.id}">
          <div class="card-image ${product.imageClass}"></div>
          <span class="tag">${product.tag}</span>
          <h3>${product.name}</h3>
          <p>${product.line}</p>
          <div class="price-line">
            <strong>${yuan.format(product.price)}</strong>
            <button class="mini-add" data-add="${product.id}">加入购物袋</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const current = cart.get(productId) || { ...product, qty: 0 };
  current.qty += 1;
  cart.set(productId, current);
  renderCart();
  openCart();
}

function renderCart() {
  const items = [...cart.values()];
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  bagCount.textContent = totalCount;
  cartTotal.textContent = yuan.format(totalPrice);
  cartItems.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <div class="cart-item">
              <div class="cart-thumb ${item.imageClass}"></div>
              <div>
                <h3>${item.name}</h3>
                <p>${item.line}</p>
                <p>数量 ${item.qty}</p>
              </div>
              <strong>${yuan.format(item.price * item.qty)}</strong>
            </div>
          `,
        )
        .join("")
    : '<p class="empty">购物袋仍是空的。先挑一件值得收藏的作品。</p>';
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  scrim.classList.add("show");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  scrim.classList.remove("show");
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderCatalog(button.dataset.filter);
  });
});

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const productCard = event.target.closest("[data-product-id]");

  if (addButton) {
    event.stopPropagation();
    addToCart(addButton.dataset.add);
    return;
  }

  if (productCard) {
    document.querySelector("#detail").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

document.querySelector(".add-featured").addEventListener("click", () => addToCart("gown"));
document.querySelector(".bag-btn").addEventListener("click", openCart);
document.querySelector(".close-cart").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);

renderCatalog();
renderCart();