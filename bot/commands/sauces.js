// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

// ############################################################################
// Command data and logic.
// ############################################################################
const data = {
    name: 'sauces',
    description: 'Gives recipes and instructions for some basic sauces.',
    choice: {
        name: 'sauce-choice',
        description: 'Select your desired sauce.',
    },
    sauces: [
        {
            name: 'Béchamel Sauce',
            author: 'margaret_fullington @ allrecipes.co.uk',
            url: 'http://allrecipes.co.uk/recipe/26330/bechamel-white-sauce.aspx',
            description: 'A smooth **béchamel white sauce** for for lasagne or pasta bakes. You can also use it as the base for other sauces, such as cheese sauce or parsley sauce for fish.',
            thumbnail: 'http://ukcdn.ar-cdn.com/recipes/large/41cab605-c5d0-4657-838e-4ce46a722b21.jpg',
            ingredients: [
                '60g butter',
                '60g plain flour',
                '600ml milk',
                'salt and pepper to taste',
            ],
            info: {
                servings: '4',
                prepTime: '5 minutes',
                cookTime: '10 minutes',
            },
            instructions: [
                'Melt the butter in a saucepan over medium-low heat.',
                'Stir in the flour. Whisk in a little of the milk at a time, stirring continuously until you have a smooth, slightly thick sauce.',
                'Remove from the heat; seaon with salt and pepper. Add bay leaf for additional flavour.',
            ],
        },
        {
            name: 'Hollandaise Sauce',
            author: 'Lisa Bryan @ downshiftology.com',
            url: 'https://downshiftology.com/recipes/hollandaise-sauce/',
            description: '**Hollandaise sauce** is a classic creamy sauce that’s perfect for breakfast or brunch! This recipe is easy and no-fail. It takes just 5 minutes in a blender. Drizzle it on top of poached eggs, eggs Benedict, vegetables or several other recipes for a delicious finishing touch.',
            thumbnail: 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2020/01/Hollandaise-Sauce-4.jpg',
            ingredients: [
                '3 egg yolks',
                '1 tablespoon lemon juice , or more as desired for flavor',
                '1 teaspoon Dijon mustard',
                '1/4 teaspoon salt',
                'pinch of cayenne pepper',
                '1/2 cup (115g) unsalted butter or ghee, or more for a thinner consistency, melted and hot'
            ],
            info: {
                servings: '4',
                prepTime: '5 minutes',
                cookTime: '0 minutes',
            },
            instructions: [
                'Melt the butter in a microwave (make sure it\'s covered as it will splatter) for about 1 minute, until it\'s hot. Alternatively, you could heat it on the stove.',
                'Add the egg yolks, lemon juice, dijon, salt and cayenne pepper into a high powered blender and blend for 5 seconds until combined.',
                'With the blender running on medium high, slowly stream in the hot butter into the mixture until it\'s emulsified.',
                'Pour the hollandaise sauce into a small bowl and serve while warm.',
            ],
        },
        {
            name: 'Pesto alla Genovese',
            author: 'biedes @ chefkoch.de',
            url: 'https://www.chefkoch.de/rezepte/326471115025331/Pesto-alla-Genovese.html',
            description: '**Pesto alla Genovese** is a simple and traditional sauce that enriches most italian foods such as spaghetti or pizza.',
            thumbnail: 'https://img.chefkoch-cdn.de/rezepte/326471115025331/bilder/192351/crop-600x400/pesto-alla-genovese.jpg',
            ingredients: [
                '4 cloves of garlic',
                '40g pine nuts',
                'salt and to taste',
                '2 bunches of basil',
                '120ml olive oil',
                '70g parmigiano reggiano',
            ],
            info: {
                servings: '4',
                prepTime: '15 minutes',
                cookTime: '0 minutes',
            },
            instructions: [
                'Peel and roughly chop garlic. Grind the pine nuts and salt in a mortar.',
                'Wash basil leaves and shake dry before removing the leaves. Cut leaves into small strips and add to the paste in the mortar.',
                'Add olive oil and grate cheese into the mix. Slowly stir the rest of the oil while stiring the mixture.',
                'Season with salt and pepper to taste.',
            ],
        },
        {
            name: 'Marinara Sauce',
            author: 'Jackie M. @ allrecipes.com',
            url: 'https://www.allrecipes.com/recipe/11966/best-marinara-sauce-yet/',
            description: 'This flavorful from scratch **Marinara Sauce** recipe is so versatile. Terrific served over pasta, mixed into soups and meatloaf, or used as a dip for bread and more. Made with simple, fresh ingredients and done in minutes!',
            thumbnail: 'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F776872.jpg&w=596&h=399&c=sc&poi=face&q=85',
            ingredients: [
                '2 (14.5 ounce) cans stewed tomatoes',
                '1 (6 ounce) can tomato paste',
                '4 tablespoons chopped fresh parsley',
                '1 clove garlic, minced',
                '1 teaspoon dried oregano',
                '1 teaspoon salt',
                '¼ teaspoon ground black pepper',
                '6 tablespoons olive oil',
                '⅓ cup finely diced onion',
                '½ cup white wine',
            ],
            info: {
                servings: '8',
                prepTime: '15 minutes',
                cookTime: '30 minutes',
            },
            instructions: [
                'In a food processor place Italian tomatoes, tomato paste, chopped parsley, minced garlic, oregano, salt, and pepper. Blend until smooth.',
                'In a large skillet over medium heat saute the finely chopped onion in olive oil for 2 minutes. Add the blended tomato sauce and white wine.',
                'Simmer for 30 minutes, stirring occasionally.',
            ],
        },
        {
            name: 'Teriyaki Sauce',
            author: 'Namiko Chen @ justonecookbook.com',
            url: 'https://www.justonecookbook.com/teriyaki-sauce/',
            description: 'Savory and versatile, **Teriyaki Sauce (照り焼きのたれ)** has been becoming the mainstay seasoning outside of Japan. Many of you have asked me if you could make your own homemade teriyaki sauce without having to get the store-bought stuff. I am happy that you asked because most Japanese home cooks actually make our own sauce at home.',
            thumbnail: 'https://v1.nitrocdn.com/KQYMGOLIdXGmoAcyJsPOrQDKktgCbwtG/assets/static/optimized/rev-7e8ca0b/wp-content/uploads/2020/08/Teriyaki-Sauce-3014-II.jpg',
            ingredients: [
                '2 cup sake (8 Tbsp)',
                '2 cup mirin (8 Tbsp)',
                '2 cup soy sauce (8 Tbsp; Use GF soy sauce for gluten free)',
                '1 cup sugar (60 ml)',
            ],
            info: {
                servings: '4',
                prepTime: '15 minutes',
                cookTime: '15 minutes',
            },
            instructions: [
                'Gather all the ingredients. See Notes for half portion ingredients or substitute info on sake and mirin.',
                'In a saucepan, combine all the ingredients. Add sake and mirin. ',
                'Add soy sauce and sugar.',
                'Bring the mixture to a boil and continuously stir the sauce until sugar is dissolved. Once boiling, lower the heat to medium-low. Cook on simmer for 10-15 minutes or until the sauce is thickened.',
                'When you mix the sauce or tilt the saucepan, small bubbles start to rise/appear.  When this happens, the sauce is ready to use. Pour the sauce to a sterilized jar and keep the jar open until cool. The sauce will thicken as it cools. Store in the refrigerator for up to 2-3 weeks.',
            ],
        },
    ]
}

