import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from "prop-types";
import { getClients, updateClient, addClient, saveMonth } from "../../actions/clients";

import {withRouter} from "react-router-dom";


class ModalComp extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    submit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
  }

  static defaultProps = {
    open: false,
    message:' This is a modal bitch!'
  }
  
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleModalValues = this.handleModalValues.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.modalSubmit = this.modalSubmit.bind(this);

  }
  componentDidMount(){
    const { auth, dispatch } = this.props;
    document.addEventListener('lockMonth', this.handleModalValues);
    document.addEventListener('updateClient', this.handleModalValues);
    document.addEventListener('addClient', this.handleModalValues);
    document.addEventListener('requiredFields', this.handleModalValues);
  }

  componentWillUnmount(){
    document.removeEventListener('lockMonth', this.handleModalValues); 
    document.removeEventListener('updateClient', this.handleModalValues);
    document.removeEventListener('addClient', this.handleModalValues);
    document.removeEventListener('requiredFields', this.handleModalValues);   
  }

  handleModalValues(e){
    e.preventDefault();
    const { message, payload, value, id, type } = e;
    this.setState({
      modalType: type,
      message,
      open: true,
      payload: {
        ...payload
      },
      value,
      id,
      noSubmit: type === 'requiredFields'
    });
  }

  modalSubmit(){
    const { dispatch } = this.props ;
    const  { modalType, payload, value, id } = this.state;
    switch (true) {
      case  modalType === 'lockMonth':
        dispatch(saveMonth(payload, value));
        break;
      case modalType === 'updateClient':
        dispatch(updateClient(id, payload));
        break;
      case modalType === 'addClient':
        dispatch(addClient(id, payload));
        break;
    }
    this.handleClose()
    this.props.history.push('/');
  }

  handleClose(){
   this.setState({
    open: false,
   })
  }

  render() {
    const { open, message, noSubmit} = this.state;

    return (
      <div>
        <Modal isOpen={open} className={this.props.className}>
          <ModalBody>
            {message}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
            {!noSubmit && <Button color="primary" onClick={this.modalSubmit}>submit</Button> }
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withRouter(ModalComp)