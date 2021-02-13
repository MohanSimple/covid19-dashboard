import React, { useState } from 'react';
import { scaleQuantile } from 'd3-scale';
import './App.css';
import DoughnutChart from './Components/DoughnutChart';
import ChoroplethChart from './Components/ChoroplethChart.js';
import LineCharts from './Components/LineCharts.js';
import TableInfo from './Components/TableInfo.js';


function App() {

  return (
<div className="bg-info">
<br/>

<div className="row">
  <div className="col-md-1"></div>
<div className="col-md-5">
  <DoughnutChart />
</div>
<div className="col-md-6">
    <LineCharts/>
</div>
</div>
<div className="row">
<TableInfo/>
</div>
<div className="row">
  <ChoroplethChart/>
</div>
</div>
  );
}

export default App;
