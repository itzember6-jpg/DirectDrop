/**
 * ============================================================
 * PUT XYZ - E-Commerce Website
 * Complete JavaScript File
 * ============================================================
 * 
 * This file contains all the JavaScript functionality for the
 * entire website including:
 * - Cart management
 * - Wishlist management
 * - Product interactions
 * - Form validations
 * - UI interactions
 * - Animations
 * - And more...
 * ============================================================
 */

// ============================================================
// GLOBAL VARIABLES & STATE
// ============================================================

// Product Database (Simulated)
const products = [
    { id: 1, name: 'Wireless Bluetooth Headphones', brand: 'Sony', price: 89.99, originalPrice: 129.99, rating: 4.5, reviews: 128, stock: 15, category: 'Electronics', image: 'product-1.jpg' },
    { id: 2, name: 'Smart Fitness Watch', brand: 'Apple', price: 149.99, originalPrice: 199.99, rating: 5.0, reviews: 95, stock: 8, category: 'Electronics', image: 'product-2.jpg' },
    { id: 3, name: 'Premium Leather Backpack', brand: 'Herschel', price: 79.99, originalPrice: 134.99, rating: 4.9, reviews: 67, stock: 12, category: 'Fashion', image: 'product-3.jpg' },
    { id: 4, name: 'Wireless Charging Pad', brand: 'Anker', price: 34.99, originalPrice: 41.99, rating: 4.8, reviews: 203, stock: 25, category: 'Electronics', image: 'product-4.jpg' },
    { id: 5, name: '4K Action Camera', brand: 'GoPro', price: 199.99, originalPrice: null, rating: 4.6, reviews: 156, stock: 6, category: 'Electronics', image: 'product-5.jpg' },
    { id: 6, name: 'Mechanical Keyboard', brand: 'Logitech', price: 129.99, originalPrice: null, rating: 4.7, reviews: 89, stock: 10, category: 'Electronics', image: 'product-6.jpg' },
    { id: 7, name: 'Smart Home Hub', brand: 'Amazon', price: 89.99, originalPrice: null, rating: 4.9, reviews: 312, stock: 20, category: 'Electronics', image: 'product-7.jpg' },
    { id: 8, name: 'Wireless Earbuds', brand: 'Samsung', price: 59.99, originalPrice: null, rating: 4.8, reviews: 178, stock: 18, category: 'Electronics', image: 'product-8.jpg' },
    { id: 9, name: 'Professional Drone', brand: 'DJI', price: 499.99, originalPrice: null, rating: 5.0, reviews: 45, stock: 3, category: 'Electronics', image: 'product-9.jpg' },
    { id: 10, name: 'Smartphone 5G', brand: 'Samsung', price: 699.99, originalPrice: null, rating: 4.7, reviews: 234, stock: 7, category: 'Electronics', image: 'product-10.jpg' },
    { id: 11, name: 'Gaming Monitor', brand: 'LG', price: 349.99, originalPrice: null, rating: 4.9, reviews: 89, stock: 0, category: 'Electronics', image: 'product-11.jpg' },
    { id: 12, name: 'Coffee Maker', brand: 'Breville', price: 89.99, originalPrice: null, rating: 4.6, reviews: 156, stock: 0, category: 'Home', image: 'product-12.jpg' },
    { id: 13, name: 'Smart Glasses', brand: 'Ray-Ban', price: 299.99, originalPrice: null, rating: 4.8, reviews: 34, stock: 5, category: 'Fashion', image: 'product-13.jpg' },
    { id: 14, name: 'Robot Vacuum', brand: 'iRobot', price: 449.99, originalPrice: null, rating: 4.7, reviews: 78, stock: 9, category: 'Home', image: 'product-14.jpg' },
    { id: 15, name: 'Scent Diffuser', brand: 'Vitruvi', price: 39.99, originalPrice: null, rating: 4.9, reviews: 45, stock: 14, category: 'Home', image: 'product-15.jpg' },
    { id: 16, name: 'Portable Speaker', brand: 'JBL', price: 79.99, originalPrice: null, rating: 4.5, reviews: 123, stock: 11, category: 'Electronics', image: 'product-16.jpg' }
];

// Cart State
let cart = [
    { id: 1, quantity: 1, selected: true },
    { id: 2, quantity: 2, selected: true },
    { id: 3, quantity: 1, selected: false }
];

// Wishlist State
let wishlist = [5, 6, 7, 8, 13];

// Saved for Later
let savedForLater = [];

// Applied Coupons
let appliedCoupons = [];

// Gift Cards Applied
let appliedGiftCards = [];

// Selected Shipping
let selectedShipping = 'standard';

// ============================================================
// CART FUNCTIONS
// ============================================================

/**
 * Add a product to the cart
 * @param {number} productId - The ID of the product to add
 */
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification('Product quantity updated in cart!', 'success');
    } else {
        cart.push({ id: productId, quantity: 1, selected: true });
        showNotification('Product added to cart!', 'success');
    }
    
    updateCartBadge();
    updateCartDisplay();
    updateCartTotal();
    saveCartToStorage();
}

/**
 * Update the quantity of a cart item
 * @param {number} productId - The ID of the product
 * @param {number} change - The change in quantity (+1 or -1)
 */
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;
    if (newQuantity > 99) return;
    
    item.quantity = newQuantity;
    
    // Update the displayed quantity
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    if (qtyDisplay) {
        qtyDisplay.textContent = newQuantity;
    }
    
    // Update the item total
    const product = products.find(p => p.id === productId);
    if (product) {
        const totalElement = document.getElementById(`total-${productId}`);
        if (totalElement) {
            const total = product.price * newQuantity;
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
    }
    
    updateCartTotal();
    updateCartBadge();
    saveCartToStorage();
}

