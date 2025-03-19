<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-icon @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Back</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-input v-model="email"  color="tertiary" fill="outline" placeholder="Email">
                            <ion-icon slot="start" :icon="person" ></ion-icon>
                        </ion-input>                    
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-input v-model="password" color="tertiary" fill="outline" placeholder="Password" type="password">
                            <ion-icon slot="start" :icon="lockClosed"></ion-icon>
                            <ion-input-password-toggle color="tertiary" slot="end"></ion-input-password-toggle>
                        </ion-input>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-button @click="login" color="tertiary" expand="block">Login</ion-button>
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
        } else {
            console.log('Login failed');
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
};
</script>
<style lang="css">

</style>