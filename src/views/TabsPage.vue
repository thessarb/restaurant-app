<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet aria-label="pages" aria-hidden="false"></ion-router-outlet>
            <ion-tab-bar class="ionic__tabs" slot="bottom">
                <ion-tab-button class="default-bg" v-if="isNormalUser" tab="events" href="/tabs/events">
                    <ion-icon aria-label="event" :icon="calendarNumberOutline" />
                    <ion-label>Events</ion-label>
                </ion-tab-button>

                <ion-tab-button class="default-bg" v-if="isNormalUser" tab="reservations" href="/tabs/reservations">
                    <ion-icon aria-label="reservation" :icon="ticketOutline" />
                    <ion-label>Reservations</ion-label>
                </ion-tab-button>

                <ion-tab-button class="default-bg" v-if="!isNormalUser" tab="scanner" href="/tabs/scanner">
                    <ion-icon aria-label="scanner" :icon="barcodeOutline" />
                    <ion-label>Scanner</ion-label>
                </ion-tab-button>

                <ion-tab-button class="default-bg" tab="profile" href="/tabs/profile">
                    <ion-icon aria-label="profile" :icon="personOutline" />
                    <ion-label>Profile</ion-label>
                </ion-tab-button>
            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, onIonViewWillEnter } from '@ionic/vue';
import { personOutline, ticketOutline, calendarNumberOutline, barcodeOutline } from 'ionicons/icons';
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
const authStore = useAuthStore();
const isNormalUser = ref(authStore?.user?.role_id !== 3);
onIonViewWillEnter(() => {
    isNormalUser.value = authStore?.user?.role_id !== 3;
});
</script>
