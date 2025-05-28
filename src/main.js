import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
// Import the Lara theme from @primeuix/themes
import Lara from '@primeuix/themes/lara'
// Core PrimeVue styles are now included in the main package
import 'primeicons/primeicons.css'
import './style.css'
import App from './App.vue'

// Import pages
import Home from './views/Home.vue'
import Tours from './views/Tours.vue'
import TourDetails from './views/TourDetails.vue'
import SeatSelection from './views/SeatSelection.vue'
import Checkout from './views/Checkout.vue'
import MyTickets from './views/MyTickets.vue'
import Ecosystem from './views/Ecosystem.vue'

// Initialize Pendo
window.pendo.initialize({
  visitor: {
    id: 'VISITOR-UNIQUE-ID' // Replace with actual unique ID in production
  },
  account: {
    id: 'ACCOUNT-UNIQUE-ID' // Replace with actual account ID in production
  }
});

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/tours', component: Tours },
    { path: '/tours/:id', component: TourDetails },
    { path: '/seat-selection/:id', component: SeatSelection },
    { path: '/checkout', component: Checkout },
    { path: '/my-tickets', component: MyTickets },
    { path: '/ecosystem', component: Ecosystem }
  ]
})

// Create Pinia store
const pinia = createPinia()

// Create and mount app
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(PrimeVue, { 
  ripple: true,
  theme: {
    preset: Lara
  }
})
app.mount('#app')
