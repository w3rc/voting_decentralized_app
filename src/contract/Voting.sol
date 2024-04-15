// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Voting is ReentrancyGuard {
    error Voting__ElectionWithSameNameAlreadyExists(string name);
    error Voting__ElectionDoesNotExist();
    error Voting__OnlyElectionCreatorCanAddCandidates();
    error Voting__OnlyElectionCreatorCanEndElection();
    error Voting__YouHaveAlreadyVoted();
    error Voting__NotAValidCandidate();

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
        mapping(address => bool) voters;
        uint64 candidatesCount;
    }

    mapping(string => uint64) public electionNamesToIds;
    mapping(uint64 => Election) public elections;
    uint64 public electionsCount;

    event votedEvent(
        uint64 indexed _electionId,
        uint64 indexed _candidateId,
        address _voter
    );

    event electionCreatedEvent(
        uint64 indexed _electionId,
        string _electionName,
        address _owner
    );

    event candidateAddedEvent(
        uint64 indexed _electionId,
        uint64 indexed _candidateId,
        string _candidateName
    );

    event electionEndedEvent(
        uint64 indexed _electionId,
        uint64 indexed _winnerId,
        string _electionName,
        string _winnerName,
        uint64 _voteCount
    );

    function createElection(
        string memory _name
    ) public nonReentrant returns (uint64) {
        if (electionNamesToIds[_name] != 0) {
            revert Voting__ElectionWithSameNameAlreadyExists(_name);
        }

        electionsCount++;
        Election storage election = elections[electionsCount];
        election.id = electionsCount;
        election.name = _name;
        election.owner = msg.sender;

        electionNamesToIds[_name] = electionsCount;

        emit electionCreatedEvent(electionsCount, _name, msg.sender);
        return election.id;
    }

    function addCandidate(
        uint64 _electionId,
        string memory _name
    ) public nonReentrant returns (uint64) {
        Election storage election = elections[_electionId];

        if (_electionId <= 0 || _electionId > electionsCount) {
            revert Voting__ElectionDoesNotExist();
        }
        if (msg.sender != election.owner) {
            revert Voting__OnlyElectionCreatorCanAddCandidates();
        }

        election.candidatesCount++;
        election.candidates[election.candidatesCount] = Candidate(
            election.candidatesCount,
            _name,
            0
        );

        emit candidateAddedEvent(_electionId, election.candidatesCount, _name);
        return election.candidatesCount;
    }

    function addCandidateByElectionName(
        string memory _electionName,
        string memory _candidateName
    ) public {        
        uint64 electionId = electionNamesToIds[_electionName];
        addCandidate(electionId, _candidateName);
    }

    function vote(uint64 _electionId, uint64 _candidateId) public nonReentrant {
        Election storage election = elections[_electionId];

        if (_electionId <= 0 || _electionId > electionsCount) {
            revert Voting__ElectionDoesNotExist();
        }
        if (election.voters[msg.sender]) {
            revert Voting__YouHaveAlreadyVoted();
        }
        if (_candidateId <= 0 || _candidateId > election.candidatesCount) {
            revert Voting__NotAValidCandidate();
        }

        election.voters[msg.sender] = true;
        election.candidates[_candidateId].voteCount++;

        emit votedEvent(_electionId, _candidateId, msg.sender);
    }

    function endElection(uint64 _electionId) public nonReentrant {
        Election storage election = elections[_electionId];

        if (_electionId <= 0 || _electionId > electionsCount) {
            revert Voting__ElectionDoesNotExist();
        }
        if (msg.sender != election.owner) {
            revert Voting__OnlyElectionCreatorCanEndElection();
        }

        uint64 maxVoteCount = 0;
        uint64 winnerId = 0;

        for (uint64 i = 1; i <= election.candidatesCount; i++) {
            if (election.candidates[i].voteCount > maxVoteCount) {
                maxVoteCount = election.candidates[i].voteCount;
                winnerId = i;
            }
        }

        emit electionEndedEvent(
            _electionId,
            winnerId,
            election.name,
            election.candidates[winnerId].name,
            maxVoteCount
        );
    }

    function getCandidatesCount(
        uint64 _electionId
    ) public view returns (uint64) {
        return elections[_electionId].candidatesCount;
    }

    function getCandidateVoteCount(
        uint64 _electionId,
        uint64 _candidateId
    ) public view returns (uint64) {
        return elections[_electionId].candidates[_candidateId].voteCount;
    }
}
