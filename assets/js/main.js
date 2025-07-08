const productsContainer = document.querySelector(".products-container");
console.log(productsContainer);

function getStarRatingHTML(rating) {
  const fullStar = "★";
  const emptyStar = "☆";
  const maxRating = 5;
  let starsHTML = "";

  const roundedRating = Math.round(rating);

  // Add full stars
  for (let i = 0; i < roundedRating; i++) {
    starsHTML += fullStar;
  }

  // Add empty stars
  for (let i = roundedRating; i < maxRating; i++) {
    starsHTML += emptyStar;
  }

  // Wrap in a span for styling the stars
  return `<span class="stars">${starsHTML}</span>`;
}

async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    renderProducts(data.products);
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML =
      '<p style="color: red; text-align: center; grid-column: 1 / -1;">Không thể tải dữ liệu sản phẩm.</p>';
  }
}

function renderProducts(products) {
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    const productLink = document.createElement("a");
    productLink.href = `detail.html?id=${product.id}`;
    productLink.classList.add("product-card");

    const productImg = document.createElement("img");
    productImg.src = product.thumbnail;
    productImg.alt = product.title;

    const productInfo = document.createElement("div");
    productInfo.classList.add("product-info");

    const productCategory = document.createElement("p");
    productCategory.classList.add("category");
    productCategory.textContent = `category: ${product.category}`;

    const productTitle = document.createElement("h3");
    productTitle.textContent = product.title;

    const productRating = document.createElement("div");
    productRating.classList.add("rating");
    const starHTMl = getStarRatingHTML(product.rating);
    productRating.innerHTML = `${starHTMl}`;

    const productPrice = document.createElement("p");
    productPrice.classList.add("price");
    productPrice.textContent = `Price: $${product.price.toFixed(2)}`;

    const productStock = document.createElement("p");
    productStock.classList.add("stock");
    productStock.textContent = `In stock: ${product.stock}`;

    productInfo.appendChild(productCategory);
    productInfo.appendChild(productTitle);
    productInfo.appendChild(productRating);
    productInfo.appendChild(productPrice);
    productInfo.appendChild(productStock);

    productLink.appendChild(productImg);
    productLink.appendChild(productInfo);

    productsContainer.appendChild(productLink);
  });
}

fetchProducts();
