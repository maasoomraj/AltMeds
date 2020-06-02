import React, { Component } from "react";
import MasoomContract from "../contracts/MasoomContract.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import { FormGroup, FormControl,Button } from 'react-bootstrap';

class GetAlternatives extends Component {
  constructor(props) {
    super(props)

    this.state = {
      MasoomInstance: undefined,
      account: null,
      web3: null,
      toggle:false,
      isOwner:false,
      med:'',
      alternateList:null
    }
  }

  updateMed = event => {
    this.setState({med : event.target.value});
  }

  showResult = async () => {

    let alternateList = [];
    let list = await this.state.MasoomInstance.methods.names(this.state.web3.utils.asciiToHex(this.state.med)).call();
    // console.log(this.state.web3.utils.hexToAscii('0x'+list.name));

    for(let i=0;i<list.size;i++){
        let elementUint = await this.state.MasoomInstance.methods.array(list.position, i).call();

        let element = await this.state.MasoomInstance.methods.getNames(elementUint).call();
        let ele = this.state.web3.utils.hexToAscii('0x'+element.name);
        alternateList.push(ele);
    }

    this.setState({toggle : true})
    this.setState({alternateList : alternateList});

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

      this.setState({ MasoomInstance: instance, web3: web3, account: accounts[0] });

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

    let alternateList;
    let count = 0;
    if(this.state.alternateList){
        if(this.state.alternateList){
            alternateList = this.state.alternateList.map((candidate) => {
                count++;
            return (
                <div className="candidateName">
                    {count} : {candidate}
                </div>
            //   <div className="candidate">
            //     <div className="candidateName">{candidate.name} : {candidate.voteCount} Votes</div>
            //     <div className="candidateDetails">
            //       <div>Party : {candidate.party}</div>
            //       <div>Manifesto : {candidate.manifesto}</div>
            //       <div>Constituency Number : {candidate.constituency}</div>
            //       <div>Candidate ID : {candidate.candidateId}</div>
            //     </div>
            //   </div>
            );
          });
        }
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

    return (
      <div className="App">
        {/* <div>{this.state.owner}</div> */}
        {/* <p>Account address - {this.state.account}</p> */}
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              SEEK ALTERNATIVES
            </h1>
          </div>
        </div>
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}


        <div className="form">
          <FormGroup>
            <div className="form-label">Enter Medicine / Disease Name - </div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {this.state.med}
                  onChange={this.updateMed}
              />
            </div>
            <Button onClick={this.showResult} className="button-vote">
              SHOW
            </Button>
          </FormGroup>
        </div>
        

        <br></br>

        {this.state.toggle ? 
          <div>
            <div className="CandidateDetails-mid-sub-title">
              Alternates -
            </div>
            {alternateList}
          </div>

          
          : ''}


      </div>
    );
  }
}

export default GetAlternatives;
