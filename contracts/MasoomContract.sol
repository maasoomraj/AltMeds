// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.24;
// pragma experimental ABIEncoderV2;

contract MasoomContract {

    // comment down
    address public owner;
    uint candidateCount;

    uint voterCount;

    bool start;
    bool end;
    // comment up

    uint doctorCount;

    // Constructor
    constructor() public {
        owner = msg.sender;
        // comment down
        candidateCount = 0;
        voterCount = 0;
        start = false;
        end = false;
        // comment up
        doctorCount = 0;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    // Only Admin can access
    modifier onlyAdmin() {
        require(msg.sender == owner);
        _;
    }

    struct Candidate{
        string name;
        string party;
        string manifesto;
        uint voteCount;
        uint constituency;
        uint candidateId;
    }

    mapping(uint => Candidate) public candidateDetails;

    // Only admin can add candidate
    function addCandidate(string _name, string _party, string _manifesto, uint _constituency) public onlyAdmin {
        Candidate memory newCandidate = Candidate({
           name : _name,
           party : _party,
           manifesto : _manifesto,
           voteCount : 0,
           constituency : _constituency,
           candidateId : candidateCount
        });

        candidateDetails[candidateCount] = newCandidate;
        candidateCount += 1;
    }

    // get total number of candidates
    function getCandidateNumber() public view returns (uint) {
        return candidateCount;
    }

    struct Voter{
        address voterAddress;
        string name;
        string aadhar;
        uint constituency;
        bool hasVoted;
        bool isVerified;
    }

    address[] public voters;
    mapping(address => Voter) public voterDetails;

    // request to be added as voter
    function requestVoter(string _name, string _aadhar, uint _constituency) public {
        Voter memory newVoter = Voter({ 
           voterAddress : msg.sender,
           name : _name,
           aadhar : _aadhar,
           constituency : _constituency,
           hasVoted : false,
           isVerified : false
        });

        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        voterCount += 1;
    }

    // get total number of voters
    function getVoterCount() public view returns (uint) {
        return voterCount;
    }

    function verifyVoter(address _address) public onlyAdmin {
        voterDetails[_address].isVerified = true;
    }

    function vote(uint candidateId) public{
        require(voterDetails[msg.sender].hasVoted == false);
        require(voterDetails[msg.sender].isVerified == true);
        require(start == true);
        require(end == false);

        candidateDetails[candidateId].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
    }

    function startElection() public onlyAdmin {
        start = true;
        end = false;
    }

    function endElection() public onlyAdmin {
        end = true;
        start = false;
    }

    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }




    struct Doctor{
        address doctorAddress;
        string name;
        string registerationId;
        string hospital;
        string college;
        string field;
        bool isVerified;
    }

    address[] public doctors;
    mapping(address => Doctor) public doctorDetails;

    function requestDoctor(string _name, string _registerationId, string _hospital, string _college, string _field) public {
        Doctor memory newDoctor = Doctor({ 
           doctorAddress : msg.sender,
           name : _name,
           registerationId : _registerationId,
           hospital : _hospital,
           college : _college,
           field : _field,
           isVerified : false
        });

        doctorDetails[msg.sender] = newDoctor;
        doctors.push(msg.sender);
        doctorCount += 1;
    }

    // get total number of voters
    function getDoctorCount() public view returns (uint) {
        return doctorCount;
    }

    function verifyDoctor(address _address) public onlyAdmin {
        doctorDetails[_address].isVerified = true;
    }

    struct list{
        uint position;
        bool exists;
        uint size;
        string name;
    }

    uint nameCount = 0;
    mapping(uint => list) public getNames;
    mapping(bytes32 => list) public names;
    mapping(uint => uint[]) public array;

    function addAlternative(bytes32 _med1, bytes32 _med2, bytes32 _disease) public {
        require(doctorDetails[msg.sender].isVerified);

        if(!names[_med1].exists){
            nameCount += 1;
            list memory newList1 = list({ position : nameCount - 1 , exists : true, size : 0, name : bytes32string(_med1)});
            getNames[nameCount - 1 ] = newList1;
            names[_med1] = newList1;
        }

        uint a = names[_med1].position;
        names[_med1].size += 1;

        if(!names[_med2].exists){
            nameCount += 1;
            list memory newList2 = list({ position : nameCount - 1 , exists : true, size : 0, name : bytes32string(_med2)});
            getNames[nameCount - 1 ] = newList2;
            names[_med2] = newList2;
        }

        uint b = names[_med2].position;
        names[_med2].size += 1;

        if(!names[_disease].exists){
            nameCount += 1;
            list memory newList3 = list({ position : nameCount - 1 , exists : true , size : 0, name : bytes32string(_disease)});
            getNames[nameCount - 1 ] = newList3;
            names[_disease] = newList3;
        }

        uint c = names[_disease].position;
        names[_disease].size += 2;

        array[a].push(b);
        array[b].push(a);
        array[c].push(a);
        array[c].push(b);
    }
    
    function char(byte b) public view returns (byte c) {
        if (b < 10) return byte(uint8(b) + 0x30);
        else return byte(uint8(b) + 0x57);
    }


    function bytes32string(bytes32 b32) public view returns (string out) {
        bytes memory s = new bytes(64);

        for (uint i = 0; i < 32; i++) {
            byte b = byte(b32[i]);
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[i*2] = char(hi);
            s[i*2+1] = char(lo);
        }

        out = string(s);
    }
}