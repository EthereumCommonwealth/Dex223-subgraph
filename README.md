# DEX223 V1 Subgraph

## Setup project

Pending Changes at same URL

```bash
git clone https://github.com/EthereumCommonwealth/dex223-subgraph
```

```bash
cd dex223-subgraph && touch .env
```

Add values to `.env` file

```bash
NETWORK=<network name>
SUBGRAPH_KEY=<add subgraph secret key from TheGraph studio>
```

Add file with in `./config/<network name>.js` watch for example in directory

```bash
yarn template
yarn compile
export $(xargs < .env) && graph deploy --studio dex223-v1-$NETWORK
```

## Test

If you want to run test install docker.

```bash
graph test -d
```
