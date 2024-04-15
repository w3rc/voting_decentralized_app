# User Manual: Voting DApp

## First Steps:

### Setup the Application:
1. Open your terminal.
2. Navigate to the root directory of your Voting DApp project.
3. Run the command `make all`. This command performs the following actions:
   - Downloads all necessary dependencies.
   - Sets up the application for initial use.

### Deploy the Smart Contract:
1. Ensure you have your private key and the Hedera RPC URL ready.
2. Use these credentials to deploy your contract to the Hedera network.

## Starting Hedera Consensus Service Client:

### Prerequisites:
- Verify that the contract is successfully deployed.
- Update the root `.env` file with the contract address.
- Add the contract ABI in the `abi` folder within your project directory.

### Starting the HCS Client:
1. Execute the command `make hcs-start`.
2. This process will log four topic IDs into the console, which are essential for the subsequent steps.
3. Update the `.env` files for both the client and the Discord bot with these topic IDs.

## Starting Discord Bot:

### Prerequisites:
- Ensure the topic IDs for adding elections, adding candidates, casting votes, and ending elections are added to the `.env` file.
- Add the private key of the wallet and `HEDERA_ACCOUNT_ID` to the `.env` file.
- Include the Discord bot credentials in the `.env` file.

### Starting the Discord Bot:
1. Use the command `make discord-bot-start`.
2. This initiates the Discord bot which interacts with the Hedera network through the specified topic IDs.

## Starting WebApp:

### Prerequisites:
- Confirm that the topic IDs for adding elections, adding candidates, casting votes, and ending elections are correctly set in the `.env` file.
- Add `VITE_CONTRACT_ID` to the `.env` to ensure the web app can interact with the deployed smart contract.

### Starting the WebApp Client:
1. Run the command `make client-start`.
2. This command launches the web application, allowing users to interact with the voting system through a graphical user interface.

## NOTES:
1. .env.sample file is added in the discord bot, client and root of the project for ease of setup
2. Client and Discord bot are added as submodules in the mail Replository