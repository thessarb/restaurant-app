<template>
    <ion-content>
        <ion-row>
            <div v-if="!text" id="stuff">{{ stuff }}</div>
            <div class="svg-wrapper tablelist" ref="svgContainer" v-html="text"></div>
        </ion-row>
        <ion-modal ref="modal" :initial-breakpoint="0.85" trigger="open-modal" @willDismiss="onWillDismiss">
            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-button @click="cancel()">Cancel</ion-button>
                    </ion-buttons>
                    <ion-title>Reserve table {{ clickedTable?.table_nr }}</ion-title>
                    <ion-buttons slot="end">
                        <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <ion-row>
                    <ion-col>
                        <ion-list lines="none">
                            <ion-item>
                                <ion-input label="Enter your name" label-placement="stacked" ref="input" type="text"
                                    placeholder="Your name"></ion-input>
                            </ion-item>
                            <a target="_blank" :href="event?.restaurant?.location">
                                <ion-item class="default-bg">
                                    <ion-icon aria-hidden="true" :icon="locationOutline" slot="start"></ion-icon>
                                    <ion-label>{{ event?.restaurant?.name }}</ion-label>
                                </ion-item>
                            </a>
                            <ion-item class="default-bg">
                                <ion-icon aria-hidden="true" :icon="calendarOutline" slot="start"></ion-icon>
                                <ion-label>{{ formatDate(event?.date_start) }}</ion-label>
                            </ion-item>
                            <ion-item class="default-bg">
                                <ion-icon aria-hidden="true" :icon="alarmOutline" slot="start"></ion-icon>
                                <ion-label>Starts at {{ formatTime(event?.date_start) }}</ion-label>
                            </ion-item>
                            <ion-item class="default-bg" v-if="clickedTable?.nr_people">
                                <ion-icon aria-hidden="true" :icon="peopleOutline" slot="start"></ion-icon>
                                <ion-label>Max. number of people for this table: {{ clickedTable?.nr_people }}</ion-label>
                            </ion-item>
                            <ion-item class="default-bg" v-if="clickedTable?.min_spending">
                                <ion-icon aria-hidden="true" :icon="cashOutline" slot="start"></ion-icon>
                                <ion-label>Minimum spending: {{ clickedTable?.min_spending }} $</ion-label>
                            </ion-item>
                            <ion-item class="default-bg" v-if="clickedTable?.deposit">
                                <ion-icon aria-hidden="true" :icon="cashOutline" slot="start"></ion-icon>
                                <ion-label>Reservation deposit: {{ clickedTable?.deposit }} $</ion-label>
                            </ion-item>
                            <ion-item class="default-bg" v-if="clickedTable?.details">
                                <ion-icon aria-hidden="true" :icon="documentOutline" slot="start"></ion-icon>
                                <ion-label>{{ clickedTable?.details }}</ion-label>
                            </ion-item>
                            <ion-item class="default-bg" v-for="(value, index) in counters" :key="index">
                                <ion-icon aria-hidden="true" :icon="peopleOutline" slot="start"></ion-icon>
                                <ion-label>{{ index === 0 ? 'Number of men' : 'Number of women' }}</ion-label>
                                <ion-button class="modifier" @click="decrement(index)" :disabled="counters[index] === 0">-</ion-button>
                                <ion-text class="counter-value">{{ value }}</ion-text>
                                <ion-button class="modifier" @click="increment(index)" :disabled="getTotal() >= limit">+</ion-button>
                            </ion-item>
                        </ion-list>
                    </ion-col>
                </ion-row>
            </ion-content>
        </ion-modal>
    </ion-content>
</template>
<script setup lang="ts">
const props = defineProps({
    location: String,
    tables: Array,
    event: Object
});
import { ref, onMounted, nextTick } from 'vue';
import type { Ref } from 'vue';
import { Storage } from '@ionic/storage';
import { OverlayEventDetail } from '@ionic/core/components';
import { calendarOutline, cashOutline, alarmOutline, locationOutline, documentOutline, peopleOutline } from 'ionicons/icons';

