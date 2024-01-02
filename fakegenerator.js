/*
* Script Name: Fake Generator
* Version: v0.1
* Last Updated: 2024-01-02
* Author: SaveBank
* Author Contact: Discord: savebank
* Approved: N/A
* Approved Date: N/A
* Mod: N/A
*/

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

var scriptConfig = {
    scriptData: {
        name: 'Fake Generator',
        version: 'v0.1',
        author: 'SaveBank',
        authorUrl: '',
        helpLink: '',
    },
    translations: {
        en_DK: {
            'Redirecting...': 'Redirecting...',
            Help: 'Help',
        },
        en_US: {
            'Redirecting...': 'Redirecting...',
            Help: 'Help',
        }
    },
    allowedMarkets: [],
    allowedScreens: ['overview_villages'],
    allowedModes: ['combined'],
    isDebug: DEBUG,
    enableCountApi: false
};

$.getScript(
    `https://twscripts.dev/scripts/twSDK.js?url=https://cdn.jsdelivr.net/gh/savebankdev/fakegenerator@main/fakegenerator.js`,
    async function () {
        // Initialize Library
        await twSDK.init(scriptConfig);
        // const scriptInfo = twSDK.scriptInfo();
        const isValidScreen = twSDK.checkValidLocation('screen');
        const isValidMode = twSDK.checkValidLocation('mode');

        // const { worldConfig } = await fetchWorldConfig();

        // Entry point
        (async function () {
            // Check that we are on the correct screen and mode
            if (!isValidScreen && !isValidMode) {
                // Redirect to correct screen if necessary
                UI.InfoMessage(twSDK.tt('Redirecting...'));
                twSDK.redirectTo(
                    'overview_villages&combined'
                );
            }
        })();
    });