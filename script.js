let allProducts = [];
let selectedCategory = "All";
let selectedSubcategory = "All";
let selectedVibe = "All";

const fallbackImage =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80";

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    allProducts = await response.json();

    renderCategoryButtons();
    renderVibeButtons();
    updateProducts();
  } catch (error) {
    console.error("Products could not be loaded:", error);
    document.getElementById("productGrid").innerHTML =
      "<p>Products are being updated. Please check again soon.</p>";
  }
}

function renderCategoryButtons() {
  const categories = ["All", ...new Set(allProducts.map((p) => p.category))];
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

function renderVibeButtons() {
  const vibes = ["All", ...new Set(allProducts.map((p) => p.vibe))];
  const vibeBox = document.getElementById("vibeButtons");

  vibeBox.innerHTML = vibes
    .map(
      (vibe) => `
      <button 
        class="${selectedVibe === vibe ? "active" : ""}" 
        onclick="selectVibe('${vibe}')">
        ${vibe}
      </button>
    `
    )
    .join("");
}

function renderSubcategoryButtons() {
  const subcategoryBox = document.getElementById("subcategoryButtons");

  if (selectedCategory === "All") {
    subcategoryBox.innerHTML = "";
    return;
  }

  const productsInCategory = allProducts.filter(
    (product) => product.category === selectedCategory
  );

  const subcategories = [
    "All",
    ...new Set(productsInCategory.map((product) => product.subcategory)),
  ];

  subcategoryBox.innerHTML = subcategories
    .map(
      (sub) => `
      <button 
        class="${selectedSubcategory === sub ? "active" : ""}" 
        onclick="selectSubcategory('${sub}')">
        ${sub === "All" ? "All " + selectedCategory : sub}
      </button>
    `
    )
    .join("");
}

function selectCategory(category) {
  selectedCategory = category;
  selectedSubcategory = "All";

  renderCategoryButtons();
  renderSubcategoryButtons();
  updateProducts();
  scrollToProducts();
}

function selectSubcategory(subcategory) {
  selectedSubcategory = subcategory;

  renderSubcategoryButtons();
  updateProducts();
  scrollToProducts();
}

function selectVibe(vibe) {
  selectedVibe = vibe;

  renderVibeButtons();
  updateProducts();
  scrollToProducts();
}

function updateProducts() {
  let filteredProducts = [...allProducts];

  if (selectedCategory !== "All") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory
    );
  }

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
  displayProducts(filteredProducts);
}

function updateHeading() {
  const heading = document.getElementById("productHeading");

  if (selectedCategory === "All" && selectedVibe === "All") {
    heading.textContent = "All Maison Élise Collections";
  } else {
    heading.textContent = "Your Curated Maison Élise Edit";
  }
}

function updateActiveFilters() {
  const activeFilters = document.getElementById("activeFilters");

  activeFilters.innerHTML = `
    <span>Category: ${selectedCategory}</span>
    <span>Subcategory: ${selectedSubcategory}</span>
    <span>Vibe: ${selectedVibe}</span>
    <button onclick="resetFilters()">Reset Filters</button>
  `;
}

function resetFilters() {
  selectedCategory = "All";
  selectedSubcategory = "All";
  selectedVibe = "All";

  renderCategoryButtons();
  renderVibeButtons();
  renderSubcategoryButtons();
  updateProducts();
}

function displayProducts(products) {
  const productGrid = document.getElementById("productGrid");

  if (!products.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <h3>No matching pieces found</h3>
        <p>Try changing the category, subcategory, or vibe filter.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        <img 
          src="${product.image && product.image.trim() !== "" ? product.image : fallbackImage}" 
          alt="${product.name}" 
          class="product-image"
          loading="lazy"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        />

        <div class="product-copy">
          <p class="category">Maison Élise • ${product.subcategory}</p>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <span class="vibe-tag">${product.vibe}</span>

          <a 
            href="${product.link}" 
            target="_blank" 
            rel="sponsored noopener noreferrer" 
            class="link-btn">
            View Collection
          </a>
        </div>
      </article>
    `
    )
    .join("");
}

function scrollToProducts() {
  document.getElementById("featured").scrollIntoView({
    behavior: "smooth",
  });
}

loadProducts();
