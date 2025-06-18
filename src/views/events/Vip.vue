<template>
    <ion-page aria-label="page" aria-hidden="false">
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon  @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Choose table</ion-title>            
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="ion-padding">
            <TablesList v-if="locationId && tables" :location="String(locationId)" :tables="tables" :event="event" />
            <!-- <ReservationDialog v-else :event="event" /> -->
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import TablesList from '@/components/tables/TablesList.vue';
import { ref, onMounted } from 'vue';
// import { loadStripe, Stripe} from '@stripe/stripe-js';

import axios from 'axios';
import { useAuthStore } from "@/stores/authStore";
import { useRoute,useRouter } from 'vue-router';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
// const stripe = ref<Stripe | null>(null);
// const process = ref(false);
const authStore = useAuthStore();
const locationId = ref('');
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

const success = ref(false);
const route = useRoute();
const router = useRouter();
// const ticket = ref();
const tables = ref([]);
const detail = async () => {
    try {
        const response = await axios.get(`${authStore.endpoint}event/${route.params.id}`, {
            headers: {
                Accept: 'application/json',
            },
        });
        event.value = response.data.data;
        locationId.value = String(response.data.data?.restaurant_id);
        fetchTables(event.value?.restaurant_id);

        // ticket.value = getTicket()

    } catch (error) {
        console.error(error);
    }
};

// const initializeStripe = async () => {
//     // const clientSecret = await fetchClientSecret();
//     stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
//     if (stripe.value) {
//         const ch = await stripe.value.initEmbeddedCheckout({
//             fetchClientSecret,
//         });

//         // Mount Checkout
//         ch.mount('#checkout');
//         // const result = await stripe.value.redirectToCheckout({ sessionId: clientSecret });
//         // if (result.error) {
//         //     checkout.value = result.error;
//         // } else {
//         //     checkout.value = null;
//         // }
//     }
// };
  
// const fetchClientSecret = async () => {
//     try {
//         const response = await axios.post(import.meta.env.VITE_APP_ENDPOINT + 'stripe/checkout',
//         {
//             price: event.value.price_per_ticket+'00',
//             app: 'andoid'
//         },
//         {
//             headers: {
//                 "Accept": "application/json",
//                 "Authorization": `Bearer ${authStore.token}`,
//             }
//         });
//         const { clientSecret } = response.data;
//         process.value = true;
//         return clientSecret;
//     } catch (error) {
//         console.error('Error fetching client secret:', error);
//     }
// };


const fetchTables = async (restaurant: number | null | string) => {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_ENDPOINT + 'tables/'+ restaurant,
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${authStore.token}`,
            }
        });
        tables.value = response.data.tables;
    } catch (error) {
        console.error('Error fetching client secret:', error);
    }
}
// Combine both mounted hooks into one to simplify async logic
onMounted(() => {
    detail();
});  

</script>
