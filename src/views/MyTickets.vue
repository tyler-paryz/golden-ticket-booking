<template>
  <div class="my-tickets-page">
    <header class="page-header">
      <h1>My <span class="golden-accent">Golden</span> Tickets</h1>
      <p class="page-subtitle">View and manage your purchased tickets for Wonka Factory tours</p>
    </header>
    
    <div v-if="tickets.length === 0" class="no-tickets">
      <div class="no-tickets-content">
        <i class="pi pi-ticket no-tickets-icon"></i>
        <h2>No Tickets Found</h2>
        <p>You haven't purchased any tickets yet.</p>
        <router-link to="/tours" class="browse-tours-btn">Browse Available Tours</router-link>
      </div>
    </div>
    
    <div v-else>
      <div class="purchase-success" v-if="showSuccessMessage">
        <i class="pi pi-check-circle success-icon"></i>
        <div class="success-content">
          <h3>Purchase Successful!</h3>
          <p>Thank you for booking your Wonka Factory tour. Your tickets are ready below.</p>
        </div>
        <button class="close-success-btn" @click="hideSuccessMessage">
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <div class="tickets-container">
        <div v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
          <div class="ticket-header">
            <div class="ticket-title">{{ ticket.tourName }}</div>
            <div class="ticket-date">{{ formatDate(ticket.date) }}</div>
          </div>
          
          <div class="ticket-content">
            <div class="ticket-details">
              <div class="ticket-detail">
                <i class="pi pi-id-card"></i>
                <div>
                  <h4>Visitor</h4>
                  <p>{{ store.user.name }}</p>
                </div>
              </div>
              
              <div class="ticket-detail">
                <i class="pi pi-envelope"></i>
                <div>
                  <h4>Contact</h4>
                  <p>{{ store.user.email }}</p>
                </div>
              </div>
              
              <div class="ticket-detail">
                <i class="pi pi-ticket"></i>
                <div>
                  <h4>Seat</h4>
                  <p>{{ ticket.seat }}</p>
                </div>
              </div>
              
              <div class="ticket-detail">
                <i class="pi pi-calendar-plus"></i>
                <div>
                  <h4>Purchased On</h4>
                  <p>{{ formatPurchaseDate(ticket.purchaseDate) }}</p>
                </div>
              </div>
            </div>
            
            <div class="ticket-actions">
              <div class="ticket-code">
                <span>Ticket Code:</span>
                <span class="code">{{ ticket.ticketCode }}</span>
              </div>
              
              <div class="action-buttons">
                <button class="action-btn download-btn" @click="downloadTicket(ticket)">
                  <i class="pi pi-download"></i>
                  Download
                </button>
                <button class="action-btn share-btn" @click="shareTicket(ticket)">
                  <i class="pi pi-share-alt"></i>
                  Share
                </button>
              </div>
            </div>
          </div>
          
          <div class="ticket-footer">
            <div class="golden-strip"></div>
            <div class="wonka-logo">WONKA</div>
          </div>
        </div>
      </div>
      
      <div class="tickets-summary">
        <h3>Ticket Summary</h3>
        <div class="summary-content">
          <div class="summary-item">
            <span>Total Tickets:</span>
            <span>{{ tickets.length }}</span>
          </div>
          <div class="summary-item">
            <span>Total Tours:</span>
            <span>{{ uniqueTours.length }}</span>
          </div>
          <div class="summary-item">
            <span>Upcoming Tours:</span>
            <span>{{ upcomingTickets.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTicketStore } from '../stores/ticketStore';

const route = useRoute();
const store = useTicketStore();
const showSuccessMessage = ref(false);

// Check if coming from checkout
onMounted(() => {
  const fromCheckout = route.query.success === 'true';
  
  if (fromCheckout) {
    showSuccessMessage.value = true;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 5000);
  }
  
  // Track page view
  if (window.pendo) {
    window.pendo.track('My Tickets Viewed', { 
      ticketCount: tickets.value.length
    });
  }
});

const tickets = computed(() => store.myTickets);

const uniqueTours = computed(() => {
  const tourIds = new Set(tickets.value.map(ticket => ticket.tourId));
  return Array.from(tourIds);
});

const upcomingTickets = computed(() => {
  const now = new Date();
  return tickets.value.filter(ticket => new Date(ticket.date) > now);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};

const formatPurchaseDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const hideSuccessMessage = () => {
  showSuccessMessage.value = false;
};

const downloadTicket = (ticket) => {
  // In a real app, this would generate a PDF ticket for download
  alert(`Downloading ticket ${ticket.ticketCode} for ${ticket.tourName}`);
  
  // Track download
  if (window.pendo) {
    window.pendo.track('Ticket Downloaded', { 
      ticketId: ticket.id,
      tourName: ticket.tourName
    });
  }
};

const shareTicket = (ticket) => {
  // In a real app, this would open sharing options
  alert(`Sharing ticket ${ticket.ticketCode} for ${ticket.tourName}`);
  
  // Track share
  if (window.pendo) {
    window.pendo.track('Ticket Shared', { 
      ticketId: ticket.id,
      tourName: ticket.tourName
    });
  }
};
</script>

<style scoped>
.my-tickets-page {
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

.no-tickets {
  background-color: white;
  border-radius: 10px;
  padding: 3rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 2rem;
}

.no-tickets-icon {
  font-size: 3rem;
  color: #adb5bd;
  margin-bottom: 1rem;
}

.no-tickets h2 {
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

.purchase-success {
  display: flex;
  align-items: center;
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.success-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
}

.success-content {
  flex-grow: 1;
}

.success-content h3 {
  margin-bottom: 0.25rem;
  color: #155724;
}

.close-success-btn {
  background: none;
  border: none;
  color: #155724;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.close-success-btn:hover {
  opacity: 1;
}

.tickets-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.ticket-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  position: relative;
}

.ticket-card:hover {
  transform: translateY(-5px);
}

.ticket-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem;
  position: relative;
}

.ticket-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: repeating-linear-gradient(
    45deg,
    var(--primary-color),
    var(--primary-color) 10px,
    rgba(255, 255, 255, 0.2) 10px,
    rgba(255, 255, 255, 0.2) 20px
  );
}

.ticket-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.ticket-date {
  font-size: 1rem;
}

.ticket-content {
  padding: 1.5rem;
}

.ticket-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.ticket-detail {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.ticket-detail i {
  font-size: 1.2rem;
  color: var(--primary-color);
}

.ticket-detail h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  color: #666;
}

.ticket-detail p {
  margin: 0;
  font-weight: 500;
}

.ticket-actions {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.ticket-code {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.ticket-code .code {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 1px;
  color: var(--primary-color);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.download-btn {
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  color: white;
}

.download-btn:hover {
  background-color: #5e35a8;
}

.share-btn {
  background-color: white;
  border: 1px solid #ced4da;
  color: #495057;
}

.share-btn:hover {
  background-color: #f8f9fa;
}

.ticket-footer {
  position: relative;
  height: 30px;
  overflow: hidden;
}

.golden-strip {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-color: var(--secondary-color);
}

.wonka-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Impact', sans-serif;
  font-size: 1.2rem;
  color: var(--text-color);
  letter-spacing: 3px;
}

.tickets-summary {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.tickets-summary h3 {
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.summary-content {
  display: flex;
  justify-content: space-around;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.summary-item span:first-child {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.summary-item span:last-child {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .ticket-details {
    grid-template-columns: 1fr;
  }
  
  .summary-content {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style> 