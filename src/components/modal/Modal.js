import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from "prop-types";


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
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel(){
    this.props.cancel();
  }

  render() {
    const {submit, cancel, open, message} = this.props;
    return (
      <div>
        <Modal isOpen={open} className={this.props.className}>
          <ModalHeader>Modal title</ModalHeader>
          <ModalBody>
            {message}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={submit}>submit</Button>
            <Button color="secondary" onClick={this.handleCancel}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalComp