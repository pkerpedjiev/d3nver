/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||"undefined"!==typeof navigator&&navigator.msSaveOrOpenBlob&&navigator.msSaveOrOpenBlob.bind(navigator)||function(a){"use strict";if("undefined"===typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var k=a.document,n=k.createElementNS("http://www.w3.org/1999/xhtml","a"),w="download"in n,x=function(c){var e=k.createEvent("MouseEvents");e.initMouseEvent("click",!0,!1,a,0,0,0,0,0,!1,!1,!1,!1,0,null);c.dispatchEvent(e)},q=a.webkitRequestFileSystem,u=a.requestFileSystem||q||a.mozRequestFileSystem,
y=function(c){(a.setImmediate||a.setTimeout)(function(){throw c;},0)},r=0,s=function(c){var e=function(){"string"===typeof c?(a.URL||a.webkitURL||a).revokeObjectURL(c):c.remove()};a.chrome?e():setTimeout(e,10)},t=function(c,a,d){a=[].concat(a);for(var b=a.length;b--;){var l=c["on"+a[b]];if("function"===typeof l)try{l.call(c,d||c)}catch(f){y(f)}}},m=function(c,e){var d=this,b=c.type,l=!1,f,p,k=function(){t(d,["writestart","progress","write","writeend"])},g=function(){if(l||!f)f=(a.URL||a.webkitURL||
a).createObjectURL(c);p?p.location.href=f:void 0==a.open(f,"_blank")&&"undefined"!==typeof safari&&(a.location.href=f);d.readyState=d.DONE;k();s(f)},h=function(a){return function(){if(d.readyState!==d.DONE)return a.apply(this,arguments)}},m={create:!0,exclusive:!1},v;d.readyState=d.INIT;e||(e="download");if(w)f=(a.URL||a.webkitURL||a).createObjectURL(c),n.href=f,n.download=e,x(n),d.readyState=d.DONE,k(),s(f);else{a.chrome&&b&&"application/octet-stream"!==b&&(v=c.slice||c.webkitSlice,c=v.call(c,0,
c.size,"application/octet-stream"),l=!0);q&&"download"!==e&&(e+=".download");if("application/octet-stream"===b||q)p=a;u?(r+=c.size,u(a.TEMPORARY,r,h(function(a){a.root.getDirectory("saved",m,h(function(a){var b=function(){a.getFile(e,m,h(function(a){a.createWriter(h(function(b){b.onwriteend=function(b){p.location.href=a.toURL();d.readyState=d.DONE;t(d,"writeend",b);s(a)};b.onerror=function(){var a=b.error;a.code!==a.ABORT_ERR&&g()};["writestart","progress","write","abort"].forEach(function(a){b["on"+
a]=d["on"+a]});b.write(c);d.abort=function(){b.abort();d.readyState=d.DONE};d.readyState=d.WRITING}),g)}),g)};a.getFile(e,{create:!1},h(function(a){a.remove();b()}),h(function(a){a.code===a.NOT_FOUND_ERR?b():g()}))}),g)}),g)):g()}},b=m.prototype;b.abort=function(){this.readyState=this.DONE;t(this,"abort")};b.readyState=b.INIT=0;b.WRITING=1;b.DONE=2;b.error=b.onwritestart=b.onprogress=b.onwrite=b.onabort=b.onerror=b.onwriteend=null;return function(a,b){return new m(a,b)}}}("undefined"!==typeof self&&
self||"undefined"!==typeof window&&window||this.content);"undefined"!==typeof module&&null!==module?module.exports=saveAs:"undefined"!==typeof define&&null!==define&&null!=define.amd&&define([],function(){return saveAs});

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
var graph;

let parentWidth = d3.select('svg').node().parentNode.clientWidth;
let parentHeight = d3.select('svg').node().parentNode.clientHeight;

console.log('parentWidth:', parentWidth);
console.log('parentHeight:', parentHeight);

var svg = d3.select('svg')
.attr('width', parentWidth)
.attr('height', parentHeight)

