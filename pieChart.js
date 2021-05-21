const width = 900;
const height = 600;
const margin = 50;

let populationData = [
    {id: 1, eta: "0-9", popolazione: 4.73},
    {id: 2, eta: "10-19", popolazione: 5.67},
    {id: 3, eta: "20-29", popolazione: 6.03},
    {id: 4, eta: "30-39", popolazione: 6.74},
    {id: 5, eta: "40-49", popolazione: 8.69},
    {id: 6, eta: "50-59", popolazione: 9.45},
    {id: 7, eta: "60-69", popolazione: 7.43},
    {id: 8, eta: "70-79", popolazione: 5.95},
    {id: 9, eta: "80-89", popolazione: 3.66},
    {id: 10, eta: "90+", popolazione: 0.89}
];

let color = d3.scaleOrdinal()
    .domain(populationData.map((d)=>d.eta))
    .range(d3.schemeCategory10);

let svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "lightgray");

let chart = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

let outRadius = Math.min(width, height) / 2 - margin;
let inRadius = outRadius/10;

let pie = d3.pie()
    .value((d)=>d.popolazione)
    .sort((a,b)=>d3.ascending(a.id, b.id));

let arc = d3.arc()
    .innerRadius(inRadius)
    .outerRadius(outRadius);

let labelArc = d3.arc()
    .innerRadius(outRadius - inRadius)
    .outerRadius(outRadius - inRadius);

let valori = pie(populationData);
console.log(valori);

let paths = chart.selectAll("path")
    .data(valori);

paths.enter()
    .append("path")
    .attr("id", (e)=>"path" + e.data.id)
    .transition().duration(500)
    .attr("d", arc)
    .attr("fill", (d)=>color(d.data.eta))
    .style("stroke", "lightgray")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

chart.selectAll("path").on("mouseover", function(d, i){
    d3.select(this).transition().style("opacity", 0.95);
    })
    .on("mouseout", function(d, i){
        d3.select(this).transition().style("opacity", 0.7)
    });

chart.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(valori)
    .enter()
    .append("text")
    .attr("id", (e)=>"path" + e.data.id)
    .attr("class", "label")
    .attr("transform", (d)=>"translate(" + labelArc.centroid(d) + ")")
    .call((text)=>text.append("tspan")
        .text((d)=>d.data.eta)
        .attr("font-weight", "bold")
        .attr("y", "-0.4em"))
    .call((text)=>text.filter((d)=>(d.endAngle - d.startAngle) > 0.25).append("tspan")
        .text((d)=>d.data.popolazione + " M")
        .attr("y", "0.7em")
        .attr("x", 0));

/*
chart.selectAll("path")
    .on("click", function(d,i){
        let prevId = parseInt(this.id.substring(4));
        let nextId = increment11(prevId);
        console.log(prevId, nextId);
        prevId = "path" + prevId;
        nextId = "path" + nextId;
        console.log(prevId, nextId);
        let prevPath = d3.select("#" + prevId);
        let nextPath = d3.select("#" + nextId);
    })
*/

chart.selectAll("path")
    .on("click", function(d,i){
        let prevId = parseInt(this.id.substring(4));
        let nextId = increment10(prevId);
        let prevIdTag = "path" + prevId;
        let nextIdTag = "path" + nextId;
        console.log(prevId, nextId);
        console.log("pre:" + populationData[prevId-1])
        console.log("next:" + populationData[nextId-1])
        populationData[nextId - 1].id = prevId;
        populationData[prevId - 1].id = nextId;
        populationData.sort((a,b)=>d3.ascending(a.id, b.id));
        valori = pie(populationData);
        updateDraw();
    })

function updateDraw(){
    chart.selectAll("path").data(valori)
        .attr("id", (e)=>"path" + e.data.id)
        .transition().duration(1000)
        .attr("d", arc)
        .attr("fill", (d)=>color(d.data.eta))
    chart.selectAll("text").data(valori)
        .attr("id", (e)=>"label" + e.data.id)
        .attr("transform", (d)=>"translate(" + labelArc.centroid(d) + ")")
        .text("")
        .call((text)=>text.append("tspan")
        .text((d)=>d.data.eta)
        .attr("font-weight", "bold")
        .attr("y", "-0.4em"))
    .call((text)=>text.filter((d)=>(d.endAngle - d.startAngle) > 0.25).append("tspan")
        .text((d)=>d.data.popolazione + " M")
        .attr("y", "0.7em")
        .attr("x", 0));

}

function increment10(idx){
    if (idx >= 10) return 1;
    else return idx + 1;
}