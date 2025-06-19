<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title class="ion-text-center">Reservation detail</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                <ion-title size="large">Reservation detail</ion-title>
                </ion-toolbar>
            </ion-header>
        </ion-content>
    </ion-page>
</template>
  
<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import axios from 'axios';
import { useAuthStore } from "@/stores/authStore";
import { useRoute } from 'vue-router'

const authStore = useAuthStore();
const route =  useRoute(); 
const detail = async () => {
    try {
        await axios.get(`${authStore.endpoint}/${route.params.id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${authStore.token}`,
            },
        });

    } catch (error) {
        console.error(error);
        authStore.logout();
    }
};
</script>
  