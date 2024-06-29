//  NOTE!!!
//  If running in automatic mode (autoRun = true), ensure that Windows power settings are configured
//  to prevent the system from sleeping or locking, as this can interrupt the bot's operations.
//  Adjust the power settings to keep the computer awake during the scheduled bot execution.



require('dotenv').config();
const puppeteer = require('puppeteer');

let flag = { flag: false };


// Ensure targetHour is within the valid range of 1 to 24.
let targetHour = 2 // only for automatically 



targetHour == 24 ? targetHour = 0 : targetHour


// To run in the background automatically without manual execution, use "pm2 start bot.js". "autoRun" Must be set to true.
// To run manually, execute "npm start". "autoRun" Must be set to false.
const autoRun = true //auto = true ----- manually = false


const checkConditions = (hour, targetHour, flag, min) => {

    if (hour == targetHour + 1) {
        flag.flag = false
    }

    if (hour != targetHour) {
        console.log(`Current hour is ${hour}:${min}. The bot only runs at 23:00. Exiting.`);
        return false
    }

    if (flag.flag == true) {
        console.log(`Bot has already run today. Exiting to avoid duplicate execution. Current time: ${hour}:${min}`)
        return false
    }

    return true
}

async function bot() {

    let date = new Date();
    let min = date.getMinutes();
    let hour = date.getHours();

    if (autoRun) {
        if (!checkConditions(hour, targetHour, flag, min)) {
            return
        }
    }

    const email = process.env.email     //  change process.env.email to "your email"
    const password = process.env.password   //  change process.env.password to "your password"

    const browser = await puppeteer.launch({ headless: false })

    try {

        console.log('!!!!!!!!!!-launched-!!!!!!!!!!')

        const page = await browser.newPage();
        flag.flag = true

        await page.goto('https://www.cars.bg/loginpage.php?ref=https://www.cars.bg/carslist.php?open_menu=1');

        await new Promise(resolve => setTimeout(resolve, 2500));
        await page.waitForSelector('.mdc-tab-scroller__scroll-content')
        await page.waitForSelector('#bottomSheetContainer')
        await page.click(`button#businessTab`);

        await page.waitForSelector('input#usernameLoginForm');

        await page.type('input#usernameLoginForm', email);
        await page.type('input[type="password"]', password);

        await page.waitForSelector('form#loginForm', { visible: true });

        await page.keyboard.press('Enter');

        await page.waitForNavigation();

        await page.goto('https://www.cars.bg/my_carlist.php');


        // Retrieve the length of the car list
        const itemsLength = await page.evaluate(() => {
            const parentContainer = document.querySelector('div.mdc-layout-grid__inner');

            if (!parentContainer) return 0;

            const items = parentContainer.querySelectorAll('div[data-item]');

            return items.length;
        })

        console.log(`Found ${itemsLength} items to process`);

        // Iterate through each car item and perform the update process
        for (let i = 1; i <= itemsLength; i++) {

            await page.waitForSelector(`div[data-item="${i}"] a.list-offer`);
            await page.click(`div[data-item="${i}"] a.list-offer`);

            await page.waitForSelector('div#edit_button.navbar-middle');
            await page.click('div#edit_button.navbar-middle');

            await page.waitForSelector('a#publishBtn');
            await page.click('a#publishBtn')

            await page.goto('https://www.cars.bg/my_carlist.php');
        }

        console.log('All items processed successfully!');

    } catch (error) {
        console.error(error)

        await browser.close()

    }
    finally {
        await browser.close()
    }

};


autoRun ? setInterval(bot, 3000) : bot();
