import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//import {  } from "../../actions/auth";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { Grid, Col, Row, Label, Control, Form, FormGroup, InputGroup, InputGroupAddon, Input, Table, Button } from 'reactstrap';
import Dropdown from '../../components/dropdown/Dropdown';

import 'font-awesome/css/font-awesome.min.css';
import 'react-day-picker/lib/style.css';
import "./receipt.css";

class Receipt extends Component {
  constructor(props) {
    super(props)
    this.state ={}
  }

  componentWillReceiveProps(nextProps) {

  }

  handleSubmission(){

  }

 
  render() {
    const {} = this.props;
    return (
    <Form clasName="receipt">
        <FormGroup row>
          <Col sm={{ size:5 }}>
            <br/>
            <Dropdown
              name="Auszahlung"
              items={['invoices', 'receipts']}
            />
          </Col>
          <Col sm={{ size:1, offset: 6}}>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <Label for="name">Name</Label>
            <Input name="name" type="text" placeholder="Name des Kunden"/>
          </Col>
          <Col>
            <Label for="fortlaufende">Fortlaufende</Label>
            <Input name="fortlaufende" type="text"  placeholder="Fortlaufende Rechnungsnummer"/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
            <Label for="adresse">Adresse</Label>
            <Input name="fortlaufende" type="text" placeholder="Adresse des Kunden"/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>            
            <Label for="Kundennummer" >Kundennummer</Label>
            <Input name="Kundennummer" type="text" placeholder="Kundennummer"/>
          </Col>
          <Col>
          <Label for="Rechnungsdatum">Rechnungsdatum</Label>
            <InputGroupAddon>
              <DayPickerInput name="Rechnungsdatum"/>
            </InputGroupAddon>
          </Col>
        </FormGroup>
        <FormGroup>
          <h2>Geschäftsvorfall 1:</h2>
        </FormGroup>
        <FormGroup row>
          <Col  sm={{ size: 6, order: 1 }}>
            <Label for="nameDesGastes" >Name des Gastes</Label>
            <Input name="nameDesGastes" type="text" placeholder="Name des Gastes"/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <Label for="Anreisedatum" >Anreisedatum</Label>
            <Input name="Anreisedatum" type="text" placeholder="Anreisedatum"/>
          </Col>
          <Col>
            <Label for="HansTest">Hans Test</Label>
            <InputGroupAddon>
              <DayPickerInput name="HansTestOne"/>
            </InputGroupAddon>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col>
            <Label for="Abreisedatum" >Abreisedatum</Label>
            <Input name="Abreisedatum" type="text" placeholder="Abreisedatum"/>
          </Col>
          <Col>
           <InputGroupAddon>
             <DayPickerInput name="HansTestTwo"/>
           </InputGroupAddon>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
            <Label for="Auszahlung" >Auszahlung</Label>
            <Input name="Auszahlung" type="text" placeholder="Auszahlung"/>
          </Col>
          <Col sm={{ size: 2, order: 2 }}>
              <hr/>
              <Input name="" type="text" placeholder=""/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
            <Label for="davonReinigung" >Davon Reinigung</Label>
            <Input name="davon Reinigung" type="text" placeholder="Davon Reinigung"/>
          </Col>
          <Col sm={{ size: 2, order: 2 }}>
            <hr/>
            <Input name="" type="text" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
            <Label for="davonAirgreetsServiceGebühr" >Davon Airgreets Service Gebühr</Label>
            <Input name="davonAirgreetsServiceGebühr" type="text" placeholder="davon Airgreets Service Gebühr"/>
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
            <Label for="Rechnungskorrektur">Rechnungskorrektur</Label>
            <InputGroupAddon>
              <DayPickerInput name="Rechnungskorrektur"/>
            </InputGroupAddon>
          </Col>
          <Col className="col-4">
            <Label for="anpassungsgrund" >Anpassungsgrund</Label>
            <Input name="anpassungsgrund" type="text" placeholder="Anpassungsgrund"/>
          </Col>
          <Col className="col-3">
            <Label for="betrag" >Betrag</Label>
            <Input name="betrag" type="text" placeholder="Betrag"/>
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
            <Label for="gesamtauszahlungsbetrag" >Gesamtauszahlungsbetrag</Label>
            <Input name="gesamtauszahlungsbetrag" type="text" placeholder="Gesamtauszahlungsbetrag"/>
          </Col>
          <Col sm={{ size: 2, order: 2 }}>
            <hr/>
            <Input name="" type="text" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
            <Label for="gesamtRechnungsbetrag" >Gesamt Rechnungsbetrag</Label>
            <Input name="gesamtRechnungsbetrag" type="text" placeholder="Gesamt Rechnungsbetrag"/>
          </Col>
          <Col sm={{ size: 2, order: 2 }}>
            <hr/>
            <Input name="" type="text" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ size: 6, order: 1 }}>
            <Label for="darinEnthalteneUmsatzsteuer" >Darin enthaltene Umsatzsteuer</Label>
            <Input name="darinEnthalteneUmsatzsteuer" type="text" placeholder="Darin enthaltene Umsatzsteuer"/>
          </Col>
          <Col sm={{ size: 2, order: 2 }}>
            <hr/>
            <Input name="" type="text" />
          </Col>
        </FormGroup>
        <Row className="">
          <Col sm={{ size: 2, order: 2, offset: 10 }}>
            <Button color="primary">
            Speichern
            </Button>
          </Col>
        </Row>
    </Form>
    );
  }
}

Receipt.contextTypes = {
};

Receipt.propTypes = {
};

function mapStateToProps(state) {
}

export default connect(mapStateToProps)(Receipt);

