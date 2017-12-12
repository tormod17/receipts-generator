import React from 'react';
import { Grid, Col, Row, Label, Control, Form, FormGroup, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';

import EditableField from './../editableField/EditableField';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import { formatDate } from "../../utils/apiUtils";

import 'font-awesome/css/font-awesome.min.css';

export default class Customer extends React.Component {
  
  static defaultProps = {
    updateFieldValue: PropTypes.func.isRequired,
    customer: PropTypes.shape({}),
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { customer } = this.props;
    return (
      <div>
        <FormGroup row>
          <Col sm={{ size:5 }}>
            <br/>
            <Dropdown
              name="Auszahlung/Rechnung"
              items={[{ 
                  name:'Rechnung',
                  func: () => {},
                },{
                  name:'Auszahlung',
                  func: ()=> {},                  
                }]}
            />
          </Col>
          <Col sm={{ size:1, offset: 6}}>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <EditableField updateFieldValue={this.updateFieldValue}  name="Kunde" placeholder="Name des Kunden" value={customer.Kunde} />
          </Col>
          <Col>
            <EditableField updateFieldValue={this.updateFieldValue}  name="Rechnungsnummer" placeholder="Fortlaufende Rechnungsnummer" value={customer.Rechnungsnummer}/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col >
            <EditableField updateFieldValue={this.updateFieldValue} name="Straße" placeholder="Stadt" label="Adresse des Kunden" value={customer.Straße}/>
          </Col>
          <Col>
            <EditableField updateFieldValue={this.updateFieldValue} name="Stadt" placeholder="Stadt" nolabel value={customer.Stadt}/>
          </Col>
          <Col>
            <EditableField updateFieldValue={this.updateFieldValue} name="PLZ" placeholder="PLZ" nolabel value={customer.PLZ}/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>            
            <EditableField updateFieldValue={this.updateFieldValue} name="Kunden-nummer" placeholder="Kunden-nummer" value={customer['Kunden-nummer']}/>
          </Col>
          <Col>
          <Label for="Rechnungs-datum">Rechnungs-datum</Label>
            <InputGroupAddon>
              <DayPickerInput 
                name="Rechnungs-datum"
                onDayChange={(val) => this.updateFieldValue('rechnungsdatum', val )}
                value={formatDate(customer['Rechnungs-datum'])}
              />
            </InputGroupAddon>
          </Col>
        </FormGroup>
  
      </div>
    );
  }
}