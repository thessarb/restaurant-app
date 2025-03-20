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
                <ion-button fill="outline" color="primary">Zone 1</ion-button>
                <ion-button fill="outline" color="primary">Zone 2</ion-button>
            </ion-col>
        </ion-row>
        <ion-row class="eventlist__list">
            <ion-col class="eventlist__item" v-for="event in events" :key="event?.id">
                <router-link :to="{ name: 'event', params: {id: event?.id}  }" class="eventlist__detail-link">
                    <ion-card class="eventlist__card">
                        <img alt="Silhouette of mountains" class="eventlist__image" src="https://ionicframework.com/docs/img/demos/card-media.png" />
                        <ion-card-header class="eventlist__card-header">
                            <ion-card-title class="eventlist__card-title">{{ event?.name }}</ion-card-title>
                        </ion-card-header>

                        <ion-card-content class="eventlist__card-content">
                            <ion-list lines="none">
                                <ion-item>
                                    <ion-icon class="eventlist__card-icon" aria-hidden="true" :icon="location" slot="start"></ion-icon>
                                    <ion-label class="eventlist__card-label">{{ getZoneLabel(event?.restaurant_id) }}</ion-label>
                                </ion-item>
                                <ion-item>
                                    <ion-icon class="eventlist__card-icon" aria-hidden="true" :icon="calendar" slot="start"></ion-icon>
                                    <ion-label class="eventlist__card-label">{{ formatDate(event?.date_start) }}</ion-label>
                                </ion-item>
                            </ion-list>
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
        IonButton,
        IonIcon,
        IonLabel,
        IonList,
        IonItem
    } from '@ionic/vue';
    import { calendar, location } from 'ionicons/icons';
    import { PropType } from 'vue';
    interface Event {
    id: number;
    name: string;
    description: string;
    }
    interface Event {
        id: number;
        name: string;
        date_start: string;
        description: string;
        rules: string;
        restaurant_id: string | null;
        created_at: string;
        updated_at: string;
    }
    defineProps({
        events: {
        type: Array as PropType<Event[]>,
        required: true
    }
    });
    const formatDate = (dateString: string) => {
        const dateObj = new Date(dateString);

        const day = dateObj.getDate();
        const month = new Intl.DateTimeFormat("en", { month: "long" }).format(dateObj);
        const weekday = new Intl.DateTimeFormat("en", { weekday: "long" }).format(dateObj);

        return `${day} ${month} - ${weekday}`;
    };
    const getZoneLabel = (id: number | string | null) => {
        return id || (Math.random() < 0.5 ? "Zone 1" : "Zone 2");
    };
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
  