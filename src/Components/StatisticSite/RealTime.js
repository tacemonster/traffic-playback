import React from 'react';
import { Dropdown, Table, Form, Button, Spinner, Row, Col, Alert } from 'react-bootstrap';
import style from './TrafficStatistic.module.css';
import StatsticsHelper from './StatisticsHelper';

class RealTimeMonitor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null,
            loading: false,
            data: null,
            error: false,
            open: false,
            modalTitle: null,
            modalContent: null
        };
        this.realtimeHandler = null;
        this.interval = 60000;  // default update traffic by every 60s
        this.limit = 50;  // default number of records to fetch each time.
        this.currentJob = -1;  // default job id, -1 means all traffics from all jobs
    }

    // fetch data from the server
    getRealTimeData = () => {
        this.setState({ loading: true });
        let limit = (this.limit === -1 ? null : this.limit);
        let myJobID = (this.currentJob === -1 ? null : this.currentJob);
        StatsticsHelper.getAllTrafficByJobID(myJobID, limit)
            .then((result) => {
                this.setState({ data: result, loading: false, error: false });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ content: null, loading: false, error: true });
            });
        
    }

    // set update interval
    handleGet = (ms) => {
        if (ms) {
            this.realtimeHandler = setInterval(this.getRealTimeData, ms);
        }
    }

    // remove update interval
    handleRemove = () => {
        clearInterval(this.realtimeHandler);
    }

    // update time interval
    handleUpdate = (newMs) => {
        this.interval = newMs;
        this.handleRemove();
        this.handleGet(this.interval);
    }

    // handle manually refresh, reset interval and start again
    handleRefresh = () => {
        this.handleRemove();
        this.getRealTimeData();
        this.handleGet(this.interval);
    }

    // set new limit number of records
    handleLimit = (newLimit) => {
        this.limit = newLimit;
    }

    // set new job ID
    handleJob = (newJob) => {
        this.currentJob = newJob;
    }
    
    componentDidMount() {
        this.getRealTimeData();
        this.handleGet(this.interval);
    }

    componentWillUnmount() {
        this.handleRemove();
    }

    render() {
        return (
            <div>
                <h1 className={style.title}>Real Time Monitor</h1>
                <RealTimeTable
                    data={this.state.data}
                    loading={this.state.loading}
                    error={this.state.error}
                    msHandler={this.handleUpdate}
                    refreshHandler={this.handleRefresh}
                    limitHandler={this.handleLimit}
                    jobHandler={this.handleJob}
                />
            </div>
        );
    }
}

class RealTimeTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [],
            jobList: [],
            columnEnabled: {
                recordID: true,
                jobID: false,
                jobName: true,
                date: true,
                host: true,
                uri: true,
                method: true,
                protocol: false,
                secure: false,
                sourceip: false,
                reqBody: false,
                header: false,
            },
            remainTime: 60,
            never: false,
            alertVariant: 'danger',
            alertTitle: '',
            alertText: '',
        };
        this.columnName = ['Record ID', 'Job ID', 'Job Name', 'Date', 'Host', 'Uri', 'Method', 'Protocol', 'Secure', 'Source IP', 'Request Body', 'Headers'];
        this.updateTime = 60;
        this.remainTime = 60;
        this.refreshTimeHandler = null;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            this.handleContent(nextProps.data);
        }
        if (nextProps.error === true) {
            this.setState({
                error: true,
                alertVariant: 'danger',
                alertTitle: 'Connection Error',
                alertText: 'Server not connected'
            });
        }
    }
    componentDidMount() {
        this.handleRefreshTimeDisplay();
        this.getJobList();
    }
    componentWillUnmount() {
        this.handleRemoveRefresh();
    }

    handleContent = (data) => {
        if (data) {
            if (data.length > 0) {
                let content = [];
                data.forEach((row, i) => {
                    content.push(this.handleRow(row, i));
                });
                this.setState({ content: content, error: false });
            } else {
                this.setState({
                    error: true,
                    content: null,
                    alertVariant: 'warning',
                    alertTitle: 'Empty Traffic',
                    alertText: 'No traffic data for this job currently',
                });
            }
            
        }
    };

    handleRow = (row, i) => {
        let rowTime = new Date(row.utime * 1000);
        let date = `${rowTime.getMonth() + 1}/${rowTime.getDate()} ${rowTime.getHours()}:${rowTime.getMinutes()}:${rowTime.getSeconds()}`;
        let col = this.state.columnEnabled;
        return (
            <tr key={`row#${i}`}>
                {col.recordID && <td>{row.id}</td>}
                {col.jobID && <td>{row.jobid}</td>}
                {col.jobName && <td>{row.jobName}</td>}
                {col.date && <td>{date}</td>}
                {col.host && <td style={{ maxWidth: '150px' }}>{row.host}</td>}
                {col.uri && <td style={{ maxWidth: '150px' }}>{row.uri}</td>}
                {col.method && (<td style={{ maxWidth: '50px' }}>{row.method}</td>)}
                {col.protocol && <td>{row.protocol}</td>}
                {col.secure && <td>{row.secure === 0 ? 'False (HTTP)' : 'True (HTTPS)'}</td>}
                {col.sourceip && (<td style={{ maxWidth: '110px' }}>{row.sourceip}</td>)}
                {col.reqBody && <td>{JSON.stringify(row.reqbody)}</td>}
                {col.header && (<td style={{ maxWidth: '150px' }}>{row.header}</td>)}
            </tr>
        );
    };

    addCheckBoxes = () => {
        let col = this.state.columnEnabled;
        let content = [];
        Object.keys(col).forEach((key, i) => {
            content.push(
                <div className={style.item} key={`columnName::${key}`}>
                    <Form.Check
                        onChange={this.handleCheckBox}
                        type={'checkbox'}
                        id={`columnName::${key}`}
                        label={this.columnName[i]}
                        checked={col[key]}
                        className={style.checkBox}
                    />
                </div>
            );
        });
        return content;
    };

    handleCheckBox = (e) => {
        if (e.target.id && e.target.id !== '') {
            let col = this.state.columnEnabled;
            let columnName = e.target.id.split('::')[1];
            col[columnName] = e.target.checked;
            this.setState({ columnEnabled: col });
            this.handleContent(this.props.data);
        }
    };

    handleRefresh = () => {
        this.props.refreshHandler();
        this.remainTime = this.updateTime;
    };

    handleUpdateTime = (e) => {
        let value = e.target.options[e.target.selectedIndex].value;
        if (value !== 'never') {
            let s = parseInt(value);
            this.updateTime = this.remainTime = s;
            this.props.msHandler(s * 1000);
            if (this.state.never === true) {
                this.handleRefreshTimeDisplay();
                this.setState({ never: false });
            }
        } else {
            this.props.msHandler(null);
            this.handleRemoveRefresh();
            this.setState({ never: true });
        }
    };

    handleRefreshTimeDisplay = () => {
        this.refreshTimeHandler = setInterval(() => {
            if (this.remainTime <= 0) {
                this.remainTime = this.updateTime;
            }
            --this.remainTime;
            this.setState({ remainTime: this.remainTime });
        }, 1000);
    };
    handleRemoveRefresh = () => {
        clearInterval(this.refreshTimeHandler);
    };

    handleAlert = () => {
        this.setState({ error: false });
    };

    handleUpdateLimit = (e) => {
        this.props.limitHandler(parseInt(e.target.value));
    };

    // make backend api call to get all jobs.
    getJobList = () => {
        StatsticsHelper.getAllJobID()
            .then((result) => {this.handleJobList(result);})
            .catch((err) => {this.handleJobListError(err);});
    };

    // render all jobs with job ID and job name to the select job dropdown.
    handleJobList = (res) => {
        if (res.length >= 1) {
            const list = [];
            res.forEach((job) => {
                list.push(<option key={`jobID=${job.jobID}`} value={job.jobID}>{`${job.jobID} - ${job.jobName}`}</option>);
            });
            this.setState({ jobList: list });
        } else {
            this.handleJobListError();
        }
    };

    // render 'empty list' option to the select dropdown when server not connected or no jobs available in our database
    handleJobListError = (err) => {
        let empty = [];
        empty.push(<option key={'jobListError'} value="-3" disabled>------- No Jobs Available -------</option>);
        this.setState({ jobList: empty });
    };

    // handle new job id and send job id to parent component and execute refresh to show new data.
    handleUpdateJob = (e) => {
        let value = parseInt(e.target.value);
        if (value > -2) {
            this.props.jobHandler(value);
            this.handleRefresh();
        }
    }

    render() {
        let col = this.state.columnEnabled;
        return (
            <div>
                <div className={style.realtimeOptionBlock}>
                    <Row>
                        <Col xs={12}>
                            <div className={style.jobListBlock}>
                                <label
                                    htmlFor="jobIDList"
                                    className={style.optionLabel}
                                    title="select a job name to view real time traffics"
                                >
                                    Select a Job Name to View Traffics:
                                </label>
                                <Form.Control
                                    as="select"
                                    id="jobIDList"
                                    onChange={this.handleUpdateJob}
                                    defaultValue="-1"
                                    disabled={this.props.loading}
                                >
                                    <option value="-2" disabled>
                                        Select a job name ...
                                    </option>
                                    <option value="-1">
                                        All Jobs (All Traffics)
                                    </option>
                                    {this.state.jobList}
                                </Form.Control>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6} lg={3}>
                            <label
                                htmlFor="columns-dropdown"
                                className={style.optionLabel}
                                title="select what information to display in the table"
                            >
                                Display Columns:
                            </label>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="outline-primary"
                                    id="columns-dropdown"
                                    disabled={this.props.loading}
                                    className={style.dropdownBtn}
                                >
                                    Select Columns
                                </Dropdown.Toggle>
                                <Dropdown.Menu className={style.dropdownMenu}>
                                    {this.addCheckBoxes()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col xs={12} sm={6} lg={3}>
                            <label
                                htmlFor="update-limit"
                                className={style.optionLabel}
                                title="number of records to display in the table"
                            >
                                Limit:
                            </label>
                            <Form.Control
                                as="select"
                                id="update-limit"
                                onChange={this.handleUpdateLimit}
                                disabled={this.props.loading}
                                defaultValue="50"
                            >
                                <option value="20">20 records</option>
                                <option value="50">50 records</option>
                                <option value="100">100 records</option>
                                <option value="200">200 records</option>
                                <option value="500">500 records</option>
                                <option value="1000">1000 records</option>
                                <option value="-1">All records</option>
                            </Form.Control>
                        </Col>
                        <Col xs={12} sm={6} lg={3}>
                            <label
                                htmlFor="update-time"
                                className={style.optionLabel}
                                title="time interval to update the table"
                            >
                                Update By:
                            </label>
                            <Form.Control
                                as="select"
                                id="update-time"
                                onChange={this.handleUpdateTime}
                                disabled={this.props.loading}
                                defaultValue="60"
                            >
                                <option value="10">10 seconds</option>
                                <option value="20">20 seconds</option>
                                <option value="30">30 seconds</option>
                                <option value="45">45 seconds</option>
                                <option value="60">60 seconds</option>
                                <option value="120">120 seconds</option>
                                <option value="300">300 seconds</option>
                                <option value="never">Never</option>
                            </Form.Control>
                        </Col>
                        <Col xs={12} sm={6} lg={3}>
                            <label
                                htmlFor="refresh"
                                className={style.optionLabel}
                                title="manually refresh the table"
                            >
                                Refresh
                            </label>
                            <Button
                                id="refresh"
                                variant="primary"
                                className={style.applyBtn}
                                disabled={this.props.loading}
                                onClick={this.handleRefresh}
                            >
                                {this.props.loading ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    'Refresh'
                                )}
                            </Button>
                            <div style={{ textAlign: 'center' }}>
                                {!this.state.never ? (
                                    <span>
                                        Will Refresh in{' '}
                                        <span>{this.state.remainTime}</span>s
                                    </span>
                                ) : (
                                    <span>Never Refresh Automatically</span>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className={style.tableContainer}>
                    {!this.state.error ? (
                        <Table
                            striped
                            bordered
                            hover
                            size="sm"
                            responsive
                            className={style.myTable}
                        >
                            <thead className="thead-dark">
                                <tr>
                                    {col.recordID && <th>Record ID</th>}
                                    {col.jobID && <th>Job ID</th>}
                                    {col.jobName && <th>Job Name</th>}
                                    {col.date && <th>Time</th>}
                                    {col.host && <th>Host</th>}
                                    {col.uri && <th>Uri</th>}
                                    {col.method && <th>Method</th>}
                                    {col.protocol && <th>Protocol</th>}
                                    {col.secure && <th>Secure</th>}
                                    {col.sourceip && <th>Source IP</th>}
                                    {col.reqBody && <th>Req Body</th>}
                                    {col.header && <th>Headers</th>}
                                </tr>
                            </thead>
                            <tbody>{this.state.content}</tbody>
                        </Table>
                    ) : (
                        <Alert
                            variant={this.state.alertVariant}
                            onClose={this.handleAlert}
                            dismissible
                            className={style.alertBox}
                        >
                            <Alert.Heading>{this.state.alertTitle}</Alert.Heading>
                            <p>{this.state.alertText}</p>
                        </Alert>
                    )}
                </div>
            </div>
        );
    }
}

export default RealTimeMonitor;