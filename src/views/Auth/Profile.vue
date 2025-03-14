<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title class="ion-text-center">Profile</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Profile</ion-title>
                </ion-toolbar>
            </ion-header>
            <!--  -->
            
            <ion-grid>
                <ion-row>
                    <ion-col size="auto">
                        <img class="rounded" alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                    </ion-col>
                    <ion-col>
                        <ion-list  lines="none">
                            <ion-item>
                                <ion-label>{{user?.name}} {{user?.surname}}</ion-label>
                            </ion-item>
                            <ion-item>
                                <ion-label>Phone {{user?.phone}}</ion-label>
                            </ion-item>
                        </ion-list>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-item lines="none" class="ion-text-center">1</ion-item>
                        <ion-item lines="none">reservations</ion-item>
                    </ion-col>
                    <ion-col>
                        <ion-item lines="none" class="ion-text-center">1</ion-item>
                        <ion-item lines="none">places visited</ion-item>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-list>
                <router-link :to="{ name: 'personalinfo'}">
                    <ion-item lines="none">
                        <ion-icon aria-hidden="true" :icon="personOutline" slot="start"></ion-icon>
                        <ion-label>Personal information</ion-label>
                    </ion-item>
                </router-link>
                <router-link :to="{ name: 'security'}">
                    <ion-item  lines="none">
                        <ion-icon aria-hidden="true" :icon="lockClosedOutline" slot="start"></ion-icon>
                        <ion-label>Security</ion-label>
                    </ion-item>
                </router-link>
                <router-link :to="{ name: 'privacy'}">
                    <ion-item lines="none">
                        <ion-icon aria-hidden="true" :icon="informationCircleOutline" slot="start"></ion-icon>
                        <ion-label>Privacy and Policy</ion-label>
                    </ion-item>
                </router-link>
            </ion-list>
            <!--  -->
            <ion-list class="logout">
                <ion-item @click="logout()" lines="none">
                    <ion-icon  color="danger" aria-hidden="true" :icon="logOutOutline" slot="start"></ion-icon>
                    <ion-label  color="danger">Log Out</ion-label>
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
} from '@ionic/vue';
import { informationCircleOutline, lockClosedOutline, logOutOutline, personOutline } from 'ionicons/icons';
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const user = authStore.user;
const logout = () => {
    authStore.logout();
}

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
