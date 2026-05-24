let allProducts = [];
let selectedCategory = "All";
let selectedSubcategory = "All";

const categoryMap = {
  "Furniture": [
    "Beds",
    "Sofas",
    "Coffee Tables",
    "Side Tables",
    "Accent Chairs",
    "Shelves & Cabinets",
    "Dining Furniture"
  ],
  "Bedding": [
    "Pastel Bedsheets",
    "Solid Bedsheets",
    "Floral Bedsheets",
    "Pillow Covers",
    "Comforters",
    "Mattresses",
    "Blankets"
  ],
  "Lighting": [
    "Table Lamps",
    "Floor Lamps",
    "Wall Lights",
    "Fairy Lights",
    "Chandeliers",
    "Pendant Lights"
  ],
  "Wall Decor": [
    "Wallpapers",
    "Wall Art",
    "Mirrors",
    "Wall Clocks",
    "Photo Frames",
    "Wall Shelves"
  ],
  "Curtains & Rugs": [
    "Sheer Curtains",
    "Blackout Curtains",
    "Door Curtains",
    "Area Rugs",
    "Bedside Rugs",
    "Carpets"
  ],
  "Table Decor": [
    "Vases",
    "Candles",
    "Decor Trays",
    "Showpieces",
    "Artificial Flowers",
    "Table Runners"
  ],
  "Spiritual Decor": [
    "God Idols",
    "Diyas",
    "Pooja Mandir Decor",
    "Incense Holders",
    "Bells",
    "Spiritual Wall Art"
  ],
  "Storage & Organizers": [
    "Storage Baskets",
    "Drawer Organizers",
    "Wardrobe Organizers",
    "Floating Shelves",
    "Storage Boxes",
    "Makeup Organizers"
  ],
  "Kitchen Decor": [
    "Storage Jars",
    "Countertop Organizers",
    "Dining Mats",
    "Serving Trays",
    "Kitchen Racks",
    "Cutlery Holders"
  ],
  "Bathroom Decor": [
    "Soap Dispensers",
    "Bathroom Mats",
    "Vanity Mirrors",
    "Towel Racks",
    "Shelf Organizers",
    "Shower Curtains"
  ],
  "Outdoor Decor": [
    "Planters",
    "Balcony Lights",
    "Garden Decor",
    "Outdoor Chairs",
    "Artificial Grass",
    "Hanging Planters"
  ]
};

async function loadProducts() {
  const response = await fetch("products.json");
  allProducts = await response.json();

  renderCategoryButtons();
  renderSubcategoryButtons("All");
  displayProducts(allProducts);
}

function renderCategoryButtons() {
  const categoryButtons = document.getElementById("categoryButtons");

  const categories = ["All", ...Object.keys(categoryMap)];

  categoryButtons.innerHTML = categories
    .map(
      (category) => `
        <button 
          class="${category === selectedCategory ? "active" : ""}"
          onclick="selectCategory('${category}')">
          ${category}
        </button>
      `
    )
    .join("");
}

function renderSubcategoryButtons(category) {
  const subcategoryArea = document.getElementById("subcategoryArea");
  const subcategoryButtons = document.getElementById("subcategoryButtons");

  if (category === "All") {
    subcategoryArea.style.display = "none";
    subcategoryButtons.innerHTML = "";
    return;
  }

  subcategoryArea.style.display = "block";

  const subcategories = ["All", ...categoryMap[category]];

  subcategoryButtons.innerHTML = subcategories
    .map(
      (subcategory) => `
        <button 
          class="${subcategory === selectedSubcategory ? "active" : ""}"
          onclick="selectSubcategory('${subcategory}')">
          ${subcategory}
        </button>
      `
    )
    .join("");
}

function selectCategory(category) {
  selectedCategory = category;
  selectedSubcategory = "All";

  renderCategoryButtons();
  renderSubcategoryButtons(category);
  filterProducts();

  document.getElementById("featured").scrollIntoView({ behavior: "smooth" });
}

function selectSubcategory(subcategory) {
  selectedSubcategory = subcategory;

  renderSubcategoryButtons(selectedCategory);
  filterProducts();

  document.getElementById("featured").scrollIntoView({ behavior: "smooth" });
}

function filterProducts() {
  let filteredProducts = allProducts;

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

  updateHeading();
  displayProducts(filteredProducts);
}

function updateHeading() {
  const activeLabel = document.getElementById("activeLabel");
  const productHeading = document.getElementById("productHeading");

  if (selectedCategory === "All") {
    activeLabel.textContent = "Featured favourites";
    productHeading.textContent = "Amazon finds curated for soft luxury homes";
  } else if (selectedSubcategory === "All") {
    activeLabel.textContent = selectedCategory;
    productHeading.textContent = `Explore ${selectedCategory} for a beautiful home`;
  } else {
    activeLabel.textContent = selectedCategory;
    productHeading.textContent = selectedSubcategory;
  }
}

function displayProducts(products) {
  const productGrid = document.getElementById("productGrid");

  if (products.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-message">
        <h3>No products added yet</h3>
        <p>Add products for this section inside products.json.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" class="product-image" />

          <div class="product-copy">
            <p class="category">${product.category} • ${product.subcategory}</p>
            <h3>${product.name}</h3>
            <p>${product.description}</p>

            <a 
              href="${product.link}" 
              target="_blank" 
              rel="sponsored noopener noreferrer" 
              class="link-btn">
              View on Amazon
            </a>
          </div>
        </article>
      `
    )
    .join("");
}

loadProducts();
