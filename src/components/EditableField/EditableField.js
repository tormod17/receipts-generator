import React, { Component } from "react";
import PropTypes from "prop-types";
import { Label, Input, } from 'reactstrap';

import "./editableField.css";

class EditableField extends Component {

  static propTypes = {
    updateFieldValue: PropTypes.func,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string, 
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
  }

  static defaultProps ={
    placeholder: 'please type here',
    type: 'text',
    label: undefined,
    updateFieldValue: () =>{},
    value: '',
  }

  constructor(props) {
    super(props)
    this.state ={
      value: props.value 
    }
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.value !== nextProps.value ){
      this.setState({
        value: nextProps.value,
      })
    }
  }
  
  handleOnChange(e, name) {
    this.setState({ 
      value: e.target.value
    })
    this.props.updateFieldValue(name, e.target.value)
  }

  render() {
    const { placeholder, type, name, label, nolabel, disabled } =this.props;
    const { value } = this.state

    return (
      <div>
        <Label 
          for={name}
        >
          {label  || (!nolabel && placeholder)}
        </Label>
        <Input 
          name={name}
          type={type} 
          placeholder={placeholder}
          onChange={(e) => this.handleOnChange(e, name)}
          disabled={disabled}
          value={value}
        />
      </div> 
    );
  }
}

export default EditableField;
