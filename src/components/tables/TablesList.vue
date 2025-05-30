<template>
  <ion-content>
    <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="cancel()">Cancel</ion-button>
          </ion-buttons>
          <ion-title>Welcome</ion-title>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item>
          <ion-input
            label="Enter your name"
            label-placement="stacked"
            ref="input"
            type="text"
            placeholder="Your name"
          ></ion-input>
        </ion-item>
      </ion-content>
    </ion-modal>
  </ion-content>
  <ion-row>
    <div  class="svg-wrapper" ref="svgContainer" v-html="text"></div>
  </ion-row>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import type { Ref } from 'vue';
import { Storage } from '@ionic/storage';
import { OverlayEventDetail } from '@ionic/core/components';

import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonItem,
    IonInput,
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
	const clickedTableId = ref('');
		const openModal = async (id: string) => {
		clickedTableId.value = id;
		await modal.value.$el.present();
	};

onMounted(async () => {
  	try {
		await storage.create();

		text.value = await storage.get('table1');
		console.log(text.value);

		await nextTick();

		const clickableElements = Array.from(svgContainer.value!.querySelectorAll('[id^="table"]'))
		.filter((el: any) => {
				const match = el.id.match(/^table(\d+)$/);
				return match && Number(match[1]) >= 1 && Number(match[1]) <= 15;
		});

		clickableElements.forEach((el: any) => {
			el.addEventListener('click', (e: any) => {
				const clickedId = e.currentTarget.id;
				console.log(`Clicked ID: ${clickedId}`);
				openModal(clickedId);
			});
		});
	} catch (error) {
		console.error('Error loading SVG:', error);
	}
});
</script>
<style scoped>
	.svg-wrapper {
		width: 100%
	}
</style>