/**
 * Remove an item from the cart
 * @param {number} productId - The ID of the product to remove
 */
function removeItem(productId) {
    // Check if it should be saved for later instead
    const item = cart.find(i => i.id === productId);
    if (item && item.selected) {
        // Save for later
        saveForLater(productId);
        return;
    }
    
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateCartBadge();
    updateCartTotal();
    saveCartToStorage();
    showNotification('Item removed from cart.', 'info');
}

/**
 * Save an item for later
 * @param {number} productId - The ID of the product to save
 */
function saveForLater(productId) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    // Remove from cart
    cart = cart.filter(i => i.id !== productId);
    
    // Add to saved for later
    if (!savedForLater.includes(productId)) {
        savedForLater.push(productId);
    }
    
    updateCartDisplay();
    updateCartBadge();
    updateCartTotal();
    updateSavedForLater();
    saveCartToStorage();
    showNotification('Item saved for later!', 'success');
}

/**
 * Move an item from saved for later to cart
 * @param {number} productId - The ID of the product to move
 */
function moveToCart(productId) {
    savedForLater = savedForLater.filter(id => id !== productId);
    addToCart(productId);
    updateSavedForLater();
    saveCartToStorage();
}

/**
 * Toggle select all items in cart
 */
function toggleSelectAll() {
    const selectAll = document.getElementById('select-all');
    const checkboxes = document.querySelectorAll('.item-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
    
    // Update the selected state in cart
    cart.forEach(item => {
        const checkbox = document.querySelector(`.item-checkbox[data-id="${item.id}"]`);
        if (checkbox) {
            item.selected = checkbox.checked;
        }
    });
    
    updateCartTotal();
    saveCartToStorage();
}

/**
 * Clear the entire cart
 */
function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty.', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear your entire cart?')) {
        cart = [];
        updateCartDisplay();
        updateCartBadge();
        updateCartTotal();
        saveCartToStorage();
        showNotification('Cart cleared.', 'info');
    }
}

/**
 * Update the cart badge count in the header
 */
function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    badges.forEach(badge => {
        badge.textContent = totalItems;
    });
}

/**
 * Update the cart display (items list)
 */
