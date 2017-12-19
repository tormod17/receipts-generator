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
import uuidv4 from 'uuid/v4';

import { addClient, getClient, updateClient } from "../../actions/clients";

import 'react-day-picker/lib/style.css';
import "./client.css";

class Client extends Component {

  static propTypes = {
    data: PropTypes.shape({})
  }

  static defaultProps ={
    data:{},
    customer: {},
  }

  constructor(props) {
    super(props)
    this.state ={
      customer: undefined,
      guests: {},
      corrections: {},
    }
    this.updateFieldValue = this.updateFieldValue.bind(this);    
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
    this.calculateTotals = this.calculateTotals.bind(this);
  }

  componentDidMount(){
    const { data } = this.props.clients;
    const id = this.props.match.params.id;
    if (id && data) {
      const customerNumber = data[id]['Kunden-nummer'];
      const allguests = Object.values(data || {}).filter( trans => customerNumber === trans['Kunden-nummer'])
      const correctionsList = allguests.filter(trans => trans['Auszhalungskorrektur'] || trans['Rechnungskorrektur'])
      console.log(allguests);
      const guests = allguests.reduce((p,c) => {
        p[c._id] = { ...c }
        return p;
      }, {})

      const corrections = correctionsList.reduce((p,c) => {
        p[c._id] = { ...c }
        return p;
      }, {})
      this.setState({
          customer: {
            ...allguests[0]
          },
          guests: {...guests },
          corrections: {...corrections },
      })
    }
  }

  calculateTotals(type) {
    const { guests } = this.state;
    const sum =Object.values(guests).reduce((a, b) => {
      let total;
      if(b[type] === 'X') {
        total = b['TOTAL PAID']
        return Number(total)
      }
    }, 0);
    return sum 
  }

  handleSubmission(){
    const { dispatch, auth, clients } = this.props;
    const clientId = this.props.match.params.id;
    const prevState = clients.data[clientId]
    
    const data  = {
      ...this.state,
    };
    if (clientId) {
      dispatch(updateClient(clientId, data), this.props.history.push('/'))
    } else {
      dispatch(addClient(auth.id, data), this.props.history.push('/'))
    }
  }

  handleAdd(type , obj){  
    const entries = this.state[type];
    const newId = uuidv4();
    this.setState({
      [type]: {
        ...entries,
        [newId]: {
          ...obj
        }
      }
    })
  }

  handleDel(key, type){
    const entries = { ...this.state[type] };
    const newEntries = Object.keys(entries).reduce((p,c) => {
       if (c !== key ){
        p[c] = { ...entries[c]}
       } 
       return p;
    }, {})
    
    this.setState({
      [type]: {
        ...newEntries,
      }
    })
  }

  updateFieldValue(field, value, type, id){
    if (id) {
      this.setState( prevSate => ({ 
        [type]: {
           ...prevSate[type],
          [id]: {
            ...prevSate[type][id],
            [field]: value,
          }
        } 
      }));
    } else if (type) {
        this.setState( prevState => ({
          [type]: {
            ...prevState[type],
            [field]: value,
          }
        }));
    } else  {
      this.setState( prevState => ({ [field]: value }));
    }
  }

  render() {
    const { customer, guests, corrections } = this.state;
    return (
    <Form clasName="bill">
        <FormGroup row>
          <Col sm={{ size:5 }}>
            <br/>
            <Dropdown
              data={customer}
              name="billType"
              items={['Rechnung', 'Auszahlung']}
              updateFieldValue={this.updateFieldValue} 
              selected={customer && customer['Rechnung'] === 'X' ? 'Rechnung' : 'Auszahlung'}

            />
          </Col>
          <Col sm={{ size:1, offset: 6}}>
            <i 
              style={{
                margin: '10px',
              }}
              class="fa fa-chevron-left fa-3x"
              aria-hidden="true"
              onClick={() => this.props.history.push('/')}
            />
          </Col>
        </FormGroup>
        <Customer 
          customer={customer}
          updateFieldValue={this.updateFieldValue} 
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
            <EditableField 
              //updateFieldValue={this.updateFieldValue}
              name="Gesamtumsatz Airgreets" 
              placeholder="Gesamt Auszahlungs Betrag"
              value={this.calculateTotals('Auszahlung')}
            />
          </Col>
          <Col sm={{ size: 4, order: 1 }}>
            <EditableField 
              //updateFieldValue={this.updateFieldValue}
              name="Auszahlung an Kunde"
              placeholder="Gesamt Rechnungs Betrag"
              value={this.calculateTotals('Rechnungs')}
            />
          </Col>
          <Col sm={{ size: 4, order: 1 }}>
            <EditableField 
              //updateFieldValue={this.updateFieldValue}
              name="Darin enthaltene Umsatzsteuer"
              placeholder="Darin Enthaltene Umsatzsteuer"
              //value={this.calculateTotals()}
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

const mapStateToProps = state => ({ ...state })


export default withRouter(connect(mapStateToProps)(Client));

