# hardhat-time-n-mine

This plugin will help you manipulate time and mine blocks while testing and while using the `hardhat node` to develop any type of DApp.

[Hardhat](https://hardhat.org) plugin example. 

## What

This plugins adds some tasks to manipulate the timestamp in the future blocks if you are using `hardhat node`, it will help you develop DApps that are time dependent without waiting time to actually elapse.

As well as adding said tasks it also extends the HardhatRuntimeEnvironment with the same tasks in a function format so to let you use it in a JS/TS environment(being it automated tests, or your own scripts and tasks). 

## Installation

To install it you just need

```bash
npm install @atixlabs/hardhat-time-n-mine hardhat
```

Import the plugin in your `hardhat.config.js`:

```js
require("@atixlabs/hardhat-time-n-mine");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@atixlabs/hardhat-time-n-mine";
```


## Required plugins

This plugin does not require any other plugin, it just needs you to install Hardhat ^2.0.0(has been tested with 2.4.0).

## Tasks


This plugin adds the tasks explained in the following subsections.
Note that you MUST use the `--network localhost` if you are running the node locally(or any other network with a defined url that points to your node).

### mine
```
Usage: hardhat [GLOBAL OPTIONS] mine [--amount <INT>]

OPTIONS:

  --amount	amount of blocks to be mined (default: 1)

mine: mines a single block

For global options help run: hardhat help
```

### increaseTime
```
Usage: hardhat [GLOBAL OPTIONS] increaseTime delta

POSITIONAL ARGUMENTS:

  delta	difference to add to the current time tracker. Can be a number representing the seconds or a string representing the delta

increaseTime: adds the given delta. NOTICE: this counts 'real' ellapsing time and is not idempotent, we recommend you user setTimeIncrease

For global options help run: hardhat help
```

We are using [ms](https://www.npmjs.com/package/ms) to parse the delta if it is not a number, so you can use any of those formats.

Examples:

- `hardhat increaseTime 10`: Increases ten seconds
- `hardhat increaseTime 1d`: Increases a day
- `hardhat increaseTime "1 week"`: Increases a week
- `hardhat increaseTime 1y`: Increases a year


### setTimeIncrease
```
Usage: hardhat [GLOBAL OPTIONS] setTimeIncrease delta

POSITIONAL ARGUMENTS:

  delta	difference between the current timestamp and the next. Can be a number representing the seconds or a string representing the delta

setTimeIncrease: makes the next block timestamp increase the given delta with respect to the current block timestamp

For global options help run: hardhat help
```

We are using [ms](https://www.npmjs.com/package/ms) to parse the delta if it is not a number, so you can use any of those formats.

Examples:

- `hardhat setTimeIncrease 10`: Increases ten seconds
- `hardhat setTimeIncrease 1d`: Increases a day
- `hardhat setTimeIncrease "1 week"`: Increases a week
- `hardhat setTimeIncrease 1y`: Increases a year

### setTimeNextBlock
```
Usage: hardhat [GLOBAL OPTIONS] setTimeNextBlock time

POSITIONAL ARGUMENTS:

  time	timestamp of the next block 

setTimeNextBlock: set the timestamp of the next block(does not actually mine)

For global options help run: hardhat help
```

### setTime

```
Usage: hardhat [GLOBAL OPTIONS] setTime time

POSITIONAL ARGUMENTS:

  time	timestamp of the next block 

setTime: mines a single block with a given time, effectively setting the time of the blockchain

For global options help run: hardhat help
```


## Environment extensions

This plugin extends the Hardhat Runtime Environment by adding an `timeAndMine` field
which is an object with five functions, namely:

- mine

- setTime

- setTimeNextBlock

- increaseTime

- setTimeIncrease

Each of the previously mentioned functions behave like the previously mentioned tasks(but having all of its parameters required) and can be used within your tests/scripts.



## Configuration

This plugin does not need any type of extra configuration.

## Usage

Once you have the plugin installed and imported in your hardhat.config.js/hardhat.config.ts, you don't have to do anything else, just use the functions in the `timeAndMine` object or use the defined tasks.


## Contributing

Once you installed the repo, you will be able to test the tasks using 

`npm run test:tasks`

(you will have to have a node running for that)

To test the hre methods, you will have to run:

`npm run test:hreMethods`

You can test all of it using

`npm test`

You can lint it using:

`npm run lint`

or

`npm run lint:fix`

### Future work

- Add `ms` to parse time deltas
- Add some date parsing 
