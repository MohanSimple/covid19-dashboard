import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import Axios from 'axios';
import { BASEURL } from '../Common/webpath';


export default class LineCharts extends React.Component {
state ={
  dailyCaseData : [],
  currentdate : new Date(),
}

  componentDidMount() {
    Axios.get(BASEURL+"data.json").then(res => 
    this.getLinedata(res.data.cases_time_series)
          );
      }
    
    
      getLinedata = (array) => {
      let dailyCasesArray = []
        array.map(resp => {
        let noOfDays = Number((this.state.currentdate-new Date(resp.dateymd)))/(24*1000*3600);
        if(noOfDays<=7 && noOfDays>=0){
          dailyCasesArray.push(resp);
        }

          } );
          this.setState({ dailyCaseData : dailyCasesArray })
    }

  render() {
    return (
      <LineChart width={700} height={300} data={this.state.dailyCaseData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalconfirmed" stroke="red" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="totaldeceased" stroke="blue" />
        <Line type="monotone" dataKey="totalrecovered" stroke="green" />
      </LineChart>
    );
  }
}
