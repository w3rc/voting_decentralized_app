import axios from "axios";
import { Web3 } from "web3";
import { createMessageInTopic } from "./topic.js";

const web3 = new Web3("https://testnet.hashio.io/api");
let lastCheckedTimestamp = 0;

export const getEventsFromMirror = async (contractId, abi, electionCreatedTopicId, candidateAddedTopicId, votedTopicId, electionEndedTopicId, client) => {
	const delay = (ms) => new Promise((res) => setTimeout(res, ms));
	console.log(`\nGetting event(s) from mirror`);
	console.log(`Waiting to allow transaction propagation to mirror`);
	await delay(1000);

	const url = `https://testnet.mirrornode.hedera.com/api/v1/contracts/${contractId.toString()}/results/logs?order=asc&timestamp=gte:${lastCheckedTimestamp}`;
	lastCheckedTimestamp = Math.floor(Date.now() / 1000);

	const electionCreatedEventSignature = web3.utils.sha3('electionCreatedEvent(uint256,string,address)');
	const candidateAddedEventSignature = web3.utils.sha3('candidateAddedEvent(uint256,uint256,string)');
	const votedEventSignature = web3.utils.sha3('votedEvent(uint256,uint256,address)');
	const electionEndedEventSignature = web3.utils.sha3('electionEndedEvent(uint256,uint256,string,string,uint256)');

	axios
		.get(url)
		.then(function (response) {
			const jsonResponse = response.data;

			jsonResponse.logs.forEach((log) => {
				const eventSignature = log.topics[0];

				if (eventSignature === votedEventSignature) {

					const votedEvent = decodeEvent("votedEvent", log.data, log.topics.slice(1), abi);
					console.log(
						`Got a vote from ${log.topics[0]} to candidate ${votedEvent._candidateId} in election ${votedEvent._electionId}`
					);

					createMessageInTopic(votedTopicId, {
						"type": "voted",
						"electionId": votedEvent._electionId.toString(),
						"candidateId": votedEvent._candidateId.toString(),
						"voterId": log.topics[0],
						"timestamp": log.timestamp,
						'txnHash': log['transaction_hash'],
						'contractId': log['contract_id'],
					}, client);

				} else if (eventSignature === electionCreatedEventSignature) {
					const electionCreatedEvent = decodeEvent("electionCreatedEvent", log.data, log.topics.slice(1), abi);
					createMessageInTopic(electionCreatedTopicId, {
						"type": "electionCreated",
						"electionId": electionCreatedEvent._electionId.toString(),
						"electionName": electionCreatedEvent._electionName,
						"timestamp": log.timestamp,
						'txnHash': log['transaction_hash'],
						'contractId': log['contract_id'],
					}, client);
				} else if (eventSignature === candidateAddedEventSignature) {
					const candidateAddedEvent = decodeEvent("candidateAddedEvent", log.data, log.topics.slice(1), abi);
					createMessageInTopic(candidateAddedTopicId, {
						"type": "candidateAdded",
						"electionId": candidateAddedEvent._electionId.toString(),
						"candidateId": candidateAddedEvent._candidateId.toString(),
						"candidateName": candidateAddedEvent._candidateName,
						"timestamp": log.timestamp,
						'txnHash': log['transaction_hash'],
						'contractId': log['contract_id'],
					}, client);
				} else if (eventSignature === electionEndedEventSignature) {
					const electionEndedEvent = decodeEvent("electionEndedEvent", log.data, log.topics.slice(1), abi);
					createMessageInTopic(electionEndedTopicId, {
						"type": "electionEnded",
						"electionId": electionEndedEvent._electionId.toString(),
						"electionName": electionEndedEvent._electionName,
						"winnerId": electionEndedEvent._winnerId.toString(),
						"winnerName": electionEndedEvent._winnerName,
						"voteCount": electionEndedEvent._voteCount.toString(),
						"timestamp": log.timestamp,
						'txnHash': log['transaction_hash'],
						'contractId': log['contract_id'],
					}, client);
				}
			});
		})
		.catch(function (err) {
			console.error(err);
		});
}

const decodeEvent = (eventName, log, topics, abi) => {
	const eventAbi = abi.find(event => (event.name === eventName && event.type === "event"));
	console.log(eventAbi);
	const decodedLog = web3.eth.abi.decodeLog(eventAbi.inputs, log, topics);
	return decodedLog;
}