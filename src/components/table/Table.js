import React, { Component } from "react";
import { Table } from 'reactstrap';
import PropTypes from "prop-types";

const header = ['Kundenummer', 'Kunde', 'Belgart', 'Rechnungsnummer', 'Rechnungsdatum', 'Rechnungsbetrag'];
const requiredFields = ['Kunden-nummer', 'Kunde', 'Belgart', 'Rechnungsnummer', 'Rechnungs-datum', 'Rechnungsbetrag']

class TableData extends Component { 
    constructor(props){
      super(props)
      this.state = {};

      this.handleClick = this.handleClick.bind(this);
    }

    handleClick(receipt){
      this.props.getReceipt(receipt)
    }
  

    createHeaders(){
      return header.map(header => <th key={header}> {header}</th>)
    }

    createRows = receipt =>
        <tr
          key={receipt._id}
          onClick={() => this.handleClick(receipt)}
        >
          { requiredFields.map(field => {
              return <td key={field}>{ receipt[field] || ' '}</td>
          })}
        </tr>

    render() {
      const { data } = this.props;
      return  (
        <Table>
          <thead>
            <tr>
              { data && this.createHeaders() }
            </tr>
          </thead>
          <tbody>
            { data.map( receipt => this.createRows(receipt))}
          </tbody>
        </Table>
      )
    }
}

export default TableData;
