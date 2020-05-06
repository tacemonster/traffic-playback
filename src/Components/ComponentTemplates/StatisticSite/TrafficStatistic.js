import React from 'react';
import Table from 'react-bootstrap/Table';
import style from './TrafficStatistic.module.css';
import { Doughnut, Line } from 'react-chartjs-2';


class TrafficStatistic extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <h2 className={style.title}>Traffic Playback Statistic</h2>
                <StatsTable />
                <StatsChart />
            </div>
        );
    }
}

const StatsTable = (props) => {
    return (
        <div className={style.statTable}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>URI</th>
                        <th>Domain</th>
                        <th>Total Requests</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>/home</td>
                        <td>www.example.com</td>
                        <td>1234</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}

const linedata = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'uri-1',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
            label: 'uri-2',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(230,54,192,0.4)',
            borderColor: 'rgba(230,54,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(230,54,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(230,54,192,1)',
            pointHoverBorderColor: 'rgba(230,54,192,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [15, 12, 200, 45, 23, 68, 100],
        },
    ],
};

const StatsChart = (props) => {
    return (
        // <div>
        //     <h2>Doughnut Example</h2>
        //     <Doughnut data={data} />
        // </div>
        <div className={style.chartContainer}>
            <h2 className={style.title}>Traffic Chart</h2>
            <Line data={linedata} />
        </div>
    );
}


export default TrafficStatistic;