import React, {Component} from 'react';
import Chart from "./chart";

class Line extends Component {
    render() {
        return (
            <div className={this.props.classes["chart-container"]}>
                <Chart
                    data={this.props.data}
                    options={this.props.options}
                />
            </div>
        );
    }
}

export default Line;
