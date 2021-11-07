#!/usr/bin/env bash

# NOTE: Before running this script, make sure your emulator
# is online by running the following command: flow emulator

# Helps make output more readable
BLUE=$(tput setaf 4)
NORMAL=$(tput sgr0)

# Ensures that this script is run from the same directory as flow.json
cd "$(dirname "$0")" && \
cd .. && \

# Deploy core contracts to emulator
printf "\n\n${BLUE}Deploying contracts...\n${NORMAL}" && \
flow project deploy && \

# Create an account for development purposes
printf "${BLUE}Creating a FLOW account for development purposes...\n\n${NORMAL}" && \
flow accounts create \
  --key d8eaaeaefe1dc4569904c8a23f44841a36895b445c5110abd649378eb9a5cf9b2fac31578490fd4b4920484afda294ff5d41bb12ef9dc665888edb9503adea12 \
  --key-weight 1000 \
  --signer emulator-account \
  --hash-algo SHA3_256 \
  --sig-algo ECDSA_P256 && \

# NOTE: The Flow emulator is deterministic. The first account 
# we create on startup will always have address 0x01cf0e2f2f715450

# Install an FUSD vault in the development account
printf "\n\n${BLUE}Setting up FUSD vault...\n\n${NORMAL}" && \
flow transactions send ./cadence/transactions/fusd/setup.cdc 0x01cf0e2f2f715450 --signer local-account && \

# Fund the account with FLOW tokens
printf "\n\n${BLUE}Sending FLOW tokens to newly created account...\n\n${NORMAL}" && \
flow transactions send ./cadence/transactions/flow-tokens/mint.cdc 0x01cf0e2f2f715450 1000.0 && \

# Fund the account with FUSD
printf "\n\n${BLUE}Sending FUSD to newly created account...\n\n${NORMAL}" && \
flow transactions send ./cadence/transactions/fusd/mint.cdc 0x01cf0e2f2f715450 1000.0 && \

# Notify user that setup is done
printf "${BLUE}Setup complete!\n"