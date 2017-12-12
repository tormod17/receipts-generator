import React from 'react';
import { Grid, Col, Row, Label, Control, Form, FormGroup, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';
import EditableField from './../editableField/EditableField';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import 'font-awesome/css/font-awesome.min.css';

export default class Transactions extends React.Component {
  
  static defaultProps = {
    updateFieldValue: PropTypes.func.isRequired,
    trans: PropTypes.shape({}),
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { trans } = this.props;
    return (
    <div>
      <FormGroup row>
        <Col  sm={{ size: 6, order: 1 }}>
          <EditableField updateFieldValue={this.updateFieldValue} name="Name des Gastes" placeholder="Name des Gastes" value={trans["Name des Gastes"]}/>
        </Col>
        <Col sm={{ size: 6, order: 1 }}>
          <EditableField 
            updateFieldValue={this.updateFieldValue}  
            name="Airgreets Service Fee (€)"
            placeholder="Airgreets Service Fee (€)"
            value={trans['Airgreets Service Fee (€)']}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col sm={{ size: 6, order: 1 }}>
          <Label for="Anreisedatum">Anreise-datum</Label>
          <InputGroupAddon>
            <DayPickerInput 
              name="Anreisedatum"
              onDayChange={(val) => this.updateFieldValue('Anreisedatum', val )}
              value={trans.Anreisedatum}
            />
          </InputGroupAddon>
        </Col>
        <Col sm={{ size: 6, order: 1 }}>
          <EditableField name="CLEANING FARE" updateFieldValue={this.updateFieldValue} placeholder="Reinigungs-gebühr" value={trans["CLEANING FARE"]} />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col sm={{ size: 6, order: 1 }}>
          <Label for="Abreisedatum">Abreise-datum</Label>
          <InputGroupAddon>
            <DayPickerInput 
              name="Abreisedatum"
              onDayChange={val => this.updateFieldValue('Abreisedatum', val )}
              value={trans.Abreisedatum}
            />
          </InputGroupAddon>
        </Col>
        <Col sm={{ size: 6, order: 1 }}>
          <EditableField updateFieldValue={this.updateFieldValue} name="TOTAL PAID"  placeholder="Auszahlung" value={trans["TOTAL PAID"]}/>
        </Col>
      </FormGroup>
      <FormGroup row>
      
      </FormGroup>
      <FormGroup row>
      
      </FormGroup>
      <FormGroup row>
      
      </FormGroup>
      <hr/>
    </div>
    );
  }
}