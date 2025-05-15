<template>
    <div ref="svgContainer" class="svg-wrapper" v-html="text"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  
  const svgContainer = ref(null)
  const text = ref('')
  
  onMounted(async () => {
    try {
      const response = await fetch('/UX-Design.svg')
      text.value = await response.text() // Let Vue inject this via v-html
  
      await nextTick() // Wait for Vue to update the DOM
  
      const clickableElements = svgContainer.value.querySelectorAll('g')
      clickableElements.forEach(el => {
        el.addEventListener('click', (e) => {
        //   alert(`Clicked: ${el.id}`)
        console.log(e.target)
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
  