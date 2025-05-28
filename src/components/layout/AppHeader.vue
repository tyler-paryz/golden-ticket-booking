<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <router-link to="/">
          <span class="logo-text">
            <span class="golden-accent">Golden</span> Ticket <span class="wonka-accent">Booking</span>
          </span>
        </router-link>
      </div>
      
      <nav class="navigation">
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/tours">Factory Tours</router-link></li>
          <li><router-link to="/my-tickets">My Tickets</router-link></li>
          <li>
            <router-link to="/ecosystem" @click="trackEcosystemClick">
              Slugworth Ecosystem
            </router-link>
          </li>
        </ul>
      </nav>
      
      <div class="cart-widget">
        <router-link to="/checkout" class="cart-link">
          <i class="pi pi-shopping-cart"></i>
          <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useTicketStore } from '../../stores/ticketStore';

const store = useTicketStore();
const cartCount = computed(() => store.cart.length);

// Track ecosystem navigation with Pendo
const trackEcosystemClick = () => {
  if (window.pendo) {
    window.pendo.track('Ecosystem Page Visited', {
      source: 'Header Navigation',
      app: 'Golden Ticket Booking'
    });
  }
};
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  height: var(--header-height);
  z-index: 100;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 100%;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.logo a {
  text-decoration: none;
  color: var(--text-color);
}

.logo-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navigation {
  flex-grow: 1;
  margin-left: 2rem;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.2s;
  padding: 0.5rem;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--primary-color);
}

.cart-widget {
  position: relative;
}

.cart-link {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem;
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--accent-color);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 