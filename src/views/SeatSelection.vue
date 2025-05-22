<template>
  <div class="seat-selection-page" v-if="tour">
    <div class="page-header">
      <h1>Select Your <span class="golden-accent">Seats</span></h1>
      <p class="page-subtitle">
        {{ tour.name }} on {{ formatDate(selectedDate) }}
      </p>
    </div>
    
    <div class="selection-container">
      <div class="seat-map-container">
        <div class="seat-map-header">
          <h2>Seat Map</h2>
          <div class="seat-legend">
            <div class="legend-item">
              <div class="seat-icon available"></div>
              <span>Available</span>
            </div>
            <div class="legend-item">
              <div class="seat-icon selected"></div>
              <span>Selected</span>
            </div>
            <div class="legend-item">
              <div class="seat-icon unavailable"></div>
              <span>Unavailable</span>
            </div>
          </div>
        </div>
        
        <div class="wonka-factory-layout">
          <div class="factory-entrance">
            <div class="entrance-label">Entrance</div>
          </div>
          
          <div class="seat-grid">
            <button
              v-for="seat in availableSeats"
              :key="seat.id"
              class="seat"
              :class="{
                'seat-available': seat.available,
                'seat-selected': isSelected(seat.id),
                'seat-unavailable': !seat.available
              }"
              :disabled="!seat.available"
              @click="toggleSeat(seat.id)"
            >
              {{ seat.id }}
            </button>
          </div>
          
          <div class="factory-stage">
            <div class="stage-label">Tour Guide Stage</div>
          </div>
        </div>
      </div>
      
      <div class="selection-summary">
        <div class="summary-card">
          <h3>Your Selection</h3>
          
          <div v-if="selectedSeats.length > 0" class="selected-seats-list">
            <div v-for="seat in selectedSeats" :key="seat.id" class="selected-seat-item">
              <div class="seat-info">
                <span class="seat-name">{{ seat.name }}</span>
                <span class="seat-price">{{ seat.price }} Golden Coins</span>
              </div>
              <button class="remove-seat-btn" @click="toggleSeat(seat.id)">
                <i class="pi pi-times"></i>
              </button>
            </div>
            
            <div class="selection-total">
              <span>Total:</span>
              <span class="total-price">{{ totalPrice }} Golden Coins</span>
            </div>
          </div>
          
          <div v-else class="empty-selection">
            <p>No seats selected yet.</p>
            <p class="selection-hint">Click on available seats to select them.</p>
          </div>
          
          <div class="action-buttons">
            <button class="back-button" @click="goBack">
              <i class="pi pi-arrow-left"></i> Back
            </button>
            <button 
              class="add-to-cart-button" 
              :disabled="selectedSeats.length === 0"
              @click="addToCart"
            >
              <i class="pi pi-shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else-if="!tour && store.tours.length > 0" class="error-container">
    <h2>Tour Not Found</h2>
    <p>We couldn't find the tour you're looking for.</p>
    <router-link to="/tours" class="back-to-tours-btn">Browse All Tours</router-link>
  </div>
  
  <div v-else class="loading-container">
    <p>Loading seat selection...</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTicketStore } from '../stores/ticketStore';

const route = useRoute();
const router = useRouter();
const store = useTicketStore();

const tourId = computed(() => parseInt(route.params.id));

const tour = computed(() => {
  return store.selectedTour || store.tours.find(t => t.id === tourId.value) || null;
});

const selectedDate = computed(() => store.selectedDate);
const availableSeats = computed(() => store.availableSeats);
const selectedSeats = computed(() => store.selectedSeats);

const totalPrice = computed(() => {
  return selectedSeats.value.reduce((total, seat) => total + seat.price, 0);
});

