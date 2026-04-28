





// dim
const margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height*1.4 + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);


//data

 d3.csv("data.csv").then(function(data) { 


//how to  make stackbar with hover over pop image of values https://d3-graph-gallery.com/graph/barplot_stacked_hover.html
//subgroup
  const subgroups = data.columns.slice(1)

  //  groups
  const groups = data.map(d => d.demographic)

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-70)")
    .style("text-anchor", "end");


  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));


// Found how to do from -> https://stackoverflow.com/q/14605348 -> Posted by DataByDavid
    //Create X axis label   
    svg.append("text")
    .attr("x", width / 2 )
    .attr("y",  500)
    .style("text-anchor", "middle")
    .text("Demographic group");

    //Create Y axis label
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", -(height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Percentage of disciplinary action");  

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#E8EDF2','#2C3947','#547A95', '#C2A56D','#C9996B','#CBD99B', '#454040','#BD114A', '#FF9B51','#E8D1C5', '#8FABD4'])


  //stack the data
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)


  // Create a tooltip

  const tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // Three function that change the tooltip when user hover / move / leave a cell


  let ci = 0;
  let ci_b = 0;
  let ci_c = 0;
  let ci_d = 0;
  let ci_e = 0;
  let ci_f = 0;
  let ci_g = 0;
  let ci_h = 0;

        const incCount = document.getElementById("incCount");
        const incCount_b = document.getElementById("incCount_b");
        const incCount_c = document.getElementById("incCount_c");
        const incCount_d = document.getElementById("incCount_d");
        const incCount_e = document.getElementById("incCount_e");
        const incCount_f = document.getElementById("incCount_f");
        const incCount_g = document.getElementById("incCount_g");
        const incCount_h = document.getElementById("incCount_h");
        function inc(d) {
         if (d.data.demographic === "ESOL") {
            ci =  ci + 1;
          } 
          else if (d.data.demographic === "2+ races") {
            ci_b =  ci_b + 1;
          }
          else if (d.data.demographic === "Pacific islander") {
            ci_c =  ci_c + 1;
          }
          else if (d.data.demographic === "White") {
            ci_d =  ci_d + 1;
          }
          else if (d.data.demographic === "Black/African American") {
            ci_e =  ci_e + 1;
          }
          else if (d.data.demographic === "Hispanic") {
            ci_f =  ci_f + 1;
          }
          else if (d.data.demographic === "Asian") {
            ci_g =  ci_g + 1;
          }
          else {ci_h =  ci_h + 1;}

          update();
            }
        

function update() {
    incCount.textContent = ci;
    incCount_b.textContent = ci_b; 
    incCount_c.textContent = ci_c;
    incCount_d.textContent = ci_d;    
    incCount_e.textContent = ci_e;
    incCount_f.textContent = ci_f;    
    incCount_g.textContent = ci_g;
    incCount_h.textContent = ci_h;    
     
}

  const mouseover = function(event, d) {
    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName];
    inc(d)
    update()

    tooltip
        .html("Disciplinary action: " + subgroupName + "<br>" + "Percentage: " + subgroupValue)
        .style("opacity", 1)
  }
  const mousemove = function(event, d) {
    tooltip.style("transform","translateY(-55%)")
           .style("left",(event.x)/2+"px")
           .style("top",(event.y)/2-30+"px")
  }
  const mouseleave = function(event, d) {
    tooltip.style("opacity", 0)
  }


  // bars
  svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        .attr("x", d =>  x(d.data.demographic))

        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
        .attr("stroke", "grey")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)


//learned how to make counter with https://www.geeksforgeeks.org/javascript/design-a-simple-counter-using-html-css-and-javascript/ 



});


