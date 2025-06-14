<template>
    <ion-grid>
        <ion-row>
            <ion-col size="12">
                <ion-card class="default-bg">
                    <img v-if=" props.event?.image" alt="Silhouette of mountains" :src="event.image ? baseUrl+'storage/'+event?.image?.url : 'https://ionicframework.com/docs/img/demos/card-media.png'" />
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
                    <a target="_blank" :href="event.restaurant?.locationOutline">
                        <ion-item class="default-bg">
                            <ion-icon aria-hidden="true" :icon="locationOutline" slot="start"></ion-icon>
                            <ion-label>{{event.restaurant?.name}}</ion-label>
                        </ion-item>
                    </a>
                    <ion-item class="default-bg">
                        <ion-icon aria-hidden="true" :icon="calendarOutline" slot="start"></ion-icon>
                        <ion-label>15 March - Saturday</ion-label>
                    </ion-item>
                    <ion-item class="default-bg">
                        <ion-icon aria-hidden="true" :icon="alarmOutline" slot="start"></ion-icon>
                        <ion-label>Starts at 23:00</ion-label>
                    </ion-item>
                    <ion-item class="default-bg">
                        <ion-icon aria-hidden="true" :icon="documentOutline" slot="start"></ion-icon>
                        <ion-label>Rules:</ion-label>
                    </ion-item>
                    <ion-item class="default-bg">
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
import { ref } from 'vue';
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
import { alarmOutline, calendarOutline, documentOutline, locationOutline } from 'ionicons/icons';
const baseUrl = ref(import.meta.env.VITE_APP_BASE);

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
  