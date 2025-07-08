const productLoading = document.querySelector(".product-loading");
const productError = document.querySelector(".product-error");
const productMainContent = document.querySelector(".product-main-content");

const mainProductImage = document.querySelector(".main-product-image");
const productTitle = document.querySelector(".product-title");
const productBrandCategory = document.querySelector(".product-category");
const productRating = document.querySelector(".product-rating");
const productDescription = document.querySelector(".product-description");
const productPrice = document.querySelector(".product-price");
const productStock = document.querySelector(".product-stock");

const tabButtonsContainer = document.getElementById("product-tabs-buttons");
const tabContentContainer = document.getElementById("product-tabs-content");

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

async function fetchProductDetails() {
  productLoading.style.display = "block";
  productError.style.display = "none";
  productMainContent.style.display = "none";

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Product does not exist.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const product = await response.json();
    renderProductDetails(product);
    productLoading.style.display = "none";
    productMainContent.style.display = "block";
  } catch (error) {
    console.error("Error fetching product details:", error);
    productLoading.style.display = "none";
    productError.style.display = "block";
    productError.textContent = `Unable to load product details: ${error.message}`;
  }
}

function renderProductDetails(product) {
  // --- Populate Main Overview Section ---
  mainProductImage.src = product.thumbnail;
  mainProductImage.alt = product.title;

  productTitle.textContent = product.title;

  productBrandCategory.textContent = `Brand: ${product.brand}`;
  
  const roundedAvgRating = product.rating.toFixed(1);
  const avgStarHTML = getStarRatingHTML(product.rating);
  productRating.innerHTML = `Reviews: ${avgStarHTML} (${roundedAvgRating}/5)`;
  productDescription.textContent = product.description;

  const discountedPrice = product.price;
  const originalPrice =
    discountedPrice / (1 - product.discountPercentage / 100);

  const formattedDiscountedPrice = discountedPrice.toFixed(2);
  const formattedOriginalPrice = originalPrice.toFixed(2);
  const formattedDiscountPercentage = product.discountPercentage.toFixed(2);

  if (product.discountPercentage > 0) {
    productPrice.innerHTML = `$${formattedDiscountedPrice} <span class="original-price">$${formattedOriginalPrice}</span> <span class="discount">(-${formattedDiscountPercentage}%)</span>`;
  } else {
    productPrice.innerHTML = `$${formattedOriginalPrice}`;
  }
  productStock.textContent = `In stock: ${product.stock}`;

  document.getElementById("breadcrumb-product-title").textContent =
    product.title;

  tabButtonsContainer.innerHTML = "";
  tabContentContainer.innerHTML = "";

  // Tab 1: Specifications
  const specsPane = document.createElement("div");
  specsPane.id = "specs-tab";
  specsPane.classList.add("tab-pane", "active");

  const specsSection = document.createElement("div");
  specsSection.classList.add("detail-section");
  const specsTitle = document.createElement("h2");
  specsTitle.textContent = "Specifications";

  const skuInfo = document.createElement("p");
  skuInfo.textContent = `SKU: ${product.sku}`;
  const weightInfo = document.createElement("p");
  weightInfo.textContent = `Weight: ${product.weight} kg`;
  const dimensionsInfo = document.createElement("p");
  dimensionsInfo.textContent = `Size (cm): ${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth}`;

  specsSection.appendChild(specsTitle);
  specsSection.appendChild(skuInfo);
  specsSection.appendChild(weightInfo);
  specsSection.appendChild(dimensionsInfo);
  specsPane.appendChild(specsSection);

  // Tab 2: Policies
  const policiesPane = document.createElement("div");
  policiesPane.id = "policies-tab";
  policiesPane.classList.add("tab-pane");

  const policySection = document.createElement("div");
  policySection.classList.add("detail-section");
  const policyTitle = document.createElement("h2");
  policyTitle.textContent = "Policy";
  const warrantyInfo = document.createElement("p");
  warrantyInfo.textContent = `Warranty: ${product.warrantyInformation}`;
  const shippingInfo = document.createElement("p");
  shippingInfo.textContent = `Delivery: ${product.shippingInformation}`;
  const returnPolicyInfo = document.createElement("p");
  returnPolicyInfo.textContent = `Return policy: ${product.returnPolicy}`;
  const availabilityStatusInfo = document.createElement("p");
  availabilityStatusInfo.textContent = `Status: ${product.availabilityStatus}`;

  policySection.appendChild(policyTitle);
  policySection.appendChild(warrantyInfo);
  policySection.appendChild(shippingInfo);
  policySection.appendChild(returnPolicyInfo);
  policySection.appendChild(availabilityStatusInfo);
  policiesPane.appendChild(policySection);

  // Tab 3: Reviews
  const reviewsPane = document.createElement("div");
  reviewsPane.id = "reviews-tab";
  reviewsPane.classList.add("tab-pane");

  const reviewsSection = document.createElement("div");
  reviewsSection.classList.add("detail-section");
  const reviewsTitle = document.createElement("h2");
  reviewsTitle.textContent = `Reviews`;
  const reviewsList = document.createElement("ul");
  reviewsList.classList.add("reviews-list");

  if (product.reviews && product.reviews.length > 0) {
    product.reviews.forEach((review) => {
      const reviewItem = document.createElement("li");
      reviewItem.classList.add("review-item");

      const reviewRating = document.createElement("p");
      reviewRating.innerHTML = `<strong>Review:</strong> ${getStarRatingHTML(
        review.rating
      )}`;

      const reviewComment = document.createElement("p");
      reviewComment.innerHTML = `<strong>Comment:</strong> "${review.comment}"`;
      const reviewMeta = document.createElement("p");
      reviewMeta.classList.add("review-meta");
      const reviewDate = new Date(review.date).toLocaleDateString();
      reviewMeta.textContent = `By ${review.reviewerName} at ${reviewDate}`;

      reviewItem.appendChild(reviewRating);
      reviewItem.appendChild(reviewComment);
      reviewItem.appendChild(reviewMeta);
      reviewsList.appendChild(reviewItem);
    });
  } else {
    const noReviews = document.createElement("p");
    noReviews.textContent = "No reviews yet.";
    reviewsList.appendChild(noReviews);
  }
  reviewsSection.appendChild(reviewsTitle);
  reviewsSection.appendChild(reviewsList);
  reviewsPane.appendChild(reviewsSection);

  // --- Append Tab Content to Container ---
  tabContentContainer.appendChild(specsPane);
  tabContentContainer.appendChild(policiesPane);
  tabContentContainer.appendChild(reviewsPane);

  // --- Create Tab Buttons ---
  const tabs = [
    { id: "specs", label: "Specifications" },
    { id: "policies", label: "Policy" },
    { id: "reviews", label: `Reviews (${product.reviews.length})` },
  ];

  tabs.forEach((tab, index) => {
    const button = document.createElement("button");
    button.classList.add("tab-button");
    if (index === 0) {
      button.classList.add("active");
    }
    button.dataset.tab = tab.id;
    button.textContent = tab.label;
    tabButtonsContainer.appendChild(button);
  });

  // --- Setup Tab Switching Logic ---
  const tabButtons = tabButtonsContainer.querySelectorAll(".tab-button");
  const tabPanes = tabContentContainer.querySelectorAll(".tab-pane");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Activate the clicked button
      button.classList.add("active");

      // Find and activate the corresponding pane
      const targetTabId = button.dataset.tab;
      const targetPane = document.getElementById(`${targetTabId}-tab`);
      if (targetPane) {
        targetPane.classList.add("active");
      }
    });
  });
}

fetchProductDetails();
