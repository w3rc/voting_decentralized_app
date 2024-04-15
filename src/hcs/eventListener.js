import axios from "axios";
import { Web3 } from "web3";
import fs from "fs";
import { addCandidateAddedInTopic, addElectionCreatedInTopic, addElectionEndedInTopic, addVotesInTopic, createMessageInTopic, getVotes } from "./topic.js";

const web3 = new Web3("https://testnet.hashio.io/api");
let lastCheckedTimestamp = 0;

export const getEventsFromMirror = async (contractId, abi, electionCreatedTopicId, candidateAddedTopicId, votedTopicId, electionEndedTopicId, client) => {
	if (fs.existsSync('timestamp.txt')) {
		lastCheckedTimestamp = parseInt(fs.readFileSync('timestamp.txt', 'utf8'));
	}

	const delay = (ms) => new Promise((res) => setTimeout(res, ms));
	await delay(1000);

	const url = `https://testnet.mirrornode.hedera.com/api/v1/contracts/${contractId.toString()}/results/logs?order=asc&timestamp=gt:${lastCheckedTimestamp}`;
	lastCheckedTimestamp = Math.floor(Date.now() / 1000) - 5; 
	fs.writeFileSync('timestamp.txt', lastCheckedTimestamp.toString(), (err) => { });

	const electionCreatedEventSignature = web3.utils.sha3('electionCreatedEvent(uint64,string,address)');
	const candidateAddedEventSignature = web3.utils.sha3('candidateAddedEvent(uint64,uint64,string)');
	const votedEventSignature = web3.utils.sha3('votedEvent(uint64,uint64,address)');
	const electionEndedEventSignature = web3.utils.sha3('electionEndedEvent(uint64,uint64,string,string,uint64)');

	axios
		.get(url)
		.then(function (response) {
			const jsonResponse = response.data;

			jsonResponse.logs.forEach((log) => {
				const eventSignature = log.topics[0];

				if (eventSignature === votedEventSignature) {
					const votedEvent = decodeEvent("votedEvent", log.data, log.topics.slice(1), abi);
					addVotesInTopic(votedTopicId, votedEvent, log, client);
				} else if (eventSignature === electionCreatedEventSignature) {
					const electionCreatedEvent = decodeEvent("electionCreatedEvent", log.data, log.topics.slice(1), abi);
					addElectionCreatedInTopic(electionCreatedTopicId, electionCreatedEvent, log, client);
				} else if (eventSignature === candidateAddedEventSignature) {
					const candidateAddedEvent = decodeEvent("candidateAddedEvent", log.data, log.topics.slice(1), abi);
					addCandidateAddedInTopic(candidateAddedTopicId, candidateAddedEvent, log, client);
				} else if (eventSignature === electionEndedEventSignature) {
					const electionEndedEvent = decodeEvent("electionEndedEvent", log.data, log.topics.slice(1), abi);
					addElectionEndedInTopic(electionEndedTopicId, electionEndedEvent, log, client);
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