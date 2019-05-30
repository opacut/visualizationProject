var data;
const distinct = (value, index, self) => {
  return self.indexOf(value) === index;
}

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

var pieWidth = 350
      pieHeight = 350
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

var colors = ["#800000", "#808000", "#000075", "#ffe119", "#f58231", "#f032e6", "#bfef45", "#42d4f4", "#e6194B", "#3cb44b"];



// set the color scale
var pieColor = d3.scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f", "g", "h", "i"])
  //.range(d3.schemeDark2);
  .range(colors);

// Initialize the plot with the first dataset
console.log("total cause values")
//console.log(getTotalCauseValues(2000));
console.log("are stated")
//updatePieChart(getTotalCauseValues(2000));

function displayStateInfo(st, yr){
  console.log("Chosen state: "+st+", chosen year: "+yr);
}

function showToolTipPieChart(d){
  d3.select(this)
    .append("text")
    .attr("id", "noIdHere")
    .text("write text here");
}

function chooseCauseToVisualize(cs){
  console.log("Cause chosen: "+cs);
}

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
    .attr('id', function(d){ return d.data.key;})
    .attr('class','pieSlice')
    .attr("onclick", function(d){ return "chooseCauseToVisualize(\""+d.data.key+"\");"})
    .style("stroke-width", "2px")
    .style("opacity", 1);

  u
    .exit()
    .remove()

   
}

function constructLegend() {
  var legend = d3.select("mapLegend");
  console.log("legend: "+legend);
  var causes = [];
  data.forEach(function(d){
    if(d.causeName != "All causes"){  
      causes.push(d.causeName);
    }
  });
  causes = causes.filter(distinct);
  causes.forEach(function(d){
    legend.append("p").attr("id", d)
  });
  console.log("distinct causes:" + causes);
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
    displayStateInfo(chosenState, getCurrentYear());
    chosenState = d3.select(this).attr('id');
    console.log(chosenState);
  });
  canvas.selectAll("circle").on("click", function(){
    console.log("adding listener.")
    borderIt(this);
    chosenState = d3.select(this).attr('id');
    console.log(chosenState);
  });
  //console.log(getTotalCauseValues(2000));
  //pieChart()
  updatePieChart(getTotalCauseValues(2000));
  constructLegend();
};

function getTotalCauseValues(yr){
  var filteredByYear = getCauseValuesByYear(yr);
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
  var chosenYear = d3.select("#chosenYear").html("<h3>Chosen Year: "+yr+"</h3>");
  return ret;
}