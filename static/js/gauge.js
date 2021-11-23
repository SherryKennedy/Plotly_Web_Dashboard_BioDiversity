
function createGauge(subjectID){
  //get the wfreq (washing frequency) from the metadata for the gauge
  console.log("in getGaugeInfo:  ");
  console.log(subjectID);
  let testSubjectFreq = getMetaData(subjectID)
  let wfreq = testSubjectFreq.wfreq;
  console.log(`wfreq: ${wfreq}`);

  // needle calculation, offsets value to be more correct for needle position
  let offset = 0.0;  
  switch(wfreq) {
    case 1:
      offset = -2;
      break;
    case 2:
      offset = -5;
      break;
    case 3:
      offset = -6;
      break;
    case 3.5:
      offset = -5;
      break;
    case 4:
      offset = -1;
      break;
    case 5:
      offset = 2;
      break;
    case 6:
      offset = 6;
      break;
    case 7:
      offset = 7;
      break;
    case 8:
      offset = 8;
      break;
    default:
      offset = 0;
   }  

  //set up the gauge
   // need an offset, as the needle pointis off, changing 20 is not exact for each section either
  let degrees = 180 - (wfreq * 20 + offset),
  radius = 0.5;
  let radians = degrees * Math.PI / 180;
  let x = radius * Math.cos(radians);
  let y = radius * Math.sin(radians);
   // Build the SVG path string (M = moveto, L = lineto, Z = end of path) 
  let path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
  let mainPath = path1,
                 pathX = String(x),
                 space = ' ',
                 pathY = String(y),
                 pathEnd = ' Z';

 
  let path = mainPath.concat(pathX, space, pathY, pathEnd);
  let needleData = {
            type: 'scatter',   //smoothest animation for needle animation
            x: [0], y: [0],
            marker: { size: 14, color: '850000' },
            showlegend: false,
            name: 'Washing Frequency',
            hoverinfo: 'text+name'
          };
    let gaugeData = {
            hole: 0.5,
            type: "pie",     //there is a gauge as well
            rotation: 90,
            // top: 50% of the 9 items have, bottom: is full 50%
            values: [
                50 / 9,
                50 / 9,
                50 / 9,
                50 / 9,
                50 / 9,
                50 / 9,
                50 / 9,
                50 / 9,
                50 / 9,
                50
            ],
            text: ["8-9","7-8","6-7","5-6","4-5","3-4","2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            //transparent for bottom half of pie
            marker: {
                colors: ["#8bb48a", "#91bb8f", "#94bf86", "#bdcd92", "#d9e49e", "#e5e9b6", "#e8e7cc", "#f4f1e6", "#f6f3ec", "transparent"],
            },
            labels: ["8-9","7-8","6-7","5-6","4-5","3-4","2-3","1-2","0-1",""],
            hoverinfo: "label",
            showlegend: false
        };
   

  let layout = {
            label: {
                color: '#000'
            },
            title: {
                text: `<br><b>Belly Button Washing Frequency</b><br>Scrubs per Week (Subject ID: ${subjectID})`,
            },
            margin: {
                l: 60,
                r: 30,
                b: 0,
                t: 50,
                pad: 0
              },
            paper_bgcolor:'white',
            plot_bgcolor:'white',
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
            height: 500,
            width: 450,
            xaxis: {
                zeroline: false, showticklabels: false,
                showgrid: false, range: [-1, 1]
            },
            yaxis: {
                zeroline: false, showticklabels: false,
                showgrid: false, range: [-1, 1]
            }
        };

  let data = {
      trace:[gaugeData, needleData]
  }
    
  Plotly.newPlot("gauge", data.trace, layout);
          
};

