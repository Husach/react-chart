import React, { Component } from 'react';
import ApexCharts from 'apexcharts'

import './App.css';

const socket = require('socket.io-client')('http://localhost:3001');

class App extends Component {
    state = {
        chart: [],
        options: {
            chart: {
                id: 'realtime',
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                        speed: 1000
                    }
                },
                toolbar: { show: false },
                zoom: { enabled: false }
            },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth' },
            title: {
                text: 'Dynamic Updating Chart',
                align: 'left'
            },
            markers: { size: 0 },
            xaxis: {
               type: 'datetime',
               range: 1,
            },
            yaxis: {
                max: 100,
                min: -100
            },
            legend: { show: false }
       },
       // series: [{
       //     data: this.state.chart.slice()
       // }]
   };

   componentDidMount() {
       socket.on('connect', function () {
           console.log("connected")
       });
       socket.on('data', (data) => {
           this.setState(({chart}) => ({
               chart: [...chart, {x: data.timestamp, y: data.value}]
           }));
       });
       socket.on('disconnect', function () {
           console.log("disconnect")
       });
   }

   renderDate(ms) {
       let date = new Date(ms);
       return date.toLocaleTimeString()
   }

   render() {
       console.log(this.state.chart);
       return (
           <div className="App">
               {this.state.chart.map((item, index) => {
                   return (
                       <div key={index}>
                           { item.y }----
                           { this.renderDate(item.x) }
                       </div>
                   )
               })}

               {/*<div id="chart">*/}
                   {/*<ApexCharts options={this.state.options} series={this.state.series} type="line" height="350"/>*/}
               {/*</div>*/}
           </div>
       );
   }
}

export default App;
