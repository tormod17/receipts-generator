import React from 'react';
import { Col, FormGroup, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';
import EditableField from './../editableField/EditableField';
import { calculateTax } from '../../utils/apiUtils';
import { getText } from '../../language/';

export default class Correction extends React.Component {
  
  static defaultProps = {
    updateFieldValue: PropTypes.func.isRequired,
    correction: PropTypes.shape([]),
    id: PropTypes.string,
    invoiceType: PropTypes.string,
    type: PropTypes.string,
    reason: PropTypes.string,
    total: PropTypes.number,
    resetCorrection: PropTypes.func,  
    handleDel: PropTypes.func,
    correctionNumber: PropTypes.number,
    locked: PropTypes.bool,
  }

  static defaultProps = {
    type : getText("TRANS.CORR.INV.TITLE"),
    reason: '',
    total: 0,
  }

  constructor(props) {
    super(props);
    props.updateFieldValue('type', props.type, 'corrections', props.correctionNumber );   
    this.handleValueChange = this.handleValueChange.bind(this)
  }

  addTax(id, e){
    const { updateFieldValue, total } = this.props;
    const value =  e.target.checked ? calculateTax(total) : 0;
    updateFieldValue('Ust-Korrektur', value, 'corrections', id );
  }

  handleValueChange(name, value, id) {
    this.props.updateFieldValue(name, value, 'corrections', id)
  }

  handleTotalChange(name, value, id) {
    this.props.updateFieldValue(name, value, 'corrections', id);
    if (this.taxRef && !!this.taxRef.props.checked) {
      const tax = this.taxRef.props.checked;
      this.props.updateFieldValue('Ust-Korrektur', tax, 'corrections', id );  
    }
  }

  render() {
    const { locked, correctionNumber, type, reason, total, invoiceType,  tax } = this.props;
    return (
      <div
      >
        <FormGroup row>
          <Col className="col-4">
            <hr/>
            { locked && 
              <Input                   
                placeholder={type} 
                value={type}
                disabled
              />
            }
            { invoiceType === 'Rechnung' && !locked &&
              <Input                   
                placeholder={getText('TRANS.CORR.PAY.TITLE')} 
                value={getText('TRANS.CORR.INV.TITLE')}
                disabled
              />
            }
            { invoiceType !== 'Rechnung' && !locked &&
              <Dropdown
                disabled={locked}
                name="type"
                updateFieldValue={(name, val) =>  this.props.resetCorrection(val, correctionNumber)} 
                items={[ getText('TRANS.CORR.INV.TITLE'), getText('TRANS.CORR.PAYOUT.TITLE')]}
                selected={type}
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
              name="total"
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
            { type !== 'Auszahlungskorrektur' &&
            <InputGroup>
              <InputGroupAddon>
                <Input 
                  addon
                  name="tax" 
                  type="checkbox"
                  aria-label="Umsatzsteuer" 
                  onChange={(e) => this.addTax(correctionNumber, e)}
                  ref={input => this.taxRef = input}
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
