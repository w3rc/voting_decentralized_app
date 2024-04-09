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

    mapping(uint => Election) public elections;
    mapping(address => bool) public voters;
    uint public electionsCount;    

    event votedEvent (
        uint indexed _electionId,
        uint indexed _candidateId
    );

    function createElection(string memory _name) public {
        electionsCount++;
        Election storage election = elections[electionsCount];
        election.id = electionsCount;
        election.name = _name;
    }

    function addCandidate(uint _electionId, string memory _name) public {
        Election storage election = elections[_electionId];
        election.candidatesCount ++;
        election.candidates[election.candidatesCount] = Candidate(election.candidatesCount, _name, 0);
    }

    function vote (uint _electionId, uint _candidateId) public {
        Election storage election = elections[_electionId];
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateId > 0 && _candidateId <= election.candidatesCount, "Not a valid candidate.");

        voters[msg.sender] = true;
        election.candidates[_candidateId].voteCount ++;

        emit votedEvent(_electionId, _candidateId);
    }



}