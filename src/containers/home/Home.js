import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid, Row, Col, ControlLabel, FormGroup, Container, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import createReactClass from 'create-react-class';

import TableData from '../../components/table/Table';
import { upload } from "../../actions/upload";
import { getReceipts } from "../../actions/receipts"

import "./home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state ={
      value: new Date().toISOString(),
      selectedDay: undefined,
    }
    this.handleDayChange = this.handleDayChange.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
  }

  componentWillMount() {
      const { id } = this.props.auth;
      if (!id) {
        this.props.history.replace("/login");
      }
      this.props.dispatch(getReceipts(id))
  }

  componentDidMount(){

  }

  handleDayChange(selectedDay, modifiers) {
    this.setState({
      selectedDay,
    });
  }

  uploadFile(){
    const file = this.newFile.files[0];
    const { id } = this.props.auth;    
    let data= new FormData();
    data.append('file', file);
    this.props.dispatch(upload(data, id));
  }

  render() {
    const { auth } =this.props;
    const { selectedDay, receipts } = this.state;
    return (
      <Container>
        {  auth &&
          <Row>
            <h1>Home</h1>
            <div>{auth.username}</div>
            <div>{auth.email}</div>
          </Row>
        }
          <Row>
            <Col sm={{ size: 4, order: 9, offset: 8 }}>
                <DayPickerInput
                  value={selectedDay}
                  onDayChange={this.handleDayChange}
                  dayPickerProps={{
                    selectedDays: selectedDay,
                    disabledDays: {
                      daysOfWeek: [0, 6],
                    },
                  }} 
                />
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <InputGroup>
                <input 
                  type="file"
                  name="file"
                  onChange={this.uploadFile}
                  ref={(input) => { this.newFile = input}}
                 />
              </InputGroup>
            </Col>
            <Col sm={{ size: 4, order: 9, offset: 8 }}>
                <DayPickerInput
                  value={selectedDay}
                  onDayChange={this.handleDayChange}
                  dayPickerProps={{
                    selectedDays: selectedDay,
                    disabledDays: {
                      daysOfWeek: [0, 6],
                    },
                  }} 
                />
            </Col>
        </Row>
        <Row>
          {receipts && 
              <TableData
                data={receipts}
              />
          }
        </Row>
        <Row>
          <Col sm={4}>
            <InputGroup>
              <Button >+</Button>
            </InputGroup>
          </Col>
          <Col sm={4}>
            <h4>Gesmat</h4>
          </Col>
          <Col sm={4}>
            <h4>1000</h4>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <InputGroup>
              <Button >Clear</Button>
            </InputGroup>
          </Col>
            <Col sm={4}>
            <InputGroup>
              <Button >PDF</Button>
            </InputGroup>
          </Col>
            <Col sm={4}>
            <InputGroup>
              <Button >email</Button>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { auth, receipts } = state;
  return {
    auth,
    receipts,
  };
};

export default connect(mapStateToProps)(Home);