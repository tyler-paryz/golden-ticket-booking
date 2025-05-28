<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-section">
        <h3 class="footer-heading">Golden Ticket Booking</h3>
        <p>Book your magical tour of Wonka's Factory today!</p>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-heading">Quick Links</h4>
        <ul class="footer-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/tours">Factory Tours</router-link></li>
          <li><router-link to="/my-tickets">My Tickets</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-heading">Contact Us</h4>
        <address>
          <p>1 Wonka Way</p>
          <p>Chocolate City, WK 12345</p>
          <p>Email: tours@wonkafactory.com</p>
          <p>Phone: (555) 123-4567</p>
        </address>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-heading">Slugworth Ecosystem</h4>
        <div class="ecosystem-links">
          <a href="https://slugworth-corp.vercel.app/" class="ecosystem-link" @click="trackAppNavigation('Slugworth Corp')">
            Slugworth Corp
          </a>
          <a href="https://oompa-social.vercel.app/login" class="ecosystem-link" @click="trackAppNavigation('Oompa Social')">
            Oompa Social
          </a>
          <span class="ecosystem-link current">Golden Ticket Booking</span>
        </div>
        <button @click="trackButtonClick" class="feedback-btn">Give Feedback</button>
      </div>
    </div>
    
    <div class="copyright">
      <p>&copy; {{ currentYear }} Wonka Enterprises. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());

// Track button click with Pendo
const trackButtonClick = () => {
  if (window.pendo) {
    window.pendo.track('Feedback Button Clicked');
  }
  alert('Thank you for your interest in providing feedback!');
};

// Track cross-app navigation with Pendo
const trackAppNavigation = (destination) => {
  if (window.pendo) {
    window.pendo.track('Cross App Navigation', {
      source: 'Golden Ticket Booking',
      destination: destination,
      navigationPoint: 'Footer'
    });
  }
};
</script>

<style scoped>
.app-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--primary-color);
  color: white;
  height: var(--footer-height);
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

.footer-section {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.footer-heading {
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.footer-links {
  list-style: none;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s;
  line-height: 1.5;
}

.footer-links a:hover {
  color: var(--secondary-color);
}

address {
  font-style: normal;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.ecosystem-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.ecosystem-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s;
  line-height: 1.5;
}

.ecosystem-link:hover {
  color: var(--secondary-color);
}

.ecosystem-link.current {
  color: var(--secondary-color);
  font-weight: bold;
  cursor: default;
}

.feedback-btn {
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.feedback-btn:hover {
  background-color: #e5c04a;
}

.copyright {
  text-align: center;
  font-size: 0.8rem;
  padding-top: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
}
</style> 