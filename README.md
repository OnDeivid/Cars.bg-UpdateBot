
# Cars.bg-UpdateBot

This repository contains a Node.js script that automates the process of logging into the Cars.bg website and refreshing the user's car listings. The script uses Puppeteer to control a browser for interacting with the website.

# Features

• Automatic login to Cars.bg using credentials from environment variables.

• Periodic execution based on a predefined schedule.

• Ability to refresh car listings automatically to keep them up-to-date.

• Configurable to run in manual or automatic mode.

• Prevents duplicate execution within the same day.

# Prerequisites
Before running this script, ensure you have the following installed:

#### Node.js
#### npm (Node package manager)


# Configuration

change your Cars.bg login credentials.

#### email = "myEmailHere"
#### password = "myPasswordHere"

## Automatic Mode

To run the script in automatic mode, set the "autoRun" variable to "true" and configure the desired "targetHour" in the script.

#### const autoRun = true

#### const targetHour = 2
The hour (0-23) when the bot should run.

#### !!! Make sure your system's power settings are configured to prevent sleeping or locking, which could interrupt the bot's operations.


## Manual Mode

To run the script manually, set the "autoRun" variable to "false".

#### const autoRun = false

# Running the Script

## Automatic Mode
For automatic execution, you can use a process manager like pm2 to keep the script running in the background.

#### pm2 start bot.js


## Manual Mode
For manual execution, simply use npm to start the script.

### npm start
