import React from 'react';
import { Grid, Col, Row, Label, Control, Form, FormGroup, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';
import EditableField from './../editableField/EditableField';
import uuidv4 from 'uuid/v4';

import 'font-awesome/css/font-awesome.min.css';


const corr = {
  'billType': null,
  'Sonstige Leistungsbeschreibung': null,
  'Auszahlungskorrektur in €': null,
  'Rechnungskorrektur in €': null,
  'Ust-Korrektur': null,
  'correctionId': uuidv4(),
};

export default class Corrections extends React.Component {
  
  static defaultProps = {
    updateFieldValue: PropTypes.func.isRequired,
    corrections: PropTypes.shape([]),
  }

  static defaultProps = {
    corrections: [],
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.handleValueChange = this.handleValueChange.bind(this)
  }

  handleValueChange(name, value, id) {
    this.props.updateFieldValue(name, value, 'corrections', id)
  }

  render() {
    const {  } = this.state;
    const { updateFieldValue, corrections } = this.props;
 
    return (
      <div>
        <FormGroup row>
          <Col>
            <h2>Geschäftsvorfall 2: korrektur</h2>
          </Col>
        </FormGroup>
        { corrections && Object.keys(corrections).map(key =>
          <div
            key={corrections[key].correctionId}
          >
            <FormGroup row>
              <Col className="col-4">
                <hr/>
                <Dropdown
                  name="correctionType"
                  data={corrections[key]}
                  updateFieldValue={(name, val) => this.handleValueChange(name, val, key)} 
                  items={[{ 
                      name:'Rechnungskorrektur in €',
                    },{
                      name:'Auszahlungskorrektur in €',
                    }]}
                />
              </Col>
              <Col className="col-4">
                  <EditableField 
                    updateFieldValue={(name, val) => this.handleValueChange(name, val, key)}                     
                    name="Anpassungs-grund"
                    placeholder="Anpassungs grund"
                    value={corrections[key]['Sonstige Leistungsbeschreibung']} 
                  />
              </Col>
              <Col className="col-3">
                 <EditableField
                  name="Auszahlungskorrektur in €"
                  updateFieldValue={(name, val) => this.handleValueChange(name, val, key)} 
                  placeholder="Betrag"
                  value={corrections[key]['Rechnungskorrektur in €'] || corrections[key]['Auszahlungskorrektur in €']}
                />
              </Col>
              <Col className="col-1">
                <br/>
                <i 
                  class="fa fa-trash fa-3x"
                  aria-hidden="true"
                  onClick={() => this.props.handleDelCorrection(key, 'corrections')}
                  id={corrections[key]['correctionId']}
                >
                </i>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 4, order: 1 }}>
                <InputGroup>
                  <InputGroupAddon>
                    <Input addon type="checkbox" aria-label="Umsatzsteuer" />
                  </InputGroupAddon>
                  <Input placeholder="Umsatzsteuer" />
                </InputGroup>
              </Col>
            </FormGroup>
          </div>
       )}
        { Object.keys(corrections).length === 0 &&
          <p> No korrektur </p>
        }
        <FormGroup row>
          <Col>
            <i 
              class="fa fa-plus fa-3x"
              aria-hidden="true"
              onClick={() => this.props.handleAddCorrection('corrections',corr)}
            ></i>
          </Col>
        </FormGroup>
      </div>
    );
  }
}