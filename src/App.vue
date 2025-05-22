<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTicketStore } from './stores/ticketStore';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';

const router = useRouter();
const store = useTicketStore();

onMounted(() => {
  // Track page views with Pendo
  router.afterEach((to) => {
    if (window.pendo) {
      window.pendo.track('Page View', {
        page: to.path,
        title: document.title
      });
    }
  });
});
</script>

<template>
  <div class="app-container">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<style>
:root {
  --primary-color: #6f42c1;
  --secondary-color: #d4af37;
  --accent-color: #f64c72;
  --background-color: #f8f9fa;
  --text-color: #343a40;
  --header-height: 70px;
  --footer-height: 200px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  margin-top: var(--header-height);
  margin-bottom: var(--footer-height);
}

h1, h2, h3, h4, h5, h6 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

button {
  cursor: pointer;
}

.golden-accent {
  color: var(--secondary-color);
}

.wonka-accent {
  color: var(--accent-color);
}
</style>