import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonCol,
    IonIcon,
    IonLabel,
    IonList,
    IonContent,
    IonToolbar,
    IonTitle,
    IonItem,
    IonInput,
    IonText,
    IonRow
} from '@ionic/vue';

const storage = new Storage();
const svgContainer: Ref<HTMLElement | null> = ref(null);
const text = ref('');
const message = ref('This modal example uses triggers to automatically open a modal when the button is clicked.');

const modal = ref();
const input = ref();

const cancel = () => modal.value.$el.dismiss(null, 'cancel');

const confirm = () => {
    const name = input.value.$el.value;
    modal.value.$el.dismiss(name, 'confirm');
};

const onWillDismiss = (event: CustomEvent<OverlayEventDetail>) => {
    if (event.detail.role === 'confirm') {
        message.value = `Hello, ${event.detail.data}!`;
    }
};

interface Table {
    id: number;
    deposit: number;
    min_spending: number;
    nr_people: number;
    restaurant_id: number;
    event: Event | null;
    table_nr: number;
    details: string | null;
    created_at: string;
    updated_at: string;
}

interface Event {
  id: number;
  name: string;
  date_start: string;
  description: string;
  rules: string;
  nr_tikets: number;
  price_per_ticket: number;
  restaurant_id: number | null;
  restaurant: Restaurant | null;
  created_at: string;
  updated_at: string;
  image: string | null;
}

interface Restaurant {
    id: number;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
}

// const clickedTableId = ref('');
const clickedTable = ref({} as Table);
const openModal = async (table: any) => {
    clickedTable.value = table;
    limit.value = table.nr_people || 0;
    counters.value = [0, 0];
    await modal.value.$el.present();
};

const loadChunks = async (baseKey: string): Promise<string> => {
    const chunkCount = await storage.get(`${baseKey}_chunkCount`);
    if (!chunkCount || typeof chunkCount !== 'number') return '';

    const chunks = [];
    for (let i = 0; i < chunkCount; i++) {
        const part = await storage.get(`${baseKey}_chunk_${i}`);
        if (typeof part === 'string') {
            chunks.push(part);
        } else {
            return '';
        }
    }

    return chunks.join('');
}

const formatDate = (dateString: string | undefined) => {
    // Ensure the dateString is in a valid format
    if (!dateString) return '01 January - Monday';
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = new Intl.DateTimeFormat("en", { month: "long" }).format(dateObj);
    const weekday = new Intl.DateTimeFormat("en", { weekday: "long" }).format(dateObj);

    return `${day} ${month} - ${weekday}`;
};

const formatTime = (dateString: string | undefined): string => {
    if (!dateString) return '00:00';
    
    const dateObj = new Date(dateString.replace(' ', 'T')); // Convert to ISO format

    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
};

const counters = ref([0, 0]);
const limit = ref(0);
const getTotal = () => counters.value[0] + counters.value[1];

const increment = (index: number) => {
  if (getTotal() < limit.value) {
    counters.value[index]++;
  }
};

const decrement = (index: number) => {
  if (counters.value[index] > 0) {
    counters.value[index]--;
  }
};
const stuff = ref('Loading...');

onMounted(async () => {
    try {
        await storage.create();

        text.value = await loadChunks('table' + props.location);

        await nextTick();

        const clickableElements = Array.from(svgContainer.value!.querySelectorAll('g[id^="table-"]'))
            .filter((el: any) => {
                const match = el.id.match(/^table-(\d+)$/);
                return match && Number(match[1]) >= 1 && Number(match[1]) <= 15;
            });

        clickableElements.forEach((el: any) => {
            el.addEventListener('click', (e: any) => {
                const clickedId = e.currentTarget.id;
                const tableId = clickedId.replace('table-', '');
                const table =  props.tables?.find((t: any) => t.table_nr == tableId);
                console.log(`Clicked ID: ${clickedId}`);
                openModal(table);
            });
        });
    } catch (error) {
        console.error('Error loading SVG:', error);
    }
});
</script>
<style scoped>
.svg-wrapper {
    width: 100%;
}
.modifier {
  font-size: 1.5rem;
}
.counter-value {
  font-size: 1.5rem;
  min-width: 2rem;
  text-align: center;
}
</style>
