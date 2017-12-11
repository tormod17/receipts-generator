import React, { Component } from "react";
import { Table, Input, Label } from 'reactstrap';
import PropTypes from "prop-types";



class TableData extends Component { 
    constructor(props){
      super(props)
      this.state = {
        selectedArray: [],
      };

      this.handleClick = this.handleClick.bind(this);

      this.requiredFields = ['Kunden-nummer', 'Kunde', 'Belgart', 'Rechnungsnummer', 'Rechnungs-datum', 'Rechnungsbetrag', 'select']
      this.header = ['Kundenummer', 'Kunde', 'Belgart', 'Rechnungsnummer', 'Rechnungsdatum', 'Rechnungsbetrag', this.makeCheckBox('selectAll') ];
    }

    makeCheckBox = id => 
      <Label check>
        <Input 
          className="selectCheckBox"
          type="checkbox"
          id={id} 
          onChange={this.props.handleSelect}
        />   
      </Label>

    handleClick(receipt){
      this.props.getReceipt(receipt)
    }

    createHeaders(){
      return this.header.map(header => <th key={header}> {header}</th>)
    }

    createRows = receipt =>
        <tr
          key={receipt._id}
        >
          { this.requiredFields.map(field => {
              let output;
              switch(true){
                case field === 'Belgart':
                  output = receipt.Rechnung === 'x' ? 'Rechnung' : 'Auszahlung';
                  break;
                case field === 'Rechnungs-datum':
                 output = new Date(receipt['Rechnungs-datum']).toString().split(' '); // probably a better way to do this. 
                 output = output[0] + ' ' +output[1] + ' ' + output[2] + ' ' + output[3];
                 break;
                case field === 'select':
                  output = this.makeCheckBox(receipt._id)
                  return <td key={field}>{ output || ' '}</td>
                default:
                  output = receipt[field];
                  break;
              }
              return <td key={field} onClick={() => this.handleClick(receipt)}>{ output || ' '}</td>
          })}
        </tr>

    render() {
      const { data } = this.props;
      return  (
        <Table striped>
          <thead>
            <tr>
              { data && this.createHeaders() }
            </tr>
          </thead>
          <tbody>
            { data &&  (data.map( receipt => this.createRows(receipt))) }
            { !data && <h2>Need to add some receipts</h2> }
          </tbody>
        </Table>
      )
    }
}

export default TableData;
