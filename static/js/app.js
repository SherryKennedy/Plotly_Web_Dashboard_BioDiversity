
// global vars:
let fileSamples = [];
let fileMetadata = [];


function init() {
    const filePath = "../../data/samples.json";
    console.log("in init section.");
    let firstSubjectID = "";
    let fileNames = [];
    // Initialize the dropdown with values
    // Get drop down as variable for reference
    let dropdownMenuTag = d3.select("#selDataset");

    // Load the data using once, large dataset, sets globals
    d3.json(filePath).then((data) => {
      // Get the samples
      fileSamples = data.samples;
      // Get the metadata
      fileMetadata = data.metadata;
      console.log(fileMetadata);
      fileNames = data.names;
      console.log(`filenames: ${fileNames}`);

      // append the subject numbers to the drop down
      fileNames.forEach((subjectNum) => {
        dropdownMenuTag
          .append("option")
          .text(subjectNum)
          .property("value", subjectNum);
      });
      
      // Use the first sample from the list to build the initial plots
      firstSubjectID = fileNames[0];

      console.log(firstSubjectID);
      visPlots(firstSubjectID);
      demoInfo(firstSubjectID);
      createGauge(firstSubjectID);
    });

  };

// HTML has this optionChanged function, event handler when selection is changed
function optionChanged(newSubjectID) {
    console.log("in optionChanged:  ");
    console.log(newSubjectID)
    // Fetch new data each time a new sample is selected
    visPlots(newSubjectID);
    demoInfo(newSubjectID);
    createGauge(newSubjectID);
};

function visPlots(subjectID) {
    // The following function builds a bar chart and a bubble chart
    console.log("in visPlots:  ");
  
    // Filter the sample data for a particular subject id
    let resultsarray= fileSamples.filter(sampleobject => sampleobject.id == subjectID);
    let result= resultsarray[0];
    //console.log(result);
    let ids = result.otu_ids;
    console.log(ids);
    let labels = result.otu_labels;
    console.log(labels);
    let values = result.sample_values;
    console.log(values);
  
    //  Build a bar Chart
    let bar_data =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
  
      }
      ];
  
    let barLayout = {
      title: `<b>Top 10 Bacteria Cultures Found</b><br>(Subject ID: ${subjectID})`,
      //color_discrete_sequence ='#567ab1'
      //color_discrete_sequence =['#567ab1']*len(df),
      //color: '#567ab1'
      //margin: { t: 30, l: 150 }
    };
  
    Plotly.newPlot("bar", bar_data, barLayout);

    // Build a Bubble Chart using the sample data
   let LayoutBubble = {
      title: `<b>Bacteria Culture's Density per OTU ID</b> (Subject ID: ${subjectID})`,
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      showlegend: false,
      // legend: {
      //     x: 1,
      //     y: 0.5
      // },
      //margin: { t: 0 },
      };
  
    let DataBubble = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          colorscale: "Earth",
          color: ids,
          size: values,
          }
      }
    ];
  
    Plotly.newPlot("bubble", DataBubble, LayoutBubble);
};

function getMetaData(subjectID){
  //gets the meta data according the subjectID selected
  console.log("in getMetaData:  ");
  let resultarray = fileMetadata.filter((dataobject) => dataobject.id == subjectID);
  //console.log(`RESULT 1: ${resultarray[0]}`)
  return resultarray[0];
};


function demoInfo(subjectID){
    // The following function builds the metadata panel
    // Use the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    console.log("in demoInfo:  ");
    let infoPanel = d3.select("#sample-metadata").html("");

    result = getMetaData(subjectID);
    //console.log(`result = ${result}`);
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
        infoPanel.append("h6").text(`${key}: ${value}`);
        console.log(`${key}: ${value}`);
    });
};



// Initialize the dashboard
init();