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
 * If the search is successful this will return an object with these entires:
 * 1. `searchUrl` {string} The complete url that will perform the same search when
 * clicked.
 * 2. `imageTextClues` {[string]} Tags that Google thinks describe this image.
 * 3. `localPath` {string} Path to a screenshot that has been taken from the search
 * results.
 * 4. `entryData` {[object]} The first 5 (or less) entries of the search. This
 * array will contain objects with 2 fields only: `text` which is the text of the
 * image link and `url` which is the destination of the image link from Google.
 * 5. `matchingSitesData` {[object]} The first 5 or less entries on Google that contain
 * the image on their site. These objects will have three fields: `headline` which is
 * the text of the link on Google, `description` which is the text underneath the link
 * and `url` which is a direct url to the site. The url does not necessarily have to
 * link to a site containing the image. It may be nested on there as well.
 * 
 * If Google cannot find the given image via it's url or Google cannot find
 * any similar images, this will not send the screenshot or the clue text. The
 * object will still be in the same form, but `localPath` will be `null`.
 * `entryData` will be an empty array if the search fails. The same goes for
 * `matchingSitesData`.
 * 
 * @param {string} imageUrl Url to the image that has to be searched.
 * @param {bool?} headless Whether the Chromium instance should start headless or not.
 * Leave this empty or false is not needed.
 * @returns {object} see above.
 */
async function searchWithGoogle(imageUrl, headless) {
    const similarImagesXPath = '//*[@id="rso"]/div[2]/div/div[2]/g-section-with-header/div[1]/title-with-lhs-icon/a/div[2]/h3'
    //? These 2 are the XPath paths to the buttons that need to be clicked
    //? before the search results can be retrieved.
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
    await page.waitForNavigation({ waitUntil: 'networkidle2' })

    // Searching for sites containing the image.
    //? The `Sites with matching images` label contains this as CSS class.
    //? This option may not exist or only exists once per site.
    //? Every link classed `g` will be of sites that have the searched image
    //? posted on there.
    const matchingImagesTextClass = '.normal-header'
    //? This is a container class that contains links to other sites. Those
    //? sites have the `g` CSS glass. Only the links that are inside a block
    //? which contains the element with `matchingImagesTextClass` are to be
    //? considered here, since the rest may be irrelevant.
    const linkBlockClass = '.ULSxyf'
    const linkClass = '.g'

    const matchingImageLinks = await page.evaluate((blocks, label, link) => {
        const allBlocksNodeList = document.querySelectorAll(blocks)

        console.log('all blocks')
        console.log(allBlocksNodeList)

        if (allBlocksNodeList !== undefined && allBlocksNodeList !== null) {
            // All CSS blocks containing `g` elements are in this NodeList.
            const allBlocks = Array.from(allBlocksNodeList)
            if (allBlocks.length <= 0) {
                // No block elements found. This is an error!
                return null
            }

            // Filtering for only the block with the label in it.
            const tmpArr = allBlocks.filter((e) => e.querySelectorAll(label).length > 0)
            if (!tmpArr || tmpArr.length <= 0) {
                // No label found. This is an error.
                return null
            }

            // This block contains the label as well as all links containing the image.
            const block = tmpArr[0]
            const relevantLinks = [] //? This will hold all links in a good format.

            //? This holds all relevant links as `div` element.
            const relevantElements = Array.from(block.querySelectorAll(link))

            for (let i = 0; i < relevantElements.length; i++) {
                // (g) -> div -> .tF2Cxc -> 
                // 1) .yuRUbf -> a (contains link in href) -> h3 (contains text as headline)
                // 2) .IsZvec -> div[1] -> div (contains text, potentially formated using spans)
                const el = relevantElements[i]
                const elLinkUrl = el.querySelectorAll('div>.tF2Cxc>.yuRUbf>a')[0].href
                const elLinkHeadline = el.querySelectorAll('div>.tF2Cxc>.yuRUbf>a>h3')[0].textContent
                const elLinkDescription = el.querySelectorAll('div>.tF2Cxc>.IsZvec>div')[1].textContent

                relevantLinks.push({
                    headline: elLinkHeadline,
                    description: elLinkDescription,
                    url: elLinkUrl,
                })
            }

            return relevantLinks
        }

        // No block elements found. This is an error!
        return null
    }, linkBlockClass, matchingImagesTextClass, linkClass)

    // Searching for the `similar images` link.
    //? If it is not on this page then Google could not find any similar images.
    //? This usually means the image link is private or could not be read.
    const similarImagesLink = await page.$x(similarImagesXPath)
    const imagesFound = similarImagesLink !== undefined
        && similarImagesLink !== null && similarImagesLink.length >= 1
    let imageTextClues = 'No useful clues found :(' // What Google thinks describes the given image best.
    // Path where the screenshot will be stored if search is successful.
    let screenshotPath = null
    // Stores about 5 entries of the image search results.
    const imageEntries = []

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

        // Container.
        const entryContainerXPath = '//*[@id="islrg"]/div[1]'
        const numberOfEntries = await page.evaluate((c) =>
            document.evaluate(
                c,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null)
                .singleNodeValue
                .children
                .length,
            entryContainerXPath,
        )

        if (numberOfEntries > 0) {
            const max = numberOfEntries < 5 ? numberOfEntries : 5
            // Elements.
            // ? Number starts at 1 for entries.
            const elementTemplateXPath = '//*[@id="islrg"]/div[1]/div[NUMBER]'
            for (let i = 1; i < max + 1; i++) {
                const c = elementTemplateXPath.replace('NUMBER', `${i}`)
                const imageEntry = await page.evaluate((c) => {
                    const a = document.evaluate(
                        c,
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null)
                        .singleNodeValue
                        .children[1]
                    const text = a.textContent
                    const url = a.href
                    return {
                        text: text,
                        url: url,
                    }
                },
                    c,
                )
                imageEntries.push(imageEntry)
            }
        }
    }

    // Closing the browser to free up memory.
    await browser.close()

    // Returning all information gathered here.
    return {
        searchUrl: fullUrl,
        imageTextClues: imageTextClues,
        localPath: screenshotPath,
        entryData: imageEntries,
        matchingSitesData: !matchingImageLinks ? [] : matchingImageLinks,
    }
}

