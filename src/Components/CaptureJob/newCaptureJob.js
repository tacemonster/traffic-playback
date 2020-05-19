import React, { Component } from "react";
import {
  Input,
  FormGroup,
  Row,
  Col,
  Label,
  FormFeedback,
  Button,
} from "reactstrap";
import Axios from "axios";
import Joi from "joi-browser";
import DatePicker from "./datePicker";

class Capture extends Component {
  state = {
    capture: {
      jobName: "",
      uri: "",
      secure: "",
      on: "",
      off: "",
      http: "",
      https: "",
      protocol: "",
      host: "",
      get: "",
      post: "",
      put: "",
      method: [],
      sourceIP: "",
      //startTime: "",
      //   endDate: "",
      //   endTime: "",
      //   message: "",
    },
    errors: {},
    startDate: new Date(),
    endDate: new Date(),
  };

  schema = {
    jobName: Joi.string().required().label("Job Name"),
    uri: Joi.string().optional().allow("").label("URI"),
    protocol: Joi.string().optional().allow("").label("Protocol"),
    host: Joi.string().optional().allow("").label("Host"),
    method: Joi.string().optional().allow("").label("Method"),
    secure: Joi.string().optional().allow("").label("Secure"),
    sourceIP: Joi.string().optional().allow("").label("Source IP"),
    startDate: Joi.number().required().label("Start Date"),
    on: Joi.string().required().label("ON"),
    off: Joi.string().required().label("OFF"),
    http: Joi.string().required().label("HTTP"),
    https: Joi.string().required().label("HTTPS"),
    get: Joi.string().required().label("GET"),
    put: Joi.string().required().label("PUT"),
    post: Joi.string().required().label("POST"),
    // startTime: Joi.number().label("Start Time"),
    // endDate: Joi.number().label("End Date"),
    // endTime: Joi.number().label("End Time"),
    // Message: Joi.string().label("Message"),
  };

  validate = () => {
    const result = Joi.validate(this.state.capture, this.schema, {
      abortEarly: false,
    });
    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    if (error) return error.details[0].message;
    return null;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    //const errors = this.validate();
    //this.setState({ errors: errors || {} });
    //if (errors) return;
    //Call the server
    this.submit();
  };

  async submit() {
    const { data: message } = await Axios.post(
      "http://ec2-54-152-230-158.compute-1.amazonaws.com:8000/api/capture",
      this.state
    );
    this.setState({ message });
    console.log(message);
  }

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const capture = { ...this.state.capture };
    const secure = { ...this.state.capture.secure };

    capture[input.name] = input.value;
    this.setState({ capture, errors });
  };

  onSelect = ({ currentTarget: input }) => {
    const capture = { ...this.state.capture };
    capture[input.name] = input.value;
    this.setState({ capture });
  };

  handleStartDate = (date) => {
    this.setState({
      startDate: date,
    });
  };

  handleEndDate = (date) => {
    this.setState({
      endDate: date,
    });
  };

  render() {
    return (
      <>
        <h5 className="py-3 mb-3 border-bottom border-color-gray">
          Capture Request Form
        </h5>
        <form className="form" onSubmit={this.handleSubmit}>
          <Row>
            <Col md={12}>
              <FormGroup>
                <label>Capture Job Name</label>
                <Input
                  name="jobName"
                  value={this.state.capture.jobName}
                  onChange={this.handleChange}
                  invalid={this.state.errors.jobName}
                />
                <FormFeedback>Oh noes! that name is already taken</FormFeedback>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <label>Start Date</label>
                <DatePicker
                  selected={this.state.startDate}
                  value={this.state.startDate}
                  onChange={this.handleStartDate}
                  onSelect={this.handleSelect}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <label>End Date</label>
                <DatePicker
                  selected={this.state.endDate}
                  value={this.state.capture.endDate}
                  onChange={this.handleEndDate}
                  onSelect={this.handleSelect}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <label>URI</label>
                <Input
                  value={this.state.capture.uri}
                  onChange={this.handleChange}
                  name="uri"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <label>Host</label>
                <Input
                  value={this.state.capture.host}
                  onChange={this.handleChange}
                  name="host"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <label>Source IP</label>
                <Input
                  value={this.state.capture.sourceIP}
                  onChange={this.handleChange}
                  name="sourceIP"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup>
                <div>Method</div>
                <FormGroup check inline>
                  <Label check>
                    <Input
                      type="checkbox"
                      onChange={this.handleChange}
                      name="get"
                      value="on"
                    />{" "}
                    GET
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check>
                    <Input
                      type="checkbox"
                      onChange={this.handleChange}
                      name="post"
                      value="on"
                    />{" "}
                    POST
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check>
                    <Input
                      type="checkbox"
                      onChange={this.handleChange}
                      name="put"
                      value="on"
                    />{" "}
                    PUT
                  </Label>
                </FormGroup>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup>
                <div>Protocol</div>
                <FormGroup check inline>
                  <Label check>
                    <Input
                      type="checkbox"
                      onChange={this.handleChange}
                      name="http"
                      value="on"
                    />{" "}
                    HTTP
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check>
                    <Input
                      onChange={this.handleChange}
                      type="checkbox"
                      onChange={this.handleChange}
                      name="https"
                      value="on"
                    />{" "}
                    HTTPS
                  </Label>
                </FormGroup>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup>
                <div>Secure</div>
                <FormGroup check inline>
                  <Label check>
                    <Input
                      type="checkbox"
                      onChange={this.handleChange}
                      name="on"
                      value="on"
                    />{" "}
                    Yes
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check>
                    <Input
                      type="checkbox"
                      onChange={this.handleChange}
                      name="off"
                      value="on"
                    />{" "}
                    No
                  </Label>
                </FormGroup>
              </FormGroup>
            </Col>
          </Row>

          <Button color="primary" className="px-5">
            Submit
          </Button>
        </form>
      </>
    );
  }
}

export default Capture;
