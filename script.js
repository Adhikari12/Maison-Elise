let allProducts = [];
let selectedCategory = null;
let selectedSubcategory = "All";
let selectedVibe = "All";

const fallbackImage =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80";

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    allProducts = await response.json();

    renderCategoryButtons();
    showStartMessage();
  } catch (error) {
    console.error("Products could not be loaded:", error);
    document.getElementById("productGrid").innerHTML =
      "<p>Products are being updated. Please check again soon.</p>";
  }
}

function renderCategoryButtons() {
  const categories = [...new Set(allProducts.map((p) => p.category))];
  const categoryBox = document.getElementById("categoryButtons");

  categoryBox.innerHTML = categories
    .map(
      (category) => `
      <button 
        class="${selectedCategory === category ? "active" : ""}" 
        onclick="selectCategory('${category}')">
        ${category}
      </button>
    `
    )
    .join("");
}

function selectCategory(category) {
  selectedCategory = category;
  selectedSubcategory = "All";
  selectedVibe = "All";

  renderCategoryButtons();
  renderInsideCategoryFilters();
  updateProducts();
  scrollToProducts();
}

function renderInsideCategoryFilters() {
  const subcategoryBox = document.getElementById("subcategoryButtons");
  const vibeBox = document.getElementById("vibeButtons");

  const productsInCategory = allProducts.filter(
    (product) => product.category === selectedCategory
  );

  const subcategories = [
    "All",
    ...new Set(productsInCategory.map((product) => product.subcategory)),
  ];

  const vibes = [
    "All",
    ...new Set(productsInCategory.map((product) => product.vibe)),
  ];

  subcategoryBox.innerHTML = subcategories
    .map(
      (sub) => `
      <button 
        class="${selectedSubcategory === sub ? "active" : ""}" 
        onclick="selectSubcategory('${sub}')">
        ${sub === "All" ? "All Collections" : sub}
      </button>
    `
    )
    .join("");

  vibeBox.innerHTML = vibes
    .map(
      (vibe) => `
      <button 
        class="${selectedVibe === vibe ? "active" : ""}" 
        onclick="selectVibe('${vibe}')">
        ${vibe === "All" ? "All Vibes" : vibe}
      </button>
    `
    )
    .join("");
}

function selectSubcategory(subcategory) {
  selectedSubcategory = subcategory;
  renderInsideCategoryFilters();
  updateProducts();
  scrollToProducts();
}

function selectVibe(vibe) {
  selectedVibe = vibe;
  renderInsideCategoryFilters();
  updateProducts();
  scrollToProducts();
}

function updateProducts() {
  let filteredProducts = allProducts.filter(
    (product) => product.category === selectedCategory
  );

  if (selectedSubcategory !== "All") {
    filteredProducts = filteredProducts.filter(
      (product) => product.subcategory === selectedSubcategory
    );
  }

  if (selectedVibe !== "All") {
    filteredProducts = filteredProducts.filter(
      (product) => product.vibe === selectedVibe
    );
  }

  updateHeading();
  updateActiveFilters();
  displayCollections(filteredProducts);
}

function updateHeading() {
  const heading = document.getElementById("productHeading");

  if (!selectedCategory) {
    heading.textContent = "Select a category to begin";
    return;
  }

  heading.textContent = `${selectedCategory} Collections`;
}

function updateActiveFilters() {
  const activeFilters = document.getElementById("activeFilters");

  if (!selectedCategory) {
    activeFilters.innerHTML = "";
    return;
  }

  activeFilters.innerHTML = `
    <span>Category: ${selectedCategory}</span>
    <span>Collection: ${selectedSubcategory}</span>
    <span>Vibe: ${selectedVibe}</span>
    <button onclick="clearCategoryFilters()">Clear Filters</button>
  `;
}

function clearCategoryFilters() {
  selectedSubcategory = "All";
  selectedVibe = "All";

  renderInsideCategoryFilters();
  updateProducts();
}

function showStartMessage() {
  document.getElementById("insideCategoryFilters").style.display = "none";
  document.getElementById("activeFilters").innerHTML = "";
  document.getElementById("productGrid").innerHTML = `
    <div class="empty-state">
      <h3>Choose a category above</h3>
      <p>After selecting a category, collection and vibe filters will appear here.</p>
    </div>
  `;
}

function displayCollections(collections) {
  document.getElementById("insideCategoryFilters").style.display = "grid";

  const productGrid = document.getElementById("productGrid");

  if (!collections.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <h3>No matching collections found</h3>
        <p>Try changing the collection type or vibe filter.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = collections
    .map(
      (collection, index) => `
      <article class="product-card">
        <img 
          src="${collection.image && collection.image.trim() !== "" ? collection.image : fallbackImage}" 
          alt="${collection.name}" 
          class="product-image"
          loading="lazy"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        />

        <div class="product-copy">
          <p class="category">Maison Élise • ${collection.subcategory}</p>
          <h3>${collection.name}</h3>
          <p>${collection.description}</p>
          <span class="vibe-tag">${collection.vibe}</span>

          <button 
            class="link-btn"
            onclick="openCollection(${index})">
            View Collection
          </button>
        </div>
      </article>
    `
    )
    .join("");

  window.currentVisibleCollections = collections;
}

function openCollection(index) {
  const collection = window.currentVisibleCollections[index];
  const productGrid = document.getElementById("productGrid");

  document.getElementById("productHeading").textContent = collection.name;

  productGrid.innerHTML = `
    <div class="collection-detail">
      <button class="back-btn" onclick="updateProducts()">← Back to ${selectedCategory}</button>
      <p class="eyebrow">${collection.category} • ${collection.vibe}</p>
      <h2>${collection.name}</h2>
      <p>${collection.description}</p>
    </div>

    ${collection.products
      .map(
        (item) => `
        <article class="product-card">
          <img 
            src="${item.image && item.image.trim() !== "" ? item.image : fallbackImage}" 
            alt="${item.name}" 
            class="product-image"
            loading="lazy"
            onerror="this.onerror=null; this.src='${fallbackImage}';"
          />

          <div class="product-copy">
            <p class="category">Curated Pick</p>
            <h3>${item.name}</h3>

            <a 
              href="${item.link}" 
              target="_blank" 
              rel="sponsored noopener noreferrer" 
              class="link-btn">
              Shop This Piece
            </a>
          </div>
        </article>
      `
      )
      .join("")}
  `;

  scrollToProducts();
}

function scrollToProducts() {
  document.getElementById("featured").scrollIntoView({
    behavior: "smooth",
  });
}

loadProducts();
