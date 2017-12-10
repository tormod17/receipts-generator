import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from "prop-types";

export default class Example extends React.Component {
  
  static defaultProps = {
    name: PropTypes.string.isRequired,
    items: PropTypes.shape([]).isRequired,
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    const { name, items } = this.props;
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          {name}
        </DropdownToggle>
        <DropdownMenu>
          { items.map(item => 
            <DropdownItem onClick={item.func}>{item.name}</DropdownItem>
          )}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}