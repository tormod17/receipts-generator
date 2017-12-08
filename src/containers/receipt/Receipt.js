import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addReceipt } from "../../actions/receipts";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { Grid, Col, Row, Label, Control, Form, FormGroup, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import Dropdown from '../../components/dropdown/Dropdown';
import EditableField from '../../components/EditableField/EditableField';

import 'font-awesome/css/font-awesome.min.css';
import 'react-day-picker/lib/style.css';
import "./receipt.css";

class Receipt extends Component {

  static propTypes ={
    receipt: PropTypes.shape({})
  }

  static defaultProps ={
    receipt:{},
  }


  constructor(props) {
    super(props)
    this.state ={
    }
    this.updateFieldValue = this.updateFieldValue.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  componentWillReceiveProps(nextProps) {

  }

  handleSubmission(){
    const { dispatch, auth } = this.props;
    const data  = {
      ...this.state,
    };
    dispatch(addReceipt(auth.id, data))
  }

  updateFieldValue(field, value){
    this.setState((prevState)=> ({ [field]: value }))
  }

 
  render() {
    const {receipt } = this.props;
    return (
    <Form clasName="receipt">
        <FormGroup row>
          <Col sm={{ size:5 }}>
            <br/>
            <Dropdown
              name="Auszahlung"
              items={[{ 
                  name:'invoices',
                  func: () => {},
                },{
                  name:'receipts',
                  func: ()=> {},                  
                }]}
            />
          </Col>
          <Col sm={{ size:1, offset: 6}}>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <EditableField updateFieldValue={this.updateFieldValue}  placeholder="Name des Kunden" value={receipt.name} />
          </Col>
          <Col>
            <EditableField updateFieldValue={this.updateFieldValue}  placeholder="Fortlaufende Rechnungsnummer"/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
            <EditableField updateFieldValue={this.updateFieldValue} placeholder="Adresse des Kunden"/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>            
            <EditableField updateFieldValue={this.updateFieldValue} placeholder="Kundennummer"/>
          </Col>
          <Col>
          <Label for="Rechnungsdatum">Rechnungsdatum</Label>
            <InputGroupAddon>
              <DayPickerInput 
                name="Rechnungsdatum"
                onDayChange={(val) => this.updateFieldValue('rechnungsdatum', val )}
              />
            </InputGroupAddon>
          </Col>
        </FormGroup>
        <FormGroup>
          <h2>Geschäftsvorfall 1:</h2>
        </FormGroup>
        <FormGroup row>
          <Col  sm={{ size: 6, order: 1 }}>
            <EditableField updateFieldValue={this.updateFieldValue}  placeholder="Name des Gastes"/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <EditableField updateFieldValue={this.updateFieldValue}  placeholder="Anreisedatum"/>
          </Col>
          <Col>
            <Label for="HansTest">Hans Test</Label>
            <InputGroupAddon>
              <DayPickerInput 
                name="HansTestOne"
                onDayChange={(val) => this.updateFieldValue('rechnungsdatum', val )}
              />
            </InputGroupAddon>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <EditableField updateFieldValue={this.updateFieldValue}  placeholder="Abreisedatum"/>
          </Col>
          <Col>
           <InputGroupAddon>
            <DayPickerInput 
              name="HansTestTwo"
              onDayChange={(val) => this.updateFieldValue('rechnungsdatum', val )}
            />
           </InputGroupAddon>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
            <EditableField updateFieldValue={this.updateFieldValue}  placeholder="Auszahlung"/>
          </Col>
          <Col sm={{ size: 2, order: 2 }}>
              <hr/>
              <Input name="" type="text" placeholder=""/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
            <Label for="davonReinigung" >Davon Reinigung</Label>
            <Input name="davonReinigung" type="text" placeholder="Davon Reinigung"/>
          </Col>
          <Col sm={{ size: 2, order: 2 }}>
            <hr/>
            <Input name="" type="text" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
            <EditableField updateFieldValue={this.updateFieldValue} placeholder="davon Airgreets Service Gebühr"/>
          </Col>
          <Col sm={{ size: 2, order: 2 }}>
            <hr/>
            <Input name="" type="text" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <h2>Geschäftsvorfall 2:</h2>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col className="col-4">
            <hr/>
            <Dropdown
              name="Rechnungskorrektur"
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
              <EditableField updateFieldValue={this.updateFieldValue} placeholder="Anpassungsgrund"/>
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
             <EditableField updateFieldValue={this.updateFieldValue} placeholder="Gesamtauszahlungsbetrag"/>
          </Col>
          <Col sm={{ size: 2, order: 2 }}>
            <hr/>
            <Input name="" type="text" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
           <EditableField updateFieldValue={this.updateFieldValue} placeholder="Gesamt Rechnungsbetrag"/>
          </Col>
          <Col sm={{ size: 2, order: 2 }}>
            <hr/>
            <Input name="" type="text" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
           <EditableField updateFieldValue={this.updateFieldValue} placeholder="Darin enthaltene Umsatzsteuer"/>
          </Col>
          <Col sm={{ size: 2, order: 2 }}>
            <hr/>
            <Input name="" type="text" />
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


export default connect(mapStateToProps)(Receipt);

