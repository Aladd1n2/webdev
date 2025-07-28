document.addEventListener('DOMContentLoaded', () => {
    // Product data with local images and INR currency
    const products = [
        {
            id: 1,
            name: 'Petal Pink Princess Gown',
            price: '2499',
            image: 'product images/Petal Pink Princess Gown.jpg'
        },
        {
            id: 2,
            name: 'Rose Gold Sharara Set',
            price: '3299',
            image: 'product images/Rose Gold Sharara Set.jpg'
        },
        {
            id: 3,
            name: 'Ruby Red Satin Frock',
            price: '2799',
            image: 'product images/Ruby Red Satin Frock.jpg'
        }
    ];

    // Cart data
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const updateCartButton = (productId, productItem) => {
        const buttonContainer = productItem.querySelector('.add-to-cart-container');
        if (cart[productId] && cart[productId] > 0) {
            buttonContainer.innerHTML = `
                <button class="quantity-btn minus-btn" data-id="${productId}">-</button>
                <span class="quantity">${cart[productId]}</span>
                <button class="quantity-btn plus-btn" data-id="${productId}">+</button>
            `;
        } else {
            buttonContainer.innerHTML = `
                <a href="#" class="btn add-to-cart-btn" data-id="${productId}">Add to Cart</a>
            `;
        }
    };

    // Populate product grid
    const productGrid = document.querySelector('.product-grid');
    const sortBy = document.getElementById('sort-by');

    const populateProducts = (sortedProducts) => {
        productGrid.innerHTML = '';
        sortedProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price}</p>
                <div class="add-to-cart-container"></div>
            `;
            productGrid.appendChild(productItem);
            updateCartButton(product.id, productItem);
        });
    };

    const sortProducts = () => {
        const sortValue = sortBy.value;
        let sortedProducts = [...products];

        switch (sortValue) {
            case 'name-asc':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
        }

        populateProducts(sortedProducts);
    };

    if (productGrid) {
        sortProducts();
        sortBy.addEventListener('change', sortProducts);

        productGrid.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('add-to-cart-btn')) {
                e.preventDefault();
                const productId = target.dataset.id;
                cart[productId] = 1;
                saveCart();
                updateCartButton(productId, target.closest('.product-item'));
            } else if (target.classList.contains('plus-btn')) {
                const productId = target.dataset.id;
                cart[productId]++;
                saveCart();
                updateCartButton(productId, target.closest('.product-item'));
            } else if (target.classList.contains('minus-btn')) {
                const productId = target.dataset.id;
                cart[productId]--;
                if (cart[productId] <= 0) {
                    delete cart[productId];
                }
                saveCart();
                updateCartButton(productId, target.closest('.product-item'));
            }
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    const applyTheme = (theme) => {
        if (theme === 'dark-mode') {
            body.classList.add('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            body.classList.remove('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Sidebar functionality
    const cartIcon = document.querySelector('.fa-shopping-bag').parentElement;
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const cartItemsContainer = document.getElementById('cart-items');

    const openSidebar = () => {
        cartSidebar.classList.add('open');
        sidebarOverlay.classList.add('open');
        populateCart();
    };

    const closeSidebar = () => {
        cartSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('open');
    };

    const populateCart = () => {
        cartItemsContainer.innerHTML = '';
        if (Object.keys(cart).length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        products.forEach(product => {
            if (cart[product.id]) {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="cart-item-details">
                        <h3>${product.name}</h3>
                        <p class="price">₹${product.price} x ${cart[product.id]}</p>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            }
        });
    };

    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openSidebar();
    });

    closeCart.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    // Hamburger menu functionality
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const mobileNav = document.getElementById('mobile-nav');

    hamburgerIcon.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });

    // Search bar functionality
    const searchIcon = document.getElementById('search-icon');
    const searchBar = document.getElementById('search-bar');

    searchIcon.addEventListener('click', () => {
        searchBar.classList.toggle('active');
    });

    // WhatsApp ordering
    const whatsappOrderBtn = document.getElementById('whatsapp-order');
    whatsappOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let message = 'Hello, I would like to order the following items:\n\n';
        let totalPrice = 0;

        products.forEach(product => {
            if (cart[product.id]) {
                message += `${product.name} (x${cart[product.id]}) - ₹${product.price * cart[product.id]}\n`;
                totalPrice += product.price * cart[product.id];
            }
        });

        message += `\nTotal Price: ₹${totalPrice}`;

        // Replace with your WhatsApp number
        const whatsappNumber = 'YOUR_WHATSAPP_NUMBER';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
});
