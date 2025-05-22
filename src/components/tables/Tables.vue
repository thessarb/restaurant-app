<template>
    <ion-row>
		<div  class="svg-wrapper" ref="svgContainer" v-html="text"></div>
	</ion-row>
</template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import {

    IonRow
} from '@ionic/vue';
  const svgContainer = ref(null)
  const text = ref('')
  
  onMounted(async () => {
    try {
      const response = await fetch('/zone-1.svg')
      text.value = await response.text() // Let Vue inject this via v-html
  
      await nextTick() // Wait for Vue to update the DOM
  
      const clickableElements = Array.from(svgContainer.value.querySelectorAll('[id^="table"]'))
      .filter(el => {
        const match = el.id.match(/^table(\d+)$/);
        return match && Number(match[1]) >= 1 && Number(match[1]) <= 15;
      });
      clickableElements.forEach(el => {
        el.addEventListener('click', (e) => {
            const clickedId = e.currentTarget.id; // This gives the ID of the element you attached the listener to
          console.log(`Clicked ID: ${clickedId}`);      
        })
      })
    } catch (error) {
      console.error('Error loading SVG:', error)
    }
  });
  </script>
  <style scoped>
  .svg-wrapper {
    width: 100%;
    transform: rotate(90deg);

  }
  </style>
  