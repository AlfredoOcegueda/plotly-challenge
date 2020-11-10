// Get the names to the dropdown 
d3.json("data/samples.json").then((data) => {
    var names = data.names;
    console.log(data.metadata);
    var option = d3.selectAll("#selDataset");
    Object.entries(names).forEach(([index,value]) => {
        option.append("option").text(value);
    })
})

// Create a function that plots the .json using function arrow
function Plot(nameID){
    d3.json("data/samples.json").then((data) => {
        var samples = data.samples;
        var samplesID = samples.map(row => row.id).indexOf(nameID);
        
        // Making the bar plot
        var sampleValues = samples.map(row => row.sample_values);
        var sampleValues = sampleValues[samplesID].slice(0,10).reverse();
        var otuIds = samples.map(row => row.otu_ids);
        var otuIds = otuIds[samplesID].slice(0,10);
        var otuLabels = samples.map(row => row.otu_labels); 
        var otuLabels = otuLabels[samplesID].slice(0,10);

        // Creating the Trace and adding attributes
        var trace = {
            x: sampleValues,
            y: otuIds.map(r => `OTU ${r}`),
            text: otuLabels,
            type:"bar",
            orientation:"h"
        }

        // Plot the chart to a div tag with id "bar"
        Plotly.newPlot("bar", [trace]);

         // Making the bubble chart
         var otuValue = samples.map(row => row.sample_values);
         var otuValue = otuValue[samplesID];
         var otuId = samples.map(row => row.otu_ids);
         var otuId = otuId[samplesID];
         var otuLabel = samples.map(row => row.otu_labels); 
         var otuLabel = otuLabel[samplesID];
         var min = d3.min(otuId);
         var max = d3.max(otuId);

         // Configure a linear scale with a range between the 0 and 1 and the domain between min and the max of the samples
         var linearsc = d3.scaleLinear()
            .domain([min, max])
            .range([0, 1]);
         var bubbleColors = otuId.map(val => d3.interpolateRgbBasis(["red", "blue", "lawngreen"])(linearsc(val)));
         
         // Creating the Trace and adding attributes
         var trace1 = {
             x: otuId,
             y: otuValue,
             text: otuLabel,
             mode: "markers",
             marker: {
                 color: bubbleColors,
                 size: otuValue.map(x => x*10),
                 sizemode: "area"
             }
         };
         var bubbleLayout = {
             xaxis:{
                 autochange: true,
                 height: 600,
                 width: 1000,
                 title: {
                     text: "OTU ID"
                 }
             },
         };
         
         // Plot the chart to a div tag with id "bubble"
         Plotly.newPlot("bubble", [trace1], bubbleLayout);
        
         // Making the gauge chart 
         var meta = data.metadata;
         var newData = [
             {
                 domain: { x: [0, 1], y: [0, 1] },
                 value: meta[samplesID].wfreq,
                 title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
                 type: "indicator",
                 mode: "gauge+number",
                 gauge: { axis: { range: [null, 9],
                            tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                            ticks: "outside" },
                 bar:{color: "darkblue"},
                    steps: [
                     { range: [0, 1], color: "rgba(237, 240, 240, 1)"},
                     { range: [1, 2], color: "rgba(218, 220, 220, 1)"},
                     { range: [2, 3], color: "rgba(208, 209, 209, 1)"},
                     { range: [3, 4], color: "rgba(187, 205, 202, 1)"},
                     { range: [4, 5], color: "rgba(177, 205, 200, 1)"},
                     { range: [5, 6], color: "rgba(165, 206, 198, 1)"},
                     { range: [6, 7], color: "rgba(149, 209, 196, 1)"},
                     { range: [7, 8], color: "rgba(129, 214, 197, 1)"},
                     { range: [8, 9], color: "rgba(63, 212, 181, 1)"}
                   ]}
             }
         ];
         
         var Layout = { width: 600, height: 500};

         // Plot the chart to a div tag with id "gauge"
         Plotly.newPlot("gauge", newData, Layout);

         // Making and displaying the meta info to a div tag with id "sample-metadata"
         var metadata = d3.select("#sample-metadata");
         metadata.html('');
         Object.entries(meta[samplesID]).forEach(([key,value]) => {
             metadata.append('p').text(`${key.toUpperCase()}:\n${value}`);
         })
     })
 }
 
 // Submit Button handler and make new plots if ID changed
function optionChanged(newId) {
    Plot(newId);
}