// ############################################################################
// TinEye Reverse Search.
// ############################################################################
/**
 * A custom enum that shows the status of a search request.
 * 
 * * `error`        -> -1: Given url could not be parsed.
 * * `zeroMatches`  ->  0: No matches could be found for the image.
 * * `success`      ->  1: TinEye found at least one relate image.
 */
const TinEyeStatus = {
    error: -1,
    zeroMatches: 0,
    success: 1,
    generateText: (code) => {
        switch (code) {
            case TinEyeStatus.error:
                return 'Error. Url could not be parsed.'
            case TinEyeStatus.zeroMatches:
                return 'No matches found :('
            case TinEyeStatus.success:
                return 'Matches found.'
        }
    }
}

/**
 * Takes an image url and performs a search on TinEye using that image.
 * 
 * This function uses Puppeteer to perform a TinEye reverse search instead of
 * the TinEye API. Therefore this may take some time to load. Also this
 * function is badly written, since I'm new to Puppeteer xD .
 * 
 * If the search is successful this will return an object with following
 * entries:
 * 1. `status`: {number} A numerical indicator of the success of this search.
 * See `TinEyeStatus` for more infos.
 * 2. `statusText`: {string} A simple text explaining the status code.
 * 3. `amountOfMatches`: {string} The number of similar images that were found
 * by TinEye.
 * 4. `resultText`: {[string]} A text created by TinEye that shows how many
 * images were searched and how long that took. Contains three entries:
        - [0]: 'Searched over X billion images'
        - [1]: 'in Y seconds for:'
        - [2]: image link as url
 * 5. `data`: {[object]} A list of matches. A match is an object with four
 * entries:
 *      1. `title`: {string} The website this match originates from (potential
 *      source of the given image).
 *      2. `url`: {string} A direct link (url) to the website with the image on
 *      it.
 *      3. `thumbnail`: {string} A thumbnail (url) of the found match. Usually
 *      the same image in a lower resolution.
 *      4. `crawlDate`: {string} A string indicating when this image was first
 *      found on TinEye. Written in English.
 * 
 * If the search fails this will return the same object but only with `status`
 * and `statusText` as entries.
 * 
 * @param {string} imageUrl Url to the image that has to be searched. 
 * @param {bool?} headless Whether the Chromium instance should start headless or not.
 * Leave this empty or false is not needed.
 * @returns {object} see above.
 */
