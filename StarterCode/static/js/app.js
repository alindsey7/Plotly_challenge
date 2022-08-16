function metaData(id) {
    d3.json("samples.json").then((data)=> {
        //console.log(data);
        
        // get the metadata info for the demographic panel
        var metadata = data.metadata;

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

function buildCharts(id) {
    d3.json("samples.json").then(function(data){
        //console.log(data);

        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        // get only top 10 sample values to plot
        var sampleValues = samples.sample_values.slice(0, 10).reverse();

        // get only top 10 otu ids for the plot
        var idValues = (samples.otu_ids.slice(0, 10)).reverse();
        
        // get the otu id's to the desired form for the plot
        var idOtu = idValues.map(d => "OTU " + d)

        // get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);

                // create trace variable for the plot
        var trace = {
            x: sampleValues,
            y: idOtu,
            text: labels,
            type:"bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 30,
                b: 20
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data, layout);

        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };

        // set the layout for the bubble plot
        var layout = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1300
        };

        // create the data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout); 

        // create pie chart
        var tracePie = {
            labels: idOtu,
            values:sampleValues,
            type:"pie",
        }

        var data = [tracePie]
        
        
        Plotly.newPlot("gauge", data)

    });    
}

function optionChanged(id) {
    buildCharts(id);
    metaData(id);
}

function init() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(function(data){
        
        data.names.forEach(function(element) {
            dropdown.append("option").text(element).property("value");
        });
        buildCharts(data.names[0]);
        metaData(data.names[0]);
    })

}

init();