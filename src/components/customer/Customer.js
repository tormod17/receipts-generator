import React from 'react';
import { Col, FormGroup, InputGroupAddon, Label } from 'reactstrap';
import PropTypes from "prop-types";

import EditableField from './../editableField/EditableField';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import { formatDate } from "../../utils/apiUtils";


export default class Customer extends React.Component {
  
  static defaultProps = {
    updateFieldValue: PropTypes.func.isRequired,
    customer: PropTypes.shape({}),
  }

  constructor(props) {
    super(props);

    this.state = {};
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(field, val) {
    this.props.updateFieldValue(field, val, 'customer')

  }

  render() {
    const { customer, updateFieldValue } = this.props;

    return (
      <div>
        <FormGroup>
          <h2>Kunde</h2>
        </FormGroup>
        <FormGroup row>
          <Col>
            <EditableField 
              updateFieldValue={this.handleValueChange}
              name="Kunde" 
              placeholder="Name des Kunden" 
              value={customer.Kunde} 
              required
            />
          </Col>
          <Col>
            <EditableField 
              updateFieldValue={this.handleValueChange}
               name="Emailadresse" 
               placeholder="Emailadresse" 
               value={customer.Emailadresse}
               required
            />
          </Col>
          <Col>
            <EditableField 
              updateFieldValue={this.handleValueChange}
              name="Rechnungsnummer" 
              placeholder="Fortlaufende Rechnungsnummer" 
              value={customer.Rechnungsnummer}
              required
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col >
            <EditableField 
              updateFieldValue={this.handleValueChange}
              name="Straße" 
              placeholder="Straße" 
              label="Adresse des Kunden" 
              value={customer.Straße}
              required
              />
          </Col>
          <Col>
            <EditableField 
              updateFieldValue={this.handleValueChange}
              name="Stadt" 
              placeholder="Stadt" 
              nolabel 
              value={customer.Stadt}
              required
              />
          </Col>
          <Col>
            <EditableField 
              updateFieldValue={this.handleValueChange}
              name="PLZ" 
              placeholder="PLZ" 
              nolabel 
              value={customer.PLZ}
              required
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>            
            <EditableField 
              updateFieldValue={this.handleValueChange}
              name="Kunden-nummer" 
              placeholder="Kunden-nummer" value={customer['Kunden-nummer']}
              required
              />
          </Col>
          <Col>
          <Label for="Rechnungs-datum">Rechnungs-datum</Label>
            <InputGroupAddon>
              <DayPickerInput 
                name="Rechnungs-datum"
                onDayChange={(val) => this.handleValueChange('Rechnungs-datum', val, 'customer' )}
                value={formatDate(customer['Rechnungs-datum'])}
                required
              />
            </InputGroupAddon>
          </Col>
        </FormGroup>
  
      </div>
    );
  }
}