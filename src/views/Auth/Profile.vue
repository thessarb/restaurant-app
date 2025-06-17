<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ionic__toolbar">
                <ion-title class="ion-text-center">Profile</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="profile">
            <ion-header collapse="condense">
                <ion-toolbar class="default-bg">
                    <ion-title size="large">Profile</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-grid class="profile__data">
                <ion-row>
                    <ion-col>
                        <ion-list lines="none">
                            <ion-item class="default-bg">
                                <ion-label>Name: {{ user?.name }}</ion-label>
                            </ion-item>
                            <ion-item class="default-bg">
                                <ion-label>Phone: {{ user?.phone }}</ion-label>
                            </ion-item>
                        </ion-list>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-grid class="profile__history" v-if="authStore?.user?.role_id !== 3">
                <ion-row>
                    <ion-col>
                        <ion-item lines="none" class="default-bg ion-text-center">{{ upcomingReservations }}</ion-item>
                        <ion-item lines="none" class="default-bg">{{ upcomingReservations === 1 ? 'upcoming reservation' : 'upcoming reservations' }}</ion-item>
                    </ion-col>
                    <ion-col>
                        <ion-item lines="none" class="default-bg ion-text-center">{{ totalReservations }}</ion-item>
                        <ion-item lines="none" class="default-bg">{{ totalReservations === 1 ? 'total reservation' : 'total reservations' }}</ion-item>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-list>
                <router-link :to="{ name: 'personal' }">
                    <ion-item class="default-bg" lines="none">
                        <ion-icon :icon="personOutline" slot="start"></ion-icon>
                        <ion-label>Personal information</ion-label>
                    </ion-item>
                </router-link>
                <router-link :to="{ name: 'password' }">
                    <ion-item class="default-bg" lines="none">
                        <ion-icon :icon="lockClosedOutline" slot="start"></ion-icon>
                        <ion-label>Security</ion-label>
                    </ion-item>
                </router-link>
                <router-link :to="{ name: 'privacy' }">
                    <ion-item class="default-bg" lines="none">
                        <ion-icon :icon="informationCircleOutline" slot="start"></ion-icon>
                        <ion-label>Privacy Policy</ion-label>
                    </ion-item>
                </router-link>
            </ion-list>
            <ion-list class="logout profile__logout">
                <ion-item class="default-bg" @click="logout()" lines="none">
                    <ion-icon color="danger" :icon="logOutOutline" slot="start"></ion-icon>
                    <ion-label color="danger">Log Out</ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonCol,
    IonRow,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    onIonViewWillEnter
} from '@ionic/vue';
import { informationCircleOutline, lockClosedOutline, logOutOutline, personOutline } from 'ionicons/icons';
import { useAuthStore } from "@/stores/authStore";
import { ref, onMounted } from 'vue';
import axios from 'axios';

const authStore = useAuthStore();
const user = ref(authStore.user);
const logout = () => {
    authStore.logout();
}
const upcomingReservations = ref(0);
const totalReservations = ref(0);

interface Reservation {
    id: string | number
    type: string
    date_start: string
}

interface Reservations {
    upcoming: Reservation[]
    completed: Reservation[]
}

const reservations = ref<Reservations>({
    upcoming: [],
    completed: []
});

const getReservations = async () => {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_ENDPOINT + `reservation/reservations?user_id=${authStore?.user?.id}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${authStore.token}`,
                }
            });
        reservations.value = response.data.reservations;
        upcomingReservations.value = reservations.value.upcoming.length;
        totalReservations.value = reservations.value.upcoming.length + reservations.value.completed.length;
    } catch (error) {
        console.error('Error fetching client secret:', error);
    }
}

onMounted(() => {
    getReservations();
});

onIonViewWillEnter(() => {
    user.value = authStore.user;
});

</script>
<style lang="css">
.rounded {
    border-radius: 50%;
    width: 80px;
    align-items: center;
}

.logout {
    position: absolute;
    width: 100%;
    bottom: 50px;
}

ion-list {
    --background: unset;
}
</style>
