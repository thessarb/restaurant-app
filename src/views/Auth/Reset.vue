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
                    <ion-input v-model="email" fill="outline" placeholder="Enter your email" type="email">
                        <ion-icon slot="start" :icon="mail"></ion-icon>
                    </ion-input>                    
                </ion-col>
            </ion-row>
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
                    <ion-input v-model="password_confirmation" color="primary" fill="outline" placeholder="Confirm your password" type="password">
                        <ion-icon slot="start" :icon="lockClosed"></ion-icon>
                        <ion-input-password-toggle color="primary" slot="end"></ion-input-password-toggle>
                    </ion-input>
                </ion-col>
            </ion-row>
            <ion-toast
                :is-open="showToast"
                :message="toastMessage"
                duration="2000"
                color="danger"
                @didDismiss="showToast = false">
                </ion-toast>
            <ion-row>
                <ion-col>
                    <ion-button @click="resetPassword" color="primary" expand="block">Continue</ion-button>
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
IonInputPasswordToggle,
IonToast
} from '@ionic/vue';
import { arrowBack, lockClosed, mail } from 'ionicons/icons';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
const password = ref()
const email = ref()
const password_confirmation = ref()
const showToast = ref(false);
const toastMessage = ref('');
const run = ref(false)
const validateForm = () => {
    if (!password.value || !password_confirmation.value) {
        toastMessage.value = 'Please fill in all required fields.';
        showToast.value = true;
        run.value =false
    } else if (password.value !== password_confirmation.value) {
        toastMessage.value = 'Passwords do not match.';
        showToast.value = true;
        run.value = false;
    }else{
        run.value = true
    }
}
const authStore = useAuthStore();
const resetPassword = async () => {
    validateForm();
    if (!run.value) return;

    try {
        const response = await axios.post(import.meta.env.VITE_APP_ENDPOINT + 'reset-password', {
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
        });

        toastMessage.value = response.data.message;
        showToast.value = true;
        authStore.login({
        email: email.value,
        password: password.value,
        });
    } catch (error: any) {
        const message = error.response?.data?.message || 'An error occurred';
        toastMessage.value = message;
        showToast.value = true;
    }
};
</script>
<style lang="css">

</style>