let allProducts = [];
let currentCategory = "";
let currentSubcategory = "All";

// Strict Category Configuration holding semantic covers mapping directly to dataset links
const mainCategories = [
  { name: "Beddings", image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=500&q=80" },
  { name: "Coffee Tables", image: "https://images.unsplash.com/photo-1532372320572-cda25653a694?auto=format&fit=crop&w=500&q=80" },
  { name: "Lamps", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80" },
  { name: "Matresses", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=500&q=80" },
  { name: "Floor Rugs", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=500&q=80" },
  { name: "Sofa Sets", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80" },
  { name: "Vase Collections", image: "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=500&q=80" },
  { name: "String Lights", image: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=500&q=80" },
  { name: "Wallpapers", image: "https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&w=500&q=80" },
  { name: "Mirrors", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=500&q=80" },
  { name: "Wall Arts", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80" },
  { name: "Lounge Chairs", image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=500&q=80" },
  { name: "Spiritual Decor", image: "https://images.unsplash.com/photo-1601212660297-70f8e0a728dd?auto=format&fit=crop&w=500&q=80" }
];

const fallbackImage = "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80";

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    allProducts = await response.json();
    showMainCategories();
  } catch (error) {
    console.error("Products could not be loaded:", error);
    document.getElementById("categoryGrid").innerHTML = "<p>Store update in progress. Please return shortly.</p>";
  }
}

function showMainCategories(e) {
  if(e) e.preventDefault();
  currentCategory = "";
  currentSubcategory = "All";

  // Reset inputs and visibility
  document.getElementById("searchInput").value = "";
  document.getElementById("sortSelect").value = "featured";
  document.getElementById("backNavContainer").style.display = "none";
  document.getElementById("storeControls").style.display = "none";
  document.getElementById("subcategoryButtons").style.display = "none";
  document.getElementById("productGrid").style.display = "none";
  
  const categoryGrid = document.getElementById("categoryGrid");
  categoryGrid.style.display = "grid";

  document.getElementById("browsingEyebrow").innerText = "Curated collections";
  document.getElementById("browsingTitle").innerText = "Shop by aesthetic room essentials";

  categoryGrid.innerHTML = mainCategories.map(cat => `
    <div class="category-card" onclick="selectCategory('${cat.name}')">
      <img src="${cat.image}" alt="${cat.name}" loading="lazy" onerror="this.src='${fallbackImage}';">
      <div class="category-overlay">
        <h3>${cat.name}</h3>
      </div>
    </div>
  `).join("");
}

function selectCategory(categoryName) {
  currentCategory = categoryName;
  currentSubcategory = "All";
  
  // Clean inputs
  document.getElementById("searchInput").value = "";
  
  // Shift Views
  document.getElementById("categoryGrid").style.display = "none";
  document.getElementById("backNavContainer").style.display = "block";
  document.getElementById("storeControls").style.display = "flex";
  
  const subBox = document.getElementById("subcategoryButtons");
  subBox.style.display = "flex";

  document.getElementById("browsingEyebrow").innerText = `Collection • ${categoryName}`;
  document.getElementById("browsingTitle").innerText = `Explore our curated selection`;

  // Extrapolate list of structural Subcategories present in data
  const categoryProducts = allProducts.filter(p => p.category === categoryName);
  const distinctSubs = [...new Set(categoryProducts.map(p => p.subcategory))];

  subBox.innerHTML = `
    <button class="sub-btn active" id="subBtn-All" onclick="selectSubcategory('All')">All ${categoryName}</button>
    ${distinctSubs.map(sub => `
      <button class="sub-btn" id="subBtn-${sub.replace(/\s+/g, '')}" onclick="selectSubcategory('${sub}')">${sub}</button>
    `).join("")}
  `;

  renderStorefrontItems();
  
  // Jump content directly into visual frame view cleanly
  document.getElementById("collections").scrollIntoView({ behavior: "smooth" });
}

function selectSubcategory(subName) {
  currentSubcategory = subName;
  
  // Toggle button styling classes
  document.querySelectorAll(".sub-btn").forEach(btn => btn.classList.remove("active"));
  if(subName === "All") {
    document.getElementById("subBtn-All").classList.add("active");
  } else {
    const activeBtn = document.getElementById(`subBtn-${subName.replace(/\s+/g, '')}`);
    if(activeBtn) activeBtn.classList.add("active");
  }

  handleSearchAndSort();
}

function handleSearchAndSort() {
  renderStorefrontItems();
}

function renderStorefrontItems() {
  const productGrid = document.getElementById("productGrid");
  productGrid.style.display = "grid";

  // Phase 1: Structural Categorization Layer
  let targetedItems = allProducts.filter(p => p.category === currentCategory);

  // Phase 2: Subcategory Context Filtering
  if (currentSubcategory !== "All") {
    targetedItems = targetedItems.filter(p => p.subcategory === currentSubcategory);
  }

  // Phase 3: Text Search Parsing
  const searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();
  if (searchQuery) {
    targetedItems = targetedItems.filter(p => 
      p.name.toLowerCase().includes(searchQuery) || 
      p.description.toLowerCase().includes(searchQuery)
    );
  }

  // Phase 4: Sorting Order Engine Selection
  const sortingMethod = document.getElementById("sortSelect").value;
  if (sortingMethod === "az") {
    targetedItems.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortingMethod === "za") {
    targetedItems.sort((a, b) => b.name.localeCompare(a.name));
  }

  // Phase 5: Display Render Generation Pipeline
  if (!targetedItems.length) {
    productGrid.innerHTML = `<div class="empty-notice"><p>No items match your specific query in this department yet.</p></div>`;
    return;
  }

  productGrid.innerHTML = targetedItems.map(product => `
    <article class="product-card">
      <div class="product-image-container">
        <img
          src="${product.image && product.image.trim() !== '' ? product.image : fallbackImage}"
          alt="${product.name}"
          class="product-image"
          loading="lazy"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        />
      </div>
      <div class="product-copy">
        <p class="category">Maison Élise • ${product.subcategory}</p>
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
  `).join("");
}

function scrollToCollections(e) {
  e.preventDefault();
  document.getElementById("collections").scrollIntoView({ behavior: "smooth" });
}

// Global initialization call on window execution
window.addEventListener("DOMContentLoaded", loadProducts);
