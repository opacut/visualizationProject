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
  canvas.selectAll("g").on("click", function(){
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
};