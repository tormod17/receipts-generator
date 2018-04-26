import React from 'react';
import { Col, FormGroup, InputGroupAddon, Label } from 'reactstrap';
import PropTypes from "prop-types";

import EditableField from './../editableField/EditableField';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import MomentLocaleUtils, {
  formatDate,
  parseDate
} from 'react-day-picker/moment';
import 'moment/locale/de';

const TIMESTAMP = new Date().getTime();


export default class Customer extends React.Component {
  
  static defaultProps = {
    updateFieldValue: PropTypes.func.isRequired,
    client: PropTypes.shape({}).isRequired,
  }

  constructor(props) {
    super(props);
    const { client } = props;
    this.state = {
      client: {
        ...client
      }
    };
    this.handleValueChange = this.handleValueChange.bind(this);
    const date = `${formatDate(new Date(Number(client['Rechnungsdatum']) || TIMESTAMP), 'LL', 'de')}`;
    props.updateFieldValue('Rechnungsdatum', date, 'client');
  }

  componentWillReceiveProps(nextProps) {
    if(this.props !== nextProps ){
      this.setState({
        client: {
          ...nextProps.client
        }
      })
    }
  }

  handleValueChange(field, val) {
    this.props.updateFieldValue(field, val, 'client');
  }

  render() {
    const { locked } = this.props;
    const { client } = this.state;

    return (
      <div>
        <FormGroup>
          <h5>Kunde</h5>
        </FormGroup>
        <FormGroup row>
          <Col>
            <EditableField
              disabled={locked} 
              updateFieldValue={this.handleValueChange}
              name="Kunde" 
              placeholder="Name des Kunden" 
              value={client.Kunde} 
              required
            />
          </Col>
          <Col>
            <EditableField
              disabled={locked} 
              updateFieldValue={this.handleValueChange}
              name="Emailadresse" 
              placeholder="Emailadresse" 
              value={client.Emailadresse}
              required
            />
          </Col>
          <Col>
            <EditableField
              disabled={locked} 
              updateFieldValue={this.handleValueChange}
              name="Rechnungsnummer" 
              placeholder="Fortlaufende Rechnungsnummer" 
              value={client.Rechnungsnummer}
              required
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col >
            <EditableField
              disabled={locked} 
              updateFieldValue={this.handleValueChange}
              name="Straße" 
              placeholder="Straße" 
              label="Adresse des Kunden" 
              value={client.Straße}
              required
              />
          </Col>
          <Col>
            <EditableField
              disabled={locked} 
              updateFieldValue={this.handleValueChange}
              name="Stadt" 
              placeholder="Stadt" 
              nolabel 
              value={client.Stadt}
              required
              />
          </Col>
          <Col>
            <EditableField
              disabled={locked} 
              updateFieldValue={this.handleValueChange}
              name="PLZ" 
              placeholder="PLZ" 
              nolabel 
              value={client.PLZ}
              required
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>            
            <EditableField
              disabled={locked} 
              updateFieldValue={this.handleValueChange}
              name="Kundennummer" 
              placeholder="Kundennummer" 
              value={client['Kundennummer']}
              required
              />
          </Col>
          <Col>
          <Label for="Rechnungsdatum">Rechnungsdatum</Label>
            <InputGroupAddon>
              <DayPickerInput 
                value={`${formatDate(new Date(Number(client['Rechnungsdatum'])|| TIMESTAMP), 'LL', 'de')}`}
                formatDate={formatDate}
                parseDate={parseDate}
                format="LL"
                placeholder={`${formatDate(new Date(Number(client['Rechnungsdatum']) || TIMESTAMP), 'LL', 'de')}`}
                dayPickerProps={{
                  locale: 'de',
                  localeUtils: MomentLocaleUtils
                }}
                name="Rechnungsdatum"
                onDayChange={(val) =>
                  this.handleValueChange('Rechnungsdatum', val, 'client')
                }
                required
              />
            </InputGroupAddon>
          </Col>
        </FormGroup>
  
      </div>
    );
  }
}