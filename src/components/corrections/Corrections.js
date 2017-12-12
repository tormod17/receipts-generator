import React from 'react';
import { Grid, Col, Row, Label, Control, Form, FormGroup, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';
import EditableField from './../editableField/EditableField';
import 'font-awesome/css/font-awesome.min.css';


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
    this.state = {
      corrections: [ ...props.corrections],
    };
    this.handleAddCorrection = this.handleAddCorrection.bind(this);
    this.handleDelCorrection = this.handleDelCorrection.bind(this);
  }

  handleAddCorrection(){  
    const  { corrections } = this.state;
    const corr = {
      type: null,
      'Sonstige Leistungsbeschreibung': null,
      'Auszahlungskorrektur in €': null,
      'Rechnungskorrektur in €': null,
      'Ust-Korrektur': null,
      'correctionId': 55 + corrections.length,
      'customerNumber': '12343',
    };
    const newArr = [];
    newArr.push(corr)
    this.setState({
      corrections: [
        ...corrections,
        ...newArr,
      ]
    })
  }

  handleDelCorrection(e){
    const id = e.target.getAttribute('id');
    const { corrections } = this.state;
    const newCorr = corrections.filter(c => c['correctionId'] !== Number(id));
    this.setState({
      corrections: [...newCorr],
    })
  }


  render() {
    const { corrections } = this.state;
    const noCorrections = corrections.length === 0
    return (
      <div>
        <FormGroup row>
          <Col>
            <h2>Geschäftsvorfall 2: korrektur</h2>
          </Col>
        </FormGroup>
        { corrections && corrections.map(correction =>
          <div>
            <FormGroup row>
              <Col className="col-4">
                <hr/>
                <Dropdown
                  name="Rechnungskorrektur/Auszahlungskorrektur"
                  items={[{ 
                      name:'Rechnungskorrektur',
                      func: () => {},
                    },{
                      name:'Auszahlungskorrektur',
                      func: ()=> {},                  
                    }]}
                />
              </Col>
              <Col className="col-4">
                  <EditableField 
                    updateFieldValue={this.updateFieldValue}
                    name="Anpassungs-grund"
                    placeholder="Anpassungs grund"
                    value={correction['Sonstige Leistungsbeschreibung']} 
                  />
              </Col>
              <Col className="col-3">
                 <EditableField
                  updateFieldValue={this.updateFieldValue}
                  placeholder="Betrag"
                  value={correction['Rechnungskorrektur in €'] || correction['Auszahlungskorrektur in €']}
                />
              </Col>
              <Col className="col-1">
                <br/>
                <i 
                  class="fa fa-trash fa-3x"
                  aria-hidden="true"
                  onClick={this.handleDelCorrection}
                  id={correction['correctionId']}
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
       { noCorrections &&
          <p> No korrektur </p>
       }
        <FormGroup row>
          <Col>
            <i class="fa fa-plus fa-3x" aria-hidden="true" onClick={this.handleAddCorrection}></i>
          </Col>
        </FormGroup>
      </div>
    );
  }
}