function updateCartDisplay() {
    const cartItemsList = document.querySelector('.cart-items-list');
    const emptyCart = document.getElementById('empty-cart');
    const itemCount = document.getElementById('item-count');
    
    if (!cartItemsList) return;
    
    // If cart is empty
    if (cart.length === 0) {
        if (emptyCart) {
            cartItemsList.style.display = 'none';
            emptyCart.style.display = 'flex';
        }
        if (itemCount) itemCount.textContent = '0';
        return;
    }
    
    if (emptyCart) {
        emptyCart.style.display = 'none';
        cartItemsList.style.display = 'flex';
    }
    
    // Remove existing cart items (keep the empty cart message)
    const items = cartItemsList.querySelectorAll('.cart-item');
    items.forEach(item => item.remove());
    
    // Render each cart item
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.id;
        
        cartItem.innerHTML = `
            <div class="cart-item-select">
                <label class="checkbox-label">
                    <input type="checkbox" class="item-checkbox" data-id="${item.id}" ${item.selected ? 'checked' : ''} onchange="updateCartTotal()" />
                    <span class="checkmark"></span>
                </label>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-image">
                    <div class="image-placeholder"><i class="fas fa-image"></i></div>
                </div>
                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <div class="item-variant">
                        <span class="variant-color">Color: <strong>Black</strong></span>
                        <span class="variant-size">Size: <strong>M</strong></span>
                    </div>
                    <div class="item-actions">
                        <button class="btn-save-later" onclick="saveForLater(${item.id})"><i class="far fa-heart"></i> Save for Later</button>
                        <button class="btn-remove" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i> Remove</button>
                    </div>
                </div>
            </div>
            <div class="cart-item-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                ${product.originalPrice ? `<span class="discount-tag">-${Math.round((1 - product.price / product.originalPrice) * 100)}%</span>` : ''}
            </div>
            <div class="cart-item-quantity">
                <div class="qty-controls">
                    <button onclick="updateQuantity(${item.id}, -1)"><i class="fas fa-minus"></i></button>
                    <span id="qty-${item.id}">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <div class="cart-item-total">
                <span class="item-total" id="total-${item.id}">$${(product.price * item.quantity).toFixed(2)}</span>
            </div>
            <div class="cart-item-action">
                <button class="btn-remove-item" onclick="removeItem(${item.id})"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        cartItemsList.appendChild(cartItem);
    });
    
    // Update select all state
    updateSelectAllState();
}

/**
 * Update the select all checkbox state
 */
function updateSelectAllState() {
    const selectAll = document.getElementById('select-all');
    if (!selectAll) return;
    
    const checkboxes = document.querySelectorAll('.item-checkbox');
    if (checkboxes.length === 0) {
        selectAll.checked = false;
        return;
    }
    
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    selectAll.checked = allChecked;
}

/**
 * Update the cart total calculation
 */
function updateCartTotal() {
    // Get selected items
    const selectedItems = cart.filter(item => {
        const checkbox = document.querySelector(`.item-checkbox[data-id="${item.id}"]`);
        return checkbox ? checkbox.checked : item.selected;
    });
    
    // Update selected state in cart
    cart.forEach(item => {
        const checkbox = document.querySelector(`.item-checkbox[data-id="${item.id}"]`);
        if (checkbox) {
            item.selected = checkbox.checked;
        }
    });
    
    // Calculate totals
    let subtotal = 0;
    let discount = 0;
    let itemCount = 0;
    
    selectedItems.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            itemCount += item.quantity;
            
            if (product.originalPrice) {
                discount += (product.originalPrice - product.price) * item.quantity;
            }
        }
    });
    
    // Apply coupons
    let couponDiscount = 0;
    appliedCoupons.forEach(coupon => {
        if (coupon === 'SAVE20') {
            couponDiscount = subtotal * 0.20;
        } else if (coupon === 'WELCOME10') {
            couponDiscount = subtotal * 0.10;
        }
    });
    
    // Apply gift cards
    let giftCardDiscount = 0;
    appliedGiftCards.forEach(card => {
        giftCardDiscount += card.amount || 0;
    });
    
    // Calculate shipping
    let shippingCost = 0;
    if (selectedShipping === 'express') {
        shippingCost = 12.99;
    } else if (selectedShipping === 'overnight') {
        shippingCost = 24.99;
    } else if (selectedShipping === 'pickup' || selectedShipping === 'standard') {
        shippingCost = 0;
    }
    
    // Free shipping on orders over $50
    if (subtotal > 50 && selectedShipping === 'standard') {
        shippingCost = 0;
    }
    
    // Calculate tax (approximate 8%)
    const taxRate = 0.08;
    const taxableAmount = subtotal - couponDiscount - giftCardDiscount;
    const tax = taxableAmount > 0 ? taxableAmount * taxRate : 0;
    
    // Calculate total
    const total = subtotal - couponDiscount - giftCardDiscount + shippingCost + tax;
    
    // Update DOM
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount-amount');
    const shippingElement = document.getElementById('shipping-cost');
    const taxElement = document.getElementById('tax-amount');
    const totalElement = document.getElementById('total-amount');
    const itemCountElement = document.getElementById('item-count');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (discountElement) {
        const totalDiscount = discount + couponDiscount + giftCardDiscount;
        discountElement.textContent = totalDiscount > 0 ? `-$${totalDiscount.toFixed(2)}` : '$0.00';
    }
    if (shippingElement) shippingElement.textContent = shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    if (itemCountElement) itemCountElement.textContent = itemCount;
}

/**
 * Update the saved for later section
 */
function updateSavedForLater() {
    const container = document.getElementById('save-later-items');
    const countElement = document.getElementById('saved-count');
    
    if (!container) return;
    
    if (savedForLater.length === 0) {
        container.innerHTML = '<p class="no-saved-items">No items saved for later.</p>';
        if (countElement) countElement.textContent = '0 items';
        return;
    }
    
    if (countElement) countElement.textContent = `${savedForLater.length} items`;
    
    let html = '';
    savedForLater.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
            html += `
                <div class="cart-item" data-id="${id}">
                    <div class="cart-item-details">
                        <div class="cart-item-image">
                            <div class="image-placeholder"><i class="fas fa-image"></i></div>
                        </div>
                        <div class="cart-item-info">
                            <h4>${product.name}</h4>
                            <div class="item-variant">
                                <span class="variant-color">Color: <strong>Black</strong></span>
                            </div>
                            <div class="item-actions">
                                <button class="btn-save-later" onclick="moveToCart(${id})"><i class="fas fa-shopping-cart"></i> Move to Cart</button>
                                <button class="btn-remove" onclick="removeFromSaved(${id})"><i class="fas fa-trash"></i> Remove</button>
                            </div>
                        </div>
                    </div>
                    <div class="cart-item-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                    </div>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
}

/**
 * Remove an item from saved for later
 * @param {number} productId - The ID of the product to remove
 */
function removeFromSaved(productId) {
    savedForLater = savedForLater.filter(id => id !== productId);
    updateSavedForLater();
    saveCartToStorage();
    showNotification('Item removed from saved items.', 'info');
}

// ============================================================
// COUPON FUNCTIONS
// ============================================================

/**
 * Apply a coupon code
 */
function applyCoupon() {
    const input = document.getElementById('coupon-input');
    if (!input) return;
    
    const code = input.value.trim().toUpperCase();
    if (!code) {
        showCouponMessage('Please enter a coupon code.', 'error');
        return;
    }
    
    applyCouponCode(code);
}

/**
 * Apply a coupon code by name
 * @param {string} code - The coupon code to apply
 */
function applyCouponCode(code) {
    const validCoupons = ['SAVE20', 'FREESHIP', 'WELCOME10'];
    
    if (!validCoupons.includes(code)) {
        showCouponMessage('Invalid coupon code. Please try again.', 'error');
        return;
    }
    
    if (appliedCoupons.includes(code)) {
        showCouponMessage('This coupon has already been applied.', 'error');
        return;
    }
    
    appliedCoupons.push(code);
    showCouponMessage(`Coupon "${code}" applied successfully!`, 'success');
    
    const input = document.getElementById('coupon-input');
    if (input) input.value = '';
    
    updateCartTotal();
    saveCartToStorage();
}

/**
 * Show coupon message
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error)
 */
function showCouponMessage(message, type) {
    const messageElement = document.getElementById('coupon-message');
    if (!messageElement) return;
    
    messageElement.textContent = message;
    messageElement.className = type;
    
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = '';
    }, 3000);
}

// ============================================================
// GIFT CARD FUNCTIONS
// ============================================================

