# ebebek Product Carousel

## Overview
This project implements a responsive product carousel for the ebebek website, designed to match the exact styling of the original site. The carousel displays products with their details, prices, discounts, and allows users to add items to favorites.

## Features
- **Pixel-perfect Design**: Matches the exact design of the ebebek website
- **Product Display**: Shows product images, brand names, titles, and prices
- **Discount Highlighting**: Clearly displays original prices, discounted prices, and discount percentages
- **Favorites System**: Heart icon toggles favorites, which are stored in local storage
- **Add to Cart**: Button for adding products to cart
- **Responsive Layout**: Adapts to different screen sizes
- **Local Storage**: Saves favorites and product data for faster loading on subsequent visits
- **Navigation Controls**: Left and right arrows for browsing products

## Technical Implementation
- **Pure JavaScript**: Built using only vanilla JavaScript without external libraries
- **DOM Manipulation**: All HTML and CSS are created dynamically via JavaScript
- **Local Storage**: Uses browser's localStorage for data persistence
- **Fetch API**: Retrieves product data from the specified endpoint
- **Event Delegation**: Efficiently handles user interactions

## How It Works
1. The script checks if the user is on the homepage
2. It attempts to load product data from local storage first
3. If no data exists in local storage, it fetches from the API
4. The carousel is dynamically created and appended after the stories section
5. Products are rendered with all their details
6. User interactions (favorites, navigation) are handled through event listeners

## Code Structure
- **IIFE Pattern**: Entire code is wrapped in an immediately invoked function expression
- **Configuration**: API URL and storage keys are defined at the top
- **Initialization**: Sets up the carousel and loads data
- **HTML Generation**: Creates all necessary DOM elements
- **CSS Styling**: Applies all styling through JavaScript
- **Data Loading**: Handles fetching and storing product data
- **Rendering**: Displays products with all their details
- **Event Handling**: Manages user interactions

## Usage
To use this carousel on the ebebek website, simply include the `product-carousel.js` file in the page. The script will automatically initialize and display the carousel when the page loads, but only if the user is on the homepage.

```html
<script src="product-carousel.js"></script>
```

## Author
Sinem Sevimlikurt
