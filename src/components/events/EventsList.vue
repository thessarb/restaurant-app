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
            <ion-col>
                <ion-card>
                    <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
                    <ion-card-header>
                        <ion-card-title>Card Title</ion-card-title>
                        <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
                    </ion-card-header>

                    <ion-card-content>
                        Here's a small text description for the card content. Nothing more, nothing less.
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card>
                    <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
                    <ion-card-header>
                        <ion-card-title>Card Title</ion-card-title>
                        <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
                    </ion-card-header>
                    <ion-card-content>
                        Here's a small text description for the card content. Nothing more, nothing less.
                    </ion-card-content>
                </ion-card>
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
    IonCardSubtitle
} from '@ionic/vue';
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
  