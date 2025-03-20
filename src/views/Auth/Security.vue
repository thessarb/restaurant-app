<template>
        <ion-page>
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Security</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-input fill="outline" placeholder="Enter your password" type="password">
                            <ion-icon slot="start" :icon="lockClosed"></ion-icon>
                            <ion-input-password-toggle color="primary" slot="end"></ion-input-password-toggle>
                        </ion-input>                    
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-input color="primary" fill="outline" placeholder="Confirm your password" type="password">
                            <ion-icon slot="start" :icon="lockClosed"></ion-icon>
                            <ion-input-password-toggle color="primary" slot="end"></ion-input-password-toggle>
                        </ion-input>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-button color="primary" expand="block">Complete Registration</ion-button>
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
import { arrowBack, lockClosed } from 'ionicons/icons';

</script>
<style lang="css">

</style>