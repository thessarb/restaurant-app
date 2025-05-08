<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon  @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Register</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-grid class="registration__container login__container">
                <ion-row>
                    <ion-col>
                        <ion-input v-model="name" color="primary" fill="outline" placeholder="Name">
                            <ion-icon slot="start" :icon="person" ></ion-icon>
                        </ion-input>                    
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-input v-model="surname" color="primary" fill="outline" placeholder="Surame">
                            <ion-icon slot="start" :icon="person" ></ion-icon>
                        </ion-input>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-segment v-model="gender" color="primary">
                            <ion-segment-button value="male">
                                 <ion-label>Male</ion-label>
                            </ion-segment-button>
                            <ion-segment-button gender = 'female' value="female">
                                <ion-label>Female</ion-label>
                            </ion-segment-button>
                        </ion-segment>                    
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
    IonSegment,
    IonSegmentButton,
    IonCol,
    IonRow,
    IonGrid,
    IonLabel,
    IonIcon,
    IonToast
} from '@ionic/vue';
import { arrowBack, person } from 'ionicons/icons';
import { ref } from 'vue';
import { useAuthStore } from "@/stores/authStore";
import router from '@/router';
const authSore = useAuthStore();


const name = ref('')
const surname = ref('')
const gender = ref('male')
const showToast = ref(false);
const toastMessage = ref('');
const run = ref(false)
const validateForm = () => {
    if (!name.value || !surname.value || !gender.value) {
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
        name: name.value,
        surname: surname.value,
        gender: gender.value,
        email: '',
        phone: '',
        password: '',
        password_confirmation: ''
    };
    if(run.value) router.push({path: 'personalinfo'})
}

</script>
<style lang="css">

</style>