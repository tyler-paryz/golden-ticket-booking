<template>
  <div class="home-page">
    <section class="hero" :style="{ backgroundImage: `linear-gradient(to right, rgba(111, 66, 193, 0.9), rgba(246, 76, 114, 0.9)), url(${images.factory})` }">
      <div class="hero-content">
        <h1>Welcome to <span class="golden-accent">Golden</span> Ticket <span class="wonka-accent">Booking</span></h1>
        <p class="hero-subtitle">Book your exclusive tour of Willy Wonka's Chocolate Factory!</p>
        <router-link to="/tours" class="cta-button" @click="trackCTA">Browse Available Tours</router-link>
      </div>
    </section>
    
    <section class="features">
      <div class="feature-card">
        <i class="pi pi-ticket feature-icon"></i>
        <h3>Exclusive Tours</h3>
        <p>Experience the magic of Wonka's factory with our exclusive guided tours.</p>
      </div>
      
      <div class="feature-card">
        <i class="pi pi-calendar feature-icon"></i>
        <h3>Flexible Dates</h3>
        <p>Choose from multiple tour dates that fit your schedule.</p>
      </div>
      
      <div class="feature-card">
        <i class="pi pi-map feature-icon"></i>
        <h3>Multiple Rooms</h3>
        <p>Visit the Chocolate Room, Invention Room, and more!</p>
      </div>
      
      <div class="feature-card">
        <i class="pi pi-users feature-icon"></i>
        <h3>Oompa Loompa Guides</h3>
        <p>Knowledgeable and friendly guides throughout your experience.</p>
      </div>
    </section>
    
    <section class="testimonials">
      <h2>What Our Visitors Say</h2>
      <div class="testimonial-container">
        <div class="testimonial">
          <p class="quote">"The Chocolate Room was beyond imagination. Everything was truly edible!"</p>
          <p class="author">- Charlie Bucket</p>
        </div>
        
        <div class="testimonial">
          <p class="quote">"The fizzy lifting drinks were the highlight of my tour. I felt like I was floating!"</p>
          <p class="author">- Grandpa Joe</p>
        </div>
        
        <div class="testimonial">
          <p class="quote">"Seeing the Oompa Loompas work their magic was an unforgettable experience."</p>
          <p class="author">- Veruca Salt</p>
        </div>
      </div>
    </section>
    
    <section class="newsletter">
      <h2>Stay Updated</h2>
      <p>Subscribe to our newsletter for special offers and tour updates.</p>
      
      <form @submit.prevent="submitNewsletter" class="newsletter-form">
        <input 
          type="email" 
          v-model="email" 
          placeholder="Your email address" 
          required
          class="newsletter-input"
        />
        <button type="submit" class="newsletter-button">Subscribe</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import images from '../assets/images.js';

const email = ref('');

const submitNewsletter = () => {
  // In a real app, this would send the email to a backend service
  if (window.pendo) {
    window.pendo.track('Newsletter Signup', { email: email.value });
  }
  
  alert(`Thank you for subscribing with ${email.value}!`);
  email.value = '';
};

const trackCTA = () => {
  if (window.pendo) {
    window.pendo.track('CTA Button Clicked', { button: 'Browse Available Tours' });
  }
};
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  background: linear-gradient(to right, rgba(111, 66, 193, 0.9), rgba(246, 76, 114, 0.9)), 
              url('/images/factory.jpg') center/cover;
  color: white;
  border-radius: 10px;
  padding: 4rem 2rem;
  margin-bottom: 3rem;
  text-align: center;
}

.hero-content {
  max-width: 700px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  background-color: var(--secondary-color);
  color: var(--text-color);
  font-weight: bold;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  transition: transform 0.3s, background-color 0.3s;
}

.cta-button:hover {
  transform: translateY(-3px);
  background-color: #e5c04a;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.testimonials {
  margin-bottom: 3rem;
}

.testimonials h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.testimonial-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.quote {
  font-style: italic;
  position: relative;
  padding: 0 1rem;
}

.quote::before,
.quote::after {
  content: '"';
  font-size: 2rem;
  color: var(--primary-color);
  opacity: 0.3;
}

.author {
  text-align: right;
  margin-top: 1rem;
  font-weight: bold;
}

.newsletter {
  background-color: white;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 3rem;
}

.newsletter-form {
  display: flex;
  max-width: 500px;
  margin: 1.5rem auto 0;
}

.newsletter-input {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
}

.newsletter-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0 1.5rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.newsletter-button:hover {
  background-color: #5e35a8;
}
</style> 