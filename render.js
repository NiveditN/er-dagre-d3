// Create a new directed graph
var g = new dagreD3.graphlib.Graph().setGraph({ edgeSep: 50 });

// States and transitions from RFC 793
var states = [ "NEO", "MORPHEUS", "TRINITY", "DOZER",
               "MOUSE", "ORACLE", "CYPHER", "TANK",
               "APOC", "SWITCH", "SMITH" ];

// Automatically label each of the nodes
states.forEach(function(state) { g.setNode(state, { label: state }); });

// Set up the edges
g.setEdge("NEO",   "TRINITY",     { label: "" });
g.setEdge("NEO",     "MORPHEUS",     { label: "" });
g.setEdge("MORPHEUS",     "TRINITY",   { label: "" });
g.setEdge("MORPHEUS",     "DOZER",   { label: "" });
g.setEdge("MORPHEUS",     "NEO",     { label: "" });
g.setEdge("TRINITY",   "ORACLE",  { label: "" });
g.setEdge("TRINITY",   "MOUSE",      { label: "" });
g.setEdge("TRINITY",   "TANK",      { label: "" });
g.setEdge("DOZER",   "TRINITY",   { label: "" });
g.setEdge("DOZER",   "MOUSE",      { label: "" });
g.setEdge("DOZER",   "NEO",     { label: "" });
// g.setEdge("NEO",   "MOUSE",     { label: "" });

g.setEdge("MOUSE",      "ORACLE",  { label: "" });
g.setEdge("MOUSE",      "CYPHER", { label: "" });
g.setEdge("ORACLE",  "TANK",  { label: "" });
g.setEdge("ORACLE",  "APOC",    { label: "" });
g.setEdge("CYPHER", "SWITCH",   { label: "" });
g.setEdge("TANK",  "SMITH",  { label: "" });
g.setEdge("APOC",    "SMITH",  { label: "" });
// g.setEdge("SWITCH",   "NEO",     { label: "" });
g.setEdge("SMITH",  "NEO",     { label: "" });

// Set some general styles
g.nodes().forEach(function(v) {
  var node = g.node(v);
  node.rx = node.ry = 5;
});



// Add some custom colors based on state
g.node('NEO').style = "fill: #7f7";
g.node('SMITH').style = "fill: #f77";

var svg = d3.select("svg"),
    inner = svg.select("g");

// Set up zoom support
var zoom = d3.behavior.zoom().on("zoom", function() {
      inner.attr("transform", "translate(" + d3.event.translate + ")" +
                                  "scale(" + d3.event.scale + ")");
    });
svg.call(zoom);

// Create the renderer
var render = new dagreD3.render();

// Run the renderer. This is what draws the final graph.
render(inner, g);

// Center the graph
var initialScale = 0.75;
zoom
  .translate([(svg.attr("width") - g.graph().width * initialScale) / 2, 20])
  .scale(initialScale)
  .event(svg);
svg.attr('height', g.graph().height * initialScale + 40);