<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Back</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-grid class="login__container">
                <ion-row class="login__logo-container">
                    <img class="login__logo" src="/favicon.png" alt="Logo">
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-input v-model="email" type="email" color="primary" fill="outline" placeholder="Email">
                            <ion-icon slot="start" :icon="person" ></ion-icon>
                        </ion-input>                    
                    </ion-col>
                </ion-row>
                <p v-if="authStore.loginErrors?.message">{{ authStore.loginErrors.message }}</p>
                <ion-row>
                    <ion-col>
                        <ion-button @click="forgetPassword" color="primary" expand="block">Request Update Password</ion-button>
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

} from '@ionic/vue';
import { arrowBack, person } from 'ionicons/icons';
import { ref,watch } from 'vue';
import { useAuthStore } from "@/stores/authStore";
import axios from 'axios';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');

watch(email, () => updateData());
watch(password, () => updateData());

const updateData = () => {
    data.email = email.value;
    data.password = password.value;
};

const data = {
    email: email.value,
    password: password.value,
};

const forgetPassword = async (data: { email: string; password: string }) => {
    try {
        console.log(`${authStore.endpoint}forgot-password`, data);
        const response = await axios.post(`${authStore.endpoint}forgot-password`, data);
        if (response.data) {
            console.log(response)
        }
    } catch (error: any) {
        console.error('Error during login:', error);

    }
};
</script>
<style lang="css">

</style>