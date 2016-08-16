/* ================================ SAMPLE DATA ================================= */

var originalJson = [
  {id: 1, value: "A", connections: [3, 4, 5]}, 
  {id: 2, value: "B", connections: [3]},
  {id: 3, value: "C", connections: [7]},
  {id: 4, value: "D", connections: [5]},
  {id: 5, value: "E", connections: [13]},
  {id: 6, value: "F", connections: [3]},
  {id: 7, value: "G", connections: [8]},
  {id: 8, value: "H", connections: [9]},
  {id: 9, value: "I", connections: []},
  {id: 10, value: "J", connections: [8, 9]},
  {id: 11, value: "K", connections: [5, 13]},
  {id: 12, value: "L", connections: []},
  {id: 13, value: "M", connections: [12]},
]

var sampleJson = [
  {id: 1, value: "A", connections: [2, 5, 6, 26]}, 
  {id: 2, value: "B", connections: [3, 4, 8]},
  {id: 3, value: "C", connections: [4]},
  {id: 4, value: "D", connections: [1, 8]},
  {id: 5, value: "E", connections: [2, 3, 4]},
  {id: 6, value: "F", connections: [5, 14]},
  {id: 7, value: "G", connections: [9]},
  {id: 8, value: "H", connections: [10, 11]},
  {id: 9, value: "I", connections: [11]},
  {id: 10, value: "J", connections: [9]},
  {id: 11, value: "K", connections: [10, 12]},
  {id: 12, value: "L", connections: []},
  {id: 13, value: "M", connections: [10, 12, 14]},
  {id: 14, value: "N", connections: [12]},
  {id: 15, value: "O", connections: [8, 12, 13, 16]},
  {id: 16, value: "P", connections: [12, 17, 18]},
  {id: 17, value: "Q", connections: []},
  {id: 18, value: "R", connections: [17]},
  {id: 19, value: "S", connections: [20]},
  {id: 20, value: "T", connections: [15]},
  {id: 21, value: "U", connections: [20, 22]},
  {id: 22, value: "V", connections: [20]},
  {id: 23, value: "W", connections: [24]},
  {id: 24, value: "X", connections: [22]},
  {id: 25, value: "Y", connections: [22, 24]},
  {id: 26, value: "Z", connections: [21, 23, 25]},
  // {id: , value: "", connections: []},
];


var paths = [];
var intersections = [];
  

/* ================================ FUNCTIONS ================================= */

// update graph with JSON taken from textarea
function updateGraph() {
  console.log('UPDATING');
  var obj = JSON.parse(document.getElementById("jsonObjectArea").value);
  console.log("JSON object: ", obj);
  verifyNodes(obj);
}


// render sample json object
function renderSampleJson() {
  console.log('UPDATING')  
  verifyNodes(sampleJson);
  document.getElementById("jsonObjectArea").value = JSON.stringify(sampleJson);
}

// render sample json object
function renderOriginalJson() {
  console.log('UPDATING')  
  verifyNodes(originalJson);
  document.getElementById("jsonObjectArea").value = JSON.stringify(originalJson);
}


// plot the graph from json object
function verifyNodes(jsonObject) {

  var node = {},
    neighbor = {},
    validData = false,
    outgoingEdges, 
    totalEdges;

    paths = [];
    intersections = [];


  // get each node
  loop1:
  for(i=0; i<jsonObject.length; i++) {

    node = jsonObject[i];
    outgoingEdges = node.connections.length;
    totalEdges = outgoingEdges + 0;
    neighbor = {};
    
    // CHECK NODE CONNECTIONS
    loop2:
    for(j=0; j<jsonObject.length; j++) {
      neighbor = jsonObject[j];
      // break if node fails criteria
      if(neighbor.id !== node.id && (neighbor.connections).indexOf(node.id) !== -1) {
        totalEdges++;
      }
    }

    if(totalEdges > 5) {
      alert('ERROR: more than 5 edges on node id ' + node.id);
      validData = false;
      break loop1;
    } else {
      validData = true;
    }
  }


  // MAP NODE EDGES
  if(validData) {
    plotGraph(jsonObject, function() {
      console.log('node mapped');
    });  
  }    
};

// check if two curved svg paths intersect
function checkIntersection(path, secondPath) {
  // Kevin Lindsey's library
  var shape1 = new Path(path);
  var shape2 = new Path(secondPath);
  var overlays = Intersection.intersectShapes(shape1, shape2);

  for (point in overlays.points) {
    if (overlays.points[point].hasOwnProperty('x') && overlays.points[point].hasOwnProperty('y')) {
       intersections.push(overlays.points[point]);
       path.setAttribute('style', 'stroke: red; fill: none')
       secondPath.setAttribute('style', 'stroke: red; fill: none')
    }
  } 
}

// find all intersection points in graph
function findAllIntersections() {

  paths = document.getElementsByClassName('path');

  var firstPath, secondPath;

  for(var m = 0; m < paths.length; m++) {
    firstPath = paths[m];
    for(n=m+1; n < paths.length; n++) {
      secondPath = paths[n];
      if(m!==n)
      checkIntersection(firstPath, secondPath);
    }      
  }

  console.log('Intersections: ', intersections);

  if(intersections.length > 0) {
    // Do something
    alert("Intersections found: " + intersections.length )
  }    
}


// map all nodes with edges
function plotGraph(jsonObject) {
  
  console.log('MAPPING EDGES')

  // Create a new directed graph
  var g = new dagreD3.graphlib.Graph().setGraph({ edgeSep: 30 });

  // Set and label each of the nodes
  jsonObject.forEach(function(node) {
    // g.setNode(node.id.toString(), { label: node.value });
    g.setNode(node.id.toString(), { label: "value: " + node.value + ", id: " + node.id, width: 100 });
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

  findAllIntersections();

}

renderOriginalJson();

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

  /*

  // document.getElementsByClassName('path')[0].getAttribute('d')

  function getPoints() {
    g.edges().forEach(function(e) {
      var edge = g.edge(e)
      console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
      drawPoint(edge.points[1].x, edge.points[1].y, 'green');
    });
  }

  getPoints();

  */

}

// enterTheMatrix();
// renderSampleJson();



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
