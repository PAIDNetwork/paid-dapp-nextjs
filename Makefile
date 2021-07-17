SHELL=/bin/bash

include .env
export

.PHONY: up
up: build network run

.PHONY: build
build:
	docker build -t paid-dapp --target=production \
		--build-arg=NEXT_PUBLIC_WITHDRAWALADDRESS=${NEXT_PUBLIC_WITHDRAWALADDRESS} \
		--build-arg=NEXT_PUBLIC_ROUTERPUBLICIDENTIFIER=${NEXT_PUBLIC_ROUTERPUBLICIDENTIFIER} \
		--build-arg=NEXT_PUBLIC_DEPOSITASSETID=${NEXT_PUBLIC_DEPOSITASSETID} \
		--build-arg=NEXT_PUBLIC_DEPOSITCHAINPROVIDER=${NEXT_PUBLIC_DEPOSITCHAINPROVIDER} \
		--build-arg=NEXT_PUBLIC_WITHDRAWASSETID=${NEXT_PUBLIC_WITHDRAWASSETID} \
		--build-arg=NEXT_PUBLIC_WITHDRAWCHAINPROVIDER=${NEXT_PUBLIC_WITHDRAWCHAINPROVIDER} \
		--build-arg=NEXT_PUBLIC_RPC_URL=${NEXT_PUBLIC_RPC_URL} \
		--build-arg=NEXT_PUBLIC_CONTRACT_ANCHORINNG_ADDRESS=${NEXT_PUBLIC_CONTRACT_ANCHORINNG_ADDRESS} \
		--build-arg=NEXT_PUBLIC_CONTRACT_ESCROW_ADDRESS=${NEXT_PUBLIC_CONTRACT_ESCROW_ADDRESS} \
		--build-arg=NEXT_PUBLIC_CONTRACT_PAID_TOKEN_ADDRESS=${NEXT_PUBLIC_CONTRACT_PAID_TOKEN_ADDRESS} \
		--build-arg=NEXT_PUBLIC_CONTRACT_ANCHORINNG_BLOCK=${NEXT_PUBLIC_CONTRACT_ANCHORINNG_BLOCK} \
		--build-arg=NEXT_PUBLIC_CHAIN_ID=${NEXT_PUBLIC_CHAIN_ID} \
		--build-arg=NEXT_PUBLIC_IPFS_URL=${NEXT_PUBLIC_IPFS_URL} .

.PHONY: network
network:
	docker network inspect paid-net &> /dev/null; \
    	if [ $$? -ne 0 ]; then docker network create paid-net ; fi

.PHONY: run
run:
	docker container run -d \
     	--name paid-dapp \
      	--network paid-net \
      	-p 3000:3000 paid-dapp

.PHONY: down
down:
	docker container rm -f paid-dapp

.PHONY: logs
logs:
	docker logs -f --tail 10 paid-dapp