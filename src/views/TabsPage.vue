<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet aria-label="pages" aria-hidden="false"></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="events" href="/tabs/events">
          <ion-icon aria-label="event" :icon="star" />
          <ion-label>Events</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="reservations" href="/tabs/reservations">
          <ion-icon aria-label="reservation" :icon="ticket" />
          <ion-label>Reservations</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon aria-label="profile" :icon="person" />
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
