"use strict"

d3.json('/data.json').then(result => {
  var margin = 20
  var diameter = 400

  const svg = d3.select('body').append('svg')
    .attr('width', diameter)
    .attr('height', diameter)

  const g = svg.append('g').attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')')

  const color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

  // structure data
  const sortByLanguage = d3.nest()
    .key(d => d.language)
    .entries(result)
    .map(language => ({name: language.key, children: language.values}))

  const data = sortByLanguage.map(language => {
    const bySubject = d3.nest()
      .key(book => book.subject)
      .entries(language.children)
      .map(subject => {
        return {
          name: subject.key,
          children: subject.values.map(book => ({...book}))
        }
      })
    return {
      name: language.name,
      children: bySubject
    }
  })[0]

  const root = d3.hierarchy(data)
    .sum(d =>  d.totalPages)
    .sort((a, b) => b.value - a.value);

  console.log('root: ', root);

  const pack = d3.pack()
    .size([diameter, diameter])
    .padding(3)
  //
  // let focus = root
  const nodes = pack(root).descendants()
  console.log('data: ', nodes);
  let view

  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .style("fill", function(d) { return d.children ? color(d.depth) : null; })
      // .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

  var text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .text(function(d) { return d.data.name || d.data.title; });

  var node = g.selectAll("circle, text");

  svg
      .style("background", color(-1))
      // .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus0 = focus;
    focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function zoomTo(v) {
    console.log('zoomTo: ', v);
    var k = diameter / v[2];
    view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }
})
