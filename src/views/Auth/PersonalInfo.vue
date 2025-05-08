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
    IonToast
} from '@ionic/vue';
import { arrowBack, mailOutline, call } from 'ionicons/icons';
import { ref } from 'vue';
import { useAuthStore } from "@/stores/authStore";
import router from '@/router';
const authSore = useAuthStore();
const email = ref()
const phone = ref()
const showToast = ref(false);
const toastMessage = ref('');
const run = ref(false)
const validateForm = () => {
    if (!email.value || !phone.value) {
        toastMessage.value = 'Please fill in all required fields.';
        showToast.value = true;
        run.value =false
    }else{
        run.value = true
    }
}
const continueRegister = () => {
    validateForm()
    authSore.registerData = {
        name:  authSore.registerData?.name,
        surname: authSore.registerData?.surname,
        gender: authSore.registerData?.gender,
        email: email.value,
        phone: phone.value,
        password: '',
        password_confirmation: ''
    };
    if(run.value) router.push({path: 'security'})
}
</script>
<style lang="css">

</style>