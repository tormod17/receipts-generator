import React from 'react';
import { Col, FormGroup } from 'reactstrap';
import PropTypes from "prop-types";
import Correction from './Correction';

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
    const { corrections, locked, Belegart } = this.props;
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
            Belegart={Belegart}
            locked={locked}
          />
        )}
        { Object.keys(corrections).length === 0 &&
          <p> No korrektur </p>
        }
        <FormGroup row>
          <Col>
          {!locked &&
            <i 
              className="fa fa-plus fa-2x"
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