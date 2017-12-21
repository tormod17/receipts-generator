import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Label, Control, Input, } from 'reactstrap';

import "./editableField.css";

class EditableField extends Component {

  static propTypes = {
    updateFieldValue: PropTypes.func,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string, 
    label: PropTypes.string, 
    value: PropTypes.string, 
  }

  static defaultProps ={
    placeholder: 'please type here',
    type: 'text',
    label: undefined,
    updateFieldValue: () =>{},
    value: null,
  }

  constructor(props) {
    super(props)
    this.state ={
      
    }
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  camelCaseName(name){
    return name.split(' ').map(function(word,index){
    if(index == 0){
      return word.toLowerCase();
    }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
  }
  
  handleOnChange(e, name) {
    this.props.updateFieldValue(name, e.target.value)
  }

  render() {
    const { placeholder, updateFieldValue, type, value, name, label, nolabel, required } =this.props;
    //const name = this.camelCaseName(placeholder);

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
          onChange={(e) => this.handleOnChange(e,name)}
          //disabled={!!value}
          value={value}
          required
        />
      </div> 
    );
  }
}

EditableField.propTypes = {

};

export default EditableField;
