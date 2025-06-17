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
                        <p v-if="errors.email">{{ errors.email[0] }}</p>                   
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-input v-model="phone" color="primary" fill="outline" placeholder="Phone">
                            <ion-icon slot="start" :icon="call"></ion-icon>
                        </ion-input>
                        <p v-if="errors.phone">{{ errors.phone[0] }}</p>                   
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-button @click="profileUpdate" color="primary" expand="block">Update</ion-button>
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
    IonIcon
} from '@ionic/vue';
import { arrowBack, mailOutline, call } from 'ionicons/icons';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
interface FormErrors {
  email?: string[];
  phone?: string[];
  [key: string]: string[] | undefined;
}
const authStore = useAuthStore();
const email = ref(authStore.user?.email);
const phone = ref(authStore.user?.phone);
const success = ref('');
const errors = ref<FormErrors>({}); 

const profileUpdate = async () => {
    try {
        await axios.post(import.meta.env.VITE_APP_ENDPOINT +'profile/' +authStore.user?.id + '/details',
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
        success.value = 'Data updated successfully!'
        authStore.user = {
            ...authStore.user!,
            email: email.value ?? '',
            phone: phone.value ?? '',
        };
        email.value = authStore.user?.email;
        phone.value = authStore.user?.phone;
        // Update local storage
        await authStore.storeUser(authStore.user);
    } catch (error: any) {
        errors.value = error.response.data.errors
        console.error('Email or Phone:', error);
    }
};
</script>
<style lang="css">

</style>