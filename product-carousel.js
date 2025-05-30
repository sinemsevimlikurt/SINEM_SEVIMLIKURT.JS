(function () {
    // Only run on homepage
    if (window.location.pathname !== "/" &&
        window.location.pathname !== "/index.html" &&
        !window.location.pathname.includes("anasayfa")) {
        console.log("wrong page");
        return;
    }

    // Configuration
    const API_URL = 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json';
    const STORAGE_KEY = 'product_carousel';
    const FAVORITES_KEY = 'favorites';

    const init = () => {
        self.buildHTML();
        self.buildCSS();
        self.loadProducts();
        self.setEvents();
    };

    const self = {
        products: [],
        favorites: [],
        buildHTML: () => {
            const storiesSection = document.querySelector(".stories-section") || document.body;

            const carouselContainer = document.createElement("div");
            carouselContainer.className = "carousel-container";

            const titleElement = document.createElement("h2");
            titleElement.className = "carousel-title";
            titleElement.textContent = "Beğenebileceğinizi düşündüklerimiz";

            const carouselWrapper = document.createElement("div");
            carouselWrapper.className = "carousel-wrapper";

            const prevButton = document.createElement("button");
            prevButton.className = "carousel-nav prev";
            prevButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg>';

            const nextButton = document.createElement("button");
            nextButton.className = "carousel-nav next";
            nextButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg>';

            const productSlider = document.createElement("div");
            productSlider.className = "product-slider";
            productSlider.id = "product-slider";

            carouselWrapper.appendChild(prevButton);
            carouselWrapper.appendChild(productSlider);
            carouselWrapper.appendChild(nextButton);

            carouselContainer.appendChild(titleElement);
            carouselContainer.appendChild(carouselWrapper);

            storiesSection.parentNode.insertBefore(carouselContainer, storiesSection.nextSibling);
        },

        buildCSS: () => {
            const styleElement = document.createElement("style");
            styleElement.id = "carousel-styles";

            const css = `
  .carousel-container {
    max-width: 1200px;
    margin: 30px auto;
    padding: 0;
    font-family: sans-serif;
  }
  
  .carousel-title {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.11;
    color: #f28e00;
    background-color: rgb(246, 240, 227);
    border-radius: 10px 10px 0 0;
    padding: 15px 20px;
    margin: 0;
    border-left: 2px solid #eee;
    border-right: 2px solid #eee;
    border-top: 2px solid #eee;
  }
  
  .carousel-wrapper {
    position: relative;
    overflow: visible;
    padding: 0;
    margin: 0;
    border-left: 2px solid #eee;
    border-right: 2px solid #eee;
    border-bottom: 2px solid #eee;
    border-radius: 0 0 10px 10px;
  }
  
  .product-slider {
    display: flex;
    overflow-x: scroll;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;
    padding: 10px 0;
    gap: 20px;
  }
  
  .product-slider::-webkit-scrollbar {
    display: none;
  }
  
  .product-card {
    flex: 0 0 auto;
    width: 300px;
    background: white;
    border: 2px solid #eee;
    border-radius: 8px;
    box-shadow: none;
    position: relative;
    transition: transform 0.3s ease;
    padding-bottom: 60px; /* Increased to make room for button */
    margin-right: 20px;
    height: 480px;
  }
  
  .product-card:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border: 2px solid #f28e00;
  }
  
  .product-image {
    width: calc(100% - 20px);
    height: 250px;
    object-fit: contain;
    padding: 10px;
    margin: 0 auto;
    display: block;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
  }
  
  .brand {
    font-size: 12px;
    font-weight: bold;
    color: #777;
    margin-bottom: 5px;
    padding: 0 15px;
    display: flex;
  }
  
  .product-title {
    font-size: 12px;
    color: #777;
    margin-bottom: 10px;
    height: 40px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    padding: 0 15px;
    font-weight: 500;
  }
  
  .price-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    padding: 0 15px;
  }
  
  .current-price {
    font-size: 22px;
    font-weight: 700;
    color: #777;
  }
  
  .discount-product {
    color: #34A853 !important;
  }
  
  .original-price {
    font-size: 16px;
    color: #7d7d7d;
    text-decoration: line-through;
    margin-right: 8px;
  }
  
  .discount {
    display: inline-block;
    color: #34A853;
    font-size: 16px;
    font-weight: 900;
    margin-left: 5px;
  }
  
  .discount i {
    color: #34A853;
  }


    .add-to-cart {
                    width: 70%;
                    padding: 12px 0;
                    background-color: rgba(242, 142, 0, 0.1);
                    color: #f28e00;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    display: block;
                    text-align: center;
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                
                .add-to-cart:hover {
                    background-color: #f28e00;
                    color: white;
                    transform: translateX(-50%) scale(1.05);
                }
  
  .heart-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .heart-icon svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: #999;
    stroke-width: 2;
    transition: all 0.2s ease;
  }
  
  .heart-icon.favorite svg {
    fill: #f28e00;
    stroke: #f28e00;
  }
  
  .carousel-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background: rgba(242, 142, 0, 0.1); /* Light orange background */
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 3;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: background-color 0.3s ease;
  }
  
  .carousel-nav:hover {
    background: white;
  }
  
  .carousel-nav.prev {
    left: -50px;
  }

  .carousel-nav.next {
    right: -50px;
  }
  
  .carousel-nav svg {
    width: 24px;
    height: 24px;
    stroke: #f28e00; /* Orange icon color */
    stroke-width: 2;
    fill: none;
  }
  
  /* Add badge styles for popular products */
  .product-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .badge-popular {
    background-color: #e81c24;
    color: white;
    font-size: 11px;
    padding: 3px 6px;
    border-radius: 3px;
    font-weight: 600;
  }
  
  .badge-star {
    background-color: #f1c40f;
    color: white;
    font-size: 11px;
    padding: 3px 6px;
    border-radius: 3px;
    font-weight: 600;
  }
  
  /* Add styles for discount price in cart */
  .cart-discount {
    color: #e81c24;
    font-size: 13px;
    font-weight: 500;
    padding: 0 15px 15px;
  }
  
  /* Add to cart button */
  .add-to-cart-btn {
    width: calc(100% - 30px);
    margin: 0 15px 15px;
    padding: 8px 0;
    background-color: #f5f5f5;
    border: none;
    border-radius: 4px;
    color: #333;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .add-to-cart-btn:hover {
    background-color: #e5e5e5;
  }
  
  /* Star rating styles */
  .rating-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 0 15px;
  }
  
  .star-rating {
    display: flex;
    color: #f1c40f;
    font-size: 22px;
  }
  
  .review-count {
    font-size: 16px;
    color: #777;
    margin-left: 5px;
  }
  
  @media (max-width: 768px) {
    .product-card {
      width: 280px;
    }
    
    .product-image {
      height: 250px;
    }
  }
  
  @media (max-width: 480px) {
    .product-card {
      width: 220px;
    }
    
    .product-image {
      height: 200px;
    }
    
    .carousel-title {
      font-size: 18px;
    }
  }
`;
            const starRatingCSS =
                /* Star rating styles */
                `.rating-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 0 15px;
  }
  
  .star-rating {
    display: flex;
    color: #ffc107;
    font-size: 14px;
  }
  
  .star {
    color: #ffc107;
  }
  
  .star-empty {
    color: #e0e0e0;
  }
  
  .review-count {
    font-size: 12px;
    color: #777;
    margin-left: 5px;`

                ;

            styleElement.textContent = css;
            document.head.appendChild(styleElement);
        },

        loadProducts: async () => {
            //First try to load from localStorage
            const storedData = localStorage.getItem(STORAGE_KEY);
            const storedFavorites = localStorage.getItem(FAVORITES_KEY);

            if (storedFavorites) {
                self.favorites = JSON.parse(storedFavorites);
            }

            if (storedData) {
                self.products = JSON.parse(storedData);
                self.renderProducts();
                return;
            }

            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`HTTP ERROR! status: ${response.status}`);
                }

                const data = await response.json();
                self.products = data;

                localStorage.setItem(STORAGE_KEY, JSON.stringify(self.products));
                self.renderProducts();
            } catch (error) {
                console.log("Error while fetching products: ", error);
            }
        },

        renderProducts: () => {
            const slider = document.getElementById('product-slider');
            if (!slider) return;

            slider.innerHTML = '';

            self.products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';

                const productLink = document.createElement('a');
                productLink.href = product.url;
                productLink.target = '_blank';
                productLink.style.textDecoration = 'none';
                productLink.style.color = 'inherit';
                productLink.style.display = 'block';

                const image = document.createElement('img');
                image.className = 'product-image';
                image.src = product.img;
                image.alt = product.name;
                productLink.appendChild(image);

                const brand = document.createElement('div');
                brand.className = 'brand';
                brand.textContent = product.brand;
                productLink.appendChild(brand);

                const title = document.createElement('div');
                title.className = 'product-title';
                title.textContent = product.name;
                productLink.appendChild(title);

                // Add star rating with review count
                const ratingContainer = document.createElement('div');
                ratingContainer.className = 'rating-container';

                // Create star rating
                const starRating = document.createElement('div');
                starRating.className = 'star-rating';

                // Default to 5 stars if not specified
                const rating = product.rating || 5;

                // Create 5 stars
                for (let i = 0; i < 5; i++) {
                    const star = document.createElement('span');
                    // Fill stars based on rating
                    if (i < rating) {
                        star.className = 'star';
                        star.textContent = '★';
                    } else {
                        star.className = 'star-empty';
                        star.textContent = '★';
                    }
                    starRating.appendChild(star);
                }

                ratingContainer.appendChild(starRating);

                // Add review count if available
                if (product.reviewCount) {
                    const reviewCount = document.createElement('span');
                    reviewCount.className = 'review-count';
                    reviewCount.textContent = `(${product.reviewCount})`;
                    ratingContainer.appendChild(reviewCount);
                }

                productLink.appendChild(ratingContainer);

                const priceContainer = document.createElement('div');
                priceContainer.className = 'price-container';

                const currentPrice = parseFloat(product.price);
                const originalPrice = parseFloat(product.original_price);

                const priceDisplay = document.createElement('div');
                priceDisplay.style.display = 'flex';
                priceDisplay.style.alignItems = 'center';

                if (originalPrice && originalPrice > currentPrice) {
                    const priceRow = document.createElement('div');
                    priceRow.className = 'd-flex align-items-center';

                    const originalPriceSpan = document.createElement('span');
                    originalPriceSpan.className = 'original-price';
                    originalPriceSpan.textContent = `${originalPrice.toFixed(2)} TL`;
                    priceRow.appendChild(originalPriceSpan);

                    // Calculate discount percentage
                    const discountPercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
                    const discountBadge = document.createElement('span');
                    discountBadge.className = 'discount';
                    discountBadge.innerHTML = `%${discountPercentage} <i class="icon icon-decrease"></i>`;
                    discountBadge.style.marginLeft = '5px';
                    priceRow.appendChild(discountBadge);

                    priceDisplay.appendChild(priceRow);

                    // Add margin between discount percentage and price
                    priceDisplay.style.flexDirection = 'column';
                    priceDisplay.style.marginBottom = '5px';

                    const currentPriceSpan = document.createElement('span');
                    currentPriceSpan.className = 'current-price discount-product';
                    currentPriceSpan.textContent = `${currentPrice.toFixed(2)} TL`;
                    currentPriceSpan.style.marginTop = '5px';
                    priceDisplay.appendChild(currentPriceSpan);
                } else {
                    const currentPriceSpan = document.createElement('span');
                    currentPriceSpan.className = 'current-price';
                    currentPriceSpan.textContent = `${currentPrice.toFixed(2)} TL`;
                    priceDisplay.appendChild(currentPriceSpan);
                }

                priceContainer.appendChild(priceDisplay);
                productLink.appendChild(priceContainer);
                card.appendChild(productLink);

                // sepete ekle
                const btn = document.createElement('button');
                btn.className = 'add-to-cart';
                btn.textContent = 'Sepete Ekle';
                card.appendChild(btn);

                const heartIcon = document.createElement('div');
                heartIcon.className = `heart-icon ${self.favorites.includes(product.id) ? 'favorite' : ''}`;
                heartIcon.setAttribute('data-product-id', product.id);
                heartIcon.innerHTML = `
            <svg viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        `;

                card.appendChild(heartIcon);
                slider.appendChild(card);
            });
        },

        toggleFavorite: (productId) => {
            const index = self.favorites.indexOf(productId);

            if (index == -1) {
                self.favorites.push(productId);
            } else {
                self.favorites.splice(index, 1);
            }

            //Save to localStorage
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(self.favorites));

            //Update UI
            const heartIcon = document.querySelector(`.heart-icon[data-product-id = "${productId}"]`);
            if (heartIcon) {
                heartIcon.classList.toggle("favorite");
            }
        },

        setEvents: () => {
            // Navigation buttons
            document.querySelector('.carousel-nav.prev').addEventListener('click', () => {
                const slider = document.getElementById('product-slider');
                slider.scrollBy({ left: -600, behavior: 'smooth' });
            });

            document.querySelector('.carousel-nav.next').addEventListener('click', () => {
                const slider = document.getElementById('product-slider');
                slider.scrollBy({ left: 600, behavior: 'smooth' });
            });

            // Event delegation for heart icons (for favorites)
            document.addEventListener('click', (e) => {
                const heartIcon = e.target.closest('.heart-icon');
                if (heartIcon) {
                    e.preventDefault();
                    e.stopPropagation();
                    const productId = parseInt(heartIcon.getAttribute('data-product-id'));
                    self.toggleFavorite(productId);
                }
            });
        }
    };

    init();
})();