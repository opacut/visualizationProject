var data;

/*Loading data from CSV file and editing the properties to province codes. Unary operator plus is used to save the data as numbers (originally imported as string)*/
d3.csv("https://data.cdc.gov/api/views/bi63-dtpu/rows.csv?accessType=DOWNLOAD", function(d) {
  return {
    year : +d.Year,
    causeNameLong : d["113 Cause Name"],
    causeName : d["Cause Name"],
    state : d.State,
    deaths : +d.Deaths,
    ageAdjustedDeathRate : +d["Age-adjusted Death Rate"]
  };
}).then(function(d){
  //console.log(d);
  data = d;
  visualization();
});

var pieWidth = 450
      pieHeight = 450
      pieMargin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
var pieRadius = Math.min(pieWidth, pieHeight) / 2 - pieMargin

// append the svg object to the div called 'my_dataviz'
var pieSvg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
  .append("g")
    .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

// create 2 data_set
var data1 = {a: 9, b: 20, c:30, d:8, e:12}
var data2 = {a: 6, b: 16, c:20, d:14, e:19, f:12}

// set the color scale
var pieColor = d3.scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f"])
  .range(d3.schemeDark2);


// Initialize the plot with the first dataset
console.log("total cause values")
//console.log(getTotalCauseValues(2000));
console.log("are stated")
//updatePieChart(getTotalCauseValues(2000));


