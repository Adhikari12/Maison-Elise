let allProducts = [];
let selectedCategory = null;
let selectedSubcategory = "All";
let currentVisibleCollections = [];

const fallbackImage =
"https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80";

async function loadProducts() {
try {
const response = await fetch("products.json");

```
if (!response.ok) {
  throw new Error("Failed to load products");
}

allProducts = await response.json();

renderCategoryButtons();
showStartMessage();
```

} catch (error) {
console.error(error);

```
document.getElementById("productGrid").innerHTML = `
  <div class="empty-state">
    <h3>Collections are currently unavailable</h3>
    <p>Please try again later.</p>
  </div>
`;
```

}
}

function renderCategoryButtons() {
const categories = [...new Set(allProducts.map(item => item.category))];

document.getElementById("categoryButtons").innerHTML = categories
.map(category => `       <button
        class="${selectedCategory === category ? "active" : ""}"
        onclick="selectCategory('${category}')">
        ${category}       </button>
    `)
.join("");
}

function selectCategory(category) {
selectedCategory = category;
selectedSubcategory = "All";

renderCategoryButtons();
renderSubcategoryButtons();
updateProducts();

setTimeout(scrollToProducts, 150);
}

function renderSubcategoryButtons() {
const collections = allProducts.filter(
item => item.category === selectedCategory
);

const subcategories = [
"All",
...new Set(collections.map(item => item.subcategory))
];

document.getElementById("subcategoryButtons").innerHTML = subcategories
.map(sub => `       <button
        class="${selectedSubcategory === sub ? "active" : ""}"
        onclick="selectSubcategory('${sub}')">
        ${sub === "All" ? "All Collections" : sub}       </button>
    `)
.join("");
}

function selectSubcategory(subcategory) {
selectedSubcategory = subcategory;

renderSubcategoryButtons();
updateProducts();
}

function updateProducts() {
let filtered = allProducts.filter(
item => item.category === selectedCategory
);

if (selectedSubcategory !== "All") {
filtered = filtered.filter(
item => item.subcategory === selectedSubcategory
);
}

document.getElementById("productHeading").textContent =
selectedSubcategory === "All"
? `${selectedCategory}`
: selectedSubcategory;

document.getElementById("activeFilters").innerHTML =
selectedSubcategory === "All"
? `       <span>${selectedCategory}</span>
    `
: `       <span>${selectedCategory}</span>       <span>${selectedSubcategory}</span>       <button onclick="clearFilters()">Clear</button>
    `;

displayCollections(filtered);
}

function clearFilters() {
selectedSubcategory = "All";

renderSubcategoryButtons();
updateProducts();
}

function showStartMessage() {
document.getElementById("subcategoryButtons").innerHTML = "";
document.getElementById("activeFilters").innerHTML = "";

document.getElementById("productGrid").innerHTML = `     <div class="empty-state">       <h3>Explore Maison Élise Collections</h3>       <p>Select a category above to browse curated collections.</p>     </div>
  `;
}

function displayCollections(collections) {
const grid = document.getElementById("productGrid");

if (!collections.length) {
grid.innerHTML = `       <div class="empty-state">         <h3>No collections found</h3>         <p>Please try another collection.</p>       </div>
    `;
return;
}

currentVisibleCollections = collections;

grid.innerHTML = collections
.map((collection, index) => ` <article class="product-card">

```
    <img
      src="${collection.image || fallbackImage}"
      alt="${collection.name}"
      class="product-image"
      loading="lazy"
      onerror="this.src='${fallbackImage}'"
    >

    <div class="product-copy">

      <p class="category">
        Maison Élise • ${collection.subcategory}
      </p>

      <h3>${collection.name}</h3>

      <p>${collection.description}</p>

      <button
        class="link-btn"
        onclick="openCollection(${index})">
        View Collection
      </button>

    </div>

  </article>
`)
.join("");
```

}

function openCollection(index) {
const collection = currentVisibleCollections[index];

document.getElementById("productHeading").textContent =
collection.name;

document.getElementById("productGrid").innerHTML = `

```
<div class="collection-detail">

  <button
    class="back-btn"
    onclick="updateProducts()">
    ← Back to Collections
  </button>

  <p class="eyebrow">
    ${collection.category}
  </p>

  <h2>${collection.name}</h2>

  <p>${collection.description}</p>

</div>

${collection.products
  .map(product => `
    <article class="product-card">

      <img
        src="${product.image || fallbackImage}"
        alt="${product.name}"
        class="product-image"
        loading="lazy"
        onerror="this.src='${fallbackImage}'"
      >

      <div class="product-copy">

        <p class="category">
          Curated Pick
        </p>

        <h3>${product.name}</h3>

        <a
          href="${product.link}"
          target="_blank"
          rel="noopener noreferrer"
          class="link-btn">

          Shop This Piece

        </a>

      </div>

    </article>
  `)
  .join("")}
```

`;

scrollToProducts();
}

function scrollToProducts() {
document
.getElementById("featured")
.scrollIntoView({
behavior: "smooth",
block: "start"
});
}

document.addEventListener("DOMContentLoaded", loadProducts);

loadProducts();
