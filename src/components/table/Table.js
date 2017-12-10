import React, { Component } from "react";
import { Table } from 'reactstrap';
import PropTypes from "prop-types";

class TableData extends Component { 
    constructor(props){
      super(props)
      this.state = {};
    }

    handleClick(receipt){
      console.log('link to detail view', receipt)
    }

    createHeaders(){
      const { data } = this.props;
      const headers =  Object.keys(data[0] || {});
      return headers.map(header => <th key={header}> {header}</th>)
    }

    createRows = receipt =>
        <tr
          key={receipt._id}
          onClick={() => this.handleClick(receipt)}
        >
          { Object.keys(receipt || {}).map(field => <td key={field}>{receipt[field]}</td> )}
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
