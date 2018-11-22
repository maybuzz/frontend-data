'use strict'

// used Mike Bostock's Zoomable Circle Pack example; https://bl.ocks.org/mbostock/7607535
// Dennis Wegereef @Denniswegereef, Folkert-Jan vd Pol @FjvdP and Titus Wormer @wooorm helped me setup this datavis

d3.json('/data.json').then(result => {
  const margin = 20
  const diameter = 750

  const svg = d3.select('#vis').append('svg')
    .attr('width', diameter)
    .attr('height', diameter)

  const g = svg.append('g').attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')')

  const color = d3.scaleLinear()
    .domain([-1, 5])
    .range(['hsla(323, 80%, 82%, 1)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);

  // structure data
  // setup .nest() with Dennis Weegreef
  const sortByLanguage = d3.nest()
    .key(d => d.originalLanguage)
    .entries(result)
    .map(language => ({name: language.key, children: language.values}))

  // const data = sortByLanguage.map(language => {
  //     const byGenre = d3.nest()
  //       // .key(book => book.genres)
  //       .key(book => book.genres)
  //       .entries(result)
  //       .map(data => ({
  //         name: language.name,
  //         children: data
  //       }))
  //       // .entries(result)
  //     return { name: language.name, children: byGenre }
  // })[0]
  // const books = goodData.map(books => {
  //   const byBooks = d3.nest()
  //     .key()
  // })
  // .map(genre => {
  //   return {
  //     name: genre.key,
  //     children: genre.values.map(book => ({...book}))
  //   }
  // })

  const dataLanguage = sortByLanguage.map(language => {
    // const bySubject = d3.nest()
    //   // .key(book => book.originalLanguage)
    //   .key(book => console.log(book.genres))
    //   .entries(language)
    //
    //   console.log(language.children)
    //
    //   const newReturn = language.children.map(data => {
    //     return { name: language.name, children: bySubject
    //         // .map(item => ({
    //         //   name: item.key,
    //         //   children: item.values.map(book => ({
    //         //     name: book.title,
    //         //     children: book
    //         //   }))
    //         // }))
    //     }})[0]
        return {
          name: language.key,
          children: sortByLanguage
        }
  })[0]

  const dataBooks = sortByLanguage.map(language => {
        return {
          name: language.key,
          children: result
        }
  })[0]

// setup circle pack
// using my nested data with Folkert-Jan vd Pol
// finished circle pack setup + fixed hierarchy with Titus Wormer
  const root = d3.hierarchy(dataLanguage)
    .sum(d =>  d.totalPages)
    .sort((a, b) => b.value - a.value)

  const pack = d3.pack()
    .size([diameter, diameter])
    .padding(3)

  let focus = root
  const nodes = pack(root).descendants()
  let view

  const circle = g.selectAll('circle')
    .data(nodes)
    .enter().append('circle')
      .attr('class', function(d) {
        return d.parent ? d.children ? 'node' : 'node node--leaf' : 'node node--root'})
      .style('fill', function(d) { return d.children ? color(d.depth) : null})
      .on('click', function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation()})

  const text = g.selectAll('text')
    .data(nodes)
    .enter().append('text')
      .attr('class', 'label')
      .style('font-size', function(d) { return Math.min(.2 * d.r, (.2 * d.r - 8) / this.getComputedTextLength() * 24) + 'px'})
      .style('fill-opacity', function(d) { return d.parent === root ? 1 : 0; })
      .style('display', function(d) { return d.parent === root ? 'inline' : 'none'})
      .text(function(d) { return d.data.name || d.data.title})

  const node = g.selectAll('circle, text')

  svg.on('click', function() { zoom(root) })

  zoomTo([root.x, root.y, root.r * 2 + margin])

  function zoom(d) {
    const focus0 = focus
    focus = d

    const transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween('zoom', d => {
          let i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin])
          return function(t) { zoomTo(i(t))}
        })

    transition.selectAll('text')
      .filter(function(d) { return d.parent === focus || this.style.display === 'inline'})
      .style('fill-opacity', function(d) { return d.parent === focus ? 1 : 0})
      .on('start', function(d) { if (d.parent === focus) this.style.display = 'inline'})
      .on('end', function(d) { if (d.parent !== focus) this.style.display = 'none'})
  }

  function zoomTo(v) {
    const k = diameter / v[2]
    view = v
    node.attr('transform', function(d) { return 'translate(' + (d.x - v[0]) * k + ',' + (d.y - v[1]) * k + ')'})
    circle.attr('r', function(d) { return d.r * k})
  }

  const button = d3.select('#button').append('button')
    .text('Change data')
    .on('click', function(){
      console.log('clicked')
    })

}).catch(err => {
  console.log(err)
})
