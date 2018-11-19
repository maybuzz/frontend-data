"use strict"

// d3.json('/data.json').then(data => {
//   console.log(data);

var width = 800,
    height = 600;

var canvas = d3.select('#vis').append('svg')
    .attr("width", width)
    .attr("height", height)
    .append("g")
      .attr("transform", "translate(50, 50)");

var pack = d3.layout.pack()
    .size([width, height - 50])
    .padding(10);

d3.json('/data.json').then(data => {
   console.log(data);
});

// var w = 960,
//       h = 960,
//       format = d3.format(",d");
//   var pack = d3.pack()
//       .size([w - 4, h - 4])
//       .value(function(d) { return d.size; });
//
//  var vis = d3.select("#vis").append("svg")
//      .attr("width", w)
//      .attr("height", h)
//      .attr("class", "pack")
//    .append("svg:g")
//      .attr("transform", "translate(2, 2)");
//
//  d3.json("/data.json", function(json) {
//    var node = vis.data([json]).selectAll("g.node")
//        .data(pack.nodes)
//      .enter().append("svg:g")
//        .attr("class", function(d) { return d.data ? "node" : "leaf node"; })
//        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
//
//    node.append("svg:title")
//        .text(function(d) { return d.name + (d.data ? "" : ": " + format(d.size)); });
//
//    node.append("svg:circle")
//        .attr("r", function(d) { return d.r; });
//     node.filter(function(d) { return !d.data; }).append("svg:text")
//        .attr("text-anchor", "middle")
//        .attr("dy", ".3em")
//        .text(function(d) { return d.name.substring(0, d.r / 3); });
//  });





// var svg = d3.select("#vis").append('svg'),
//     margin = 20,
//     diameter = +svg.attr("width"),
//     g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
//
// var color = d3.scaleLinear()
//     .domain([-1, 5])
//     .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
//     .interpolate(d3.interpolateHcl);
//
// var pack = d3.pack()
//     .size([diameter - margin, diameter - margin])
//     .padding(2);
//
// d3.json("/data.json", function(error, root) {
//   if (error) throw error;
//
//   root = d3.hierarchy(root)
//       .sum(function(d) { return d.size; })
//       .sort(function(a, b) { return b.value - a.value; });
//
//   var focus = root,
//       nodes = pack(root).descendants(),
//       view;
//
//   var circle = g.selectAll("circle")
//     .data(nodes)
//     .enter().append("circle")
//       .attr("class", function(d) { return d.parent ? d.data ? "node" : "node node--leaf" : "node node--root"; })
//       .style("fill", function(d) { return d.data ? color(d.depth) : null; })
//       .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
//
//   var text = g.selectAll("text")
//     .data(nodes)
//     .enter().append("text")
//       .attr("class", "label")
//       .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
//       .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
//       .text(function(d) { return d.data.name; });
//
//   var node = g.selectAll("circle,text");
//
//   svg
//       .style("background", color(-1))
//       .on("click", function() { zoom(root); });
//
// });
