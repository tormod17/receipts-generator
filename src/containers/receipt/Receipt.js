import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import { addReceipt } from "../../actions/receipts";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { Grid, Col, Row, Label, Control, Form, FormGroup, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import Dropdown from '../../components/dropdown/Dropdown';
import EditableField from '../../components/EditableField/EditableField';

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
      console.log(allTransactions);
      this.setState({
          customer: {
            ...data[id],
          },
          transactions: [
            ...allTransactions
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
    const { customer, transactions, receipt } = this.state;
    return (
    <Form clasName="customer">
        <FormGroup row>
          <Col sm={{ size:5 }}>
            <br/>
            <Dropdown
              name="Auszahlung/Rechnung"
              items={[{ 
                  name:'Rechnung',
                  func: () => {},
                },{
                  name:'Auszahlung',
                  func: ()=> {},                  
                }]}
            />
          </Col>
          <Col sm={{ size:1, offset: 6}}>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <EditableField updateFieldValue={this.updateFieldValue}  name="Kunde" placeholder="Name des Kunden" value={customer.Kunde} />
          </Col>
          <Col>
            <EditableField updateFieldValue={this.updateFieldValue}  name="Rechnungsnummer" placeholder="Fortlaufende Rechnungsnummer" value={customer.Rechnungsnummer}/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col >
            <EditableField updateFieldValue={this.updateFieldValue} name="Straße" placeholder="Stadt" label="Adresse des Kunden" value={customer.Straße}/>
          </Col>
          <Col>
            <EditableField updateFieldValue={this.updateFieldValue} name="Stadt" placeholder="Stadt" nolabel value={customer.Stadt}/>
          </Col>
          <Col>
            <EditableField updateFieldValue={this.updateFieldValue} name="PLZ" placeholder="PLZ" nolabel value={customer.PLZ}/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>            
            <EditableField updateFieldValue={this.updateFieldValue} name="Kunden-nummer" placeholder="Kunden-nummer" value={customer['Kunden-nummer']}/>
          </Col>
          <Col>
          <Label for="Rechnungs-datum">Rechnungs-datum</Label>
            <InputGroupAddon>
              <DayPickerInput 
                name="Rechnungs-datum"
                onDayChange={(val) => this.updateFieldValue('rechnungsdatum', val )}
                value={customer['Rechnungs-datum'] ||  Date.now()}
              />
            </InputGroupAddon>
          </Col>
        </FormGroup>
        <FormGroup>
          <h2>Geschäftsvorfall 1:</h2>
        </FormGroup>
        { transactions && transactions.map(trans => {
          return (
            <div>
            <FormGroup row>
              <Col  sm={{ size: 6, order: 1 }}>
                <EditableField updateFieldValue={this.updateFieldValue} name="Name des Gastes" placeholder="Name des Gastes" value={trans["Name des Gastes"]}/>
              </Col>
              <Col sm={{ size: 6, order: 1 }}>
                <EditableField 
                  updateFieldValue={this.updateFieldValue}  
                  name="Airgreets Service Fee (€)"
                  placeholder="Airgreets Service Fee (€)"
                  value={trans['Airgreets Service Fee (€)']}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 6, order: 1 }}>
                <Label for="Anreisedatum">Anreise-datum</Label>
                <InputGroupAddon>
                  <DayPickerInput 
                    name="Anreisedatum"
                    onDayChange={(val) => this.updateFieldValue('Anreisedatum', val )}
                    value={trans.Anreisedatum}
                  />
                </InputGroupAddon>
              </Col>
              <Col sm={{ size: 6, order: 1 }}>
                <EditableField name="CLEANING FARE" updateFieldValue={this.updateFieldValue} placeholder="Reinigungs-gebühr" value={trans["CLEANING FARE"]} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 6, order: 1 }}>
                <Label for="Abreisedatum">Abreise-datum</Label>
                <InputGroupAddon>
                  <DayPickerInput 
                    name="Abreisedatum"
                    onDayChange={val => this.updateFieldValue('Abreisedatum', val )}
                    value={trans.Abreisedatum}
                  />
                </InputGroupAddon>
              </Col>
              <Col sm={{ size: 6, order: 1 }}>
                <EditableField updateFieldValue={this.updateFieldValue} name="TOTAL PAID"  placeholder="Auszahlung" value={trans["TOTAL PAID"]}/>
              </Col>
            </FormGroup>
            <FormGroup row>
         
            </FormGroup>
            <FormGroup row>
            
            </FormGroup>
            <FormGroup row>
          
            </FormGroup>
            <hr/>
            </div>
        )})}
        <FormGroup row>
          <Col>
            <h2>Geschäftsvorfall 2:</h2>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col className="col-4">
            <hr/>
            <Dropdown
              name="Rechnungskorrektur/Auszahlungskorrektur"
              items={[{ 
                  name:'Rechnungskorrektur',
                  func: () => {},
                },{
                  name:'Auszahlungskorrektur',
                  func: ()=> {},                  
                }]}
            />
          </Col>
          <Col className="col-4">
              <EditableField updateFieldValue={this.updateFieldValue} name="Anpassungs-grund" placeholder="Anpassungs grund"/>
          </Col>
          <Col className="col-3">
             <EditableField updateFieldValue={this.updateFieldValue} placeholder="Betrag"/>
          </Col>
          <Col className="col-1">
            <br/>
            <i class="fa fa-trash fa-3x" aria-hidden="true"></i>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 4, order: 1 }}>
            <InputGroup>
              <InputGroupAddon>
                <Input addon type="checkbox" aria-label="Umsatzsteuer" />
              </InputGroupAddon>
              <Input placeholder="Umsatzsteuer" />
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <i class="fa fa-plus fa-3x" aria-hidden="true"></i>
          </Col>
        </FormGroup>
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