/**
 * Apply a gift card
 */
function applyGiftCard() {
    const input = document.getElementById('gift-card-input');
    if (!input) return;
    
    const code = input.value.trim();
    if (!code) {
        showNotification('Please enter a gift card code.', 'error');
        return;
    }
    
    // Simulate gift card validation
    if (code.length < 8) {
        showNotification('Invalid gift card code.', 'error');
        return;
    }
    
    // Random amount between $10 and $100
    const amount = Math.floor(Math.random() * 90) + 10;
    
    appliedGiftCards.push({ code, amount });
    input.value = '';
    
    showNotification(`Gift card of $${amount} applied successfully!`, 'success');
    updateCartTotal();
    saveCartToStorage();
}

// ============================================================
// SHIPPING FUNCTIONS
// ============================================================

/**
 * Update shipping method
 */
function updateShipping() {
    const select = document.getElementById('shipping-select');
    if (!select) return;
    
    selectedShipping = select.value;
    updateCartTotal();
    saveCartToStorage();
}

// ============================================================
// CHECKOUT FUNCTIONS
// ============================================================

/**
 * Proceed to checkout
 */
function proceedToCheckout() {
    const selectedItems = cart.filter(item => {
        const checkbox = document.querySelector(`.item-checkbox[data-id="${item.id}"]`);
        return checkbox ? checkbox.checked : item.selected;
    });
    
    if (selectedItems.length === 0) {
        showNotification('Please select at least one item to checkout.', 'error');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// ============================================================
// WISHLIST FUNCTIONS
// ============================================================

/**
 * Toggle wishlist status for a product
 * @param {HTMLElement} button - The wishlist button element
 */
function toggleWishlist(button) {
    const productCard = button.closest('.product-card');
    if (!productCard) return;
    
    const productId = parseInt(productCard.dataset.id);
    if (!productId) return;
    
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        button.querySelector('i').className = 'far fa-heart';
        button.classList.remove('active');
        showNotification('Removed from wishlist.', 'info');
    } else {
        wishlist.push(productId);
        button.querySelector('i').className = 'fas fa-heart';
        button.classList.add('active');
        showNotification('Added to wishlist!', 'success');
    }
    
    saveWishlistToStorage();
}

/**
 * Toggle wishlist from detail page
 */
function toggleWishlistDetail() {
    const productId = 1; // This would be dynamic in a real implementation
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist.', 'info');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist!', 'success');
    }
    
    saveWishlistToStorage();
}

// ============================================================
// QUICK VIEW FUNCTIONS
// ============================================================

let quickViewQuantity = 1;

/**
 * Open quick view modal
 * @param {number} productId - The ID of the product to view
 */
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;
    
    // Populate quick view with product data
    const image = modal.querySelector('.quick-view-image .image-placeholder');
    const brand = modal.querySelector('.product-brand');
    const title = modal.querySelector('.product-title');
    const rating = modal.querySelector('.product-rating');
    const price = modal.querySelector('.current-price');
    const originalPrice = modal.querySelector('.original-price');
    const description = modal.querySelector('.product-description');
    
    if (image) image.innerHTML = '<i class="fas fa-image"></i>';
    if (brand) brand.textContent = product.brand;
    if (title) title.textContent = product.name;
    if (rating) rating.innerHTML = generateStarRating(product.rating) + ` <span>(${product.rating}) ${product.reviews} reviews</span>`;
    if (price) price.textContent = `$${product.price.toFixed(2)}`;
    if (originalPrice) {
        if (product.originalPrice) {
            originalPrice.textContent = `$${product.originalPrice.toFixed(2)}`;
            originalPrice.style.display = 'inline';
        } else {
            originalPrice.style.display = 'none';
        }
    }
    if (description) description.textContent = getProductDescription(productId);
    
    quickViewQuantity = 1;
    document.getElementById('quick-qty').textContent = '1';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close quick view modal
 */
function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Update quantity in quick view
 * @param {number} change - The change in quantity (+1 or -1)
 */
function updateQuantity(change) {
    quickViewQuantity += change;
    if (quickViewQuantity < 1) quickViewQuantity = 1;
    if (quickViewQuantity > 99) quickViewQuantity = 99;
    
    const qtyDisplay = document.getElementById('quick-qty');
    if (qtyDisplay) qtyDisplay.textContent = quickViewQuantity;
}

/**
 * Add to cart from quick view
 */
function addToCartFromQuickView() {
    const productId = 1; // This would be dynamic
    addToCart(productId);
    closeQuickView();
}

/**
 * Buy now from quick view
 */
function buyNowFromQuickView() {
    const productId = 1; // This would be dynamic
    addToCart(productId);
    closeQuickView();
    window.location.href = 'checkout.html';
}

// ============================================================
// PRODUCT DETAIL FUNCTIONS
// ============================================================

let detailQuantity = 1;

/**
 * Update quantity on product detail page
 * @param {number} change - The change in quantity (+1 or -1)
 */
function updateQty(change) {
    detailQuantity += change;
    if (detailQuantity < 1) detailQuantity = 1;
    if (detailQuantity > 99) detailQuantity = 99;
    
    const qtyDisplay = document.getElementById('qty-display');
    if (qtyDisplay) qtyDisplay.textContent = detailQuantity;
}

/**
 * Add to cart from detail page
 */
function addToCartDetail() {
    const productId = 1; // This would be dynamic
    addToCart(productId);
}

/**
 * Buy now from detail page
 */
function buyNow() {
    const productId = 1; // This would be dynamic
    addToCart(productId);
    window.location.href = 'checkout.html';
}

