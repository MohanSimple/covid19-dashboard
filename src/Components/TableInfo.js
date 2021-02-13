import React from 'react';
import Axios from 'axios';
import {BASEURL} from '../Common/webpath.js';

export default class TableInfo extends React.Component{

        state ={
            tableData : [],
        }

        componentDidMount() {
            Axios.get(BASEURL+"data.json").then(res => 
         this.setState({ tableData : res.data.statewise })
        );
        }

        changeData = (e) => {
          this.props.changeData(e);
        }

    render(){
        return (
            <>
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
              <table className="table table-stripped table-bordered table-hover" >
                <thead>
                  <tr style={{backgroundColor:"darkgrey"}}>
                    <th className="text-center text-info">
                      State
                    </th>
                    <th className="text-center text-warning">
                      Confirmed
                    </th>
                    <th className="text-center text-success">
                      Recovered
                    </th>
                    <th className="text-center text-danger">
                      Deceased
                    </th>
                  </tr>
                </thead>
                <tbody>
                    {this.state.tableData.map(res=> 
                    <tr>
                      <td className="text-center text-info">
                        {res.state}
                      </td>
                      <td className="text-center text-warning">
                        {res.confirmed}
                      </td>
                      <td className="text-center text-success">
                        {res.recovered}
                      </td>
                      <td className="text-center text-danger">
                        {res.deaths}
                      </td>
                    </tr>)}
                </tbody>
              </table>
              </div>
              </>
        )
    }
}