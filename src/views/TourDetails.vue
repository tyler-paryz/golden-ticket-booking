<template>
  <div class="tour-details-page" v-if="tour">
    <div class="tour-header">
      <h1>{{ tour.name }}</h1>
      <p class="tour-subtitle">{{ tour.description }}</p>
    </div>
    
    <div class="tour-content">
      <div class="tour-gallery">
        <img :src="images.placeholderTour" :alt="tour.name" class="main-image" />
        
        <div class="tour-thumbnails">
          <img :src="images.chocolateRoom" alt="Tour image 1" class="thumbnail" />
          <img :src="images.inventionRoom" alt="Tour image 2" class="thumbnail" />
          <img :src="images.oompaLoompa" alt="Tour image 3" class="thumbnail" />
        </div>
      </div>
      
      <div class="tour-info">
        <div class="tour-details-card">
          <div class="tour-detail-row">
            <i class="pi pi-clock"></i>
            <div>
              <h4>Duration</h4>
              <p>{{ tour.duration }}</p>
            </div>
          </div>
          
          <div class="tour-detail-row">
            <i class="pi pi-dollar"></i>
            <div>
              <h4>Price</h4>
              <p>{{ tour.price }} Golden Coins per person</p>
            </div>
          </div>
          
          <div class="tour-detail-row">
            <i class="pi pi-users"></i>
            <div>
              <h4>Group Size</h4>
              <p>Maximum {{ tour.capacity }} visitors</p>
            </div>
          </div>
          
          <div class="tour-detail-row">
            <i class="pi pi-ticket"></i>
            <div>
              <h4>Availability</h4>
              <p>{{ tour.remainingSeats }} seats remaining</p>
            </div>
          </div>
        </div>
        
        <div class="booking-section">
          <h3>Book Your Tour</h3>
          
          <div class="date-selection">
            <h4>Select a Date:</h4>
            <div class="date-options">
              <button 
                v-for="date in tour.availableDates" 
                :key="date"
                class="date-button"
                :class="{ 'selected': selectedDate === date }"
                @click="selectDate(date)"
              >
                {{ formatDate(date) }}
              </button>
            </div>
          </div>
          
          <button 
            class="book-button" 
            :disabled="!selectedDate"
            @click="proceedToSeatSelection"
          >
            Select Seats
          </button>
        </div>
      </div>
    </div>
    
    <div class="tour-highlights">
      <h2>Tour Highlights</h2>
      
      <div class="highlights-grid">
        <div class="highlight-card">
          <i class="pi pi-star highlight-icon"></i>
          <h3>Magical Experience</h3>
          <p>Witness the wonder and magic of Wonka's creations first-hand.</p>
        </div>
        
        <div class="highlight-card">
          <i class="pi pi-heart highlight-icon"></i>
          <h3>Sweet Treats</h3>
          <p>Sample delicious candies and chocolates throughout your tour.</p>
        </div>
        
        <div class="highlight-card">
          <i class="pi pi-camera highlight-icon"></i>
          <h3>Photo Opportunities</h3>
          <p>Capture memories in the most whimsical settings imaginable.</p>
        </div>
        
        <div class="highlight-card">
          <i class="pi pi-gift highlight-icon"></i>
          <h3>Complimentary Gift</h3>
          <p>Receive a special Wonka gift at the end of your tour.</p>
        </div>
      </div>
    </div>
    
    <div class="what-to-expect">
      <h2>What to Expect</h2>
      <p>During your {{ tour.name }} experience, our Oompa Loompa guides will lead you through the wonders of Willy Wonka's factory. You'll see firsthand how our magical candies are made, and experience the unique atmosphere that makes our factory so special.</p>
      
      <h3>Safety Information</h3>
      <p>For your safety, please wear comfortable shoes and follow all instructions from your guide. Children must be accompanied by an adult at all times.</p>
      
      <h3>Accessibility</h3>
      <p>Our tours are accessible to guests with mobility concerns. Please inform us of any special requirements when booking.</p>
    </div>
  </div>
  
  <div v-else class="loading-container">
    <p>Loading tour details...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTicketStore } from '../stores/ticketStore';
import images from '../assets/images.js';

const route = useRoute();
const router = useRouter();
const store = useTicketStore();
const selectedDate = ref(null);

const tour = computed(() => {
  const tourId = parseInt(route.params.id);
  return store.tours.find(t => t.id === tourId) || null;
});

onMounted(() => {
  // Track page view with tour details
  if (window.pendo && tour.value) {
    window.pendo.track('Tour Details Viewed', { 
      tourId: tour.value.id,
      tourName: tour.value.name
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

const selectDate = (date) => {
  selectedDate.value = date;
  store.selectDate(date);
  
  // Track date selection
  if (window.pendo) {
    window.pendo.track('Tour Date Selected', { 
      tourId: tour.value.id,
      tourName: tour.value.name,
      selectedDate: date
    });
  }
};

const proceedToSeatSelection = () => {
  if (!selectedDate.value) return;
  
  store.selectTour(tour.value.id);
  router.push(`/seat-selection/${tour.value.id}`);
};
</script>

<style scoped>
.tour-details-page {
  max-width: 1200px;
  margin: 0 auto;
}

.tour-header {
  text-align: center;
  margin-bottom: 2rem;
}

.tour-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.tour-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
}

.tour-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.tour-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 10px;
}

.tour-thumbnails {
  display: flex;
  gap: 1rem;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.thumbnail:hover {
  opacity: 0.8;
}

.tour-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tour-details-card {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.tour-detail-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.tour-detail-row:last-child {
  border-bottom: none;
}

.tour-detail-row i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.tour-detail-row h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: var(--text-color);
}

.booking-section {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.booking-section h3 {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.date-selection {
  margin-bottom: 1.5rem;
}

.date-selection h4 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: var(--text-color);
}

.date-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.date-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.date-button:hover {
  background-color: #eee;
}

.date-button.selected {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.book-button {
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: none;
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.book-button:hover:not(:disabled) {
  background-color: #e5c04a;
}

.book-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.tour-highlights {
  margin-bottom: 3rem;
}

.tour-highlights h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.highlight-card {
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.highlight-icon {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.what-to-expect {
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

.what-to-expect h2 {
  margin-bottom: 1rem;
}

.what-to-expect p {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.what-to-expect h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
  color: var(--primary-color);
}
</style> 