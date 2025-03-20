<template>
    <ion-page aria-label="page" aria-hidden="false">
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon  @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Event detail</ion-title>            
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
            <ion-toolbar>
                <ion-title size="large">Event detail</ion-title>
            </ion-toolbar>
            </ion-header>
            <EventDetail :event="event"/>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonIcon } from '@ionic/vue';
import axios from 'axios';
import { useAuthStore } from "@/stores/authStore";
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue';
import { arrowBack } from 'ionicons/icons';
import EventDetail from '@/components/events/EventDetail.vue';

const authStore = useAuthStore();
const route =  useRoute(); 
const event = ref({});
const detail = async () => {
    try {
        const response = await axios.get(`${authStore.endpoint}event/${route.params.id}`, {
            headers: {
                Accept: 'application/json',
            },
        });
        event.value = response.data.data
    } catch (error) {
        console.error(error);
    }
};  
onMounted(() => {
    detail();
});
</script>
  