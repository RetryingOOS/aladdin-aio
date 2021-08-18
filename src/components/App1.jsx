import React from 'react';
import '../app.css';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Chip from '@material-ui/core/Chip';
import { connect } from 'react-redux';
import {
  Icon,
  InputPicker,
  Modal,
  Checkbox,
  Avatar,
  InputNumber,
  Form,
  InputGroup,
  Input,
  FormGroup,
  FormControl,
  ControlLabel,
} from 'rsuite';
import { Table, Button } from 'antd';

import cogoToast from 'cogo-toast';

import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Clock from 'react-live-clock';

const rsuite = require('rsuite');

const { ipcRenderer } = require('electron');
const electron = require('electron').remote;

const { Column, HeaderCell, Cell } = Table;

function passwordGenerator() {
  return Math.random().toString(25).substr(2, 6).toUpperCase();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// eslint-disable-next-line react/prop-types
const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Cell {...props} style={{ padding: 0 }}>
    <div style={{ lineHeight: '46px' }}>
      <Checkbox
        value={rowData[dataKey]}
        inline
        onChange={onChange}
        checked={checkedKeys.some((item) => item === rowData[dataKey])}
      />
    </div>
  </Cell>
);

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}
class TasksTable1 extends React.Component {
  constructor(props) {
    super(props);
    this.height = this.height.bind(this);
    this.ipc = this.ipc.bind(this);
    this.nike = this.nike.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createTasks = this.createTasks.bind(this);
    this.startAllTasks = this.startAllTasks.bind(this);
    this.stopAllTasks = this.stopAllTasks.bind(this);
    this.deleteTasks = this.deleteTasks.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.getTasks = this.getTasks.bind(this);
    this.state = {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      data: this.props.state.tasks,
      show: false,
      logs: [],
      store: '',
      color: '',
      profile: '',
      proxy: '',
      size: '',
      keywords: '',
      monitorDelay: 3000,
      checkoutDelay: 3000,
      account: '',
      checkedKeys: this.props.state.checkedKeys,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    };
  }

  // eslint-disable-next-line react/sort-comp
  handleCheckAll = (value, checked) => {
    const checkedKeys = checked
      ? this.props.state.tasks.map((item) => item.id)
      : [];
    this.props.dispatch({ type: 'update', obj: { checkedKeys } });
    console.log(this.props.state.checkedKeys);
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  handleCheck = (value, checked) => {
    const { checkedKeys } = this.props.state;
    const nextCheckedKeys = checked
      ? [...checkedKeys, value]
      : checkedKeys.filter((item) => item !== value);
    this.props.dispatch({
      type: 'update',
      obj: { checkedKeys: nextCheckedKeys },
    });
  };

  close = () => {
    this.setState({ show: false });
  };

  open = () => {
    this.setState({ show: true });
  };

  taskStatusColor = (status) => {
    switch (status) {
      case 'Checked Out':
        return 'springgreen';
      case 'Adding to Cart':
        return '#0ee3c3';
      case 'Starting Task':
      case 'Submitting Shipping':
      case 'Submitting Billing':
      case 'Calculating Taxes':
        return '#4287f5';
      case 'Checking Out':
        return '#e3bc0e';
      default:
        return 'White';
    }
  };

  getTasks = () => {
    const tasks = ipcRenderer.sendSync('get:tasks');
    // eslint-disable-next-line react/destructuring-assignment,react/prop-types
    this.props.dispatch({ type: 'update', obj: { tasks } });
  };

  startTask = (task) => {
    ipcRenderer.send('start:tasks', task);
  };

  handleClick = (e, data) => {
    this.setState(({ logs }) => ({
      logs: [`Clicked on ${data.name} menu ${data.item}`, ...logs],
    }));
  };

  handleChange = (name, value) => {
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // eslint-disable-next-line class-methods-use-this
  ipc = (event, msg) => {
    event.preventDefault();
    ipcRenderer.send('asynchronous-message', msg);
  };

  componentDidMount() {
    console.time('componentDidMount');
    this.getTasks();
    console.timeEnd('componentDidMount');
  }

  nike = (event) => {
    event.preventDefault();
    ipcRenderer.send('nike:login');
  };

  deleteTasks = (e) => {
    ipcRenderer.sendSync('delete:tasks');
    this.getTasks();
    this.props.dispatch({
      type: 'update',
      obj: { checkedKeys: [] },
    });

    cogoToast.success(`Deleted Tasks`, {
      position: 'top-right',
      heading: 'Success',
    });
  };

  deleteSomeTasks = (e, arg) => {
    e.preventDefault();
    ipcRenderer.sendSync('delete:some:tasks', arg);
    this.getTasks();
    // eslint-disable-next-line react/prop-types
    this.props.dispatch({
      type: 'update',
      obj: { checkedKeys: [] },
    });

    cogoToast.success(`Deleted Tasks`, {
      position: 'top-right',
      heading: 'Success',
    });
  };

  createTasks = (event, quantity) => {
    event.preventDefault();
    const tasks = [];
    for (let i = 0; i < quantity; i++) {
      tasks.push({
        id: passwordGenerator(),
        store: 'Footlocker',
        mode: 'fast',
        profile: 'Main',
        proxy: 'isp',
        size: 'random',
        keywords: 'dunks',
        color: 'blue',
        account: null,
        monitorDelay: 3000,
        checkoutDelay: 3000,
        status: {
          status: 'Idle',
          statusColor: '#f2f2f2',
        },
      });
    }
    ipcRenderer.sendSync('create:tasks', tasks);
    this.setState({ show: false });
    cogoToast.success(`Created ${quantity > 1 ? quantity : ''} Tasks`, {
      position: 'top-right',
      heading: 'Success',
    });
    this.getTasks();
  };

  startAllTasks = (tasks) => {
    // eslint-disable-next-line no-restricted-syntax
    if (tasks === 'all') {
      for (const t in this.props.state.tasks) {
        const task = this.props.state.tasks[t];
        this.startTask(task);
      }
    } else {
      for (const t in this.props.state.tasks) {
        if (tasks.includes(this.props.state.tasks[t].id)) {
          this.startTask(this.props.state.tasks[t]);
        }
      }
    }
  };

  stopAllTasks = async () => {
    for (let index = 0; index < this.state.data.length; index++) {
      this.setState({
        data: [
          ...this.state.data.slice(0, index),
          {
            ...this.state.data[index],
            status: 'Idle',
            statusColor: '#f2f2f2',
            active: false,
          },
          ...this.state.data.slice(index + 1),
        ],
      });
    }
  };

  // eslint-disable-next-line class-methods-use-this
  height = () => {
    const { height } = electron.getCurrentWindow().getBounds().height;

    return 0.85 * height;
  };

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const { checkedKeys } = this.props.state;
    const data = this.props.state.tasks;
    let checked = false;
    let indeterminate = false;

    if (checkedKeys.length === data.length) {
      checked = true;
    } else if (checkedKeys.length === 0) {
      checked = false;
    } else if (checkedKeys.length > 0 && checkedKeys.length < data.length) {
      indeterminate = true;
    }
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Age',
        dataIndex: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
      },
    ];

