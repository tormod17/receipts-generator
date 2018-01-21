import React from 'react';
import { Col, FormGroup, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';
import EditableField from './../editableField/EditableField';

export default class Correction extends React.Component {
  
  static defaultProps = {
    updateFieldValue: PropTypes.func.isRequired,
    correction: PropTypes.shape([]),
  }

  static defaultProps = {
    corrections: [],
  }

  constructor(props) {
    super(props);
    const { correction } = props;
    const selectedName = correction['Rechnungskorrektur'] === 'X' ? 'Rechnungskorrektur' : 'Auszahlungskorrektur'
    this.state = {
      correction, 
      reason: correction['Sonstige Leistungsbeschreibung'],
      Belegart: selectedName,
      total: correction[`${selectedName} in €`]
    }
    this.handleValueChange = this.handleValueChange.bind(this)
  }

  componentWillReceiveProps(nextProps){
    const { correction } = nextProps;
    if(this.props.correction !== correction){
      const selectedName = correction['Rechnungskorrektur'] === 'X' ? 'Rechnungskorrektur' : 'Auszahlungskorrektur'
      this.setState({
        correction, 
        reason: correction['Sonstige Leistungsbeschreibung'],
        Belegart: selectedName,
        total: correction[`${selectedName} in €`]
      })
    }
  }

  addTax(){

  }

  handleValueChange(name, value, id) {
    if (name  === 'Belegart') {
      this.setState({
        Belegart: value
      })
    }
    this.props.updateFieldValue(name, value, 'corrections', id)
  }

  render() {
    const { locked, correctionNumber } = this.props;
    const { Belegart, correction, total, reason } = this.state; 

    return (
      <div
        key={correctionNumber}
      >
        <FormGroup row>
          <Col className="col-4">
            <hr/>
            <Dropdown
              disabled={locked}
              name="Belegart"
              data={correction}
              updateFieldValue={(name, val) => this.handleValueChange(name, val, correctionNumber)} 
              items={['Rechnungskorrektur', 'Auszahlungskorrektur']}
              selected={Belegart}
            />
          </Col>
          <Col className="col-4">
              <EditableField 
                disabled={locked}
                updateFieldValue={(name, val) => this.handleValueChange(name, val, correctionNumber)}                     
                name="Sonstige Leistungsbeschreibung"
                label="Anpassungs grund"
                placeholder="Anpassungs grund"
                value={reason} 
              />
          </Col>
          <Col className="col-3">
             <EditableField
              disabled={locked}
              name={`${Belegart} in €`}
              updateFieldValue={(name, val) => this.handleValueChange(name, val, correctionNumber)} 
              placeholder="Betrag"
              value={total}
            />
          </Col>
          <Col className="col-1">
            <br/>
            {!locked &&
              <i 
                class="fa fa-trash fa-2x"
                aria-hidden="true"
                onClick={() => this.props.handleDel(correctionNumber, 'corrections')}
              >
              </i>
            }
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 4, order: 1 }}>
            <InputGroup>
              <InputGroupAddon>
                <Input 
                  addon 
                  type="checkbox"
                  aria-label="Umsatzsteuer" 
                  onChange={() => this.addTax()}
                  //checked
                />
              </InputGroupAddon>
              <Input                   
                placeholder="Umsatzsteuer" 
              />
            </InputGroup>
          </Col>
        </FormGroup>
      </div>
    )
  }  
}
