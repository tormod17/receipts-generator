import React from 'react';
import { Col, FormGroup, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';
import EditableField from './../editableField/EditableField';
import { calculateTax } from '../../utils/apiUtils';

const selectedName = (correction) => {
  return correction['Rechnungskorrektur'] === 'X' ? 'Rechnungskorrektur' : 'Auszahlungskorrektur'
}

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
    this.state = {
      correction, 
      reason: correction['Sonstige Leistungsbeschreibung'],
      correctionsBelegart: selectedName(correction),
      total: correction[`${selectedName(correction)} in €`],
      tax: true,
    }
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleCorrectionTypeChange = this.handleCorrectionTypeChange.bind(this)
  }

  componentDidMount(){
    const { total } = this.state;
    const { correctionNumber,  updateFieldValue } = this.props;
    updateFieldValue('Ust-Korrektur', calculateTax(total), 'corrections', correctionNumber)
  }

  componentWillReceiveProps(nextProps){
    const { correction } = nextProps;
    if(this.props.Belegart !== nextProps.Belegart){
      this.setState({
        correctionsBelegart: selectedName(correction),
      })
    }
  }

  addTax(id, e){
    const { total } = this.state;
    const { updateFieldValue } = this.props;
    this.setState({
      tax: e.target.checked
    })
    if (e.target.checked) {
      updateFieldValue('Ust-Korrektur', calculateTax(total), 'corrections', id )
    } else {
      updateFieldValue('Ust-Korrektur', 0, 'corrections', id )      
    }
  }

  handleValueChange(name, value, id) {
    this.props.updateFieldValue(name, value, 'corrections', id)
  }

  handleCorrectionTypeChange(name, value, id){
    this.setState({
      correctionsBelegart: value,
    }, () => {
      const newTotal = (value === 'Rechnungskorrektur') ? calculateTax(this.state.total) : 0;
      this.props.updateFieldValue('Ust-Korrektur', newTotal, 'corrections', id);
    }) 
  }

  handleTotalChange(name, value, id) {
    this.props.updateFieldValue(name, value, 'corrections', id)
    if (this.state.tax) {
      this.setState({
        total: value
      }, () => {
        if (this.state.correctionsBelegart === 'Auszahlungskorrektur') {
          return this.props.updateFieldValue('Ust-Korrektur', 0, 'corrections', id )
        }
        const taxTotal = calculateTax(this.state.total)
        this.props.updateFieldValue( 'Ust-Korrektur', taxTotal, 'corrections', id)
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
            { locked && 
              <Input                   
                placeholder={correctionsBelegart} 
                value={correctionsBelegart}
                disabled
              />
            }
            { Belegart === 'Rechnung' && !locked &&
              <Input                   
                placeholder="Rechnungskorrektur" 
                value="Rechnungskorrektur"
                disabled
              />
            }
            { Belegart !== 'Rechnung' && !locked &&
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
                className="fa fa-trash fa-2x"
                aria-hidden="true"
                onClick={() => this.props.handleDel(correctionNumber, 'corrections')}
              >
              </i>
            }
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 4, order: 1 }}>
            { correctionsBelegart !== 'Auszahlungskorrektur' &&
            <InputGroup>
              <InputGroupAddon>
                <Input 
                  addon
                  name="tax" 
                  type="checkbox"
                  aria-label="Umsatzsteuer" 
                  onChange={(e) => this.addTax(correctionNumber, e)}
                  checked={tax}
                  disabled={locked}
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
