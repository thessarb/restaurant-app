<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="default-bg">
        <ion-title class="ion-text-center">Reservations</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar class="default-bg">
          <ion-title size="large">Reservations</ion-title>
        </ion-toolbar>
      </ion-header>
        <ReservatinsList />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ReservatinsList from '@/components/reservations/ReservationsList.vue';
</script>
