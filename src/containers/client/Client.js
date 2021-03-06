import React, { Component } from "react";
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import { Col, Row, Form, FormGroup, Button } from 'reactstrap';
import Dropdown from '../../components/dropdown/Dropdown';
import EditableField from '../../components/editableField/EditableField'; 
import Corrections from '../../components/corrections/Corrections';
import Customer from '../../components/customer/Customer';
import Guests from '../../components/guests/Guests';
import { getText } from '../../language/';

import { calculateATotals, calculateRTotals, calculateTaxTotals } from '../../utils/apiUtils';
import uuidv4 from 'uuid/v4';

import 'react-day-picker/lib/style.css';
import "./client.css";

const requiredFields = [ 
  getText('TYPE'),
  getText('CUSTOMER.NAME'),
  getText('CUSTOMER.EMAIL'),
  getText('CUSTOMER.STREET'),
  getText('CUSTOMER.TOWN'),
  getText('CUSTOMER.POSTCODE'),
  getText('CUSTOMER.NUMBER'),
  getText('INV.DATE')
];

const requiredFieldsGuest = [
  getText("TRANS.GUEST.NAME"),
  getText("TRANS.ARR.DATE"),
  getText("TRANS.GUEST.DPRT.DATE"),
  getText("TRANS.CLEANING"),
  getText("TRANS.GUEST.SRV.FEE")
];

const requiredFieldsRechnungsCorrection = [
  'type',
  getText('TRANS.CORR.REASON')
];

const requiredFieldsAuszhalungsCorrection = [
  'type',
  getText('TRANS.CORR.REASON')
];

class Client extends Component {

  static defaultProps = {
    client: {},
    guests: {},
    correction: {},
    Belegart: getText('TYPE'),
    locked: false,
  }

