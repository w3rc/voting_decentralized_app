-include .env

.PHONY: all test clean deploy fund help install snapshot format anvil 

all: clean remove install update build

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && rm -rf client && rm -rf discord_bot && touch .gitmodules && git add . && git commit -m "modules"

install :
	forge install Cyfrin/foundry-devops@0.0.11 --no-commit 
	forge install foundry-rs/forge-std@v1.5.3 --no-commit 
	forge install OpenZeppelin/openzeppelin-contracts --no-commit 
	$(MAKE) setup-client
	$(MAKE) setup-discord-bot

setup-client:
	git submodule add https://github.com/w3rc/voting_dapp.git client
	cd client && yarn install
	cp client/.env.sample client/.env

setup-discord-bot:
	git submodule add https://github.com/w3rc/voting_dapp_discord_bot.git discord_bot
	cd discord_bot && yarn install
	cp discord_bot/.env.sample discord_bot/.env

# Update Dependencies
update:; forge update

build:; forge build

test :; forge test 

test-fork :; forge test  --fork-url https://testnet.hashio.io/api --via-ir

snapshot :; forge snapshot

format :; forge fmt

deploy-contract: 
	@forge create --rpc-url $(shell echo $$HEDERA_RPC_URL) --private-key $(shell echo $$HEDERA_HEX_ENCODED_PRIVATE_KEY) --verify --verifier sourcify --verifier-url https://server-verify.hashscan.io src/contract/Voting.sol:Voting --gas-limit 4000000

hcs-start:; node src/hcs/index.js

client-start:; cd client && bun run dev

discord-bot-start:; cd discord_bot && node index.js