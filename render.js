/* ================================ SAMPLE DATA ================================= */

var sampleJson = [
  {id: 1, value: "A", connections: [2,5,6]}, 
  {id: 2, value: "B", connections: [3,4]},
  {id: 3, value: "C", connections: [4]},
  {id: 4, value: "D", connections: [1]},
  {id: 5, value: "E", connections: [2,3,4]},
  {id: 6, value: "F", connections: [5]},
];

/* ================================ FUNCTIONS ================================= */

// update graph with JSON taken from textarea
function updateGraph() {
  console.log('UPDATING');
  var obj = JSON.parse(document.getElementById("jsonObjectArea").value);
  console.log("JSON object: ", obj);
  plotGraph(obj);
}


// render sample json object
function renderSampleJson() {
  console.log('UPDATING')  
  plotGraph(sampleJson);
  document.getElementById("jsonObjectArea").value = JSON.stringify(sampleJson);
}


// plot the graph from json object
function plotGraph(jsonObject) {
  var node = {},
    neighbor = {},
    outgoingEdges, 
    totalEdges;

  // get each node
  for(i=0; i<jsonObject.length; i++) {

    node = jsonObject[i];
    outgoingEdges = node.connections.length;
    totalEdges = outgoingEdges + 0;
    neighbor = {};
    
    // CHECK NODE CONNECTIONS
    for(j=0; j<jsonObject.length; j++) {
      neighbor = jsonObject[i];
      // break if node fails criteria
      if(neighbor.id !== node.id) {
        if(neighbor.connections.indexOf(node.id) !== -1) {
          totalEdges++;
        }
      }
    }

    if(totalEdges > 5) {
      console.log('ERROR: more than 5 edges on node ' + node.id);
      break;
    } else {
      console.log('Node passed criteria: ' + node.id);
    }
  }

  // MAP NODE EDGES
  mapConnections(jsonObject, function() {
    console.log('node mapped');
  });
};


// map all nodes with edges
function mapConnections(jsonObject) {
  
  // Create a new directed graph
  var g = new dagreD3.graphlib.Graph().setGraph({ edgeSep: 50 });

  // Set and label each of the nodes
  jsonObject.forEach(function(node) {
    g.setNode(node.id.toString(), { label: node.value });
  });

  // Set up the edges
  jsonObject.forEach(function(node) {
    node.connections.forEach(function(neighbor) {
      g.setEdge(node.id.toString(), neighbor.toString(), { label: "" });
    });    
  });

  // Set some general styles
  g.nodes().forEach(function(v) {
    var nodeObj = g.node(v);
    nodeObj.rx = nodeObj.ry = 5;
  });

  var svg = d3.select("svg"),
      inner = svg.select("g");

  // Set up zoom support
  var zoom = d3.behavior.zoom().on("zoom", function() {
        inner.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
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

}


/* ================================ DEFAULT GRAPH ================================= */

function enterTheMatrix() {

  document.getElementById("jsonObjectArea").value = "";

  // Create a new directed graph
  var g = new dagreD3.graphlib.Graph().setGraph({ edgeSep: 30 });

  // States and transitions from RFC 793
  var states = [ "NEO", "MORPHEUS", "ORACLE", "TRINITY",
                 "MOUSE", "DOZER", "CYPHER", "TANK",
                 "APOC", "SWITCH", "SMITH" ];

  // Automatically label each of the nodes
  states.forEach(function(state) { g.setNode(state, { label: state }); });

  // Set up the edges
  g.setEdge("NEO",   "ORACLE",     { label: "" });
  g.setEdge("NEO",     "MORPHEUS",     { label: "" });
  g.setEdge("MORPHEUS",     "ORACLE",   { label: "" });
  g.setEdge("MORPHEUS",     "TRINITY",   { label: "" });
  g.setEdge("MORPHEUS",     "NEO",     { label: "" });
  g.setEdge("ORACLE",   "DOZER",  { label: "" });
  g.setEdge("ORACLE",   "MOUSE",      { label: "" });
  g.setEdge("ORACLE",   "TANK",      { label: "" });
  g.setEdge("TRINITY",   "ORACLE",   { label: "" });
  g.setEdge("TRINITY",   "MOUSE",      { label: "" });
  g.setEdge("TRINITY",   "NEO",     { label: "" });
  g.setEdge("MOUSE",      "DOZER",  { label: "" });
  g.setEdge("MOUSE",      "CYPHER", { label: "" });
  g.setEdge("DOZER",  "TANK",  { label: "" });
  g.setEdge("DOZER",  "APOC",    { label: "" });
  g.setEdge("CYPHER", "SWITCH",   { label: "" });
  g.setEdge("TANK",  "SMITH",  { label: "" });
  g.setEdge("APOC",    "SMITH",  { label: "" });
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
        inner.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
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

}

enterTheMatrix();


/* ================================ DEPRECATED ================================= */

/* 

// check if node meets acceptance criteria
function checkNode(nodeObj, jsonObject, callback) {
  var outgoingEdges = nodeObj.connections.length;
  var totalEdges = outgoingEdges + 0;
  var node = {};
  
  // get each node
  for(i=0; i<jsonObject.length; i++) {
    node = jsonObject[i];
    // break if node fails criteria
    if(node.id !== nodeObj.id) {
      if(node.connections.indexOf(nodeObj.id) !== -1) {
        totalEdges++;
      }
    }
  }

  if(totalEdges > 5) {
    console.log('ERROR: more than 5 edges on node ' + nodeObj.id);
    // return false;
    callback(false);
  } else {
    console.log('Node passed criteria: ' + nodeObj.id)
    // return true;
    callback(true);
  }

}

*/
