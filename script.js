document.addEventListener('DOMContentLoaded', function() {
    // Sample product data (in a real app, this would come from a database or API)
    const products = [
        { id: 1, name: 'Amoxicillin 250mg', price: 120, expiry: '2024-12-31', quantity: 50, isSample: false },
        { id: 2, name: 'Doxycycline 100mg', price: 180, expiry: '2024-10-15', quantity: 30, isSample: true },
        { id: 3, name: 'Ivermectin 1%', price: 250, expiry: '2025-05-20', quantity: 20, isSample: false },
        { id: 4, name: 'Vitamin B Complex', price: 150, expiry: '2024-08-30', quantity: 45, isSample: false },
        { id: 5, name: 'Calcium Borogluconate', price: 320, expiry: '2025-02-28', quantity: 15, isSample: true },
        { id: 6, name: 'Deworming Syrup', price: 95, expiry: '2024-09-10', quantity: 60, isSample: false },
        { id: 7, name: 'Antiseptic Lotion', price: 75, expiry: '2026-01-15', quantity: 25, isSample: false },
        { id: 8, name: 'Pain Relief Injection', price: 210, expiry: '2024-11-05', quantity: 18, isSample: true },
    ];

    // DOM Elements
    const productList = document.getElementById('product-list');
    const sampleList = document.getElementById('sample-list');
    const expiryList = document.getElementById('expiry-list');
    const totalCount = document.getElementById('total-count');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const tabLinks = document.querySelectorAll('.sidebar-menu li[data-tab]');
    const refreshBtn = document.getElementById('refresh-btn');

    // Initialize the page
    renderProducts();
    updateTotalCount();

    // Tab switching functionality
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Search functionality
    searchBtn.addEventListener('click', searchProducts);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });

    // Refresh button (for add-prices page)
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            alert('Products refreshed! In a real app, this would sync with your Google Sheet.');
        });
    }

    // Functions
    function renderProducts() {
        // Clear existing products
        productList.innerHTML = '';
        sampleList.innerHTML = '';
        expiryList.innerHTML = '';

        // Get current date for expiry comparison
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Render all products
        products.forEach(product => {
            const expiryDate = new Date(product.expiry);
            const timeDiff = expiryDate - currentDate;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            const productCard = createProductCard(product, daysDiff);
            productList.appendChild(productCard);

            // Add to sample list if it's a sample
            if (product.isSample) {
                const sampleCard = createProductCard(product, daysDiff);
                sampleList.appendChild(sampleCard);
            }

            // Add to expiry list if expiry is within 60 days
            if (daysDiff <= 60) {
                const expiryCard = createProductCard(product, daysDiff);
                expiryList.appendChild(expiryCard);
            }
        });
    }

    function createProductCard(product, daysDiff) {
        const card = document.createElement('div');
        card.className = 'product-card';

        const expiryClass = daysDiff <= 30 ? 'warning' : '';

        card.innerHTML = `
            <div class="product-name">${product.name}</div>
            <div class="product-price">₹${product.price}</div>
            <div class="product-quantity">Qty: ${product.quantity}</div>
            <div class="product-expiry ${expiryClass}">
                Expiry: ${formatDate(product.expiry)} (${daysDiff} days)
            </div>
        `;

        return card;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function updateTotalCount() {
        totalCount.textContent = products.length;
    }

    function switchTab(tabId) {
        // Update active tab in sidebar
        tabLinks.forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`.sidebar-menu li[data-tab="${tabId}"]`).classList.add('active');

        // Show the selected tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
    }

    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (!searchTerm) {
            renderProducts();
            return;
        }

        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );

        productList.innerHTML = '';
        filteredProducts.forEach(product => {
            const expiryDate = new Date(product.expiry);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const timeDiff = expiryDate - currentDate;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            const productCard = createProductCard(product, daysDiff);
            productList.appendChild(productCard);
        });
    }
});