import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { Grid, Col, Row, Label, Control, Form, FormGroup, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import Dropdown from '../../components/dropdown/Dropdown';
import EditableField from '../../components/editableField/EditableField'; 
import Corrections from '../../components/corrections/Corrections';
import Customer from '../../components/customer/Customer';
import Guests from '../../components/guests/Guests';

import { calculateTotals } from '../../utils/apiUtils';
import uuidv4 from 'uuid/v4';

import { addClient, getClient, getClients, updateClient } from "../../actions/clients";

import 'react-day-picker/lib/style.css';
import "./client.css";

let requiredFields = [ 
  'Belegart',
  'Kunde',
  'Emailadresse',
  'Straße',
  'Stadt',
  'PLZ',
  'Kunden-nummer',
  'Rechnungs-datum'
];

let requiredFieldsGuest = [
  'Name des Gastes',
  'Abreisedatum (Leistungsdatum)',
  'Anreisedatum',
  'Reinigungs-gebühr',
//  'Gesamtumsatz Airgreets',
  'Airgreets Service Fee (€)'
];

let requiredFieldsRechnungsCorrection = [
  //'Rechnungskorrektur', 
  'Rechnungskorrektur in €',
  'Ust-Korrektur',
  'Sonstige Leistungsbeschreibung'
];

let requiredFieldsAuszhalungsCorrection = [
  //'Auszhalungskorrektur', 
  'Auszahlungskorrektur in €',
  'Ust-Korrektur',
  'Sonstige Leistungsbeschreibung'
];

class Client extends Component {

  static defaultProps = {
    client: {},
    guests: {},
    correction: {},
    Belegart: 'Belegart'
  }

  constructor(props) {
    super(props);
    const  { guests, corrections, client } = props;
    this.state ={
      Belegart: client['Belegart'] || 'Belegart',
      client: { ...client },
      guests: { ...guests},
      corrections: {...corrections},
    };
    this.updateFieldValue = this.updateFieldValue.bind(this);    
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.setState({
        Belegart: nextProps['Belegart'],
        client: { ...nextProps.client },
        guests: { ...nextProps.guests},
        corrections: {...nextProps.corrections},
      })
    }
  }


  checkRequiredFields(data){
    const { client, guests, corrections, Belegart } = data;
    let fields= [];
    const isGuests = Object.keys(guests || {}).length > 0;
    const isCorrections = Object.keys(corrections || {}).length > 0;
    const clientKeys = Object.keys(client);
    const guestsKeys = isGuests && Object.keys(Object.values(guests)[0]);
    const correctionsKeys = isCorrections && Object.keys(Object.values(corrections)[0]);

    const currentFields = [...clientKeys, ...guestsKeys, ...correctionsKeys, 'Belegart'];
    if (Belegart === 'Belegart') {
      return ['Belegart'];
    }
    if( Belegart !== 'Belegart' && !isGuests && !isCorrections) {
      fields = [ ...requiredFields ];
    }
    if( Belegart === 'Auszahlung' && isGuests && !isCorrections) {
      fields = [ ...requiredFields, ...requiredFieldsGuest];
    }
    if( Belegart === 'Rechnung' && isGuests && !isCorrections) {
      fields = [ ...requiredFields, ...requiredFieldsGuest];
    }
    if( Belegart === 'Auszahlung' && isGuests && isCorrections) {
      fields = [ ...requiredFields, ...requiredFieldsAuszhalungsCorrection, ...requiredFieldsGuest];
    }
    if (Belegart === 'Rechnung' && isGuests && isCorrections) {
      fields = [ ...requiredFields, ...requiredFieldsRechnungsCorrection, ...requiredFieldsGuest];
    }
    if( Belegart === 'Auszahlung' && isCorrections) {
      fields = [ ...requiredFields, ...requiredFieldsAuszhalungsCorrection];
    }
    if (Belegart === 'Rechnung' && isCorrections) {
      fields = [ ...requiredFields, ...requiredFieldsRechnungsCorrection ];
    }
    let missingFields =fields.filter(key => !currentFields.includes(key));
    return missingFields;
  }

  handleSubmission(){
    const { dispatch, auth } = this.props;
    const clientId = this.props.match.params.id;
    const data  = {
      ...this.state
    };
    let eventType  = clientId ? 'updateClient' : 'addClient';
    let message = 'Bist du sicher?';
    const missingFields = this.checkRequiredFields(data);

    if (missingFields.length > 0 && !clientId){
      eventType = 'requiredFields';
      message = 'Wir brauchen diese Felder :- ' + missingFields.join(', ');
    }
  
    let event = new Event(eventType);
    event.message = message;
    event.value = missingFields;
    event.id = clientId
    event.payload = { ...data };
    document.dispatchEvent(event);
  }

  handleAdd(type , fields){  
    const newId = uuidv4();
    const newFields =  Object.values(fields).map(field => field);
    newFields.push({ _id: newId });
    this.setState({
      [type]: {
        ...newFields
      }
    });
    console.log({...newFields}, 'newFields', fields);
  }

  handleDel(key, type){
    const entries = { ...this.state[type] };
    const newEntries = Object.keys(entries).reduce((p,c) => {
       if (c !== key ){
        p[c] = { ...entries[c]};
       } 
       return p;
    }, {});
    
    this.setState({
      [type]: {
        ...newEntries
      }
    });
  }

  updateFieldValue(field, value, type, id){
    if ((/datum/).test(field)) {
      value = new Date(value).getTime();
    }
    console.log(value);
    if (id && type) {
      this.setState( prevSate => ({ 
        ...prevSate,
        [type]: {
           ...prevSate[type],
          [id]: {
            ...prevSate[type][id],
            [field]: value
          }
        } 
      }));
    } else if (type && !id) {
        this.setState( prevState => ({
          ...prevState,
          [type]: {
            ...prevState[type],
            [field]: value
          }
        }));
    } else  {
      this.setState( ()  => ({ [field]: value }));
    }
  }

  render() {
    const { client, guests, corrections, Belegart } = this.state;
    return (
    <Form className="bill">
        <FormGroup row>
          <Col sm={{ size:5 }}>
            <br/>
            <Dropdown
              data={client}
              name="Belegart"
              items={['Rechnung', 'Auszahlung']}
              updateFieldValue={this.updateFieldValue} 
              selected={client['Belegart']|| 'Belegart'}
            />
          </Col>
          <Col sm={{ size:1, offset: 6}}>
            <i 
              style={{
                margin: '10px'
              }}
              class="fa fa-chevron-left fa-3x"
              aria-hidden="true"
              onClick={() => this.props.history.push('/')}
            />
          </Col>
        </FormGroup>
        <Customer 
          client={client}
          updateFieldValue={this.updateFieldValue} 
          Belegart={Belegart}
        />
        <Guests 
          updateFieldValue={this.updateFieldValue}
          guests={guests}
          handleDelGuest={this.handleDel}
          handleAddGuest={this.handleAdd}

        />
        <div>
          <Corrections 
            updateFieldValue={this.updateFieldValue} 
            corrections={corrections}
            handleDelCorrection ={this.handleDel}
            handleAddCorrection ={this.handleAdd}
          />
        </div>
        <FormGroup row>
          <Col sm={{ size: 4, order: 1 }}>
            {client.Belegrat !== 'Rechnung' &&
              <EditableField 
                name="Gesamtumsatz Airgreets" 
                placeholder="Gesamt Auszahlungs Betrag"
                value={calculateTotals('Auszahlung', guests, corrections)}
                disabled

              />
            }
          </Col>
          <Col sm={{ size: 4, order: 1 }}>
            <EditableField 
              name="Gesamt Rechnungs Betrag"
              placeholder="Gesamt Rechnungs Betrag"
              value={calculateTotals('Rechnungs', guests, corrections)}
              disabled
            />
          </Col>
          <Col sm={{ size: 4, order: 1 }}>
            <EditableField 
              name="Darin enthaltene Umsatzsteuer"
              placeholder="Darin Enthaltene Umsatzsteuer"
              value={calculateTotals('Rechnungs', guests, corrections, 'tax')}
              disabled
            />
          </Col>
        </FormGroup>
        <Row className="">
          <Col sm={{ size: 2, order: 2, offset: 10 }}>
            <Button onClick={this.handleSubmission} type="button" color="primary">
            Speichern
            </Button>
          </Col>
        </Row>
    </Form>
    );
  }
}

const mapStateToProps = (state, props) => { 
  const { clients } = state;
  const { message, data, locked } = clients;
  const id = props.match.params.id;
  const client = data && data[id];
  const guests =  client && client.listings.filter(listing => listing['Name des Gastes']);
  const corrections = client && client.listings.filter(listing => !listing['Name des Gastes']);
  return {
    client: client && { ...client},
    guests: client  && { ...guests},
    corrections: client && { ...corrections},
    message,
    locked
  };
};


export default withRouter(connect(mapStateToProps)(Client));

