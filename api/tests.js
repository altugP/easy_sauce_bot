const { searchWithGoogle } = require('./search')

const googleImages = [
    'https://upload.wikimedia.org/wikipedia/commons/f/f1/Dwayne_Johnson_2%2C_2013.jpg',
    'https://n-cdn.serienjunkies.de/91271.jpg',
    'asdfasdasdasdfasd',
    'https://cdn03.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_download_software_1/H2x1_NSwitchDS_HatsuneMikuProjectDivaMegaMix_image1600w.jpg',
    'https://i.redd.it/0i107m2dh2o71.jpg',
]

async function testListSearchWithGoogle() {
    for (let i = 0; i < googleImages.length; i++) {
        const result = await searchWithGoogle(googleImages[i], true)
        console.log(`Search [${i + 1}]`)
        console.log(result)
    }
}

testListSearchWithGoogle()