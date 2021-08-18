import React from 'react';
import {
  InputPicker,
  Button,
  Modal,
  Form,
  FormGroup,
  FormControl,
  Steps,
  IconButton,
  Icon,
  ButtonGroup,
  Toggle,
  InputGroup,
  Input,
} from 'rsuite';
import cogoToast from 'cogo-toast';

import Clock from 'react-live-clock';
import { connect } from 'react-redux';
import CreditCards from './CreditCard';

const { ipcRenderer } = require('electron');

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.state = {
      show: false,
      edit: false,
      step: 0,
      formValue: {
        id: null,
        profileName: '',
        email: '',
        cardName: '',
        cardNumber: '',
        cardCVV: '',
        cardExpiration: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        phone: '',
        zip: '',
        state: '',
        country: '',
        billingFirstName: '',
        billingLastName: '',
        billingAddress: '',
        billingCity: '',
        billingPhone: '',
        billingZip: '',
        billingState: '',
        billingCountry: '',
      },
    };
  }

  handleInputFocus = (e) => {
    this.setState({ focus: e.target.name });
  };

  handleInputChange = (event, name, value) => {
    this.setState((prevState) => ({
      ...prevState,
      name: value,
    }));
  };

  saveProfile = () => {
    ipcRenderer.send('set:profiles', this.state.formValue);
  };

  getProfiles = () => {
    const profiles = ipcRenderer.sendSync('get:profiles');
    console.log(profiles);
    this.props.dispatch({ type: 'update', obj: { profiles } });
  };

  componentDidMount() {
    this.getProfiles();
  }

  close = () => {
    this.setState({ show: false });
  };

  open = () => {
    this.setState({ show: true });
  };

  changeStep = (stepNow) => {
    const { formValue, step } = this.state;
    if (step == 0) {
      console.log('here');
      if (
        formValue.profileName &&
        formValue.email &&
        formValue.cardName &&
        formValue.cardNumber &&
        formValue.cardCVV &&
        formValue.cardExpiration
      ) {
        this.setState((prevState) => ({
          ...prevState,
          step: stepNow,
        }));
      } else {
        cogoToast.error(`Please fill all fields`, {
          position: 'top-right',
          heading: 'Error',
        });
      }
    } else if (step === 1) {
      if (
        formValue.firstName &&
        formValue.lastName &&
        formValue.address &&
        formValue.city &&
        formValue.phone &&
        formValue.zip &&
        formValue.state &&
        formValue.country
      ) {
        this.setState((prevState) => ({
          ...prevState,
          step: stepNow,
        }));
      } else {
        cogoToast.error(`Please fill all fields`, {
          position: 'top-right',
          heading: 'Error',
        });
      }
    } else if (step === 2) {
      if (
        formValue.billingFirstName &&
        formValue.billingLastName &&
        formValue.billingAddress &&
        formValue.billingCity &&
        formValue.billingPhone &&
        formValue.billingZip &&
        formValue.billingState &&
        formValue.billingCountry
      ) {
        this.setState((prevState) => ({
          ...prevState,
          step: stepNow,
        }));
      } else {
        cogoToast.error(`Please fill all fields`, {
          position: 'top-right',
          heading: 'Error',
        });
      }
    }
  };

  // make a function to edit the profile by making the id in formvalue known and then send that to ipcmain
  // open the modal and then send the id to ipcmain
  editProfile = (e, id) => {
    this.setState((prevState) => ({
      ...prevState,
      edit: true,
      formValue: this.props.state.profiles[id],
    }));
    this.open();
  };

  sendEditProfile = (id) => {
    ipcRenderer.send('edit:profile', this.state.formValue);
    this.close();
    this.clearState();
    this.getProfiles();
    cogoToast.success(`Edited Profile`, {
      position: 'top-right',
      heading: 'Success',
    });
  };

  clearState = () => {
    this.setState({
      show: false,
      edit: false,
      step: 0,
      CardCVC: '',
      CardExpiry: '',
      CardName: '',
      CardNumber: '',
      formValue: {
        id: null,
        profileName: '',
        email: '',
        cardName: '',
        cardNumber: '',
        cardCVV: '',
        cardExpiration: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        phone: '',
        zip: '',
        state: '',
        country: '',
        billingFirstName: '',
        billingLastName: '',
        billingAddress: '',
        billingCity: '',
        billingPhone: '',
        billingZip: '',
        billingState: '',
        billingCountry: '',
      },
    });
  };

  createProfile() {
    this.close();
    ipcRenderer.send('set:profiles', this.state.formValue);
    this.clearState();
    this.getProfiles();
  }

  search = (term) => {
    if (term !== '') {
      // change to profiles object
      const filteredProfiles = this.objectToArray(
        this.props.state.profiles
      ).filter((row) =>
        JSON.stringify(row).toLowerCase().includes(term.toLowerCase())
      );
      this.props.dispatch({
        type: 'update',
        obj: { filteredProfiles, profileSearch: true },
      });
    } else {
      this.props.dispatch({
        type: 'update',
        obj: { profileSearch: false },
      });
    }
  };

  objectToArray = (object) => {
    if (Array.isArray(object)) {
      return object;
    }
    const array = [];
    for (const property in object) {
      array.push(object[property]);
    }
    return array;
  };

  render() {
    const { formValue, step } = this.state;
    return (
      <>
        <Modal show={this.state.show} onHide={this.close} size="md">
          <Modal.Header>
            <Modal.Title>
              {this.state.edit ? 'Edit Profile' : 'Create a Profile'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ overflow: 'hidden' }}>
            <Steps
              style={{ marginLeft: '3rem', marginRight: '3rem' }}
              current={step}
            >
              <Steps.Item title="General" />
              <Steps.Item title="Shipping" />
              <Steps.Item title="Billing" />
            </Steps>
            <Form
              fluid
              // onChange={this.handleChange}
              onChange={(formValue) => {
                this.setState({ formValue });
                console.log(formValue);
              }}
              layout="inline"
              style={{ margin: 'auto', marginTop: '2rem', marginLeft: '4rem' }}
              formValue={formValue}
            >
              <h6>
                {step === 0
                  ? 'General Information'
                  : step === 1
                  ? 'Shipping Information'
                  : 'Billing Information'}
              </h6>
              {step === 0 ? (
                <>
                  <FormGroup>
                    <FormControl
                      name="profileName"
                      placeholder="Profile Name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControl name="email" placeholder="Email" />
                  </FormGroup>
                  <FormGroup>
                    <FormControl
                      name="cardName"
                      placeholder="Cardholder Name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControl name="cardNumber" placeholder="Card Number" />
                  </FormGroup>
                  <FormGroup>
                    <FormControl name="cardCVV" placeholder="CVV" />
                  </FormGroup>
                  <FormGroup>
                    <FormControl
                      name="cardExpiration"
                      placeholder="Exp 09/23"
                    />
                  </FormGroup>
                </>
              ) : step === 1 ? (
                <>
                  <FormGroup>
                    <FormControl name="firstName" placeholder="First Name" />
                  </FormGroup>
                  <FormGroup>
                    <FormControl name="lastName" placeholder="Last Name" />
                  </FormGroup>
                  <FormGroup>
                    <FormControl name="address" placeholder="Address" />
                  </FormGroup>
                  <FormGroup>
                    <FormControl name="city" placeholder="City" />
                  </FormGroup>
                  <FormGroup>
                    <FormControl name="phone" placeholder="Phone" />
                  </FormGroup>
                  <FormGroup>
                    <FormControl name="zip" placeholder="Zip Code" />
                  </FormGroup>
                  <div>
                    <FormGroup>
                      <FormControl
                        style={{ paddingRight: '2.4rem' }}
                        name="state"
                        placeholder="State"
                        accepter={InputPicker}
                        data={
                          formValue?.country
                            ? formValue?.country === 'USA'
                              ? states
                              : canadaProvinces
                            : []
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControl
                        style={{ paddingRight: '2.4rem', marginLeft: '1.3rem' }}
                        name="country"
                        placeholder="Country"
                        accepter={InputPicker}
                        data={[
                          {
                            label: 'United States',
                            value: 'USA',
                          },
                          {
                            label: 'Canada',
                            value: 'CA',
                          },
                        ]}
                      />
                    </FormGroup>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'inline-flex', width: '100%' }}>
                    <Toggle style={{ marginRight: '1rem' }} />
                    <div>Same Billing And Shipping</div>
                  </div>
                  <FormGroup>
                    <FormControl
                      name="billingFirstName"
                      placeholder="First Name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControl
                      name="billingLastName"
                      placeholder="Last Name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControl name="billingAddress" placeholder="Address" />
                  </FormGroup>
                  <FormGroup>
                    <FormControl name="billingCity" placeholder="City" />
                  </FormGroup>
                  <FormGroup>
                    <FormControl name="billingPhone" placeholder="Phone" />
                  </FormGroup>
                  <FormGroup>
                    <FormControl name="billingZip" placeholder="Zip Code" />
                  </FormGroup>
                  <div>
                    <FormGroup>
                      <FormControl
                        style={{ paddingRight: '2.4rem' }}
                        name="billingState"
                        placeholder="State"
                        accepter={InputPicker}
                        data={
                          formValue?.country
                            ? formValue?.country === 'USA'
                              ? states
                              : canadaProvinces
                            : []
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControl
                        style={{
                          paddingRight: '2.4rem',
                          marginLeft: '1.3rem',
                        }}
                        name="billingCountry"
                        placeholder="Country"
                        accepter={InputPicker}
                        data={[
                          {
                            label: 'United States',
                            value: 'USA',
                          },
                          {
                            label: 'Canada',
                            value: 'CA',
                          },
                        ]}
                      />
                    </FormGroup>
                  </div>
                </>
              )}
            </Form>

            <ButtonGroup style={{ marginLeft: '3rem' }}>
              <Button
                onClick={(e) => this.changeStep(step - 1)}
                disabled={step === 0}
                appearance="primary"
              >
                Previous
              </Button>
              <Button
                onClick={(e) => this.changeStep(step + 1)}
                disabled={step === 2}
                appearance="primary"
              >
                Next
              </Button>
            </ButtonGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={(e) => this.close()}
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
              onClick={
                !this.state.edit
                  ? (e) => this.createProfile()
                  : (e) => this.sendEditProfile(e)
              }
              style={{
                color: 'springgreen',
                border: '3px solid springgreen',
              }}
              appearance="ghost"
            >
              {!this.state.edit ? 'Create' : 'Edit'}
            </Button>
          </Modal.Footer>
        </Modal>
        <div
          className="SettingsPage"
          style={{
            width: '90%',
            height: '90%',
            position: 'absolute',
            top: '50px',
            left: '8%',
            overflowY: 'auto',
          }}
        >
          <h5>Profiles</h5>

          <Clock
            format="HH:mm:ss"
            interval={1000}
            ticking
            style={{ position: 'absolute', top: '-25px', fontSize: '1rem' }}
          />
          <div style={{ display: 'flex' }}>
            <IconButton
              onClick={this.open}
              icon={<Icon icon="plus" />}
              appearance="primary"
            />
            <InputGroup
              inside
              style={{
                width: 300,
                marginBottom: 10,
                marginTop: 11,
              }}
            >
              <InputGroup.Button>
                <Icon icon="search" />
              </InputGroup.Button>
              <Input placeholder="Search Profiles" onChange={this.search} />
            </InputGroup>
          </div>
          <div
            style={{
              display: 'grid',
              flexWrap: 'wrap',
              marginRight: '2rem',
              marginLeft: '-2rem',
              gridTemplateColumns: 'repeat(auto-fill,minmax(300px, 4fr))',
            }}
          >
            {Object.keys(this.props.state.profiles).length ? (
              this.objectToArray(
                !this.props.state.profileSearch
                  ? this.props.state.profiles
                  : this.props.state.filteredProfiles
              ).map((row) => (
                <CreditCards
                  style={{
                    color: 'white',
                    backgroundColor: '#292c3e',
                    width: '17rem',
                    height: '15rem',
                    position: 'relative',
                    marginRight: '2rem',
                    flex: '0 0 25%',
                  }}
                  onEditClick={this.editProfile}
                  key={row.id}
                  cvc={row.cardCVV}
                  expiry={row.cardExpiration}
                  name={row.profileName}
                  number={row.cardNumber}
                  profileID={row.id}
                />
              ))
            ) : (
              <> </>
            )}
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(Profile);
const data = [
  {
    label: 'United States',
    value: 'United States',
    role: 'Master',
  },
  {
    label: 'Canada',
    value: 'Canada',
    role: 'Master',
  },
  {
    label: 'Cashapp',
    value: 'Louisa',
    role: 'Master',
  },
  {
    label: 'Eno',
    value: 'Marty',
    role: 'Master',
  },
  {
    label: 'Privacy',
    value: 'Kenya',
    role: 'Master',
  },
  {
    label: 'Slut',
    value: 'Hal',
    role: 'Developer',
  },
  {
    label: 'Julius',
    value: 'Julius',
    role: 'Developer',
  },
];

const canadaProvinces = [
  {
    value: 'Ontario',
    label: 'Ontario',
  },
  {
    value: 'Quebec',
    label: 'Quebec',
  },
  {
    value: 'Nova Scotia',
    label: 'Nova Scotia',
  },
  {
    value: 'New Brunswick',
    label: 'New Brunswick',
  },
  {
    value: 'British Columbia',
    label: 'British Columbia',
  },
  {
    value: 'Prince Edward Island',
    label: 'Prince Edward Island',
  },
  {
    value: 'Saskatchewan',
    label: 'Saskatchewan',
  },
  {
    value: 'Alberta',
    label: 'Alberta',
  },
  {
    value: 'Newfoundland and Labrador',
    label: 'Newfoundland and Labrador',
  },
];

const states = [
  {
    label: 'Alabama',
    value: 'Alabama',
    role: 'Alabama',
  },
  {
    label: 'Alaska',
    value: 'Alaska',
    role: 'Alaska',
  },
  {
    label: 'Arizona',
    value: 'Arizona',
    role: 'Arizona',
  },
  {
    label: 'Arkansas',
    value: 'Arkansas',
    role: 'Arkansas',
  },
  {
    label: 'California',
    value: 'California',
    role: 'California',
  },
  {
    label: 'Colorado',
    value: 'Colorado',
    role: 'Colorado',
  },
  {
    label: 'Connecticut',
    value: 'Connecticut',
    role: 'Connecticut',
  },
  {
    label: 'Delaware',
    value: 'Delaware',
    role: 'Delaware',
  },
  {
    label: 'Florida',
    value: 'Florida',
    role: 'Florida',
  },
  {
    label: 'Georgia',
    value: 'Georgia',
    role: 'Georgia',
  },
  {
    label: 'Idaho',
    value: 'Idaho',
    role: 'Idaho',
  },
  {
    label: 'Hawaii',
    value: 'Hawaii',
    role: 'Hawaii',
  },
  {
    label: 'Illinois',
    value: 'Illinois',
    role: 'Illinois',
  },
  {
    label: 'Indiana',
    value: 'Indiana',
    role: 'Indiana',
  },
  {
    label: 'Iowa',
    value: 'Iowa',
    role: 'Iowa',
  },
  {
    label: 'Kansas',
    value: 'Kansas',
    role: 'Kansas',
  },
  {
    label: 'Kentucky',
    value: 'Kentucky',
    role: 'Kentucky',
  },
  {
    label: 'Louisiana',
    value: 'Louisiana',
    role: 'Louisiana',
  },
  {
    label: 'Maine',
    value: 'Maine',
    role: 'Maine',
  },
  {
    label: 'Maryland',
    value: 'Maryland',
    role: 'Maryland',
  },
  {
    label: 'Massachusetts',
    value: 'Massachusetts',
    role: 'Massachusetts',
  },
  {
    label: 'Michigan',
    value: 'Michigan',
    role: 'Michigan',
  },
  {
    label: 'Minnesota',
    value: 'Minnesota',
    role: 'Minnesota',
  },
  {
    label: 'Mississippi',
    value: 'Mississippi',
    role: 'Mississippi',
  },
  {
    label: 'Missouri',
    value: 'Missouri',
    role: 'Missouri',
  },
  {
    label: 'Montana',
    value: 'Montana',
    role: 'Montana',
  },
  {
    label: 'Nebraska',
    value: 'Nebraska',
    role: 'Nebraska',
  },
  {
    label: 'Nevada',
    value: 'Nevada',
    role: 'Nevada',
  },
  {
    label: 'New Hampshire',
    value: 'New Hampshire',
    role: 'New Hampshire',
  },
  {
    label: 'New Jersey',
    value: 'New Jersey',
    role: 'New Jersey',
  },
  {
    label: 'New Mexico',
    value: 'New Mexico',
    role: 'New Mexico',
  },
  {
    label: 'New York',
    value: 'New York',
    role: 'New York',
  },
  {
    label: 'North Carolina',
    value: 'North Carolina',
    role: 'North Carolina',
  },
  {
    label: 'North Dakota',
    value: 'North Dakota',
    role: 'North Dakota',
  },
  {
    label: 'Ohio',
    value: 'Ohio',
    role: 'Ohio',
  },
  {
    label: 'Oklahoma',
    value: 'Oklahoma',
    role: 'Oklahoma',
  },
  {
    label: 'Oregon',
    value: 'Oregon',
    role: 'Oregon',
  },
  {
    label: 'Pennsylvania',
    value: 'Pennsylvania',
    role: 'Pennsylvania',
  },
  {
    label: 'Rhode Island',
    value: 'Rhode Island',
    role: 'Rhode Island',
  },
  {
    label: 'South Carolina',
    value: 'South Carolina',
    role: 'South Carolina',
  },
  {
    label: 'South Dakota',
    value: 'South Dakota',
    role: 'South Dakota',
  },
  {
    label: 'Tennessee',
    value: 'Tennessee',
    role: 'Tennessee',
  },
  {
    label: 'Texas',
    value: 'Texas',
    role: 'Texas',
  },
  {
    label: 'Utah',
    value: 'Utah',
    role: 'Utah',
  },
  {
    label: 'Vermont',
    value: 'Vermont',
    role: 'Vermont',
  },
  {
    label: 'Virginia',
    value: 'Virginia',
    role: 'Virginia',
  },
  {
    label: 'Washington',
    value: 'Washington',
    role: 'Washington',
  },
  {
    label: 'West Virginia',
    value: 'West Virginia',
    role: 'West Virginia',
  },
  {
    label: 'Wisconsin',
    value: 'Wisconsin',
    role: 'Wisconsin',
  },
  {
    label: 'Wyoming',
    value: 'Wyoming',
    role: 'Wyoming',
  },
  {
    label: 'DC',
    value: 'DC',
    role: 'DC',
  },
  {
    label: 'Puerto Rico',
    value: 'Puerto Rico',
    role: 'Puerto Rico',
  },
];
