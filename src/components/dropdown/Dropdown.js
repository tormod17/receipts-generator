import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from "prop-types";

export default class Example extends React.Component {
  
  static defaultProps = {
    name: PropTypes.string.isRequired,
    items: PropTypes.shape([]).isRequired,
    data: PropTypes.shape({}).isRequired,
    //updateFieldValue: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { data } = props;
    this.state = {
      dropdownOpen: false,
      selected: data['Rechnung'] === 'X' ? 'Rechnung' : 'Auszahlung',
    };
    this.toggle = this.toggle.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleSelectItem(item) {
    const { name, updateFieldValue } = this.props;
    this.setState({
      selected: item,
    }, updateFieldValue(name, item))
  }

  render() {
    const { items } = this.props;
    const { selected } =this.state

    return (
      <ButtonDropdown 
        isOpen={this.state.dropdownOpen} 
        toggle={this.toggle}
      >
        <DropdownToggle caret>
          {selected}
        </DropdownToggle>
        <DropdownMenu>
          { items.map(item => 
            <DropdownItem onClick={() => this.handleSelectItem(item.name)}>{item.name}</DropdownItem>
          )}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}