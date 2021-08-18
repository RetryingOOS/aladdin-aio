import React, { useState } from 'react';
import { connect } from 'react-redux';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import {
  Icon,
  Button,
  Modal,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  InputPicker,
} from 'rsuite';
import Chip from '@material-ui/core/Chip';

const TaskGroup = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Modal show={show} onHide={setShow(false)} size="md">
        <Modal.Header>
          <Modal.Title>Create Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            // onChange={(formValue) => {
            //   this.setState({ formValue });
            //   console.log(formValue);
            // }}
            // formValue={formValue}
          >
            <FormGroup style={{ marginLeft: '5%' }}>
              <ControlLabel>Site</ControlLabel>
              <FormControl
                name="Site"
                placeholder="Site"
                data={this.props.state.sites}
                accepter={InputPicker}
              />
            </FormGroup>
            <FormGroup style={{ marginLeft: '5%' }}>
              <ControlLabel>Monitor Input</ControlLabel>
              <FormControl
                style={{ width: 'auto' }}
                name="MonitorInput"
                type="text"
                placeholder="Keywords"
              />
            </FormGroup>
            <FormGroup style={{ marginLeft: '5%' }}>
              <ControlLabel>Profile</ControlLabel>
              <FormControl
                name="Profile"
                placeholder="Profile"
                accepter={InputPicker}
              />
            </FormGroup>
            <FormGroup style={{ marginLeft: '5%' }}>
              <ControlLabel>Size</ControlLabel>
              <FormControl
                name="Size"
                placeholder="Size"
                accepter={InputPicker}
              />
            </FormGroup>

            <FormGroup style={{ position: 'absolute', top: '0', left: '60%' }}>
              <ControlLabel>Mode</ControlLabel>
              <FormControl
                name="Mode"
                placeholder="Mode"
                accepter={InputPicker}
                // data={this.props.state.siteToModes[formValue.site] ?? []}
              />
            </FormGroup>

            <FormGroup
              style={{ position: 'absolute', top: '22%', left: '60%' }}
            >
              <ControlLabel>Account</ControlLabel>
              <FormControl
                name="Account"
                placeholder="Optional (None)"
                accepter={InputPicker}
              />
            </FormGroup>

            <FormGroup
              style={{ position: 'absolute', top: '45%', left: '60%' }}
            >
              <ControlLabel>Proxy</ControlLabel>
              <FormControl
                name="Proxy"
                placeholder="Proxy"
                accepter={InputPicker}
              />
            </FormGroup>

            <FormGroup
              style={{ position: 'absolute', top: '68%', left: '60%' }}
            >
              <ControlLabel>Task Quantity</ControlLabel>
              <FormControl
                name="Quantity"
                placeholder="Proxy"
                accepter={InputPicker}
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            // onClick={setShow(false)}
            style={{
              color: 'white',
              border: '3px solid white',
              marginRight: '1rem',
            }}
            appearance="ghost"
          >
            Cancel
          </Button>
          <Button
            // onClick={(event) => this.createTasks(event, 30)}
            style={{
              color: 'springgreen',
              border: '3px solid springgreen',
            }}
            appearance="ghost"
            // onClick={setShow(true)}
          >
            Create Tasks
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        className="TaskGroup"
        style={{
          width: '15%',
          position: 'absolute',
          top: '-25px',
          left: '4.5%',
          overflowY: 'scroll',
          display: 'block',
          height: '88%',
          marginTop: '80px',
        }}
      >
        <div>
          <div style={{ fontSize: '20px', marginLeft: '3rem' }}>
            Task Groups
          </div>
          <Button
            style={{ marginBottom: '2rem', marginLeft: '2rem' }}
            size="lg"
            color="blue"
          >
            <Icon icon="plus-square" /> Create Group
          </Button>
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div
              style={{
                backgroundColor: 'rgb(41, 44, 62)',
                marginBottom: '10px',
                float: 'right',
                width: '100%',
                height: '50%',
              }}
              key={row.id}
              onClick={(e) => console.log('clicked card')}
            >
              <div>
                <CardContent>
                  <Typography component="h2" variant="subtitle1">
                    Walmart | 26 Tasks
                  </Typography>
                  <Chip
                    size="small"
                    color="secondary"
                    style={{
                      margin: '5px 2px 3px 2px',
                      backgroundColor: '#e7ff00',
                      color: 'black',
                    }}
                    icon={<ShoppingCartIcon />}
                    label="0"
                  />
                  <Chip
                    size="small"
                    color="secondary"
                    style={{
                      margin: '5px 2px 3px 2px',
                      backgroundColor: '#1fcc61',
                      color: 'black',
                    }}
                    icon={<CheckCircleIcon />}
                    label="0"
                  />
                  <Chip
                    size="small"
                    color="secondary"
                    style={{
                      margin: '5px 2px 3px 2px',
                      backgroundColor: '#cd5161',
                      color: 'black',
                    }}
                    icon={<CloseIcon />}
                    label="0"
                  />
                </CardContent>
              </div>
            </div>
          ))}
        </div>
        <div />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(TaskGroup);
