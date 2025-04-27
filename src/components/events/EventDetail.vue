<template>

    <ion-grid>
        <ion-row>
            <ion-col size="12">
                <ion-card>
                    <img v-show="imageLoaded" @load="onLoad" class="eventdetail__image" alt="Silhouette of mountains" :src="event.image ? baseUrl+'storage/'+event?.image?.url : 'https://ionicframework.com/docs/img/demos/card-media.png'" />
                        <ion-row v-if="!imageLoaded" class="image-loading__wrapper">
                            <ion-col class="image-loading__placeholder"></ion-col>
                        </ion-row>
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
import { alarm, calendar, document, location } from 'ionicons/icons';
const baseUrl = ref(import.meta.env.VITE_APP_BASE);

const props = defineProps({
    event: {
        type: Object,
        default: () => ({ id: null })
    }
});

const imageLoaded = ref(false);

function onLoad() {
  imageLoaded.value = true;
}
</script>

<style lang="css">

.eventdetail__image {
    aspect-ratio: 16/9;
    object-fit: cover;
}

ion-button {
    flex-shrink: 0;
}

</style>
  