import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import {  Row, Col, Control, Label, FormGroup, Container, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import createReactClass from 'create-react-class';
import { formatDate } from "../../utils/apiUtils";

import TableData from '../../components/table/Table';
import { upload } from "../../actions/upload";
import { getReceipts, getSingleReceipt, deleteReceipts } from "../../actions/receipts";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import "./home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state ={
      value: new Date().toISOString(),
      selectedDay: formatDate(Date.now()),
      receipts: { ...props.receipts.data },
      selectedArray: [],
    }
    this.handleDayChange = this.handleDayChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.handleAddEntry = this.handleAddEntry.bind(this);
    this.selectReceipt = this.selectReceipt.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePDF = this.handlePDF.bind(this);

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

  componentDidMount(){
    const { auth, dispatch } = this.props;
    dispatch(getReceipts(auth.id));
  }

  handleDayChange(selectedDay, modifiers) {
    this.setState({
      selectedDay,
    });
  }

  handleAddEntry() {
    this.props.history.push('/receipt');
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
      selectedArray: newArr,
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
    const { receipts } = this.props;
    const { selectedArray } = this.state;

    const selectedId = selectedArray[0];
    const receipt = { ...receipts.data[selectedId] };

    const customerNumber = receipt['Kunden-nummer'];
    const allguests = Object.values(receipts.data || {}).filter( trans => 
      customerNumber === trans['Kunden-nummer']
    );
    
    const titleHeaders = [
      'Name des Gastes', 
      'Anreisedatum',
      'Abreisedatum',
      'Reinigungs-gebühr',
      'Airgreets Service Fee (€)',
      'CLEANING FARE',
      'TOTAL PAID'
    ];

    const columns = titleHeaders.map(key => {
      return {
        title: key,
        dataKey: key
      };
    });
    const rows = allguests.map(guest => {
      return titleHeaders.reduce((p,c) => {
          p[c] = guest[c];
          return p;
      },{});
    });

    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.setTextColor(20);
    doc.setFontStyle('normal');
    doc.text(receipt['Kunde'], 10, 20);
    doc.text(receipt['Stadt'], 10, 26);
    doc.text(receipt['Straße'], 10, 32);
    doc.text(receipt['PLZ'], 10, 38);
    doc.text(receipt['Kunden-nummer'], 50, 38);

    doc.text('Rechnungsübersicht', 10, 70);

    doc.text('Rechnungsnummer '+ receipt['Rechnungsnummer'], 10, 75);
    doc.text('Bitte bei Zahlung und Schriftverkehr angeben', 10, 80);
  
    doc.autoTable(columns, rows, {
      startY: doc.autoTableEndPosY() + 85,
      margin: { horizontal: 10 },
      styles: { overflow: 'linebreak' },
      bodyStyles: { valign: 'top' },
      columnStyles: { email: { columnWidth: 'wrap' } },
      theme: 'striped'
    });

    doc.setFontSize(8);
    doc.text('Bitte überweise obigen Betrag bis zum 15.11.17 auf das untenstehende Konto', 10, 200);
    doc.text('Beste Grube', 10, 208);
    doc.text('Florian', 10, 216);

    doc.setFontSize(7);
    doc.text('IBAN: DE49700700240017773300, SWIFT-BIC: DEUTDEDBMUC',10, 260);
    doc.text('Geschäftsführung: Julian Ritter, Sebastian Drescher', 10, 265);
    doc.text('Florian Bogenschütz Handelsregister: Amtsgericht München, HRB-Nr. 227243', 10, 270);
    doc.text('Sitz der Gesellschaft: München Steuernr: 143/112/10719', 10, 275);
    doc.save('repro.pdf');

  }

  selectReceipt(receipt) {
    const { history } = this.props;
    history.push('/receipt/'+receipt._id);
  }

  uploadFile(){
    const file = this.newFile.files[0];
    const { id } = this.props.auth;    
    let data = new FormData();
    data.append('csvdata', file);
    this.props.dispatch(upload(data, id));
  }

  render() {
    const { auth } =this.props;
    const { selectedDay, receipts } = this.state;

    return (
      <Container>
        {  auth &&
          <FormGroup row>
            <h3>Willkommen {auth.username} {auth.email}</h3>
          </FormGroup>
        }
        <FormGroup row>
          <Col sm={{ size:3 }}>
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
          <Col sm={{ size:3 , offset: 6}}>
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

const mapStateToProps = state => ({ ...state })


export default withRouter(connect(mapStateToProps)(Home));