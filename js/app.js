const { createApp } = Vue;

createApp({
  data() {
    return {
      view: "shop",
      menuOpen: false,
      sortBy: "popular",
      toastMessage: "",
      toastTimer: null,
      checkoutStep: 0,
      orderNumber: Math.floor(100000 + Math.random() * 900000),
      filters: {
        query: "",
        categories: [],
        moods: [],
        materials: [],
        maxPrice: 200,
        minRating: 0,
        inStockOnly: false
      },
      customer: {
        name: "",
        email: "",
        address: "",
        city: ""
      },
      payment: {
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvc: ""
      },
      survey: {
        rating: "",
        comment: "",
        contact: false
      },
      surveySubmitted: false,
      cart: [],
      steps: ["Panier", "Informations", "Paiement", "Confirmation"],
      products: [
        {
          id: 1,
          name: "Lampe douce FocusGlow",
          category: "Éclairage",
          mood: "Calme",
          material: "Métal",
          price: 54.99,
          rating: 4.7,
          popularity: 98,
          stock: true,
          emoji: "💡",
          visualClass: "visual-yellow",
          description: "Une lampe ajustable avec lumière chaude pour réduire la fatigue visuelle pendant les longues sessions d’étude."
        },
        {
          id: 2,
          name: "Support laptop Éléva",
          category: "Ergonomie",
          mood: "Productif",
          material: "Aluminium",
          price: 64.99,
          rating: 4.8,
          popularity: 96,
          stock: true,
          emoji: "💻",
          visualClass: "visual-blue",
          description: "Support stable qui élève l’écran à hauteur des yeux pour améliorer la posture."
        },
        {
          id: 3,
          name: "Repose-poignet Nuage",
          category: "Confort",
          mood: "Calme",
          material: "Tissu",
          price: 29.99,
          rating: 4.4,
          popularity: 77,
          stock: true,
          emoji: "☁️",
          visualClass: "visual-teal",
          description: "Coussin doux pour soutenir les poignets pendant la prise de notes ou le codage."
        },
        {
          id: 4,
          name: "Organisateur ModuDesk",
          category: "Organisation",
          mood: "Minimaliste",
          material: "Bois",
          price: 44.99,
          rating: 4.5,
          popularity: 82,
          stock: true,
          emoji: "🗂️",
          visualClass: "visual-green",
          description: "Plateau modulaire pour ranger cahiers, câbles, stylos et petits accessoires."
        },
        {
          id: 5,
          name: "Station câbles CleanLine",
          category: "Organisation",
          mood: "Minimaliste",
          material: "Silicone",
          price: 24.99,
          rating: 4.2,
          popularity: 71,
          stock: true,
          emoji: "🔌",
          visualClass: "visual-slate",
          description: "Petite station adhésive pour éviter les câbles emmêlés et garder un bureau propre."
        },
        {
          id: 6,
          name: "Tapis de bureau ZenMat",
          category: "Confort",
          mood: "Calme",
          material: "Tissu",
          price: 39.99,
          rating: 4.6,
          popularity: 88,
          stock: true,
          emoji: "🧩",
          visualClass: "visual-purple",
          description: "Grand tapis doux qui définit une zone de travail claire et réduit le bruit des mouvements."
        },
        {
          id: 7,
          name: "Tablette murale MiniShelf",
          category: "Organisation",
          mood: "Productif",
          material: "Bois",
          price: 74.99,
          rating: 4.1,
          popularity: 62,
          stock: false,
          emoji: "📚",
          visualClass: "visual-green",
          description: "Tablette compacte pour libérer la surface du bureau sans perdre les objets importants."
        },
        {
          id: 8,
          name: "Minuteur Pomodoro Orb",
          category: "Productivité",
          mood: "Productif",
          material: "Plastique",
          price: 34.99,
          rating: 4.3,
          popularity: 74,
          stock: true,
          emoji: "⏱️",
          visualClass: "visual-teal",
          description: "Minuteur visuel pour alterner entre concentration et pauses sans dépendre du téléphone."
        },
        {
          id: 9,
          name: "Chaise compacte Align",
          category: "Ergonomie",
          mood: "Productif",
          material: "Tissu",
          price: 189.99,
          rating: 4.6,
          popularity: 85,
          stock: true,
          emoji: "🪑",
          visualClass: "visual-slate",
          description: "Chaise compacte avec soutien lombaire pour les petits espaces d’étude."
        },
        {
          id: 10,
          name: "Lampe Halo USB",
          category: "Éclairage",
          mood: "Minimaliste",
          material: "Aluminium",
          price: 49.99,
          rating: 4.0,
          popularity: 69,
          stock: true,
          emoji: "🌙",
          visualClass: "visual-blue",
          description: "Lampe USB mince avec trois intensités lumineuses et un style discret."
        }
      ]
    };
  },

  computed: {
    categories() {
      return [...new Set(this.products.map(product => product.category))].sort();
    },

    moods() {
      return [...new Set(this.products.map(product => product.mood))].sort();
    },

    materials() {
      return [...new Set(this.products.map(product => product.material))].sort();
    },

    filteredProducts() {
      const query = this.filters.query.trim().toLowerCase();

      return this.products.filter(product => {
        const matchesQuery = !query || [product.name, product.description, product.category, product.mood, product.material]
          .join(" ")
          .toLowerCase()
          .includes(query);

        const matchesCategory = this.filters.categories.length === 0 || this.filters.categories.includes(product.category);
        const matchesMood = this.filters.moods.length === 0 || this.filters.moods.includes(product.mood);
        const matchesMaterial = this.filters.materials.length === 0 || this.filters.materials.includes(product.material);
        const matchesPrice = product.price <= this.filters.maxPrice;
        const matchesRating = product.rating >= this.filters.minRating;
        const matchesStock = !this.filters.inStockOnly || product.stock;

        return matchesQuery && matchesCategory && matchesMood && matchesMaterial && matchesPrice && matchesRating && matchesStock;
      });
    },

    sortedProducts() {
      const products = [...this.filteredProducts];

      if (this.sortBy === "priceAsc") {
        return products.sort((a, b) => a.price - b.price);
      }

      if (this.sortBy === "priceDesc") {
        return products.sort((a, b) => b.price - a.price);
      }

      if (this.sortBy === "rating") {
        return products.sort((a, b) => b.rating - a.rating);
      }

      return products.sort((a, b) => b.popularity - a.popularity);
    },

    cartCount() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },

    cartTotal() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    activeFilterSummary() {
      const activeCount = this.filters.categories.length + this.filters.moods.length + this.filters.materials.length;

      if (!activeCount && !this.filters.query && this.filters.maxPrice === 200 && this.filters.minRating === 0 && !this.filters.inStockOnly) {
        return "Aucun filtre actif — tous les produits sont visibles.";
      }

      return `${activeCount} facette${activeCount > 1 ? "s" : ""} sélectionnée${activeCount > 1 ? "s" : ""}, budget max ${this.formatPrice(this.filters.maxPrice)}.`;
    }
  },

  methods: {
    formatPrice(value) {
      return new Intl.NumberFormat("fr-CA", {
        style: "currency",
        currency: "CAD"
      }).format(value);
    },

    setView(viewName) {
      this.view = viewName;
      this.menuOpen = false;
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    },

    scrollToSection(sectionId) {
      this.menuOpen = false;
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },

    resetFilters() {
      this.filters = {
        query: "",
        categories: [],
        moods: [],
        materials: [],
        maxPrice: 200,
        minRating: 0,
        inStockOnly: false
      };
      this.sortBy = "popular";
      this.showToast("Filtres réinitialisés.");
    },

    addToCart(product) {
      const existingItem = this.cart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }

      this.showToast(`${product.name} ajouté au panier.`);
    },

    quickAddBundle() {
      const bundleProductIds = [1, 2, 3];
      bundleProductIds.forEach(id => {
        const product = this.products.find(item => item.id === id);
        if (product && product.stock) {
          this.addToCart(product);
        }
      });
      this.setView("checkout");
    },

    increaseQuantity(productId) {
      const item = this.cart.find(product => product.id === productId);
      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity(productId) {
      const item = this.cart.find(product => product.id === productId);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.cart = this.cart.filter(product => product.id !== productId);
      }
    },

    goToPayment() {
      this.checkoutStep = 2;
      this.showToast("Informations enregistrées. Prochaine étape : paiement fictif.");
    },

    confirmOrder() {
      this.checkoutStep = 3;
      this.orderNumber = Math.floor(100000 + Math.random() * 900000);
      this.showToast("Commande confirmée.");
    },

    stepClass(index) {
      return {
        active: this.checkoutStep === index,
        done: this.checkoutStep > index
      };
    },

    submitSurvey() {
      this.surveySubmitted = true;
      this.showToast("Merci ! Ton avis a été reçu.");
    },

    showToast(message) {
      this.toastMessage = message;
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.toastMessage = "";
      }, 2200);
    }
  }
}).mount("#app");
