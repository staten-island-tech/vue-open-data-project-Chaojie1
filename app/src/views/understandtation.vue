<template>
  <div ref="chartcon">

  </div>
</template>

<script setup>
  import {ref, onMounted} from 'vue'
  import * as d3 from 'd3'
  const chartcon = ref(null)
  const data = [
    {label: "grayton", value:1.75},
    {label: "darwen", value:2},
    {label: "daniel", value:5},
    {label: "talon", value:2},
    {label: "chaojie", value:1}
  ]
  onMounted(()=>{
    const margin = { top: 20, right: 20, bottom: 40, left: 100 }
    const width = 600 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom
    const svg = d3
    .select(chartcon.value)
    .append('svg')
    .attr('width',width+margin.left+margin.right)
    .attr('height',height+margin.top+margin.bottom)
    .append('g')
    .attr('transform',`translate(${margin.left},${margin.top})`)
    const x = d3
    .scaleBand()
    .domain(data.map(d => d.label))
    .range([0,width])
  const y = d3
    .scaleLinear()
    .domain([0,d3.max(data,d=>d.value)])
    .nice()
    .range([height,0])
  svg.append('g').attr('transform',`translate(0,${height})`).call(d3.axisBottom(x))
    svg.append('g').call(d3.axisLeft(y))
  svg
  .selectAll('.bar')
  .data(data)   
  .enter()         
  .append('rect')          
  .attr('class', 'bar')
  .attr('x', d => x(d.label))  
  .attr('y', d => y(d.value))          
  .attr('width', x.bandwidth())         
  .attr('height', d => height - y(d.value))
  .attr('fill', 'steelblue')
  })
</script>

<style scoped>

</style>