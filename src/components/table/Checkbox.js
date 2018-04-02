import React, { Component } from "react";
import { Input, Label } from 'reactstrap';
import PropTypes from "prop-types";

class CheckBox extends Component{
  static propTypes = {
    checked: PropTypes.bool,
  };

  static defaultProps ={
    checked: false,
  };

  constructor(props){
    super(props);
    this.state = {
      checked: this.props.checked,
    };
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.checked !== nextProps.checked) {
      this.setState({
        checked: nextProps.checked
      })
    };
  };

  handleChange(id){
    this.setState({
      checked: !this.state.checked,
    }, () => {
      this.props.func(id);      
    });
  }

  render(){
    const { id, cssClass } = this.props;
    return (
      <Label>
        <Input 
          className={cssClass}
          type="checkbox" 
          id={id}
          onChange={() => this.handleChange(id) }
          checked={this.state.checked}
        />   
      </Label>
    );
  };
};


export default CheckBox;