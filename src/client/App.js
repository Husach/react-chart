import React, { Component } from 'react';
import {withStyles} from "@material-ui/core";
import Line from "./line";
import '../css/App.css';
import Bar from "./bar";

const socket = require('socket.io-client')('http://localhost:3001');

const styles = theme => ({
    "chart-container": {
        height: 800
    }
});

class App extends Component {
    state = {
        isLineMode: true,
        lineChartData: {
            labels: [],
            datasets: [{
                type: "line",
                label: "Value-Time",
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: this.props.theme.palette.primary.main,
                pointBackgroundColor: this.props.theme.palette.secondary.main,
                pointBorderColor: this.props.theme.palette.secondary.main,
                borderWidth: "2",
                lineTension: 0.45,
                data: []
            }]
        },
        lineChartOptions: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                enabled: true
            },
            scales: {
                xAxes: [
                    {
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10
                        }
                    }
                ]
            }
        },
        barChartOptions: {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Numbers in each category"
            },
            axisX: {
                title: "Amount",
                reversed: true,
            },
            axisY: {
                title: "Range",
                labelFormatter: function (e) {
                    return e.value;
                }
                // labelFormatter: this.addSymbols
            },
            data: [{
                type: "bar",
                dataPoints: []
            }]
        }
   };

   componentWillMount() {
       this.initBarData();
   }

   componentDidMount() {
       socket.on('connect', function () {
           console.log("connected")
       });
       socket.on('data', (data) => {
           this.setLineData(data);
           this.setBarData(data, 0);
       });
       socket.on('disconnect', function () {
           console.log("disconnect")
       });
   }

   setLineData(data) {
       const oldLineDataSet = this.state.lineChartData.datasets[0];
       const newLineDataSet = {...oldLineDataSet};
       newLineDataSet.data.push(data.value);

       const newChartData = {
           ...this.state.lineChartData,
           datasets: [newLineDataSet],
           labels: this.state.lineChartData.labels.concat(
               new Date().toLocaleTimeString()
           )
       };
       this.setState({lineChartData: newChartData});
   };

   initBarData() {
       let arr = [];
       for(let i = -100; i < 100; i += 10 ) {
           const end = i + 10;
           arr.push({
               value: end,
               label: `${i} - ${end}`,
               y: 0
           })
       }
       const oldArr = this.state.barChartOptions;
       const newArr = {...oldArr};
       newArr.data[0].dataPoints = arr;
       this.setState({barChartOptions: newArr})
   }

   setBarData(data, i) {
       const { dataPoints } = this.state.barChartOptions.data[0];
       if (data.value > dataPoints[i].value) {
           ++i;
           this.setBarData(data, i);
       } else {
           const { barChartOptions } = this.state;
           const newBarChartOptions = {...barChartOptions};
           newBarChartOptions.data[0].dataPoints[i].y++;
           this.setState({barChartOptions: newBarChartOptions});
       }
   }

   handlerModeClick = () => {
       this.setState({isLineMode: !this.state.isLineMode})
   };

   renderContent() {
       if (this.state.isLineMode) {
           return <Line classes={this.props.classes}
                        data={this.state.lineChartData}
                        options={this.state.lineChartOptions}/>
       }
       return <Bar options={this.state.barChartOptions}/>
   }

   render() {
       console.log('dataPoints', this.state.barChartOptions);

       return (
           <div className="App">
               <button className="btn-mode" onClick={this.handlerModeClick}>
                   Change line/bar mode
               </button>
               { this.renderContent()}
           </div>
       );
   }
}

export default withStyles(styles, {withTheme: true})(App);
