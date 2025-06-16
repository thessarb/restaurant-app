<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon @click="$router.replace('/');" slot="start" :icon="arrowBack" size="large"></ion-icon>
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
                <ion-row>
                    <ion-col>
                        <ion-input v-model="password" color="primary" fill="outline" placeholder="Password" type="password">
                            <ion-icon slot="start" :icon="lockClosed"></ion-icon>
                            <ion-input-password-toggle color="primary" slot="end"></ion-input-password-toggle>
                        </ion-input>
                    </ion-col>
                </ion-row>
                <p v-if="authStore.loginErrors?.message">{{ authStore.loginErrors.message }}</p>
                <ion-row>
                    <ion-col>
                        <ion-button @click="login" color="primary" expand="block">Login</ion-button>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-button fill="outline" @click="router.push({path: 'register'})" color="primary" expand="block">Register</ion-button>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-button fill="clear" @click="router.push({path: 'forgot-password'})" color="primary" expand="block">Forgot Password?</ion-button>
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
import { arrowBack, lockClosed, person } from 'ionicons/icons';
import { ref,watch } from 'vue';
import { useAuthStore } from "@/stores/authStore";
import router from '@/router';

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

const login = async () => {
    try {
        await authStore.login(data);
        if (authStore.isAuthenticated) {
            email.value = '';
            password.value = '';
        }
    } catch (error:any) {
        console.log(error)
    }
};
</script>
<style lang="css">

</style>