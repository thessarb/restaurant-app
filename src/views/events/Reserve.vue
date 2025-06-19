<template>
    <ion-page aria-label="page" aria-hidden="false">
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon  @click="arrowBackAction" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Buy tickets</ion-title>            
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="ion-padding">
            <ion-card class="default-bg" v-if="type == 'standart'" >
                <ion-card-content>
                    <ion-list lines="none">
                        <a target="_blank" :href="event.restaurant?.location">
                            <ion-item class="default-bg">
                                <ion-icon  :icon="mapOutline" slot="start"></ion-icon>
                                <ion-label>Location: {{ event?.restaurant?.name }}</ion-label>
                            </ion-item>
                        </a>
                        <ion-item class="default-bg">
                            <ion-icon  :icon="cashOutline" slot="start"></ion-icon>
                            <ion-label>Price: {{ event.price_per_ticket }} $</ion-label>
                        </ion-item>
                        <ion-item class="default-bg">
                            <ion-icon  :icon="calendarOutline" slot="start"></ion-icon>
                            <ion-label>Event: {{ event?.name }}</ion-label>
                        </ion-item>
                        <ion-item class="default-bg">
                            <ion-icon  :icon="calendarNumberOutline" slot="start"></ion-icon>
                            <ion-label>Date: {{ event?.date_start }}</ion-label>
                        </ion-item>
                        <ion-item class="default-bg">
                            <ion-icon  :icon="ticketOutline" slot="start"></ion-icon>
                            <ion-label>Available tickets: {{ tickets }}</ion-label>
                        </ion-item>
                    </ion-list>
                </ion-card-content>
                <ion-button v-if="event?.price_per_ticket && tickets > 0" :disabled="process" color="primary" expand="block" @click="paymentFlow">Buy Ticket</ion-button>
                <ion-card class="default-bg ion-padding" id="checkout">
                </ion-card>
                <section v-if="success" id="success" class="hidden">
                    <p>
                        We appreciate your business! A confirmation email will be sent to <span id="customer-email"></span>.
                        If you have any questions, please email via <a :href="'mailto:'+customerEmail">{{ customerEmail }}</a> to <a href="mailto:admin@email.com">admin@email.com</a>.
                    </p>
                </section>
            </ion-card>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loadStripe, Stripe, StripeEmbeddedCheckout} from '@stripe/stripe-js';
import axios from 'axios';
import { useAuthStore } from "@/stores/authStore";
import { useRoute, useRouter } from 'vue-router'
import { arrowBack, calendarOutline, calendarNumberOutline, cashOutline, mapOutline, ticketOutline} from 'ionicons/icons';
import { 
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonIcon,
    IonButton,
    IonCard,
    IonList,
    IonCardContent,
    IonItem,
    IonLabel
} from '@ionic/vue';
// import ReservationDialog from '@/components/events/ReservationDialog.vue';

const stripe = ref<Stripe | null>(null);
const process = ref(false);
const customerEmail = ref('');
const authStore = useAuthStore();
const type = ref('standart');
const success = ref(false);
const route = useRoute();
const tickets = ref(0);
const ticket = ref<Object | null>();

interface Event {
  id: number;
  name: string;
  date_start: string;
  description: string;
  rules: string;
  nr_tickets: number;
  price_per_ticket: number;
  restaurant_id: number | null;
  restaurant: Restaurant | null;
  created_at: string;
  updated_at: string;
  image: string | null;
}

interface Restaurant {
    id: number;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
}

const event = ref<Event>({
  id: 8,
  name: "Pizza Night",
  date_start: "2025-05-13 12:17:50",
  description: "Indulge in a variety of delicious pizzas made fresh from our oven.",
  rules: "Take-out options available.",
  nr_tickets: 0,
  price_per_ticket: 0,
  restaurant_id: null,
  restaurant: null,
  created_at: "2025-03-29T12:17:50.000000Z",
  updated_at: "2025-03-29T12:17:50.000000Z",
  image: null
});

const detail = async () => {
    try {
        const response = await axios.get(`${authStore.endpoint}event/${route.params.id}`, {
            headers: {
                Accept: 'application/json',
            },
        });
        event.value = response.data.data;
        checkReservedTickets();
    } catch (error) {
        console.error(error);
        authStore.logout();
    }
};

const checkReservedTickets = async () => {
    try {
        const response = await axios.get(`${authStore.endpoint}reservation/check/availability/tickets?event_id=${event.value.id}`, {
            headers: {
                Accept: 'application/json',
                "Authorization": `Bearer ${authStore.token}`,
            },
        });
        tickets.value = event.value?.nr_tickets - parseInt(response.data.available.length);

    } catch (error) {
        console.error(error);
        authStore.logout();
    }
};
const embedStripe = ref<StripeEmbeddedCheckout | null>(null);
const initializeStripe = async () => {
    // const clientSecret = await fetchClientSecret();
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    if (stripe.value) {
        const ch = await stripe.value.initEmbeddedCheckout({
            fetchClientSecret,
        });

        // Mount Checkout
        ch.mount('#checkout');
        embedStripe.value = ch;
    }
};
  
const fetchClientSecret = async () => {
    try {
        if (authStore?.user?.gender === 'male' || authStore?.user?.gender === null) {
            ticket.value = {
                price: event.value.price_per_ticket + '0000',
                name: 'Ticket for ' + event.value.name, 
                event_id: event.value.id,
                male: 1,
                female: 0,
                restaurant_id: event.value.restaurant_id,
                user_id: authStore.user?.id,
            };
        } else if (authStore?.user?.gender === 'female') {
            ticket.value = {
                price: event.value.price_per_ticket + '0000',
                name: 'Ticket for ' + event.value.name,
                male: 0,
                female: 1,
                event_id: event.value.id,
                restaurant_id: event.value.restaurant_id,
                user_id: authStore.user?.id,
            };
        }
        const response = await axios.post(import.meta.env.VITE_APP_ENDPOINT + 'stripe/checkout',
        ticket.value,
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${authStore.token}`,
            }
        });
        const { clientSecret } = response.data;
        process.value = true;
        return clientSecret;
    } catch (error) {
        console.error('Error fetching client secret:', error);
        authStore.logout();
    }
};

const paymentFlow = () => {
    initializeStripe();
}
const router = useRouter();
const arrowBackAction = () => {
    router.go(-2);
    embedStripe.value?.destroy();
};

onMounted(() => {
    detail();
});  

</script>