  constructor(props) {
    super(props);
    const  { guests, corrections, client } = props;
    this.state ={
      Belegart: client[getText('TYPE')] || getText('TYPE') ,
      client: { ...client },
      guests: { ...guests},
      corrections: {...corrections},
    };
    this.updateFieldValue = this.updateFieldValue.bind(this); 
    this.resetCorrection = this.resetCorrection.bind(this);   
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.setState({
        Belegart: nextProps.client.Belegart,
        client: { ...nextProps.client },
        guests: { ...nextProps.guests},
        corrections: {...nextProps.corrections},
      })
    }
  }

  checkRequiredFields(data){
    const { client, guests, corrections, Belegart } = data;
    let validationFields= [];
    const isGuests = Object.keys(guests || {}).length > 0;
    const isCorrections = Object.keys(corrections || {}).length > 0;
    const clientKeys = Object.keys(client);
    const guestsKeys = isGuests && Object.keys(Object.values(guests)[0]);
    const correctionsKeys = isCorrections && Object.keys(Object.values(corrections)[0]);

    const currentFields = [...clientKeys, ...guestsKeys, ...correctionsKeys, getText('TYPE')];
    if (Belegart === getText('TYPE')) {
      return [getText('TYPE')];
    }
    if( Belegart !== getText('TYPE') && !isGuests && !isCorrections) {
      validationFields = [ ...requiredFields ];
    }
    if( Belegart === 'Auszahlung' && isGuests && !isCorrections) {
      validationFields = [ ...requiredFields, ...requiredFieldsGuest];
    }
    if( Belegart === 'Rechnung' && isGuests && !isCorrections) {
      validationFields = [ ...requiredFields, ...requiredFieldsGuest];
    }
    if( Belegart === 'Auszahlung' && isGuests && isCorrections) {
      validationFields = [ ...requiredFields, ...requiredFieldsAuszhalungsCorrection, ...requiredFieldsGuest];
    }
    if (Belegart === 'Rechnung' && isGuests && isCorrections) {
      validationFields = [ ...requiredFields, ...requiredFieldsRechnungsCorrection, ...requiredFieldsGuest];
    }
    if( Belegart === 'Auszahlung' && isCorrections) {
      validationFields = [ ...requiredFields, ...requiredFieldsAuszhalungsCorrection];
    }
    if (Belegart === 'Rechnung' && isCorrections) {
      validationFields = [ ...requiredFields, ...requiredFieldsRechnungsCorrection ];
    }
    let missingFields = validationFields.filter(key => !currentFields.includes(key));
    return missingFields;
  }

  handleSubmission(){
    const { match } = this.props;
    const invoiceId = match.params.id;
    const data  = {
      ...this.state
    };
    let eventType  = invoiceId ? 'updateClient' : 'addClient';
    let message = getText('CONFIRM.MESSAGE');
    const missingFields = this.checkRequiredFields(data);

    if (missingFields.length > 0 && !invoiceId){
      eventType = 'requiredFields';
      message = 'Wir brauchen diese Felder :- ' + missingFields.join(', ');
    }
    
    let event = new Event(eventType);
    event.message = message;
    event.value = missingFields;
    event.id = invoiceId
    event.payload = { ...data };
    document.dispatchEvent(event);
  }

  handleAdd(type , fields){  
    const newId = uuidv4();
    const newFields =  Object.values(fields).map(field => field);
    const dates = (type === 'guests') && { 
      'Anreisedatum': new Date().getTime(),
      'Abreisedatum (Leistungsdatum)': new Date().getTime()      
    }
    newFields.push({ 
      _id: newId,
      ...dates
    });
    this.setState({
      [type]: {
        ...newFields
      }
    });
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

  resetCorrection(type, id) {
    console.log(type, id);
    this.setState(prevSate => ({
      ...prevSate,
      corrections: {
        ...prevSate.corrections,
        [id]:{
          type,
          total: 0,
          reason: '',
          _id: uuidv4(),
        }
      }
    }))
  }

  updateFieldValue(field, value, type, id){
    if (!this.state.client['Rechnungsdatum']) {
      this.setState({
        'Rechnungsdatum': new Date().getTime(),
      });
    };
    if ((/datum/).test(field)) {
      value = new Date(value).getTime();
    };
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
    const { locked } = this.props;
    return (
    <Form className="bill container">
        <FormGroup row>
          <Col sm={{ size:5 }}>
            <br/>
            { locked &&
              <h4> {client.Belegart}</h4>
            }
            { !locked && 
              <Dropdown
                data={client}
                name="Belegart"
                items={['Rechnung', 'Auszahlung']}
                updateFieldValue={this.updateFieldValue} 
                selected={client['Belegart']|| 'Belegart'}
                disabled={locked}
              />
            }
          </Col>
          <Col sm={{ size:1, offset: 6}}>
            <i 
              style={{
                margin: '10px'
              }}
              className="fa fa-chevron-left fa-3x"
              aria-hidden="true"
              onClick={() => this.props.history.push('/')}
            />
          </Col>
        </FormGroup>
        <Customer 
          client={client}
          updateFieldValue={this.updateFieldValue} 
          Belegart={Belegart}
          locked={locked}
        />
        <Guests 
          updateFieldValue={this.updateFieldValue}
          guests={guests}
          handleDelGuest={this.handleDel}
          handleAddGuest={this.handleAdd}
          Belegart={Belegart}
          locked={locked}
        />
        <Corrections 
          updateFieldValue={this.updateFieldValue} 
          resetCorrection={this.resetCorrection} 
          corrections={corrections}
          handleDelCorrection ={this.handleDel}
          handleAddCorrection ={this.handleAdd}
          Belegart={Belegart}
          locked={locked}
        />
        <FormGroup row>
          <Col sm={{ size: 4, order: 1 }}>
            { Belegart === 'Auszahlung' &&
              <EditableField 
                name="Gesamtumsatz Airgreets" 
                placeholder="Gesamtauszahlungsbetrag"
                value={calculateATotals(guests, corrections, client['Belegart'])}
                disabled
              />
            }
          </Col>
          <Col sm={{ size: 4, order: 1 }}>
            <EditableField 
              name="Gesamt Rechnungs Betrag"
              placeholder="Gesamtrechnungsbetrag"
              value={calculateRTotals(guests, corrections, client['Belegart'])}
              disabled
            />
          </Col>
          <Col sm={{ size: 4, order: 1 }}>
            <EditableField 
              name="Darin enthaltene Umsatzsteuer"
              placeholder="Darin Enthaltene Umsatzsteuer"
              value={calculateTaxTotals(Belegart, guests, corrections)}
              disabled
            />
          </Col>
        </FormGroup>
        <Row className="row__button">
          <Col sm={{ size: 2, order: 1, offset: 10 }}>
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
  const { message, invoices } = clients;
  const id = props.match.params.id;
  const client = invoices && invoices[id];
  const guests =  client && client.transactions.filter(listing => listing && listing['Name des Gastes']);
  const corrections = client && client.transactions.filter(listing =>  listing && !listing['Name des Gastes']);
  const locked = invoices && invoices[id] && invoices[id].locked;
  return {
    client: client && { ...client},
    guests: client  && { ...guests},
    corrections: client && { ...corrections},
    message,
    locked,
  };
};

export default withRouter(connect(mapStateToProps)(Client));