async function searchWithTinEye(imageUrl, headless) {
    // Opening the browser and a new tab.
    const browser = await puppeteer.launch({ headless: headless })
    const page = await browser.newPage()
    await page.setViewport(_viewport)
    await page.setUserAgent(_userAgent)

    // Navigating to TinEye and filling in the information.
    const baseUrl = 'https://tineye.com/'
    const textInputElement = '#url_box'
    const submitButtonElement = '#url_submit'

    await page.goto(baseUrl)
    await page.waitForSelector(textInputElement)
    await page.waitForSelector(submitButtonElement)

    // Filling out the form with the given image's url.
    await page.evaluate((tUrl, iUrl) => {
        const textInputField = document.querySelector(tUrl)
        textInputField.value = iUrl
    }, textInputElement, imageUrl)

    // Submitting the link and starting the search.
    await page.click(submitButtonElement)
    await page.waitForNavigation() // Waiting for new site to load.

    // Parsing the results after waiting for TinEye to finish searching.
    const results = await _parseSearchResult(page)

    // Closing the browser to free up memory.
    await browser.close()

    return results
}

async function _parseSearchResult(page) {
    //? If the image could not be read, then TinEye will display an error image.
    //? This is the CSS class of that image. If an element with this class is
    //? found while searching, then the given imageUrl is not valid or cannot
    //? be read (wrong format or private).
    const errorIndicatorElement = '.error-robot'

    //? If TinEye cannot find any search results the resulting site will look
    //? different than a regular results page. A container element will have
    //? this as it's class if that happens.
    const noMatchesIndicatorElement = '.no-results'

    //? If search is successful a ??<span>?? with this id will be found on the site.
    const resultCountElement = '#result_count'
    //? Furthermore this will be an `<h3>` stating how long the search lasted for
    //? and how many images were searched.
    const resultTextXPath = '//*[@id="results-div"]/div[1]/div/div/div/div[2]/h3'

    await page.waitForTimeout(_waitForMs) // Yeah, I have to wait until the page loads. :(

    // Checking if url could be parsed.
    const urlParseSuccess = await page.evaluate((c) => {
        const nodeList = document.querySelectorAll(c)
        return nodeList.length <= 0
    }, errorIndicatorElement)

    if (!urlParseSuccess) {
        return {
            status: TinEyeStatus.error,
            statusText: TinEyeStatus.generateText(TinEyeStatus.error),
        }
    }

    // Checking if no matches were found.
    await page.waitForTimeout(_waitForMs * 3) // Waiting once more, bruh :(

    const noMatchesFound = await page.evaluate((c) => {
        const nodeList = document.querySelectorAll(c)
        return nodeList.length > 0
    }, noMatchesIndicatorElement)

    if (noMatchesFound) {
        return {
            status: TinEyeStatus.zeroMatches,
            statusText: TinEyeStatus.generateText(TinEyeStatus.zeroMatches),
        }
    }

    //? At this point the search has resulted in at least 1 direct result.
    const amountOfMatches = (await page.evaluate(
        (d) => document.querySelector(d).textContent, resultCountElement))
        .trim()
        .split(' ')[0]

    // ResultText (in the end) contains three entries:
    // [0]: 'Searched over X billion images
    // [1]: 'in Y seconds for:'
    // [2]: <image link>
    let resultText = (await page.$x(resultTextXPath))[0]
    resultText = (await page.evaluate((e) => e.textContent, resultText))
        .trim()
        .split('  ')

    // Parsing all results.
    //? A nested element will have this as it's class. Inside this there will be
    //? an `<h4>` element. It's `title` will be the name of the site the image was
    //? fount on and inside that `<h4>` there will always be an `<a>` linking to
    //? the direct image source (`href`).
    const matchListElements = '.match'
    //? Inside one entry of the list of results there are these two elements.
    //? The thumbnail contains an `<a>` with an `<img>` inside it, that has the
    //? thumbnail as it's `src` (from the searched site).
    const thumbnailListElements = '.match-thumb'
    //? A `<span>` with information on the date this image was first found on the
    //? current match's site will be inside the `.match` element. The information
    //? is this element's text value.
    const crawlDateListElements = '.crawl-date'
    await page.waitForSelector('.results.row')

    // Stores a list of all `.match` elements.
    const matchResults = await page.evaluate((c) => {
        let mData = []
        const nodeList = document.querySelectorAll(c)
        for (let j = 0; j < nodeList.length; j++) {
            const headline = nodeList[j].getElementsByTagName('h4')[0]
            const title = headline.getAttribute('title')
            const link = headline.getElementsByTagName('a')[0].getAttribute('href')
            mData.push({
                title: title,
                url: link,
            })
        }
        return mData
    }, matchListElements)

    // Stores a list of all thumbnail links ordered by appearance.
    const thumbnailResults = await page.evaluate((c) => {
        let tData = []
        const nodeList = document.querySelectorAll(c)
        for (let j = 0; j < nodeList.length; j++) {
            const a = nodeList[j].getElementsByTagName('a')[0]
            const img = a.getElementsByTagName('img')[0]
            tData.push(img.getAttribute('src'))
        }
        return tData
    }, thumbnailListElements)

    // Stores a list of all crawl dates of matches ordered by appearance.
    const crawlDateResults = await page.evaluate((c) => {
        let cData = []
        const nodeList = document.querySelectorAll(c)
        for (let j = 0; j < nodeList.length; j++) {
            cData.push(nodeList[j].textContent.substring(3))
        }
        return cData
    }, crawlDateListElements)

    // Combines all three results lists into a list of objects containing
    // all relevant data for itself.
    const matchesData = []
    for (let i = 0; i < matchResults.length; i++) {
        matchesData.push({
            title: matchResults[i].title,
            url: matchResults[i].url,
            thumbnail: thumbnailResults[i],
            crawlDate: crawlDateResults[i]
        })
    }

    // Compiling all results and returning those as an object.
    return {
        status: TinEyeStatus.success,
        statusText: TinEyeStatus.generateText(TinEyeStatus.success),
        amountOfMatches: amountOfMatches,
        resultText: resultText,
        data: matchesData,
    }
}

