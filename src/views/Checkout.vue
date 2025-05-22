<template>
  <div class="checkout-page">
    <header class="page-header">
      <h1><span class="golden-accent">Golden</span> Ticket Checkout</h1>
      <p class="page-subtitle">Complete your booking to receive your Golden Tickets</p>
    </header>
    
    <div v-if="cartItems.length === 0" class="empty-cart">
      <div class="empty-cart-content">
        <i class="pi pi-shopping-cart empty-cart-icon"></i>
        <h2>Your Cart is Empty</h2>
        <p>You haven't added any tour tickets to your cart yet.</p>
        <router-link to="/tours" class="browse-tours-btn">Browse Available Tours</router-link>
      </div>
    </div>
    
    <div v-else class="checkout-container">
      <div class="cart-items-section">
        <h2>Your Cart</h2>
        
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-details">
              <h3 class="item-tour">{{ item.tourName }}</h3>
              <div class="item-info">
                <div class="info-row">
                  <i class="pi pi-calendar"></i>
                  <span>{{ formatDate(item.date) }}</span>
                </div>
                <div class="info-row">
                  <i class="pi pi-ticket"></i>
                  <span>{{ item.seat }}</span>
                </div>
              </div>
            </div>
            
            <div class="item-price">
              {{ item.price }} Golden Coins
            </div>
            
            <button class="remove-item-btn" @click="removeFromCart(item.id)">
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
        
        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>{{ cartTotal }} Golden Coins</span>
          </div>
          <div class="summary-row">
            <span>Service Fee:</span>
            <span>{{ serviceFee }} Golden Coins</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>{{ totalPrice }} Golden Coins</span>
          </div>
        </div>
      </div>
      
      <div class="checkout-form-section">
        <h2>Visitor Information</h2>
        
        <form @submit.prevent="submitCheckout" class="checkout-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              id="name" 
              v-model="userInfo.name" 
              type="text" 
              required
              @input="trackFormField('name')"
            >
          </div>
          
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              id="email" 
              v-model="userInfo.email" 
              type="email" 
              required
              @input="trackFormField('email')"
            >
          </div>
          
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              id="phone" 
              v-model="userInfo.phone" 
              type="tel"
              @input="trackFormField('phone')"
            >
          </div>
          
          <div class="form-group">
            <label for="specialRequests">Special Requests (Optional)</label>
            <textarea 
              id="specialRequests" 
              v-model="userInfo.specialRequests"
              rows="4"
              @input="trackFormField('specialRequests')"
            ></textarea>
          </div>
          
          <div class="payment-section">
            <h3>Payment Method</h3>
            <div class="payment-options">
              <label class="payment-option">
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="credit" 
                  name="payment" 
                  checked
                  @change="trackPaymentMethod('credit')"
                >
                <span class="payment-label">
                  <i class="pi pi-credit-card"></i>
                  Credit Card
                </span>
              </label>
              
              <label class="payment-option">
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="paypal" 
                  name="payment"
                  @change="trackPaymentMethod('paypal')"
                >
                <span class="payment-label">
                  <i class="pi pi-paypal"></i>
                  PayPal
                </span>
              </label>
              
              <label class="payment-option">
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="golden" 
                  name="payment"
                  @change="trackPaymentMethod('golden')"
                >
                <span class="payment-label">
                  <i class="pi pi-ticket"></i>
                  Golden Coin Transfer
                </span>
              </label>
            </div>
            
            <div class="card-details" v-if="paymentMethod === 'credit'">
              <div class="form-group">
                <label for="cardNumber">Card Number</label>
                <input 
                  id="cardNumber" 
                  v-model="paymentDetails.cardNumber" 
                  type="text" 
                  placeholder="1234 5678 9012 3456"
                  @input="trackFormField('cardNumber')"
                >
              </div>
              
              <div class="form-row">
                <div class="form-group half">
                  <label for="expiry">Expiry Date</label>
                  <input 
                    id="expiry" 
                    v-model="paymentDetails.expiry" 
                    type="text" 
                    placeholder="MM/YY"
                    @input="trackFormField('expiry')"
                  >
                </div>
                <div class="form-group half">
                  <label for="cvv">CVV</label>
                  <input 
                    id="cvv" 
                    v-model="paymentDetails.cvv" 
                    type="text" 
                    placeholder="123"
                    @input="trackFormField('cvv')"
                  >
                </div>
              </div>
            </div>
          </div>
          
          <div class="terms-section">
            <label class="terms-checkbox">
              <input type="checkbox" v-model="termsAccepted" required>
              <span>I accept the <a href="#" @click.prevent="showTerms">Terms and Conditions</a></span>
            </label>
          </div>
          
          <button type="submit" class="checkout-button" :disabled="!termsAccepted || isProcessing">
            <span v-if="isProcessing">Processing...</span>
            <span v-else>Complete Purchase</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTicketStore } from '../stores/ticketStore';

