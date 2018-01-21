import React from 'react';
import { Col, FormGroup, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';
import EditableField from './../editableField/EditableField';
import Correction from './Correction';

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
    this.state = {};
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
          <Correction 
            correction={corrections[key]}
            updateFieldValue={this.props.updateFieldValue}
            handleDel={this.props.handleDelCorrection}
            correctionNumber={key}
          />
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