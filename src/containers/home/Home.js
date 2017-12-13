import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import { Grid, Row, Col, ControlLabel, FormGroup, Container, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import createReactClass from 'create-react-class';

import TableData from '../../components/table/Table';
import { upload } from "../../actions/upload";
import { getReceipts, getSingleReceipt, deleteReceipts } from "../../actions/receipts";
import 'font-awesome/css/font-awesome.min.css';

import "./home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state ={
      value: new Date().toISOString(),
      selectedDay: undefined,
      receipts: { ...props.receipts.data },
      selectedArray: [],
    }
    this.handleDayChange = this.handleDayChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.handleAddEntry = this.handleAddEntry.bind(this);
    this.selectReceipt = this.selectReceipt.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount() {
    const { id } = this.props.auth;
    if (!id) {
      this.props.history.replace("/login");
    } 
  }

  componentWillReceiveProps(nextProps) {
    if( this.props.receipts !== nextProps.receipts && nextProps.receipts.data) {
      this.setState({
        receipts: { ...nextProps.receipts.data }
      })
    }
  }

  handleDayChange(selectedDay, modifiers) {
    this.setState({
      selectedDay,
    });
  }

  handleAddEntry() {
    this.props.history.push("/receipt");
  }

  handleDelete() {
    const { selectedArray } = this.state;
    if (selectedArray.length) {
      this.props.dispatch(deleteReceipts(selectedArray));
    }
  }

  handleSelectAll(){
    const { selectedArray } = this.state;
    let newArr;
    const selectAll = document.querySelector('#selectAll');
    const checkBoxes = document.querySelectorAll('.selectCheckBox');    
    if (selectAll.getAttribute('checked')){
      for (let i=0; i < checkBoxes.length; i++) {
        checkBoxes[i].setAttribute('checked', true);
        selectedArray.push(checkBoxes[i].getAttribute('id'))
        newArr = [...selectedArray];
      }
    } else {
      for (let i=0; i < checkBoxes.length; i++) {
        console.log('CALLL ME NOW ', selectAll.getAttribute('checked'));
        checkBoxes[i].setAttribute('checked', false);
        newArr = [];
      }
    }

    this.setState({
      selectedArray: newArr,
    })
  }

  handleSelect(e) {  // could just add a selected field to each receipt object. 
    const { selectedArray } = this.state;
    if(e.target) {
      const id = e.target.getAttribute('id');
      if (id ==='selectAll'){
        this.handleSelectAll()
      }
      let newArr ;
      if (!selectedArray.includes(id)) {
        selectedArray.push(id);  
        newArr = [...selectedArray]    
      } else {
        newArr = selectedArray.filter(item => item !== id);
      }
      this.setState({
        selectedArray: [...newArr]
      })
    }
  }

  selectReceipt(receipt) {
    const { history, dispatch } = this.props;
    history.push("/receipt/"+receipt._id);
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
                data={Object.values(receipts)}
                getReceipt={this.selectReceipt}
                handleSelect={this.handleSelect}
              />
          }
        </Row>
        <Row>
          <Col sm={4}>
            <InputGroup>
              <i onClick={this.handleAddEntry} className="fa fa-plus fa-3x" aria-hidden="true"></i>
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
              <i onClick={this.handleDelete} className="fa fa-trash fa-3x" aria-hidden="true"></i>
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

const mapStateToProps = state => ({ ...state })


export default withRouter(connect(mapStateToProps)(Home));