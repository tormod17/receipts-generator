import React, { Component } from "react";
import { Table } from 'reactstrap';
import PropTypes from "prop-types";

class TableData extends Component { 
    constructor(props){
      super(props)
      this.state ={

      }
    }

    handleClick(receipt){
      console.log('link to detail view', receipt)
    }

    render() {
      const { receipts } = this.props;
      return  (
        <Table>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { receipts.map( receipt =>
                <tr
                 onClick={() => this.handleClick(receipt)}
                >
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
            )}
          </tbody>
        </Table>
      )
    }
}

export default TableData;
