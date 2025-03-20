<template>
<ion-content class="ion-padding">
    <ion-button color="primary" id="open-modal" expand="block">Open</ion-button>
    <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="cancel()">Cancel</ion-button>
          </ion-buttons>
          <ion-title>{{event?.name}}</ion-title>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        
      </ion-content>
    </ion-modal>
  </ion-content>
  </template>
  
  <script lang="ts" setup>
  import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle
  } from '@ionic/vue';
  import { OverlayEventDetail } from '@ionic/core/components';
  import { ref } from 'vue';
  defineProps({
    event: Object
});

  const modal = ref();
  const input = ref();

  const cancel = () => modal.value.$el.dismiss(null, 'cancel');

  const confirm = () => {
    const name = input.value.$el.value;
    modal.value.$el.dismiss(name, 'confirm');
  };

  const onWillDismiss = (event: CustomEvent<OverlayEventDetail>) => {
    if (event.detail.role === 'confirm') {
        console.log('clicked');
    }
  };
</script>