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

const TIMESTAMP = new Date().getTime();

export default class Guest extends React.Component {
  
  static defaultProps = {
    updateFieldValue: PropTypes.func.isRequired,
    guest: PropTypes.shape({}),
  }

  static defaultProps = {
    guests: undefined,
  }

  constructor(props) {
    super(props);
    const  { guest, Belegart } = props;
    this.state = {
      ...guest,
      Belegart,
    };
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleIncomeChange = this.handleIncomeChange.bind(this)
    this.handServiceChange = this.handleServiceChange.bind(this)
  }

  componentWillReceiveProps(nextProps){
    const { guests } = nextProps;
    if(this.props !== nextProps){
      this.setState({
        ...nextProps.guest,
        Belegart: nextProps.Belegart
      })
    }
  }

  handleValueChange(name, value, id) {
    this.props.updateFieldValue(name, value, 'guests', id)
  }

  handleIncomeChange(name, value, id) {
    const newTotal = Number(value || 0) - Number(this.state['Gesamtumsatz Airgreets'] || 0) +'';
    this.setState({
      ['Auszahlung an Kunde']: newTotal,
      [name]: value
    }, this.props.updateFieldValue("Auszahlung an Kunde", newTotal, 'guests', id))
    this.props.updateFieldValue(name, value, 'guests', id)
  }

  handleServiceChange(name, value, id) {
    /// updates its self and updates the total.
    const oppKey = (name === "Airgreets Service Fee (€)" ) ? "Reinigungs-gebühr" : "Airgreets Service Fee (€)";
    const newTotal = Number(value || 0)  + Number(this.state[oppKey] || 0) + '';
    const newCustomerTotal = (Number(this.state["Airbnb Einkommen"] || 0) - Number(newTotal || 0) )+ '';
    this.setState({
      ['Gesamtumsatz Airgreets']: newTotal,
      ["Auszahlung an Kunde"]: newCustomerTotal,
      [name]: value
    },() => {
      this.props.updateFieldValue("Gesamtumsatz Airgreets", newTotal, 'guests', id)
      this.props.updateFieldValue("Auszahlung an Kunde", newCustomerTotal, 'guests', id)
    })
    this.props.updateFieldValue(name, value, 'guests', id)
  }

  render() {
    const { updateFieldValue, Belegart, locked, guestNumber } = this.props;

    return (
        <div
          key={this.state._id}
          >
          <FormGroup row>
            <Col>
              <EditableField
                disabled={locked} 
                updateFieldValue={(name, val) => this.handleValueChange(name, val, guestNumber)} 
                name="Name des Gastes"
                placeholder="Name des Gastes"
                value={this.state["Name des Gastes"]}
                required
              />
            </Col>
            <Col>
              <Label for="Anreisedatum">Anreise-datum</Label>
              <InputGroupAddon>
                <DayPickerInput 
                  value={`${formatDate(new Date(this.state.Anreisedatum || TIMESTAMP), 'LL', 'de')}` }
                  formatDate={formatDate}
                  parseDate={parseDate}
                  format="LL"
                  placeholder={`${formatDate(new Date(this.state.Anreisedatum || TIMESTAMP), 'LL', 'de')}`}
                  dayPickerProps={{
                    locale: 'de',
                    localeUtils: MomentLocaleUtils
                  }}
                  name="Anreisedatum"
                  onDayChange={(val) =>
                    this.handleValueChange('Anreisedatum', val, guestNumber)
                  }
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
                  value={`${formatDate(new Date(this.state['Abreisedatum (Leistungsdatum)'] || TIMESTAMP), 'LL', 'de')}`}
                  formatDate={formatDate}
                  parseDate={parseDate}
                  format="LL"
                  placeholder={`${formatDate(new Date(this.state['Abreisedatum (Leistungsdatum)'] || TIMESTAMP), 'LL', 'de')}`}
                  dayPickerProps={{
                    locale: 'de',
                    localeUtils: MomentLocaleUtils
                  }}
                  onDayChange={val => 
                    this.handleValueChange('Abreisedatum (Leistungsdatum)', val, guestNumber )
                  }
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
                updateFieldValue={(name, val) => 
                  this.handleServiceChange(name, val, guestNumber)
                } 
                name="Airgreets Service Fee (€)"
                placeholder="Airgreets Service Fee (€)"
                value={this.state['Airgreets Service Fee (€)']}
                required
              />
            </Col>
            <Col>
              <EditableField
                disabled={locked}
                name="Reinigungs-gebühr"
                updateFieldValue={(name, val) => 
                  this.handleServiceChange(name, val, guestNumber)
                } 
                required
                placeholder="Reinigungs-gebühr"
                value={this.state["Reinigungs-gebühr"]} 
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col>
              <EditableField
                disabled={locked} 
                updateFieldValue={(name, val) => this.handleIncomeChange(name, val, guestNumber)} 
                name="Airbnb Einkommen"
                placeholder="Airbnb-Einkommen"
                value={this.state["Airbnb Einkommen"]}
                required
              />
            </Col>
            <Col>
              <EditableField
                disabled 
                updateFieldValue={(name, val) => this.handleValueChange(name, val, guestNumber)} 
                name="Gesamtumsatz Airgreets"
                placeholder="Gesamtumsatz Airgreets"
                value={this.state["Gesamtumsatz Airgreets"]}
                required
              />
            </Col>
            <Col>
             { Belegart === "Auszahlung" &&
                <EditableField
                  disabled 
                  updateFieldValue={(name, val) => this.handleValueChange(name, val, guestNumber)} 
                  name="Auszahlung an Kunde"
                  placeholder="Auszahlung an Kunde"
                  value={this.state["Auszahlung an Kunde"]}
                  required
                />
              }
            </Col>
            <Col>
              <br/>
              {!locked &&
                <i 
                  className="fa fa-trash fa-2x"
                  aria-hidden="true"
                  onClick={() => this.props.handleDelGuest(guestNumber, 'guests')}
                  id={this.state._id}
                  required
                >
                </i>
              }
            </Col>
          </FormGroup>
          <hr/>
      </div>
    );
  }
}