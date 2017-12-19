import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import {  Row, Col, Control,  FormGroup, Container, InputGroup, InputGroupAddon, Button } from 'reactstrap';

import DayPickerInput from 'react-day-picker/DayPickerInput';

import 'react-day-picker/lib/style.css';

import { formatDate } from "../../utils/apiUtils";
import { createPDF } from '../../utils/createPDF';

import TableData from '../../components/table/Table';
import Dropdown from '../../components/dropdown/Dropdown';
import { upload } from "../../actions/upload";
import { getClients, deleteClients } from "../../actions/clients";


import 'pdfmake/build/pdfmake.js';
import 'pdfmake/build/vfs_fonts.js';
  
import "./home.css";

const TIMESTAMP = new Date();

const MONTH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];  

class Home extends Component {

  static propTypes = {
    locked: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    locked: false,
  }

  constructor(props) {
    super(props);
    this.state ={
      value: new Date().toISOString(),
      selectedDay: formatDate(Date.now()),
      clients: { ...props.clients.data },
      selectedArray: [],
      selectedMonth: TIMESTAMP.getMonth(),
    };
    this.handleDayChange = this.handleDayChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.handleAddEntry = this.handleAddEntry.bind(this);
    this.selectClient = this.selectClient.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePDF = this.handlePDF.bind(this);
    this.updateSelectedMonth = this.updateSelectedMonth.bind(this);
    this.lockMonthEditing = this.lockMonthEditing.bind(this);
  }

  componentWillMount() {
    const { id } = this.props.auth;
    if (!id) {
      this.props.history.replace('/login');
    } 
  }

  componentWillReceiveProps(nextProps) {
    if( this.props.clients !== nextProps.clients && nextProps.clients.data) {
      this.setState({
        clients: { ...nextProps.clients.data }
      });
    }
  }

  componentDidMount(){
    const { selectedMonth } = this.state;
    const { auth, dispatch } = this.props;
    dispatch(getClients(auth.id, selectedMonth));
  }

  handleDayChange(selectedDay, modifiers) {
    const newClients = {
      ...this.state.clients,
    }
    Object.keys(newClients).forEach((key) => {
      newClients[key]['Rechnungs-datum'] = selectedDay;
    });
    this.setState({
      ...this.state,
      clients: {
        ...newClients
      }
    });
  }

  handleAddEntry() {
    this.props.history.push('/client');
  }

  handleDelete() {
    const { selectedArray } = this.state;
    if (selectedArray.length) {
      this.props.dispatch(deleteClients(selectedArray));
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
        selectedArray.push(checkBoxes[i].getAttribute('id'));
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
      selectedArray: newArr
    });
  }

  handleSelect(e) {  // could just add a selected field to each receipt object. 
    const { selectedArray } = this.state;
    if(e.target) {
      const id = e.target.getAttribute('id');
      if (id ==='selectAll'){
        this.handleSelectAll();
      }
      let newArr ;
      if (!selectedArray.includes(id)) {
        selectedArray.push(id);  
        newArr = [...selectedArray];   
      } else {
        newArr = selectedArray.filter(item => item !== id);
      }
      this.setState({
        selectedArray: [...newArr]
      });
    }
  }

  handlePDF(){
    const { clients } = this.props;
    const { selectedArray } = this.state;
    createPDF(clients, selectedArray);
  }

  selectClient(client) {
    const { history } = this.props;
    history.push('/client/'+client._id);
  }

  uploadFile(){
    const file = this.newFile.files[0];
    const { id } = this.props.auth;    
    let data = new FormData();
    data.append('csvdata', file);
    this.props.dispatch(upload(data, id));
  }

  updateSelectedMonth(name, value) {
    const { dispatch, auth } = this.props;
    const monthNumber = MONTH.indexOf(value) + 1;
    this.setState({
      selectedMonth: monthNumber,
    }, dispatch(getClients(auth.id, monthNumber)));
  }

  lockMonthEditing(){
    // send a request to lock editing. 
    console.log('locking');
    const newClients = {
      ...this.state.clients,
    }
    Object.keys(newClients).forEach((key) => {
      newClients[key]['Rechnungsnummer'] = Number(this.state.clients[key]['Rechnungsnummer']) + 1;
    });
    this.setState({
      ...this.state,
      clients: {
        ...newClients
      },
      locked: !this.state.locked,
    });
    /// call back makes request to lock data
  }

  render() {
    const { auth } =this.props;
    const { selectedDay, clients, locked } = this.state;
    return (
      <Container>
          <FormGroup row>
            <Col sm={{ size:8 }}>
              <h3>Willkommen {auth.username} {auth.email}</h3>
            </Col>
            <Col sm={{ size:4 }}>
            <InputGroup>
               <InputGroupAddon>
                  <i 
                    class={`fa ${locked ? 'fa-lock' : 'fa-unlock'} fa-2x`} 
                    aria-hidden="true"
                    onClick={this.lockMonthEditing}
                  >
                  </i>
               </InputGroupAddon>
               <Dropdown
                 data={TIMESTAMP}
                 selected={MONTH[TIMESTAMP.getMonth()]}
                 name="month"
                 items={[...MONTH]}
                 updateFieldValue={this.updateSelectedMonth} 
               />
            </InputGroup>
            </Col>
          </FormGroup>
        <FormGroup row>
          <Col sm={{ size:4 }}>
            <InputGroupAddon>
              <input 
                type="file"
                name="csvdata"
                accept="text/cvs"
                onChange={this.uploadFile}
                ref={(input) => { this.newFile = input;}}
               />        
            </InputGroupAddon>
          </Col>
          <Col sm={{ size:4 , offset: 4 }}>
            <InputGroupAddon>
              <DayPickerInput
                value={selectedDay}
                onDayChange={this.handleDayChange}
                dayPickerProps={{
                  selectedDays: selectedDay,
                  disabledDays: {
                    daysOfWeek: [0, 6]
                  }
                }} 
              />
            </InputGroupAddon>
            </Col>
          </FormGroup>
          <Row>
        
        </Row>
        <br/>
        <Row>
          {clients && 
              <TableData
                data={Object.values(clients)}
                getClient={this.selectClient}
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
              <Button onClick={this.handlePDF} >PDF</Button>
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

const mapStateToProps = state => ({ ...state });


export default withRouter(connect(mapStateToProps)(Home));