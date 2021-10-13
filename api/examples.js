// ############################################################################
// Imports.
// ############################################################################
const api = require('./search')

// ############################################################################
// Google Image Search.
// ############################################################################
async function testGoogleSearch() {
    console.log('########################################')
    console.log('# GOOGLE SEARCH')
    console.log('########################################')

    // Success.
    console.log('-------------------- SUCCESS')
    //? Browser showing to see whats going on.
    const successResult = await api.searchWithGoogle('https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg', false)
    console.log(successResult)
    /*
    Returns:
    {
        searchUrl: 'https://www.google.com/searchbyimage?&image_url=https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg',
        imageTextClues: 'barack obama model',
        localPath: 'screenshots/ec217316b4d6db1f.png',
        entryData: [
            {
                text: 'Amazon.com: wall26 - Portrait of Barack Obama (44th President of The United  States) - American Presidents Series - Canvas Wall Art Gallery Wrap Ready  to Hang - 12x18 inches : Everything Elseamazon.com',
                url: 'https://www.amazon.com/wall26-Portrait-President-American-Presidents/dp/B01HTMAHRM'
            },
            {
                text: 'Amazon.com: Barack Obama Official Presidential Portrait 8x10 Silver Halide  Photo Print: Photographs: Posters & Printsamazon.com',
                url: 'https://www.amazon.com/Barack-Official-Presidential-Portrait-Silver/dp/B004165WJS'
            },
            {
                text: 'Trump sees Putin as his role model: Obamatribuneindia.com',
                url: 'https://www.tribuneindia.com/news/archive/world/trump-sees-putin-as-his-role-model-obama-295126'
            },
            {
                text: 'Barack Obama - Barack Obama Photos - Zimbiozimbio.com',
                url: 'https://www.zimbio.com/photos/Barack+Obama/afl_KLFskLy/Barack+Obama+Waxwork+Unveiling'
            },
            {
                text: '9 My life advisory committee ideas | micheal phelps, olympic medals,  michael phelpspinterest.com',
                url: 'https://www.pinterest.com/eddiemendoza4/my-life-advisory-committee/'
            }
        ],
        matchingSitesData: [
            {
                headline: 'Barack Obama - Wikipedia',
                description: '2687 × 3356 — Barack Hussein Obama II Zum Anhören bitte klicken! Abspielen [bəˈɹɑːk hʊˈseɪn oʊˈbɑːmə] (* 4. August 1961 in Honolulu, Hawaii) ist ein US-amerikanischer ...',
                url: 'https://de.wikipedia.org/wiki/Barack_Obama'
            },
            {
                headline: 'Aus jung wird alt: So hat sich Obama in vier Jahren verändert',
                description: '2242 × 2800 · 18.01.2013 — Das offizielle Bild für die zweite Amtszeit des US-Präsidenten Barack Obama liegt vor. Ein Vergleich mit jenem, das er vor vier Jahre ausgab ...',
                url: 'https://www.luzernerzeitung.ch/international/aus-jung-wird-alt-so-hat-sich-obama-in-vier-jahren-verandert-ld.1283784'
            },
            {
                headline: 'Die ersten Jobs der erfolgreichsten Menschen der Welt',
                description: '700 × 874 · 08.06.2019 — Barack Obama – Eisverkäufer goes President ??? „Yes, we can“ – mit diesem Satz wurde Barack Obama 2008 weltberühmt.',
                url: 'https://www.kleingeldhelden.com/2019/06/die-ersten-jobs-der-erfolgreichsten-menschen-der-welt/'
            },
            {
                headline: 'Obamas Erinnerungen kommen später - Börsenblatt',
                description: '599 × 748 · 17.09.2019 — Die mit Spannung erwarteten Memoiren des 44. Präsidenten der USA, Barack Obama, werden nun doch erst im nächsten Jahr auf den Markt kommen, ...',
                url: 'https://www.boersenblatt.net/archiv/1725195.html'
            },
            {
                headline: 'Die meisten von euch wissen, dass ich von Beginn an - Zitate ...',
                description: '2687 × 3356 · 03.06.2021 — Die meisten von euch wissen, dass ich von Beginn an gegen diesen Krieg war. Ich dachte, dass er ein tragischer Fehler war.“ - Barack Obama.',
                url: 'https://beruhmte-zitate.de/zitate/137601-barack-obama-die-meisten-von-euch-wissen-dass-ich-von-beginn-a/'
            }
        ]
    }
    */

    // Error.
    console.log('-------------------- ERROR')
    //? Headless search.
    const errorResult = await api.searchWithGoogle('nonsense.url')
    console.log(errorResult)
    /*
    Returns:
    {
        searchUrl: 'https://www.google.com/searchbyimage?&image_url=nonsense.url',
        imageTextClues: 'No useful clues found :(',
        localPath: null,
        entryData: [],
        matchingSitesData: []
    }
    */
}

