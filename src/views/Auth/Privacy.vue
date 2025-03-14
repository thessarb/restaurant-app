<template>
     <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-icon  @click="$router.go(-1);" slot="start" :icon="arrowBack" size="large"></ion-icon>
                <ion-title class="ion-text-left">Privacy and Policy</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { 
    IonPage,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle

 } from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
</script>