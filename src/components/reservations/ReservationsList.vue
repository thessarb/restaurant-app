<template>
    <ion-segment v-model="selectedSegment">
      <ion-segment-button value="upcoming">
        <ion-label>Upcoming</ion-label>
      </ion-segment-button>
      <ion-segment-button value="completed">
        <ion-label>Past</ion-label>
      </ion-segment-button>
    </ion-segment>
  
    <ion-row class="reservation__items" v-if="selectedSegment === 'upcoming'">
        <ion-col class="reservation__item" size="12" v-for="reservation in reservations?.upcoming" :key="reservation.id">
            <ion-card @click="setReservation(reservation)">
                <ion-list lines="none">
                    <ion-item class="reservation__item-bg">
                        <ion-label class="reservation__item-card">
                            <ion-thumbnail slot="start">
                                <ion-icon v-if="reservation.type == 'ticket'" :icon="ticketOutline" size="large" />
                                <ion-icon v-else :icon="calendarOutline" size="large" />
                            </ion-thumbnail>
                            <ion-card class="reservation__item-info">
                                <ion-card-header>
                                    <ion-card-title>{{reservation.event.name}}</ion-card-title>
                                    <ion-card-subtitle>{{reservation.type[0].toUpperCase() + reservation.type.slice(1)}}</ion-card-subtitle>
                                </ion-card-header>

                                <ion-card-content v-if="reservation.date_start">
                                    {{reservation.date_start}}
                                </ion-card-content>
                            </ion-card>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </ion-card>
        </ion-col>
    </ion-row>
    <ion-row class="reservation__items" v-else-if="selectedSegment === 'completed'">
        <ion-col class="reservation__item" size="12" v-for="reservation in reservations?.completed" :key="reservation.id">
            <ion-card @click="setReservation(reservation)">
                <ion-list lines="none">
                    <ion-item class="reservation__item-bg">
                        <ion-label class="reservation__item-card">
                            <ion-thumbnail slot="start">
                                <ion-icon v-if="reservation.type == 'ticket'" :icon="ticketOutline" size="large" />
                                <ion-icon v-else :icon="calendarOutline" size="large" />
                            </ion-thumbnail>
                            <ion-card class="reservation__item-info">
                                <ion-card-header>
                                    <ion-card-title>{{reservation.event.name}}</ion-card-title>
                                    <ion-card-subtitle>{{reservation.type[0].toUpperCase() + reservation.type.slice(1)}}</ion-card-subtitle>
                                </ion-card-header>

                                <ion-card-content v-if="reservation.date_start">
                                    {{reservation.date_start}}
                                </ion-card-content>
                            </ion-card>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </ion-card>
        </ion-col>
    </ion-row>
    <ion-modal ref="modal" :initial-breakpoint="0.85" :is-open="isOpen">
        <ion-header>
            <ion-toolbar class="default-bg">
                <ion-title>{{selectedReservationTitle}}</ion-title>
                <ion-buttons slot="end">
                    <ion-button class="modal-button" @click="setOpen(false)">Close</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-row>
                <ion-col>
                    <ion-list lines="none">
                        <a target="_blank" :href="selectedReservation?.restaurant?.location">
                            <ion-item class="default-bg">
                                <ion-icon aria-hidden="true" :icon="locationOutline" slot="start"></ion-icon>
                                <ion-label>{{selectedReservation?.restaurant?.name}}</ion-label>
                            </ion-item>
                        </a>
                        <ion-item class="default-bg">
                            <ion-icon aria-hidden="true" :icon="calendarOutline" slot="start"></ion-icon>
                            <ion-label>{{ formatDate(selectedReservation?.event?.date_start) }}</ion-label>
                        </ion-item>
                        <ion-item class="default-bg">
                            <ion-icon aria-hidden="true" :icon="alarmOutline" slot="start"></ion-icon>
                            <ion-label>Starts at {{ formatTime(selectedReservation?.event?.date_start) }}</ion-label>
                        </ion-item>
                        <ion-item class="default-bg" v-if="selectedReservation?.event?.description">
                            {{ selectedReservation?.event?.description }}
                        </ion-item>
                        <ion-item class="default-bg">
                            <div class="qr-container">
                                <div id="qrCanvas" v-html="qrCode"></div>
                            </div>
                        </ion-item>
                    </ion-list>
                </ion-col>
            </ion-row>
        </ion-content>
    </ion-modal>
