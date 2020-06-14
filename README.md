# AltMeds

We built this application as a part of a hackathon's problem statement: "Provide a solution to tackle the substainable goals of good health and well being"

Our proposed solution was to provide a platform integrated with blockchain to provide alternative cheaper medicines for a particular diseases and not just rely on greedy chemists.

# Work Flow

## Users
- Searches for the alternative of the medicines they seek or the available medicines for a disease.

## Doctor
- Fills the form to apply as a Doctor.
- Admin verifies the Doctor based on his data.
- The Doctor can then add alternatives to medicines and thus contribute to the community

## Admin
- Verify the Doctors.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This project requires nodejs and npm to run

```
sudo apt install nodejs
sudo apt install npm
```

### Installing

A step by step series of examples that tell you how to get a development env running

clone the repository and run the following commands

```
git clone https://github.com/maasoomraj/AltMeds.git
cd AltMeds
```

This app requires ganache and truffle to be globally installed
```
npm i -g ganache-cli
npm i -g truffle
ganache-cli
```

Copy the mnemonic received after running the above commands and copy it to your metamask extension on your browser.

Then to compile the contract and run the blockchain
```
truffle compile --all
truffle migrate --reset
```


To install node modules
```
npm install
```

Installing react app

```
cd client
npm install
```


## Deployment


### Run `frontend react app`

run on different terminal

```
cd client
npm run start
```

> Its up and running on port 3000.
