import React from 'react';
import { Col, Label, FormGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';
import EditableField from './../editableField/EditableField';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate } from '../../utils/apiUtils';
import uuidv4 from 'uuid/v4';


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
    const { updateFieldValue , guests, Belegart } = this.props;
    const typeKey = Belegart === 'Auszahlung' ? 'Auszahlung an Kunde' : 'Gesamtumsatz Airgreets';
    return (
    <div>
      <FormGroup>
        <h2>Geschäftsvorfall 1: Gastes</h2>
      </FormGroup>
      { guests && Object.keys(guests).map(key => {
        const locked = guests[key].locked
        console.log(locked);
        return (
        <div
          key={guests[key]._id}
          >
          <FormGroup row>
            <Col>
              <EditableField
                disabled={locked} 
                updateFieldValue={(name, val) => this.handleValueChange(name, val, key)} 
                name="Name des Gastes"
                placeholder="Name des Gastes"
                value={guests[key]["Name des Gastes"]}
                required
              />
            </Col>
            <Col>
              <Label for="Anreisedatum">Anreise-datum</Label>
              <InputGroupAddon>
                <DayPickerInput 
                  name="Anreisedatum"
                  onDayChange={(val) =>
                    this.handleValueChange('Anreisedatum', formatDate(val) , key)
                  }
                  value={guests[key].Anreisedatum}
                  disabled={locked}
                  required
                />
              </InputGroupAddon>
            </Col>
            <Col >
              <Label for="Abreisedatum">Abreise-datum</Label>
              <InputGroupAddon>
                <DayPickerInput 
                  name="Abreisedatum (Leistungsdatum)"
                  onDayChange={val => 
                    this.handleValueChange('Abreisedatum (Leistungsdatum)', formatDate(val), key )
                  }
                  value={guests[key]['Abreisedatum (Leistungsdatum)']}
                  disabled={locked}
                  required
                />
              </InputGroupAddon>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col>
              <EditableField
                disabled={locked} 
                updateFieldValue={(name, val) => this.handleValueChange(name, val, key)} 
                name="Airgreets Service Fee (€)"
                placeholder="Airgreets Service Fee (€)"
                value={guests[key]['Airgreets Service Fee (€)']}
                required
              />
            </Col>
            <Col>
              <EditableField
                disabled={locked}
                name="Reinigungs-gebühr"
                updateFieldValue={(name, val) => 
                  this.handleValueChange(name, val, key)
                } 
                required
                placeholder="Reinigungs-gebühr"
                value={guests[key]["Reinigungs-gebühr"]} 
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col>
              <EditableField
                disabled={locked} 
                updateFieldValue={(name, val) => this.handleValueChange(name, val, key)} 
                name={typeKey}
                placeholder={typeKey}
                value={guests[key][typeKey]}
                required
              />
            </Col>
            <Col>
              <EditableField
                disabled={locked} 
                updateFieldValue={(name, val) => this.handleValueChange(name, val, key)} 
                name="Airbnb Einkommen"
                placeholder="Airbnb Einkommen"
                value={guests[key]["Airbnb Einkommen"]}
                required
              />
            </Col>
            <Col>
              <br/>
              <i 
                class="fa fa-trash fa-3x"
                aria-hidden="true"
                onClick={() => this.props.handleDelGuest(key, 'guests')}
                id={guests[key]._id}
                required
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