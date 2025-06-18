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
                        <ion-button @click="continueRegister" color="primary" expand="block">Continue</ion-button>
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
import { arrowBack, lockClosed } from 'ionicons/icons';
import { ref } from 'vue';
import { useAuthStore } from "@/stores/authStore";
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter();
const authStore = useAuthStore();
const password = ref()
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
const continueRegister = async () => {
    try {
        validateForm();

        authStore.registerData = {
            name: authStore.registerData?.name,
            surname: authStore.registerData?.surname,
            gender: authStore.registerData?.gender,
            email: authStore.registerData?.email,
            phone: authStore.registerData?.phone,
            password: password.value,
            password_confirmation: password_confirmation.value
        };
        if (run.value) {
            try {
                console.log('imnit')

                const response = await axios.post(authStore.endpoint + 'register', {
                    name: authStore.registerData.name,
                    surname: authStore.registerData.surname,
                    email: authStore.registerData.email,
                    phone: authStore.registerData.phone,
                    gender: authStore.registerData.gender,
                    password: authStore.registerData.password,
                    password_confirmation: authStore.registerData.password_confirmation
                });

                if (response.status === 200 || response.status === 201) {
                    showToast.value = true;
                    toastMessage.value = response.data?.message || 'Registration successful. Please verify your email.';
                    authStore.registerData = {
                        name: '',
                        surname: '',
                        gender: '',
                        email: '',
                        phone: '',
                        password: '',
                        password_confirmation: ''
                    };
                    setTimeout(() => {
                        router.push('/login');                    
                    }, 2000);
                } else {
                    showToast.value = true;
                    toastMessage.value = 'Unexpected response from server.';
                }

            } catch (error: any) {
                console.error('Registration failed:', error);
                showToast.value = true;
                if (error.response) {
                    toastMessage.value = error.response.data?.message || 'Registration failed. Please check your input.';
                } else {
                    toastMessage.value = 'Registration failed. Please try again later.';
                }
            }
        }
    } catch (error) {
        showToast.value = true;
        toastMessage.value = 'Registration failed. Please try again.';
    }
};


</script>
<style lang="css">

</style>