import React, { Component } from "react";
import { Table, Input, Label } from 'reactstrap';
import PropTypes from "prop-types";
import { formatDate } from 'react-day-picker/moment';


const CheckBox = (props) => {
  return (
    <Label check>
      <Input 
        className={props.cssClass}
        type="checkbox"
        id={props.id}
        onChange={() => props.func(props.id)}
        checked={props.checked}
      />   
    </Label>
  );
};

class Tableclients extends Component { 

    static propTypes = {
      clients: PropTypes.shape({})
    }

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
      this.handleSelectAll = this.handleSelectAll.bind(this);
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

    handleSelectAll(){
      let newClients = {};
      Object.keys(this.state.clients).forEach(key => {
        this.state.clients[key].checked = !this.state.selectAllChecked;
        newClients = {
          [key]: { ...this.state.clients[key] }
        };
      });
      this.setState({
        clients: {
          ...this.state.clients,
          ...newClients
        },
        selectAllChecked: !this.state.selectAllChecked
      });
    }

    handleSelect(id) {
      this.setState({
        clients: {
           ...this.state.clients,
          [id]: {
            ...this.state.clients[id],
            checked: !this.state.clients[id].checked
          }
        },
        selectAllChecked: undefined
      });
    }

    handleClick(client){
      this.props.getClient(client);
    }

    render() {
      const { currentDate } = this.props;
      const { clients, selectAllChecked } = this.state;
      const hoptions ={
        checked: selectAllChecked,
        func: this.handleSelectAll
      };

      return  (
        <div
          style={{
            width: '100%'
          }}
        >
          <Table striped>
            <thead>
              <tr>
                <th>Kunden-nummer</th>
                <th>Kunde</th>
                <th>Belegart</th>
                <th>Rechnungsnummer</th>     
                <th>Rechnungs-datum</th> 
                <th>Rechnungsbetrag</th>
                <th>
                  <CheckBox {...hoptions} />
                </th>               
              </tr>
            </thead>
            <tbody>
              { clients &&  Object.values(clients).map( client => {
                const options = {
                  id: client._id,
                  checked: selectAllChecked || client.checked,
                  func: this.handleSelect,
                  cssClass: 'clientChecked'
                };
                return (
                  <tr
                    key={client._id}
                  >
                    <td  onClick={() => this.handleClick(client)} >{ `${client['Kunden-nummer']}`}</td>
                    <td  onClick={() => this.handleClick(client)} >{ `${client['Kunde']}`}</td>
                    <td  onClick={() => this.handleClick(client)} >{ `${client['Belegart']}`}</td>
                    <td  onClick={() => this.handleClick(client)} >{ `${client['Rechnungsnummer']}`}</td>
                    <td  onClick={() => this.handleClick(client)} >{ `${formatDate(new Date(Number(client['Rechnungs-datum'])), 'LL', 'de')}`}</td>
                    <td  onClick={() => this.handleClick(client)} >{ `${client['Rechnungsbetrag'].toFixed(2)}€`}</td>
                    <td> 
                      <CheckBox {...options} />
                    </td>
                  </tr>
                );
              })}
              { !clients && <h2>Need to add some clients</h2> }
            </tbody>
          </Table>
        </div>
      );
    }
}

export default Tableclients;
