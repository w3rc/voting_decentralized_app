// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Voting is ReentrancyGuard {
    struct Candidate {
        uint64 id;
        string name;
        uint64 voteCount;
    }

    struct Election {
        uint64 id;
        string name;
        address owner;
        mapping(uint64 => Candidate) candidates;
        uint64 candidatesCount;
    }

    mapping(string => uint64) public electionNamesToIds;
    mapping(uint64 => Election) public elections;
    mapping(address => bool) public voters;
    uint64 public electionsCount;    

    event votedEvent (
        uint64 indexed _electionId,
        uint64 indexed _candidateId,
        address _voter
    );

    event electionCreatedEvent (
        uint64 indexed _electionId,
        string _electionName,
        address _owner
    );

    event candidateAddedEvent (
        uint64 indexed _electionId,
        uint64 indexed _candidateId,
        string _candidateName
    );

    event electionEndedEvent (
        uint64 indexed _electionId,
        uint64 indexed _winnerId,
        string _electionName,
        string _winnerName,
        uint64 _voteCount
    );

    function createElection(string memory _name) public nonReentrant() {
        electionsCount++;
        Election storage election = elections[electionsCount];
        election.id = electionsCount;
        election.name = _name;
        election.owner = msg.sender;

        electionNamesToIds[_name] = electionsCount;

        emit electionCreatedEvent(electionsCount, _name, msg.sender);
    }

    function addCandidate(uint64 _electionId, string memory _name) public nonReentrant() {
        Election storage election = elections[_electionId];

        require(msg.sender == election.owner, "Only the election creator can add candidates.");

        election.candidatesCount ++;
        election.candidates[election.candidatesCount] = Candidate(election.candidatesCount, _name, 0);

        emit candidateAddedEvent(_electionId, election.candidatesCount, _name);
    }

    function addCandidateByElectionName(string memory _electionName, string memory _candidateName) public {
        uint64 electionId = electionNamesToIds[_electionName];

        require(electionId != 0, "Election does not exist");
        require(msg.sender == elections[electionId].owner, "Only the election creator can add candidates.");

        addCandidate(electionId, _candidateName);
    }

    function vote (uint64 _electionId, uint64 _candidateId) public nonReentrant() {
        Election storage election = elections[_electionId];
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateId > 0 && _candidateId <= election.candidatesCount, "Not a valid candidate.");

        voters[msg.sender] = true;
        election.candidates[_candidateId].voteCount ++;

        emit votedEvent(_electionId, _candidateId, msg.sender);
    }

    function endElection(uint64 _electionId) public nonReentrant() {
        Election storage election = elections[_electionId];
        require(msg.sender == election.owner, "Only the election creator can end this election.");

        uint64 maxVoteCount = 0;
        uint64 winnerId = 0;

        for (uint64 i = 1; i <= election.candidatesCount; i++) {
            if (election.candidates[i].voteCount > maxVoteCount) {
                maxVoteCount = election.candidates[i].voteCount;
                winnerId = i;
            }
        }

        emit electionEndedEvent(_electionId, winnerId, election.name, election.candidates[winnerId].name, maxVoteCount);
    }
}