/**
 * Add to compare from detail page
 */
function addToCompareDetail() {
    showNotification('Product added to compare list.', 'success');
}

/**
 * Share product
 */
function shareProduct() {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this product!',
            text: 'I found this amazing product on PUT XYZ',
            url: window.location.href
        }).catch(() => {});
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Share this product with your friends!', 'info');
        });
    }
}

// ============================================================
// IMAGE FUNCTIONS
// ============================================================

/**
 * Zoom image
 */
function zoomImage() {
    const modal = document.getElementById('zoom-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close zoom
 */
function closeZoom() {
    const modal = document.getElementById('zoom-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * View 360° rotation
 */
function view360() {
    showNotification('360° view coming soon!', 'info');
}

/**
 * Play product video
 */
function playVideo() {
    showNotification('Product video coming soon!', 'info');
}

// ============================================================
// TAB FUNCTIONS
// ============================================================

/**
 * Switch tabs on product detail page
 * @param {string} tabId - The ID of the tab to activate
 */
function switchTab(tabId) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activate the selected tab
    const tabButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (tabButton) tabButton.classList.add('active');
    
    const tabContent = document.getElementById(`tab-${tabId}`);
    if (tabContent) tabContent.classList.add('active');
}

// ============================================================
// FILTER FUNCTIONS (Products Page)
// ============================================================

/**
 * Toggle filter sidebar on mobile
 */
function toggleFilters() {
    const sidebar = document.querySelector('.filter-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

/**
 * Close filters on mobile
 */
function closeFilters() {
    const sidebar = document.querySelector('.filter-sidebar');
    if (sidebar) {
        sidebar.classList.remove('open');
    }
}

/**
 * Toggle filter group expansion
 * @param {HTMLElement} header - The filter header element
 */
function toggleFilter(header) {
    const options = header.nextElementSibling;
    if (options) {
        options.classList.toggle('hidden');
        header.classList.toggle('open');
    }
}

/**
 * Apply price filter
 */
function applyPriceFilter() {
    const min = document.getElementById('price-min');
    const max = document.getElementById('price-max');
    
    if (min && max) {
        const minVal = min.value || 0;
        const maxVal = max.value || Infinity;
        showNotification(`Filtering products between $${minVal} - $${maxVal}`, 'info');
        applyFilters();
    }
}

/**
 * Set price preset
 * @param {number} min - Minimum price
 * @param {number} max - Maximum price
 */
function setPricePreset(min, max) {
    const minInput = document.getElementById('price-min');
    const maxInput = document.getElementById('price-max');
    
    if (minInput) minInput.value = min;
    if (maxInput) maxInput.value = max === 500 ? '' : max;
    
    applyPriceFilter();
}

/**
 * Apply all filters
 */
function applyFilters() {
    showNotification('Filters applied!', 'success');
    closeFilters();
}

/**
 * Clear all filters
 */
function clearFilters() {
    // Reset checkboxes
    document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Reset price inputs
    const minInput = document.getElementById('price-min');
    const maxInput = document.getElementById('price-max');
    if (minInput) minInput.value = '';
    if (maxInput) maxInput.value = '';
    
    // Reset color buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Reset size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Clear active filters display
    const activeFilters = document.getElementById('active-filters');
    if (activeFilters) {
        activeFilters.innerHTML = '';
    }
    
    showNotification('All filters cleared.', 'info');
}

/**
 * Remove a specific filter
 * @param {HTMLElement} element - The filter tag element
 */
function removeFilter(element) {
    const tag = element.closest('.filter-tag');
    if (tag) {
        tag.remove();
        showNotification('Filter removed.', 'info');
    }
}

// ============================================================
// VIEW FUNCTIONS (Products Page)
// ============================================================

/**
 * Set view mode (grid or list)
 * @param {string} view - The view mode ('grid' or 'list')
 */
function setView(view) {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    
    const gridBtn = document.querySelector('.grid-view');
    const listBtn = document.querySelector('.list-view');
    
    if (view === 'grid') {
        grid.classList.remove('list-view');
        if (gridBtn) gridBtn.classList.add('active');
        if (listBtn) listBtn.classList.remove('active');
    } else {
        grid.classList.add('list-view');
        if (listBtn) listBtn.classList.add('active');
        if (gridBtn) gridBtn.classList.remove('active');
    }
}

/**
 * Sort products
 */
function sortProducts() {
    const select = document.getElementById('sort-select');
    if (!select) return;
    
    const value = select.value;
    const sortMap = {
        'popular': 'Most Popular',
        'newest': 'Newest First',
        'price-low': 'Price: Low to High',
        'price-high': 'Price: High to Low',
        'rating': 'Highest Rated',
        'discount': 'Biggest Discount'
    };
    
    showNotification(`Sorting by: ${sortMap[value] || value}`, 'info');
}

// ============================================================
// DASHBOARD FUNCTIONS
// ============================================================

/**
 * Switch dashboard section
 * @param {string} section - The section to switch to
 */
function switchDashboardSection(section) {
    // Remove active class from all nav items
    document.querySelectorAll('.dashboard-nav li').forEach(li => {
        li.classList.remove('active');
    });
    
    // Remove active class from all content sections
    document.querySelectorAll('.dashboard-section-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activate the selected section
    const navItem = document.querySelector(`.dashboard-nav li[data-section="${section}"]`);
    if (navItem) navItem.classList.add('active');
    
    const contentSection = document.getElementById(`section-${section}`);
    if (contentSection) contentSection.classList.add('active');
}

// ============================================================
// AUTHENTICATION FUNCTIONS
// ============================================================

/**
 * Toggle password visibility
 * @param {string} inputId - The ID of the password input
 * @param {HTMLElement} button - The toggle button
 */
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const icon = button.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

/**
 * Switch login tab
 * @param {string} tab - The tab to switch to ('email', 'username', 'phone')
 */
function switchLoginTab(tab) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Remove active class from all forms
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.remove('active');
    });
    
    // Activate the selected tab
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
    if (tabBtn) tabBtn.classList.add('active');
    
    const formId = `${tab}-login`;
    const form = document.getElementById(formId);
    if (form) form.classList.add('active');
}

/**
 * Request OTP for phone login
 */
function requestOTP() {
    showNotification('OTP sent to your phone number!', 'success');
}

/**
 * Social login
 * @param {string} provider - The social provider name
 */
function socialLogin(provider) {
    showNotification(`Logging in with ${provider}...`, 'info');
    // In a real implementation, this would redirect to OAuth
}

/**
 * Refresh CAPTCHA
 */
function refreshCaptcha() {
    const captchaText = document.getElementById('captcha-text');
    if (!captchaText) return;
    
    // Generate random 6-character CAPTCHA
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    captchaText.textContent = result;
}

/**
 * Validate registration form
 * @param {Event} event - The form submit event
 * @returns {boolean} - Whether the form is valid
 */
function validateRegistration(event) {
    event.preventDefault();
    
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const terms = document.getElementById('terms');
    const captchaInput = document.getElementById('captcha-input');
    const captchaText = document.getElementById('captcha-text');
    
    // Validate password match
    if (password && confirmPassword && password.value !== confirmPassword.value) {
        showNotification('Passwords do not match!', 'error');
        return false;
    }
    
    // Validate password strength
    if (password && password.value.length < 8) {
        showNotification('Password must be at least 8 characters long.', 'error');
        return false;
    }
    
    // Validate terms
    if (terms && !terms.checked) {
        showNotification('Please accept the Terms of Service.', 'error');
        return false;
    }
    
    // Validate CAPTCHA
    if (captchaInput && captchaText) {
        if (captchaInput.value.toUpperCase() !== captchaText.textContent) {
            showNotification('Invalid CAPTCHA. Please try again.', 'error');
            refreshCaptcha();
            captchaInput.value = '';
            return false;
        }
    }
    
    showNotification('Account created successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
    
    return false;
}

/**
 * Verify identity for password reset
 * @param {Event} event - The form submit event
 * @returns {boolean} - Whether the form is valid
 */
function verifyIdentity(event) {
    event.preventDefault();
    
    const email = document.getElementById('reset-email');
    const phone = document.getElementById('reset-phone');
    
    if (email && email.value) {
        showNotification('Verification code sent to your email!', 'success');
    } else if (phone && phone.value) {
        showNotification('Verification code sent to your phone!', 'success');
    } else {
        showNotification('Please enter your email or phone number.', 'error');
        return false;
    }
    
    goToStep(2);
    startOTPTimer();
    return false;
}

/**
 * Verify OTP
 * @param {Event} event - The form submit event
 * @returns {boolean} - Whether the OTP is valid
 */
function verifyOTP(event) {
    event.preventDefault();
    
    const inputs = document.querySelectorAll('.otp-input');
    let otp = '';
    inputs.forEach(input => {
        otp += input.value;
    });
    
    if (otp.length !== 6) {
        showNotification('Please enter the complete 6-digit OTP.', 'error');
        return false;
    }
    
    // Simulate OTP verification
    showNotification('OTP verified successfully!', 'success');
    goToStep(3);
    return false;
}

/**
 * Reset password
 * @param {Event} event - The form submit event
 * @returns {boolean} - Whether the form is valid
 */
function resetPassword(event) {
    event.preventDefault();
    
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-new-password');
    
    if (!newPassword || !confirmPassword) return false;
    
    if (newPassword.value !== confirmPassword.value) {
        showNotification('Passwords do not match!', 'error');
        return false;
    }
    
    if (newPassword.value.length < 8) {
        showNotification('Password must be at least 8 characters long.', 'error');
        return false;
    }
    
    // Show success
    document.querySelectorAll('.forgot-step').forEach(step => {
        step.classList.remove('active');
    });
    
    const successMessage = document.getElementById('success-message');
    if (successMessage) successMessage.style.display = 'block';
    
    showNotification('Password reset successfully!', 'success');
    return false;
}

/**
 * Go to a specific step in forgot password
 * @param {number} step - The step number (1, 2, 3)
 */
function goToStep(step) {
    document.querySelectorAll('.forgot-step').forEach((el, index) => {
        el.classList.toggle('active', index + 1 === step);
    });
}

/**
 * Resend OTP
 */
function resendOTP() {
    showNotification('New OTP sent!', 'success');
    startOTPTimer();
}

/**
 * Start OTP timer
 */
function startOTPTimer() {
    let timeLeft = 30;
    const timerElement = document.getElementById('otp-timer');
    if (!timerElement) return;
    
    timerElement.textContent = '00:30';
    
    const interval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            timerElement.textContent = '00:00';
        }
    }, 1000);
}

/**
 * Move to next OTP input
 * @param {HTMLElement} input - The current input element
 * @param {number} index - The index of the current input
 */
function moveToNext(input, index) {
    const maxLength = parseInt(input.maxLength);
    if (input.value.length >= maxLength) {
        const inputs = document.querySelectorAll('.otp-input');
        const next = inputs[index + 1];
        if (next) next.focus();
    }
}

// ============================================================
// DASHBOARD FUNCTIONS
// ============================================================

/**
 * Edit profile
 */
function editProfile() {
    showNotification('Profile edit mode enabled!', 'info');
}

/**
 * Change password from dashboard
 */
function changePassword() {
    showNotification('Change password dialog opened.', 'info');
}

/**
 * Delete account
 */
function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        showNotification('Account deletion request submitted.', 'info');
    }
}

