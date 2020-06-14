import React, { Component } from "react";
import MasoomContract from "../contracts/MasoomContract.json";
import getWeb3 from "../getWeb3";

import { Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import '../index.css';

class VerifyDoctor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      MasoomInstance: undefined,
      account: null,
      web3: null,
      doctorsList: null,
      isOwner:false
    }
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

      let doctorCount = await this.state.MasoomInstance.methods.getDoctorCount().call();

      let doctorsList = [];
      for(let i=0;i<doctorCount;i++){
          let doctorAddress = await this.state.MasoomInstance.methods.doctors(i).call();
          let doctorDetails = await this.state.MasoomInstance.methods.doctorDetails(doctorAddress).call();
          doctorsList.push(doctorDetails);
      }
      this.setState({doctorsList : doctorsList});

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

  verifyDoctor = async event => {
    await this.state.MasoomInstance.methods.verifyDoctor(event.target.value).send({from : this.state.account , gas: 1000000});
    window.location.reload(false);
  }

  render() {
    let doctorsList;
    if(this.state.doctorsList){
        doctorsList = this.state.doctorsList.map((doctor) => {
        return (
          <div className="candidate candidate-ui">
            <div className="candidateName">Doctor : {doctor.name}
            {doctor.isVerified ?
            
            <span className="verification-success">Verified</span>
            :
            ""}
            
            </div>
            <div className="candidateDetails">
              <div><span className="candidate-labels">Registeration ID</span> <span className="candidate-value">{doctor.registerationId}</span> </div><br />
              <div><span className="candidate-labels">Hospital</span> <span className="candidate-value">{doctor.hospital}</span> </div><br />
              {/* <div>College : {doctor.hospital}</div> */}
              <div><span className="candidate-labels">Field</span> <span className="candidate-value">{doctor.field}</span> </div><br />
              <div><span className="candidate-labels">Doctor Address</span> <span className="candidate-value"> {doctor.doctorAddress}</span> </div><br />
            </div>

            {doctor.isVerified ? 
            <div>

            {/* <Button className="button-verified">Verified</Button>  */}
            </div>
            : <Button onClick={this.verifyDoctor} value={doctor.doctorAddress} className="button-verify">Verify</Button>}
          </div>
        );
      });
    }
    
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

    if(!this.state.isOwner){
      return(
        <div className="CandidateDetails">
            <div className="CandidateDetails-title">
              <h1>
                ONLY ADMIN CAN ACCESS
              </h1>
            </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          </div>
      );
    }

    return (
      <div>
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              Verify Doctors
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div>
          {doctorsList}
        </div>
      </div>
    );
  }
}

export default VerifyDoctor;
