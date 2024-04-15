import { TopicCreateTransaction } from "@hashgraph/sdk";
import { environmentSetup } from "./setup.js";
import { getEventsFromMirror } from "./eventListener.js";
import fs from "fs";
import 'dotenv/config';

let abi;

const main = async () => {
    abi = JSON.parse(fs.readFileSync('abi/Voting.json', 'utf8'));

    const client = environmentSetup();

    let electionCreatedTopicId, candidateAddedTopicId, votedTopicId, electionEndedTopicId;


    // Create Election Created Topic
    if (process.env.ELECTION_CREATED_TOPIC_ID !== undefined) {
        electionCreatedTopicId = process.env.ELECTION_CREATED_TOPIC_ID;
    } else {
        const electionCreatedtransaction = await new TopicCreateTransaction();
        const electionCreatedtxResponse = await electionCreatedtransaction.execute(client);
        const electionCreatedtransactionReceipt = await electionCreatedtxResponse.getReceipt(client);
        electionCreatedTopicId = electionCreatedtransactionReceipt.topicId;
    }

    // Create Candidate Added Topic
    if (process.env.CANDIDATE_ADDED_TOPIC_ID !== undefined) {
        candidateAddedTopicId = process.env.CANDIDATE_ADDED_TOPIC_ID;
    } else {
        const candidateAddedTransaction = await new TopicCreateTransaction();
        const candidateAddedtxResponse = await candidateAddedTransaction.execute(client);
        const candidateAddedtransactionReceipt = await candidateAddedtxResponse.getReceipt(client);
        candidateAddedTopicId = candidateAddedtransactionReceipt.topicId;
    }

    // Create Voted Topic
    if (process.env.VOTED_TOPIC_ID !== undefined) {
        votedTopicId = process.env.VOTED_TOPIC_ID;
    } else {
        const votedTransaction = await new TopicCreateTransaction();
        const votedtxResponse = await votedTransaction.execute(client);
        const votedtransactionReceipt = await votedtxResponse.getReceipt(client);
        votedTopicId = votedtransactionReceipt.topicId;
    }

    // Create Election Ended Topic
    if (process.env.ELECTION_ENDED_TOPIC_ID !== undefined) {
        electionEndedTopicId = process.env.ELECTION_ENDED_TOPIC_ID;
    } else {
        const electionEndedTransaction = await new TopicCreateTransaction();
        const electionEndedtxResponse = await electionEndedTransaction.execute(client);
        const electionEndedtransactionReceipt = await electionEndedtxResponse.getReceipt(client);
        electionEndedTopicId = electionEndedtransactionReceipt.topicId;
    }

    console.log(`Your ElectionCreatedTopic ID is: ${electionCreatedTopicId}`);
    console.log(`Your CandidateAddedTopic ID is: ${candidateAddedTopicId}`);
    console.log(`Your VotedTopic ID is: ${votedTopicId}`);
    console.log(`Your ElectionEndedTopic ID is: ${electionEndedTopicId}`);

    setInterval(() => {
        getEventsFromMirror(process.env.CONTRACT_ADDRESS, abi, electionCreatedTopicId, candidateAddedTopicId, votedTopicId, electionEndedTopicId, client);
    }, 4000);
}
main();