import React from 'react';
import { Dropdown, Table, Form, Button, Spinner, Row, Col, Alert, Modal } from 'react-bootstrap';
import style from './TrafficStatistic.module.css';
import Routes from '../Playback/Routes';

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
    }

    getRealTimeData = () => {
        this.setState({ loading: true });
        let url = `${Routes.getRealtime}?limit=${this.limit}`;
        // let url = `http://ec2-54-152-230-158.compute-1.amazonaws.com:7999/api/play/realtime?limit=${this.limit}`;
        fetch(url)
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
                    error: false,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    content: null,
                    loading: false,
                    error: true,
                });
            });
    }

    handleGet = (ms) => {
        if (ms) {
            this.realtimeHandler = setInterval(this.getRealTimeData, ms);
        }
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

    handleLimit = (newLimit) => {
        this.limit = newLimit;
    }

    handleOpenModal = (e) => {
        this.setState({ open: true });
        let req = e.target.name.split('\0');
        let url = `${Routes.getPreview}?id=${req[0]}`;
        // let url = `http://ec2-54-152-230-158.compute-1.amazonaws.com:8000/api/preview?id=${req[0]}`;
        fetch(url)
            .then((res) => {
                return res.text();
            })
            .then((result) => {
                this.setState({
                    modalContent: result,
                    modalTitle: req[1],
                });
            })
            .catch((err) => {
                this.setState({
                    modalContent: err,
                    modalTitle: req[1],
                });
            });
    }

    handleCloseModal = () => {
        this.setState({
            open: false,
            modalTitle: null,
            modalContent: null,
        });
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
                    error={this.state.error}
                    msHandler={this.handleUpdate}
                    refreshHandler={this.handleRefresh}
                    limitHandler={this.handleLimit}
                    modalOpenHandler={this.handleOpenModal}
                />

                <Modal show={this.state.open} onHide={this.handleCloseModal} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title className={style.previewTitle}>{this.state.modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <iframe srcDoc={this.state.modalContent} className={style.previewContant}></iframe>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
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
                reqBody: false,
                sourceip: false,
                protocol: false,
                secure: false,
                header: false,
            },
            remainTime: 60,
            never: false,
        };
        this.updateTime = 60;
        this.remainTime = 60;
        this.refreshTimeHandler = null;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            this.handleContent(nextProps.data);
        }
        if (nextProps.error === true) {
            this.setState({ error: true });
        }
    }
    componentDidMount() {
        this.handleRefreshTimeDisplay();
    }
    componentWillUnmount() {
        this.handleRemoveRefresh();
    }

    handleContent = (data) => {
        if (data) {
            let content = [];
            data.forEach((row) => {
                content.push(this.handleRow(row));
            });
            this.setState({ content: content, error: false });
        }
    }

    handleRow = (row) => {
        let rowTime = new Date(row.utime * 1000);
        let date = `${rowTime.getMonth() + 1}/${rowTime.getDate()} ${rowTime.getHours()}:${rowTime.getMinutes()}:${rowTime.getSeconds()}`;
        let col = this.state.columnEnabled;
        let previewBtn = (
            <Button name={`${row.id}\0${row.secure === 1? 'https://' : 'http://'}${row.host}${row.uri}`} variant="success" size='sm' onClick={this.props.modalOpenHandler} className={style.previewBtn}>
                Preview
            </Button>
        );
        return (
            <tr key={row.id}>
                {col.id && <td>{row.id}</td>}
                {col.jobID && <td>{row.jobs}</td>}
                {col.date && <td>{date}</td>}
                {col.host && <td style={{ maxWidth: '150px' }}>{row.host}</td>}
                {col.uri && <td style={{ maxWidth: '150px' }}>{row.uri}</td>}
                {col.method && <td style={{ maxWidth: '50px' }}>{row.method}</td>}
                {col.reqBody && <td>{JSON.stringify(row.reqbody)}</td>}
                {col.protocol && <td>{row.protocol}</td>}
                {col.secure && <td>{row.secure === 0 ? 'False' : 'True'}</td>}
                {col.sourceip && <td style={{ maxWidth: '110px' }}>{row.sourceip}</td>}
                {col.header && <td style={{ maxWidth: '150px' }}>{row.header}</td>}
                {/* {<td style={{textAlign: 'center'}}>{previewBtn}</td>} */}
            </tr>
        );
    };

    addCheckBoxes = () => {
        let col = this.state.columnEnabled;
        let content = [];
        Object.keys(col).forEach(key => {
            content.push(
                <div className={style.item} key={`column::${key}`}>
                    <Form.Check
                        onChange={this.handleCheckBox}
                        type={'checkbox'}
                        id={`column::${key}`}
                        label={key}
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
    handleRemoveRefresh = () => {
        clearInterval(this.refreshTimeHandler);
    }

    handleAlert = () => {
        this.setState({ error: false });
    }

    handleUpdateLimit = (e) => {
        this.props.limitHandler(parseInt(e.target.options[e.target.selectedIndex].value))
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
                            title='select what info to display'
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
                            htmlFor="update-limit"
                            className={style.optionLabel}
                            title='number of records to fetch each time'
                        >
                            Limit:
                        </label>
                        <Form.Control as="select" id="update-limit" onChange={this.handleUpdateLimit} disabled={this.props.loading ? true : false} defaultValue='50'>
                            <option value='20'>20 records</option>
                            <option value='50'>50 records</option>
                            <option value='100'>100 records</option>
                            <option value='200'>200 records</option>
                            <option value='500'>500 records</option>
                            <option value='1000'>1000 records</option>
                        </Form.Control>
                    </Col>
                    <Col xs={12} sm={6} lg={3}>
                        <label
                            htmlFor="update-time"
                            className={style.optionLabel}
                            title='frequency to update monitor'
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
                            <option value='never'>Never</option>
                        </Form.Control>
                    </Col>
                    <Col xs={12} sm={6} lg={3}>
                        <label htmlFor="refresh" className={style.optionLabel} title='refresh monitor'>
                            Refresh
                        </label>
                        <Button
                            id='refresh'
                            variant="primary"
                            className={style.applyBtn}
                            disabled={this.props.loading ? true : false}
                            onClick={this.handleRefresh}
                        >
                            {this.props.loading
                                ? (<Spinner animation="border" size="sm" />)
                                : ('Refresh')
                            }
                        </Button>
                        <div style={{ textAlign: 'center' }}>
                            {!this.state.never
                                ? <span>Will Refresh in <span>{this.state.remainTime}</span>s</span>
                                : <span>Never Refresh Automatically</span>
                            }
                        </div>
                    </Col>
                </Row>

                <div className={style.tableContainer}>
                    {!this.state.error ?
                        <Table striped bordered hover size="sm" responsive className={style.myTable}>
                            <thead className="thead-dark">
                                <tr>
                                    {col.id && <th>ID</th>}
                                    {col.jobID && <th>Job ID</th>}
                                    {col.date && <th>Time</th>}
                                    {col.host && <th>Host</th>}
                                    {col.uri && <th>Uri</th>}
                                    {col.method && <th>Method</th>}
                                    {col.reqBody && <th>Req Body</th>}
                                    {col.protocol && <th>Protocol</th>}
                                    {col.secure && <th>Secure</th>}
                                    {col.sourceip && <th>Source IP</th>}
                                    {col.header && <th>Header Info</th>}
                                    {/* {<th>Action</th>} */}
                                </tr>
                            </thead>
                            <tbody>{this.state.content}</tbody>
                        </Table>
                        :
                        <Alert
                            variant="danger"
                            onClose={this.handleAlert}
                            dismissible
                            className={style.alertBox}
                        >
                            <Alert.Heading>Error</Alert.Heading>
                            <p>Server Not Connected!</p>
                        </Alert>
                    }  
                </div>
            </div>
        );
    }
}

export default RealTimeMonitor;