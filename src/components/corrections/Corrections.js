import React from 'react';
import { Col, FormGroup, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';
import EditableField from './../editableField/EditableField';

//import uuidv4 from 'uuid/v4';

// const corr = {
//   'billType': null,
//   'Sonstige Leistungsbeschreibung': null,
//   'Auszahlungskorrektur in €': null,
//   'Rechnungskorrektur in €': null,
//   'Ust-Korrektur': null,
//   'correctionId': uuidv4(),
// };

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
      Belegart: 'Auszahlungskorrektur in €'
    };
    this.handleValueChange = this.handleValueChange.bind(this)
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
    const { corrections, locked } = this.props;
 
    return (
      <div>
        <FormGroup row>
          <Col>
            <h5>Geschäftsvorfall 2: korrektur</h5>
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
                  disabled={locked}
                  name="Belegart"
                  data={corrections[key]}
                  updateFieldValue={(name, val) => this.handleValueChange(name, val, key)} 
                  items={['Rechnungskorrektur in €', 'Auszahlungskorrektur in €']}
                  selected={corrections[key]['Rechnung'] === 'X' ? 'Rechnung' : 'Auszahlung'}
                />
              </Col>
              <Col className="col-4">
                  <EditableField 
                    disabled={locked}
                    updateFieldValue={(name, val) => this.handleValueChange(name, val, key)}                     
                    name="Sonstige Leistungsbeschreinung"
                    label="Anpassungs grund"
                    placeholder="Anpassungs grund"
                    value={corrections[key]['Sonstige Leistungsbeschreinung']} 
                  />
              </Col>
              <Col className="col-3">
                 <EditableField
                  disabled={locked}
                  name={this.state.Belegart}
                  updateFieldValue={(name, val) => this.handleValueChange(name, val, key)} 
                  placeholder="Betrag"
                  value={corrections[key][this.state.Belegart]}
                />
              </Col>
              <Col className="col-1">
                <br/>
                {!locked &&
                  <i 
                    class="fa fa-trash fa-2x"
                    aria-hidden="true"
                    onClick={() => this.props.handleDelCorrection(key, 'corrections')}
                    id={corrections[key]['correctionId']}
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
       )}
        { Object.keys(corrections).length === 0 &&
          <p> No korrektur </p>
        }
        <FormGroup row>
          <Col>
          {!locked &&
            <i 
              class="fa fa-plus fa-2x"
              aria-hidden="true"
              onClick={() => this.props.handleAddCorrection('corrections', corrections)}
            ></i>
          }
          </Col>
        </FormGroup>
      </div>
    );
  }
}