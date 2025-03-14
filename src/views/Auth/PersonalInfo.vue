

<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-icon  @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Personal Information</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-input fill="outline" placeholder="Email">
                            <ion-icon slot="start" :icon="mailOutline"></ion-icon>
                        </ion-input>                    
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-input color="tertiary" fill="outline" placeholder="Phone">
                            <ion-icon slot="start" :icon="call"></ion-icon>
                        </ion-input>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-button color="tertiary" expand="block">Continue</ion-button>
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
    IonIcon
} from '@ionic/vue';
import { arrowBack, mailOutline, call } from 'ionicons/icons';

</script>
<style lang="css">

</style>