// ############################################################################
// TinEye Reverse Search.
// ############################################################################
async function testTinEyeSearch() {
    console.log('########################################')
    console.log('# TINEYE SEARCH')
    console.log('########################################')

    // Success.
    console.log('-------------------- SUCCESS')
    //? Browser showing to see whats going on.
    const successResult = await api.searchWithTinEye('https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg', false)
    console.log(successResult)
    /*
    Returns:
    {
        status: 1,
        statusText: 'Matches found.',
        amountOfMatches: '10.094',
        resultText: [
            'Searched over 49.7 billion images',
            'in 5.1 seconds for:',
            'upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg'
        ],
        data: [
            {
                title: 'www.alamy.com',
                url: 'https://www.alamy.com/president-barack-obama-is-photographed-during-a-presidential-portrait-sitting-for-an-official-photo-in-the-oval-office-dec-6-2012-image413618366.html',
                thumbnail: 'https://img.tineye.com/result/595e16760ecb5bcf3d92af747918f3323c47b49426f95dd6c094a576913ddf12?size=160',
                crawlDate: 'First found on Oct 6, 2021'
            },
            {
                title: 'www.brookings.edu',
                url: 'https://www.brookings.edu/blog/markaz/2013/12/06/saban-forum-2013-begins-discussing-u-s-israel-relations-in-a-dynamic-middle-east/',
                thumbnail: 'https://img.tineye.com/result/4166e336ab94903549a767648d7c5055baee69304cc9ebf5da7c6147b655fb3e?size=160',
                crawlDate: 'First found on Oct 7, 2021'
            },
            {
                title: 'imgur.com',
                url: 'https://imgur.com/gallery/8O7eUsh',
                thumbnail: 'https://img.tineye.com/result/d4563bf0a188c2eaf5d83f0b446c5cacb36d54fc0cb07c7dfb8868e802dc19a5?size=160',
                crawlDate: 'First found on Feb 25, 2021'
            },
            {
                title: 'www.charlestonchronicle.net',
                url: 'https://www.charlestonchronicle.net/2018/12/03/gm-will-close-five-north-american-plants-next-year/',
                thumbnail: 'https://img.tineye.com/result/cca2a045a9252d6abb19dad16d18878144c23397e5f070c546bd9206e43e645e?size=160',
                crawlDate: 'First found on Jun 14, 2020'
            },
            {
                title: 'jennysoto.wordpress.com',
                url: 'https://jennysoto.wordpress.com/2016/02/10/barack-obama-srl/',
                thumbnail: 'https://img.tineye.com/result/7221698cdeed5afd6c71bbf17739b31217c98c99a45c323e52cdc3471e47c886?size=160',
                crawlDate: 'First found on Jan 16, 2021'
            },
            {
                title: 'jennysoto.wordpress.com',
                url: 'https://jennysoto.wordpress.com/2016/02/10/barack-obama-srl/',
                thumbnail: 'https://img.tineye.com/result/1f9135b9cab25f764b05d5d39d5d486b5e21fbb67118d662bf187296e2e37ec8?size=160',
                crawlDate: 'First found on Jan 5, 2019'
            },
            {
                title: 'windermeresun.com',
                url: 'http://windermeresun.com/2016/01/13/potus-who-tweets/',
                thumbnail: 'https://img.tineye.com/result/1c58882f5907429563d4e17d9995cba773e5acf24941906d667decfdb1a2ab03?size=160',
                crawlDate: 'First found on Apr 7, 2021'
            },
            {
                title: 'en.wiktionary.org',
                url: 'https://en.wiktionary.org/wiki/File:President_Barack_Obama.jpg',
                thumbnail: 'https://img.tineye.com/result/8f18c8b32c7502c2d72d03f1dced886e8027ea2ec262ac3ba95ae12c6966165b?size=160',
                crawlDate: 'First found on Apr 7, 2021'
            },
            {
                title: 'en.wikipedia.org',
                url: 'https://en.wikipedia.org/wiki/File:President_Barack_Obama.jpg',
                thumbnail: 'https://img.tineye.com/result/8f18c8b32c7502c2d72d03f1dced886e8027ea2ec262ac3ba95ae12c6966165b?size=160',
                crawlDate: 'First found on May 2, 2017'
            },
            {
                title: 'wayka.pe',
                url: 'https://wayka.pe/los-ultimos-dias-de-un-paciente-en-una-unidad-de-cuidados-intensivos-para-covid-19/',
                thumbnail: 'https://img.tineye.com/result/b804ea865470ac57d2fe154e49b053c919d01141ffcfc24660b2d9d9aad4e01e?size=160',
                crawlDate: 'First found on May 17, 2021'
            }
        ]
    }
    */

    // 0 Matches.
    console.log('-------------------- 0 MATCHES')
    //? Headless search.
    const zeroResult = await api.searchWithTinEye('https://i.redd.it/jt3msod1i9s71.jpg')
    console.log(zeroResult)
    /*
    Returns:
    { 
        status: 0,
        statusText: 'No matches found :('
    }
    */

    // Error.
    console.log('-------------------- ERROR')
    //? Headless search.
    const errorResult = await api.searchWithTinEye('nonsense.url')
    console.log(errorResult)
    /*
    Returns:
    {
        status: -1,
        statusText: 'Error. Url could not be parsed.'
    }
    */
}

