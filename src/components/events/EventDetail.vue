<template>

    <ion-grid>
        <ion-row>
            <ion-col size="12">
                <ion-card>
                    <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
                    <ion-card-header>
                        <ion-card-title>{{ event?.name }}</ion-card-title>
                        <ion-card-subtitle></ion-card-subtitle>
                    </ion-card-header>

                    <ion-card-content>
                        {{event?.description}}
                    </ion-card-content>
                </ion-card>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col>
                <ion-list lines="none">
                    <ion-item>
                        <ion-icon aria-hidden="true" :icon="location" slot="start"></ion-icon>
                        <ion-label>Location 1</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-icon aria-hidden="true" :icon="calendar" slot="start"></ion-icon>
                        <ion-label>15 March - Saturday</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-icon aria-hidden="true" :icon="alarm" slot="start"></ion-icon>
                        <ion-label>Starts at 23:0</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-icon aria-hidden="true" :icon="people" slot="start"></ion-icon>
                        <ion-label>6 people per table</ion-label>
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
        <ion-row>
            <ion-col>
                <ion-button expand="block" color="tertiary">Reserve</ion-button>
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
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
    IonList,
    IonItem,
    IonIcon,
    IonLabel
} from '@ionic/vue';
import { alarm, calendar, document, location, people } from 'ionicons/icons';

defineProps({
    event: Object
});
</script>

<style lang="css">

ion-button {
    flex-shrink: 0;
}

</style>
  