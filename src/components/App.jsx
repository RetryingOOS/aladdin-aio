import React from 'react';
import { Button } from '@material-ui/core';
import '../app.css';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Chip from '@material-ui/core/Chip';
import { connect } from 'react-redux';
import {
  Icon,
  InputPicker,
  Table,
  Modal,
  Checkbox,
  Avatar,
  Form,
  InputGroup,
  Input,
  FormGroup,
  FormControl,
  ControlLabel,
  Panel,
  IconButton,
  Button as RsuiteButton,
  Dropdown,
} from 'rsuite';
import cogoToast from 'cogo-toast';
// import { datadogLogs } from '@datadog/browser-logs';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Clock from 'react-live-clock';

const { ipcRenderer } = require('electron');

const { Column, HeaderCell, Cell } = Table;

function passwordGenerator() {
  return Math.random().toString(25).substr(2, 6).toUpperCase();
}
const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
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
class TasksTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      selectedTaskGroup: '',
      taskGroup: false,
      formValue: {
        id: passwordGenerator(),
        taskGroupID: '',
        store: '',
        mode: '',
        profile: '',
        proxy: '',
        size: '',
        keywords: '',
        color: '',
        account: null,
        monitorDelay: 3000,
        checkoutDelay: 3000,
        status: {
          status: 'Idle',
          statusColor: '#f2f2f2',
        },
      },
      taskGroupForm: {
        id: passwordGenerator(),
        store: '',
        groupName: '',
        tasks: 0,
      },
    };
  }

  handleCheckAll = (value, checked) => {
    const checkedKeys = checked
      ? this.props.state.tasks.map((item) => item.id)
      : [];
    this.props.dispatch({ type: 'update', obj: { checkedKeys } });
  };

  handleCheck = (value, checked, event) => {
    event.preventDefault();
    if (event.nativeEvent.shiftKey) {
      console.log('Shift Key');
    }
    const { checkedKeys } = this.props.state;
    const nextCheckedKeys = checked
      ? [...checkedKeys, value]
      : checkedKeys.filter((item) => item !== value);
    this.props.dispatch({
      type: 'update',
      obj: { checkedKeys: nextCheckedKeys },
    });
  };

  getProfiles = () => {
    const profiles = ipcRenderer.sendSync('get:profiles');
    this.props.dispatch({ type: 'update', obj: { profiles } });
  };

  close = () => {
    this.setState({ show: false });
  };

  open = () => {
    this.setState({ show: true });
  };

  taskStatusColor = (status) => {
    switch (status) {
      case 'Idle':
        return 'white';
      case 'Successful Checkout':
      case 'Checked Out':
        return 'springgreen';
      case 'Adding to Cart':
        return '#0ee3c3';
      case 'Starting Task':
      case 'Submitting Shipping':
      case 'Submitting Billing':
      case 'Calculating Taxes':
      case 'Visiting Home Page':
        return '#4287f5';
      case 'Checking Out':
        return '#e3bc0e';
      case 'Stopped':
        return '#ff6b6b';
      default:
        return 'white';
    }
  };

  getTasks = () => {
    const tasks = ipcRenderer.sendSync('get:tasks');
    this.props.dispatch({ type: 'update', obj: { tasks } });
  };

  search = (term) => {
    if (term !== '') {
      const filteredTasks = this.props.state.tasks.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(term.toLowerCase())
      );
      this.props.dispatch({
        type: 'update',
        obj: { filteredTasks, search: true },
      });
    } else {
      this.props.dispatch({
        type: 'update',
        obj: { search: false },
      });
    }
  };

  startTask = (task) => {
    ipcRenderer.send('start:tasks', task);
    this.props.dispatch({ type: 'set-active-tasks', obj: { activeTasks: task.id } });
  };

  stopTasks = (task) => {
    ipcRenderer.send('stop:tasks', task);
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

  arrayToLabel = (array) => {
    const labels = [];
    for (const i in array) {
      labels.push({ value: array[i].id, label: array[i].profileName });
    }
    return labels;
  };

  componentDidMount() {
    this.getTasks();
    this.getProfiles();
    this.getTaskGroups();
    this.getSessions();
    this.getProxies();
    this.getAccounts();
  }

  getTaskGroups = () => {
    const taskGroups = ipcRenderer.sendSync('get:taskgroups');
    this.props.dispatch({ type: 'update', obj: { taskGroups } });
    this.setState((prevState) => ({
      ...prevState,
      selectedTaskGroup: taskGroups[0]?.id,
    }));
  };

  getSessions = () => {
    const sessions = ipcRenderer.sendSync('get:sessions');
    this.props.dispatch({ type: 'update', obj: { sessions } });
  };

  getProxies = () => {
    const proxies = ipcRenderer.sendSync('get:proxies');
    this.props.dispatch({ type: 'update', obj: { proxies } });
  };

  getAccounts = () => {
    const accounts = ipcRenderer.sendSync('get:accounts');
    this.props.dispatch({ type: 'update', obj: { accounts } });
  };

  deleteTasks = (e, taskGroupID) => {
    ipcRenderer.sendSync('delete:tasks', taskGroupID);
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
    this.props.dispatch({
      type: 'update',
      obj: { checkedKeys: [] },
    });
  };

  createTasks = (event) => {
    event.preventDefault();
    const tasks = [];
    for (let i = 0; i < this.state.formValue.quantity; i++) {
      tasks.push({
        id: passwordGenerator(),
        taskGroupID: this.state.selectedTaskGroup,
        store: this.capitalizeFirstLetter(
          this.props.state.taskGroups.filter(
            (item) => item?.id === this.state?.selectedTaskGroup
          )[0]?.store
        ),
        mode: this.state.formValue.mode,
        profile: this.state.formValue.profile,
        proxy: this.state.formValue.proxy || 'local',
        sku: this.state.formValue.sku,
        session: this.state.formValue.session,
        proxyName:
          this.props.state.proxies[this.state.formValue.proxy]?.name || 'local',
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
    cogoToast.success(
      `Created ${
        this.state.formValue.quantity > 1 ? this.state.formValue.quantity : ''
      } Tasks`,
      {
        position: 'top-right',
        heading: 'Success',
      }
    );
    this.getTasks();
  };

  startAllTasks = (tasks) => {
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

  stopAllTasks = (tasks) => {
    if (tasks === 'all') {
      for (const t in this.props.state.tasks) {
        const task = this.props.state.tasks[t];
        this.stopTasks(task);
      }
    } else {
      for (const t in this.props.state.tasks) {
        if (tasks.includes(this.props.state.tasks[t].id)) {
          this.stopTasks(this.props.state.tasks[t]);
        }
      }
    }
  };

  capitalizeFirstLetter(string) {
    try {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } catch (e) {
      return string;
    }
  }

  height = () => {
    const height = window.innerHeight;
    return Math.round(0.75 * height);
  };

  createTaskGroup = () => {
    this.setState((prevState) => ({
      ...prevState,
      taskGroup: true,
    }));
    this.open();
  };

  sendTaskGroup = (e) => {
    const { taskGroupForm } = this.state;
    if (taskGroupForm.groupName && taskGroupForm.store) {
      ipcRenderer.send('create:taskgroup', this.state.taskGroupForm);
      this.setState((prevState) => ({
        ...prevState,
        taskGroupForm: {
          id: passwordGenerator(),
          store: '',
          groupName: '',
          tasks : 0,
        },
      }));
      this.close();
      this.getTaskGroups();
    } else {
      cogoToast.error('Please fill in all fields', {
        position: 'top-right',
        heading: 'Error',
      });
    }
  };

  setSelectedTaskgroup(id) {
    this.setState((prevState) => ({
      ...prevState,
      selectedTaskGroup: id,
    }));
  }

  deleteTaskGroup = (e, id) => {
    ipcRenderer.send('delete:taskgroup', id);
    this.getTaskGroups();
    this.getTasks();
  };

  getSessionsArray = (site) => {
    const sessions = this.props.state.sessions[site];
    const array = [];
    for (const property in sessions) {
      const accountName = this.props.state.accounts[site].filter(
        (item) => item.id === sessions[property].account
      )[0].alias;
      array.push({
        value: sessions[property].id,
        label: accountName,
      });
    }
    return array;
  };

  getProxiesArray = () => {
    const { proxies } = this.props.state;
    const array = [];
    for (const property in proxies) {
      array.push({
        value: proxies[property].id,
        label: proxies[property].name,
      });
    }
    return array;
  };

  returnModal = (site) => {
    console.log(site);
    if (site === 'amazon') {
      return (
        <>
          <FormGroup style={{ marginLeft: '5%' }}>
            <ControlLabel>SKU</ControlLabel>
            <FormControl
              style={{ width: 'auto' }}
              name="sku"
              placeholder="SKU"
            />
          </FormGroup>
          <FormGroup style={{ marginLeft: '5%' }}>
            <ControlLabel>Mode</ControlLabel>
            <FormControl
              name="mode"
              placeholder="Mode"
              accepter={InputPicker}
              data={this.props.state.siteToModes[site] ?? []}
            />
          </FormGroup>
          <FormGroup style={{ marginLeft: '5%' }}>
            <ControlLabel>Session</ControlLabel>
            <FormControl
              name="session"
              data={this.getSessionsArray(site)}
              accepter={InputPicker}
            />
          </FormGroup>
          <FormGroup style={{ position: 'absolute', top: '0%', left: '60%' }}>
            <ControlLabel>Proxy</ControlLabel>
            <FormControl
              name="proxy"
              data={this.getProxiesArray()}
              placeholder="Proxy"
              accepter={InputPicker}
            />
          </FormGroup>
          <FormGroup style={{ position: 'absolute', top: '30%', left: '60%' }}>
            <ControlLabel>Task Quantity</ControlLabel>
            <FormControl name="quantity" placeholder="Quantity" />
          </FormGroup>
        </>
      );
    }
    if (site === 'target') {
      return (
        <>
          <FormGroup style={{ marginLeft: '5%' }}>
            <ControlLabel>SKU</ControlLabel>
            <FormControl
              style={{ width: 'auto' }}
              name="sku"
              placeholder="SKU"
            />
          </FormGroup>
          <FormGroup style={{ marginLeft: '5%' }}>
            <ControlLabel>Mode</ControlLabel>
            <FormControl
              name="mode"
              placeholder="Mode"
              accepter={InputPicker}
              data={this.props.state.siteToModes[site] ?? []}
            />
          </FormGroup>
          <FormGroup style={{ marginLeft: '5%' }}>
            <ControlLabel>Session</ControlLabel>
            <FormControl
              name="session"
              data={this.getSessionsArray(site)}
              accepter={InputPicker}
            />
          </FormGroup>
          <FormGroup style={{ position: 'absolute', top: '0%', left: '60%' }}>
            <ControlLabel>Proxy</ControlLabel>
            <FormControl
              name="proxy"
              data={this.getProxiesArray()}
              placeholder="Proxy"
              accepter={InputPicker}
            />
          </FormGroup>
          <FormGroup style={{ position: 'absolute', top: '30%', left: '60%' }}>
            <ControlLabel>Task Quantity</ControlLabel>
            <FormControl name="quantity" placeholder="Quantity" />
          </FormGroup>
        </>
      );
    }

    if (site === 'bestbuy') {
      return (
        <>
          <FormGroup style={{ marginLeft: '5%' }}>
            <ControlLabel>SKU</ControlLabel>
            <FormControl
              style={{ width: 'auto' }}
              name="sku"
              placeholder="SKU"
            />
          </FormGroup>
          <FormGroup style={{ marginLeft: '5%' }}>
            <ControlLabel>Mode</ControlLabel>
            <FormControl
              name="mode"
              placeholder="Mode"
              accepter={InputPicker}
              data={this.props.state.siteToModes[site] ?? []}
            />
          </FormGroup>
          <FormGroup style={{ position: 'absolute', top: '0%', left: '60%' }}>
            <ControlLabel>Proxy</ControlLabel>
            <FormControl
              name="proxy"
              data={this.getProxiesArray()}
              placeholder="Proxy"
              accepter={InputPicker}
            />
          </FormGroup>
          <FormGroup style={{ position: 'absolute', top: '44%', left: '60%' }}>
            <ControlLabel>Task Quantity</ControlLabel>
            <FormControl name="quantity" placeholder="Quantity" />
          </FormGroup>
        </>
      );
    }
  };

  render() {
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
    const { formValue, taskGroupForm } = this.state;

    return (
      <div>
        <div>
          <Modal show={this.state.show} onHide={this.close} size="md">
            <Modal.Header>
              <Modal.Title>
                Create {this.state.taskGroup ? 'Task Group' : 'Tasks'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {!this.state.taskGroup ? (
                <Form
                  fluid
                  onChange={(formValue) => {
                    this.setState({ formValue });
                    console.log(formValue);
                  }}
                  formValue={formValue}
                >
                  {this.returnModal(
                    this.props.state.taskGroups.filter(
                      (item) => item?.id === this.state?.selectedTaskGroup
                    )[0]?.store
                  )}
                  {/* <FormGroup style={{ marginLeft: '5%' }}>
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
                      data={this.arrayToLabel(this.props.state.profiles)}
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
                      data={this.props.state.siteToModes[formValue.site] ?? []}
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
                  </FormGroup> */}
                </Form>
              ) : (
                <Form
                  fluid
                  onChange={(taskGroupForm) => {
                    this.setState({ taskGroupForm });
                    console.log(taskGroupForm);
                  }}
                  formValue={taskGroupForm}
                >
                  <FormGroup style={{ marginLeft: '5%' }}>
                    <ControlLabel>Site</ControlLabel>
                    <FormControl
                      name="store"
                      placeholder="Site"
                      data={this.props.state.sites}
                      accepter={InputPicker}
                    />
                  </FormGroup>

                  <FormGroup
                    style={{ position: 'absolute', top: '0', left: '60%' }}
                  >
                    <ControlLabel>Group Name</ControlLabel>
                    <FormControl name="groupName" placeholder="Name" />
                  </FormGroup>
                </Form>
              )}
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
                onClick={(event) =>
                  !this.state.taskGroup
                    ? this.createTasks(event)
                    : this.sendTaskGroup(event)
                }
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
            width: '75%',
            right: '0',
            float: 'right',
            fontSize: '22px',
          }}
        >
          <Avatar
            style={{ marginRight: '1rem', top: '0.5rem', position: 'absolute' }}
            size="lg"
            src={
              this.props.state.siteToImages[
                this.props.state.taskGroups.filter(
                  (item) => item?.id === this.state?.selectedTaskGroup
                )[0]?.store
              ]
            }
          />
          <span
            style={{
              marginLeft: '4.75rem',
              top: '0rem',
              position: 'absolute',
            }}
          >
            {
              this.props.state.taskGroups.filter(
                (item) => item?.id === this.state?.selectedTaskGroup
              )[0]?.groupName
            }{' '}
            Task Group | Task Count:{' '}
            {
              this.props.state.tasks.filter(
                (item) => item?.taskGroupID === this.state?.selectedTaskGroup
              ).length
            }{' '}
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
            <Input
              style={{
                float: 'right',
                position: 'absolute',
                left: '120%',
                top: '-24%',
                width: '172%',
                border: '3px ​solid #3c3f4',
              }}
              onChange={this.search}
              placeholder="Search"
            />
          </span>
          <div style={{ position: 'absolute', top: '10px', right: '60px' }}>
            <InputGroup style={{ width: '6rem' }}>
              <InputGroup.Addon>
                <Icon icon="check-circle" style={{ color: 'springgreen' }} />
              </InputGroup.Addon>
              <Input value="0" disabled />
            </InputGroup>
          </div>
          <div style={{ position: 'absolute', top: '10px', right: '220px' }}>
            <InputGroup style={{ width: '6rem' }}>
              <InputGroup.Addon>
                <Icon icon="shopping-cart" style={{ color: 'mediumpurple' }} />
              </InputGroup.Addon>
              <Input value="0" disabled />
            </InputGroup>
          </div>
          <div style={{ position: 'absolute', top: '10px', right: '380px' }}>
            <InputGroup style={{ width: '6rem' }}>
              <InputGroup.Addon>
                <Icon icon="warning" style={{ color: 'crimson' }} />
              </InputGroup.Addon>
              <Input value="0" disabled />
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
              width: '75%',
              float: 'right',
            }}
          >
            <Button
              id="create-tasks-btn"
              style={{ borderWidth: 2, marginTop: '10px' }}
              variant="contained"
              color="secondary"
              onClick={(e) => {
                this.setState((prevState) => ({
                  ...prevState,
                  taskGroup: false,
                }));
                this.open();
              }}
            >
              + Create Tasks
            </Button>
            <Button
              id="start-all-btn"
              style={{ borderWidth: 2, marginTop: '10px' }}
              variant="contained"
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
              variant="contained"
              justify="flex-end"
              color="primary"
              onClick={(e) =>
                checkedKeys.length > 0
                  ? this.stopAllTasks(checkedKeys)
                  : this.stopAllTasks('all')
              }
              style={{ borderWidth: 2, marginTop: '10px' }}
            >
              Stop {checkedKeys.length > 0 ? 'selected' : 'all'}
            </Button>
            <Button
              id="edit-all-btn"
              variant="contained"
              justify="flex-end"
              color="primary"
              style={{ borderWidth: 2, marginTop: '10px' }}
            >
              Edit {checkedKeys.length > 0 ? 'selected' : 'all'}
            </Button>

            <Button
              id="delete-all-btn"
              variant="contained"
              justify="flex-end"
              color="primary"
              onClick={(event) => {
                checkedKeys.length >= 1
                  ? this.deleteSomeTasks(event, checkedKeys)
                  : this.deleteTasks(event, this.state.selectedTaskGroup);
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
              width: '75%',
            }}
          >
            {/* <ContextMenuTrigger preventClose={false} id="SIMPLE"> */}
              <Table
                height={this.height()}
                data={
                  !this.props.state.search
                    ? this.props.state.tasks.filter(
                        (item) =>
                          item.taskGroupID === this.state.selectedTaskGroup
                      )
                    : this.props.state.filteredTasks.filter(
                        (item) =>
                          item.taskGroupID === this.state.selectedTaskGroup
                      )
                }
                // data={this.props.state.tasks}
                virtualized
                // onRowClick={(rowData) => {
                //   console.log(rowData.id);
                // }}
                shouldUpdateScroll={false}
                renderEmpty={() => (
                  <div
                    style={{
                      fontSize: '20px',
                      top: '40%',
                      width: '100%',
                      textAlign: 'center',
                      display: 'block',
                      lineHeight: '40px',
                      position: 'absolute',
                      fontWeight: 'bold',
                    }}
                  >
                    Create Tasks to Get Started 😎
                  </div>
                )}
              >
                <Column width={50} align="center">
                  <HeaderCell style={{ padding: 0 }}>
                    <div style={{ lineHeight: '40px' }}>
                      <Checkbox
                        inline
                        checked={checked}
                        indeterminate={indeterminate}
                        onChange={this.handleCheckAll}
                      />
                    </div>
                  </HeaderCell>
                  <CheckCell
                    dataKey="id"
                    checkedKeys={checkedKeys}
                    onChange={this.handleCheck}
                  />
                </Column>
                <Column width={120} align="center">
                  <HeaderCell>ID</HeaderCell>
                  <Cell dataKey="id" />
                </Column>

                <Column width={130}>
                  <HeaderCell>Store</HeaderCell>
                  <Cell dataKey="store" />
                </Column>

                <Column width={180}>
                  <HeaderCell>Product</HeaderCell>
                  <Cell dataKey="sku" />
                </Column>

                <Column width={100}>
                  <HeaderCell>Proxy</HeaderCell>
                  <Cell dataKey="proxyName" />
                </Column>

                <Column width={150}>
                  <HeaderCell>Mode</HeaderCell>
                  <Cell dataKey="mode" />
                </Column>

                <Column width={220}>
                  <HeaderCell>Status</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      return (
                        <span
                          style={{
                            color: `${this.taskStatusColor(
                              this.props.state.statuses[rowData.id]
                            )}`,
                          }}
                        >
                          {this.props.state.statuses[rowData.id]
                            ? this.props.state.statuses[rowData.id]
                            : 'Idle'}
                        </span>
                      );
                    }}
                  </Cell>
                </Column>
                <Column width={120} fixed="right">
                  <HeaderCell>Actions</HeaderCell>
                  <Cell>
                    {(rowData) => {
                      return (
                        <span>
                          <Icon
                            icon="trash2"
                            size="lg"
                            style={{ color: 'crimson', paddingRight: '20px' }}
                            onClick={(e) =>
                              this.deleteSomeTasks(e, [rowData.id])
                            }
                          />
                          <Icon
                            icon="pencil"
                            size="lg"
                            style={{ color: 'white', paddingRight: '20px' }}
                            // onClick={(e) => {
                            //   datadogLogs.logger.info('Checkout', {
                            //     name: 'Amazon',
                            //     service: 'Aladdin AIO',
                            //     env: 'dev',
                            //     sku: 'BHA32SDAS',
                            //     site: 'Bestbuy',
                            //     mode: 'Fast',
                            //   });
                            // }}
                          />
                          <Icon
                            icon={this.props.state.activeTasks.includes(rowData.id) ? 'stop2' : 'play'}
                            size="lg"
                            style={{
                              color: `${
                                this.props.state.activeTasks.includes(rowData.id) ? 'white' : 'springgreen'
                              }`,
                              paddingRight: '5px',
                            }}
                            onClick={(e) => this.startTask(rowData)}
                          />
                        </span>
                      );
                    }}
                  </Cell>
                </Column>
              </Table>
            {/* </ContextMenuTrigger> */}
            {/* <ContextMenu hideOnLeave id="SIMPLE">
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
            </ContextMenu> */}
          </div>
          <div
            className="TaskGroup"
            style={{
              width: '18%',
              position: 'absolute',
              top: '-25px',
              left: '4.5%',
              overflowY: 'scroll',
              display: 'block',
              height: '88%',
              marginTop: '80px',
              overflowX: 'hidden',
            }}
          >
            <div>
              <>
                {' '}
                <div
                  style={{
                    fontSize: '20px',
                    margin: 'auto',
                    textAlign: 'center',
                  }}
                >
                  Task Groups
                </div>
                <RsuiteButton
                  style={{ marginBottom: '2rem', left: '20%' }}
                  size="lg"
                  color="blue"
                  onClick={this.createTaskGroup}
                >
                  <Icon icon="plus-square" /> Create Group
                </RsuiteButton>
              </>
              {this.props.state?.taskGroups.length ? (
                this.props.state?.taskGroups.map((row) => (
                  <div
                    style={{
                      backgroundColor: 'rgb(41, 44, 62)',
                      marginBottom: '10px',
                      float: 'left',
                      width: '97%',
                      height: '50%',
                      border: `${
                        this.state?.selectedTaskGroup === row?.id
                          ? '2px solid #92ade0'
                          : 'none'
                      }`,
                    }}
                    key={row?.id}
                    onClick={(e) => this.setSelectedTaskgroup(row?.id)}
                  >
                    <div>
                      <Panel shaded bordered>
                        <div style={{ float: 'right' }}>
                          <Dropdown
                            placement="leftStart"
                            renderTitle={() => {
                              return (
                                <IconButton
                                  style={{
                                    float: 'right',
                                    position: 'static',
                                    background: 'transparent',
                                  }}
                                  size="lg"
                                  icon={<Icon icon="ellipsis-h" />}
                                />
                              );
                            }}
                          >
                            <Dropdown.Item
                              onSelect={(e) => this.deleteTaskGroup(e, row?.id)}
                            >
                              <Icon icon="trash2" /> Delete Group
                            </Dropdown.Item>
                            {/* <Dropdown.Item>
                              <Icon icon="group" /> Rename Group
                            </Dropdown.Item> */}
                          </Dropdown>
                        </div>
                        <div>
                          <div style={{ display: '-webkit-box' }}>
                            <img
                              alt=""
                              width="40"
                              src={this.props.state.siteToImages[row?.store]}
                            />

                            <Typography
                              style={{ marginTop: '3%', marginLeft: '5%' }}
                              component="h2"
                              variant="subtitle1"
                            >
                              {row?.groupName}
                            </Typography>
                          </div>
                        </div>

                        {/* <Chip
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
                        /> */}
                      </Panel>
                    </div>
                  </div>
                ))
              ) : (
                <> </>
              )}
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
            <Icon icon="code-fork" /> &nbsp; Version 1.0.1
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(TasksTable);
