import React from 'react';
import { Col, Label, FormGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';
import EditableField from './../editableField/EditableField';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
  formatDate,
  parseDate
} from 'react-day-picker/moment';
import 'moment/locale/de';
//import { formatDate } from '../../utils/apiUtils';
import uuidv4 from 'uuid/v4';

import Guest from './Guest.js';

const TIMESTAMP = new Date().getTime();

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
    const { updateFieldValue , guests, Belegart, locked } = this.props;
    return (
    <div>
      <FormGroup>
        <h5>Geschäftsvorfall 1: Gastes</h5>
      </FormGroup>
      { guests && Object.keys(guests).map(key => {
        return(
          <Guest
            guestNumber={key}
            Belegart={Belegart}
            locked={locked}
            guest={guests[key]} 
            updateFieldValue={updateFieldValue}
            handleDelGuest={this.props.handleDelGuest}
          />
        )
      })}
      { Object.keys(guests).length === 0 &&
        <div>
          <p>No Gastes</p>
        </div>
      }
      <FormGroup row>
        <Col>
          {!locked &&
            <i 
            class="fa fa-plus fa-2x"
            aria-hidden="true"
            onClick={() => this.props.handleAddGuest('guests', guests)}
            >
            </i>
          }
        </Col>
      </FormGroup>
    </div>
    );
  }
}