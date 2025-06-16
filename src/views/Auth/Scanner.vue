<template>
    <ion-page aria-label="page" aria-hidden="false">
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-title class="ion-text-center">Scan ticket</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="ion-padding">
            <a target="_blank" :href="reservation?.restaurant?.location" v-if="reservation?.restaurant?.location">
                <ion-item class="default-bg">
                    <ion-icon aria-hidden="true" :icon="locationOutline" slot="start"></ion-icon>
                    <ion-label>Location: {{ reservation?.restaurant?.name }}</ion-label>
                </ion-item>
            </a>
            <ion-item class="default-bg" v-if="reservation?.reservation_date">
                <ion-icon aria-hidden="true" :icon="calendarOutline" slot="start"></ion-icon>
                <ion-label>Date: {{ reservation?.reservation_date }}</ion-label>
            </ion-item>
            <ion-item class="default-bg" v-if="reservation?.people">
                <ion-icon aria-hidden="true" :icon="peopleOutline" slot="start"></ion-icon>
                <ion-label>Number of guests: {{ reservation?.people }}</ion-label>
            </ion-item>
            <ion-item class="default-bg" v-if="result">
                <ion-icon aria-hidden="true" :icon="checkmarkCircleOutline" slot="start"
                    v-if="result === 'Valid'"></ion-icon>
                <ion-icon aria-hidden="true" :icon="closeCircleOutline" slot="start"
                    v-if="result !== 'Valid'"></ion-icon>
                <ion-label>Status: {{ result }}</ion-label>
            </ion-item>
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
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { cameraOutline, calendarOutline, locationOutline, checkmarkCircleOutline, barcodeOutline, peopleOutline, closeCircleOutline } from 'ionicons/icons';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonItem,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonIcon,
    IonCol,
    IonLabel
} from '@ionic/vue';
import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore();
import axios from 'axios';

interface Event {
    id: number;
    name: string;
    date_start: string;
    description: string;
    rules: string;
    restaurant_id: string | null;
    restaurant: Restaurant | null
    image: Image | null
    created_at: string;
    updated_at: string;
}

interface Restaurant {
    id: number;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
}

interface Image {
    id: number;
    url: string;
}

interface Reservation {
    id: string | number
    type: string
    event: Event
    restaurant: Restaurant
    date_start: string,
    people: number,
    reservation_date: string
}

const result = ref('');
const scanCount = ref(0);
const reservation = ref<Reservation | null>(null);

const startScan = async () => {
    try {
        reservation.value = null;
        result.value = '';
        const { barcodes } = await BarcodeScanner.scan();
        if (barcodes.length > 0) {
            const scannedData = barcodes[0].rawValue;
            const parsedData = parseSimpleObject(scannedData);
            const request = await getReservation(parsedData.user_id, parsedData.reservation_id);
            if (request && !isEarlierThanNow(request.event.date_start)) {
                reservation.value = request;
                result.value = 'Valid';
            } else {
                result.value = 'Invalid';
            }
        } else {
            result.value = 'No barcode found.';
        }
    } catch (error) {
        console.error('Scanning failed', error)
        result.value = 'Invalid';
    }
}

const getReservation = async (user: number, reservation: number) => {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_ENDPOINT + `reservation/detail?user_id=${user}&reservation_id=${reservation}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${authStore.token}`,
                }
            });
        console.log(response.data);
        return response.data.reservation;
    } catch (error) {
        console.error('Error fetching client secret:', error);
    }
}

const isEarlierThanNow = (dateTimeStr: string): boolean => {
    const isoString = dateTimeStr.replace(' ', 'T');

    const dateToCheck = new Date(isoString);
    const now = new Date();

    return dateToCheck.getTime() < now.getTime();
}

const parseSimpleObject = (str: string): { [key: string]: any } => {
    const obj: { [key: string]: any } = {};
    str = str.trim();

    if (str.startsWith('{') && str.endsWith('}')) {
        str = str.slice(1, -1); // remove outer {}
    } else {
        throw new Error("Invalid object format");
    }

    const pairs = str.split(',');

    for (const pair of pairs) {
        const [rawKey, rawValue] = pair.split(':');

        if (!rawKey || !rawValue) continue;

        const key = rawKey.trim();
        let value: any = rawValue.trim();

        // Try to infer type
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (value === 'null') value = null;
        else if (!isNaN(Number(value))) value = Number(value);
        else value = value.replace(/^['"]|['"]$/g, ''); // remove quotes if present

        obj[key] = value;
    }

    return obj;
}
</script>
