document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    const orderSummaryItems = document.getElementById('order-summary-items');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryDiscount = document.getElementById('summary-discount');
    const summaryTotal = document.getElementById('summary-total');
    const itemSelect = document.getElementById('item-select');
    const discountCodeInput = document.getElementById('discount-code');
    const applyDiscountBtn = document.getElementById('apply-discount-btn');
    const discountMessage = document.getElementById('discount-message');

    // --- Website Content: Plans and Courses ---
    const websiteItems = {
        '--': { name: 'Select an item', price: 0, image: '' },
        'branding': { name: 'Branding & Identity', price: 1500, image: 'https://via.placeholder.com/64' },
        'design': { name: 'Web Design & Development', price: 2500, image: 'https://via.placeholder.com/64' },
        'digital-experience': { name: 'Digital Experience', price: 3500, image: 'https://via.placeholder.com/64' },
        'design-fundamentals': { name: 'Design Fundamentals', price: 299, image: 'https://via.placeholder.com/64' },
        'branding-mastery': { name: 'Branding Mastery', price: 499, image: 'https://via.placeholder.com/64' },
        'ui-ux-design': { name: 'UI/UX Design', price: 399, image: 'https://via.placeholder.com/64' },
        'web-design': { name: 'Web Design', price: 399, image: 'https://via.placeholder.com/64' },
    };

    // --- Discount Codes ---
    const discountCodes = {
        'SAVE10': 0.10,
        'GEMINI20': 0.20,
    };

    let currentDiscount = 0;

    // --- Populate Dropdown ---
    function populateDropdown() {
        for (const itemId in websiteItems) {
            const item = websiteItems[itemId];
            const option = document.createElement('option');
            option.value = itemId;
            option.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            itemSelect.appendChild(option);
        }
    }

    // --- Get Selected Item ---
    function getSelectedItem() {
        const selectedId = itemSelect.value;
        if (selectedId && selectedId !== '--') {
            return { ...websiteItems[selectedId], quantity: 1 };
        }
        const params = new URLSearchParams(window.location.search);
        const itemId = params.get('item');
        if (itemId && websiteItems[itemId]) {
            itemSelect.value = itemId;
            return { ...websiteItems[itemId], quantity: 1 };
        }
        return null;
    }

    // --- Populate Order Summary ---
    function populateOrderSummary() {
        const selectedItem = getSelectedItem();
        orderSummaryItems.innerHTML = '';

        if (selectedItem) {
            const itemElement = document.createElement('div');
            itemElement.classList.add('order-item');
            itemElement.innerHTML = `
                <img src="${selectedItem.image}" alt="${selectedItem.name}" class="order-item-image">
                <div class="order-item-details">
                    <p class="order-item-name">${selectedItem.name}</p>
                </div>
                <p class="order-item-price">$${selectedItem.price.toFixed(2)}</p>
            `;
            orderSummaryItems.appendChild(itemElement);

            updateTotal();
        } else {
            orderSummaryItems.innerHTML = '<p class="text-center text-gray-500">Your cart is empty. Please select an item from our website.</p>';
            updateTotal();
        }
    }

    // --- Update Total ---
    function updateTotal() {
        const selectedItem = getSelectedItem();
        const subtotal = selectedItem ? selectedItem.price : 0;
        const shipping = 0;
        const discountAmount = subtotal * currentDiscount;
        const total = subtotal - discountAmount + shipping;

        summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        summaryShipping.textContent = `$${shipping.toFixed(2)}`;
        summaryDiscount.textContent = `-$${discountAmount.toFixed(2)}`;
        summaryTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // --- Event Listeners ---
    itemSelect.addEventListener('change', () => {
        currentDiscount = 0;
        discountCodeInput.value = '';
        discountMessage.textContent = '';
        populateOrderSummary();
    });
    applyDiscountBtn.addEventListener('click', () => {
        const code = discountCodeInput.value.toUpperCase();
        if (discountCodes[code]) {
            currentDiscount = discountCodes[code];
            discountMessage.textContent = `Discount of ${currentDiscount * 100}% applied!`;
            discountMessage.classList.remove('text-red-500');
            discountMessage.classList.add('text-green-500');
        } else {
            currentDiscount = 0;
            discountMessage.textContent = 'Invalid discount code.';
            discountMessage.classList.remove('text-green-500');
            discountMessage.classList.add('text-red-500');
        }
        updateTotal();
    });

    // --- Input Formatting with Cleave.js ---
    new Cleave('#card-number', { creditCard: true });
    new Cleave('#expiry-date', { date: true, datePattern: ['m', 'y'] });
    new Cleave('#cvc', { numericOnly: true, blocks: [3] });

    // --- Live Validation ---
    const fieldsToValidate = ['first-name', 'last-name', 'email', 'address', 'city', 'state', 'zip', 'card-number', 'expiry-date', 'cvc'];
    fieldsToValidate.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        input.addEventListener('input', () => validateField(input));
    });

    function validateField(input) {
        const errorElement = input.nextElementSibling;
        if (input.value.trim() === '') {
            input.classList.add('is-invalid');
            if (!errorElement || !errorElement.classList.contains('error-message')) {
                const errorMessage = document.createElement('p');
                errorMessage.className = 'error-message text-red-500 text-sm mt-1';
                errorMessage.textContent = `${input.previousElementSibling.textContent} is required.`;
                input.parentNode.insertBefore(errorMessage, input.nextSibling);
            }
        } else {
            input.classList.remove('is-invalid');
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
        }
    }

    // --- Form Submission ---
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;
        fieldsToValidate.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            validateField(input);
            if (input.classList.contains('is-invalid')) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            alert('Order placed successfully!');
        }
    });

    // --- Initialize ---
    populateDropdown();
    populateOrderSummary();
});
