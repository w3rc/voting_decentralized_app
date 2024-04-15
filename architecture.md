## Architecture Overview

The decentralized voting application leverages the Hedera Network for its blockchain infrastructure, ensuring a secure and transparent voting process. Below is an overview of the architecture and interaction between different components:

### Components:

1. **Smart Contracts**: Implemented using Solidity, deployed on the Hedera Network to manage the voting logic.
2. **Hedera Consensus Service (HCS) Client**: Manages communication with the Hedera network, creating and handling topics.
3. **Frontend WebApp**: Provides a user interface for voters to interact with the voting system.
4. **Discord Bot**: Facilitates interaction through Discord, allowing users to participate in voting.

### How Components Interact:

1. **Smart Contract Deployment**:
   - The voting smart contract is deployed on the Hedera Network. It includes functions for adding elections, registering candidates, casting votes, and concluding elections.

2. **Hedera Consensus Service Client**:
   - The HCS client initializes four topics corresponding to key actions: adding elections, adding candidates, casting votes, and ending elections.
   - It listens for events emitted by the smart contract and forwards these events as messages to their respective topics.

3. **Message Handling**:
   - Both the frontend WebApp and the Discord bot use Hedera mirror nodes to retrieve messages from the aforementioned topics.
   - This architecture ensures that all interactions are recorded immutably on the Hedera blockchain, leveraging its consensus mechanism for verification and transparency.

4. **User Interaction**:
   - **WebApp**: Voters can interact with the smart contract through a web interface. This frontend makes calls to the smart contract, submitting transactions directly to the Hedera Network.
   - **Discord Bot**: Users can also interact via a Discord bot, which serves as an alternative interface. The bot provides commands that mirror the actions available on the WebApp.