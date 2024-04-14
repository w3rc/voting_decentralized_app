// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Voting is ReentrancyGuard {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Election {
        uint id;
        string name;
        mapping(uint => Candidate) candidates;
        uint candidatesCount;
    }

    mapping(string => uint) public electionNamesToIds;
    mapping(uint => Election) public elections;
    mapping(address => bool) public voters;
    uint public electionsCount;    

    event votedEvent (
        uint indexed _electionId,
        uint indexed _candidateId,
        address _voter
    );

    event electionCreatedEvent (
        uint indexed _electionId,
        string _electionName
    );

    event candidateAddedEvent (
        uint indexed _electionId,
        uint indexed _candidateId,
        string _candidateName
    );

    event electionEndedEvent (
        uint indexed _electionId,
        uint indexed _winnerId,
        string _electionName,
        string _winnerName,
        uint _voteCount
    );

    function createElection(string memory _name) public nonReentrant() {
        electionsCount++;
        Election storage election = elections[electionsCount];
        election.id = electionsCount;
        election.name = _name;

        electionNamesToIds[_name] = electionsCount;

        emit electionCreatedEvent(electionsCount, _name);
    }

    function createElectionWithCandidates(string memory _name, string[] memory _candidates) public nonReentrant() {
        electionsCount++;
        Election storage election = elections[electionsCount];
        election.id = electionsCount;
        election.name = _name;

        for (uint i = 0; i < _candidates.length; i++) {
            addCandidate(electionsCount, _candidates[i]);
        }

        emit electionCreatedEvent(electionsCount, _name);
    }

    function addCandidate(uint _electionId, string memory _name) public nonReentrant() {
        Election storage election = elections[_electionId];
        election.candidatesCount ++;
        election.candidates[election.candidatesCount] = Candidate(election.candidatesCount, _name, 0);

        emit candidateAddedEvent(_electionId, election.candidatesCount, _name);
    }

    function addCandidateByElectionName(string memory _electionName, string memory _candidateName) public {
        uint electionId = electionNamesToIds[_electionName];

        require(electionId != 0, "Election does not exist");

        addCandidate(electionId, _candidateName);
    }

    function vote (uint _electionId, uint _candidateId) public nonReentrant() {
        Election storage election = elections[_electionId];
        // require(!voters[msg.sender], "You have already voted.");
        require(_candidateId > 0 && _candidateId <= election.candidatesCount, "Not a valid candidate.");

        voters[msg.sender] = true;
        election.candidates[_candidateId].voteCount ++;

        emit votedEvent(_electionId, _candidateId, msg.sender);
    }

    function endElection(uint _electionId) public nonReentrant() {
        Election storage election = elections[_electionId];
        uint maxVoteCount = 0;
        uint winnerId = 0;

        for (uint i = 1; i <= election.candidatesCount; i++) {
            if (election.candidates[i].voteCount > maxVoteCount) {
                maxVoteCount = election.candidates[i].voteCount;
                winnerId = i;
            }
        }

        emit electionEndedEvent(_electionId, winnerId, election.name, election.candidates[winnerId].name, maxVoteCount);
    }
}