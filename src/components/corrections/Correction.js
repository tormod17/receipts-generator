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
      correctionsBelegart: selectedName,
      total: correction[`${selectedName} in €`],
      tax: true,
    }
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleCorrectionTypeChange = this.handleCorrectionTypeChange.bind(this)
  }

  componentWillReceiveProps(nextProps){
    const { correction } = nextProps;
    if(this.props.correction !== correction){
      const selectedName = correction['Rechnungskorrektur'] === 'X' ? 'Rechnungskorrektur' : 'Auszahlungskorrektur'
      this.setState({
        correction, 
        reason: correction['Sonstige Leistungsbeschreibung'],
        total: correction[`${selectedName} in €`],
      })
    }
  }

  addTax(id, e){
    const { total, correctionsBelegart, tax  } = this.state;
    const { updateFieldValue } = this.props;
    this.setState({
      tax: !tax
    })

    if (e.target.checked) {
      const taxTotal = ((total / 119 ) * 19).toFixed(2);
      updateFieldValue('tax', taxTotal, 'corrections', id )
    } else {
      updateFieldValue('tax', 0, 'corrections', id )      
    }
  }

  handleValueChange(name, value, id) {
    this.props.updateFieldValue(name, value, 'corrections', id)
  }

  handleCorrectionTypeChange(name, value, id){
    this.setState({
      correctionsBelegart: value
    })
  }

  handleTotalChange(name, value, id) {
    this.props.updateFieldValue(name, value, 'corrections', id)
    if (this.state.tax) {
      this.setState({
        total: value
      }, () => {
        if (this.state.correctionsBelegart === 'Auszahlungskorrektur') {
          console.log('add tax', this.state.correctionsBelegart);
          return this.props.updateFieldValue('tax', 0, 'corrections', id )
        }
        const taxTotal = ((this.state.total / 119 ) * 19).toFixed(2);
        this.props.updateFieldValue( 'tax', taxTotal, 'corrections', id)
      })
    }
  }

  render() {
    const { locked, correctionNumber, Belegart } = this.props;
    const { correctionsBelegart, correction, total, reason, tax } = this.state; 

    return (
      <div
        key={correctionNumber}
      >
        <FormGroup row>
          <Col className="col-4">
            <hr/>
            { Belegart === 'Rechnung' &&
              <Input                   
                placeholder="Rechnungskorrektur" 
                value="Rechnungskorrektur"
                disabled
              />
            }
            { Belegart !== 'Rechnung' &&
              <Dropdown
                disabled={locked}
                name="correctionsBelegart"
                data={correction}
                updateFieldValue={(name, val) => this.handleCorrectionTypeChange(name, val, correctionNumber)} 
                items={['Rechnungskorrektur', 'Auszahlungskorrektur']}
                selected={correctionsBelegart}
              />
            }
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
              name={`${correctionsBelegart} in €`}
              updateFieldValue={(name, val) => this.handleTotalChange(name, val, correctionNumber)} 
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
            { correctionsBelegart === 'Rechnungskorrektur'&&
            <InputGroup>
              <InputGroupAddon>
                <Input 
                  addon
                  name="tax" 
                  type="checkbox"
                  aria-label="Umsatzsteuer" 
                  onChange={(e) => this.addTax(correctionNumber, e)}
                  checked={tax}
                />
              </InputGroupAddon>
            
              <Input                   
                placeholder="Steuer hinzufügen" 
                value="Steuer hinzufügen"
              />
            </InputGroup>
            }
          </Col>
        </FormGroup>
      </div>
    )
  }  
}
