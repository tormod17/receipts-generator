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

      this.requiredFields = ['Kunden-nummer', 'Kunde', 'Belegart', 'Rechnungsnummer', 'Rechnungs-datum', 'Rechnungsbetrag', 'select']
      this.header = ['Kundenummer', 'Kunde', 'Belegart', 'Rechnungsnummer', 'Rechnungsdatum', 'Rechnungsbetrag', ''];  //this.makeCheckBox('selectAll') 
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

    handleClick(client){
      this.props.getClient(client)
    }

    createHeaders(){
      return this.header.map(header => <th key={header}> {header}</th>)
    }

    calcTotalListings(listings){
      const output = listings.reduce((p,c) => {
          const clientTotal = c['Gesamtumsatz Airgreets'] && Number(c['Gesamtumsatz Airgreets'].replace( /\D+/g, ''));
          const corrections = c['Ust-Korrektur'] && Number(c['Ust-Korrektur'].replace( /\D+/g, ''));
          p += clientTotal + corrections;
          return p;
        },0);
      return output;
    }

    createRows = client =>
        <tr
          key={client._id}
        >
          { this.requiredFields.map(field => {
            console.log(client);

              let output;
              switch(true){
                case field === 'Rechnungsbetrag':
                  output = this.calcTotalListings(client.listings);
                  break;
                case field === 'Rechnungs-datum':
                 output = new Date(client['Rechnungs-datum']).toString().split(' '); // probably a better way to do this. 
                 output = output[0] + ' ' +output[1] + ' ' + output[2] + ' ' + output[3];
                 break;
                case field === 'select':
                  output = this.makeCheckBox(client._id)
                  return <td key={field}>{ output || ' '}</td>
                default:
                  output = client[field] + '';
                  break;
              }
              return <td key={field} onClick={() => this.handleClick(client)}>{ output || ' '}</td>
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
            { data &&  (data.map( client => this.createRows(client))) }
            { !data && <h2>Need to add some clients</h2> }
          </tbody>
        </Table>
      )
    }
}

export default TableData;
