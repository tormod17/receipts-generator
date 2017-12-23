import React from 'react';
import { Col, FormGroup, InputGroupAddon, Label } from 'reactstrap';
import PropTypes from "prop-types";

import EditableField from './../editableField/EditableField';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import { formatDate } from "../../utils/apiUtils";


export default class Customer extends React.Component {
  
  static defaultProps = {
    updateFieldValue: PropTypes.func.isRequired,
    client: PropTypes.shape({}).isRequired,
  }

  // static defaultProps = {
  //   client: undefined,
  // }

  constructor(props) {
    super(props);

    this.state = {
      client: {
        ...props.client
      }
    };
    this.handleValueChange = this.handleValueChange.bind(this);
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
    this.props.updateFieldValue(field, val, 'client')
  }

  render() {
    const { updateFieldValue } = this.props;
    const { client } = this.state;
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
              value={client.Kunde} 
              required
            />
          </Col>
          <Col>
            <EditableField 
              updateFieldValue={this.handleValueChange}
               name="Emailadresse" 
               placeholder="Emailadresse" 
               value={client.Emailadresse}
               required
            />
          </Col>
          <Col>
            <EditableField 
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
              updateFieldValue={this.handleValueChange}
              name="Kunden-nummer" 
              placeholder="Kunden-nummer" value={client['Kunden-nummer']}
              required
              />
          </Col>
          <Col>
          <Label for="Rechnungs-datum">Rechnungs-datum</Label>
            <InputGroupAddon>
              <DayPickerInput 
                name="Rechnungs-datum"
                onDayChange={(val) => this.handleValueChange('Rechnungs-datum', formatDate(val), 'client' )}
                value={client['Rechnungs-datum']}
                required
              />
            </InputGroupAddon>
          </Col>
        </FormGroup>
  
      </div>
    );
  }
}