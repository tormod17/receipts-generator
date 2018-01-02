import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import {  Row, Col, Control,  FormGroup, Container, InputGroup, InputGroupAddon, Button } from 'reactstrap';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate } from "../../utils/apiUtils";


import 'react-day-picker/lib/style.css';

import { createPDF } from '../../utils/createPDF';

import TableData from '../../components/table/Table';
import Dropdown from '../../components/dropdown/Dropdown';
import { upload } from '../../actions/upload';
import { getClients, deleteClients } from '../../actions/clients';
import { emailClients } from '../../actions/email';

import 'pdfmake/build/pdfmake.js';
import 'pdfmake/build/vfs_fonts.js';
  
import './home.css';

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

  constructor(props) {
    super(props);
    const { clients, message, total } = props;
    this.state ={
      value: new Date().toISOString(),
      selectedDay: formatDate(Date.now()),
      clients: { ...clients } ,
      message,
      selectedMonth: TIMESTAMP.getMonth(),
      locked: false,
      total
    };
    this.handleDayChange = this.handleDayChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.handleAddEntry = this.handleAddEntry.bind(this);
    this.getClient = this.getClient.bind(this);
    this.getSelectedIds = this.getSelectedIds.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePDF = this.handlePDF.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
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
    const { message, clients } = this.props;
    if( message !== nextProps.message || clients !== nextProps.clients ) {
      this.setState({
        message: nextProps.message || message,
        clients: { 
           ...nextProps.clients
        }
      });
    } 
  }


  handleDayChange(selectedDay) {
    const newClients = {
      ...this.state.clients
    };
    Object.keys(newClients).forEach((key) => {
      newClients[key]['Rechnungs-datum'] = formatDate(selectedDay);
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
    this.props.dispatch(deleteClients(this.getSelectedIds())
    );
  }

  getSelectedIds(){
    const checkBoxes = document.querySelectorAll('.clientCheck:checked');
    const selectedIds = [...checkBoxes].map(box => box.getAttribute('id'));
    return selectedIds;
  }
  
  handlePDF(){
    const { clients } = this.state;
    this.getSelectedIds().forEach(id => {
      createPDF(clients, id);      
    });
  }
  handleEmail(e) {  
    e.preventDefault();
    const { clients } = this.state;
    const selectedIds = [...this.getSelectedIds()];
    const selectedClients =  selectedIds.map(id => clients[id]);
    this.props.dispatch(emailClients(selectedClients));
  }

  getClient(client) {
    const { history } = this.props;
    history.push('/client/'+client._id);
  }

  uploadFile(){
    const file = this.newFile.files[0];
    const { id } = this.props.auth;    
    let data = new FormData();
    data.append('csvdata', file);
    this.props.dispatch(upload(data, id),
      this.props.dispatch(getClients(this.props.auth.id, this.state.selectedMonth))
    );
  }

  updateSelectedMonth(name, value) {
    const { dispatch, auth } = this.props;
    const monthNumber = MONTH.indexOf(value);
    this.setState({
      selectedMonth: monthNumber
    });
    dispatch(getClients(auth.id, monthNumber));
  }

  lockMonthEditing(){
    const { id } = this.props.auth;
    let event = new Event('lockMonth');
    event.message = 'Bist du sicher?',
    event.value = this.state.selectedMonth;
    event.payload = { ...this.state.clients };
    event.id = id;
    document.dispatchEvent(event);
  }

  render() {
    const { auth, total, locked } =this.props;
    const { selectedDay, message, clients } = this.state;
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
                    className={`fa ${locked ? 'fa-lock' : 'fa-unlock'} fa-2x`} 
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
                disabled={locked}
               />        
            </InputGroupAddon>
          </Col>
          <Col sm={{ size:4 }}>
            <p>{message}</p>
          </Col>
          <Col sm={{ size:4  }}>
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
                disabled={locked} 
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
              clients={clients}
              getClient={this.getClient}
              handleSelect={this.handleSelect}
              locked={locked}
            />
          }
        </Row>
        <Row>
          <Col sm={4}>
            <InputGroup>
             {!locked &&  <i onClick={this.handleAddEntry} className="fa fa-plus fa-2x" aria-hidden="true"></i> }
            </InputGroup>
          </Col>
          <Col sm={4}>
            <h4>Gesamt</h4>
          </Col>
          <Col sm={4}>
            <h4>{total}</h4>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <InputGroup>
              <i onClick={this.handleDelete} className="fa fa-trash fa-2x" aria-hidden="true"></i> 
            </InputGroup>
          </Col>
            <Col sm={4}>
            <InputGroup>
              <Button onClick={this.handlePDF} >PDF</Button>
            </InputGroup>
          </Col>
            <Col sm={4}>
            <InputGroup>
              <Button type="button" onClick={this.handleEmail} >email</Button>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

const calcTotalListings = (listings) => {
  if (!listings) return false;
  const output = listings.reduce((p,c) => {
      const clientTotal = (c && c['Gesamtumsatz Airgreets'] && parseFloat(c['Gesamtumsatz Airgreets'].replace( /,/g, ''))) || 0;
      const corrections = (c && c['Ust-Korrektur'] && parseFloat(c['Ust-Korrektur'].replace( /,/g, ''))) || 0;
      p += clientTotal + corrections;
      return p;
    },0);
  return output;
};

const mapStateToProps = state => {
  const { clients } = state;
  const { message, data } = clients;
  let total = 0;
  data && Object.keys(data || {}).map((key) => {
    data[key].Rechnungsbetrag = data && calcTotalListings(data[key].listings); 
    total += data[key].Rechnungsbetrag;
  });
  let locked =true;
  if (data) {
    locked =  Object.values(data)[0]
      &&  Object.values(data)[0].listings[0]
        && Object.values(data)[0].listings[0].locked;
  }
  return {
    message,
    clients: {...data },
    total: total.toFixed(2),
    locked
  };
};

export default withRouter(connect(mapStateToProps)(Home));