const router = useRouter();
const store = useTicketStore();

const cartItems = computed(() => store.cart);
const cartTotal = computed(() => store.cartTotal);
const serviceFee = computed(() => Math.round(cartTotal.value * 0.1));
const totalPrice = computed(() => cartTotal.value + serviceFee.value);

const userInfo = ref({
  name: '',
  email: '',
  phone: '',
  specialRequests: ''
});

const paymentMethod = ref('credit');
const paymentDetails = ref({
  cardNumber: '',
  expiry: '',
  cvv: ''
});

const termsAccepted = ref(false);
const isProcessing = ref(false);

onMounted(() => {
  // Track page view
  if (window.pendo) {
    window.pendo.track('Checkout Viewed', { 
      cartItemCount: cartItems.value.length,
      cartTotal: cartTotal.value
    });
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

const removeFromCart = (itemId) => {
  store.removeFromCart(itemId);
  
  // Track cart item removal
  if (window.pendo) {
    window.pendo.track('Removed From Cart', { itemId });
  }
};

const trackFormField = (fieldName) => {
  if (window.pendo) {
    window.pendo.track('Form Field Interaction', { field: fieldName });
  }
};

const trackPaymentMethod = (method) => {
  if (window.pendo) {
    window.pendo.track('Payment Method Selected', { method });
  }
};

const showTerms = () => {
  // In a real app, this would show a modal with terms
  alert('Terms and Conditions for Golden Ticket Booking would be displayed here.');
  
  if (window.pendo) {
    window.pendo.track('Terms Viewed');
  }
};

const submitCheckout = () => {
  isProcessing.value = true;
  
  // Simulate payment processing
  setTimeout(() => {
    // Complete the purchase
    store.checkout({
      name: userInfo.value.name,
      email: userInfo.value.email,
      phone: userInfo.value.phone
    });
    
    isProcessing.value = false;
    
    // Navigate to success page (in this case, the my tickets page)
    router.push('/my-tickets');
  }, 2000);
};
</script>

<style scoped>
.checkout-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
}

.empty-cart {
  background-color: white;
  border-radius: 10px;
  padding: 3rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 2rem;
}

.empty-cart-icon {
  font-size: 3rem;
  color: #adb5bd;
  margin-bottom: 1rem;
}

.empty-cart h2 {
  margin-bottom: 1rem;
}

.browse-tours-btn {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  margin-top: 1.5rem;
  transition: background-color 0.3s;
}

.browse-tours-btn:hover {
  background-color: #5e35a8;
}

.checkout-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.cart-items-section, .checkout-form-section {
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.cart-items-section h2, .checkout-form-section h2 {
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.cart-items {
  margin-bottom: 2rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.item-details {
  flex-grow: 1;
}

.item-tour {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.item-info {
  color: #666;
  font-size: 0.9rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.item-price {
  font-weight: bold;
  margin: 0 1rem;
}

.remove-item-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
}

.cart-summary {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.summary-row.total {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #dee2e6;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #495057;
}

.form-group input, .form-group textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group.half {
  flex-basis: 50%;
}

.payment-section {
  margin-top: 1rem;
}

.payment-section h3 {
  margin-bottom: 1rem;
}

.payment-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.payment-option {
  flex-basis: calc(33.333% - 1rem);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option:hover {
  border-color: var(--primary-color);
}

.payment-option input {
  margin: 0;
}

.payment-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-details {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.terms-section {
  margin-top: 1rem;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.terms-checkbox a {
  color: var(--primary-color);
  text-decoration: none;
}

.terms-checkbox a:hover {
  text-decoration: underline;
}

.checkout-button {
  background-color: var(--secondary-color);
  border: none;
  color: var(--text-color);
  padding: 1rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1.5rem;
}

.checkout-button:hover:not(:disabled) {
  background-color: #e5c04a;
}

.checkout-button:disabled {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  color: #adb5bd;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .checkout-container {
    grid-template-columns: 1fr;
  }
  
  .payment-option {
    flex-basis: 100%;
  }
}
</style> 