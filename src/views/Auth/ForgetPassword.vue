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
                        <ion-input v-model="email" :disabled="emailSent" type="email" color="primary" fill="outline" placeholder="Email">
                            <ion-icon slot="start" :icon="person" ></ion-icon>
                        </ion-input>                    
                    </ion-col>
                </ion-row>
                <ion-row v-if="emailSent">
                    <ion-col>
                        <ion-input v-model="opt_code" type="number" :maxlength="6" color="primary" fill="outline" placeholder="Code">
                            <ion-icon slot="start" :icon="pin" ></ion-icon>
                        </ion-input>  
                    </ion-col>
                </ion-row>
                <p v-if="error">{{ error }}</p>
                <ion-row>
                    <ion-col>
                        <ion-button v-if="emailSent" @click="checkAndUpdateOpt" color="primary" expand="block">{{ step }}</ion-button>
                        <ion-button v-else @click="forgetPassword" color="primary" expand="block">{{ step }}</ion-button>
                    </ion-col>
                </ion-row>
                <ion-toast
                    :is-open="showToast"
                    :message="toastMessage"
                    duration="2000"
                    color="danger"
                    @didDismiss="showToast = false">
                    </ion-toast>
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

import { arrowBack, person, pin } from 'ionicons/icons';
import { ref,watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const opt_code = ref('');
const emailSent = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
watch(email, () => updateData());
watch(opt_code, () => updateData());
watch(emailSent, (newVal) => {
    emailSent.value = newVal;
});

const updateData = () => {
    data.email = email.value;
    data.opt_code = opt_code.value;
};
const router = useRouter();

const data = {
    email: email.value,
    opt_code: opt_code.value
};
const error = ref('');
const step = ref('Request Update Password');
const forgetPassword = async () => {
    try {
        await axios.put(import.meta.env.VITE_APP_ENDPOINT + 'opt_code', {
            email: email.value
        });

        emailSent.value = true;
        step.value = 'Verify Code';

    } catch (error: any) {
        if (error.response) {
            showToast.value = true;
            error.value = error.response.data.message
            toastMessage.value = error.value;
            console.error('Server responded with error:', error.response.data);
        } else {
            console.error('Request error:', error.message);
        }
    }
};
const checkAndUpdateOpt = async () => {
    try {
        await axios.put(import.meta.env.VITE_APP_ENDPOINT + 'opt_code/check', {
            email: email.value,
            opt_code: opt_code.value,
        });
        router.push({ name: 'reset-password' });
    } catch (error: any) {
        if (error.response) {
            console.error('Server responded with error:', error.response.data);
            error.value = error.response.data.message
            showToast.value = true;
            error.value = error.response.data.message
            toastMessage.value = error.value;
        } else {
            console.error('Request error:', error.message);
        }
    }
};

</script>
<style lang="css">
.otp-input {
  display: flex;
  gap: 10px;
}
</style>