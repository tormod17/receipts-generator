import React from 'react';
import { Grid, Col, Row, Label, Control, Form, FormGroup, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';
import EditableField from './../editableField/EditableField';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate } from '../../utils/apiUtils';
import uuidv4 from 'uuid/v4';


import 'font-awesome/css/font-awesome.min.css';

const guest = {
  Abreisedatum: null,
  Anreisedatum: null,
  'TOTAL PAID': null,
  'Name des Gastes': null,
  'CLEANING FARE': null,
  'Airgreets Service Fee (€)': null,
  'guestId': uuidv4(),
};

export default class Guests extends React.Component {
  
  static defaultProps = {
    updateFieldValue: PropTypes.func.isRequired,
    guests: PropTypes.shape({}),
  }

  static defaultProps = {
    guests: undefined,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleValueChange = this.handleValueChange.bind(this)
  }

  handleValueChange(name, value, id) {
    this.props.updateFieldValue(name, value, 'guests', id)
  }

  render() {
    const { updateFieldValue , guests } = this.props;
    return (
    <div>
      <FormGroup>
        <h2>Geschäftsvorfall 1: Gastes</h2>
      </FormGroup>
      { guests && Object.keys(guests).map(key => {
        return (
        <div
          key={guests[key].guestId}
        >
          <FormGroup row>
            <Col  sm={{ size: 6, order: 1 }}>
              <EditableField 
                updateFieldValue={(name, val) => this.handleValueChange(name, val, key)} 
                name="Name des Gastes"
                placeholder="Name des Gastes"
                value={guests[key]["Name des Gastes"]}
              />
            </Col>
            <Col sm={{ size: 3, order: 1 }}>
              <EditableField 
                updateFieldValue={(name, val) => this.handleValueChange(name, val, key)} 
                name="Airgreets Service Fee (€)"
                placeholder="Airgreets Service Fee (€)"
                value={guests[key]['Airgreets Service Fee (€)']}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={{ size: 6, order: 1 }}>
              <Label for="Anreisedatum">Anreise-datum</Label>
              <InputGroupAddon>
                <DayPickerInput 
                  name="Anreisedatum"
                  onDayChange={(val) =>
                    this.handleValueChange('Anreisedatum', formatDate(val) ,key )
                  }
                  value={guests[key].Anreisedatum}
                />
              </InputGroupAddon>
            </Col>
            <Col sm={{ size: 3, order: 1 }}>
              <EditableField
                name="CLEANING FARE"
                updateFieldValue={(name, val) => 
                  this.handleValueChange(name, val, key)
                } 
                placeholder="Reinigungs-gebühr"
                value={guests[key]["CLEANING FARE"]} 
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={{ size: 6, order: 1 }}>
              <Label for="Abreisedatum">Abreise-datum</Label>
              <InputGroupAddon>
                <DayPickerInput 
                  name="Abreisedatum"
                  onDayChange={val => 
                    this.handleValueChange('Abreisedatum', formatDate(val), key )
                  }
                  value={guests[key].Abreisedatum}
                />
              </InputGroupAddon>
            </Col>
            <Col sm={{ size: 3, order: 1 }}>
              <EditableField 
                updateFieldValue={(name, val) => this.handleValueChange(name, val, key)} 
                name="TOTAL PAID"
                placeholder="Auszahlung"
                value={guests[key]["TOTAL PAID"]}
              />
            </Col>
            <Col sm={{ size: 1, order: 1 }}>
              <br/>
              <i 
                class="fa fa-trash fa-3x"
                aria-hidden="true"
                onClick={() => this.props.handleDelGuest(key, 'guests')}
                id={guests[key]['guestId']}
              >
              </i>
            </Col>
          </FormGroup>
          <hr/>
      </div>
    )})}
      { Object.keys(guests).length === 0 &&
        <div>
          <p>No Gastes</p>
        </div>
      }
      <FormGroup row>
        <Col>
          <i 
            class="fa fa-plus fa-3x"
            aria-hidden="true"
            onClick={() => this.props.handleAddGuest('guests', guests)}
          >
          </i>
        </Col>
      </FormGroup>
    </div>
    );
  }
}