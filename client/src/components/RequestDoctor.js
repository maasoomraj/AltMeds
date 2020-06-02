import React, { Component } from "react";
import MasoomContract from "../contracts/MasoomContract.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import { FormGroup, FormControl,Button } from 'react-bootstrap';

class RequestDoctor extends Component {
  constructor(props) {
    super(props)

    this.state = {
        MasoomInstance: undefined,
        account: null,
        web3: null,
        name:'',
        registerationId:'',
        hospital:'',
        college:'',
        field:'',
        registered: false,
        isOwner:false
    }
  }

  updateName = event => {
    this.setState({ name : event.target.value});
  }

  updateRegisterationId = event => {
    this.setState({registerationId : event.target.value});
  }

  updateHospital = event => {
    this.setState({hospital : event.target.value});
  }

  updateCollege = event => {
    this.setState({college : event.target.value});
  }

  updateField = event => {
    this.setState({field : event.target.value});
  }

  addDoctor = async () => {
    await this.state.MasoomInstance.methods.requestDoctor(this.state.name, this.state.registerationId, this.state.hospital, this.state.college, this.state.field).send({from : this.state.account , gas: 1000000});
    // Reload
    window.location.reload(false);
  }

  componentDidMount = async () => {
    // FOR REFRESHING PAGE ONLY ONCE -
    if(!window.location.hash){
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MasoomContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MasoomContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ MasoomInstance: instance, web3: web3, account: accounts[0] });

    //   console.log("doc1");
      let doctorCount = await this.state.MasoomInstance.methods.getDoctorCount().call();
    //   console.log("doc2");
      console.log(doctorCount);
      let registered;
      for(let i=0;i<doctorCount;i++){
          let doctorAddress = await this.state.MasoomInstance.methods.doctors(i).call();
          if(doctorAddress === this.state.account){
            registered = true;
            break;
          }
      }

      this.setState({ registered : registered});

      const owner = await this.state.MasoomInstance.methods.getOwner().call();
      if(this.state.account === owner){
        this.setState({isOwner : true});
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return (
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
            Loading Web3, accounts, and contract..
            </h1>
          </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }

    if(this.state.registered){
      return(
        <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
          ALREADY REQUESTED TO REGISTER
          </h1>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
      </div>
      );
    }
    return (
      <div className="App">
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              VOTER FORM
            </h1>
          </div>
        </div>

        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="form">
        <FormGroup>
            <div className="form-label">Enter Name - </div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.name}
                  onChange={this.updateName}
              />
            </div>
        </FormGroup>

        <FormGroup>
            <div className="form-label">Enter Registeration ID - </div>
            <div className="form-input">
              <FormControl
                  input = 'textArea'
                  value = {this.state.registerationId}
                  onChange={this.updateRegisterationId}
              />
            </div>
        </FormGroup>

        <FormGroup>
            <div className="form-label">Enter Hospital - </div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.hospital}
                  onChange={this.updateHospital}
              />
            </div>
        </FormGroup>

        <FormGroup>
            <div className="form-label">Enter Qualification - </div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.college}
                  onChange={this.updateCollege}
              />
            </div>
        </FormGroup>

        <FormGroup>
            <div className="form-label">Enter Your Field - </div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.field}
                  onChange={this.updateField}
              />
            </div>
        </FormGroup>
        <Button onClick={this.addDoctor}  className="button-vote">
          Request to Add Doctor
        </Button>
        </div>


      </div>
    );
  }
}

export default RequestDoctor;

