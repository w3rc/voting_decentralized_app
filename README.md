0.0.3994709 - Metamask Account ID

Deploy
- `forge create --rpc-url https://testnet.hashio.io/api --private-key 0xd733539a13baf4774898fb0bb9ea1f79f392ecd3f1db2215dbf9940ab71e0ccf --verify --verifier sourcify --verifier-url https://server-verify.hashscan.io src/contract/Voting.sol:Voting --gas-limit 4000000`


# TASKS:

[] Deploy New Version of Contract
[] Bug: Election Card Select is showing content of last card
[] Add Loaders to Buttons - Vote, Add Election, End Election
[] Add Skeleton to Cards
[] Discord Bot
    [] Command to View Past Elections
    [] Command to View Ongoing Elections
[] Ownership in Contract - Only starter of an election can end an election