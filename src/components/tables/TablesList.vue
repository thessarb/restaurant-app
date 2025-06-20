<template>
    <ion-content>
        <ion-row>
            <div v-if="!text" id="stuff">{{ stuff }}</div>
            <div class="svg-wrapper tablelist" ref="svgContainer" v-html="text"></div>
        </ion-row>
        <ion-modal ref="modal" :initial-breakpoint="0.85" trigger="open-modal" @willDismiss="onWillDismiss">
            <ion-header>
                <ion-toolbar>
                    <ion-title>{{ modalTitle }}</ion-title>
                    <ion-buttons slot="end">
                        <ion-button @click="cancel()">Cancel</ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <ion-row v-if="reserved">
                    <ion-col>
                        <ion-text class="ion-text-center">
                            <h2>This table is already reserved for this event. Please choose another table.</h2>
                        </ion-text>
                    </ion-col>
                </ion-row>
                <ion-row v-if="!reserved">
                    <ion-col>
                        <ion-list lines="none">
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
                            <ion-item class="default-bg" v-if="clickedTable?.restaurant_id === 2">
                                <ion-icon aria-hidden="true" :icon="clipboardOutline" slot="start"></ion-icon>
                                <ion-label>Table number: {{ clickedTable?.table_nr }}</ion-label>
                            </ion-item>
                            <ion-item class="default-bg" v-if="clickedTable?.nr_people">
                                <ion-icon aria-hidden="true" :icon="peopleOutline" slot="start"></ion-icon>
                                <ion-label>Max. number of people for this table: {{ clickedTable?.nr_people
                                    }}</ion-label>
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
                                <ion-button class="modifier" @click="decrement(index)"
                                    :disabled="counters[index] === 0">-</ion-button>
                                <ion-text class="counter-value">{{ value }}</ion-text>
                                <ion-button class="modifier" @click="increment(index)"
                                    :disabled="getTotal() >= limit">+</ion-button>
                            </ion-item>
                        </ion-list>
                        <ion-card class="default-bg ion-padding" id="checkout"></ion-card>
                        <ion-button :disabled="process" color="primary" expand="block" @click="paymentFlow"
                            v-if="hasPositiveSum">Reserve</ion-button>
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
    // event: Object
});
import { ref, computed, onMounted, nextTick } from 'vue';
import type { Ref } from 'vue';
import { Storage } from '@ionic/storage';
import { OverlayEventDetail } from '@ionic/core/components';
import { calendarOutline, cashOutline, alarmOutline, locationOutline, documentOutline, peopleOutline, clipboardOutline } from 'ionicons/icons';
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios';
import { useAuthStore } from "@/stores/authStore";
import { loadStripe, Stripe, StripeEmbeddedCheckout } from '@stripe/stripe-js';
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
    IonText,
    IonRow,
    IonCard
} from '@ionic/vue';

const storage = new Storage();
const svgContainer: Ref<HTMLElement | null> = ref(null);
const text = ref('');
const message = ref('This modal example uses triggers to automatically open a modal when the button is clicked.');
const modal = ref();
const cancel = () => {
    modal.value.$el.dismiss(null, 'cancel');
    process.value = false;
};
const onWillDismiss = (event: CustomEvent<OverlayEventDetail>) => {
    if (event.detail.role === 'confirm') {
        message.value = `Hello, ${event.detail.data}!`;
    }
};
const reserved = ref(false);
const modalTitle = ref('Reserve table');
const counters = ref([0, 0]);
const limit = ref(0);
const getTotal = () => counters.value[0] + counters.value[1];
const authStore = useAuthStore();
const hasPositiveSum = computed(() => {
    return counters.value.reduce((a, b) => a + b, 0) > 0;
});
const ch = ref<StripeEmbeddedCheckout | null>(null);

