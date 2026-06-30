const drinks = [
  {
    name: "岩盐乌龙鲜奶茶",
    type: "milk",
    price: 18,
    image: "./assets/drink-oolong.png",
    desc: "焙火乌龙配鲜奶，入口有轻微海盐回甘。",
    tags: ["招牌", "五分糖佳"],
  },
  {
    name: "黑糖珍珠厚乳",
    type: "milk",
    price: 20,
    image: "./assets/drink-boba.png",
    desc: "慢熬黑糖珍珠和厚乳，香气浓，口感扎实。",
    tags: ["热销", "加珍珠"],
  },
  {
    name: "青提茉莉冰茶",
    type: "fruit",
    price: 19,
    image: "./assets/drink-grape.png",
    desc: "整颗青提搭配茉莉茶底，清爽不腻。",
    tags: ["果茶", "少冰佳"],
  },
  {
    name: "柚香四季春",
    type: "fruit",
    price: 17,
    image: "./assets/drink-yuzu.png",
    desc: "四季春茶香明亮，柚子酸甜拉开层次。",
    tags: ["低糖", "清爽"],
  },
  {
    name: "抹茶轻乳拿铁",
    type: "light",
    price: 21,
    image: "./assets/drink-matcha.png",
    desc: "细腻抹茶粉与轻乳融合，奶感柔和。",
    tags: ["轻乳", "微苦"],
  },
  {
    name: "桂花米乳乌龙",
    type: "light",
    price: 19,
    image: "./assets/drink-rice.png",
    desc: "米乳带来谷物香，桂花收尾很干净。",
    tags: ["无负担", "温热佳"],
  },
];

const state = {
  filter: "all",
  cart: [],
};

const menuGrid = document.querySelector("#menuGrid");
const cartCount = document.querySelector("#cartCount");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const scrim = document.querySelector("#scrim");

function renderMenu() {
  const visible = state.filter === "all" ? drinks : drinks.filter((drink) => drink.type === state.filter);
  menuGrid.innerHTML = visible
    .map(
      (drink) => `
        <article class="drink-card">
          <img src="${drink.image}" alt="${drink.name}" loading="lazy" />
          <div class="drink-body">
            <div class="drink-title">
              <h3>${drink.name}</h3>
              <span class="price">¥${drink.price}</span>
            </div>
            <p>${drink.desc}</p>
            <div class="tags">${drink.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
            <button type="button" data-add="${drink.name}">加入购物袋</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCart() {
  cartCount.textContent = state.cart.length;
  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `¥${total}`;

  if (!state.cart.length) {
    cartItems.innerHTML = '<p class="empty">还没有加入饮品。</p>';
    return;
  }

  cartItems.innerHTML = state.cart
    .map(
      (item, index) => `
        <div class="cart-line">
          <strong>${item.name}</strong>
          <span>${item.options}</span>
          <span>¥${item.price}</span>
          <button type="button" data-remove="${index}">移除</button>
        </div>
      `
    )
    .join("");
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

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderMenu();
  });
});

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const drink = drinks.find((item) => item.name === button.dataset.add);
  const sweetness = document.querySelector("#sweetness").value;
  const ice = document.querySelector("#ice").value;
  const toppings = [...document.querySelectorAll("#customForm input:checked")].map((item) => item.value);
  state.cart.push({
    ...drink,
    options: `${sweetness} · ${ice}${toppings.length ? ` · ${toppings.join(" / ")}` : ""}`,
  });
  renderCart();
  openCart();
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  state.cart.splice(Number(button.dataset.remove), 1);
  renderCart();
});

document.querySelector("#cartToggle").addEventListener("click", openCart);
document.querySelector("#cartClose").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);

document.querySelector("#customForm").addEventListener("change", () => {
  const sweetness = document.querySelector("#sweetness").value;
  const ice = document.querySelector("#ice").value;
  const toppings = [...document.querySelectorAll("#customForm input:checked")].map((item) => item.value);
  const toppingText = toppings.length ? toppings.join(" / ") : "不加料";
  const recommendation = sweetness === "三分糖" ? "青提茉莉冰茶" : ice === "热饮" ? "桂花米乳乌龙" : "岩盐乌龙鲜奶茶";
  document.querySelector("#customOutput").textContent = `推荐：${recommendation} · ${sweetness} · ${ice} · ${toppingText}`;
});

renderMenu();
renderCart();
