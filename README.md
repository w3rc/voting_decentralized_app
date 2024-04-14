## Voting Smart Contract Documentation

This documentation provides a detailed overview of the `Voting` smart contract which is designed to run on the Ethereum blockchain. It utilizes Solidity version 0.8.25 and incorporates OpenZeppelin's `ReentrancyGuard` to mitigate potential reentrancy attacks. The contract facilitates creating elections, adding candidates, voting, and ending elections, with specific permissions for election creators.

### Contract Overview

- **Contract Name**: `Voting`
- **SPDX License Identifier**: MIT
- **Solidity Version**: ^0.8.25
- **Imported Modules**: OpenZeppelin's `ReentrancyGuard`

### Structs

#### Candidate
- `uint64 id`: Unique identifier for the candidate.
- `string name`: Name of the candidate.
- `uint64 voteCount`: Total number of votes received by the candidate.

#### Election
- `uint64 id`: Unique identifier for the election.
- `string name`: Name of the election.
- `address owner`: Ethereum address of the user who created the election.
- `mapping(uint64 => Candidate) candidates`: Mapping of candidate IDs to `Candidate` structs.
- `uint64 candidatesCount`: Count of candidates added to the election.

### State Variables

- `mapping(string => uint64) public electionNamesToIds`: Maps election names to their corresponding unique identifiers.
- `mapping(uint64 => Election) public elections`: Maps election IDs to `Election` structs.
- `mapping(address => bool) public voters`: Tracks addresses that have already voted to prevent duplicate votes.
- `uint64 public electionsCount`: Tracks the total number of elections created.

### Events

- **votedEvent**: Emitted when a vote is cast.
  - `uint64 indexed _electionId`
  - `uint64 indexed _candidateId`
  - `address _voter`

- **electionCreatedEvent**: Emitted when a new election is created.
  - `uint64 indexed _electionId`
  - `string _electionName`
  - `address _owner`

- **candidateAddedEvent**: Emitted when a new candidate is added to an election.
  - `uint64 indexed _electionId`
  - `uint64 indexed _candidateId`
  - `string _candidateName`

- **electionEndedEvent**: Emitted when an election is ended.
  - `uint64 indexed _electionId`
  - `uint64 indexed _winnerId`
  - `string _electionName`
  - `string _winnerName`
  - `uint64 _voteCount`

### Functions

#### createElection
- **Description**: Creates a new election.
- **Parameters**: `string memory _name` - Name of the election.
- **Modifiers**: `nonReentrant`

#### addCandidate
- **Description**: Adds a new candidate to an existing election.
- **Parameters**:
  - `uint64 _electionId` - ID of the election.
  - `string memory _name` - Name of the candidate.
- **Modifiers**: `nonReentrant`
- **Requirements**: Caller must be the owner of the election.

#### addCandidateByElectionName
- **Description**: Adds a new candidate to an existing election by election name.
- **Parameters**:
  - `string memory _electionName` - Name of the election.
  - `string memory _candidateName` - Name of the candidate.
- **Requirements**:
  - Election must exist.
  - Caller must be the owner of the election.

#### vote
- **Description**: Casts a vote for a candidate in an election.
- **Parameters**:
  - `uint64 _electionId` - ID of the election.
  - `uint64 _candidateId` - ID of the candidate.
- **Modifiers**: `nonReentrant`
- **Requirements**:
  - Caller has not already voted.
  - Candidate ID must be valid within the election.

#### endElection
- **Description**: Ends an election and determines the winner.
- **Parameters**: `uint64 _electionId` - ID of the election.
- **Modifiers**: `nonReentrant`
- **Requirements**: Caller must be the owner of the election.

### Usage and Integration

This smart contract can be used in decentralized applications (dApps) that require a robust and secure mechanism for managing democratic processes such as voting in elections.


## Deployment Instructions

To deploy the `Voting` smart contract to a blockchain network, follow these steps to prepare and execute the deployment process. The instructions below assume you are deploying to the Hedera network.

### Prerequisites

Before deploying the smart contract, ensure you have the following setup on your development machine:

- **Node.js**: Install Node.js (preferably the latest LTS version), which is required to run deployment scripts.
- **Solidity Compiler (solc)**: Ensure you have a Solidity compiler that is compatible with version 0.8.25, as specified in the contract.

### Step-by-Step Deployment Guide

1. **Create a `.env` File**:
   - Navigate to the root directory of your project.
   - Create a new file named `.env`.
   - Add the private key of your Hedera account and the RPC URL in the file:
     ```
     HEDERA_HEX_ENCODED_PRIVATE_KEY=your_hedera_hex_private_key_here
     ```

2. **Install dotenv-cli**:
   - Open your terminal.
   - Run the following command to install `dotenv-cli` globally, which allows you to set environment variables from your `.env` file directly in your deployment script:
     ```bash
     npm install -g dotenv-cli
     ```

3. **Run the Deployment Command**:
   - In your terminal, navigate to the directory containing your deployment script.
   - Run the deployment command:
     ```bash
     dotenv make deploy-contract
     ```
   - This command initializes the environment variables from the `.env` file and runs the `make deploy-contract` command, which is be defined in the `makefile` to trigger the deployment.

### Post-Deployment

- **Verify Contract Deployment**: After deploying your contract, verify it on the Hedera network using tools like the Hedera Explorer or through the Hedera portal to ensure it was deployed correctly and is operational.
- **Interact with Your Contract**: Use Hedera SDKs or direct API calls to interact with your deployed contract, testing functions like creating elections, adding candidates, voting, and ending elections to ensure all functionalities work as expected.