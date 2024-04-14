// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Script} from "forge-std/Script.sol";
import {Voting} from "../src/contract/Voting.sol";

contract DeployVoting is Script {
    function run() external returns (Voting) {
        vm.startBroadcast();

        Voting voting = new Voting();

        vm.stopBroadcast();
        return voting;
    }
}
