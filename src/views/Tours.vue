<template>
  <div class="tours-page">
    <header class="page-header">
      <h1>Factory <span class="wonka-accent">Tours</span></h1>
      <p>Explore our selection of exclusive guided tours through the magical Wonka Factory.</p>
    </header>
    
    <div class="filter-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search tours..." 
          class="search-input"
          @input="trackSearch"
        />
        <i class="pi pi-search search-icon"></i>
      </div>
    </div>
    
    <div class="tours-grid">
      <div v-for="tour in filteredTours" :key="tour.id" class="tour-card">
        <div class="tour-image">
          <img :src="images.placeholderTour" :alt="tour.name" />
        </div>
        
        <div class="tour-content">
          <h3 class="tour-title">{{ tour.name }}</h3>
          <p class="tour-description">{{ tour.description }}</p>
          
          <div class="tour-details">
            <div class="detail-item">
              <i class="pi pi-clock"></i>
              <span>{{ tour.duration }}</span>
            </div>
            
            <div class="detail-item">
              <i class="pi pi-dollar"></i>
              <span>{{ tour.price }} Golden Coins</span>
            </div>
            
            <div class="detail-item">
              <i class="pi pi-users"></i>
              <span>{{ tour.remainingSeats }} seats left</span>
            </div>
          </div>
          
          <router-link 
            :to="`/tours/${tour.id}`" 
            class="view-tour-btn"
            @click="trackTourClick(tour.name)"
          >
            View Details
          </router-link>
        </div>
      </div>
    </div>
    
    <div v-if="filteredTours.length === 0" class="no-results">
      <p>No tours found matching your search.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTicketStore } from '../stores/ticketStore';
import images from '../assets/images.js';

const store = useTicketStore();
const searchQuery = ref('');

const filteredTours = computed(() => {
  if (!searchQuery.value) return store.tours;
  
  const query = searchQuery.value.toLowerCase();
  return store.tours.filter(tour => 
    tour.name.toLowerCase().includes(query) || 
    tour.description.toLowerCase().includes(query)
  );
});

const trackSearch = () => {
  if (window.pendo && searchQuery.value.length > 2) {
    window.pendo.track('Tour Search', { 
      query: searchQuery.value,
      resultCount: filteredTours.value.length
    });
  }
};

const trackTourClick = (tourName) => {
  if (window.pendo) {
    window.pendo.track('Tour Selected', { tourName });
  }
};
</script>

<style scoped>
.tours-page {
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

.page-header p {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.filter-section {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 50px;
  font-size: 1rem;
  transition: box-shadow 0.3s;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(111, 66, 193, 0.2);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.tours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.tour-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.tour-card:hover {
  transform: translateY(-5px);
}

.tour-image {
  height: 200px;
  overflow: hidden;
}

.tour-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.tour-card:hover .tour-image img {
  transform: scale(1.05);
}

.tour-content {
  padding: 1.5rem;
}

.tour-title {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.tour-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.tour-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.detail-item i {
  color: var(--primary-color);
}

.view-tour-btn {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.view-tour-btn:hover {
  background-color: #5e35a8;
}

.no-results {
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style> 