interface Table {
    id: number;
    deposit: number;
    min_spending: number;
    nr_people: number;
    restaurant_id: number;
    event: Event | null;
    table_nr: number;
    details: string | null;
    zone: Zone | null;
    created_at: string;
    updated_at: string;
}

interface Zone {
    id: number;
    name: string;
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

const event = ref<Event>({
    id: 8,
    name: "Pizza Night",
    date_start: "2025-05-13 12:17:50",
    description: "Indulge in a variety of delicious pizzas made fresh from our oven.",
    rules: "Take-out options available.",
    nr_tikets: 0,
    price_per_ticket: 0,
    restaurant_id: null,
    restaurant: null,
    created_at: "2025-03-29T12:17:50.000000Z",
    updated_at: "2025-03-29T12:17:50.000000Z",
    image: null
});

// const clickedTableId = ref('');
const clickedTable = ref({} as Table);
const openModal = async (table: any) => {
    await checkReservedTable(event.value, table);
    clickedTable.value = table;
    if (table.restaurant_id === 1) {
        modalTitle.value = `Reserve table ${table.table_nr}`;
    } else {
        modalTitle.value = `Reserve table on ${table.zone?.name}`;
    }
    limit.value = table.nr_people || 0;
    counters.value = [0, 0];
    await modal.value.$el.present();
};

const checkReservedTable = async (event: Event | null, table: Table | null) => {
    try {
        const response = await axios.get(`${authStore.endpoint}reservation/check/availability/tables?event_id=${event?.id}&table_id=${table?.id}`, {
            headers: {
                Accept: 'application/json',
                "Authorization": `Bearer ${authStore.token}`,
            },
        });
        reserved.value = response.data.available.length > 0;
        return response.data.available;
    } catch (error) {
        console.error(error);
        authStore.logout();
    }
};

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
const stripe = ref<Stripe | null>(null);
const process = ref(false);

const initializeStripe = async (tableObj: any) => {
    ch.value?.destroy();
    ch.value = null;
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    if (stripe.value) {
        ch.value = await stripe.value.initEmbeddedCheckout({
            fetchClientSecret: () => fetchClientSecret(tableObj),
        });

        // Mount Checkout
        ch.value.mount('#checkout');
    }
};


const paymentFlow = () => {
    initializeStripe(clickedTable.value);
}

const fetchClientSecret = async (tableObj: any) => {
    try {
        const response = await axios.post(import.meta.env.VITE_APP_ENDPOINT + 'stripe/checkout',
            {
                price: tableObj?.deposit + '00',
                name: 'Table reservation for ' + event.value.name,
                type: 'reservation',
                male: counters.value[0],
                female: counters.value[1],
                restaurant_id: event.value.restaurant_id,
                user_id: authStore.user?.id,
                event_id: event.value.id,
                table_id: clickedTable.value.id,
            },
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${authStore.token}`,
                }
            });
        const { clientSecret } = response.data;
        process.value = true;
        return clientSecret;
    } catch (error) {
        console.error('Error fetching client secret:', error);
        authStore.logout();
    }
};

const route = useRoute();

const detail = async () => {
    try {
        const response = await axios.get(`${authStore.endpoint}event/${route.params.id}`, {
            headers: {
                Accept: 'application/json',
            },
        });
        event.value = response.data.data;
    } catch (error) {
        console.error(error);
        authStore.logout();
    }
};

onMounted(async () => {
    try {
        await storage.create();
        // text.value = await loadChunks('table' + props.location);
        text.value = await storage.get('table' + props.location);
        await nextTick();
        const clickableElements = Array.from(svgContainer.value!.querySelectorAll('[table]'));

        clickableElements.forEach((el: any) => {
            el.addEventListener('click', (e: any) => {
                const tableId = e.currentTarget.getAttribute('table');
                const table = props.tables?.find((t: any) => t.id == tableId);
                openModal(table);
            });
        });
    } catch (error) {
        console.error('Error loading SVG:', error);
    }

    detail();
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
