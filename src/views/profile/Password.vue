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
                        <p v-if="errors.password">{{ errors.password[0] }}</p>
                    </ion-input>                    
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <ion-input v-model="password_confirmation" color="primary" fill="outline" placeholder="Confirm your password" type="password">
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
            <p v-if="success">{{ success }}</p>
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
const password_confirmation = ref('');
const success = ref('');
interface FormErrors {
  password?: string[];  // Email errors
  [key: string]: string[] | undefined; // Additional dynamic keys if needed
}
const errors = ref<FormErrors>({}); 

const passwordUpdate = async () => {
    try {
        const response = await axios.post(import.meta.env.VITE_APP_ENDPOINT +'profile/' +authStore.user?.id + '/password',
        {
            password: password.value,
            password_confirmation: password_confirmation.value
        },
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${authStore.token}`,
            }
        });
        console.log(response)
        success.value = 'Password updated successful!'
        password.value = ''
        password_confirmation.value = ''
    } catch (error: any) {
        errors.value = error.response.data.errors;
    }
};
</script>
<style lang="css">

</style>