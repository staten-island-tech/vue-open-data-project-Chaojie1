<template>
  <svg :width="width" :height="height">
    <g :transform="`translate(${width / 2}, ${height / 2})`">


      <path
        v-for="(slice, i) in slices"
        :key="i"
        :d="arc(slice)"
        :fill="color(i)"
        stroke="white"
        stroke-width="2"
      />


      <text
        v-for="(slice, i) in slices"
        :key="'l' + i"
        :transform="`translate(${labelArc.centroid(slice)})`"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="13"
        fill="white"
      >{{ data[i].label }}</text>


    </g>
  </svg>


  <br />
</template>


<script setup>
import { ref, computed } from 'vue'
import * as d3 from 'd3'


const width  = 400
const height = 400
const radius = Math.min(width, height) / 2 - 20


const isDonut = ref(false)


const data = ref([
  { label: 'Apples',   value: 30 },
  { label: 'Bananas',  value: 20 },
  { label: 'Cherries', value: 15 },
  { label: 'Dates',    value: 25 },
  { label: 'Elderb.',  value: 10 },
])


const pie = d3.pie().value(d => d.value).sort(null)


const slices = computed(() => pie(data.value))


const arc = computed(() =>
  d3.arc()
    .innerRadius(isDonut.value ? radius * 0.5 : 0)
    .outerRadius(radius)
)


const labelArc = computed(() =>
  d3.arc()
    .innerRadius(radius * 0.65)
    .outerRadius(radius * 0.65)
)


const color = d3.scaleOrdinal(d3.schemeObservable10)
</script>

