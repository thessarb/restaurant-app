<template>
    <ion-segment v-model="selectedSegment">
      <ion-segment-button value="upcoming">
        <ion-label>Upcoming</ion-label>
      </ion-segment-button>
      <ion-segment-button value="completed">
        <ion-label>Completed</ion-label>
      </ion-segment-button>
      <ion-segment-button value="cancelled">
        <ion-label>Cancelled</ion-label>
      </ion-segment-button>
    </ion-segment>
  
    <ion-row v-if="selectedSegment === 'upcoming'">
        <ion-col size="12" v-for="reservation in reservations?.upcoming" :key="reservation.id">
            <ion-card @click="setOpen(true)">
                <ion-list>
                    <ion-item>
                        <ion-thumbnail slot="start">
                            <ion-icon v-if="reservation.type == 'ticket'" :icon="pricetagOutline" size="large" />
                            <ion-icon v-else :icon="calendarOutline" size="large" />
                        </ion-thumbnail>
                        <ion-label>
                            <ion-card>
                                <ion-card-header>
                                <ion-card-title>{{reservation.type}}</ion-card-title>
                                    <ion-card-subtitle>{{reservation.event.name}}</ion-card-subtitle>
                                </ion-card-header>

                                <ion-card-content>
                                    {{reservation.date_start}}
                                </ion-card-content>
                            </ion-card>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </ion-card>
        </ion-col>
    </ion-row>
    <ion-row v-else-if="selectedSegment === 'completed'">
        <ion-col size="12" v-for="reservation in reservations?.completed" :key="reservation.id">
            <ion-card @click="setOpen(true)">
                <ion-list>
                    <ion-item>
                        <ion-thumbnail slot="start">
                            <ion-icon v-if="reservation.type == 'ticket'" :icon="pricetagOutline" size="large" />
                            <ion-icon v-else :icon="calendarOutline" size="large" />
                        </ion-thumbnail>
                        <ion-label>
                            <ion-card>
                                <ion-card-header>
                                <ion-card-title>{{reservation.type}}</ion-card-title>
                                    <ion-card-subtitle>{{reservation.event.name}}</ion-card-subtitle>
                                </ion-card-header>

                                <ion-card-content>
                                    {{reservation.date_start}}
                                </ion-card-content>
                            </ion-card>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </ion-card>
        </ion-col>
    </ion-row>
    
    <ion-row v-else-if="selectedSegment === 'cancelled'">
      <!-- Cancelled View -->
      <p>Showing cancelled events...</p>
    </ion-row>
    <ion-modal :is-open="isOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>Modal</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="setOpen(false)">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos
          reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui. Eaque,
          dicta.
        </p>
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
    IonCardSubtitle 
  } from '@ionic/vue'
  import { ref,onMounted } from 'vue'
  import axios from 'axios'
  
  const selectedSegment = ref<'upcoming' | 'completed' | 'cancelled'>('upcoming')
import { useAuthStore } from '@/stores/authStore'
import { calendarOutline, pricetagOutline } from 'ionicons/icons'

  const isOpen = ref(false);

  const setOpen = (open: boolean) => (isOpen.value = open);
interface Event {
  name: string
}
interface Reservation {
  id: string | number
  type: string
  event: Event
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
    }
}
onMounted(() => {
  getReservations()
})
  </script>
  