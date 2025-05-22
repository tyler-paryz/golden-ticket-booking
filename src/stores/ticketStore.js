import { defineStore } from 'pinia'

export const useTicketStore = defineStore('tickets', {
  state: () => ({
    tours: [
      { 
        id: 1, 
        name: "Chocolate Room Tour", 
        description: "Explore the magical chocolate room where everything is edible! Visit the chocolate waterfall and taste fresh sweets.",
        price: 150, 
        duration: "2 hours", 
        image: "/images/chocolate-room.jpg", 
        availableDates: ["2023-11-15", "2023-11-20", "2023-11-25"],
        capacity: 20,
        remainingSeats: 12
      },
      { 
        id: 2, 
        name: "Invention Room Experience", 
        description: "Witness Mr. Wonka's latest candy inventions and see the testing process of experimental sweets!",
        price: 200, 
        duration: "1.5 hours", 
        image: "/images/invention-room.jpg", 
        availableDates: ["2023-11-16", "2023-11-23", "2023-11-30"],
        capacity: 15,
        remainingSeats: 8
      },
      { 
        id: 3, 
        name: "Oompa Loompa Village Visit", 
        description: "Meet the hardworking Oompa Loompas and learn about their candy-making techniques and culture.",
        price: 175, 
        duration: "3 hours", 
        image: "/images/oompa-loompa.jpg", 
        availableDates: ["2023-11-18", "2023-11-26"],
        capacity: 25,
        remainingSeats: 15
      },
      { 
        id: 4, 
        name: "Fizzy Lifting Drink Adventure", 
        description: "Experience the sensation of floating with Wonka's experimental fizzy lifting drinks!",
        price: 225, 
        duration: "1 hour", 
        image: "/images/fizzy-lifting.jpg", 
        availableDates: ["2023-11-19", "2023-11-24", "2023-11-29"],
        capacity: 10,
        remainingSeats: 4
      }
    ],
    selectedTour: null,
    selectedDate: null,
    selectedSeats: [],
    cart: [],
    myTickets: [],
    user: {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name: '',
      email: '',
      phone: ''
    }
  }),
  
  getters: {
    availableSeats() {
      if (!this.selectedTour) return [];
      
      const totalSeats = Array.from({ length: this.selectedTour.capacity }, (_, i) => ({
        id: i + 1,
        name: `Seat ${i + 1}`,
        price: this.selectedTour.price,
        available: i >= (this.selectedTour.capacity - this.selectedTour.remainingSeats)
      }));
      
      return totalSeats;
    },
    cartTotal() {
      return this.cart.reduce((total, item) => total + item.price, 0);
    }
  },
  
  actions: {
    selectTour(tourId) {
      this.selectedTour = this.tours.find(tour => tour.id === tourId);
      this.selectedDate = null;
      this.selectedSeats = [];
    },
    selectDate(date) {
      this.selectedDate = date;
    },
    toggleSeatSelection(seatId) {
      const seatIndex = this.selectedSeats.findIndex(seat => seat.id === seatId);
      
      if (seatIndex >= 0) {
        // Deselect seat
        this.selectedSeats.splice(seatIndex, 1);
      } else {
        // Select seat if available
        const seat = this.availableSeats.find(seat => seat.id === seatId);
        if (seat && seat.available) {
          this.selectedSeats.push(seat);
        }
      }
    },
    addToCart() {
      if (!this.selectedTour || !this.selectedDate || this.selectedSeats.length === 0) return;
      
      this.selectedSeats.forEach(seat => {
        this.cart.push({
          id: `${this.selectedTour.id}-${seat.id}-${Date.now()}`,
          tourId: this.selectedTour.id,
          tourName: this.selectedTour.name,
          date: this.selectedDate,
          seat: seat.name,
          price: seat.price
        });
      });
      
      // Update available seats for the selected tour
      const tour = this.tours.find(tour => tour.id === this.selectedTour.id);
      tour.remainingSeats -= this.selectedSeats.length;
      
      // Reset selections
      this.selectedSeats = [];
    },
    removeFromCart(itemId) {
      const itemIndex = this.cart.findIndex(item => item.id === itemId);
      if (itemIndex >= 0) {
        const item = this.cart[itemIndex];
        
        // Restore seat availability
        const tour = this.tours.find(tour => tour.id === item.tourId);
        tour.remainingSeats++;
        
        // Remove from cart
        this.cart.splice(itemIndex, 1);
      }
    },
    checkout(userInfo) {
      // Update user info
      this.user = { ...this.user, ...userInfo };
      
      // Convert cart items to tickets
      this.cart.forEach(item => {
        this.myTickets.push({
          ...item,
          purchaseDate: new Date().toISOString(),
          ticketCode: Math.random().toString(36).substring(2, 15)
        });
      });
      
      // Track purchase with Pendo
      if (window.pendo) {
        window.pendo.track('Purchase Completed', {
          totalAmount: this.cartTotal,
          itemCount: this.cart.length,
          tours: this.cart.map(item => item.tourName)
        });
      }
      
      // Empty cart
      this.cart = [];
    }
  }
}); 