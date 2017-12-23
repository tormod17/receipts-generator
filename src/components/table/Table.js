import React, { Component } from "react";
import { Table, Input, Label } from 'reactstrap';
import PropTypes from "prop-types";



class Tableclients extends Component { 
    constructor(props){
      super(props);
      this.state = {
        clients: {
          ...props.clients
        },
        selectAllChecked: false
      };

      this.handleClick = this.handleClick.bind(this);
      this.handleSelect = this.handleSelect.bind(this);

    }

    componentWillReceiveProps(nextProps) {
      if (nextProps !== this.props){
        this.setState({
          clients: {
            ...nextProps.clients
          }
        });
      }
    }

    makeCheckBox(id, checked, cssclass) {
      return (
        <Label check>
          <Input 
            className={cssclass}
            type="checkbox"
            id={id}
            onChange={() => this.handleSelect(id)}
            checked={checked}
          />   
        </Label>
        );
    }

    handleSelect(id) {
      if (id ==='selectAll') {
        this.setState({
          selectAllChecked: !this.state.selectAllChecked
        });
      } else {
        this.setState({
          clients: {
             ...this.state.clients,
            [id]: {
              ...this.state.clients[id],
              checked: !this.state.clients[id].checked
            }
          },
          selectAllChecked: false
        });
      }
    }

    handleClick(client){
      this.props.getClient(client);
    }

    render() {
      const { locked } = this.props;
      const { clients, selectAllChecked } = this.state;

      const requiredFields = ['Kunden-nummer', 'Kunde', 'Belegart', 'Rechnungsnummer', 'Rechnungs-datum', 'Rechnungsbetrag', 'select'];
      const header = ['Kundenummer', 'Kunde', 'Belegart', 'Rechnungsnummer', 'Rechnungsdatum', 'Rechnungsbetrag', this.makeCheckBox('selectAll', selectAllChecked)];

      return  (
        <div
          style={{
            width: '100%'
          }}
        >
          <Table striped>
            <thead>
              <tr>
                { clients && header.map(header => 
                    <th key={header}> {header}</th>
                )}
              </tr>
            </thead>
            <tbody>
              { clients &&  Object.values(clients).map( client => 
                <tr
                  key={client._id}
                >
                  { requiredFields.map(field => {
                      let output;
                      switch(true){
                        case field === 'Rechnungsbetrag':
                          output = client[field] + '€';
                          break;
                        case field === 'Rechnungs-datum':
                         output = client['Rechnungs-datum']// probably a better way to do this. 
                         break;
                        case field === 'select': 
                          output = this.makeCheckBox(client._id, (selectAllChecked || client.checked), 'clientCheck');
                          return <td key={field}>{ output || ' '}</td>;
                        default:
                          output = client[field] + '';
                          break;
                      }
                      return <td key={field} onClick={() => this.handleClick(client)}>{ output || ' '}</td>;
                  })}
                </tr>
              )}
              { !clients && <h2>Need to add some clients</h2> }
            </tbody>
          </Table>
        </div>
      );
    }
}

export default Tableclients;
