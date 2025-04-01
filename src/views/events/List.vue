<template>
  <ion-page>
    <ion-content :fullscreen="true">
        <EventsList :events="events"/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import EventsList from '@/components/events/EventsList.vue';
import axios from 'axios';
import { useAuthStore } from "@/stores/authStore";
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const events = ref([]);
const list = async () => {
    try {
        const response = await axios.get(`${authStore.endpoint}event`, {
            headers: {
                Accept: 'application/json',
            },
        });
        events.value = response.data.events
    } catch (error) {
        console.error(error);
    }
};  
onMounted(() => {
    list();
});
</script>
