import React from 'react';
import { Dropdown, Table, Form, Button, Spinner, Row, Col, Alert } from 'react-bootstrap';
import style from './TrafficStatistic.module.css';
import { Line } from 'react-chartjs-2';
import StatsticsHelper from './StatisticsHelper';

class TrafficStatistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null, 
            error: false,
            loading: false,
            jobList: [],
            currentJob: '',
        };
    }

    // call API to fetch job list after component finished first time mounting.
    componentDidMount = () => {
        this.getJobList();
    }

    // make backend api call to get all raw data.
    getData = (jobID) => {
        this.setState({ loading: true, data: null });
        StatsticsHelper.getAllUriByJobID(jobID)
            .then(result => {
                this.setState({ data: result, error: false, loading: false, currentJob: jobID });
            })
            .catch((err) => {
                this.setState({ data: null, error: true, loading: false, currentJob: jobID });
            });
    }

    // make backend api call to get all jobs.
    getJobList = () => {
        StatsticsHelper.getAllJobID()
            .then((result) => {
                this.handleJobList(result); 
            })
            .catch((err) => {
                this.setState({ error: true });
                this.handleJobListError();
            });
    }

    // render all jobs with job ID and job name to the select job dropdown.
    handleJobList = (res) => {
        if (res.length >= 1) {
            const list = [];
            res.forEach(job => {
                list.push(<option key={job.jobID} value={job.jobID}>{`${job.jobID} - ${job.jobName}`}</option>);
            });
            this.setState({ jobList: list });
        } else {
            this.handleJobListError();
        }
        this.setState({ error: false });
    }

    // render 'empty list' option to the select dropdown when server not connected or no jobs available in our database
    handleJobListError = () => {
        let empty = [];
        empty.push(<option key={'jobListError'} value='-2' disabled>------- No Jobs Available -------</option>)
        this.setState({ jobList: empty });
    }

    // make new backend call to fetch data relative to the new selected job ID.
    handleUpdateJob = (e) => {
        let value = parseInt(e.target.options[e.target.selectedIndex].value);
        if (value > -1) {
            this.getData(value);
        }
    }
    
    render() {
        return (
            <div>
                <h2 className={style.title}>Traffic Statistics</h2>
                <div className={style.jobListBlock}>
                    <label
                        htmlFor="jobIDList"
                        className={style.optionLabel}
                        title="select a job name to view summary and view analysis chart"
                    >
                        Select a Job Name to view stats:
                        {this.state.loading && (
                            <Spinner
                                as="span"
                                variant="primary"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        )}
                    </label>
                    <Form.Control
                        as="select"
                        id="jobIDList"
                        onChange={this.handleUpdateJob}
                        disabled={this.state.loading}
                        defaultValue="-1"
                    >
                        <option value="-1" disabled>Select a job name ...</option>
                        {this.state.jobList}
                    </Form.Control>
                </div>
                <hr></hr>
                <StatsTable data={this.state.data} error={this.state.error} />
                <StatsChart data={this.state.data} job={this.state.currentJob} />
            </div>
        );
    }
}


class StatsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: []
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            let content = [];
            let result = getSummarizedData(nextProps.data);
            let totalRequests = 0;
            result.forEach(res => {
                totalRequests += res.total;
                content.push(this.handleRow(res.uri, res.total));
            });
            content.unshift(this.handleRow('------- All URIs -------', totalRequests));
            this.setState({ content: content });
        }
    }

    handleRow = (uri, total) => {
        return (
            <tr key={uri}>
                <td>{uri}</td>
                <td style={{ textAlign: 'center' }}>{total}</td>
            </tr>
        );
    }

    render() {
        return (
            <div className={style.myContainer}>
                <h3 className={style.title}>Traffic Summary</h3>
                <div className={style.tableContainer}>
                    {!this.props.error
                        ?
                        <Table striped bordered hover size="sm" variant="dark" className={style.myTable}>
                            <thead>
                                <tr>
                                    <th>URI</th>
                                    <th style={{textAlign: 'center'}} >Total Requests</th>
                                </tr>
                            </thead>
                            <tbody>{this.state.content}</tbody>
                        </Table>
                        :
                        <Alert variant="danger" className={style.alertBox}>
                            <Alert.Heading>Connection Error</Alert.Heading>
                            <p>Server Not Connected.</p>
                        </Alert>
                    }
                    
                </div>
            </div>
        );
    }
}


class StatsChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lineData: {},
        };
        this.options = {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Dates'
                    },
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '# of Requests'
                    }
                }]
            }
        };
    }

    // handle new request and update the line chart, result param received from StatsChartOptionsBar.
    handleUpdate = (result) => {
        if (!result) return null;
        // update data to the line chart
        let lineData = {};
        lineData.datasets = [];
        lineData.labels = result.labels;
        result.data.forEach((uri, i) => {
            let color = StatsticsHelper.getRandomColor();
            lineData.datasets.push({
                label: `${uri.name}`,
                data: uri.traffic,
                fill: false,
                lineTension: 0.1,
                backgroundColor: color,
                borderColor: color,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: color,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
            });
        });
        this.setState({ lineData: lineData });
    };

    handleReset = () => {
        this.setState({ lineData: {} });
    }

    render() {
        return (
            <div className={style.chartContainer}>
                <h3 className={style.title}>Traffic Analysis Chart</h3>
                <StatsChartOptionsBar
                    data={this.props.data}
                    lineHandler={this.handleUpdate}
                    lineResetHandler={this.handleReset}
                    job={this.props.job}
                />
                <hr></hr>
                <Line data={this.state.lineData} options={this.options} />
            </div>
        );
    }
}


class StatsChartOptionsBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uriList: [],
            uriListVisible: [],
            uriChecked: [],
            applyLoading: false,
            error: false,
            errorTitle: 'Error',
            errorText: 'Something wrong!',
            validUriSelect: true,
            validStartDate: true,
            validEndDate: true,
            startDate: '',
            endDate: '',
        };
        this.job = '';
        this.selectedUri = [];
        this.startDate = '';
        this.endDate = '';
    }

    // set states to default value
    handleDefault = () => {
        let date = new Date();
        this.endDate = `${date.getFullYear().toString()}-${('0' + (date.getMonth() + 1).toString()).slice(-2)}-${('0' + (date.getDate()).toString()).slice(-2)}`;
        date.setDate(date.getDate() - 13);
        this.startDate = `${date.getFullYear().toString()}-${('0' + (date.getMonth() + 1).toString()).slice(-2)}-${('0' + (date.getDate()).toString()).slice(-2)}`;
        this.handleCheckBoxUncheckAll();
        this.setState({
            startDate: this.startDate,
            endDate: this.endDate,
            validUriSelect: true,
            validStartDate: true,
            validEndDate: true,
            error: false,
        });
    }

    componentWillMount = () => {
        this.handleDefault();
    }

    componentWillReceiveProps(nextProps) {
        // only update chart and option bar when user selected a new job ID
        if (nextProps.job !== this.job) {
            if (nextProps.data) {
                this.handleDefault();  // update default form data when switched to new job ID
                this.job = nextProps.job;
                let uriList = getUriList(nextProps.data).sort();
                let num = uriList.length;
                let visible = [];
                let checked = [];
                for (let i = 0; i < num; ++i) {
                    visible.push(true);
                    checked.push(false);
                }
                if (num > 0) {
                    this.selectedUri.push(uriList[0]);
                    checked[0] = true;
                    this.handleApply(); // apply default chart, for the last 14 days
                } else {
                    this.props.lineResetHandler(); // reset chart 
                }
                this.setState({
                    uriList: uriList,
                    uriListVisible: visible,
                    uriChecked: checked,
                });
            }
        }
    }

    // record checked checkbox value.
    handleCheckBox = (event) => {
        let id = event.target.attributes.getNamedItem('data-id');
        let uri = event.target.attributes.getNamedItem('data-uri');
        if (uri && id) {
            id = parseInt(id.value);
            uri = uri.value;
            let checked = this.state.uriChecked;
            if (event.target.checked === true) {
                this.selectedUri.push(uri);
                checked[id] = true;
                this.setState({ validUriSelect: true, uriChecked: checked });
            } else {
                let index = this.selectedUri.indexOf(uri);
                if (index > -1) {
                    this.selectedUri.splice(index, 1);
                }
                checked[id] = false;
                this.setState({ uriChecked: checked });
            }
        }
    };

    // uncheck all checkboxes
    handleCheckBoxUncheckAll = () => {
        let checked = this.state.uriChecked;
        checked.forEach((check, i) => {
            checked[i] = false;
        });
        this.selectedUri = [];
        this.setState({ uriChecked: checked });
    }

    // handle uri filtering in the uri dropdown.
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
    };

    // record date when onchange
    setDate = (e) => {
        if (e.target.id === 'start-date') {
            this.startDate = e.target.value;
            this.setState({ validStartDate: true, startDate: this.startDate });
        } else {
            this.endDate = e.target.value;
            this.setState({ validEndDate: true, endDate: this.endDate });
        }
    };

    // check if any input field missing, set state to false if missing
    checkRequireFields = () => {
        if (this.startDate === '') {
            this.setState({ validStartDate: false });
        }
        if (this.endDate === '') {
            this.setState({ validEndDate: false });
        }
        if (this.selectedUri.length === 0) {
            this.setState({ validUriSelect: false });
        }
    }

    // apply and process custom filters and send result to the line chart.
    handleApply = () => {
        console.log(this.selectedUri);
        console.log(this.startDate);
        console.log(this.endDate);
        if (this.job === '') {
            this.setState({
                error: true,
                errorTitle: 'No job selected!',
                errorText: (<span>Please select a job from the <span onClick={this.goToTop} className={style.toTopText}>top of the page</span> to view analysis chart.</span>),
            });
            return null;
        }
        if (this.endDate === '' || this.startDate === '' || this.selectedUri.length === 0) {
            this.setState({
                error: true,
                errorTitle: 'Missing Information!',
                errorText: 'Please fill in all required input fields.',
            });
            this.checkRequireFields();
            return null;
        }
        if (this.endDate < this.startDate) {
            this.setState({
                error: true,
                errorTitle: 'Invalid date range!',
                errorText: 'The end date cannot be greater than the start date.',
            });
            return null;
        }
        this.setState({ applyLoading: true });
        setTimeout(() => {
            if (this.props.data) {
                let result = getDataFromTimeRange(this.startDate, this.endDate, this.selectedUri, this.props.data);
                this.props.lineHandler(result);
                this.setState({ error: false });
            } else {
                this.setState({
                    error: true,
                    errorTitle: 'Connection Error!',
                    errorText: 'Server not connected!',
                });
            }
            this.setState({ applyLoading: false });
        }, 600);
    };

    goToTop = () => {
        window.scrollTo(0, 0);
    }

    handleAlert = () => {
        this.setState({ error: false });
    }

    render() {
        const content = [];
        for (let i = 0; i < this.state.uriList.length; ++i) {
            let uri = this.state.uriList[i];
            content.push(
                <div
                    className={this.state.uriListVisible[i] ? style.item : style.itemNone}
                    key={uri}
                >
                    <Form.Check
                        id={`chartUri=${i}`}
                        onChange={this.handleCheckBox}
                        checked={this.state.uriChecked[i]}
                        type={'checkbox'}
                        data-id={i}
                        data-uri={uri}
                        label={uri}
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
                            <span className={style.requiredSign}>*</span> Start Date:
                        </label>
                        <Form.Control
                            type="date"
                            id="start-date"
                            value={this.state.startDate}
                            isInvalid={!this.state.validStartDate}
                            className={style.dateInput}
                            onChange={this.setDate}
                            disabled={this.state.applyLoading}
                        />
                    </Col>
                    <Col sm={12} md={6} lg={3}>
                        <label htmlFor="end-date" className={style.optionLabel}>
                            <span className={style.requiredSign}>*</span> End Date:
                        </label>
                        <Form.Control
                            type="date"
                            id="end-date"
                            value={this.state.endDate}
                            isInvalid={!this.state.validEndDate}
                            className={style.dateInput}
                            onChange={this.setDate}
                            disabled={this.state.applyLoading}
                        />
                    </Col>
                    <Col xs={12} sm={6} lg={3}>
                        <label
                            htmlFor="stat-dropdown"
                            className={style.optionLabel}
                            title={'select uris to apply to the chart'}
                        >
                            <span className={style.requiredSign}>*</span> Select URIs:
                        </label>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant={this.state.validUriSelect ? 'outline-primary' : 'outline-danger'}
                                id="stat-dropdown"
                                disabled={this.state.applyLoading}
                                className={style.dropdownBtn}
                            >
                                Select URIs
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
                            variant="primary"
                            id="apply"
                            className={style.applyBtn}
                            onClick={this.handleApply}
                            disabled={this.state.applyLoading}
                        >
                            {this.state.applyLoading ? (
                                <Spinner animation="grow" size="sm" />
                            ) : (
                                'Apply'
                            )}
                        </Button>
                    </Col>
                </Row>

                {this.state.error && (
                    <Alert
                        variant="danger"
                        onClose={this.handleAlert}
                        dismissible
                        className={style.alertBox}
                    >
                        <Alert.Heading>{this.state.errorTitle}</Alert.Heading>
                        <p>{this.state.errorText}</p>
                    </Alert>
                )}
            </div>
        );
    }
}

