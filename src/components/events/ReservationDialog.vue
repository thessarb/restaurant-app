<template>
    <ion-grid class="ion-padding">
        <ion-button color="primary" id="open-modal" expand="block">Choose table</ion-button>
        <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
        <ion-header>
            <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button @click="cancel()">Cancel</ion-button>
            </ion-buttons>
            <ion-title>{{ event?.name }}</ion-title>
            <ion-buttons slot="end">
                <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
            </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
        </ion-content>
        </ion-modal>
    </ion-grid>
</template>
  
  <script lang="ts" setup>
    import {
      IonButtons,
      IonButton,
      IonModal,
      IonHeader,
      IonContent,
      IonToolbar,
      IonTitle,
      IonGrid
    } from '@ionic/vue';
    import { OverlayEventDetail } from '@ionic/core/components';
    import { ref } from 'vue';

    const modal = ref();
    const input = ref();

    defineProps({
      event: Object
    });
  
    const cancel = () => modal.value.$el.dismiss(null, 'cancel');
    const confirm = () => {
      const name = input.value.$el.value;
      modal.value.$el.dismiss(name, 'confirm');
    };
  
  </script>
  