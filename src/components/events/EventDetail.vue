<template>

    <ion-grid>
        <ion-row>
            <ion-col size="12">
                <ion-card>
                    <img v-if=" props.event?.image" alt="Silhouette of mountains" :src="'https://restaurant.ddev.site/storage/'+ props.event?.image?.url " />
                    <img v-else alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
                    <ion-card-header>
                        <ion-card-title>{{ props.event?.name }}</ion-card-title>
                        <ion-card-subtitle></ion-card-subtitle>
                    </ion-card-header>

                    <ion-card-content>
                        {{props.event?.description}}
                    </ion-card-content>
                </ion-card>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col>
                <ion-list lines="none">
                    <a target="_blank" :href="event.restaurant?.location">
                        <ion-item>
                            <ion-icon aria-hidden="true" :icon="location" slot="start"></ion-icon>
                            <ion-label>{{event.restaurant?.name}}</ion-label>
                        </ion-item>
                    </a>
                    <ion-item>
                        <ion-icon aria-hidden="true" :icon="calendar" slot="start"></ion-icon>
                        <ion-label>15 March - Saturday</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-icon aria-hidden="true" :icon="alarm" slot="start"></ion-icon>
                        <ion-label>Starts at 23:00</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-icon aria-hidden="true" :icon="document" slot="start"></ion-icon>
                        <ion-label>Rules:</ion-label>
                    </ion-item>
                    <ion-item>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam alias, harum officia, doloribus rem tempora accusantium voluptatibus voluptates quaerat fuga in? Consectetur quaerat molestiae dicta vel. Repellendus deleniti sapiente non.
                    </ion-item>
                </ion-list>
            </ion-col>
        </ion-row>
    </ion-grid>
    <router-link v-if="props.event" :to="{ name: 'reservetype', params: { id: props.event?.id } }">
        <ion-button class="ion-padding" expand="block">Reserve</ion-button>
    </router-link>
    <!-- <ReservationDialog :event="event"/> -->
</template>

<script setup lang="ts">
import { 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton
} from '@ionic/vue';
import { alarm, calendar, document, location } from 'ionicons/icons';

const props = defineProps({
    event: {
        type: Object,
        default: () => ({ id: null })
    }
});
</script>

<style lang="css">

ion-button {
    flex-shrink: 0;
}

</style>
  