// get a list of different uris from data that fetched from the database.
function getUriList(data) {
    let uriList = [];
    if (data && data.length > 0) {
        data.forEach((row) => {
            let uri = row.uri;
            // uriList acts as set.
            if (uriList.indexOf(uri) === -1) {
                uriList.push(uri);
            }
        });
    }
    return uriList;
}

// summarize all uris with the total number of requests received so far.
function getSummarizedData(data) {
    let resultArray = [];
    if (data && data.length > 0) {
        let result = {};
        data.forEach(row => {
            let uri = row.uri;
            if (result[uri]) {
                result[uri] += 1;
            } else {
                result[uri] = 1;
            }
        });
        Object.keys(result).forEach(uri => {
            resultArray.push({
                uri: uri,
                total: result[uri],
            });
        });
        resultArray.sort((a, b) => {
            if (a.total < b.total)
                return 1;
            if (a.total > b.total)
                return -1;
            return 0;
        });
    }
    return resultArray;
}

// get total request number on each day for each requested uri from the given time range.
function getDataFromTimeRange(start, end, requestedUri, data) {
    if (!data || data.length === 0) {
        return null;
    }
    let startStrs = start.toString().split('-');
    let startDate = new Date(parseInt(startStrs[0]), parseInt(startStrs[1]) - 1, parseInt(startStrs[2]));
    let unixStart = startDate.getTime();
    let endStrs = end.toString().split('-');
    let endDate = new Date(parseInt(endStrs[0]), parseInt(endStrs[1]) - 1, parseInt(endStrs[2]));
    endDate.setDate(endDate.getDate() + 1);
    let unixEnd = endDate.getTime();
    let numDays = 0;

    let result = {};
    result.data = [];
    result.labels = [];
    result.unixTimeLabels = [];

    let current = new Date(parseInt(startStrs[0]), parseInt(startStrs[1]) - 1, parseInt(startStrs[2]));
    while (current <= endDate) {
        ++numDays;
        let label = `${current.getMonth() + 1}-${current.getDate()}`;
        result.labels.push(label);
        result.unixTimeLabels.push(current.getTime());
        current.setDate(current.getDate() + 1);
    }
    numDays -= 1;
    // console.log('num day == ' + numDays);

    let zeros = [];
    for (let i = 0; i < numDays; ++i)
        zeros.push(0);

    requestedUri.forEach(uri => {
        result.data.push({
            name: uri,
            traffic: [...zeros],
        });
    });

    let unixTimeRange = result.unixTimeLabels;

    for (let i = 0; i < data.length; ++i) {
        let unixTime = data[i].utime * 1000;
        if (unixTime < unixStart || unixTime >= unixEnd) {
            // out of range, skip to next data row.
            continue;
        }

        let uri = data[i].uri;
        // console.log('on i = ' +  i + '  ' + uri);
        for (let j = 0; j < numDays; ++j) {
            let current = unixTimeRange[j];
            let next = unixTimeRange[j + 1];
            // console.log(`${current} ${unixTime} ${next}`);
            if (unixTime >= current && unixTime < next) {
                for (let k = 0; k < requestedUri.length; ++k) {
                    if (uri === requestedUri[k]) {
                        result.data[k].traffic[j] += 1;
                        break;
                    }
                }
                break;
            }
        }
    }
    result.labels.pop();
    result.unixTimeLabels.pop();
    console.log(result);
    return result;
}

export default TrafficStatistic;