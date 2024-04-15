import { TopicMessageSubmitTransaction } from "@hashgraph/sdk";
import axios from "axios";

let isAddingElection = false;
let isAddingCandidate = false;
let isAddingVote = false;
let isAddingElectionEnd = false;

export const createMessageInTopic = async (topicId, message, client) => {
    const transaction = await new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(message)).execute(client);

    console.log(`Message submitted to topic: ${transaction.toString()}`);
}


const getMessagesFromTopic = async (topicId) => {
    const messages = await axios.get(`https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`)
    return messages;
}

const decodeMessages = (messages) => {
    return messages.map((message) => {
        const decodedMessage = atob(message.message);
        return JSON.parse(decodedMessage);
    });
}


export const getElections = async (topicId) => {
    const elections = await getMessagesFromTopic(topicId)
    return decodeMessages(elections.data.messages);
}

export const getCandidates = async (electionId, topicId) => {
    const candidates = await getMessagesFromTopic(topicId)
    const decodedMessages = decodeMessages(candidates.data.messages);
    return decodedMessages.filter((message) => message.electionId === electionId);
}

export const getVotes = async (electionId, topicId) => {
    const voted = await getMessagesFromTopic(topicId)
    const decodedMessages = decodeMessages(voted.data.messages);
    return decodedMessages.filter((message) => message.electionId === electionId);
}

export const addVotesInTopic = async (votedTopicId, votedEvent, log, client) => {
    if (isAddingVote) {
        return;
    }
    isAddingVote = true;

    const existingVotes = await getVotes(votedEvent._electionId.toString(), votedTopicId);

    if (existingVotes.some((vote) => vote.voterId === log.topics[0])) {
        console.log(`Vote from ${log.topics[0]} already exists in the topic`);
        return;
    }

    console.log(votedEvent)
    createMessageInTopic(votedTopicId, {
        "type": "voted",
        "origin": "smart_contract",
        "electionId": votedEvent._electionId.toString(),
        "candidateId": votedEvent._candidateId.toString(),
        "voterId": log.topics[0],
        "timestamp": log.timestamp,
        'txnHash': log['transaction_hash'],
        'contractId': log['contract_id'],
    }, client);
    console.log(
        `Got a vote from ${log.topics[0]} to candidate ${votedEvent._candidateId} in election ${votedEvent._electionId}`
    );
    isAddingVote = false;
}

export const addElectionCreatedInTopic = async (electionCreatedTopicId, electionCreatedEvent, log, client) => {

    if (isAddingElection) {
        return;
    }

    isAddingElection = true;
    const existingElections = await getElections(electionCreatedTopicId);

    if (existingElections.some((election) => election.electionId === electionCreatedEvent._electionId)) {
        console.log(`Election with ID: ${electionCreatedEvent._electionId} already exists in the topic`);
        return;
    }

    createMessageInTopic(electionCreatedTopicId, {
        "type": "electionCreated",
        "origin": "smart_contract",
        "electionId": electionCreatedEvent._electionId.toString(),
        "electionName": electionCreatedEvent._electionName,
        "timestamp": log.timestamp,
        'txnHash': log['transaction_hash'],
        'contractId': log['contract_id'],
    }, client);
    console.log(`Election created with ID: ${electionCreatedEvent._electionId}`);

    isAddingElection = false;
}

export const addCandidateAddedInTopic = async (candidateAddedTopicId, candidateAddedEvent, log, client) => {

    if (isAddingCandidate) {
        return;
    }
    isAddingCandidate = true;

    const existingCandidates = await getCandidates(candidateAddedEvent._electionId.toString(), candidateAddedTopicId);

    if (existingCandidates.some((candidate) => candidate.candidateId === candidateAddedEvent._candidateId)) {
        console.log(`Candidate with ID: ${candidateAddedEvent._candidateId} already exists in the topic`);
        return;
    }

    createMessageInTopic(candidateAddedTopicId, {
        "type": "candidateAdded",
        "origin": "smart_contract",
        "electionId": candidateAddedEvent._electionId.toString(),
        "candidateId": candidateAddedEvent._candidateId.toString(),
        "candidateName": candidateAddedEvent._candidateName,
        "timestamp": log.timestamp,
        'txnHash': log['transaction_hash'],
        'contractId': log['contract_id'],
    }, client);
    console.log(`Candidate added with ID: ${candidateAddedEvent._candidateId}`);
    isAddingCandidate = false;
}

export const addElectionEndedInTopic = async (electionEndedTopicId, electionEndedEvent, log, client) => {
    createMessageInTopic(electionEndedTopicId, {
        "type": "electionEnded",
        "origin": "smart_contract",
        "electionId": electionEndedEvent._electionId.toString(),
        "electionName": electionEndedEvent._electionName,
        "voteCount": electionEndedEvent._voteCount.toString(),
        "timestamp": log.timestamp,
        'txnHash': log['transaction_hash'],
        'contractId': log['contract_id'],
    }, client);
    console.log(`Election ended with ID: ${electionEndedEvent._electionId}`);
}