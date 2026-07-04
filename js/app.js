const { createApp } = Vue;

createApp({
  data() {
    return {
      scenarioMode: false,
      checkoutStep: 1,

      checkoutSteps: [
        { number: 1, label: "Panier" },
        { number: 2, label: "Informations" },
        { number: 3, label: "Paiement" },
        { number: 4, label: "Confirmation" }
      ],

      products: [
        {
          id: "lampe-focus",
          name: "Lampe douce FocusGlow",
          category: "Éclairage",
          price: 59.99,
          color: "Blanc",
          comfort: "Confort",
          rating: 4.8,
          popular: 98,
          icon: "💡",
          deal: true,
          description: "Lampe de bureau avec lumière douce pour réduire la fatigue visuelle."
        },
        {
          id: "support-eleva",
          name: "Support laptop Éléva",
          category: "Ergonomie",
          price: 74.99,
          color: "Argent",
          comfort: "Premium",
          rating: 4.7,
          popular: 94,
          icon: "💻",
          deal: true,
          description: "Support ajustable pour placer l’écran à une hauteur plus confortable."
        },
        {
          id: "repose-nuage",
          name: "Repose-poignet Nuage",
          category: "Ergonomie",
          price: 29.99,
          color: "Bleu",
          comfort: "Confort",
          rating: 4.6,
          popular: 89,
          icon: "☁️",
          deal: true,
          description: "Coussin doux pour soutenir les poignets pendant les longues sessions."
        },
        {
          id: "organiseur-clair",
          name: "Organiseur Clair",
          category: "Rangement",
          price: 39.99,
          color: "Blanc",
          comfort: "Essentiel",
          rating: 4.3,
          popular: 78,
          icon: "🗂️",
          deal: false,
          description: "Petit rangement de bureau pour garder les notes et accessoires visibles."
        },
        {
          id: "tapis-calm",
          name: "Tapis de bureau CalmDesk",
          category: "Confort",
          price: 44.99,
          color: "Bleu",
          comfort: "Confort",
          rating: 4.5,
          popular: 84,
          icon: "🟦",
          deal: false,
          description: "Grand tapis doux pour protéger le bureau et améliorer le confort."
        },
        {
          id: "chaise-milo",
          name: "Coussin lombaire Milo",
          category: "Ergonomie",
          price: 49.99,
          color: "Noir",
          comfort: "Premium",
          rating: 4.7,
          popular: 91,
          icon: "🪑",
          deal: false,
          description: "Support lombaire pour améliorer la posture pendant les longues journées."
        },
        {
          id: "plante-zen",
          name: "Plante décorative Zen",
          category: "Décoration",
          price: 24.99,
          color: "Vert",
          comfort: "Essentiel",
          rating: 4.2,
          popular: 64,
          icon: "🌿",
          deal: false,
          description: "Petite plante artificielle pour ajouter une touche calme au bureau."
        },
        {
          id: "casque-silence",
          name: "Casque Silence Study",
          category: "Concentration",
          price: 119.99,
          color: "Noir",
          comfort: "Premium",
          rating: 4.9,
          popular: 99,
          icon: "🎧",
          deal: false,
          description: "Casque confortable pour mieux se concentrer dans un environnement bruyant."
        },
        {
          id: "minuterie-focus",
          name: "Minuterie Focus 25",
          category: "Concentration",
          price: 34.99,
          color: "Blanc",
          comfort: "Essentiel",
          rating: 4.4,
          popular: 73,
          icon: "⏱️",
          deal: false,
          description: "Minuterie simple pour organiser les périodes d’étude et les pauses."
        }
      ],

      filters: {
        search: "",
        category: "Tous",
        maxPrice: 180,
        colors: [],
        comfort: "Tous",
        minRating: 0,
        sort: "popular"
      },

      cart: [],

      customer: {
        name: "",
        email: "",
        address: "",
        city: "",
        postal: ""
      },

      payment: {
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvc: ""
      },

      survey: {
        rating: "5",
        comment: ""
      },

      surveySubmitted: false
    };
  },

  computed: {
    categories() {
      return [...new Set(this.products.map(product => product.category))];
    },

    colors() {
      return [...new Set(this.products.map(product => product.color))];
    },

    filteredProducts() {
      let results = this.products.filter(product => {
        const searchMatch =
          this.filters.search.trim() === "" ||
          product.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          product.description.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          product.category.toLowerCase().includes(this.filters.search.toLowerCase());

        const categoryMatch =
          this.filters.category === "Tous" ||
          product.category === this.filters.category;

        const priceMatch = product.price <= this.filters.maxPrice;

        const colorMatch =
          this.filters.colors.length === 0 ||
          this.filters.colors.includes(product.color);

        const comfortMatch =
          this.filters.comfort === "Tous" ||
          product.comfort === this.filters.comfort;

        const ratingMatch = product.rating >= this.filters.minRating;

        return searchMatch && categoryMatch && priceMatch && colorMatch && comfortMatch && ratingMatch;
      });

      if (this.filters.sort === "priceLow") {
        results.sort((a, b) => a.price - b.price);
      } else if (this.filters.sort === "priceHigh") {
        results.sort((a, b) => b.price - a.price);
      } else if (this.filters.sort === "rating") {
        results.sort((a, b) => b.rating - a.rating);
      } else {
        results.sort((a, b) => b.popular - a.popular);
      }

      return results;
    },

    cartCount() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },

    subtotal() {
      return this.cart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },

    hasDeal() {
      const requiredDealItems = ["lampe-focus", "support-eleva", "repose-nuage"];

      return requiredDealItems.every(requiredId => {
        return this.cart.some(item => item.id === requiredId && item.quantity > 0);
      });
    },

    dealSubtotal() {
      if (!this.hasDeal) {
        return 0;
      }

      const requiredDealItems = ["lampe-focus", "support-eleva", "repose-nuage"];

      return this.cart.reduce((total, item) => {
        if (requiredDealItems.includes(item.id)) {
          return total + item.price * item.quantity;
        }

        return total;
      }, 0);
    },

    discount() {
      if (!this.hasDeal) {
        return 0;
      }

      return this.dealSubtotal * 0.2;
    },

    shipping() {
      const afterDiscount = this.subtotal - this.discount;

      if (this.cart.length === 0) {
        return 0;
      }

      if (afterDiscount >= 100) {
        return 0;
      }

      return 9.99;
    },

    taxes() {
      return (this.subtotal - this.discount + this.shipping) * 0.13;
    },

    total() {
      return this.subtotal - this.discount + this.shipping + this.taxes;
    },

    progressWidth() {
      const progress = ((this.checkoutStep - 1) / 3) * 100;
      return `${progress}%`;
    }
  },

  watch: {
    cart: {
      handler(newCart) {
        localStorage.setItem("bureauzen-cart", JSON.stringify(newCart));
      },
      deep: true
    }
  },

  mounted() {
    const savedCart = localStorage.getItem("bureauzen-cart");

    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  },

  methods: {
    formatMoney(value) {
      return new Intl.NumberFormat("fr-CA", {
        style: "currency",
        currency: "CAD"
      }).format(value);
    },

    scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },

    startScenario() {
      this.scenarioMode = true;

      this.filters.search = "";
      this.filters.category = "Ergonomie";
      this.filters.maxPrice = 90;
      this.filters.colors = ["Bleu", "Blanc", "Argent"];
      this.filters.comfort = "Tous";
      this.filters.minRating = 4.5;
      this.filters.sort = "rating";

      this.scrollToSection("boutique");
    },

    resetFilters() {
      this.scenarioMode = false;

      this.filters = {
        search: "",
        category: "Tous",
        maxPrice: 180,
        colors: [],
        comfort: "Tous",
        minRating: 0,
        sort: "popular"
      };
    },

    addToCart(product) {
      const existingItem = this.cart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({
          ...product,
          quantity: 1
        });
      }
    },

    addDealBundle() {
      const dealIds = ["lampe-focus", "support-eleva", "repose-nuage"];

      dealIds.forEach(id => {
        const product = this.products.find(product => product.id === id);

        if (product) {
          this.addToCart(product);
        }
      });

      this.checkoutStep = 1;
      this.scrollToSection("panier");
    },

    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.id !== productId);

      if (this.cart.length === 0) {
        this.checkoutStep = 1;
      }
    },

    increaseQuantity(productId) {
      const item = this.cart.find(item => item.id === productId);

      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity(productId) {
      const item = this.cart.find(item => item.id === productId);

      if (!item) {
        return;
      }

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeFromCart(productId);
      }
    },

    nextStep() {
      if (this.checkoutStep === 1 && this.cart.length === 0) {
        alert("Ajoutez au moins un produit avant de continuer.");
        return;
      }

      if (this.checkoutStep === 2 && !this.customerInfoIsValid()) {
        alert("Veuillez remplir les informations personnelles avant de continuer.");
        return;
      }

      if (this.checkoutStep === 3 && !this.paymentInfoIsValid()) {
        alert("Veuillez remplir les informations de paiement fictif avant de confirmer.");
        return;
      }

      if (this.checkoutStep < 4) {
        this.checkoutStep += 1;
        this.scrollToSection("panier");
      }
    },

    previousStep() {
      if (this.checkoutStep > 1) {
        this.checkoutStep -= 1;
        this.scrollToSection("panier");
      }
    },

    customerInfoIsValid() {
      return (
        this.customer.name.trim() !== "" &&
        this.customer.email.trim() !== "" &&
        this.customer.address.trim() !== "" &&
        this.customer.city.trim() !== "" &&
        this.customer.postal.trim() !== ""
      );
    },

    paymentInfoIsValid() {
      return (
        this.payment.cardName.trim() !== "" &&
        this.payment.cardNumber.trim() !== "" &&
        this.payment.expiry.trim() !== "" &&
        this.payment.cvc.trim() !== ""
      );
    },

    submitSurvey() {
      this.surveySubmitted = true;
    }
  }
}).mount("#app");