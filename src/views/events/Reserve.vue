<template>
    <ion-page aria-label="page" aria-hidden="false">
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon  @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Reserve {{ event?.name}}</ion-title>            
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="ion-padding">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Reserve {{ event?.name }}</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-card v-if="type == 'standart'" >
                <ion-card-content>
                    <ion-list lines="none">
                        <a target="_blank" :href="event.restaurant?.location">
                            <ion-item>
                                <ion-icon  :icon="map" slot="start"></ion-icon>
                                <ion-label>Location: {{ event?.restaurant?.name }}</ion-label>
                            </ion-item>
                        </a>
                        <ion-item>
                            <ion-icon  :icon="cash" slot="start"></ion-icon>
                            <ion-label>Price: {{ event.price_per_ticket }} $</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-icon  :icon="calendar" slot="start"></ion-icon>
                            <ion-label>Event: {{ event?.name }}</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-icon  :icon="calendarNumberOutline" slot="start"></ion-icon>
                            <ion-label>Date: {{ event?.date_start }}</ion-label>
                        </ion-item>
                    </ion-list>
                </ion-card-content>
                <ion-button v-if="event?.price_per_ticket" :disabled="process" color="primary" expand="block" @click="paymentFlow">Buy Ticket</ion-button>
                <ion-card class="ion-padding" id="checkout">
                </ion-card>
                <section v-if="success" id="success" class="hidden">
                    <p>
                        We appreciate your business! A confirmation email will be sent to <span id="customer-email"></span>.
                        If you have any questions, please email <a :href="'mailto:'+customerEmail">{{ customerEmail }}</a>.
                    </p>
                </section>
            </ion-card>
            <!-- <ReservationDialog v-else :event="event" /> -->
            <ion-row v-for="item in ticket" :key="item.id" class="ticket">
                <ion-col>
                    <ion-card>
                        <ion-card-title>
                           Ticket {{ item.status }}
                        </ion-card-title>
                        <ion-card-content>
                            <ion-list>
                                <ion-item>
                                    <ion-label>{{item.user.name}}</ion-label>
                                </ion-item>
                                <ion-item>
                                    <ion-label>{{item.price}} $</ion-label>
                                </ion-item>
                            </ion-list>
                        </ion-card-content>
                    </ion-card>
                </ion-col>
            </ion-row>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loadStripe, Stripe} from '@stripe/stripe-js';
import axios from 'axios';
import { useAuthStore } from "@/stores/authStore";
import { useRoute,useRouter } from 'vue-router'
import { arrowBack, calendar, calendarNumberOutline, cash, map} from 'ionicons/icons';
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
const router = useRouter();
const ticket = ref();
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

const initializeStripe = async () => {
    // const clientSecret = await fetchClientSecret();
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    if (stripe.value) {
        const ch = await stripe.value.initEmbeddedCheckout({
            fetchClientSecret,
        });

        // Mount Checkout
        ch.mount('#checkout');
        // const result = await stripe.value.redirectToCheckout({ sessionId: clientSecret });
        // if (result.error) {
        //     checkout.value = result.error;
        // } else {
        //     checkout.value = null;
        // }
    }
};
  
const fetchClientSecret = async () => {
    try {
        const response = await axios.post(import.meta.env.VITE_APP_ENDPOINT + 'stripe/checkout',
        {
            price: event.value.price_per_ticket+'00',
            name: 'Ticket for '+event.value.name, 
            app: 'andoid',
            event_id: event.value.id
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
  
const returnFunc = async (sessionId: string) => {

    try {
        const response = await axios.post(import.meta.env.VITE_APP_ENDPOINT + 'stripe/status',
            { session_id: sessionId },
            {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                }
            }
        );
        success.value = true
        const session = await response.data;
        if (session.status === 'open') {
          router.push({ path: '/checkout' });
        } else if (session.status === 'complete') {
            storeTicket();
            sessionStatus.value = 'complete';
            customerEmail.value = session.customer_email;
        }
    } catch (error) {
        console.error('Error fetching session status:', error);
    }
};
const paymentFlow = () => {
    initializeStripe();
}
const storeTicket = async () => {
    try {
        await axios.post(import.meta.env.VITE_APP_ENDPOINT + 'ticket/store',
        {
            event_id: event?.value?.id,
            user_id: authStore.user?.id,
            price: 50.00,
        },
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${authStore.token}`,
            }
        });
    } catch (error) {
        console.error('Ticket:', error);
    }
};
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
// Combine both mounted hooks into one to simplify async logic
onMounted(() => {
    detail();
    const route = useRoute();
    const rawSessionId = route.query.session_id;
    const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;

    if(sessionId){
        returnFunc(sessionId);
        getTicket();
    }
});  

</script>
<style scoped>
.ticket {
    border: 1px solid red;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 10px;
}
</style>