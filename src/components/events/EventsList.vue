<template>
    
    <ion-grid>
        <ion-row class="scrollable-row">
            <ion-col>
                <ion-button color="tertiary">All</ion-button>
                <ion-button fill="outline" color="tertiary">Elite</ion-button>
                <ion-button fill="outline" color="tertiary">Magic</ion-button>
                <ion-button fill="outline" color="tertiary">Star</ion-button>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col size="6" v-for="event in events" :key="event?.id">
                <router-link :to="{ name: 'event',params: {id: event?.id}  }">
                    <ion-card>
                        <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
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
  