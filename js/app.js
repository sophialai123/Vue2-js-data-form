//All Vue apps are instances of the Vue class provided by the imported Vue library
const app = new Vue({
  el: '#app',
  data: {
    firstName: '',
    lastName: '',
    email: '',
    ticketQuantity: 1,
    ticketType: 'general',
    referrals: [],
    specialRequests: '',
    purchaseAgreementSigned: false
  },
  /* Computed Property Setters update the necessary data 
    values if a computed value ever changes! */
  computed: {
    fullName: {
      get: function () {
        if (this.firstName && this.lastName) {
          return this.firstName + ' ' + this.lastName;
        } else {
          return this.firstName || this.lastName;
        }
      },
      set: function (newFullName) {
        const names = newFullName.split(' ');
        if (names.length === 2) {
          this.firstName = names[0];
          this.lastName = names[1];
        }
        if (names.length <= 1) {
          this.firstName = names[0] || '';
          this.lastName = '';
        }
      }
    },
    ticketDescription: function () {
      let readableTicketType = 'General Admission';
      if (this.ticketType === 'vip') {
        readableTicketType = 'VIP';
      }
      let ticketPluralization = 'tickets';
      if (this.ticketQuantity === 1) {
        ticketPluralization = 'ticket';
      }
      return this.ticketQuantity + ' ' + readableTicketType + ' ' + ticketPluralization;
    }
  },
  //watch specialRequests for changes.
  /*  Whenever a user types "meet and greet" 
  or "meet-and-greet" into the special  requests field */
  watch: {
    specialRequests: function (newRequests, oldRequests) {
      if (newRequests.toLowerCase().includes('meet and greet') || newRequests.toLowerCase().includes('meet-and-greet')) {
        this.ticketType = 'vip';
      }
    }
  },
  /* add a method that will clear all of our dynamic data. */
  methods: {
    resetFields: function () {
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.ticketQuantity = 1;
      this.ticketType = 'general';
      this.referrals = [];
      this.specialRequests = '';
      this.purchaseAgreementSigned = false;
    }
  }
});