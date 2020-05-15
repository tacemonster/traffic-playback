import React from 'react';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import style from './TrafficStatistic.module.css';

class RealTimeMonitor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null,
            loading: false,
            data: null,
        };
        this.realtimeHandler = null;
        this.interval = 60000;  // default update traffic by every 60s
    }

    getRealTimeData = () => {
        this.setState({ loading: true });
        fetch('http://ec2-54-152-230-158.compute-1.amazonaws.com:8000/api/play/realtime?limit=50')
            .then((res) => {
                if (res.json) {
                    return res.json().then((json) => {
                        return res.ok ? json : Promise.reject(json);
                    });
                } else {
                    Promise.reject('No JSON exist!');
                }
            })
            .then((result) => {
                console.log(result);
                this.setState({
                    data: result,
                    loading: false,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    content: null,
                    loading: false,
                });
            });
    }

    handleGet = (ms) => {
        this.realtimeHandler = setInterval(this.getRealTimeData, ms);
    }
    handleRemove = () => {
        clearInterval(this.realtimeHandler);
    }
    handleUpdate = (newMs) => {
        this.interval = newMs;
        this.handleRemove();
        this.handleGet(this.interval);
    }

    handleRefresh = () => {
        this.handleRemove();
        this.getRealTimeData();
        this.handleGet(this.interval);
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
                <h1 className={style.title}>My Real Time Monitor</h1>
                <RealTimeTable
                    data={this.state.data}
                    loading={this.state.loading}
                    msHandler={this.handleUpdate}
                    refreshHandler={this.handleRefresh}
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
            columnEnabled: {
                id: true,
                jobID: false,
                date: true,
                host: true,
                uri: true,
                method: true,
                sourceip: false,
                protocol: false,
                secure: false,
                header: false,
            },
            remainTime: 60,
        };
        this.updateTime = 60;
        this.remainTime = 60;
        this.refreshTimeHandler = null;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            this.handleContent(nextProps.data);
        }
    }
    componentDidMount() {
        this.handleRefreshTimeDisplay();
    }
    componentWillUnmount() {
        clearInterval(this.refreshTimeHandler);
    }

    handleContent = (data) => {
        if (data) {
            let content = [];
            data.forEach((row) => {
                content.push(this.handleRow(row));
            });
            this.setState({ content: content });
        }
    }

    handleRow = (row) => {
        let rowTime = new Date(row.utime * 1000);
        let date = `${rowTime.getMonth() + 1}/${rowTime.getDate()} ${rowTime.getHours()}:${rowTime.getMinutes()}:${rowTime.getSeconds()}`;
        let col = this.state.columnEnabled;
        return (
            <tr key={row.id}>
                {col.id && <td>{row.id}</td>}
                {col.jobID && <td>{row.jobs}</td>}
                {col.date && <td>{date}</td>}
                {col.host && <td style={{ maxWidth: '150px' }}>{row.host}</td>}
                {col.uri && <td style={{ maxWidth: '150px' }}>{row.uri}</td>}
                {col.protocol && <td>{row.protocol}</td>}
                {col.secure && <td>{row.secure == 0 ? 'False' : 'True'}</td>}
                {col.method && <td style={{ maxWidth: '50px' }}>{row.method}</td>}
                {col.sourceip && <td style={{ maxWidth: '110px' }}>{row.sourceip}</td>}
                {col.header && <td style={{ maxWidth: '150px' }}>{row.header}</td>}
            </tr>
        );
    };

    addCheckBoxes = () => {
        let col = this.state.columnEnabled;
        let content = [];
        Object.keys(col).forEach(key => {
            content.push(
                <div className={style.item} key={`column=${key}`}>
                    <Form.Check
                        onChange={this.handleCheckBox}
                        type={'checkbox'}
                        id={`column::${key}`}
                        label={`${key}`}
                        checked={col[key]}
                        className={style.checkBox}
                    />
                </div>
            );
        });
        return content;
    }

    handleCheckBox = (e) => {
        if (e.target.id && e.target.id !== '') {
            let col = this.state.columnEnabled;
            let columnName = e.target.id.split('::')[1];
            col[columnName] = e.target.checked;
            this.setState({ columnEnabled: col });
            this.handleContent(this.props.data);
        }
    }

    handleRefresh = () => {
        this.props.refreshHandler();
        this.remainTime = this.updateTime;
    }

    handleUpdateTime = (e) => {
        let s = parseInt(e.target.options[e.target.selectedIndex].value);
        this.updateTime = this.remainTime = s;
        this.props.msHandler(s * 1000);
    }

    handleRefreshTimeDisplay = () => {
        this.refreshTimeHandler = setInterval(() => {
            if (this.remainTime <= 0) {
                this.remainTime = this.updateTime;
            }
            --this.remainTime;
            this.setState({ remainTime: this.remainTime });
        }, 1000);
    }

    render() {
        let col = this.state.columnEnabled;
        return (
            <div>
                <Row>
                    <Col xs={12} sm={6} lg={3}>
                        <label
                            htmlFor="columns-dropdown"
                            className={style.optionLabel}
                        >
                            Display Columns:
                        </label>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="outline-dark"
                                id="columns-dropdown"
                                disabled={this.props.loading ? true : false}
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
                            htmlFor="update-time"
                            className={style.optionLabel}
                        >
                            Update By:
                        </label>
                        <Form.Control as="select" id="update-time" onChange={this.handleUpdateTime} disabled={this.props.loading ? true : false} defaultValue='60'>
                            <option value='10'>10 seconds</option>
                            <option value='20'>20 seconds</option>
                            <option value='30'>30 seconds</option>
                            <option value='45'>45 seconds</option>
                            <option value='60'>60 seconds</option>
                            <option value='120'>120 seconds</option>
                            <option value='300'>300 seconds</option>
                        </Form.Control>
                    </Col>
                    <Col xs={12} sm={6} lg={3}>
                        <label htmlFor="refresh" className={style.optionLabel}>
                            Refresh
                        </label>
                        <Button
                            id='refresh'
                            variant="primary"
                            className={style.applyBtn}
                            disabled={this.props.loading ? true : false}
                            onClick={this.handleRefresh}
                        >
                            {this.props.loading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                'Refresh'
                            )}
                        </Button>
                        <div style={{textAlign: 'center'}}>Will Refresh in <span>{this.state.remainTime}</span>s</div>
                    </Col>
                </Row>

                <div className={style.statTable}>
                    <Table striped bordered hover size="sm" responsive>
                        <thead className="thead-dark">
                            <tr>
                                {col.id && <th>ID</th>}
                                {col.jobID && <th>Job ID</th>}
                                {col.date && <th>Time</th>}
                                {col.host && <th>Host</th>}
                                {col.uri && <th>Uri</th>}
                                {col.protocol && <th>Protocol</th>}
                                {col.secure && <th>Secure</th>}
                                {col.method && <th>Method</th>}
                                {col.sourceip && <th>Source IP</th>}
                                {col.header && <th>Header Info</th>}
                            </tr>
                        </thead>
                        <tbody>{this.state.content}</tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default RealTimeMonitor;