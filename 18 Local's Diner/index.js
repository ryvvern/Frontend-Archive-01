import { menuArray } from "./data.js";

const itemsContainer = document.querySelector('.items')
const cartSection = document.querySelector('.cart-section')
const cartItemsContainer = document.querySelector('.cart-items')
const successSection = document.querySelector('.success-section')
const modal = document.getElementById('payment-modal');
const contentDiv = modal.querySelector('.modal-content');

let cart = []

menuArray.forEach((item, index) => {
    const foodItem = document.createElement('div')
    foodItem.classList.add('food-card')
    foodItem.innerHTML = `
        <img src='${item.image}' class='food-image' width='40px'>
        <div class='food-info'>
            <h2>${item.name}</h2>
            <p>${item.ingredients.join(", ")}</p>
            <p class='item-price'>$${item.price}</p>
        </div>
        <div class='cart-btn-container'>
            <button class='add-to-cart-btn' data-index='${index}'>
                <i class="fa-solid fa-cart-plus"></i>
            </button>
        </div>
    `
    itemsContainer.appendChild(foodItem)
})

// Add event listener to the container and use event delegation
itemsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart-btn')) {
        const button = e.target.closest('.add-to-cart-btn')
        const itemIndex = parseInt(button.getAttribute('data-index'))
        const item = menuArray[itemIndex]
        
        // Add item to cart
        cart.push(item)
        
        // Show cart section
        cartSection.classList.remove('hidden')
        successSection.classList.add('hidden')
        
        // Update cart display
        updateCartDisplay()
    }
})

function updateCartDisplay() {
    cartItemsContainer.innerHTML = ''
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>'
        return
    }
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item')
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price}</span>
            <button class='remove-btn' data-cart-index='${index}'>Remove</button>
        `
        cartItemsContainer.appendChild(cartItem)
    })
    
    // Add total and checkout button
    const total = cart.reduce((sum, item) => sum + item.price, 0)
    const totalDiv = document.createElement('div')
    totalDiv.classList.add('cart-total')
    totalDiv.innerHTML = `
        <strong>Total: $${total.toFixed(2)}</strong>
        <button class="checkout-btn">Checkout</button>
    `
    cartItemsContainer.appendChild(totalDiv)
}

// Handle remove from cart
cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
        const cartIndex = parseInt(e.target.getAttribute('data-cart-index'))
        cart.splice(cartIndex, 1)
        updateCartDisplay()
        
        // Hide cart if empty
        if (cart.length === 0) {
            cartSection.classList.add('hidden')
        }
    }
})

// Handle checkout button click using event delegation
cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('checkout-btn')) {
        buildPaymentForm()
        modal.classList.remove('hidden')
    }
})

// Format card number as user types
function formatCardNumber(value) {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
        return parts.join(' ')
    } return v
}

// Validate individual fields
function validateField(field, value) {
    const errorElement = field.parentNode.querySelector('.error-message')
    
    // Remove existing error message
    if (errorElement) {
        errorElement.remove()
    }
    
    let isValid = true
    let errorMessage = ''
    
    switch (field.id) {
        case 'name':
            if (!value.trim()) {
                isValid = false
                errorMessage = 'Name is required'
            }
            break
        case 'card-number':
            const cardOnly = value.replace(/\s+/g, '')
            if (!/^\d{16}$/.test(cardOnly)) {
                isValid = false
                errorMessage = 'Card number must be 16 digits'
            }
            break
        case 'cvv':
            if (!/^\d{3}$/.test(value)) {
                isValid = false
                errorMessage = 'CVV must be 3 digits'
            }
            break
    }
    
    if (!isValid) {
        field.classList.add('error')
        const errorDiv = document.createElement('div')
        errorDiv.className = 'error-message'
        errorDiv.textContent = errorMessage
        field.parentNode.appendChild(errorDiv)
    } else {
        field.classList.remove('error')
    }
    
    return isValid
}

// Build payment form - only when needed
function buildPaymentForm() {
    contentDiv.innerHTML = `
        <button class="close-btn">&times;</button>
        <h3>Enter Card Details</h3>
        <form id="payment-form">
            <div class="form-group">
                <label for="name">Cardholder Name</label>
                <input type="text" id="name" placeholder="Enter full name" required>
            </div>
            <div class="form-group">
                <label for="card-number">Card Number</label>
                <input type="text" id="card-number" placeholder="XXXX XXXX XXXX XXXX" maxlength="19" required>
            </div>
            <div class="form-group">
                <label for="cvv">CVV</label>
                <input type="text" id="cvv" placeholder="123" maxlength="3" required>
            </div>
            <button type="submit" class="pay-btn">Pay</button>
        </form>
    `
    
    // Add event listeners after creating the form
    setupFormEventListeners()
}

function setupFormEventListeners() {
    const paymentForm = document.getElementById('payment-form')
    const cardNumberInput = document.getElementById('card-number')
    const cvvInput = document.getElementById('cvv')
    const nameInput = document.getElementById('name')
    const allInputs = [nameInput, cardNumberInput, cvvInput]
    
    // Card number formatting
    cardNumberInput.addEventListener('input', (e) => {
        e.target.value = formatCardNumber(e.target.value)
    })
    
    // CVV input restriction
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '')
    })
    
    // Real-time validation
    allInputs.forEach(input => {
        input.addEventListener('blur', (e) => {
            validateField(e.target, e.target.value)
        })
        
        input.addEventListener('input', (e) => {
            // Remove error styling on input
            e.target.classList.remove('error')
            const errorElement = e.target.parentNode.querySelector('.error-message')
            if (errorElement) {
                errorElement.remove()
            }
        })
    })
    
    // Form validation & submit handler
    paymentForm.addEventListener('submit', e => {
        e.preventDefault()

        const name = paymentForm.name.value.trim()
        const cardNumber = paymentForm['card-number'].value.replace(/\s+/g, '')
        const cvv = paymentForm.cvv.value.trim()

        // Validate all fields
        const isNameValid = validateField(nameInput, name)
        const isCardValid = validateField(cardNumberInput, paymentForm['card-number'].value)
        const isCvvValid = validateField(cvvInput, cvv)

        if (isNameValid && isCardValid && isCvvValid) {
            // Hide modal and cart, show success message
            modal.classList.add('hidden')
            cartSection.classList.add('hidden')
            successSection.classList.remove('hidden')
            
            // Clear cart
            cart = []
            
            // Reset form
            paymentForm.reset()
            
            // Remove any error styling
            allInputs.forEach(input => {
                input.classList.remove('error')
                const errorElement = input.parentNode.querySelector('.error-message')
                if (errorElement) {
                    errorElement.remove()
                }
            })
        }
    })
}

// Close modal when clicking outside or on close button
modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('close-btn')) {
        modal.classList.add('hidden')
    }
})

// Prevent modal from closing when clicking inside the modal content
contentDiv.addEventListener('click', (e) => {
    e.stopPropagation()
})

// Continue shopping button
document.querySelector('.continue-shopping-btn').addEventListener('click', () => {
    successSection.classList.add('hidden')
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
})