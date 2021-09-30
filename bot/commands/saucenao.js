// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const api = require('./../../api/search')

// ############################################################################
// Command data and logic.
// ############################################################################
const data = {
    name: 'saucenao',
    description: 'Search for an image on SauceNao. Works best for anime images.',
    url: {
        name: 'url',
        description: 'Direct URL to the image',
    },
    numRes: {
        name: 'amount',
        description: 'Max number of results to be returned. Default = 5. Must be < 10 and > 0 to be accepted.'
    }
}

function _fixValue(value) {
    if (!value) {
        return 'Not specified.'
    }
    let res = value.toString()
    if (res === 'undefined' || res === 'null' || res.replace(/ /g, '').length === 0) {
        return 'Not specified.'
    }
    return res
}

/**
 * Given a result entry from a search this builds an embed using all relevant
 * information of `result`.
 * 
 * Every index from SauceNao is formatted differently and contains different
 * information. This builds a more or less good looking embed with all relevant
 * information for the most widly used indexes. If `result` is an object from
 * a not-supported index, then this object's embed will look more barebones with
 * only header information present.
 * 
 * @param {object} result Result entry of a SauceNao search.
 * @returns {MessageEmbed} with information of `result`.
 */
function _buildEmbedFromResult(result) {
    // Basic variables that need to be displayed.
    const color = process.env.COLOR_SUCCESS
    let author = null
    let title = `${result.data.title}`
    let directUrl = result.data.ext_urls
    const description = `**${result.header.index_name}**`
    const thumbnail = `${result.header.thumbnail}`
    let fields = [
        { name: 'Similarity', value: `${result.header.similarity}%` },
        { name: 'Index ID', value: `${result.header.index_id}` },
        { name: 'Duplicates found', value: `${result.header.dupes}` },
    ]

    // Parsing data for each index.
    const indexId = result.header.index_id
    /*
    pixiv [5]:
        - pixiv_id (number)
        - member_name (string)
        - member_id (number)
    */
    if (indexId === 5) {
        author = `${result.data.member_name} (${result.data.member_id})`
        fields.push({ name: 'Pixiv ID', value: `${_fixValue(result.data.pixiv_id)}` })
    }


    /*
    Danbooru [9]:
        - danbooru_id (number)
        - gelbooru_id (number)
        - creator (string)
        - material (string)
        - characters (string)
        - source (string, url)
    */
    if (indexId === 9) {
        author = result.data.creator
        fields.push({ name: 'Danbooru ID', value: `${_fixValue(result.data.danbooru_id)}` })
        fields.push({ name: 'Gelbooru ID', value: `${_fixValue(result.data.gelbooru_id)}` })
        fields.push({ name: 'Material', value: `${_fixValue(result.data.material)}` })
        fields.push({ name: 'Characters', value: `${_fixValue(result.data.characters)}` })
    }

    /*
    Yande.re [12]:
        - yandere_id (number)
        - creator (string)
        - material (string)
        - characters (string)
        - source (string, idk)
    */
    if (indexId === 12) {
        author = result.data.creator
        fields.push({ name: 'Yande.re ID', value: `${_fixValue(result.data.yandere_id)}` })
        fields.push({ name: 'Material', value: `${_fixValue(result.data.material)}` })
        fields.push({ name: 'Characters', value: `${_fixValue(result.data.characters)}` })
    }

    /*
    H-Misc nH [18] & H-Misc EH [38]:
        - source (string)
        - creator (Array of strings)
        - eng_name
        - jp_name
    */
    if (indexId === 18 || indexId === 38) {
        author = result.data.creator.join()
        fields.push({ name: 'Source', value: `${_fixValue(result.data.source)}` })
        fields.push({ name: 'English Name', value: `${_fixValue(result.data.eng_name)}` })
        fields.push({ name: 'Japanese Name', value: `${_fixValue(result.data.jp_name)}` })
    }

    /*
    MediBang [20]:
        - title (string)
        - url (string)
        - member_name (string)
        - member_id (number)
    */
    if (indexId === 20) {
        author = `${result.data.member_name} (${result.data.member_id})`
    }

    /*
    Anime [21] & H-Anime [22]:
        - source (string, creator)
        - anidb_aid (number)
        - part (string, number)
        - year (string, release/run)
        - est_time (string, time)
    */
    if (indexId === 21 || indexId === 22) {
        author = result.data.source
        fields.push({ name: 'AniDB AID', value: `${_fixValue(result.data.anidb_aid)}` })
        fields.push({ name: 'Part', value: `${_fixValue(result.data.part)}` })
        fields.push({ name: 'Year', value: `${_fixValue(result.data.year)}` })
        fields.push({ name: 'Est. Time', value: `${_fixValue(result.data.est_time)}` })
    }

    /*
    Movies [23]:
        - source (string)
        - imbd_id (string)
        - part (null, idk)
        - year (string)
        - est_time (string duration)
    */
    if (indexId === 23) {
        author = result.data.source
        fields.push({ name: 'IMDb ID', value: `${_fixValue(result.data.imdb_id)}` })
        fields.push({ name: 'Part', value: `${_fixValue(result.data.part)}` })
        fields.push({ name: 'Year', value: `${_fixValue(result.data.year)}` })
        fields.push({ name: 'Est. Time', value: `${_fixValue(result.data.est_time)}` })
    }

    /*
    Gelbooru [25]:
        - gelbooru_id (number)
        - creator (string)
        - material (string)
        - characters (string)
        - source (string)
    */
    if (indexId === 25) {
        author = result.data.creator
        fields.push({ name: 'Gelbooru ID', value: `${_fixValue(result.data.gelbooru_id)}` })
        fields.push({ name: 'Material', value: `${_fixValue(result.data.material)}` })
        fields.push({ name: 'Characters', value: `${_fixValue(result.data.characters)}` })
        fields.push({ name: 'Source', value: `${_fixValue(result.data.source)}` })
    }

    /*
    bcy.net Illustrations [31] & bcy.net Cosplay [32]:
        - title (string)
        - bcy_id (number)
        - member_name (string)
        - member_id (number)
        - member_link_id (number)
        - bcy_type (string, 'illust' || 'coser')
    */
    if (indexId === 31 || indexId === 32) {
        author = `${result.data.member_name} (${result.data.member_id}, ${result.data.member_link_id})`
        fields.push({ name: 'BCY ID', value: `${_fixValue(result.data.bcy_id)}` })
    }

    /*
    DeviantArt [34]:
        - da_id (string)
        - author_name (string)
        - author_url (string)
    */
    if (indexId === 34) {
        author = result.data.author_name
        fields.push({ name: 'DeviantArt ID', value: `${_fixValue(result.data.da_id)}` })
        fields.push({ name: 'Author Profile', value: `${_fixValue(result.data.author_url)}` })
    }

    /*
    MangaDex [37]:
        - md_id (number)
        - mu_id (number)
        - mal_id (number)
        - source (string, manga name)
        - part (string, chapter)
        - artist (string)
        - author (string)
    */
    if (indexId === 37) {
        author = result.data.artist
        fields.push({ name: 'MD ID', value: `${_fixValue(result.data.md_id)}` })
        fields.push({ name: 'MU ID', value: `${_fixValue(result.data.mu_id)}` })
        fields.push({ name: 'MAL ID', value: `${_fixValue(result.data.mal_id)}` })
        fields.push({ name: 'Source', value: `${_fixValue(result.data.source)}` })
        fields.push({ name: 'Part', value: `${_fixValue(result.data.part)}` })
        fields.push({ name: 'Artist', value: `${_fixValue(result.data.artist)}` })
        fields.push({ name: 'Author', value: `${_fixValue(result.data.author)}` })
    }

    /*
    Artstation [39]:
        - title (string)
        - as_project (string)
        - author_name (string)
        - author_url (string)
    */
    if (indexId === 39) {
        author = result.data.author_name
        fields.push({ name: 'Project', value: `${_fixValue(result.data.as_project)}` })
        fields.push({ name: 'Author Profile', value: `${_fixValue(result.data.author_url)}` })
    }

    /*
    FA [40]:
        - title (string)
        - fa_id (number)
        - author_name (string)
        - author_url (string)
    */
    if (indexId === 40) {
        author = result.data.author_name
        fields.push({ name: 'FA ID', value: `${_fixValue(result.data.fa_id)}` })
        fields.push({ name: 'Author Profile', value: `${_fixValue(result.data.author_url)}` })
    }

    /*
    Twitter [41]:
        - created_at (date as String ISO)
        - tweet_id  (string)
        - twitter_user_id (string)
        - twitter_user_handle (string)
    */
    if (indexId === 41) {
        author = `@${result.data.twitter_user_handle}`
        fields.push({ name: 'Tweet ID', value: `${_fixValue(result.data.tweet_id)}` })
        fields.push({ name: 'Creation Date', value: `${_fixValue(result.data.created_at)}` })
    }

    // Quick check if some data is missing. Everything not on here is mandatory
    // in SauceNao's responses.
    if (!author || author === undefined || author === null
        || author === 'undefined' || author === 'null') author = 'Unknown author'
    if (!title || title === undefined || title === null
        || title === 'undefined' || title === 'null') title = 'Untitled'

    // Creating the actual embed with all relevant info.
    let embed = new MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setAuthor(author)
        .setDescription(description)
        .addFields(...fields)
        .setThumbnail(thumbnail)
        .setTimestamp()

    // Direct URL is only settable if it exists.
    //! Has to be converted to string to be used.
    if (directUrl !== undefined && directUrl !== null) {
        embed = embed.setURL(`${directUrl}`)
    }

    return embed
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description)
        .addStringOption((url) =>
            url.setName(data.url.name)
                .setDescription(data.url.description)
                .setRequired(true))
        .addIntegerOption((numRes) =>
            numRes.setName(data.numRes.name)
                .setDescription(data.numRes.description)
                .setRequired(false)),
    async execute(interaction) {
        // Direct image url.
        const url = interaction.options.getString(data.url.name, true)
        let numRes = interaction.options.getInteger(data.numRes.name, false)
        if (numRes === null || numRes === undefined || numRes >= 10 || numRes < 1) numRes = 5

        // Indicating user, that bot is searching.
        await interaction.deferReply()

        // Searching.
        const result = await api.searchWithSauceNao(url, numRes)

        // Error.
        if (result.header.status !== 0) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR_ERROR)
                .setTitle('SauceNao Error')
                .setAuthor(interaction.client.user.username,
                    interaction.client.user.avatarURL())
                .setDescription('An error occurred while serching for your image.')
                .setThumbnail(process.env.SAUCENAO_IMAGE)
                .addFields(
                    { name: 'Status Code', value: `${result.header.status}` },
                    { name: 'Message', value: `${result.header.message}` }
                )
                .setTimestamp()
            await interaction.editReply({ embeds: [embed] })
        }
        // Replying with data.
        else {
            // Results as embeds.
            const embeds = result.results.map((e) => _buildEmbedFromResult(e))

            // Send all embeds in a follow up message.
            await interaction.editReply({
                content: `Found ${result.results.length} matches for your image.`,
                embeds: embeds,
            })
        }
    },
}