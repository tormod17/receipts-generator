import React from 'react';
import { Col, FormGroup } from 'reactstrap';
import PropTypes from "prop-types";
import Correction from './Correction';
import { getText } from '../../language/';

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
            key={corrections[key]._id}
            id={corrections[key]._id}
            invoiceType={Belegart}
            type={corrections[key].type}
            reason={corrections[key][getText('TRANS.CORR.REASON')]}
            tax={corrections[key].tax || corrections[key]['Ust-Korrektur']}
            total={corrections[key].total}
            correctionNumber={key}
            Belegart={Belegart}
            locked={locked}
            updateFieldValue={this.props.updateFieldValue}
            resetCorrection={this.props.resetCorrection}
            handleDel={this.props.handleDelCorrection}
     
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