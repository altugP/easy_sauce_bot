// ############################################################################
// Imports.
// ############################################################################
const axios = require('axios')
const crypto = require('crypto')
const dotenv = require('dotenv')
const puppeteer = require('puppeteer')

// ############################################################################
// Initial Settings.
// ############################################################################
dotenv.config()

const _viewport = { width: 1366, height: 768 } // 16:9 ratio.
const _waitForMs = 2000
//? Needed to get around bot detection on certain web sites.
const _userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';

// ############################################################################
// Google Image Search.
// ############################################################################
/**
 * Takes an image url and performs a Google image search using that image.
 * 
 * This function uses Puppeteer to perform a Google image search instead of the
 * Google API. Therefore this may take some time to load.
 * 
 * If the search is successful this will return an object with three entires:
 * 1. `searchUrl` {string} The complete url that will perform the same search when
 * clicked.
 * 2. `imageTextClues` {[string]} Tags that Google thinks describe this image.
 * 3. `localPath` {string} Path to a screenshot that has been taken from the search
 * results.
 * 
 * If Google cannot find the given image via it's url or Google cannot find
 * any similar images, this will not send the screenshot or the clue text. The
 * object will still be in the same form, but `localPath` will be `null`.
 * 
 * @param {string} imageUrl Url to the image that has to be searched.
 * @param {bool?} headless Whether the Chromium instance should start headless or not.
 * Leave this empty or false is not needed.
 * @returns {object} see above.
 */
async function searchWithGoogle(imageUrl, headless) {
    //? These 2 are the XPath paths to the buttons that need to be clicked
    //? before the search results can be retrieved.
    const similarImagesXPath = '//*[@id="rso"]/div[2]/div/div[2]/g-section-with-header/div[1]/title-with-lhs-icon/a/div[2]/h3'
    const acceptCookiesButtonXPath = '//*[@id="L2AGLb"]'
    const clueTextXPath = '//*[@id="REsRA"]'

    // Constructing the search url. This can be returned later.
    const baseUrl = 'https://www.google.com/searchbyimage?&image_url='
    const fullUrl = `${baseUrl}${imageUrl}`

    // Opening the browser and a new tab.
    const browser = await puppeteer.launch({ headless: headless })
    const page = await browser.newPage()
    await page.setViewport(_viewport)
    await page.setUserAgent(_userAgent)

    // Navigating to image search url.
    await page.goto(fullUrl)

    // Accepting googles cookie usage notification pop up.
    //? Without accepting this, you can not navigate further.
    const cookiesButton = await page.$x(acceptCookiesButtonXPath)
    await cookiesButton[0].click()

    // Searching for the `similar images` link.
    //? If it is not on this page then Google could not find any similar images.
    //? This usually means the image link is private or could not be read.
    const similarImagesLink = await page.$x(similarImagesXPath)
    const imagesFound = similarImagesLink !== undefined
        && similarImagesLink !== null && similarImagesLink.length >= 1
    let imageTextClues = 'No useful clues found :(' // What Google thinks describes the given image best.
    // Path where the screenshot will be stored if search is successful.
    let screenshotPath = null

    // If the `similar images` link is found, the browser navigates to Googles
    // image view. Otherwise this step is skipped and the algorithm terminates.
    if (imagesFound) {
        screenshotPath = `screenshots/${crypto.randomBytes(8).toString('hex')}.png`
        // Navigating to the image view.
        await similarImagesLink[0].click()
        // Waiting for all images to load.
        await page.waitForNavigation({ waitUntil: 'networkidle0' })
        // Taking a screenshot of the images.
        await page.screenshot({ path: screenshotPath })
        // Getting the clue text's value.
        const clueTextElement = await page.$x(clueTextXPath)
        imageTextClues = await (await clueTextElement[0].getProperty('value')).jsonValue()
    }

    // Closing the browser to free up memory.
    await browser.close()

    // Returning all information gathered here.
    return {
        searchUrl: fullUrl,
        imageTextClues: imageTextClues,
        localPath: screenshotPath,
    }
}


// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    searchWithGoogle: searchWithGoogle,
}