// A function that create / update the plot for a given variable:
function updatePieChart(data) {
  console.log(data)
  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  var data_ready = pie(d3.entries(data))

  // map to data
  var u = pieSvg.selectAll("path")
    .data(data_ready)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .enter()
    .append('path')
    .merge(u)
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(pieRadius)
    )
    .attr('fill', function(d){ return(pieColor(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)

    u
      .attr('title', function(d){d.data.key})
  /* u
    .enter()
    .append('text')
    .text(function(d){ return d.data.key})
    .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
    .style("text-anchor", "middle")
    .style("font-size", 17) */

  // remove the group that is not present anymore
  u
    .exit()
    .remove()

   
}

function visualization() {
  console.log("starting visualization");
  var dataEntriesCount = data.length;
  var chosenState = null;

  var canvas = d3.select(".map");

  function borderIt(obj){
    if(chosenState != null){
      d3.select("#"+chosenState).style("stroke-width",0);
    }
    d3.select(obj).style("stroke","yellow").style("stroke-width",4);
  }

  console.log("canvas set to");
  console.log(canvas);
  canvas.selectAll("path").on("click", function(){
    console.log("adding listener.")
    borderIt(this);
    chosenState = d3.select(this).attr('id');
    console.log(chosenState);
  });
  canvas.selectAll("circle").on("click", function(){
    console.log("adding listener.")
    borderIt(this);
    chosenState = d3.select(this).attr('id');
    console.log(chosenState);
  });

  //var t = 0;
  
  //find highest value
  /*
  var max = 0;

  data.forEach(function(object){
    for(var key in object){
      if(key != "date"){
        if(object[key]>max){
          max = object[key];
        }
      }
    }
  });
  */

  // var canvas = d3.select("body").select(".map");

  // var ratio = 2.5;                  //  stretching ratio of the graph
  // var gh = 120;                     //  height of the graph
  // var gw = ratio*dataEntriesCount;  //  width of the graph

  // // Setting up canvas of the graph and saving to variable
  // var graph = d3.select("body")
  //   .select(".graph")
  //   .attr("width",gw)
  //   .attr("height",gh);

  // // line indicating selected time point
  // graph.append("line")
  // 	.attr("x1", t*ratio)
  // 	.attr("y1", 0)
  // 	.attr("x2", t* ratio)
  // 	.attr("y2", gh)
  // 	.attr("stroke-width", ratio)
  // 	.attr("stroke", "silver");

  // // line indicating selected time point
  // graph.append("line")
  // 	.attr("x1", t*ratio)
  // 	.attr("y1", 0)
  // 	.attr("x2", t* ratio)
  // 	.attr("y2", gh)
  // 	.attr("stroke-width", ratio)
  // 	.attr("stroke", "silver");

  // //add legend
  // showLegendFunc();

  // //define the scales for bar height and color based on value
  // var heightScale = d3.scaleLinear()
  //                         .domain([0, max])
  //                         .range([0,gh - 10]);
                        
  // var colorScale = d3.scaleLinear()
  //                         .domain([0, max])
  //                         .range(["black","red"]);  

  // /*----------------------
  // INTERACTION
  // ----------------------*/
  //event handler CLICK ON MAP
  // canvas.selectAll("g").on("click", function(){
     // highlight selected province
    //  borderIt(this);
     /*
     setColors();

     // atribute ID of selected element saved to chosenState
     chosenState = d3.select(this).attr('id');
     // add labels
     d3.selectAll("h2").remove();
     d3.select("#infectedCount").remove();
     d3.select("#statusID").append("h2").text(chosenState);
     d3.select("#statusID").append("p").text("Number of infected: " + data[t][chosenState] + ", week: " + data[t]['date']).attr('id', "infectedCount");
     graphIt();   //Draw graph
     */
  // });

  // //event handler CLICK ON GRAPH
  // graph.on('click', function () {
  // 	  t = parseInt(d3.mouse(this)[0]/ ratio);
  //    // move the line indicating the selected time point in graph
  //    graph.select("line")
  //             .attr("x1", ratio *t + ratio/2)
  //             .attr("x2", ratio *t + ratio/2);	
  //    d3.select("#infectedCount").text("Number of infected: " + data[t][chosenState] + ", week: " + data[t]['date']);
  //    setColors();
  // });
  // /*----------------------
  // END OF INTERACTION
  // ----------------------*/

  // /*----------------------
  // FUNCTIONS
  // ----------------------*/
  // //draw legend
  // function showLegendFunc() {
  //   //gradient from black to red
  //   var gradient = canvas.append("defs")
  //     .append("linearGradient")
  //       .attr("id", "gradient")
  //       .attr("x1", "0%")
  //       .attr("y1", "50%")
  //       .attr("x2", "100%")
  //       .attr("y2", "50%")
  //       .attr("spreadMethod", "pad");
  //   gradient.append("stop")
  //           .attr("offset", "0%")
  //           .attr("stop-color", "black")
  //           .attr("stop-opacity", 1);
  //   gradient.append("stop")
  //           .attr("offset", "100%")
  //           .attr("stop-color", "red")
  //           .attr("stop-opacity", 1);
  //   canvas.append("rect")
  //           .attr("width",200)
  //           .attr("height", 20)
  //           .attr("x", 10)
  //           .attr("y",460)
  //           .attr("stroke", "lightgray")
  //           .attr("stroke-width",2)
  //           .attr("fill", "url(#gradient)");
  //   canvas.append("text")
  //           .text("Legend")
  //           .attr("x", 10)
  //           .attr("y",450);
  //   canvas.append("text")
  //           .text("0")
  //           .attr("x", 5)
  //           .attr("y",500);
  //   canvas.append("text")
  //           .text(max)
  //           .attr("x", 180)
  //           .attr("y",500);
  // }

  // //setting of colour
  // function setColors() {
  //   canvas.selectAll("g")
  //     .attr("fill", function(){
  //         return colorScale(data[t][d3.select(this).attr("id")])
  //     });
  // }

  // //redraw the graph – used based on click on map
  // function graphIt(){
  // 		graph.selectAll(".gData").remove();
  // 		// Draws the graph based on selection
  //     for (var i = 0; i < dataEntriesCount; i++) {
  //       for(var key in data[i]) {
  //         if (key == chosenState) {
  //   	    var value = data[i][key];
  //           var barHeight = heightScale(value);
  //           graph.append("rect")
  //     				.attr("x", ratio *i)
  //     				.attr("y", gh-barHeight-10)
  //     				.attr("width", ratio)
  //     				.attr("height", barHeight)
  //     				.attr("class", "gData")
  //     				.attr("i", i)
  //     				.attr("fill", colorScale(value));
  //        }
  //      }
  //    }
  // }

  //highlight selected country
  // function borderIt(obj){
  // //remove border of previously selected state 
  //     	if(chosenState != null){
  //        	 d3.select("#"+chosenState).style("stroke-width", 0);
  //    	}
  //     	d3.select(obj).style("stroke", "yellow").style("stroke-width", 4);
  // }
  // /*----------------------
  // END OF FUNCTIONS
  // ----------------------*/
  // /*----------------------
  // END OF VISUALIZATION
  // ----------------------*/
  var values2000 = getCauseValuesByYear(2000);
  var values2013 = getCauseValuesByYear(2013);
  values2000.forEach(function(a){
    if(a.causeName != "All Causes"){
      console.log(a.year);
    }
  });
  values2013.forEach(function(a){
    if(a.causeName != "All Causes"){
      console.log(a.year);
    }
  });
  //console.log(getTotalCauseValues(2000));
  //pieChart()
  updatePieChart(getTotalCauseValues(2000));
};

function getTotalCauseValues(yr){
  var filteredByYear = getCauseValuesByYear(yr);
  var causes = data.causeName;
  var ret = [];// = new Map();
  filteredByYear.forEach(function(d){
    //console.log(d);
    if(d.causeName != "All causes"){
      if(ret[d.causeName]){
        ret[d.causeName] += d.deaths;
      }
      else{
        ret[d.causeName] = d.deaths;
      }
    }
  });
  return ret;
}

function getCauseValuesByYear(yr){
  var ret = [];
  data.forEach(function(d){
    if(d.year == yr){
      ret.push(d);
    }
  });
  return ret;
}