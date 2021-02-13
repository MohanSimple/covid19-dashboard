import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import Axios from 'axios'
import {BASEURL} from '../Common/webpath.js'
import moment from 'moment';

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default class DoughnutChart extends React.Component {

  state = {
    activeIndex: 0,
    COLORS : [ '#00C49F','indianred', 'black'],
    // currentdate : moment(new Date()).format('yyyy-mm-DD'),
    currentdate : new Date("2021-02-12"),
    doughnutData :[],
    daiyData : [],
  };

  componentDidMount () {
    Axios.get(BASEURL+"data.json").then(res =>  
      this.getDaoughtData(res.data.cases_time_series)
    );
  }

  getDaoughtData =(array) =>{
    let doughnutData = []
    array.map(resp => {
        let noOfDays = Math.floor((new Date()-(new Date(resp.dateymd)))/(24*1000*3600));
          if(noOfDays==1){
            let deceasedObj = {name:"Deceased", value:Number(resp.dailydeceased)};
            let confirmedObj = {name:"Confirmend", value:Number(resp.dailyconfirmed)};
            let recovedredObj = {name:"Recovered", value :Number(resp.dailyrecovered)};
            doughnutData.push(recovedredObj);
            doughnutData.push(confirmedObj);
            doughnutData.push(deceasedObj);
            this.setState({ doughnutData : doughnutData })
                }
            })
    }

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,

    });
  };

  render() {
    return (
      <PieChart width={400} height={400}>
        <Pie
          activeIndex={this.state.activeIndex}
          activeShape={renderActiveShape}
          
          data={this.state.doughnutData}
          cx={200}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={3}
          dataKey="value"
          onMouseEnter={this.onPieEnter}
        >
    {this.state.doughnutData.map((entry, index) => (
   <Cell key={`cell-${index}`} fill={this.state.COLORS[index % this.state.COLORS.length]} />
 ))}
        </Pie>
      </PieChart>
    );
  }
}