/**
 * Enable two-factor authentication
 */
function enable2FA() {
    showNotification('Two-factor authentication setup initiated.', 'info');
}

// ============================================================
// NOTIFICATION SYSTEM
// ============================================================

/**
 * Show a notification toast
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, if not create it
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 380px;
            width: 100%;
        `;
        document.body.appendChild(container);
    }
    
    const colors = {
        success: '#34C759',
        error: '#FF3B30',
        warning: '#FF9500',
        info: '#0066FF'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.style.cssText = `
        background: var(--white);
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        border-left: 4px solid ${colors[type] || colors.info};
        animation: slideIn 0.3s ease;
        font-family: 'Open Sans', sans-serif;
    `;
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}" style="color: ${colors[type] || colors.info}; font-size: 20px;"></i>
        <span style="flex: 1; font-size: 14px; color: var(--gray-800);">${message}</span>
        <button style="background: transparent; border: none; color: var(--gray-400); font-size: 16px; cursor: pointer; padding: 4px;" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 4000);
}

// Inject notification animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(40px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(40px);
        }
    }
`;
document.head.appendChild(styleSheet);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Generate star rating HTML
 * @param {number} rating - The rating value (0-5)
 * @returns {string} - HTML string of stars
 */
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let html = '';
    
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    return html;
}

