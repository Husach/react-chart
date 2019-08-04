import React, { Component, Fragment } from 'react';
import Line from "./line";
import '../css/App.css';
import Bar from "./bar";
import { Snackbar } from '@material-ui/core';
import { withStyles } from "@material-ui/core";

const socket = require('socket.io-client')('http://localhost:3001');

const styles = theme => ({
    "chart-container": { height: 400 }
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
            },
            axisY: {
                title: "Range",
                labelFormatter: function (e) {
                    return e.value;
                }
            },
            data: [{
                type: "bar",
                dataPoints: []
            }]
        },
        lastValue: '',
        inputValue: '',
        isShowSnackBar: false
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
           this.compareValue(data.value);
       });
       socket.on('disconnect', function () {
           console.log("disconnect")
       });
   }

   compareValue(lastValue) {
       debugger;
       if (this.state.inputValue && lastValue > this.state.inputValue) {
           this.setState({
               lastValue,
               isShowSnackBar: true
           });
       } else {
           this.setState({ isShowSnackBar: false });
       }
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

   handlerInput(event) {
       const inputValue = +event.target.value;
       this.setState({inputValue})
   }

   renderHeader() {
       return (
           <div className="header">
               <input
                   className="input"
                   type="number"
                   placeholder="Введите граничное значение"
                   value={this.state.inputValue}
                   onChange={this.handlerInput.bind(this)}
               />
               <Snackbar
                   anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                   open={this.state.isShowSnackBar}
                   message={`Рандомное число с сервера - ${parseInt(this.state.lastValue)}, оно превышает введённый вами порог - ${this.state.inputValue}`}
               />
           </div>
       )
   }

   renderContent() {
       return (
           <Fragment>
               <Line classes={this.props.classes}
                     data={this.state.lineChartData}
                     options={this.state.lineChartOptions}/>

               <Bar options={this.state.barChartOptions}/>
           </Fragment>
       )
   }

   render() {
       return (
           <div className="App">
               { this.renderHeader()}
               { this.renderContent()}
           </div>
       );
   }
}

export default withStyles(styles, {withTheme: true})(App);
