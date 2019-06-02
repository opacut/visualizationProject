var data;
var currentState = null;
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

var causeToColorMap = new Map();
causeToColorMap.set("Kidney disease", "#800000");
causeToColorMap.set("Alzheimer's disease", "#808000");
causeToColorMap.set("Diabetes", "#000075");
causeToColorMap.set("Influenza and pneumonia", "#ffe119");
causeToColorMap.set("Unintentional injuries", "#f58231");
causeToColorMap.set("CLRD", "#f032e6");
causeToColorMap.set("Stroke", "#bfef45");
causeToColorMap.set("Cancer", "#42d4f4");
causeToColorMap.set("Heart disease", "#e6194B");
causeToColorMap.set("Suicide", "#3cb44b");

var colorToCauseMap = new Map();
colorToCauseMap.set("#800000", "Kidney disease");
colorToCauseMap.set("#808000", "Alzheimer's disease");
colorToCauseMap.set("#000075", "Diabetes");
colorToCauseMap.set("#ffe119", "Influenza and pneumonia");
colorToCauseMap.set("#f58231", "Unintentional injuries");
colorToCauseMap.set("#f032e6", "CLRD");
colorToCauseMap.set("#bfef45", "Stroke");
colorToCauseMap.set("#42d4f4", "Cancer");
colorToCauseMap.set("#e6194B", "Heart disease");
colorToCauseMap.set("#3cb44b", "Suicide");

var stateCodeMap = new Map();
stateCodeMap.set("AK", "Alaska");
stateCodeMap.set("HI", "Hawaii");
stateCodeMap.set("AL", "Alabama");
stateCodeMap.set("AR", "Arkansas");
stateCodeMap.set("AZ", "Arizona");
stateCodeMap.set("CA", "California");
stateCodeMap.set("CO", "Colorado");
stateCodeMap.set("CT", "Connecticut");
stateCodeMap.set("DE", "Delaware");
stateCodeMap.set("FL", "Florida");
stateCodeMap.set("GA", "Georgia");
stateCodeMap.set("IA", "Iowa");
stateCodeMap.set("ID", "Idaho");
stateCodeMap.set("IL", "Illinois");
stateCodeMap.set("IN", "Indiana");
stateCodeMap.set("KS", "Kansas");
stateCodeMap.set("KY", "Kentucky");
stateCodeMap.set("LA", "Louisiana");
stateCodeMap.set("MA", "Massachusetts");
stateCodeMap.set("MD", "Maryland");
stateCodeMap.set("ME", "Maine");
stateCodeMap.set("MI", "Michigan");
stateCodeMap.set("MN", "Minnesota");
stateCodeMap.set("MO", "Missouri");
stateCodeMap.set("MS", "Mississippi");
stateCodeMap.set("MT", "Montana");
stateCodeMap.set("NC", "North Carolina");
stateCodeMap.set("ND", "North Dakota");
stateCodeMap.set("NE", "Nebraska");
stateCodeMap.set("NH", "New Hampshire");
stateCodeMap.set("NJ", "New Jersey");
stateCodeMap.set("NM", "New Mexico");
stateCodeMap.set("NV", "Nevada");
stateCodeMap.set("NY", "New York");
stateCodeMap.set("OH", "Ohio");
stateCodeMap.set("OK", "Oklahoma");
stateCodeMap.set("OR", "Oregon");
stateCodeMap.set("PA", "Pennsylvania");
stateCodeMap.set("RI", "Rhode Island");
stateCodeMap.set("SC", "South Carolina");
stateCodeMap.set("SD", "South Dakota");
stateCodeMap.set("TN", "Tennessee");
stateCodeMap.set("TX", "Texas");
stateCodeMap.set("UT", "Utah");
stateCodeMap.set("VA", "Virginia");
stateCodeMap.set("VT", "Vermont");
stateCodeMap.set("WA", "Washington");
stateCodeMap.set("WI", "Wisconsin");
stateCodeMap.set("WV", "West Virginia");
stateCodeMap.set("WY", "Wyoming");
stateCodeMap.set("DC", "District of Columbia");
stateCodeMap.set("DC1", "District of Columbia");
stateCodeMap.set("DC2", "District of Columbia");

// set the color scale
var pieColor = d3.scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f", "g", "h", "i"])
  //.range(d3.schemeDark2);
  .range(colors);

// Initialize the plot with the first dataset
//console.log("total cause values")
//console.log(getTotalCauseValues(2000));
//console.log("are stated")
//updatePieChart(getTotalCauseValues(2000));