/**
 * Get product description by ID
 * @param {number} productId - The ID of the product
 * @returns {string} - The product description
 */
function getProductDescription(productId) {
    const descriptions = {
        1: 'Premium noise-canceling headphones with 40hr battery life, comfortable ear cushions, and superior sound quality.',
        2: 'Advanced fitness tracker with GPS, heart rate monitor, and 7-day battery life. Perfect for active lifestyles.',
        3: 'Handcrafted genuine leather backpack with 15-inch laptop compartment and premium hardware.'
    };
    return descriptions[productId] || 'High-quality product designed for exceptional performance and durability.';
}

/**
 * Open product detail page in new tab
 * @param {number} productId - The ID of the product
 */
function openProductDetail(productId) {
    window.open(`product-detail.html?id=${productId}`, '_blank');
}

/**
 * Add to compare from product page
 * @param {number} productId - The ID of the product
 */
function addToCompare(productId) {
    showNotification('Product added to compare list.', 'success');
}

/**
 * Password strength checker
 * @param {string} password - The password to check
 * @returns {object} - Strength score and label
 */
function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    const levels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const level = Math.min(score, 4);
    
    return {
        score: level,
        label: levels[level],
        progress: (level / 4) * 100
    };
}

/**
 * Update password strength indicator
 * @param {string} inputId - The ID of the password input
 */
function updatePasswordStrength(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const progress = document.getElementById('reset-strength-progress') || document.getElementById('strength-progress');
    const text = document.getElementById('reset-strength-text') || document.getElementById('strength-text');
    
    if (!progress || !text) return;
    
    const strength = checkPasswordStrength(input.value);
    
    progress.style.width = `${strength.progress}%`;
    progress.className = 'strength-progress';
    
    if (strength.score <= 1) {
        progress.classList.add('weak');
        text.textContent = 'Weak - Add more characters, numbers, and symbols';
        text.style.color = '#FF3B30';
    } else if (strength.score === 2) {
        progress.classList.add('fair');
        text.textContent = 'Fair - Add uppercase letters and symbols';
        text.style.color = '#FF9500';
    } else if (strength.score === 3) {
        progress.classList.add('good');
        text.textContent = 'Good - Add more complexity';
        text.style.color = '#0066FF';
    } else if (strength.score >= 4) {
        progress.classList.add('strong');
        text.textContent = 'Strong - Great password!';
        text.style.color = '#34C759';
    } else {
        text.textContent = 'Enter a strong password';
        text.style.color = '#6B7280';
    }
}

// ============================================================
// LOCAL STORAGE FUNCTIONS
// ============================================================

/**
 * Save cart to localStorage
 */
function saveCartToStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
        localStorage.setItem('appliedCoupons', JSON.stringify(appliedCoupons));
        localStorage.setItem('appliedGiftCards', JSON.stringify(appliedGiftCards));
        localStorage.setItem('selectedShipping', selectedShipping);
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

/**
 * Load cart from localStorage
 */
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        const savedItems = localStorage.getItem('savedForLater');
        const savedCoupons = localStorage.getItem('appliedCoupons');
        const savedGiftCards = localStorage.getItem('appliedGiftCards');
        const savedShipping = localStorage.getItem('selectedShipping');
        
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                cart = parsedCart;
            }
        }
        
        if (savedItems) {
            const parsedItems = JSON.parse(savedItems);
            if (Array.isArray(parsedItems)) {
                savedForLater = parsedItems;
            }
        }
        
        if (savedCoupons) {
            const parsedCoupons = JSON.parse(savedCoupons);
            if (Array.isArray(parsedCoupons)) {
                appliedCoupons = parsedCoupons;
            }
        }
        
        if (savedGiftCards) {
            const parsedGiftCards = JSON.parse(savedGiftCards);
            if (Array.isArray(parsedGiftCards)) {
                appliedGiftCards = parsedGiftCards;
            }
        }
        
        if (savedShipping) {
            selectedShipping = savedShipping;
        }
    } catch (e) {
        console.warn('Could not load from localStorage:', e);
    }
}

