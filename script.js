let allProducts = [];

async function loadProducts() {
  const response = await fetch("products.json");
  allProducts = await response.json();
  displayProducts(allProducts);
}

function displayProducts(products) {
  const productGrid = document.getElementById("productGrid");

  productGrid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image" />

        <div class="product-copy">
          <p class="category">${product.category}</p>
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

function filterProducts(category) {
  if (category === "All") {
    displayProducts(allProducts);
  } else {
    const filtered = allProducts.filter(
      (product) => product.category === category
    );
    displayProducts(filtered);
  }
}

loadProducts();
