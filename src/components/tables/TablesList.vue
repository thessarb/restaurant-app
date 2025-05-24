<template>
  <ion-row>
  <div  class="svg-wrapper" ref="svgContainer" v-html="text"></div>
</ion-row>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import type { Ref } from 'vue';
import { Storage } from '@ionic/storage';
import {
    IonRow
} from '@ionic/vue';
const storage = new Storage();
const svgContainer: Ref<HTMLElement | null> = ref(null);
const text = ref('');

onMounted(async () => {
  try {
    await storage.create(); // Initialize storage

    text.value = await storage.get('table1'); // Load the SVG text
    console.log(text.value);

    await nextTick(); // Wait for DOM to update

    const clickableElements = Array.from(svgContainer.value!.querySelectorAll('[id^="table"]'))
      .filter((el: any) => {
        const match = el.id.match(/^table(\d+)$/);
        return match && Number(match[1]) >= 1 && Number(match[1]) <= 15;
      });

    clickableElements.forEach((el: any) => {
      el.addEventListener('click', (e: any) => {
        const clickedId = e.currentTarget.id;
        console.log(`Clicked ID: ${clickedId}`);
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
