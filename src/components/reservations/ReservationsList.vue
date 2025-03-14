<template>
    <ion-segment value="upcoming">
        <ion-segment-button value="upcoming"  @click="increment('upcoming')">
            <ion-label>Upcoming</ion-label>
        </ion-segment-button>
        <ion-segment-button value="completed" @click="increment('completed')">
            <ion-label>Completed</ion-label>
        </ion-segment-button>
        <ion-segment-button value="cancelled" @click="increment('cancelled')">
            <ion-label>Cancelled</ion-label>
        </ion-segment-button>
    </ion-segment>
 </template>
 
 <script setup lang="ts">
 import { 
    IonSegment,
    IonLabel,
    IonSegmentButton
} from '@ionic/vue';

function increment(status: "upcoming" | "completed" | "cancelled"): void {
  console.log(status);
}


 </script>
   