function _getSauceFromIndex(index) {
    if (index >= data.sauces.length || index < 0) return null
    return data.sauces[index]
}

function _getIndexToSauce(name) {
    for (let i = 0; i < data.sauces.length; i++) {
        if (data.sauces[i].name === name) return i
    }
    return null
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description)
        .addIntegerOption((option) => {
            let opt = option.setName(data.choice.name)
                .setDescription(data.choice.description)
                .setRequired(true)
            for (let i = 0; i < data.sauces.length; i++) {
                opt = opt.addChoice(data.sauces[i].name, i)
            }
            return opt
        }
        ),
    async execute(interaction) {
        // Gathering user input.
        const userChoice = interaction.options.getInteger(data.choice.name, true)
        const sauce = _getSauceFromIndex(userChoice)

        // Creating info embed.
        const listingSymbol = '- '
        const ingredientsString = `${listingSymbol}${sauce.ingredients.join(`\n${listingSymbol}`)}`

        let methodString = ''
        for (const i in sauce.instructions) {
            methodString += `**${+i + 1}.** ${sauce.instructions[i]}\n\n`
        }

        const infoEmbed = new MessageEmbed()
            .setColor(process.env.COLOR_INFORMATION)
            .setTitle(sauce.name)
            .setURL(sauce.url)
            .setAuthor(sauce.author)
            .setDescription(sauce.description)
            .addFields(
                { name: 'Servings', value: `serves ${sauce.info.servings}`, inline: true },
                { name: 'Prep Time', value: `🕒 ${sauce.info.prepTime}`, inline: true },
                { name: 'Cooking Time', value: `🕒 ${sauce.info.cookTime}`, inline: true },
                { name: 'Ingredients', value: ingredientsString },
                { name: 'Method', value: methodString },
            )
            .setThumbnail(sauce.thumbnail)
            .setTimestamp()

        // Creating ingredients embed.


        // Creating instructions embed.


        // Sending all embeds.
        await interaction.reply({ embeds: [infoEmbed] })
    },
}