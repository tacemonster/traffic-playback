import React, { Component }
import Input from "./common/input";
import Axios from "axios";
import Joi from "joi-browser";
import DatePicker from "./datePicker";

class Capture extends Component {
  state = {
    capture: {
      jobName: "",
      uri: "",
      secure: "",
      protocol: "",
      host: "",
      method: [],
      sourceIP: "",
      //   startTime: "",
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

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    //Call the server
    this.submit();
  };

  async submit() {
    const { data: message } = await Axios.post(
      "http://ec2-54-152-230-158.compute-1.amazonaws.com:8000/api/login",
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
      <div>
        <h1>Capture Form</h1>
        <form className="form-group w-25" onSubmit={this.handleSubmit}>
          <Input
            name="jobName"
            value={this.state.capture.jobName}
            label="Job Name (unique)"
            onChange={this.handleChange}
            error={this.state.errors.jobName}
          />

          <p>Start Date</p>
          <DatePicker
            selected={this.state.startDate}
            value={this.state.startDate}
            onChange={this.handleStartDate}
            onSelect={this.handleSelect}
            label="Start Date"
          />
          <p>End Date</p>
          <DatePicker
            selected={this.state.endDate}
            value={this.state.capture.endDate}
            onChange={this.handleEndDate}
            onSelect={this.handleSelect}
            //label="Start Date"
          />
          <p>Method</p>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="method"
              value="GET"
              onChange={this.handleChange}
              name="method"
            />
            <label className="form-check-label" for="inlineCheckbox1">
              GET
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="method"
              value="POST"
              onChange={this.handleChange}
              name="method"
            />
            <label className="form-check-label" for="inlineCheckbox2">
              POST
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={this.handleChange}
              name="method"
              value="PUT"
            />
            <label className="form-check-label" for="inlineCheckbox3">
              PUT
            </label>
          </div>
          <p></p>
          <p>Protocol</p>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={this.handleChange}
              name="protocol"
              value="HTTP"
            />
            <label className="form-check-label" for="inlineCheckbox1">
              HTTP
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={this.handleChange}
              name="protocol"
              value="HTTPS"
            />
            <label className="form-check-label" for="inlineCheckbox2">
              HTTPS
            </label>
          </div>

          <p></p>
          <p>Secure</p>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={this.handleChange}
              name="secure"
              value="Yes"
            />
            <label className="form-check-label" for="inlineCheckbox1">
              Yes
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={this.handleChange}
              name="secure"
              value="No"
            />
            <label className="form-check-label" for="inlineCheckbox2">
              No
            </label>
          </div>

          <Input
            name="uri"
            value={this.state.capture.uri}
            label="URI"
            onChange={this.handleChange}
            error={this.state.errors.uri}
          />

          <Input
            name="host"
            value={this.state.capture.host}
            label="Host"
            onChange={this.handleChange}
            error={this.state.errors.host}
          />

          <Input
            name="sourceIP"
            value={this.state.capture.sourceIP}
            label="Source IP"
            onChange={this.handleChange}
            error={this.state.errors.sourceIP}
          />

          <button className="btn btn-primary">Login</button>
        </form>
      </div>
    );
  }
}

export default Capture;
