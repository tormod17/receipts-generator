import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import { addReceipt } from "../../actions/receipts";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { Grid, Col, Row, Label, Control, Form, FormGroup, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import Dropdown from '../../components/dropdown/Dropdown';
import EditableField from '../../components/editableField/EditableField';
import Corrections from '../../components/corrections/Corrections';
import Customer from '../../components/customer/Customer';
import Transactions from '../../components/transactions/Transactions';

import { getReceipts } from "../../actions/receipts";

import 'font-awesome/css/font-awesome.min.css';
import 'react-day-picker/lib/style.css';
import "./receipt.css";

class Receipt extends Component {

  static propTypes ={
    receipt: PropTypes.shape({})
  }

  static defaultProps ={
    receipt:{},
    customer: {},
    transactions: [],
  }

  constructor(props) {
    super(props)
    this.state ={
      receipt: {},
      customer: {},
      transactions: [],
    }
    this.updateFieldValue = this.updateFieldValue.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  componentDidMount(){
    const { data } = this.props.receipts;
    const id = this.props.match.params.id;
    if (id && data) {
      const customerNumber = data[id]['Kunden-nummer'];
      const allTransactions = Object.values(data || {}).filter( trans => customerNumber === trans['Kunden-nummer'])
      const corrections = allTransactions.filter(trans => trans['Auszhalungskorrektur'] || trans['Rechnungskorrektur'])
      this.setState({
          customer: {
            ...data[id],
          },
          receipt: {
            ...data[id],
          },
          transactions: [
            ...allTransactions
          ],
          corrections: [
            ...corrections
          ]
      })
    }
  }

  handleSubmission(){
    const { dispatch, auth } = this.props;
    const data  = {
      ...this.state,
    };
    dispatch(addReceipt(auth.id, data), this.props.history.push('/'))
  }

  updateFieldValue(field, value){
    this.setState( prevState => ({ [field]: value }))
  }

  render() {
    const { customer, transactions, receipt, corrections } = this.state;
    return (
    <Form clasName="bill">
        <Customer customer={customer} updateFieldValue={this.updateFieldValue} />
        <FormGroup>
          <h2>Geschäftsvorfall 1:</h2>
        </FormGroup>
        { transactions && transactions.map(trans => {
          return (
           <Transactions updateFieldValue={this.updateFieldValue} trans={trans}/>
        )})}
        <div>
          <Corrections updateFieldValue={this.updateFieldValue} corrections={corrections}/>
        </div>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
             <EditableField updateFieldValue={this.updateFieldValue} name="Gesamtumsatz Airgreets" placeholder="Gesamt Auszahlungs Betrag"/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
           <EditableField updateFieldValue={this.updateFieldValue} name="Auszahlung an Kunde" placeholder="Gesamt Rechnungs Betrag"/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
           <EditableField updateFieldValue={this.updateFieldValue} name="Darin enthaltene Umsatzsteuer" placeholder="Darin Enthaltene Umsatzsteuer"/>
          </Col>
        </FormGroup>
        <Row className="">
          <Col sm={{ size: 2, order: 2, offset: 10 }}>
            <Button onClick={this.handleSubmission} type="button" color="primary">
            Speichern
            </Button>
          </Col>
        </Row>
    </Form>
    );
  }
}

const mapStateToProps = state => ({ ...state })


export default withRouter(connect(mapStateToProps)(Receipt));

