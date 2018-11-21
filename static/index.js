"use strict"

d3.json('/data.json').then(data => {
  // var data = result.map(book => {
  //   var newBook = book
  //   newBook.title = book.title.substring(0, book.title.indexOf('/')).trim();
  //   newBook.totalPages = Number(book.totalPages.substring(0, book.totalPages.indexOf(' ')).trim());
  //   return newBook
  // })


   const sortByLanguage = d3.nest()
   .key(d => d.language)
   .entries(data)
   .map(language => ({name: language.key, children: language.values}))
   //
   const goodData = sortByLanguage.map(language => {
     const bySubject = d3.nest()
       .key(book => book.subject)
       .entries(language.children)
       .map(subject => {
         return {
           name: subject.key,
           children: subject.values.map(book => ({...book, value: 25})),
           value: 75
         }
       })
     return {
       name: language.name,
       children: bySubject,
       value: 100
     }
   })
   const diameter = 400

   const pack = d3.pack()
    .size(diameter, diameter)
    .padding(0)

   const root = d3.hierarchy(goodData)

   console.log(root)

   const nodes = pack(root).descendants()

   const canvas = d3.select('body')
     .append('svg')
     .attr('width', diameter)
     .attr('height', diameter)
     .append('g')
     .attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')')
   const node = canvas.selectAll('g')
    .data(nodes)
    .enter()
    .append('g')
    .classed('node', true)
    .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
    .style('fill' , 'red')

   node.append('circle')
    .attr('r', d => d.r)
    .attr('fill', 'orange')
    .attr('opacity', 0.5)

})