var rect = svg.append('rect')
.attr('width', parentWidth)
.attr('height', parentHeight)
.style('fill', 'white')

var svg = svg.append('g');

var zoom = d3.zoom()
.on('zoom', zoomed)

rect.call(zoom);


function zoomed() {
    svg.attr('transform', d3.event.transform);
}

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
            .id(function(d) { return d.id; })
            .distance(function(d) { 
                return 30;
                //var dist = 20 / d.value;
                //console.log('dist:', dist);

                return dist; 
            })
          )
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(parentWidth / 2, parentHeight / 2))
    .force("x", d3.forceX(parentWidth/2))
    .force("y", d3.forceY(parentHeight/2));

function removeGraphcs() {
    svg.selectAll('g')
        .remove();
}

function createGraph(graph) {
    if (! ("links" in graph)) {
        console.log("Graph is missing links");
        return;
    }

    var nodes = {};
    var i;
    for (i = 0; i < graph.nodes.length; i++) {
        nodes[graph.nodes[i].id] = graph.nodes[i];
        graph.nodes[i].weight = 1.01;
    }


  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      //.attr("r", function(d) { return 8 * Math.sqrt(d.weight); })
      .attr("r", 5)
      .style('stroke', 'grey')
      .attr("fill", function(d) { 
          if ('color' in d)
              return d.color;
          else
            return color(d.group); 
      })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { 
          if ('name' in d)
              return d.name;
          else
                return d.id; 
      });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);


  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

    var brushMode = false;
    var brushing = false;

    var brush = d3.brush()
    .on("start", brushstarted)
    .on("brush", brushed)
    .on("end", brushended);

    var gBrushHolder = svg.append('g');
    var gBrush = null;
    /*
        .call(brush);
    */
    
    function brushstarted() {
        brushing = true;
    }

  function brushed() {
    var s = d3.event.selection;
  }

  function brushended() {
      if (!d3.event.sourceEvent) return;
      if (!d3.event.selection) return;
      if (!gBrush) return;

      gBrush.call(brush.move, null);

      if (!brushMode) {
          // the shift key has been release before we ended our brushing
          gBrush.remove();
          gBrush = null;
      }

      brushing = false;
  }

    d3.select('body').on('keydown', keydown);
    d3.select('body').on('keyup', keyup);

    function keydown() {
        var shiftKey = d3.event.shiftKey;

        if (shiftKey) {
            // if we already have a brush, don't do anything
            if (gBrush)
                return;

            brushMode = true;

            if (!gBrush) {
                gBrush = gBrushHolder.append('g');
                gBrush.call(brush);
            }
        }
    }

    function keyup() {
        var shiftKey = d3.event.shiftKey || d3.event.metaKey;
        brushMode = false;

        if (!brushing) {
            // only remove the brush if we're not actively brushing
            // otherwise it'll be removed when the brushing ends
            gBrush.remove();
            gBrush = null;
        }
    }

  return graph;
};

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.9).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

// load dataset and create table
function load_dataset(jsonText) {
  var data = JSON.parse(jsonText)
  console.log('data:', data);
  graph = createGraph(data);
  simulation.alphaTarget(0.3).restart();
}

// handle upload button
function upload_button(el, callback) {
  var uploader = document.getElementById(el);  
  var reader = new FileReader();

  reader.onload = function(e) {
    var contents = e.target.result;
    callback(contents);
  };

  uploader.addEventListener("change", handleFiles, false);  

  function handleFiles() {
    var file = this.files[0];
    reader.readAsText(file);
  };
};

function export_graph() {
    var data_string = JSON.stringify(graph);
    //console.log('data_string', data_string);
    var blob = new Blob([data_string], {type: "application/json"});
    saveAs(blob, 'graph.json');
}

function export_button(el, callback) {
    var exporter = document.getElementById(el);

    exporter.onclick = export_graph;
}



d3.json('miserables.json', function(graph) {
    createGraph(graph);
});
