<template>
    <ion-page aria-label="page" aria-hidden="false">
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Reserve {{ event?.name }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="ion-padding">
            <ion-grid class="reserve__type-container">
                <ion-row class="reserve__type-grid">
                    <router-link :to="{ name: 'reserve', params: { id: event.id } }">
                        <ion-col class="reserve__type-col">
                            <ion-card class="reserve__type">
                                <ion-card-content class="reserve__type-button">
                                    <ion-card-title class="reserve__type-title">General admissions</ion-card-title>
                                    <ion-icon class="reserve__type-icon" :icon="ticket" size="large"></ion-icon>
                                </ion-card-content>
                            </ion-card>
                        </ion-col>
                    </router-link>

                    <router-link :to="{ name: 'reservevip', params: { id: event.id } }">
                        <ion-col class="reserve__type-col">
                            <ion-card class="reserve__type">
                                <ion-card-content class="reserve__type-button">
                                    <ion-card-title class="reserve__type-title">VIP admissions</ion-card-title>
                                    <ion-icon class="reserve__type-icon" :icon="diamond" size="large"></ion-icon>
                                </ion-card-content>
                            </ion-card>
                        </ion-col>
                    </router-link>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonGrid,
    IonCol,
    IonRow,
    IonCard,
    IonCardTitle,
    IonCardContent
} from '@ionic/vue';
import axios from 'axios';
import { useAuthStore } from "@/stores/authStore";
import { useRoute } from 'vue-router'
import { arrowBack, diamond, ticket } from 'ionicons/icons';

const authStore = useAuthStore();
interface Event {
    id: number;
    name: string;
    date_start: string;
    description: string;
    rules: string;
    nr_tikets: number;
    restaurant_id: number | null;
    created_at: string;
    updated_at: string;
    image: string | null;
}

const event = ref<Event>({
    id: 8,
    name: "Pizza Night",
    date_start: "2025-05-13 12:17:50",
    description: "Indulge in a variety of delicious pizzas made fresh from our oven.",
    rules: "Take-out options available.",
    nr_tikets: 0,
    restaurant_id: null,
    created_at: "2025-03-29T12:17:50.000000Z",
    updated_at: "2025-03-29T12:17:50.000000Z",
    image: null
});

const route = useRoute();

const detail = async () => {
    try {
        const response = await axios.get(`${authStore.endpoint}event/${route.params.id}`, {
            headers: {
                Accept: 'application/json',
            },
        });
        event.value = response.data.data;
    } catch (error) {
        console.error(error);
        authStore.logout();
    }
};

onMounted(() => {
    detail();
});

</script>
