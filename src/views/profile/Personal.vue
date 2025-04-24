<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon  @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Personal Information</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-grid class="personalinfo__container">
                <ion-row>
                    <ion-col>
                        <ion-input v-model="email" fill="outline" placeholder="Email">
                            <ion-icon slot="start" :icon="mailOutline"></ion-icon>
                        </ion-input>                    
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-input v-model="phone" color="primary" fill="outline" placeholder="Phone">
                            <ion-icon slot="start" :icon="call"></ion-icon>
                        </ion-input>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-button @click="profileUpdate" color="primary" expand="block">Update</ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid> 
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonIcon
} from '@ionic/vue';
import { arrowBack, mailOutline, call, camera } from 'ionicons/icons';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
const authStore = useAuthStore();
const email = ref(authStore.user?.email);
const phone = ref(authStore.user?.phone);
const success = ref('');
const profileUpdate = async () => {
    try {
        await axios.put(import.meta.env.VITE_APP_ENDPOINT +'/user/' +authStore.user?.id + '/update',
        {
            phone: phone.value,
            email:  email.value,
        },
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${authStore.token}`,
            }
        });
        success.value = 'Data updated successful!'
    } catch (error) {
        console.error('Email or Phone:', error);
    }
};
</script>
<style lang="css">

</style>