<template>
     <ion-page>
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon  @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Privacy and Policy</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-card>
                <ion-card-header>
                    <ion-card-title>Privacy & Policy</ion-card-title>
                </ion-card-header>

                <ion-card-content v-html="privacy"/>
            </ion-card>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { 
    IonPage,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonContent,
    IonCardTitle

 } from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import axios from 'axios';
const privacy = ref('')
const settings = async () => {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_ENDPOINT+'settings/data', {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.data && response.data.privacy) {
            privacy.value = response.data.privacy.value;
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
};
onMounted(() => {
    settings()
})
</script>