import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';

import LinearGradient from '../LinearGradient.js';
import '../App.css';
import axios from 'axios';
import { BASEURL } from '../Common/webpath.js';

const INDIA_TOPO_JSON = require('../india.topo.json');

const PROJECTION_CONFIG = {
  scale: 350,
  center: [78.9629, 22.5937] // always in [East Latitude, North Longitude]
};

// Red Variants
const COLOR_RANGE = [
  '#ffedea',
  '#ffcec5',
  '#ffad9f',
  '#ff8a75',
  '#ff5533',
  '#e2492d',
  '#be3d26',
  '#9a311f',
  '#782618'
];

const DEFAULT_COLOR = '#EEE';


const geographyStyle = {
  default: {
    outline: 'none'
  },
  hover: {
    fill: '#ccc',
    transition: 'all 250ms',
    outline: 'none'
  },
  pressed: {
    outline: 'none'
  }
};

var confirmedCases = [];
var recoveredCases = [];
var deceasedCases = [];

var currentMap = '';

const getConfirmedData = () => {
  let objsArrays = [];

  axios.get(BASEURL+"states_daily.json").then(res => {
    objsArrays =  res.data.states_daily;
     objsArrays.map(resp=> {

       let noOfDays = Math.floor((new Date()-(new Date(resp.dateymd)))/(24*1000*3600));
       if(noOfDays==1 && resp.status=="Confirmed"){
        let arr = [];
         arr = Object.keys(resp);
         arr.map( response => {
           if(response!="status" && response!="date" && response!="dateymd"){
           let confiredObj = {}
           confiredObj.id = response.toUpperCase();
           confiredObj.state = response.toUpperCase();
           confiredObj.value = resp[response];
           confirmedCases.push(confiredObj);
         }
         })}})   
   })
   currentMap = "Confirmed";
   return confirmedCases;
}

const getRecoveredData = () => {
  let objsArrays = [];
  axios.get(BASEURL+"states_daily.json").then(res => {
    objsArrays =  res.data.states_daily;
     objsArrays.map(resp=> {
       let noOfDays = Math.floor((new Date()-(new Date(resp.dateymd)))/(24*1000*3600));
       if(noOfDays==1 && resp.status=="Recovered"){
         let arr = [];
         arr = Object.keys(resp);
         arr.map( response => {
           if(response!="status" && response!="date" && response!="dateymd"){
           let recoveredObj = {}
           recoveredObj.id = response.toUpperCase();
           recoveredObj.state = response.toUpperCase();
           recoveredObj.value = resp[response];
           recoveredCases.push(recoveredObj);
         }
         })}})   
   })
   currentMap = "Recovered";
   return recoveredCases;
}

const getDeceasedData = () => {
  let objsArrays = [];
  axios.get(BASEURL+"states_daily.json").then(res => {
    objsArrays =  res.data.states_daily;
     objsArrays.map(resp=> {
       let noOfDays = Math.floor((new Date()-(new Date(resp.dateymd)))/(24*1000*3600));
       if(noOfDays==1 && resp.status=="Deceased"){
         let arr = [];
         arr = Object.keys(resp);
         arr.map( response => {
           if(response!="status" && response!="date" && response!="dateymd"){
           let deceasedObj = {}
           deceasedObj.id = response.toUpperCase();
           deceasedObj.state = response.toUpperCase();
           deceasedObj.value = resp[response];
           deceasedCases.push(deceasedObj);
         }
         })}})   
   })
   currentMap = "Deceased";
   return deceasedCases;
}


var gridData  = [];

function ChoroplethChart() {
  const [tooltipContent, setTooltipContent,currentMap] = useState('');
  const [data, setData] = useState(getConfirmedData(), getDeceasedData(), getRecoveredData());


  const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: 0,
    max: data.reduce((max, item) => (item.value > max ? item.value : max), 0)
  };

  const colorScale = scaleQuantile()
    .domain(data.map(d => d.value))
    .range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { value: 'NA' }) => {
    return () => {
      setTooltipContent(`${geo.properties.name}: ${current.value}`);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent('');
  };

  const onChangeButtonClick = () => {
    if(currentMap=="Confirmed"){
      setData(getRecoveredData())
      currentMap = "Recovered";
    }
    else if(currentMap=="Recovered"){
      setData(getDeceasedData());
    }
    else if(currentMap=="Deceased"){
      setData(getConfirmedData());
    }
    
    
  };


  return (
<div>
  <div className="row">
  <div className="col-md-1"></div>
  <table className="table">
    <thead>
{gridData.map( res => 
<tr>
  <thead>{res.state}</thead>
  <thead>{res.recovered}</thead>
  <thead>{res.state}</thead>
  <thead>{res.state}</thead>
</tr>  
)}
    </thead>
  </table>
  </div>
<div className="row">
<div className="full-width-height container"> 
      <ReactTooltip>{tooltipContent}</ReactTooltip>
        <ComposableMap
          projectionConfig={PROJECTION_CONFIG}
          projection="geoMercator"
          width={600}
          height={220}
          data-tip=""
        >
          <Geographies geography={INDIA_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map(geo => {
                //console.log(geo.id);
                const current = data.find(s => s.id === geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                    style={geographyStyle}
                    onMouseEnter={onMouseEnter(geo, current)}
                    onMouseLeave={onMouseLeave}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        <LinearGradient data={gradientData} />
        
    </div>
</div>
</div>
  );
}

export default ChoroplethChart;
