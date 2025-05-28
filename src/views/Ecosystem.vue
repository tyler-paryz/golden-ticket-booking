<template>
  <div class="ecosystem-page">
    <h1>Slugworth Corporation Ecosystem</h1>
    <p class="ecosystem-intro">
      Explore the full suite of Slugworth Corporation applications designed to enhance your Wonka experience.
    </p>
    
    <div class="app-cards">
      <!-- Slugworth Corp -->
      <div class="app-card">
        <h2>Slugworth Corp</h2>
        <p class="app-description">
          The official corporate portal for Slugworth Corporation. Access company information, resources, and services.
        </p>
        <div class="app-features">
          <h3>Key Features:</h3>
          <ul>
            <li>Corporate News and Updates</li>
            <li>Employee Portal</li>
            <li>Investor Relations</li>
          </ul>
        </div>
        <div class="app-actions">
          <a 
            href="https://slugworth-corp.vercel.app/" 
            class="app-button primary"
            @click="trackAppNavigation('Slugworth Corp', 'Open App')"
          >
            Open App
          </a>
          <button 
            class="app-button secondary" 
            @click="showDetails('slugworth')"
          >
            Learn More
          </button>
        </div>
      </div>
      
      <!-- Oompa Social -->
      <div class="app-card">
        <h2>Oompa Social</h2>
        <p class="app-description">
          Connect with fellow chocolate lovers and Oompa Loompas in our social network designed for Wonka enthusiasts.
        </p>
        <div class="app-features">
          <h3>Key Features:</h3>
          <ul>
            <li>Connect with Chocolate Enthusiasts</li>
            <li>Share Your Wonka Experiences</li>
            <li>Join Candy Discussion Groups</li>
          </ul>
        </div>
        <div class="app-actions">
          <a 
            href="https://oompa-social.vercel.app/login" 
            class="app-button primary"
            @click="trackAppNavigation('Oompa Social', 'Open App')"
          >
            Open App
          </a>
          <button 
            class="app-button secondary" 
            @click="showDetails('oompa')"
          >
            Learn More
          </button>
        </div>
      </div>
      
      <!-- Golden Ticket Booking -->
      <div class="app-card current">
        <h2>Golden Ticket Booking</h2>
        <p class="app-description">
          Book your magical tour of Wonka's Chocolate Factory. Secure your Golden Ticket for an unforgettable experience.
        </p>
        <div class="app-features">
          <h3>Key Features:</h3>
          <ul>
            <li>Browse Available Factory Tours</li>
            <li>Reserve Premium Seats</li>
            <li>Manage Your Golden Tickets</li>
          </ul>
        </div>
        <div class="app-actions">
          <router-link 
            to="/" 
            class="app-button primary"
          >
            Current App
          </router-link>
          <button 
            class="app-button secondary" 
            @click="showDetails('golden')"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
    
    <!-- Feature Details Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-modal" @click="closeModal">&times;</button>
        <h2>{{ modalContent.title }}</h2>
        <p class="modal-description">{{ modalContent.description }}</p>
        
        <div class="feature-list">
          <h3>Features:</h3>
          <ul>
            <li 
              v-for="(feature, index) in modalContent.features" 
              :key="index"
              @click="trackFeatureInterest(modalContent.title, feature.name)"
              class="feature-item"
            >
              <strong>{{ feature.name }}</strong>
              <p>{{ feature.description }}</p>
            </li>
          </ul>
        </div>
        
        <div class="modal-actions">
          <a 
            v-if="modalContent.link" 
            :href="modalContent.link" 
            class="app-button primary"
            @click="trackAppNavigation(modalContent.title, 'Modal Link')"
          >
            Open {{ modalContent.title }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
const modalContent = ref({});

const appDetails = {
  slugworth: {
    title: 'Slugworth Corp',
    description: 'The official corporate portal for Slugworth Corporation, providing access to company information, resources, and services for employees, partners, and customers.',
    link: 'https://slugworth-corp.vercel.app/',
    features: [
      { 
        name: 'Corporate Dashboard', 
        description: 'Access key performance indicators and company metrics in real-time.' 
      },
      { 
        name: 'Document Repository', 
        description: 'Centralized storage for all corporate documents and forms.' 
      },
      { 
        name: 'Department Directory', 
        description: 'Find and connect with colleagues across all departments.' 
      },
      { 
        name: 'News & Announcements', 
        description: 'Stay updated with the latest company news and important announcements.' 
      }
    ]
  },
  oompa: {
    title: 'Oompa Social',
    description: 'A social networking platform for chocolate enthusiasts and Oompa Loompas to connect, share experiences, and discuss everything related to Wonka products.',
    link: 'https://oompa-social.vercel.app/login',
    features: [
      { 
        name: 'Chocolate Feed', 
        description: 'Share photos and stories of your favorite Wonka chocolate experiences.' 
      },
      { 
        name: 'Oompa Groups', 
        description: 'Join interest-based groups to discuss specific Wonka products or topics.' 
      },
      { 
        name: 'Event Calendar', 
        description: 'Discover and RSVP to upcoming chocolate tastings and Wonka events.' 
      },
      { 
        name: 'Messaging', 
        description: 'Connect directly with other chocolate enthusiasts through private messaging.' 
      }
    ]
  },
  golden: {
    title: 'Golden Ticket Booking',
    description: 'Your gateway to the magical world of Wonka\'s Chocolate Factory. Book tours, select seats, and manage your Golden Tickets for an unforgettable experience.',
    link: null,
    features: [
      { 
        name: 'Tour Catalog', 
        description: 'Browse through various factory tour options with detailed descriptions.' 
      },
      { 
        name: 'Interactive Seat Selection', 
        description: 'Choose your preferred seats with our interactive seating chart.' 
      },
      { 
        name: 'Digital Tickets', 
        description: 'Access and manage your Golden Tickets digitally from any device.' 
      },
      { 
        name: 'Tour Reminders', 
        description: 'Receive notifications and reminders about your upcoming factory tours.' 
      }
    ]
  }
};

const showDetails = (appKey) => {
  modalContent.value = appDetails[appKey];
  showModal.value = true;
  
  // Track modal open event
  if (window.pendo) {
    window.pendo.track('App Details Viewed', {
      app: modalContent.value.title,
      source: 'Ecosystem Page'
    });
  }
};

const closeModal = () => {
  showModal.value = false;
};

// Track cross-app navigation with Pendo
const trackAppNavigation = (destination, source) => {
  if (window.pendo) {
    window.pendo.track('Cross App Navigation', {
      source: 'Golden Ticket Booking',
      sourceLocation: source,
      destination: destination,
      navigationPoint: 'Ecosystem Page'
    });
  }
};

// Track feature interest
const trackFeatureInterest = (app, feature) => {
  if (window.pendo) {
    window.pendo.track('Feature Interest', {
      app: app,
      feature: feature,
      source: 'Ecosystem Page'
    });
  }
};
</script>

<style scoped>
.ecosystem-page {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

h1 {
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 1rem;
}

.ecosystem-intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 2rem;
  color: var(--text-secondary-color);
  font-size: 1.1rem;
}

.app-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.app-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.app-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.app-card.current {
  border: 2px solid var(--primary-color);
  position: relative;
}

.app-card.current::after {
  content: 'Current App';
  position: absolute;
  top: -12px;
  right: 20px;
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: bold;
}

.app-card h2 {
  color: var(--primary-color);
  margin-bottom: 0.75rem;
}

.app-description {
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.app-features {
  margin-bottom: 1.5rem;
}

.app-features h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--text-secondary-color);
}

.app-features ul {
  list-style: disc;
  padding-left: 1.5rem;
  color: var(--text-color);
}

.app-features li {
  margin-bottom: 0.25rem;
}

.app-actions {
  display: flex;
  gap: 1rem;
}

.app-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
  flex: 1;
}

.app-button.primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.app-button.primary:hover {
  background-color: var(--primary-dark-color, #8e44ad);
}

.app-button.secondary {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.app-button.secondary:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary-color);
}

.modal-description {
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: var(--text-color);
}

.feature-list h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.feature-item {
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.feature-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.feature-item strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--primary-color);
}

.feature-item p {
  color: var(--text-secondary-color);
  margin: 0;
}

.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .app-cards {
    grid-template-columns: 1fr;
  }
}
</style> 