import React, {Component} from 'react';
const CanvasJSReact = require('../canvas/canvasjs.react').default;
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Bar extends Component {
    render() {
        return (
            <CanvasJSChart options={this.props.options} />
        )
    }
}

export default Bar;
