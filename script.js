```javascript
let allProducts = [];
let selectedCategory = null;
let selectedSubcategory = null;
let currentCollections = [];

const fallbackImage =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80";

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    allProducts = await response.json();

    renderCategories();
  } catch (error) {
    console.error(error);

    document.getElementById("productGrid").innerHTML =
      "<p>Collections are currently unavailable.</p>";
  }
}

function renderCategories() {
  const categoryGrid = document.getElementById("categoryGrid");

  const categories = allProducts.map((item) => ({
    category: item.category,
    image: item.image,
    description: item.description
  }));

  const uniqueCategories = categories.filter(
    (item, index, self) =>
      index ===
      self.findIndex((c) => c.category === item.category)
  );

  categoryGrid.innerHTML = uniqueCategories
    .map(
      (category) => `
      <article class="product-card category-card">

        <img
          src="${category.image || fallbackImage}"
          alt="${category.category}"
          class="product-image"
          loading="lazy"
        >

        <div class="product-copy">

          <p class="category">
            Maison Élise
          </p>

          <h3>
            ${category.category}
          </h3>

          <p>
            ${category.description}
          </p>

          <button
            class="link-btn"
            onclick="selectCategory('${category.category}')"
          >
            Explore Collection
          </button>

        </div>

      </article>
    `
    )
    .join("");

  document.getElementById("productGrid").innerHTML = "";
  document.getElementById("subcategoryButtons").innerHTML = "";
  document.getElementById("productHeading").innerHTML = "";
  document.getElementById("activeFilters").innerHTML = "";
}

function selectCategory(categoryName) {
  selectedCategory = categoryName;
  selectedSubcategory = null;

  const categoryProducts = allProducts.filter(
    (item) => item.category === categoryName
  );

  const subcategories = [
    ...new Set(categoryProducts.map((item) => item.subcategory))
  ];

  document.getElementById("productHeading").textContent =
    categoryName;

  document.getElementById("subcategoryButtons").innerHTML =
    `
      <button
        class="active"
        onclick="showAllCollections()"
      >
        All Collections
      </button>
    ` +
    subcategories
      .map(
        (sub) => `
      <button
        onclick="selectSubcategory('${sub}')"
      >
        ${sub}
      </button>
    `
      )
      .join("");

  showAllCollections();
}

function showAllCollections() {
  const collections = allProducts.filter(
    (item) => item.category === selectedCategory
  );

  currentCollections = collections;

  document.getElementById("activeFilters").innerHTML = `
    <span>${selectedCategory}</span>
  `;

  displayCollections(collections);
}

function selectSubcategory(subcategory) {
  selectedSubcategory = subcategory;

  const collections = allProducts.filter(
    (item) =>
      item.category === selectedCategory &&
      item.subcategory === subcategory
  );

  currentCollections = collections;

  document.getElementById("activeFilters").innerHTML = `
    <span>${selectedCategory}</span>
    <span>${subcategory}</span>
  `;

  displayCollections(collections);
}

function displayCollections(collections) {
  const grid = document.getElementById("productGrid");

  if (!collections.length) {
    grid.innerHTML =
      "<p>No collections found.</p>";
    return;
  }

  grid.innerHTML = collections
    .map(
      (collection, index) => `
      <article class="product-card">

        <img
          src="${collection.image || fallbackImage}"
          alt="${collection.name}"
          class="product-image"
          loading="lazy"
        >

        <div class="product-copy">

          <p class="category">
            ${collection.subcategory}
          </p>

          <h3>
            ${collection.name}
          </h3>

          <p>
            ${collection.description}
          </p>

          <button
            class="link-btn"
            onclick="openCollection(${index})"
          >
            View Collection
          </button>

        </div>

      </article>
    `
    )
    .join("");
}

function openCollection(index) {
  const collection = currentCollections[index];

  const grid = document.getElementById("productGrid");

  document.getElementById("productHeading").textContent =
    collection.name;

  grid.innerHTML = `
    <div class="collection-detail">

      <button
        class="link-btn"
        onclick="${
          selectedSubcategory
            ? `selectSubcategory('${selectedSubcategory}')`
            : `showAllCollections()`
        }"
      >
        ← Back
      </button>

      <h2>
        ${collection.name}
      </h2>

      <p>
        ${collection.description}
      </p>

    </div>

    ${collection.products
      .map(
        (product) => `
      <article class="product-card">

        <img
          src="${product.image || fallbackImage}"
          alt="${product.name}"
          class="product-image"
          loading="lazy"
        >

        <div class="product-copy">

          <p class="category">
            Curated Pick
          </p>

          <h3>
            ${product.name}
          </h3>

          <a
            href="${product.link}"
            target="_blank"
            rel="noopener noreferrer sponsored"
            class="link-btn"
          >
            Shop Now
          </a>

        </div>

      </article>
    `
      )
      .join("")}
  `;
}

loadProducts();
```
