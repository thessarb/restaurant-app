<template>
    <ion-page>
        <ion-content class="ion-padding connection__container">
            <ion-row class="connection__row">
                <ion-col size="12">
                    <ion-card>
                        <ion-icon :icon="wifiOutline" class="connection__wifi-icon" />
                        <ion-card-header>
                            <ion-card-title>No Internet Connection</ion-card-title>
                        </ion-card-header>

                        <ion-card-content>
                            An internet connection is required to use this app. Please open settings and connect to a
                            network.
                        </ion-card-content>
                        <ion-button @click="openSettings">Open Settings</ion-button>
                    </ion-card>
                </ion-col>
            </ion-row>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton, IonIcon, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from "@ionic/vue";
import { wifiOutline } from "ionicons/icons";
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

const openSettings = async () => {
    try {
        await NativeSettings.open({
            optionAndroid: AndroidSettings.Settings,
            optionIOS: IOSSettings.General
        });
    } catch (error) {
        console.error("Failed to open settings", error);
    }
};
</script>