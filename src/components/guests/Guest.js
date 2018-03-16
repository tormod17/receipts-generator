import React from 'react';
import { Col, Label, FormGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import PropTypes from "prop-types";
import Dropdown from './../dropdown/Dropdown';
import EditableField from './../editableField/EditableField';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
  formatDate,
  parseDate
} from 'react-day-picker/moment';
import 'moment/locale/de';
import uuidv4 from 'uuid/v4';
import { getText } from '../../language/';


const TIMESTAMP = new Date().getTime();

export default class Guest extends React.Component {
  
  static defaultProps = {
    updateFieldValue: PropTypes.func.isRequired,
    guest: PropTypes.shape({}),
  }

  static defaultProps = {
    guests: undefined,
  }

  constructor(props) {
    super(props);
    const  { guest, Belegart } = props;
    this.state = {
      ...guest,
      Belegart,
    };
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleIncomeChange = this.handleIncomeChange.bind(this)
    this.handServiceChange = this.handleServiceChange.bind(this)
  }

  componentWillReceiveProps(nextProps){
    const { guests } = nextProps;
    if(this.props !== nextProps){
      this.setState({
        ...nextProps.guest,
        [getText("TRANS.TYPE")]: nextProps.Belegart
      })
    }
  }

  handleValueChange(name, value, id) {
    this.props.updateFieldValue(name, value, 'guests', id)
  }

  handleIncomeChange(name, value, id) {
    const newTotal = Number(value || 0) - Number(this.state[getText("TOTAL.AIRGREETS")] || 0) +'';
    this.setState({
      [getText("TRANS.GUEST.A.KUNDE")]: newTotal,
      [name]: value
    }, this.props.updateFieldValue(getText("TRANS.GUEST.A.KUNDE"), newTotal, 'guests', id))
    this.props.updateFieldValue(name, value, 'guests', id)
  }

  handleServiceChange(name, value, id) {
    /// updates its self and updates the total.
    const oppKey = (name === getText("TRANS.GUEST.SRV.FEE")) ? getText("TRANS.CLEANING") : getText("TRANS.GUEST.SRV.FEE");;
    const newTotal = Number(value || 0)  + Number(this.state[oppKey] || 0) + '';
    const newCustomerTotal = (Number(this.state[getText("TRANS.INCOME")] || 0) - Number(newTotal || 0) )+ '';
    this.setState({
      [getText('TOTAL.AIRGREETS')]: newTotal,
      [getText('TRANS.GUEST.A.KUNDE')]: newCustomerTotal,
      [name]: value
    },() => {
      this.props.updateFieldValue(getText('TOTAL.AIRGREETS'), newTotal, 'guests', id)
      this.props.updateFieldValue(getText('TRANS.GUEST.A.KUNDE'), newCustomerTotal, 'guests', id)
    })
    this.props.updateFieldValue(name, value, 'guests', id)
  }