/**
 * Save wishlist to localStorage
 */
function saveWishlistToStorage() {
    try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (e) {
        console.warn('Could not save wishlist to localStorage:', e);
    }
}

/**
 * Load wishlist from localStorage
 */
function loadWishlistFromStorage() {
    try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            const parsed = JSON.parse(savedWishlist);
            if (Array.isArray(parsed)) {
                wishlist = parsed;
            }
        }
    } catch (e) {
        console.warn('Could not load wishlist from localStorage:', e);
    }
}

// ============================================================
// DASHBOARD NAVIGATION EVENTS
// ============================================================

// Initialize dashboard navigation if on dashboard page
document.addEventListener('DOMContentLoaded', function() {
    // Dashboard navigation
    document.querySelectorAll('.dashboard-nav li[data-section]').forEach(li => {
        li.addEventListener('click', function() {
            const section = this.dataset.section;
            if (section === 'logout') {
                if (confirm('Are you sure you want to logout?')) {
                    showNotification('Logged out successfully.', 'info');
                    window.location.href = 'index.html';
                }
                return;
            }
            switchDashboardSection(section);
        });
    });
    
    // Product detail tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            if (tab) switchTab(tab);
        });
    });
    
    // Password strength monitoring
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength('password');
        });
    }
    
    const resetPasswordInput = document.getElementById('new-password');
    if (resetPasswordInput) {
        resetPasswordInput.addEventListener('input', function() {
            updatePasswordStrength('new-password');
        });
    }
    
    // Load state from storage
    loadCartFromStorage();
    loadWishlistFromStorage();
    
    // Update UI
    updateCartBadge();
    updateCartDisplay();
    updateCartTotal();
    updateSavedForLater();
    
    // Update wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const card = btn.closest('.product-card');
        if (card) {
            const id = parseInt(card.dataset.id);
            if (wishlist.includes(id)) {
                btn.querySelector('i').className = 'fas fa-heart';
                btn.classList.add('active');
            }
        }
    });
    
    // Click outside to close filters
    document.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.filter-sidebar');
        const toggle = document.querySelector('.filter-toggle');
        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    // Close quick view on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeQuickView();
            closeZoom();
        }
    });
});

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener('keydown', function(e) {
    // Ctrl + / to toggle search focus
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) searchInput.focus();
    }
});

// ============================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================

// Lazy load images when they come into view
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                if (src) {
                    img.src = src;
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================================
// CONSOLE WELCOME MESSAGE
// ============================================================

console.log('%c🛍️ PUT XYZ - Premium E-Commerce', 'font-size: 24px; font-weight: bold; color: #0066FF;');
console.log('%cWelcome to the PUT XYZ website!', 'font-size: 14px; color: #333;');
console.log('%cExplore our curated collection of premium products.', 'font-size: 14px; color: #666;');

// ============================================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================

// Make functions globally accessible for onclick handlers
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.saveForLater = saveForLater;
window.moveToCart = moveToCart;
window.removeFromSaved = removeFromSaved;
window.toggleSelectAll = toggleSelectAll;
window.clearCart = clearCart;
window.updateCartTotal = updateCartTotal;
window.proceedToCheckout = proceedToCheckout;
window.applyCoupon = applyCoupon;
window.applyCouponCode = applyCouponCode;
window.applyGiftCard = applyGiftCard;
window.updateShipping = updateShipping;
window.toggleWishlist = toggleWishlist;
window.toggleWishlistDetail = toggleWishlistDetail;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.updateQuantity = updateQuantity;
window.addToCartFromQuickView = addToCartFromQuickView;
window.buyNowFromQuickView = buyNowFromQuickView;
window.updateQty = updateQty;
window.addToCartDetail = addToCartDetail;
window.buyNow = buyNow;
window.addToCompareDetail = addToCompareDetail;
window.shareProduct = shareProduct;
window.zoomImage = zoomImage;
window.closeZoom = closeZoom;
window.view360 = view360;
window.playVideo = playVideo;
window.switchTab = switchTab;
window.toggleFilters = toggleFilters;
window.closeFilters = closeFilters;
window.toggleFilter = toggleFilter;
window.applyPriceFilter = applyPriceFilter;
window.setPricePreset = setPricePreset;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.removeFilter = removeFilter;
window.setView = setView;
window.sortProducts = sortProducts;
window.switchDashboardSection = switchDashboardSection;
window.togglePassword = togglePassword;
window.switchLoginTab = switchLoginTab;
window.requestOTP = requestOTP;
window.socialLogin = socialLogin;
window.refreshCaptcha = refreshCaptcha;
window.validateRegistration = validateRegistration;
window.verifyIdentity = verifyIdentity;
window.verifyOTP = verifyOTP;
window.resetPassword = resetPassword;
window.goToStep = goToStep;
window.resendOTP = resendOTP;
window.moveToNext = moveToNext;
window.editProfile = editProfile;
window.changePassword = changePassword;
window.deleteAccount = deleteAccount;
window.enable2FA = enable2FA;
window.openProductDetail = openProductDetail;
window.addToCompare = addToCompare;
window.showNotification = showNotification;

console.log('%c✅ All scripts loaded successfully!', 'font-size: 14px; color: #34C759;');