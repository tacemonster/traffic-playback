import React from 'react';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import style from './TrafficStatistic.module.css';
import { Line } from 'react-chartjs-2';


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
        <div className={style.chartContainer}>
            <h2 className={style.title}>Traffic Analysis Chart</h2>
            <StatsChartOptionsBar />
            <hr></hr>
            <Line data={linedata} />
        </div>
    );
}

class StatsChartOptionsBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uriList: ['/home', '/home/uri', '/traffic/abc/dsassfcsaaaaaaaaaaaaaaaaaaaaa', '/hello', '/hi', '/abc'],
            uriListVisible: [true, true, true, true, true, true],
            applyLoading: false,
        };
        this.maxSelectedUri = 5;
        this.selectedUri = [];
        this.startDate = '';
        this.endDate = '';
    }

    handleCheckBox = (event) => {
        if (event.target.id) {
            let id = event.target.id;
            let uripart = id.split('::');
            let uri = uripart[1];
            if (uri && uri !== '') {
                if (event.target.checked === true) {
                    // allow maximum of 5 uris selected.
                    if (this.selectedUri.length >= this.maxSelectedUri) {
                        event.target.checked = false;
                    } else {
                        this.selectedUri.push(uri);
                    }
                    
                } else {
                    let index = this.selectedUri.indexOf(uri);
                    if (index > -1) {
                        this.selectedUri.splice(index, 1);
                    }
                }
            }
        }
    }

    handleFilter = (event) => {
        let value = event.target.value.toLowerCase();
        let visible = this.state.uriListVisible;
        for (let i = 0; i < this.state.uriList.length; ++i) {
            if (this.state.uriList[i].toLowerCase().indexOf(value) > -1) {
                visible[i] = true;
            } else {
                visible[i] = false;
            }
        }
        this.setState({ uriListVisible: visible });
    }

    setDate = (e) => {
        if (e.target.id === 'start-date') {
            this.startDate = e.target.value;
        } else {
            this.endDate = e.target.value;
        }
    }

    handleApply = () => {
        console.log(this.selectedUri);
        console.log(this.startDate);
        console.log(this.endDate);
        this.setState({ applyLoading: true });
        // send new request to backend server to fetch data now ...
    }

    render() {
        const content = [];
        for (let i = 0; i < this.state.uriList.length; ++i) {
            let uri = this.state.uriList[i];
            content.push(
                <div className={this.state.uriListVisible[i] ? style.item : style.itemNone} key={uri}>
                    <Form.Check
                        onChange={this.handleCheckBox}
                        type={'checkbox'}
                        id={`uri::${uri}`}
                        label={`${uri}`}
                        className={style.checkBox}
                    />
                </div>
            );
        }
        return (
            <div className={style.optionContainer}>
                <Row>
                    <Col sm={12} md={6} lg={3}>
                        <label
                            htmlFor="start-date"
                            className={style.optionLabel}
                        >
                            Start Date:
                        </label>
                        <Form.Control
                            type="date"
                            id="start-date"
                            className={style.dateInput}
                            onChange={this.setDate}
                            disabled={this.state.applyLoading ? true : false}
                        />
                    </Col>
                    <Col sm={12} md={6} lg={3}>
                        <label htmlFor="end-date" className={style.optionLabel}>
                            End Date:
                        </label>
                        <Form.Control
                            type="date"
                            id="end-date"
                            className={style.dateInput}
                            onChange={this.setDate}
                            disabled={this.state.applyLoading ? true : false}
                        />
                    </Col>
                    <Col xs={12} sm={6} lg={3}>
                        <label
                            htmlFor="stat-dropdown"
                            className={style.optionLabel}
                        >
                            Select Uri:
                        </label>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="outline-info"
                                id="stat-dropdown"
                                disabled={this.state.applyLoading ? true : false}
                                className={style.dropdownBtn}
                            >
                                Select URI
                            </Dropdown.Toggle>
                            <Dropdown.Menu className={style.dropdownMenu}>
                                <div className={style.item}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Filter uri ..."
                                        onChange={this.handleFilter}
                                    />
                                </div>
                                <Dropdown.Divider />
                                {content}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col xs={12} sm={6} lg={3}>
                        <label htmlFor="apply" className={style.optionLabel}>
                            Apply Change:
                        </label>
                        <Button
                            variant="info"
                            id="apply"
                            className={style.applyBtn}
                            onClick={this.handleApply}
                            disabled={this.state.applyLoading ? true : false}
                        >
                            {this.state.applyLoading ? (
                                <Spinner animation="grow" size="sm" />
                            ) : (
                                'Apply'
                            )}
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default TrafficStatistic;