  render() {
    const { updateFieldValue, Belegart, locked, guestNumber } = this.props;
    return (
        <div
          key={this.state._id}
          >
          <FormGroup row>
            <Col>
              <EditableField
                disabled={locked} 
                updateFieldValue={(name, val) => this.handleValueChange(name, val, guestNumber)} 
                name={getText('TRANS.GUEST.NAME')}
                placeholder={getText('TRANS.GUEST.NAME')}
                value={this.state[getText('TRANS.GUEST.NAME')]}
                required
              />
            </Col>
            <Col>
              <Label for={getText('TRANS.GUEST.ARR.DATE')}>{getText('TRANS.GUEST.ARR.DATE')}</Label>
              <InputGroupAddon>
                <DayPickerInput 
                  value={`${formatDate(new Date(this.state[getText('TRANS.GUEST.ARR.DATE')] || TIMESTAMP), 'LL', 'de')}` }
                  formatDate={formatDate}
                  parseDate={parseDate}
                  format="LL"
                  placeholder={`${formatDate(new Date(this.state[getText('TRANS.GUEST.ARR.DATE')] || TIMESTAMP), 'LL', 'de')}`}
                  dayPickerProps={{
                    locale: 'de',
                    localeUtils: MomentLocaleUtils
                  }}
                  name={getText('TRANS.GUEST.ARR.DATE')}
                  onDayChange={(val) =>
                    this.handleValueChange(getText('TRANS.GUEST.ARR.DATE'), val, guestNumber)
                  }
                  disabled={locked}
                  required
                />
              </InputGroupAddon>
            </Col>
            <Col >
              <Label for={getText('TRANS.GUEST.DPRT.DATE')}>{getText('TRANS.GUEST.DPRT.DATE')} </Label>
              <InputGroupAddon>
                <DayPickerInput 
                  name={getText('TRANS.GUEST.DPRT.DATE')}
                  value={`${formatDate(new Date(this.state[getText('TRANS.GUEST.DPRT.DATE')] || TIMESTAMP), 'LL', 'de')}`}
                  formatDate={formatDate}
                  parseDate={parseDate}
                  format="LL"
                  placeholder={`${formatDate(new Date(this.state[getText('TRANS.GUEST.DPRT.DATE')] || TIMESTAMP), 'LL', 'de')}`}
                  dayPickerProps={{
                    locale: 'de',
                    localeUtils: MomentLocaleUtils
                  }}
                  onDayChange={val => 
                    this.handleValueChange(getText('TRANS.GUEST.DPRT.DATE'), val, guestNumber )
                  }
                  disabled={locked}
                  required
                />
              </InputGroupAddon>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col>
              <EditableField
                disabled={locked} 
                updateFieldValue={(name, val) => 
                  this.handleServiceChange(name, val, guestNumber)
                } 
                name={getText('TRANS.GUEST.SRV.FEE')}
                placeholder={getText('TRANS.GUEST.SRV.FEE')}
                value={this.state[getText('TRANS.GUEST.SRV.FEE')]}
                required
              />
            </Col>
            <Col>
              <EditableField
                disabled={locked}
                name={getText('TRANS.CLEANING')}
                updateFieldValue={(name, val) => 
                  this.handleServiceChange(name, val, guestNumber)
                } 
                required
                placeholder={getText('TRANS.CLEANING')}
                value={this.state[getText('TRANS.CLEANING')]} 
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col>
              <EditableField
                disabled={locked} 
                updateFieldValue={(name, val) => this.handleIncomeChange(name, val, guestNumber)} 
                name={getText('TRANS.INCOME')}
                placeholder={getText('TRANS.INCOME')}
                value={this.state[getText('TRANS.INCOME')]}
                required
              />
            </Col>
            <Col>
              <EditableField
                disabled 
                updateFieldValue={(name, val) => this.handleValueChange(name, val, guestNumber)} 
                name={getText('TOTAL.AIRGREETS')}
                placeholder={getText('TOTAL.AIRGREETS')}
                value={this.state[getText('TOTAL.AIRGREETS')]}
                required
              />
            </Col>
            <Col>
             { Belegart === getText('PAYOUT')&&
                <EditableField
                  disabled 
                  updateFieldValue={(name, val) => this.handleValueChange(name, val, guestNumber)} 
                  name={getText('TRANS.GUEST.A.KUNDE')}
                  placeholder={getText('TRANS.GUEST.A.KUNDE')}
                  value={this.state[getText('TRANS.GUEST.A.KUNDE')]}
                  required
                />
              }
            </Col>
            <Col>
              <br/>
              {!locked &&
                <i 
                  className="fa fa-trash fa-2x"
                  aria-hidden="true"
                  onClick={() => this.props.handleDelGuest(guestNumber, 'guests')}
                  id={this.state._id}
                  required
                >
                </i>
              }
            </Col>
          </FormGroup>
          <hr/>
      </div>
    );
  }
}