<template>
    <ion-page aria-label="page" aria-hidden="false">
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon  @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
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
                    </ion-list>
                </ion-card-content>
                <ion-button v-if="event?.price_per_ticket" :disabled="process" color="primary" expand="block" @click="paymentFlow">Buy Ticket</ion-button>
                <ion-card class="default-bg ion-padding" id="checkout">
                </ion-card>
                <section v-if="success" id="success" class="hidden">
                    <p>
                        We appreciate your business! A confirmation email will be sent to <span id="customer-email"></span>.
                        If you have any questions, please email <a :href="'mailto:'+customerEmail">{{ customerEmail }}</a>.
                    </p>
                </section>
            </ion-card>
            <!-- <ReservationDialog v-else :event="event" /> -->
            <ion-list class="reservation__items reservation__items--no-padding" lines="none">
                <ion-item v-for="item in ticket" :key="item.id" class="reservation__item reservation__item-card" @click="setOpen(true)">
                    <ion-col>
                        <ion-card class="reservation__item-bg">
                            <ion-card-title>
                                Ticket {{ item.status }}
                            </ion-card-title>
                            <ion-card-content class="reservation__item-bg">
                                <ion-list class="reservation__item-bg" lines="none">
                                    <ion-item class="reservation__item-bg">
                                        <ion-label>{{item.user.name}}</ion-label>
                                    </ion-item>
                                    <ion-item class="reservation__item-bg">
                                        <ion-label>{{item.price}} $</ion-label>
                                    </ion-item>
                                </ion-list>
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                </ion-item>
            </ion-list>
        </ion-content>
        <ion-modal ref="modal" :initial-breakpoint="0.85" :is-open="isTicketOpen">
            <ion-header>
                <ion-toolbar class="default-bg">
                    <ion-title>{{ event?.name }}</ion-title>
                    <ion-buttons slot="end">
                        <ion-button class="modal-button" @click="setOpen(false)">Close</ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <ion-row>
                    <ion-col>
                        <ion-list lines="none">
                            <a target="_blank" :href="event?.restaurant?.location">
                                <ion-item class="default-bg">
                                    <ion-icon aria-hidden="true" :icon="locationOutline" slot="start"></ion-icon>
                                    <ion-label>{{ event?.restaurant?.name }}</ion-label>
                                </ion-item>
                            </a>
                            <ion-item class="default-bg">
                                <ion-icon aria-hidden="true" :icon="calendarOutline" slot="start"></ion-icon>
                                <ion-label>{{ formatDate(event?.date_start) }}</ion-label>
                            </ion-item>
                            <ion-item class="default-bg">
                                <ion-icon aria-hidden="true" :icon="alarmOutline" slot="start"></ion-icon>
                                <ion-label>Starts at {{ formatTime(event?.date_start) }}</ion-label>
                            </ion-item>
                            <ion-item class="default-bg" v-if="event?.description">
                                {{ event?.description }}
                            </ion-item>
                        </ion-list>
                    </ion-col>
                </ion-row>
            </ion-content>
        </ion-modal>
    </ion-page>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loadStripe, Stripe} from '@stripe/stripe-js';
import axios from 'axios';
import { useAuthStore } from "@/stores/authStore";
import { useRoute,useRouter } from 'vue-router'
import { arrowBack, calendarOutline, calendarNumberOutline, cashOutline, mapOutline, alarmOutline, locationOutline, restaurant} from 'ionicons/icons';
import { 
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonIcon,
    IonButton,
    IonButtons,
    IonModal,
    IonCard,
    IonList,
    IonCardContent,
    IonItem,
    IonLabel,
    IonRow,
    IonCardTitle,
    IonCol
} from '@ionic/vue';
// import ReservationDialog from '@/components/events/ReservationDialog.vue';


const stripe = ref<Stripe | null>(null);
const process = ref(false);
const sessionStatus = ref('');
const customerEmail = ref('');
const authStore = useAuthStore();
interface Event {
  id: number;
  name: string;
  date_start: string;
  description: string;
  rules: string;
  nr_tikets: number;
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
  nr_tikets: 0,
  price_per_ticket: 0,
  restaurant_id: null,
  restaurant: null,
  created_at: "2025-03-29T12:17:50.000000Z",
  updated_at: "2025-03-29T12:17:50.000000Z",
  image: null
});

const type = ref('standart');
const success = ref(false);
const route = useRoute();
const ticket = ref();
const isTicketOpen = ref(false);
const detail = async () => {
    try {
        const response = await axios.get(`${authStore.endpoint}event/${route.params.id}`, {
            headers: {
                Accept: 'application/json',
            },
        });
        event.value = response.data.data
        ticket.value = await getTicket()

    } catch (error) {
        console.error(error);
    }
};

const formatDate = (dateString: string | undefined) => {
    // Ensure the dateString is in a valid format
    if (!dateString) return '01 January - Monday';
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = new Intl.DateTimeFormat("en", { month: "long" }).format(dateObj);
    const weekday = new Intl.DateTimeFormat("en", { weekday: "long" }).format(dateObj);

    return `${day} ${month} - ${weekday}`;
};

const formatTime = (dateString: string | undefined): string => {
    if (!dateString) return '00:00';
    
    const dateObj = new Date(dateString.replace(' ', 'T')); // Convert to ISO format

    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
};

const setOpen = (open: boolean) => (isTicketOpen.value = open);

const initializeStripe = async () => {
    // const clientSecret = await fetchClientSecret();
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    if (stripe.value) {
        const ch = await stripe.value.initEmbeddedCheckout({
            fetchClientSecret,
        });

        // Mount Checkout
        ch.mount('#checkout');
    }
};
  
const fetchClientSecret = async () => {
    try {
        const response = await axios.post(import.meta.env.VITE_APP_ENDPOINT + 'stripe/checkout',
        {
            price: event.value.price_per_ticket+'00',
            name: 'Ticket for '+event.value.name, 
            event_id: event.value.id,
            restaurant_id: event.value.restaurant_id,
            user_id: authStore.user?.id,
        },
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
    }
};
  

const paymentFlow = () => {
    initializeStripe();
}

const getTicket = async () => {
    try {
       const response =  await axios.get(import.meta.env.VITE_APP_ENDPOINT + `ticket?user_id=${authStore?.user?.id}&event_id=${event.value.id}`,
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${authStore.token}`,
            }
        });
        return response.data.ticket;
    } catch (error) {
        console.error('Error fetching client secret:', error);
    }
}

onMounted(() => {
    detail();
});  

</script>
