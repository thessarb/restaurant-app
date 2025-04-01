<template>
    <ion-page>
    <ion-header>
        <ion-toolbar class="ionic__toolbar">
            <ion-icon @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
            <ion-title class="ion-text-left">Security</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
        <ion-grid class="security__container">
            <ion-row>
                <ion-col>
                    <ion-input v-model="password" fill="outline" placeholder="Enter your password" type="password">
                        <ion-icon slot="start" :icon="lockClosed"></ion-icon>
                        <ion-input-password-toggle color="primary" slot="end"></ion-input-password-toggle>
                    </ion-input>                    
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <ion-input v-model="password_confirm" color="primary" fill="outline" placeholder="Confirm your password" type="password">
                        <ion-icon slot="start" :icon="lockClosed"></ion-icon>
                        <ion-input-password-toggle color="primary" slot="end"></ion-input-password-toggle>
                    </ion-input>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <ion-button @click="passwordUpdate" color="primary" expand="block">Change password</ion-button>
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
IonIcon,
IonInputPasswordToggle
} from '@ionic/vue';
import { arrowBack, lockClosed } from 'ionicons/icons';
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
const authStore = useAuthStore();
const password = ref('');
const password_confirm = ref('');
const success = ref('');
const passwordUpdate = async () => {
    try {
        await axios.put(import.meta.env.VITE_APP_ENDPOINT +'/user/' +authStore.user?.id + '/update',
        {
            password: password,
            password_confirm: password_confirm
        },
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${authStore.token}`,
            }
        });
        success.value = 'Password updated successful!'
        password.value = ''
        password_confirm.value = ''
    } catch (error) {
        console.error('Password:', error);
    }
};
</script>
<style lang="css">

</style>