<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="events" href="/tabs/events">
          <ion-icon aria-hidden="true" :icon="star" />
          <ion-label>Events</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="reservations" href="/tabs/reservations">
          <ion-icon aria-hidden="true" :icon="ticket" />
          <ion-label>Reservations</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon aria-hidden="true" :icon="person" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { person, ticket, star } from 'ionicons/icons';
</script>