// ############################################################################
// SauceNao Search.
// ############################################################################
async function testSauceNao() {
    console.log('########################################')
    console.log('# GOOGLE SEARCH')
    console.log('########################################')

    // Success.
    console.log('-------------------- SUCCESS')
    //? Showing the first 2 entries only.
    const successResult = await api.searchWithSauceNao('https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg', 2)
    console.log(successResult.results)
    /*
    Returns:
    {
        header: { status: 0, message: 'Successful search.' },
        results: [
            {
                header: {
                    similarity: '87.86',
                    thumbnail: 'https://img3.saucenao.com/twitter/k/T/s/CaxgZ7QVIAAmkTs.jpg?auth=_XEvFq416qvgjEfhH6OU6A&exp=1634065200',
                    index_id: 41,
                    index_name: 'Index #41: Twitter - CaxgZ7QVIAAmkTs.jpg',
                    dupes: 0
                },
                data: {
                    ext_urls: [Array],
                    created_at: '2016-02-09T12:43:14Z',
                    tweet_id: '697038041722912768',
                    twitter_user_id: '83343739',
                    twitter_user_handle: 'atype55'
                }
            },
            {
                header: {
                    similarity: '82.41',
                    thumbnail: 'https://img3.saucenao.com/twitter/b/y/8/D24wezPUgAAeby8.jpg?auth=RaOZIh5QRrc51QZYUkcjsA&exp=1634065200',
                    index_id: 41,
                    index_name: 'Index #41: Twitter - D24wezPUgAAeby8.jpg',
                    dupes: 0
                },
                data: {
                    ext_urls: [Array],
                    created_at: '2019-03-30T06:35:00Z',
                    tweet_id: '1111879479406678021',
                    twitter_user_id: '1615478167',
                    twitter_user_handle: 'living_op'
                }
            }
        ]
    }
    */

    // Error.
    console.log('-------------------- ERROR')
    // const errorResult = await api.searchWithTinEye('nonsense.url')
    // console.log(errorResult)
    /*
    Returns:
    {
        status: -1,
        statusText: 'Error. Url could not be parsed.'
    }
    */
}

// ############################################################################
// Execution.
// ############################################################################

//? Uncomment the desired functions and see for yourself.
//? Do use an async envorinment of you test all three at once.
testGoogleSearch()
// testTinEyeSearch()
// testSauceNao()