    return (
      <div>
        <div>
          {/* eslint-disable-next-line react/destructuring-assignment */}
          <Modal show={this.state.show} onHide={this.close} size="md">
            <Modal.Header>
              <Modal.Title>Create Tasks</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form
                fluid
                onChange={this.handleChange}
                formValue={this.state.formValue}
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

                <FormGroup
                  style={{ position: 'absolute', top: '0', left: '60%' }}
                >
                  <ControlLabel>Mode</ControlLabel>
                  <FormControl
                    name="Mode"
                    placeholder="Mode"
                    accepter={InputPicker}
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
                onClick={this.close}
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
                onClick={(event) => this.createTasks(event, 200)}
                style={{
                  color: 'springgreen',
                  border: '3px solid springgreen',
                }}
                appearance="ghost"
              >
                Create Tasks
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div
          style={{
            position: 'absolute',
            top: '17px',
            left: '80px',
          }}
        >
          <Clock
            format="HH:mm:ss"
            interval={1000}
            ticking
            style={{ position: 'absolute', top: '0', fontSize: '1rem' }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '40px',
            height: '80%',
            width: '80%',
            right: '0',
            float: 'right',
            fontSize: '22px',
          }}
        >
          <Avatar
            style={{ marginRight: '1rem', top: '0.5rem', position: 'absolute' }}
            size="lg"
          >
            FT
          </Avatar>
          <span
            style={{
              marginLeft: '4.75rem',
              top: '0.5rem',
              position: 'absolute',
            }}
          >
            Footlocker Task Group | Task Count: {this.props.state.tasks.length}{' '}
            Tasks
          </span>
          <span
            style={{
              fontSize: '16px',
              marginLeft: '4.75rem',
              top: '3rem',
              position: 'absolute',
            }}
          >
            {checkedKeys.length} Tasks Selected
          </span>
          <div style={{ position: 'absolute', top: '10px', right: '60px' }}>
            <InputGroup style={{ width: '6rem' }}>
              <InputGroup.Addon>
                <Icon icon="check-circle" style={{ color: 'springgreen' }} />
              </InputGroup.Addon>
              <Input value="10" disabled />
            </InputGroup>
          </div>
          <div style={{ position: 'absolute', top: '10px', right: '220px' }}>
            <InputGroup style={{ width: '6rem' }}>
              <InputGroup.Addon>
                <Icon icon="shopping-cart" style={{ color: 'mediumpurple' }} />
              </InputGroup.Addon>
              <Input value="12" disabled />
            </InputGroup>
          </div>
          <div style={{ position: 'absolute', top: '10px', right: '380px' }}>
            <InputGroup style={{ width: '6rem' }}>
              <InputGroup.Addon>
                <Icon icon="warning" style={{ color: 'crimson' }} />
              </InputGroup.Addon>
              <Input value="12" disabled />
            </InputGroup>
          </div>
        </div>
        <div className="Tasks">
          <div
            style={{
              position: 'absolute',
              top: '130px',
              right: '20px',
              height: '80%',
              width: '80%',
              float: 'right',
            }}
          >
            <Button
              id="create-tasks-btn"
              style={{ borderWidth: 2, marginTop: '10px' }}
              variant="outlined"
              color="secondary"
              onClick={this.open}
            >
              + Create Tasks
            </Button>
            <Button
              id="start-all-btn"
              style={{ borderWidth: 2, marginTop: '10px' }}
              variant="outlined"
              color="primary"
              onClick={(e) =>
                checkedKeys.length > 0
                  ? this.startAllTasks(checkedKeys)
                  : this.startAllTasks('all')
              }
            >
              Start {checkedKeys.length > 0 ? 'selected' : 'all'}
            </Button>
            <Button
              id="stop-all-btn"
              variant="outlined"
              justify="flex-end"
              color="primary"
              onClick={this.stopAllTasks}
              style={{ borderWidth: 2, marginTop: '10px' }}
            >
              Stop {checkedKeys.length > 0 ? 'selected' : 'all'}
            </Button>
            <Button
              id="edit-all-btn"
              variant="outlined"
              justify="flex-end"
              color="primary"
              style={{ borderWidth: 2, marginTop: '10px' }}
            >
              Edit {checkedKeys.length > 0 ? 'selected' : 'all'}
            </Button>