onMounted(() => {
  // If the store doesn't have a selected tour, select it now
  if (!store.selectedTour && tourId.value) {
    store.selectTour(tourId.value);
  }
  
  // If we still don't have a tour or date, redirect to tours page
  if (!tour.value || !selectedDate.value) {
    router.push('/tours');
    return;
  }
  
  // Track page view
  if (window.pendo) {
    window.pendo.track('Seat Selection Viewed', {
      tourId: tour.value.id,
      tourName: tour.value.name,
      selectedDate: selectedDate.value
    });
  }
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const isSelected = (seatId) => {
  return selectedSeats.value.some(seat => seat.id === seatId);
};

const toggleSeat = (seatId) => {
  store.toggleSeatSelection(seatId);
  
  // Track seat selection
  if (window.pendo) {
    const action = isSelected(seatId) ? 'Seat Selected' : 'Seat Deselected';
    window.pendo.track(action, {
      tourId: tour.value.id,
      tourName: tour.value.name,
      seatId: seatId
    });
  }
};

const goBack = () => {
  router.push(`/tours/${tour.value.id}`);
};

const addToCart = () => {
  if (selectedSeats.value.length === 0) return;
  
  store.addToCart();
  
  // Track add to cart
  if (window.pendo) {
    window.pendo.track('Added to Cart', {
      tourId: tour.value.id,
      tourName: tour.value.name,
      seatCount: selectedSeats.value.length,
      totalPrice: totalPrice.value
    });
  }
  
  router.push('/checkout');
};
</script>

<style scoped>
.seat-selection-page {
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

.selection-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.seat-map-container {
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.seat-map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.seat-map-header h2 {
  margin: 0;
}

.seat-legend {
  display: flex;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.seat-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.seat-icon.available {
  background-color: #e9ecef;
  border: 1px solid #ced4da;
}

.seat-icon.selected {
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.seat-icon.unavailable {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  position: relative;
}

.seat-icon.unavailable::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: #dc3545;
  top: 50%;
  left: 0;
  transform: rotate(45deg);
}

.wonka-factory-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.factory-entrance, .factory-stage {
  background-color: #f8f9fa;
  border: 2px solid #ced4da;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.entrance-label, .stage-label {
  font-weight: bold;
  color: #495057;
}

.seat-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  padding: 2rem 0;
}

.seat {
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #ced4da;
  background-color: #e9ecef;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.seat-available:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.seat-selected {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.seat-unavailable {
  background-color: #f8f9fa;
  color: #adb5bd;
  cursor: not-allowed;
  position: relative;
}

.seat-unavailable::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: #dc3545;
  top: 50%;
  left: 0;
  transform: rotate(45deg);
}

.selection-summary {
  display: flex;
  flex-direction: column;
}

.summary-card {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.selected-seats-list {
  margin-bottom: 1.5rem;
}

.selected-seat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.seat-info {
  display: flex;
  flex-direction: column;
}

.seat-name {
  font-weight: bold;
}

.seat-price {
  color: #666;
  font-size: 0.9rem;
}

.remove-seat-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.1rem;
}

.selection-total {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  font-weight: bold;
}

.total-price {
  color: var(--primary-color);
}

.empty-selection {
  text-align: center;
  padding: 2rem 0;
  color: #666;
}

.selection-hint {
  font-size: 0.9rem;
  font-style: italic;
  margin-top: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.back-button, .add-to-cart-button {
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.back-button {
  background-color: white;
  border: 1px solid #ced4da;
  color: #495057;
}

.back-button:hover {
  background-color: #f8f9fa;
}

.add-to-cart-button {
  background-color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
  color: var(--text-color);
  flex-grow: 1;
}

.add-to-cart-button:hover:not(:disabled) {
  background-color: #e5c04a;
}

.add-to-cart-button:disabled {
  background-color: #f8f9fa;
  border-color: #ced4da;
  color: #adb5bd;
  cursor: not-allowed;
}

.error-container, .loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
}

.back-to-tours-btn {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  margin-top: 1.5rem;
  transition: background-color 0.3s;
}

.back-to-tours-btn:hover {
  background-color: #5e35a8;
}
</style> 