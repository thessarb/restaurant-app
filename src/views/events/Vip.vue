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
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import TablesList from '@/components/tables/TablesList.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from "@/stores/authStore";
import { useRoute } from 'vue-router';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
const authStore = useAuthStore();
const locationId = ref('');
const route = useRoute();
const tables = ref([]);
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

    } catch (error) {
        console.error(error);
        authStore.logout();
    }
};

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
        authStore.logout();
    }
}

onMounted(() => {
    detail();
});  

</script>