function displayStateInfo(st, yr){
  if (st == null){
    return;
  }
  console.log("Chosen state: "+st+", chosen year: "+yr);
  var allCausesForState = [];
  data.forEach(function(d){
    if((d.year == yr)&&(d.state == stateCodeMap.get(st))){
      allCausesForState.push(d);
    }
  });
  var acs = allCausesForState.sort((a,b) => (a.deaths > b.deaths) ? -1 : 1);
  var resultHtml = "<h3>Chosen state: "+stateCodeMap.get(st)+"</h3><h4>Total deaths: "+acs[0].deaths+"</h4><ul><li>"+acs[1].causeName+": "+acs[1].deaths+"</li><li>"+acs[2].causeName+": "+acs[2].deaths+"</li><li>"+acs[3].causeName+": "+acs[3].deaths+"</li><li>"+acs[4].causeName+": "+acs[4].deaths+"</li><li>"+acs[5].causeName+": "+acs[5].deaths+"</li><li>"+acs[6].causeName+": "+acs[6].deaths+"</li><li>"+acs[7].causeName+": "+acs[7].deaths+"</li><li>"+acs[8].causeName+": "+acs[8].deaths+"</li><li>"+acs[9].causeName+": "+acs[9].deaths+"</li><li>"+acs[10].causeName+": "+acs[10].deaths+"</li></ul>"
  //var yr = d3.select("#chosenYear").html();
  console.log("HTML: "+d3.select("#stateInfo").html(resultHtml));
  console.log(allCausesForState);
}

function showToolTipPieChart(d){
  d3.select(this)
    .append("text")
    .attr("id", "noIdHere")
    .text("write text here");
}

function chooseCauseToVisualize(cs){
  //console.log("Cause chosen: "+cs);
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

    displayStateInfo(currentState, getCurrentYear());
}

function colorStates(yr){
  var stateColorMap = new Map();
  //find all the values for all states for this year
  var dataWithCorrectYear = [];
  var stateWithCause = new Map();
  var stateCodeMapInverted = new Map();
  for (var [k,v] of stateCodeMap){
    stateCodeMapInverted.set(v,k);
  }
  for (var [k, v] of stateCodeMap){
    var deaths = 0;
    var cause = "none";
    data.forEach(function(d){
      if((d.year == yr)&&(d.state==v)&&(d.deaths >= deaths)&&(d.causeName != "All causes")){
        //console.log("Cause: "+d.causeName+", deaths: "+d.deaths+", which is more than "+deaths);
        deaths = d.deaths;
        cause = d.causeName;
      }
    })
    stateColorMap.set(v, cause);
  }
  console.log(stateColorMap);
  console.log(stateCodeMapInverted);
  var canvas = d3.select(".map");
  for (var [k, v] of stateColorMap){
    //console.log("Processing "+k+", "+v+": "+stateCodeMapInverted.get(k)+", "+causeToColorMap.get(v));
    d3.select("#"+stateCodeMapInverted.get(k)).style("fill",causeToColorMap.get(v));
  }
  //canvas.selectAll("path").attr("style", "fill:"+"red"+";");
  //console.log("data with correct year: "+dataWithCorrectYear);
}

function getDistinctStates(){
  var ret = [];

}

function getStateColor(state, year){

}

function constructLegend() {
  var legend = d3.select("mapLegend");
  //console.log("legend: "+legend);
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
  //console.log("distinct causes:" + causes);
}


function visualization() {
  //console.log("starting visualization");
  var dataEntriesCount = data.length;
  var chosenState = null;

  var canvas = d3.select(".map");

  function borderIt(obj){
    if(chosenState != null){
      d3.select("#"+chosenState).style("stroke-width",0);
      //console.log("What state does it show in the original borderit function? "+chosenState);
    }
    d3.select(obj).style("stroke","yellow").style("stroke-width",4);
  }

  console.log("canvas set to");
  console.log(canvas);
  canvas.selectAll("path").on("click", function(){
    //console.log("adding listener.")
    borderIt(this);
    //getCurrentYear()
    chosenState = d3.select(this).attr('id');
    currentState = chosenState;
    displayStateInfo(chosenState, getCurrentYear());
    //console.log(chosenState);
  });
  canvas.selectAll("circle").on("click", function(){
    //console.log("adding listener.")
    borderIt(this);
    chosenState = d3.select(this).attr('id');
    currentState = chosenState;
    displayStateInfo(chosenState, getCurrentYear());
    //console.log(chosenState);
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
  
  colorStates(yr);
  return ret;
}

function getCurrentYear(){
  var yr = d3.select("#chosenYear").html();
  console.log("The current year is "+yr);
  var re = new RegExp('<h3>Chosen Year: (.*)</h3>');
  var year = re.exec(yr);
  return year[1];
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
