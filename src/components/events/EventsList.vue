<template>
    <ion-grid>
        <ion-row>
            <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
        </ion-row>
    </ion-grid>
    <ion-grid class="eventlist">
        <ion-row class="scrollable-row">
            <ion-col>
                <ion-button color="primary">All</ion-button>
                <ion-button fill="outline" color="primary">Elite</ion-button>
                <ion-button fill="outline" color="primary">Magic</ion-button>
                <ion-button fill="outline" color="primary">Star</ion-button>
            </ion-col>
        </ion-row>
        <ion-row class="eventlist__list">
            <ion-col class="eventlist__item" v-for="event in events" :key="event?.id">
                <router-link :to="{ name: 'event', params: {id: event?.id}  }" class="eventlist__detail-link">
                    <ion-card class="eventlist__card">
                        <img alt="Silhouette of mountains" class="eventlist__image" src="https://ionicframework.com/docs/img/demos/card-media.png" />
                        <ion-card-header>
                            <ion-card-title>{{ event?.name }}</ion-card-title>
                        </ion-card-header>

                        <ion-card-content>
                            {{ event?.description }}
                        </ion-card-content>
                    </ion-card>
                </router-link>
            </ion-col>
        </ion-row>
    </ion-grid>
</template>

<script setup lang="ts">
import { 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonButton
} from '@ionic/vue';
import { PropType } from 'vue';
interface Event {
  id: number;
  name: string;
  description: string;
}
defineProps({
    events: {
    type: Array as PropType<Event[]>,
    required: true
  }
});
</script>

<style lang="css">

.scrollable-row {
    display: flex;
    overflow-x: auto;
    padding: 10px 0;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollable-row::-webkit-scrollbar {
    display: none;
}

.scrollable-row ion-col {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    white-space: nowrap;
}

ion-button {
    flex-shrink: 0;
}

</style>
  