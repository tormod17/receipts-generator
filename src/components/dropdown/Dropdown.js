import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from "prop-types";

export default class Example extends React.Component {
  
  static propTyps = {
    name: PropTypes.string.isRequired,
    items: PropTypes.shape([]).isRequired,
    data: PropTypes.shape({}).isRequired,
    selected: PropTypes.string.isRequired
    //updateFieldValue: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { data, selected } = props;
    this.state = {
      dropdownOpen: false,
      selected,
    };
    this.toggle = this.toggle.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      const { selected } = nextProps;
      this.setState({
        selected
      })
    }
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
    })
    updateFieldValue(name, item)
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
            <DropdownItem onClick={() => this.handleSelectItem(item)}>{item}</DropdownItem>
          )}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}