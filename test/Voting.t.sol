// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {Voting} from "../src/contract/Voting.sol";
import {DeployVoting} from "../script/DeployVoting.s.sol";

contract VotingTest is Test {
    DeployVoting deployer = new DeployVoting();
    Voting public voting;
    address public USER = makeAddr("user");

    function setUp() external {
        voting = deployer.run();
        vm.deal(USER, 100 ether);
    }

    function testCreateElection() external {
        voting.createElection("Election 1");
        assertEq(voting.electionsCount(), 1);
    }

    function testCreateElectionWithSameName() external {
        voting.createElection("Election 1");
        voting.createElection("Election 1");
        assertEq(voting.electionsCount(), 2);
    }

    function testCreateElectionWithDifferentName() external {
        voting.createElection("Election 1");
        voting.createElection("Election 2");
        assertEq(voting.electionsCount(), 2);
    }

    function testCreateElectionWithSameNameAndDifferentOwner() external {
        voting.createElection("Election 1");
        voting.createElection("Election 1");
        assertEq(voting.electionsCount(), 2);
    }

    function testCreateElectionWithDifferentNameAndDifferentOwner() external {
        voting.createElection("Election 1");
        voting.createElection("Election 2");
        assertEq(voting.electionsCount(), 2);
    }

    function testCreateElectionWithSameNameAndSameOwner() external {
        voting.createElection("Election 1");
        voting.createElection("Election 1");
        assertEq(voting.electionsCount(), 2);
    }

    function testCreateElectionWithDifferentNameAndSameOwner() external {
        voting.createElection("Election 1");
        voting.createElection("Election 2");
        assertEq(voting.electionsCount(), 2);
    }

    function testAddCandidate() external {
        uint64 electionId = voting.createElection("Election 1");
        voting.addCandidate(1, "Candidate 1");

        assertEq(voting.getCandidatesCount(electionId), 1);
    }

    function testAddCandidateWithSameName() external {
        uint64 electionId = voting.createElection("Election 1");
        voting.addCandidate(1, "Candidate 1");
        voting.addCandidate(1, "Candidate 1");

        assertEq(voting.getCandidatesCount(electionId), 2);
    }

    function testVote() external {
        uint64 electionId = voting.createElection("Election 1");
        voting.addCandidate(1, "Candidate 1");
        voting.vote(1, 1);

        assertEq(voting.getCandidateVoteCount(electionId, 1), 1);
    }

    function testEndElection() external {
        uint64 electionId = voting.createElection("Election 1");
        voting.addCandidate(electionId, "Candidate 1");
        voting.vote(1, 1);
        voting.endElection(1);
    }

    function testEndElectionWithMultipleCandidates() external {
        uint64 electionId = voting.createElection("Election 1");
        voting.addCandidate(electionId, "Candidate 1");
        voting.addCandidate(electionId, "Candidate 2");
        voting.vote(1, 1);
        voting.endElection(1);
    }
}
