<template>
    <ion-page aria-label="page" aria-hidden="false">
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-title class="ion-text-center">Scan ticket</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="ion-padding">
            <ion-header collapse="condense">
                <ion-toolbar class="default-bg">
                    <ion-title size="large">Scan ticket</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-grid class="scanner__container">
                <ion-row>
                    <ion-col>
                        <ion-card class="scanner__button-container" @click="startScan">
                            <ion-card-content class="scanner__button">
                                <ion-card-title class="scanner__label">Scan ticket</ion-card-title>
                                <ion-icon class="scanner__icon" :icon="cameraOutline" size="large"></ion-icon>
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-text class="scanner__result" v-if="result">{{ result }}</ion-text>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { cameraOutline } from 'ionicons/icons';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonIcon,
    IonText
} from '@ionic/vue'

const result = ref('');

const startScan = async () => {
    try {
        const { barcodes } = await BarcodeScanner.scan()
        if (barcodes.length > 0) {
            result.value = barcodes[0].rawValue
        } else {
            result.value = 'No barcode found.'
        }
    } catch (error) {
        console.error('Scanning failed', error)
        result.value = 'Invalid ticket'
    }
}
</script>
