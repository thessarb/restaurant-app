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
            <ion-card>
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
            <ion-card>
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
  </template>
  
  <script setup lang="ts">
  import {
    IonSegment,
    IonSegmentButton,
    IonLabel
  } from '@ionic/vue'
  import { ref,onMounted } from 'vue'
  import axios from 'axios'
  
  const selectedSegment = ref<'upcoming' | 'completed' | 'cancelled'>('upcoming')
import { useAuthStore } from '@/stores/authStore'
import { calendarOutline, pricetagOutline } from 'ionicons/icons'

const authStore = useAuthStore();
const reservations = ref([]);
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
  