</template>
  
<script setup lang="ts">
    import {
        IonSegment,
        IonSegmentButton,
        IonLabel, 
        IonButtons, 
        IonButton, 
        IonModal, 
        IonHeader, 
        IonToolbar, 
        IonContent, 
        IonTitle,
        IonCol,
        IonRow,
        IonCard,
        IonItem,
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
        IonThumbnail,
        IonIcon,
        IonList,
        IonCardSubtitle, 
        onIonViewWillEnter
    } from '@ionic/vue';
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import QRCode from 'qrcode';
  
    const selectedSegment = ref<'upcoming' | 'completed' | 'cancelled'>('upcoming')
    import { useAuthStore } from '@/stores/authStore'
    import { calendarOutline, ticketOutline, alarmOutline, locationOutline } from 'ionicons/icons'

    const selectedReservation = ref< Reservation | null >(null);
    const selectedReservationTitle = ref('');
    const isOpen = ref(false);
    const qrCodeData = ref('');
    const qrCode =  ref('');

    const generateQRCode = async (value: string) => {
        qrCode.value = await QRCode.toString(value, { type: 'svg', width:300 });
    };

    const setReservation = (reservation: Reservation) => {
        if (!reservation|| !reservation.type || !reservation.type.length || !reservation.event?.name) selectedReservationTitle.value = '';
        selectedReservationTitle.value = `${reservation.type[0].toUpperCase()}${reservation.type.slice(1)}: ${reservation.event.name}`;
        selectedReservation.value = reservation;
        qrCodeData.value = `{user_id: ${authStore?.user?.id},reservation_id: ${reservation?.id}}`;
        generateQRCode(qrCodeData.value);
        isOpen.value = true;
    };

    const formatDate = (dateString: string | undefined) => {
        // Ensure the dateString is in a valid format
        if (!dateString) return '01 January - Monday';
        const dateObj = new Date(dateString);

        const day = dateObj.getDate();
        const month = new Intl.DateTimeFormat("en", { month: "long" }).format(dateObj);
        const weekday = new Intl.DateTimeFormat("en", { weekday: "long" }).format(dateObj);

        return `${day} ${month} - ${weekday}`;
    };

    const formatTime = (dateString: string | undefined): string => {
        if (!dateString) return '00:00';
        
        const dateObj = new Date(dateString.replace(' ', 'T')); // Convert to ISO format

        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes}`;
    };

    const setOpen = (open: boolean) => (isOpen.value = open);

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
        date_start: string
    }

    interface Reservations {
        upcoming: Reservation[]
        completed: Reservation[]
    }

    const authStore = useAuthStore();
    const reservations = ref<Reservations>({
        upcoming: [],
        completed: []
    })
    const getReservations = async () => {
        try {
            const response =  await axios.get(import.meta.env.VITE_APP_ENDPOINT + `reservation/reservations?user_id=${authStore?.user?.id}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${authStore.token}`,
                }
            });
            reservations.value = response.data.reservations;
        } catch (error) {
            console.error('Error fetching client secret:', error);
            authStore.logout();
        }
    }
    onMounted(() => {
        getReservations();
    });
    onIonViewWillEnter(() => {
        getReservations();
    });
</script>
<style scoped>
    ion-segment-button.ios::part(indicator-background) {
        background: var(--ion-color-primary);
        border-radius: 16px;
    }

    .qr-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    #qrCanvas {
        margin-top: 20px;
        background: white;
        border-radius: 16px;
        overflow: hidden;
    }
</style>
  