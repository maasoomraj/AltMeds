import React, { Component } from "react";
import MasoomContract from "../contracts/MasoomContract.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import { FormGroup, FormControl,Button } from 'react-bootstrap';

class AddAlternative extends Component {
  constructor(props) {
    super(props)

    this.state = {
        MasoomInstance: undefined,
        account: null,
        web3: null,
        med:'',
        drug:'',
        disease:'',
        registered: false,
        isOwner:false,
        myAccount:null
    }
  }

  updateMed = event => {
    this.setState({ med : event.target.value});
  }

  updateDrug = event => {
    this.setState({drug : event.target.value});
  }

  updateDisease = event => {
    this.setState({disease : event.target.value});
  }

  addAlternative = async () => {
      // Converting to bytes32 before sending using this.state.web3.utils.asciiToHex()
    await this.state.MasoomInstance.methods.addAlternative(this.state.web3.utils.asciiToHex(this.state.med), this.state.web3.utils.asciiToHex(this.state.drug), this.state.web3.utils.asciiToHex(this.state.disease)).send({from : this.state.account , gas: 1000000});
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

      let myAccount = await this.state.MasoomInstance.methods.doctorDetails(this.state.account).call();
      this.setState({ myAccount : myAccount});
    //   console.log("doc1");
    //   let doctorCount = await this.state.MasoomInstance.methods.getDoctorCount().call();
    // //   console.log("doc2");
    //   console.log(doctorCount);
    //   let registered;
    //   for(let i=0;i<doctorCount;i++){
    //       let doctorAddress = await this.state.MasoomInstance.methods.doctors(i).call();
    //       if(doctorAddress === this.state.account){
    //         registered = true;
    //         break;
    //       }
    //   }

    //   this.setState({ registered : registered});

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

    if(this.state.myAccount){
        if(!this.state.myAccount.isVerified){
            return(
              <div className="CandidateDetails">
              <div className="CandidateDetails-title">
                <h1>
                YOU NEED TO VERIFY FIRST.
                </h1>
              </div>
              {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
            </div>
            );
        }
    }

    return (
      <div className="App">
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              ADD ALTERNATIVES
            </h1>
          </div>
        </div>

        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="form form-ui">
        <FormGroup>
            {/* <div className="form-label">Enter Medicine : </div> */}
            <div className="form-input">
              <FormControl
                  className="form-better"
                  input = 'text'
                  value = {this.state.med}
                  onChange={this.updateMed}
                  placeholder="Enter Medicine"
              />
            </div>
        </FormGroup>

        <FormGroup>
            {/* <div className="form-label">Enter Alternative drug : </div> */}
            <div className="form-input">
              <FormControl
                  className="form-better"
                  input = 'textArea'
                  value = {this.state.drug}
                  onChange={this.updateDrug}
                  placeholder="Enter Alternative drug"
              />
            </div>
        </FormGroup>

        <FormGroup>
            {/* <div className="form-label">Enter Disease Name : </div> */}
            <div className="form-input">
              <FormControl
                  className="form-better"
                  input = 'text'
                  value = {this.state.disease}
                  onChange={this.updateDisease}
                  placeholder="Enter Disease Name"
              />
            </div>
        </FormGroup>
        <hr className="separator"/>
        <Button onClick={this.addAlternative}  className="button-vote">
          Add Alternative
        </Button>
        </div>


      </div>
    );
  }
}

export default AddAlternative;

