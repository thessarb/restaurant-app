<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-icon slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Register</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-grid class="registration__container">
                <ion-row>
                    <ion-col>
                        <ion-input color="primary" fill="outline" placeholder="Name">
                            <ion-icon slot="start" :icon="person" ></ion-icon>
                        </ion-input>                    
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-input color="primary" fill="outline" placeholder="Surame">
                            <ion-icon slot="start" :icon="person" ></ion-icon>
                        </ion-input>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-segment color="primary" value="male">
                            <ion-segment-button value="male">
                                 <ion-label>Male</ion-label>
                            </ion-segment-button>
                            <ion-segment-button value="female">
                                <ion-label>Female</ion-label>
                            </ion-segment-button>
                        </ion-segment>                    
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-button color="primary" expand="block">Continue</ion-button>
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
    IonIcon
} from '@ionic/vue';
import { arrowBack, person } from 'ionicons/icons';

</script>
<style lang="css">

</style>