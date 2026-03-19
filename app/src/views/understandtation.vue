<!-- all this is ai generated, im studying this -->
<template>
  <svg :width="400" :height="400">
    <g :transform="`translate(${400 / 2}, ${400 / 2})`">

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

const data = ref([
  { label: 'Apples',   value: 90},
  { label: 'Bananas',  value: 20 },
  { label: 'Cherries', value: 15 },
  { label: 'Dates',    value: 25 },
  { label: 'Elderb.',  value: 10 },
])

const pie = d3.pie().value(d => d.value).sort(null)

const slices = computed(() => pie(data.value))

const arc = computed(() =>
  d3.arc()
    .innerRadius(false ? (Math.min(400, 400) / 2 - 20) * 0.5 : 0)
    .outerRadius((Math.min(400, 400) / 2 - 20))
)

const labelArc = computed(() =>
  d3.arc()
    .innerRadius((Math.min(400, 400) / 2 - 20) * 0.65)
    .outerRadius((Math.min(400, 400) / 2 - 20) * 0.65)
)

const color = d3.scaleOrdinal(d3.schemeObservable10)
</script>