            <Button
              id="delete-all-btn"
              variant="outlined"
              justify="flex-end"
              color="primary"
              onClick={(event) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                checkedKeys.length >= 1
                  ? this.deleteSomeTasks(event, checkedKeys)
                  : this.deleteTasks();
              }}
              style={{ borderWidth: 2, marginTop: '10px' }}
            >
              Delete {checkedKeys.length > 0 ? 'selected' : 'all'}
            </Button>
          </div>
          <div
            style={{
              position: 'absolute',
              top: '190px',
              right: '10px',
              width: '79%',
            }}
          >
            <ContextMenuTrigger preventClose={false} id="SIMPLE">
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
              />
            </ContextMenuTrigger>
            <ContextMenu hideOnLeave id="SIMPLE">
              <MenuItem onClick={this.handleClick} data={{ item: 'item 1' }}>
                <Icon icon="play" style={{ color: 'springgreen' }} /> &nbsp;
                Start
              </MenuItem>
              <MenuItem onClick={this.handleClick} data={{ item: 'item 2' }}>
                <Icon icon="stop" /> &nbsp; Stop
              </MenuItem>
              <MenuItem divider />
              <MenuItem onClick={this.handleClick} data={{ item: 'item 3' }}>
                <Icon icon="copy" /> &nbsp; Duplicate
              </MenuItem>
              <MenuItem onClick={this.handleClick} data={{ item: 'item 4' }}>
                <Icon icon="edit2" style={{ color: 'mediumpurple' }} /> &nbsp;
                Edit
              </MenuItem>
              <MenuItem onClick={this.handleClick} data={{ item: 'item 5' }}>
                <Icon icon="trash2" style={{ color: 'crimson' }} /> &nbsp;
                Delete
              </MenuItem>
            </ContextMenu>
          </div>
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
              <rsuite.Button
                style={{ marginBottom: '2rem', marginLeft: '2rem' }}
                size="lg"
                color="blue"
              >
                <Icon icon="plus-square" /> Create Group
              </rsuite.Button>
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
                        Placeholder | 26 Tasks2.
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
        </div>
        <div>
          <span
            style={{
              bottom: '20px',
              position: 'absolute',
              color: 'springgreen',
              left: '4rem',
            }}
          >
            <Icon icon="circle" /> &nbsp; Connected
          </span>
          <span
            style={{
              bottom: '20px',
              position: 'absolute',
              color: 'springgreen',
              left: '12rem',
            }}
          >
            <Icon icon="code-fork" /> &nbsp; Version 1.1.17
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(TasksTable1);