// ############################################################################
// SauceNao Search.
// ############################################################################
/**
 * Takes an image url and performs a search on SauceNao using that image.
 * 
 * This uses the SauceNao web API for it's search. Therefore an API key has to
 * be provided in `.env` for this to work. See the `README.md` file for more
 * info.
 * 
 * Uses SauceNao for everything. If this is successful, an object will be
 * returned. That object will contain it's `header` information as well as
 * a `results` field with all matches.
 * 
 * If this fails this will return an object with only a `header`. The error
 * code will be found in `status` (!= 0) and a short description of the error
 * will be found in `message` of that header.
 * 
 * @param {string} imageUrl Url to the image that has to be searched.
 * @param {number?} numres Amount of (max) results to be shown. Default = 16.
 * @returns {object} An object with a `header` field as well as `results`
 * field in case of success. `header` will contain `status` and a `message`
 * explaining the status. `results` is an array of SauceNao match objects.
 * Those objects have two fields: `header` for meta data and `data` for details.
 * Those objects' `header`s are built the same. They give information about `similarity`
 * {number} in % to the original image, `thumbnail` {string} (url), `index_id`
 * {number} of their server, `index_name` {string} as readable name for their
 * server, `dupes` {number} amount of duplicates found of this image. The objects'
 * `data` fields are dependant on their actual index. Read SauceNaos documentation
 * for more infos.
 */
async function searchWithSauceNao(imageUrl, numres = 16) {
    // Building the search URL.
    const db = 999 // Use all databases for image lookup.
    const outputType = 2 // Using JSON as data format.
    const url = imageUrl

    //? Making an HTTP GET call to `baseUrl` should start the search now.
    let baseUrl = 'https://saucenao.com/search.php'
    baseUrl += `?db=${db}`
    baseUrl += `&output_type=${outputType}`
    baseUrl += `&api_key=${process.env.SAUCENAO_API_KEY}`
    baseUrl += `&numres=${numres}`
    baseUrl += `&url=${url}`

    // Making the request and parsing the respnse.
    const response = await axios.get(baseUrl)
    const jsonResponse = response.data

    const data = await _parseSauceNaoResponse(jsonResponse)
    return data
}

async function _parseSauceNaoResponse(res) {
    // Checking for errors.
    const status = res.header.status
    if (status !== 0) {
        // Could be handled better, but I think this is something for the bot 'front end'.
        return {
            header: {
                status: res.header.status,
                message: res.header.message,
            }
        }
    }

    // Returning all data with a manually created message.
    //? `message` is undefined if `status` === 0 from API.
    return {
        header: {
            status: res.header.status,
            message: 'Successful search.',
        },
        results: res.results,
    }
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    searchWithGoogle: searchWithGoogle,
    searchWithTinEye: searchWithTinEye,
    searchWithSauceNao: searchWithSauceNao,
}