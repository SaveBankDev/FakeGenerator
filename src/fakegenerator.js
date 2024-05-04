/* 
* Script Name: Fake Generator
* Version: v2.3
* Last Updated: 2024-04-29
* Author: SaveBank
* Author Contact: Discord: savebank
* Contributor: RedAlert 
* Approved: Yes
* Approved Date: 06.01.2024
* Mod: RedAlert
*/

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;
if (typeof BIG_SERVER !== 'boolean') BIG_SERVER = false;
if (typeof NIGHT_BONUS_OFFSET !== 'number') NIGHT_BONUS_OFFSET = 15; // 15 minutes before Night bonus to give players time to send the attacks


// Global variable
var STANDARD_DELAY = 200;
var LAST_REQUEST_TIME = 0;
var DEFAULT_ATTACKS_PER_BUTTON = 20;
var DEFAULT_DELAY = 250;
var DEFAULT_MAX_ATTACKS_PER_VILLAGE = 0;
var COORD_REGEX = (BIG_SERVER) ? /\d{1,3}\|\d{1,3}/g : /\d\d\d\|\d\d\d/g; // Different regex depending on player input if the server is too big for the strict regex
var MIN_ATTACKS_PER_BUTTON = 1;
var MIN_DELAY = 200;
var TROOP_POP = {
    spear: 1,
    sword: 1,
    axe: 1,
    archer: 1,
    spy: 2,
    light: 4,
    marcher: 5,
    heavy: 6,
    ram: 5,
    catapult: 8,
    knight: 10,
    snob: 100,
}

var ALL_ATTACKS = [];


var scriptConfig = {
    scriptData: {
        prefix: 'fakegenerator',
        name: 'Fake Generator',
        version: 'v2.3',
        author: 'SaveBank',
        authorUrl: 'https://forum.tribalwars.net/index.php?members/savebank.131111/',
        helpLink: 'https://forum.tribalwars.net/index.php?threads/fakegenerator.291767/',
    },
    translations: {
        en_DK: {
            'Redirecting...': 'Redirecting...',
            Help: 'Help',
            'Fake Generator': 'Fake Generator',
            'Group': 'Group',
            'Attacks per Button': 'Attacks per Button',
            'There was an error!': 'There was an error!',
            'Calculate Fakes': 'Calculate Fakes',
            'Insert target coordinates here': 'Insert target coordinates here',
            'No target coordinates!': 'No target coordinates!',
            'There was an error while fetching the data!': 'There was an error while fetching the data!',
            'Send Spy?': 'Send Spy?',
            'Yes': 'Yes',
            'No': 'No',
            'No Fakes possible!': 'No Fakes possible!',
            'Loading...': 'Loading...',
            'Delay when opening tabs (in ms)': 'Delay when opening tabs (in ms)',
            'Max Attacks per Village (0 ignores this setting)': 'Max Attacks per Village (0 ignores this setting)',
            'dynamically': 'Dynamically',
            'manually': 'Manually',
            'Unit selection': 'Unit selection',
            'Keep Catapults': 'Keep Catapults',
            'Enter units to send (-1 for all troops)': 'Enter units to send (-1 for all troops)',
            'Enter units to keep (-1 for all troops)': 'Enter units to keep (-1 for all troops)',
            'Target Coordinates': 'Target Coordinates',
            'Delete all arrival times': 'Delete all arrival times',
            'Arrival time': 'Arrival time',
            'Reset Input': 'Reset Input',
            'Invalid entry. Please check the selected times.': 'Invalid entry. Please check the selected times.',
            'Invalid entry. Please select valid start and end times.': 'Invalid entry. Please select valid start and end times.',
            'This entry already exists.': 'This entry already exists.',
            'From': 'From',
            'To': 'To',
            'Delete Entry': 'Delete Entry',
            'Open Tabs': 'Open Tabs',
            'Unused Target Coordinates': 'Unused Target Coordinates',
            'Loading...': 'Loading...',
            'Ready!': 'Ready!',
            'Filter': 'Filter',
            'Avoid attacks into night bonus?': 'Avoid attacks into night bonus?',
            'Buffer to night bonus (in minutes)': 'Buffer to night bonus (in minutes)',
            'Total number of possible Attacks': 'Total number of possible Attacks',
            'Calculate!': 'Calculate!',
            'Too many requests! Please wait a moment before trying again.': 'Too many requests! Please wait a moment before trying again.',
            'One or more of the fetched world configuration data is empty.': 'One or more of the fetched world configuration data is empty.',
            'Export WB': 'Export WB',
            'No attacks to export!': 'No attacks to export!',
            'Exported and copied to clipboard': 'Exported and copied to clipboard',
        },
        de_DE: {
            'Redirecting...': 'Weiterleiten...',
            Help: 'Hilfe',
            'Fake Generator': 'Fake Generator',
            'Group': 'Gruppe',
            'Attacks per Button': 'Angriffe pro Button',
            'There was an error!': 'Es gab einen Fehler!',
            'Calculate Fakes': 'Berechne Fakes',
            'Insert target coordinates here': 'Zielkoordinaten hier einfuegen',
            'No target coordinates!': 'Keine Zielkoordinaten!',
            'There was an error while fetching the data!': 'Es gab einen Fehler beim Laden der Daten!',
            'Send Spy?': 'Späher mitschicken?',
            'Yes': 'Ja',
            'No': 'Nein',
            'No Fakes possible!': 'Keine Fakes möglich!',
            'Loading...': 'Lädt...',
            'Delay when opening tabs (in ms)': 'Verzögerung beim Tab öffnen (in ms)',
            'Max Attacks per Village (0 ignores this setting)': 'Max Angriffe aus einem Dorf (0 ignoriert diese Einstellung)',
            'dynamically': 'Dynamisch',
            'manually': 'Manuell',
            'Unit selection': 'Truppenauswahl',
            'Keep Catapults': 'Katapulte zurückhalten',
            'Enter units to send (-1 for all troops)': 'Zu sendende Truppen eingeben (-1 für alle Truppen)',
            'Enter units to keep (-1 for all troops)': 'Zu behaltende Truppen eingeben (-1 für alle Truppen)',
            'Target Coordinates': 'Zielkoordinaten',
            'Delete all arrival times': 'Alle Ankunftszeiten löschen',
            'Arrival time': 'Ankunftszeiten',
            'Reset Input': 'Eingaben zurücksetzen',
            'Invalid entry. Please check the selected times.': 'Ungültiger Eintrag. Bitte überprüfen Sie die Zeiten.',
            'Invalid entry. Please select valid start and end times.': 'Ungültiger Eintrag. Bitte gültige Start- und Endzeiten auswählen.',
            'This entry already exists.': 'Dieser Eintrag existiert bereits.',
            'From': 'Von',
            'To': 'Bis',
            'Delete Entry': 'Eintrag löschen',
            'Open Tabs': 'Tabs öffnen',
            'Unused Target Coordinates': 'Unbenutzte Zielkoordinaten',
            'Loading...': 'Lädt...',
            'Ready!': 'Bereit!',
            'Filter': 'Filter',
            'Avoid attacks into night bonus?': 'Angriffe in den Nachtbonus verhindern?',
            'Buffer to night bonus (in minutes)': 'Puffer zum Nachtbonus (in Minuten)',
            'Total number of possible Attacks': 'Mögliche Angriffsanzahl',
            'Calculate!': 'Berechnen!',
            'Too many requests! Please wait a moment before trying again.': 'Zu viele Anfragen! Bitte warten Sie einen Moment, bevor Sie es erneut versuchen.',
            'One or more of the fetched world configuration data is empty.': 'Eine oder mehrere der abgerufenen Weltkonfigurationsdaten sind leer.',
            'Export WB': 'Export WB',
            'No attacks to export!': 'Keine Angriffe zum Exportieren!',
            'Exported and copied to clipboard': 'Exportiert und in die Zwischenablage kopiert',
        }
    },
    allowedMarkets: [],
    allowedScreens: ['overview_villages'],
    allowedModes: ['combined'],
    isDebug: DEBUG,
    enableCountApi: false
};

$.getScript(`https://twscripts.dev/scripts/twSDK.js?url=${document.currentScript.src}`,
    async function () {
        // Initialize Library
        if (DEBUG) {
            console.debug("INIT");
        }
        await twSDK.init(scriptConfig);
        const scriptInfo = twSDK.scriptInfo();
        const isValidScreen = twSDK.checkValidLocation('screen');
        const isValidMode = twSDK.checkValidLocation('mode');
        // Check that we are on the correct screen and mode
        // I think we need to do it this early to avoid await fetchWorldConfigData() from being interupted by the redirection
        // Some players had the issue that their indexedDb was empty after loading the script and this might fix it
        if (!isValidScreen && !isValidMode) {
            // Redirect to correct screen if necessary
            UI.InfoMessage(twSDK.tt('Redirecting...'));
            twSDK.redirectTo('overview_villages&combined');
            return;
        }
        UI.InfoMessage(twSDK.tt('Loading...'));
        const groups = await fetchVillageGroups();
        const { players, villages, worldUnitInfo, worldConfig } = await fetchWorldConfigData();
        if (players.length < 1 || villages.length < 1 || !worldUnitInfo || !worldConfig) {
            UI.ErrorMessage('One or more of the fetched world data is empty.', 5000);
            return;
        }
        const villageMap = createVillageMap(villages);
        const allPlayers = new Map(players.map(player => [player[0], player.slice(1)]));
        const villageData = villageArrayToDict(villages)

        const ratio = parseInt(worldConfig.config.newbie.ratio);
        const nightBonusActive = (worldConfig.config.night.active === '1') ? true : false;

        if (DEBUG) {
            console.debug(`${scriptInfo} Groups:`, groups);
            console.debug(`${scriptInfo} Players:`, allPlayers);
            console.debug(`${scriptInfo} Villages:`, villageData);
            console.debug(`${scriptInfo} World Unit Info:`, worldUnitInfo);
            console.debug(`${scriptInfo} World Config:`, worldConfig);
            console.debug(`${scriptInfo} Village Map:`, villageMap);
            console.debug(`${scriptInfo} allPlayers:`, allPlayers);
            console.debug(`${scriptInfo} villageData:`, villageData);
            console.debug(`${scriptInfo} ratio:`, ratio);
            console.debug(`${scriptInfo} nightBonusActive:`, nightBonusActive);
        }

        // Entry point
        (async function () {
            try {
                renderUI();
                addEventHandlers();
                count();
                UI.InfoMessage(twSDK.tt('Ready!'));
            } catch (error) {
                UI.ErrorMessage(twSDK.tt('There was an error!'));
                console.error(`${scriptInfo} Error:`, error);
            }
        })();


        function renderUI() {
            const groupsFilter = renderGroupsFilter();
            const unitSelectionType = renderUnitSelectionType();
            const dynamicUnitSelection = renderDynamicUnitSelection();
            const manualUnitSelection = renderManualUnitSelection();
            const arrivalTimeSelector = renderArrivalTimeSelector();

            const ratioHide = (ratio === 0) ? 'style="display: none;"' : '';
            const nightBonusActiveHide = (nightBonusActive) ? '' : 'style="display: none;"';

            const content = `
            <div class="fake-generator-data">
                <div class="ra-mb10">
                    <div class="sb-grid sb-grid-3">
                        <fieldset class="sb-fieldset">
                            <legend>${twSDK.tt('Group')}</legend>
                            ${groupsFilter}
                        </fieldset>
                        <fieldset class="sb-fieldset">
                            <legend>${twSDK.tt('Attacks per Button')}</legend>
                            <input id="AttPerBut" type="number" value="${DEFAULT_ATTACKS_PER_BUTTON}">
                        </fieldset>
                        <fieldset class="sb-fieldset">
                            <legend>${twSDK.tt('Delay when opening tabs (in ms)')}</legend>
                            <input id="DelayTab" type="number" value="${DEFAULT_DELAY}">
                        </fieldset>
                    </div>
                </div>
                <div class="ra-mb10">
                    <div class="sb-grid sb-grid-2">
                        <fieldset class="sb-fieldset">
                            <legend>${twSDK.tt('Unit selection')}</legend>
                            ${unitSelectionType}
                        </fieldset>
                        <fieldset class="sb-fieldset">
                            <legend>${twSDK.tt('Max Attacks per Village (0 ignores this setting)')}</legend>
                            <input id="MaxAttPerVil" type="number" value="${DEFAULT_MAX_ATTACKS_PER_VILLAGE}">
                        </fieldset>
                    </div>
                </div>
                <div class="ra-mb10">
                    ${dynamicUnitSelection}
                </div>
                <div class="ra-mb10">
                    ${manualUnitSelection}
                </div>
                <div class="ra-mb10">
                    <div class="sb-grid sb-grid-4">
                        <fieldset class="sb-fieldset">
                            <legend>${twSDK.tt('Total number of possible Attacks')}:</legend>
                            <button id="calculateTotalPossibleAttacks" class="btn btn-confirm-yes onclick">${twSDK.tt('Calculate!')}</button>
                        </fieldset>
                        <fieldset class="sb-fieldset" ${ratioHide}>
                            <legend>${twSDK.tt('Filter') + " " + ratio + ":1?"}</legend>
                            <input type="checkbox" id="filterRatio" />
                        </fieldset>
                        <fieldset class="sb-fieldset" ${nightBonusActiveHide}>
                            <legend>${twSDK.tt('Avoid attacks into night bonus?')}</legend>
                            <input type="checkbox" id="avoidNightbonus" />
                        </fieldset>
                        <fieldset class="sb-fieldset" style="display: none;" id="bufferNightbonusDisplay">
                            <legend>${twSDK.tt('Buffer to night bonus (in minutes)')}</legend>
                            <input type="number" id="bufferNightbonus" />
                        </fieldset>
                    </div>
                </div>
                <div class="ra-mb10">
                    ${arrivalTimeSelector}
                </div>
                <div class="ra-mb10">
                    <fieldset class="sb-fieldset">
                        <legend id="coordinates">${twSDK.tt('Target Coordinates')}:</legend>
                        <textarea id="CoordInput" style="width: 100%" class="ra-textarea" placeholder="${twSDK.tt('Insert target coordinates here')}"></textarea>
                    </fieldset>
                </div>
                <div class="ra-mb10">
                    <a href="javascript:void(0);" id="calculateFakes" class="btn btn-confirm-yes onclick="">
                        ${twSDK.tt('Calculate Fakes')}
                    </a>
                </div>
            </div>
            <div class="ra-mb10" style="display: none;" id="unusedCoordsDiv">
                <fieldset class="sb-fieldset">
                    <legend id="unusedCoordsLegend">${twSDK.tt('Unused Target Coordinates')}:</legend>
                    <textarea id="unusedCoordsDisplay" style="width: 100%" class="ra-textarea" readonly></textarea>
                </fieldset>
            </div>
            <div>
                <div id="open_tabs" style="display: none;" class="ra-mb10 sb-grid sb-grid-2">
                    <div>
                        <h2 id="h2_tabs"><center style="margin:10px"><u>${twSDK.tt('Open Tabs')}</u></center></h2>
                    </div>
                    <div>
                        <button id="exportPlanFG" class="btn onclick">${twSDK.tt('Export WB')}</button>
                    </div>
                </div>
            </div>`;
            const style = `
                .btn-confirm-clicked { background: #666 !important; }
                .ra-textarea::placeholder {
                    font-size: 15px; 
                    font-style: italic; 
                }
                .sb-grid {
                    display: grid;
                    grid-gap: 10px;
                }
                .sb-grid-5 {
                    grid-template-columns: repeat(5, 1fr);
                }
                .sb-grid-4 {
                    grid-template-columns: repeat(4, 1fr);
                }
                .sb-grid-3 {
                    grid-template-columns: repeat(3, 1fr);
                }
                .sb-grid-2 {
                    grid-template-columns: repeat(2, 1fr);
                }
                .sb-fieldset {
                    border: 1px solid #c1a264;
                    border-radius: 4px;
                    padding: 10px;
                }
                .sb-fieldset legend {
                    font-size: 12px; 
                    font-weight: bold; 
                }
                .sb-fieldset select {
                    padding: 8px;
                    font-size: 14px;
                    border: 1px solid #c1a264;
                    border-radius: 3px;
                    width: 165px;
                }
                .sb-fieldset input[type="number"] {
                    padding: 8px;
                    font-size: 14px;
                    border: 1px solid #c1a264;
                    border-radius: 3px;
                    width: 70px;
                }

                .sb-fieldset input[type="checkbox"] {
                    margin-right: 5px;
                    transform: scale(1.2);
                }

                .ra-table th img {
                    display: block;
                    margin: 0 auto;
                }
                input[type="datetime-local"] {
                    padding: 10px;
                    font-size: 13px; 
                    border: 1px solid #c1a264;
                    border-radius: 3px;
                }
                .sb-grid-item-text {
                    font-size: 16px; 
                    text-align: center; 
                    line-height: 34px; 
                }
                .add-entry-btn {
                    padding: 10px;
                    font-size: 17px;
                    color: white;
                    background: #0bac00;
                    background: linear-gradient(to bottom, #0bac00 0%,#0e7a1e 100%);
                    border: 1px solid;
                    border-color: #006712;
                    border-radius: 3px;
                    cursor: pointer;
                }
                .add-entry-btn, .deleteAllEntries {
                    width: 90%;
                    height: 40px;
                    display: inline-block;
                    text-align: center;
                }                
                .delete-entry-btn:hover {
                    text-decoration: underline; 
                }
                .deleteAllEntries {
                    padding: 8px;
                    font-size: 11.5px;
                    font-weight: bold;
                    background: #af281d;
                    background: linear-gradient(to bottom, #af281d 0%,#801006 100%);
                }
                .deleteAllEntries:hover {
                    background: #c92722;
                    background: linear-gradient(to bottom, #c92722 0%,#a00d08 100%);
                }
                .sb-mb5 {
                    margin-bottom: 5px !important;
                }
                #addTimeEntry:hover {
                    background: #13c600;
                    background: linear-gradient(to bottom, #13c600 0%,#129e23 100%);
                }
                .entries-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .entries-table th {
                    background-color: #f2f2f2;
                    text-align: left;
                    padding: 10px;
                }
                .entries-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                .entry-row:nth-child(even) {
                    background-color: ##f0e2be;
                }
                .entry-row:nth-child(odd) {
                    background-color: #fff5da;
                }
                .entry-start, .entry-end {
                    text-align: center;
                }
                .delete-entry-btn {
                    width: 30%;
                    height: 50%;
                    padding: 10px;
                    border: 1px solid black;
                    border-radius: 3px;
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                    background: #af281d;
                    background: linear-gradient(to bottom, #af281d 0%,#801006 100%);
                    padding: 0;

                }
                .delete-entry-btn:hover {
                    background: #c92722;
                    background: linear-gradient(to bottom, #c92722 0%,#a00d08 100%);
                }
                #calculateTotalPossibleAttacks {
                    width: 100%;
                }
            `;


            twSDK.renderBoxWidget(
                content,
                'FakeGenerator',
                'fake-generator',
                style
            );
        }

        // Add event handlers and data storage and value initialization
        function addEventHandlers() {
            // For the Group select menu
            jQuery('#GroupsFilter').on('change', function (e) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} selected group ID: `, e.target.value);
                }
                // Use the setLocalStorage function to update chosen_group
                let localStorageSettings = getLocalStorage();
                localStorageSettings.chosen_group = e.target.value;
                saveLocalStorage(localStorageSettings);
            });

            // For the calculateTotalPossibleAttacks button
            jQuery('#calculateTotalPossibleAttacks').on('click', async function () {
                if (DEBUG) {
                    console.debug(`${scriptInfo} Calculate Total Possible Attacks`);
                }
                await updateTotalPossibleNumberOfAttacks();
            });

            // Init avoid nightbonus checkbox
            let localStorageSettingsAvoidNightbonus = getLocalStorage();
            jQuery('#avoidNightbonus').prop('checked', localStorageSettingsAvoidNightbonus.avoid_nightbonus);
            // For the avoid nightbonus checkbox
            jQuery('#avoidNightbonus').on('change', function (e) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} Avoid nightbonus: `, e.target.checked);
                }
                // Use setLocalStorage to update avoid_nightbonus value
                let localStorageSettingsAvoidNightbonus = getLocalStorage();
                localStorageSettingsAvoidNightbonus.avoid_nightbonus = e.target.checked;
                saveLocalStorage(localStorageSettingsAvoidNightbonus);
                if (e.target.checked) {
                    jQuery('#bufferNightbonusDisplay').show();
                } else {
                    jQuery('#bufferNightbonusDisplay').hide();
                }
            });

            // Init buffer nightbonus input
            let localStorageSettingsBufferNightbonus = getLocalStorage();
            jQuery('#bufferNightbonus').val(localStorageSettingsBufferNightbonus.buffer_nightbonus);
            if (localStorageSettingsBufferNightbonus.avoid_nightbonus == true && nightBonusActive) {
                jQuery('#bufferNightbonusDisplay').show();
            } else {
                jQuery('#bufferNightbonusDisplay').hide();
            }
            // For the buffer nightbonus input
            jQuery('#bufferNightbonus').on('change', function (e) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} Buffer nightbonus: `, e.target.value);
                }
                // Use setLocalStorage to update buffer_nightbonus value
                let localStorageSettingsBufferNightbonus = getLocalStorage();
                localStorageSettingsBufferNightbonus.buffer_nightbonus = (parseInt(e.target.value) >= 0) ? e.target.value : NIGHT_BONUS_OFFSET;
                e.target.value = localStorageSettingsBufferNightbonus.buffer_nightbonus;
                saveLocalStorage(localStorageSettingsBufferNightbonus);
            });

            // Init filter ratio checkbox
            let localStorageSettingsFilterRatio = getLocalStorage();
            jQuery('#filterRatio').prop('checked', localStorageSettingsFilterRatio.filter_ratio);

            // For the filter ratio checkbox
            jQuery('#filterRatio').on('change', function (e) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} Filter ratio: `, e.target.checked);
                }
                // Use setLocalStorage to update filter_ratio value
                let localStorageSettingsFilterRatio = getLocalStorage();
                localStorageSettingsFilterRatio.filter_ratio = e.target.checked;
                saveLocalStorage(localStorageSettingsFilterRatio);
            });

            // For the Attacks per Button Option
            let localStorageSettingsAPB = getLocalStorage();
            let attacksPerButton = (parseInt(localStorageSettingsAPB.attack_per_button) >= MIN_ATTACKS_PER_BUTTON) ? localStorageSettingsAPB.attack_per_button : MIN_ATTACKS_PER_BUTTON;
            localStorageSettingsAPB.attack_per_button = attacksPerButton;
            saveLocalStorage(localStorageSettingsAPB);
            jQuery('#AttPerBut').val(attacksPerButton);

            jQuery('#AttPerBut').on('change', function (e) {
                if (e.target.value < 1 || isNaN(parseInt(e.target.value)) || parseInt(e.target.value) < MIN_ATTACKS_PER_BUTTON) {
                    jQuery('#AttPerBut').val(MIN_ATTACKS_PER_BUTTON);
                    e.target.value = MIN_ATTACKS_PER_BUTTON;
                }
                if (DEBUG) {
                    console.debug(`${scriptInfo} Attacks per Button: `, e.target.value);
                }
                // Update AttPerBut in localStorage using setLocalStorage
                let localStorageSettingsAttPerButChange = getLocalStorage();
                localStorageSettingsAttPerButChange.attack_per_button = e.target.value;
                saveLocalStorage(localStorageSettingsAttPerButChange);
            });

            // For the delay Option
            let localStorageSettingsDelay = getLocalStorage();
            let delay = localStorageSettingsDelay.delay;
            delay = (parseInt(localStorageSettingsDelay.delay) >= MIN_DELAY) ? localStorageSettingsDelay.delay : MIN_DELAY;
            localStorageSettingsDelay.delay = delay;
            saveLocalStorage(localStorageSettingsDelay);
            jQuery('#DelayTab').val(delay);

            jQuery('#DelayTab').on('change', function (e) {
                const inputValue = parseInt(e.target.value);
                const defaultValue = MIN_DELAY;

                if (DEBUG) {
                    console.debug(`${scriptInfo} Delay: `, inputValue);
                }

                // Use setLocalStorage to update delay value
                let localStorageSettingsDelay = getLocalStorage();
                localStorageSettingsDelay.delay = (inputValue >= defaultValue) ? inputValue : defaultValue;
                saveLocalStorage(localStorageSettingsDelay);

                // Update the value in the input field
                jQuery('#DelayTab').val(localStorageSettingsDelay.delay);
            });

            // For the unit selection type Option
            jQuery('#UnitSelectionType').on('change', function (e) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} Unit Selection Type: `, e.target.value);
                }

                // Use setLocalStorage to update unit_selection_type value
                let localStorageSettingsUnitSelection = getLocalStorage();
                localStorageSettingsUnitSelection.unit_selection_type = e.target.value;
                saveLocalStorage(localStorageSettingsUnitSelection);

                // Toggle visibility of corresponding divs
                if (e.target.value === 'dynamically') {
                    jQuery('#dynamic-unit').show();
                    jQuery('#manual-unit').hide();
                } else {
                    jQuery('#dynamic-unit').hide();
                    jQuery('#manual-unit').show();
                }
            });

            // For the max attacks per village Option
            let localStorageSettingsMaxAttacks = getLocalStorage();
            let maxAttacksPerVillage = localStorageSettingsMaxAttacks.max_attacks_per_village;
            maxAttacksPerVillage = (parseInt(maxAttacksPerVillage) >= 0) ? maxAttacksPerVillage : 0;
            localStorageSettingsMaxAttacks.max_attacks_per_village = maxAttacksPerVillage;
            saveLocalStorage(localStorageSettingsMaxAttacks);
            jQuery('#MaxAttPerVil').val(maxAttacksPerVillage);

            jQuery('#MaxAttPerVil').on('change', function (e) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} Max Attacks per Village: `, e.target.value);
                }

                // Ensure the value is above 0
                const newValue = Math.max(0, parseInt(e.target.value)) || 0;

                // Use setLocalStorage to update max_attacks_per_village value
                let localStorageSettingsMaxAttacks = getLocalStorage();
                localStorageSettingsMaxAttacks.max_attacks_per_village = newValue;
                saveLocalStorage(localStorageSettingsMaxAttacks);

                // Update the input value to the sanitized value
                jQuery('#MaxAttPerVil').val(newValue);
            });


            // For the Send spy select menu
            jQuery('#SendSpy').on('change', function (e) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} Send Spy: `, e.target.value);
                }
                // Use setLocalStorage to update send_spy value
                let localStorageSettingsSendSpy = getLocalStorage();
                localStorageSettingsSendSpy.send_spy = e.target.value;
                saveLocalStorage(localStorageSettingsSendSpy);
            });

            // For the keep catapults
            jQuery('#KeepCatapults').on('change', function (e) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} Keep catapults: `, e.target.value);
                }
                // Use setLocalStorage to update send_spy value
                let localStorageSettingsKeepCatapults = getLocalStorage();
                localStorageSettingsKeepCatapults.keep_catapults = e.target.value;
                saveLocalStorage(localStorageSettingsKeepCatapults);
            });


            // Initialize units_to_send and units_to_keep values from local storage
            const localStorageSettingsUnits = getLocalStorage();

            // Initialize units_to_send
            for (const unit in localStorageSettingsUnits.units_to_send) {
                const inputValue = localStorageSettingsUnits.units_to_send[unit] || 0;
                jQuery(`#send_unit_${unit}`).val(inputValue);
            }

            // Initialize units_to_keep
            for (const unit in localStorageSettingsUnits.units_to_keep) {
                const inputValue = localStorageSettingsUnits.units_to_keep[unit] || 0;
                jQuery(`#keep_unit_${unit}`).val(inputValue);
            }

            // Handle function for unit input changes
            function handleUnitInputChange(e) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} ${e.target.id}: `, e.target.value);
                }
                const id = e.target.id;
                let sendOrKeep = "";
                if (id.startsWith('send')) {
                    sendOrKeep = 'units_to_send';
                } else if (id.startsWith('keep')) {
                    sendOrKeep = 'units_to_keep';
                }
                const idParts = e.target.id.split('_');
                const lastWord = idParts[idParts.length - 1];

                // Ensure the input is at least -1
                const inputValue = parseInt(e.target.value) >= -1 ? parseInt(e.target.value) : 0;

                jQuery(`#${e.target.id}`).val(inputValue);

                // Use setLocalStorage to update unit value
                let localStorageSettingsUnit = getLocalStorage();
                localStorageSettingsUnit[sendOrKeep][lastWord] = inputValue;
                saveLocalStorage(localStorageSettingsUnit);
            }

            // Attach the generic function to all unit number inputs
            jQuery('.ra-unit-selector').on('change', function (e) {
                handleUnitInputChange(e);
            });


            let target_coords = getLocalStorage().target_coordinates;
            if (target_coords && target_coords.length > 0) {
                jQuery('#coordinates').text(`${twSDK.tt('Target Coordinates')}: ${target_coords.length}`);
            }
            jQuery('#CoordInput').val(target_coords.join(' '));
            // For the coord input text area
            jQuery('#CoordInput').on('change', function (e) {
                let startTime = new Date().getTime();
                let amountOfCoords = 0;
                let existingCoordinates = [];
                const coordinates = this.value.match(COORD_REGEX);
                if (coordinates) {
                    amountOfCoords = coordinates.length;
                    existingCoordinates = coordinates.filter(coord => checkIfVillageExists(coord));
                    this.value = existingCoordinates.join(' ');
                    jQuery('#coordinates').text(`${twSDK.tt('Target Coordinates')}: ${existingCoordinates.length}`);
                } else {
                    this.value = '';
                    jQuery('#coordinates').text(`${twSDK.tt('Target Coordinates')}:`);
                }
                let endTime = new Date().getTime();
                if (DEBUG) {
                    console.debug(`${scriptInfo} The script took ${endTime - startTime} milliseconds to filter ${amountOfCoords} coords and check for their existence.\n${scriptInfo} ${existingCoordinates.length} existing coordinates have been found.`);
                }

                // Update target_coordinates in localStorage using setLocalStorage
                let localStorageSettingsCoordInput = getLocalStorage();
                localStorageSettingsCoordInput.target_coordinates = existingCoordinates;
                saveLocalStorage(localStorageSettingsCoordInput);
            });
            jQuery('#deleteAllEntries').on('click', function () {
                // Remove all entries in the table with the id arrivalEntryTable
                jQuery('#arrivalEntryTable .entry-row').remove();

                // Clear saved times in local storage
                const localStorageObject = getLocalStorage();
                localStorageObject.arrival_times = [];
                saveLocalStorage(localStorageObject);

                // Make the table invisible
                jQuery('#arrivalEntryTable').css('display', 'none');
            });
            initializeSavedEntries()
            jQuery('#arrivalEntryTable').on('click', '.delete-entry-btn', function () {
                const idParts = this.id.split('-');
                const startTime = Number(idParts[1]);
                const endTime = Number(idParts[2]);

                const updatedLocalStorage = getLocalStorage();
                updatedLocalStorage.arrival_times = updatedLocalStorage.arrival_times.filter(timeSpan => !(timeSpan[0] === startTime && timeSpan[1] === endTime));
                saveLocalStorage(updatedLocalStorage);

                jQuery(this).parent().parent().remove();

                // Hide the table if there are no entries
                if (updatedLocalStorage.arrival_times.length === 0) {
                    jQuery('#arrivalEntryTable').css('display', 'none');
                }
            });
            jQuery('#addTimeEntry').on('click', async function (e) {
                e.preventDefault();

                // Logic to validate and add new entry into the table with the id arrivalEntryTable
                const startTimeString = jQuery('#startDateTime').val();
                const endTimeString = jQuery('#endDateTime').val();

                if (startTimeString && endTimeString) {
                    const currentTime = Date.now();
                    const startTime = new Date(startTimeString).getTime();
                    const endTime = new Date(endTimeString).getTime();

                    if (!isNaN(startTime) && !isNaN(endTime) && startTime < endTime && currentTime < endTime) {
                        // Check if the combination of timestamps is already saved
                        const localStorageObject = getLocalStorage();
                        const isDuplicate = localStorageObject.arrival_times.some(timeSpan => isEqual(timeSpan, [startTime, endTime]));

                        if (isDuplicate) {
                            UI.ErrorMessage(`${twSDK.tt('This entry already exists.')}`);
                            return;
                        }

                        // Valid entry, proceed to update localStorage
                        localStorageObject.arrival_times.push([startTime, endTime]);
                        saveLocalStorage(localStorageObject);

                        // Create a new row for the new entry
                        const newEntryRow = jQuery('<tr class="entry-row"></tr>');
                        newEntryRow.append(`<td class="entry-start">${formatLocalizedTime(new Date(startTime))}</td>`);
                        newEntryRow.append(`<td class="entry-end">${formatLocalizedTime(new Date(endTime))}</td>`);
                        newEntryRow.append(`<td class="ra-tac"><button class="delete-entry-btn" id="btn-${startTime}-${endTime}">X</button></td>`);
                        jQuery('#arrivalEntryTable').append(newEntryRow);

                        // Make the table visible if it has at least one entry
                        jQuery('#arrivalEntryTable').css('display', 'table');

                        // Event handler for the delete entry button
                        newEntryRow.find('.delete-entry-btn').on('click', function () {
                            newEntryRow.remove();
                            const updatedLocalStorage = getLocalStorage();
                            updatedLocalStorage.arrival_times = updatedLocalStorage.arrival_times.filter(timeSpan => !isEqual(timeSpan, [startTime, endTime]));
                            saveLocalStorage(updatedLocalStorage);

                            // Hide the table if there are no entries
                            if (updatedLocalStorage.arrival_times.length === 0) {
                                jQuery('#arrivalEntryTable').css('display', 'none');
                            }
                        });
                    } else {
                        UI.ErrorMessage(`${twSDK.tt('Invalid entry. Please select valid start and end times.')}`);
                    }
                } else {
                    UI.ErrorMessage(`${twSDK.tt('Invalid entry. Please check the selected times.')}`);
                }
            });
            jQuery('#resetInput').on('click', function () {
                if (DEBUG) console.debug(`${scriptInfo} Reset Input`);
                resetInput();
            });
            jQuery('#exportPlanFG').on('click', function () {
                if (DEBUG) console.debug(`${scriptInfo} Export Plan`);
                exportAttacks();
                UI.InfoMessage(twSDK.tt('Exported and copied to clipboard'));
            });
            // For the Calculate Fakes Button
            jQuery('#calculateFakes').on('click', async function (e) {
                e.preventDefault();

                clearButtons();
                jQuery('#exportPlanFG').on('click', function () {
                    if (DEBUG) console.debug(`${scriptInfo} Export Plan`);
                    exportAttacks();
                    UI.InfoMessage(twSDK.tt('Exported and copied to clipboard'));
                });
                jQuery('#unusedCoordsDiv').hide();

                let playerVillages;
                let targetCoords = [];
                let unchangedTroopData;

                targetCoords = jQuery('#CoordInput').val().trim().match(COORD_REGEX) ?? [];
                if (targetCoords.length === 0) {
                    UI.ErrorMessage(twSDK.tt('No target coordinates!'));
                    return;
                }
                const groupId = getLocalStorage().chosen_group;

                if (DEBUG) {
                    console.debug(`${scriptInfo} Target coordinates: `, targetCoords);
                    console.debug(`${scriptInfo} worldConfig: `, worldConfig);
                    console.debug(`${scriptInfo} worldUnitInfo: `, worldUnitInfo);
                    console.debug(`${scriptInfo} village.txt villages: `, villages);
                    console.debug(`${scriptInfo} Current URL: `, getCurrentURL());
                }

                try {
                    playerVillages = await fetchTroopsForCurrentGroup(parseInt(groupId));
                    if (DEBUG) {
                        console.debug(`${scriptInfo} Player villages: `, playerVillages);
                    }
                } catch (error) {
                    UI.ErrorMessage(twSDK.tt('There was an error!'));
                    console.error(`${scriptInfo} Error:`, error);
                }


                for (let playerVillage of playerVillages) {
                    points = getVillagePointsFromCoord(playerVillage.coord)
                    playerVillage.points = points;
                }
                unchangedTroopData = JSON.parse(JSON.stringify(playerVillages));

                if (DEBUG) {
                    console.debug(`${scriptInfo} Player villages with points: `, playerVillages);
                }
                let spySend;
                const spy = getLocalStorage().send_spy;
                if (spy === "yes") {
                    spySend = true;
                } else {
                    spySend = false;
                }
                calculateAttacks(playerVillages, targetCoords, worldConfig.config.night, parseInt(worldConfig.config.game.fake_limit), worldUnitInfo.config, spySend, unchangedTroopData);
            });
        }

        function calculateAttacks(playerVillages, targetCoords, nightInfo, fakeLimit, configSpeed, spySend, unchangedTroopData) {
            // Time to calculate calculation time
            let startTime = new Date().getTime();
            ALL_ATTACKS = [];
            let { amountOfCombinations, allCombinations } = getAllPossibleCombinations(playerVillages, targetCoords, configSpeed, nightInfo, fakeLimit, spySend);
            if (DEBUG) {
                let endTimeGetAll = new Date().getTime();
                if (DEBUG) console.debug(`${scriptInfo} The script took ${endTimeGetAll - startTime} milliseconds to calculate ${allCombinations} with ${amountOfCombinations} possible combinations.`);
            }

            if (DEBUG) {
                console.debug(`${scriptInfo} All calculated Combinations: `, allCombinations);
                console.debug(`${scriptInfo} Amount of possible Combinations: `, amountOfCombinations);
            }
            if (amountOfCombinations === 0) {
                UI.ErrorMessage(twSDK.tt('No Fakes possible!'));
                return;
            }

            allCombinations.sort((a, b) => a.length - b.length);

            //Initializing map to count the usage of each playerVillage
            let usedPlayerVillages = new Map();
            playerVillages.forEach((village) => {
                usedPlayerVillages.set(village.villageId, 0);
            });

            let calculatedFakePairs = [];
            let counts = getCounts(allCombinations);
            let minCat;
            const localStorageObject = getLocalStorage();
            const unitSelectionType = localStorageObject.unit_selection_type;
            const unitsToSend = localStorageObject.units_to_send;
            const unitsToKeep = localStorageObject.units_to_keep;
            const ratioBool = parseBool(localStorageObject.filter_ratio);
            let startTimeWhile;
            let whileCounter;
            let unusedCoords = [];
            if (DEBUG) {
                startTimeWhile = new Date().getTime();
                whileCounter = 0;
            }
            while (allCombinations.length > 0) {
                if (DEBUG) whileCounter += 1;
                let combination = allCombinations.shift();

                // Filter villages below ratio if ratio is active
                if (ratio > 0 && ratioBool) {
                    if (parseInt(villageData[combination[0]][2]) < (game_data.player.points / ratio)) {
                        continue;
                    }
                }

                // Next loop if the combination only contains the target village
                if (combination.length < 2) {
                    unusedCoords.push(combination[0]);
                    continue;
                }
                // Sort player villages
                combination = sortPlayerVillages(combination, counts, usedPlayerVillages, allCombinations);

                //Choose the most fitting village
                let chosenVillage = null;
                chosenVillage = chooseVillage(combination, fakeLimit, spySend, calculatedFakePairs, usedPlayerVillages)
                if (!chosenVillage) {
                    unusedCoords.push(combination[0]);
                    continue;
                }

                // Remove used units from village
                if (unitSelectionType == "manually") {
                    subtractUnitsFromVillage(chosenVillage, unitsToSend);
                } else if (unitSelectionType == "dynamically") {
                    let unitObjectCatapult = createDefaultUnitsObject();
                    unitObjectCatapult["catapult"] = getMinAmountOfCatapults(chosenVillage.points, fakeLimit);
                    if (spySend) {
                        unitObjectCatapult["spy"] = 1;
                    }
                    subtractUnitsFromVillage(chosenVillage, unitObjectCatapult);
                } else {
                    console.error("Invalid unit selection type", unitSelectionType)
                    return;
                }
                calculatedFakePairs.push([chosenVillage, combination[0]]);

                // Increment the used counter of the village we just used
                usedPlayerVillages.set(chosenVillage.villageId, usedPlayerVillages.get(chosenVillage.villageId) + 1);

                // Update counts for all villages in the chosen combination
                combination.slice(1).forEach((playerVillage) => {
                    let villageId = playerVillage.villageId;

                    if (counts.has(villageId)) {
                        counts.set(villageId, counts.get(villageId) - 1);
                    }
                });

                // Remove used village if not enough remaining troops
                if (unitSelectionType == "manually") {
                    if (!isValidUnitsToSend(chosenVillage, unitsToSend) || Object.values(unitsToSend).some(value => value === -1)) {
                        allCombinations = allCombinations.map(combination => {
                            return combination.filter(element => element !== chosenVillage);
                        });
                        allCombinations.sort((a, b) => a.length - b.length);
                    }
                } else if (unitSelectionType == "dynamically") {
                    minCat = getMinAmountOfCatapults(chosenVillage.points, fakeLimit);
                    if (chosenVillage.catapult < minCat || (spySend && chosenVillage.spy <= 0)) {
                        allCombinations = allCombinations.map(combination => {
                            return combination.filter(element => element !== chosenVillage);
                        });
                        allCombinations.sort((a, b) => a.length - b.length);
                    }
                } else {
                    console.error("Invalid unit selection type", unitSelectionType)
                    return;
                }
            }
            if (DEBUG) {
                let endTimeWhile = new Date().getTime();
                if (DEBUG) console.debug(`${scriptInfo} The script took ${endTimeWhile - startTimeWhile} milliseconds to calculate ${whileCounter} while loops for ${(endTimeWhile - startTimeWhile) / whileCounter} ms per while loops.`);
            }
            if (DEBUG) console.debug(`${scriptInfo} Calculated fake pairs: ${calculatedFakePairs}`);
            if (DEBUG) {
                let villageUsages = [];

                for (let villageId of usedPlayerVillages.keys()) {
                    let usage = usedPlayerVillages.get(villageId);
                    villageUsages.push(usage);
                    // console.debug(`${scriptInfo} How often each village was used: ${villageId} : ${usage}`);
                }

                villageUsages.sort((a, b) => a - b);
                let median;
                let midIndex = Math.floor(villageUsages.length / 2);
                if (villageUsages.length % 2 === 0) {
                    median = (villageUsages[midIndex - 1] + villageUsages[midIndex]) / 2;
                } else {
                    median = villageUsages[midIndex];
                }

                console.debug(`${scriptInfo} Sorted usages ${villageUsages}`);
                console.debug(`${scriptInfo} Median usage of villages: ${median}`);
            }
            let generatedFakeLinks = [];
            let unitObject = createDefaultUnitsObject();
            if (spySend) {
                unitObject["spy"] = 1;
            }
            let attack = {};
            // origin, target, slowest, arrival, type, drawIn=true, sent=false, units
            for (let pair of calculatedFakePairs) {
                const villageData = unchangedTroopData.find(village => village.villageId == pair[0].villageId);
                let link
                if (!villageData) {
                    console.error("Village not found in unchangedTroopData", villageId1, unchangedTroopData);
                    continue;
                }
                if (unitSelectionType == "manually") {
                    link = generateLink(pair[0].villageId, getVillageIdFromCoord(pair[1]), unitsToSend, unchangedTroopData, unitsToKeep);
                    generatedFakeLinks.push(link);
                    attack = {
                        origin: pair[0].villageId,
                        target: getVillageIdFromCoord(pair[1]),
                        slowestUnit: getSlowestUnit(unitsToSend, configSpeed),
                        arrivalTime: calculateArrivalTimeFromVillageIds(pair[0].villageId, getVillageIdFromCoord(pair[1]), getSlowestSpeed(unitsToSend, configSpeed)),
                        type: "14",
                        drawIn: true,
                        sent: false,
                        units: calculateUnitsToSend(unitsToSend, villageData, unitsToKeep),
                        link: link,
                    };
                    ALL_ATTACKS.push(attack);
                } else if (unitSelectionType == "dynamically") {
                    unitObject["catapult"] = getMinAmountOfCatapults(pair[0].points, fakeLimit);
                    link = generateLink(pair[0].villageId, getVillageIdFromCoord(pair[1]), unitObject, unchangedTroopData, unitsToKeep);
                    generatedFakeLinks.push(link);
                    attack = {
                        origin: pair[0].villageId,
                        target: getVillageIdFromCoord(pair[1]),
                        slowestUnit: getSlowestUnit(unitObject, configSpeed),
                        arrivalTime: calculateArrivalTimeFromVillageIds(pair[0].villageId, getVillageIdFromCoord(pair[1]), getSlowestSpeed(unitObject, configSpeed)),
                        type: "14",
                        drawIn: true,
                        sent: false,
                        units: calculateUnitsToSend(unitObject, villageData, unitsToKeep),
                        link: link,
                    };
                    ALL_ATTACKS.push(attack);
                } else {
                    console.error("Invalid unit selection type", unitSelectionType)
                    return;
                }
            }
            shuffleArray(generatedFakeLinks);
            if (DEBUG) console.debug(`${scriptInfo} One of the generated Links: ${generatedFakeLinks[0]}`);
            if (DEBUG) console.debug(`${scriptInfo} Unused coords: ${unusedCoords}`);
            // Get end timestamp
            let endTime = new Date().getTime();
            if (DEBUG) console.debug(`${scriptInfo} The script took ${endTime - startTime} milliseconds to calculate ${calculatedFakePairs.length} fake pairs from ${amountOfCombinations} possible combinations.`);
            if (unusedCoords.length > 0) {
                jQuery('#unusedCoordsDiv').show();
                jQuery('#unusedCoordsDisplay').val(unusedCoords.join(' '));
                jQuery('#unusedCoordsLegend').text(`${twSDK.tt('Unused Target Coordinates')}: ${unusedCoords.length}`);
            }
            createSendButtons(generatedFakeLinks);
            if (DEBUG) console.debug(`${scriptInfo} Finished`);

            return;
        }


        // All possible combinations of player village and target  coords with consideration of arrival time outside the night bonus and minimum catapult am
        function getAllPossibleCombinations(playerVillages, targetCoords, configSpeed, nightInfo, fakeLimit, spySend) {
            let allCombinations = [];
            let currentTime = Date.now();
            let minCat = 1;
            let amountOfCombinations = 0;
            let distance;
            let travelTime;
            let unitSpeed;
            let timestamp;
            let timeBool;
            let nightBool;

            const localStorageObject = getLocalStorage();
            const unitSelectionType = localStorageObject.unit_selection_type;
            const unitsToKeep = localStorageObject.units_to_keep;
            const unitsToSend = localStorageObject.units_to_send;
            const keepCatapults = localStorageObject.keep_catapults;
            const arrivalTimes = localStorageObject.arrival_times;
            const nightBonusOffset = parseInt(localStorageObject.buffer_nightbonus);
            const avoidNightBonus = parseBool(localStorageObject.avoid_nightbonus);
            let playerVillagesWithEnoughUnits = [];
            if (unitSelectionType === "manually") {
                // Subtract units_to_keep from player villages 
                unitSpeed = getSlowestSpeed(unitsToSend, configSpeed)
                for (let playerVillage of playerVillages) {
                    subtractUnitsFromVillage(playerVillage, unitsToKeep);
                    if (isValidUnitsToSend(playerVillage, unitsToSend)) {
                        playerVillagesWithEnoughUnits.push(playerVillage);
                    }
                }
                for (let targetCoord of targetCoords) {
                    let subArray = [targetCoord];
                    for (let playerVillage of playerVillagesWithEnoughUnits) {
                        distance = twSDK.calculateDistance(playerVillage.coord, targetCoord);
                        travelTime = twSDK.getTravelTimeInSecond(distance, unitSpeed) * 1000;
                        timestamp = currentTime + travelTime;
                        timeBool = false;
                        if (arrivalTimes.length === 0) {
                            timeBool = true;
                        }
                        for (const [start, end] of arrivalTimes) {
                            if (timestamp >= start && timestamp <= end) {
                                timeBool = true;
                                break;
                            }
                        }
                        if (!timeBool) continue;
                        // We want to arrive shortly before the night bonus to give the player time to send the attacks
                        if (avoidNightBonus && nightBonusActive) {
                            const time = new Date(currentTime + travelTime);
                            const currentTotalTime = (time.getHours() + time.getMinutes() / 60);

                            const checkStartNb = ((parseInt(nightInfo.start_hour) + 24) - (nightBonusOffset / 60)) % 24;  // Wrap around when subtracting offsett
                            const checkEndNb = parseInt(nightInfo.end_hour);

                            // Check if current time is less than the start of the night bonus or current time is greater than the end of the night bonus.
                            if (parseInt(nightInfo.start_hour) === parseInt(nightInfo.end_hour)) {
                                nightBool = false; // edge case where start and end time are the same
                            } else {
                                nightBool = (currentTotalTime >= checkEndNb && currentTotalTime < checkStartNb);
                            }
                            if (!nightBool) continue;
                        }
                        subArray.push(playerVillage);
                        amountOfCombinations += 1;
                    }
                    allCombinations.push(subArray);
                }


            } else if (unitSelectionType === "dynamically") {
                // Subtract units_to_keep from player villages 
                let unitObjectCatapult = createDefaultUnitsObject();
                unitObjectCatapult["catapult"] = keepCatapults;
                unitSpeed = configSpeed.catapult.speed;
                for (let playerVillage of playerVillages) {
                    subtractUnitsFromVillage(playerVillage, unitObjectCatapult);
                    minCat = getMinAmountOfCatapults(playerVillage.points, fakeLimit);
                    if (playerVillage.catapult < minCat) {
                        continue;
                    }
                    if (spySend && playerVillage.spy <= 0) {
                        continue;
                    }
                    playerVillagesWithEnoughUnits.push(playerVillage);
                }
                for (let targetCoord of targetCoords) {
                    let subArray = [targetCoord];
                    for (let playerVillage of playerVillages) {
                        distance = twSDK.calculateDistance(playerVillage.coord, targetCoord);
                        travelTime = twSDK.getTravelTimeInSecond(distance, unitSpeed) * 1000;
                        timestamp = currentTime + travelTime;
                        timeBool = false;
                        if (arrivalTimes.length === 0) {
                            timeBool = true;
                        }
                        for (const [start, end] of arrivalTimes) {
                            if (timestamp >= start && timestamp <= end) {
                                timeBool = true;
                                break;
                            }
                        }
                        if (!timeBool) continue;
                        if (avoidNightBonus) {
                            const time = new Date(currentTime + travelTime);
                            const currentTotalTime = (time.getHours() + time.getMinutes() / 60);

                            const checkStartNb = ((parseInt(nightInfo.start_hour) + 24) - (nightBonusOffset / 60)) % 24;  // Wrap around when subtracting offsett
                            const checkEndNb = parseInt(nightInfo.end_hour);

                            if (parseInt(nightInfo.start_hour) === parseInt(nightInfo.end_hour)) {
                                nightBool = false; // edge case where start and end time are the same
                            } else {
                                nightBool = (currentTotalTime >= checkEndNb && currentTotalTime < checkStartNb);
                            }
                            if (!nightBool) continue;
                        }
                        subArray.push(playerVillage);
                        amountOfCombinations += 1;
                    }
                    allCombinations.push(subArray);
                }

            } else {
                console.error("Invalid unit selection type", unitSelectionType)
            }
            return { amountOfCombinations, allCombinations };
        }

        function sortPlayerVillages(combination, counts, usedPlayerVillages, allCombinations) {
            const threshold = 0.10; // 10% threshold
            const localStorageObject = getLocalStorage();
            const maxAttacksFromVillage = localStorageObject.max_attacks_per_village;
            if (parseInt(maxAttacksFromVillage) == 0) {
                return [combination[0]].concat(combination.slice(1).sort((a, b) => {
                    let villageIdA = a.villageId;
                    let villageIdB = b.villageId;

                    let countA = counts.get(villageIdA);
                    let countB = counts.get(villageIdB);

                    let usedCountA = usedPlayerVillages.get(villageIdA);
                    let usedCountB = usedPlayerVillages.get(villageIdB);

                    let remainingTargets = allCombinations.length;

                    // Compare usedPlayerVillage values if:
                    // - Both counts are greater than the number of remaining targets
                    // - The absolute difference between usedCounts is greater than 2
                    // - And both counts are greater than 2
                    if (((countA > remainingTargets * threshold && countB > remainingTargets * threshold) || Math.abs(usedCountA - usedCountB) > 1) && countA > 2 && countB > 2 && usedCountA != usedCountB) {
                        return usedCountA - usedCountB; // Lower usedPlayerVillage is better.
                    } else {
                        // If not, then compare count values.
                        return countA - countB; // Lower count is better.
                    }
                }));
            } else if (parseInt(maxAttacksFromVillage) > 0) {
                return [combination[0]].concat(combination.slice(1).sort((a, b) => {
                    let villageIdA = a.villageId;
                    let villageIdB = b.villageId;

                    let countA = counts.get(villageIdA);
                    let countB = counts.get(villageIdB);

                    let usedCountA = usedPlayerVillages.get(villageIdA);
                    let usedCountB = usedPlayerVillages.get(villageIdB);

                    if (countA == countB) {
                        return usedCountA - usedCountB;
                    } else {
                        return countA - countB;
                    }
                }));
            } else {
                console.error("Invalid max_attacks_per_village", maxAttacksFromVillage)
                return combination;
            }
        }

        function chooseVillage(combination, fakeLimit, spySend, calculatedFakePairs, usedPlayerVillages) {
            const localStorageObject = getLocalStorage();
            const unitSelectionType = localStorageObject.unit_selection_type;
            const unitsToSend = localStorageObject.units_to_send;
            const maxAttacksFromVillage = localStorageObject.max_attacks_per_village;

            let chosenVillage = null;
            if (unitSelectionType == "manually") {
                for (let j = 1; j < combination.length; j++) {
                    let village = combination[j];
                    if (usedPlayerVillages.get(village.villageId) >= maxAttacksFromVillage && maxAttacksFromVillage > 0) {
                        continue;
                    }
                    if (!isValidUnitsToSend(village, unitsToSend)) {
                        continue;
                    }
                    if (calculatedFakePairs.some(pair => pair[0] === village && pair[1] === combination[0])) {
                        continue;
                    }
                    chosenVillage = village;
                    break;
                }
            } else if (unitSelectionType == "dynamically") {
                for (let j = 1; j < combination.length; j++) {
                    let village = combination[j];
                    if (usedPlayerVillages.get(village.villageId) >= maxAttacksFromVillage && maxAttacksFromVillage > 0) {
                        continue;
                    }
                    const minCat = getMinAmountOfCatapults(village.points, fakeLimit);
                    if (!(village.catapult >= minCat)) {
                        continue;
                    }
                    if (calculatedFakePairs.some(pair => pair[0] === village && pair[1] === combination[0])) {
                        continue;
                    }
                    if (spySend && village.spy <= 0) {
                        continue;
                    }
                    chosenVillage = village;
                    break;
                }
            } else {
                console.error("Invalid unit selection type", unitSelectionType)
            }

            return chosenVillage;
        }

        async function updateTotalPossibleNumberOfAttacks() {
            if (Date.now() - LAST_REQUEST_TIME < STANDARD_DELAY) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} Too many requests!`);
                }
                UI.ErrorMessage(twSDK.tt('Too many requests! Please wait a moment before trying again.'));
                return;
            }
            LAST_REQUEST_TIME = Date.now();
            let playerVillages;
            const groupId = getLocalStorage().chosen_group;

            try {
                playerVillages = await fetchTroopsForCurrentGroup(parseInt(groupId));
                if (DEBUG) {
                    console.debug(`${scriptInfo} Player villages: `, playerVillages);
                }
            } catch (error) {
                UI.ErrorMessage(twSDK.tt('There was an error!'));
                console.error(`${scriptInfo} Error:`, error);
                return;
            }
            let localStorageObject = getLocalStorage();
            let totalPossibleAttacks = 0;
            let spySend = localStorageObject.send_spy;
            let units_to_send = localStorageObject.units_to_send;
            let units_to_keep = localStorageObject.units_to_keep;
            let keep_catapults = localStorageObject.keep_catapults;
            let unitSelectionType = localStorageObject.unit_selection_type;
            let max_attacks_per_village = parseInt(localStorageObject.max_attacks_per_village);

            let keepCatapultsObject = createDefaultUnitsObject();
            keepCatapultsObject["catapult"] = keep_catapults;

            let unitsToSend = createDefaultUnitsObject();
            if (unitSelectionType === "dynamically") {
                if (spySend === "yes") {
                    unitsToSend["spy"] = 1;
                }
            } else if (unitSelectionType === "manually") {
                unitsToSend = units_to_send;
            } else {
                console.error("Invalid unit selection type", unitSelectionType)
            }

            for (let playerVillage of playerVillages) {
                let numberOfAttacksOfThisVillage = 0;
                if (unitSelectionType === "dynamically") {
                    unitsToSend["catapult"] = getMinAmountOfCatapults(playerVillage.points, parseInt(worldConfig.config.game.fake_limit));
                    subtractUnitsFromVillage(playerVillage, keepCatapultsObject);
                } else if (unitSelectionType === "manually") {
                    subtractUnitsFromVillage(playerVillage, units_to_keep);
                } else {
                    console.error("Invalid unit selection type", unitSelectionType)
                }
                while (isValidUnitsToSend(playerVillage, unitsToSend)) {
                    totalPossibleAttacks += 1;
                    numberOfAttacksOfThisVillage += 1;
                    if (max_attacks_per_village > 0 && numberOfAttacksOfThisVillage >= max_attacks_per_village) {
                        break;
                    }
                    subtractUnitsFromVillage(playerVillage, unitsToSend);
                }
            }
            jQuery('#calculateTotalPossibleAttacks').text(`${totalPossibleAttacks}`);
        }

        // Helper: Parses boolean
        function parseBool(input) {
            if (typeof input === 'string') {
                return input.toLowerCase() === 'true';
            } else if (typeof input === 'boolean') {
                return input;
            } else {
                console.error(`${scriptInfo}: Invalid input: needs to be a string or boolean.`);
                return false;
            }
        }

        // Helper: Checks if the village has enough units
        function isValidUnitsToSend(playerVillage, unitsToSend) {
            let atLeastOneUnitToSend = false;
            for (const unitType in unitsToSend) {
                const requiredUnits = unitsToSend[unitType];
                const availableUnits = playerVillage[unitType];
                if ((requiredUnits === -1 && availableUnits > 0) || (requiredUnits > 0 && availableUnits >= requiredUnits)) {
                    atLeastOneUnitToSend = true;
                }
                if (requiredUnits !== -1 && availableUnits < requiredUnits) {
                    return false;
                }
            }
            return atLeastOneUnitToSend;
        }
        function count() {
            const apiUrl = 'https://api.counterapi.dev/v1';
            const playerId = game_data.player.id;
            const encodedPlayerId = btoa(game_data.player.id);
            const apiKey = 'sbFakeGenerator'; // api key
            const namespace = 'savebankscriptstw'; // namespace
            try {
                $.getJSON(`${apiUrl}/${namespace}/${apiKey}/up`, response => {
                    if (DEBUG) console.debug(`Total script runs: ${response.count}`);
                }).fail(() => { if (DEBUG) console.debug("Failed to fetch total script runs"); });
            } catch (error) { if (DEBUG) console.debug("Error fetching total script runs: ", error); }

            try {
                $.getJSON(`${apiUrl}/${namespace}/${apiKey}_id${encodedPlayerId}/up`, response => {
                    if (response.count === 1) {
                        $.getJSON(`${apiUrl}/${namespace}/${apiKey}_users/up`).fail(() => {
                            if (DEBUG) console.debug("Failed to increment user count");
                        });
                    }
                    if (DEBUG) console.debug(`Player ${playerId} script runs: ${response.count}`);
                }).fail(() => { if (DEBUG) console.debug("Failed to fetch player script runs"); });
            } catch (error) { if (DEBUG) console.debug("Error fetching player script runs: ", error); }

            try {
                $.getJSON(`${apiUrl}/${namespace}/${apiKey}_users`, response => {
                    if (DEBUG) console.debug(`Total users: ${response.count}`);
                }).fail(() => { if (DEBUG) console.debug("Failed to fetch total users"); });
            } catch (error) { if (DEBUG) console.debug("Error fetching total users: ", error); }
        }
        // Helper: Subtracts units of a unitsToSubtract object from the given village
        function subtractUnitsFromVillage(playerVillage, unitsToSubtract) {
            for (const unitType in unitsToSubtract) {
                if (unitsToSubtract[unitType] == 0) {
                    continue;
                }
                if (playerVillage.hasOwnProperty(unitType)) {
                    if (unitsToSubtract[unitType] === -1) {
                        // All of the units are sent
                        playerVillage[unitType] = 0;
                    } else {
                        playerVillage[unitType] -= unitsToSubtract[unitType];
                    }
                } else {
                    console.error("Saved unit type not found! This should never happen!", unitType);
                }
            }
        }
        //Helper: Creates a default units object
        function createDefaultUnitsObject() {
            const defaultUnitsObject = {};
            const gameDataUnits = game_data.units;

            for (const unitType of gameDataUnits) {
                defaultUnitsObject[unitType] = 0;
            }

            return defaultUnitsObject;
        }

        function calculateArrivalTimeFromVillageIds(villageId1, villageId2, unitSpeed) {
            const currentTime = parseInt(Date.now());
            const villageCoord1 = villageMap.get(villageId1);
            const villageCoord2 = villageMap.get(villageId2);
            const distance = twSDK.calculateDistance(villageCoord1, villageCoord2);
            const travelTime = parseInt(twSDK.getTravelTimeInSecond(distance, unitSpeed)) * 1000;
            const arrivalTime = parseInt(currentTime) + parseInt(travelTime);
            return arrivalTime;
        }

        // origin, target, slowestUnit, arrivalTime, type, drawIn=true, sent=false, units
        function exportAttacks() {
            if (ALL_ATTACKS.length === 0) {
                UI.ErrorMessage(twSDK.tt('No attacks to export!'));
                return;
            }
            let exportWB = "";
            for (let attack of ALL_ATTACKS) {
                let {
                    origin,
                    target,
                    slowestUnit,
                    arrivalTime,
                    type,
                    drawIn,
                    sent,
                    units
                } = attack;

                let arrTimestamp = (new Date(arrivalTime).getTime()) + parseInt(type);
                exportWB += origin + "&" + target + "&" + slowestUnit +
                    "&" + arrTimestamp + "&" + type + "&" + drawIn + "&" + sent + "&";

                let unitsArray = [];
                for (let unit in units) {
                    unitsArray.push(unit + "=" + btoa(units[unit]));
                }
                exportWB += unitsArray.join('/') + "\n";
            }
            if (DEBUG) console.debug(`${scriptInfo}: Created export string: ${exportWB}`);
            twSDK.copyToClipboard(exportWB);
        }

        // Helper: Function to calculate units to send
        function calculateUnitsToSend(unitObject, villageData, unitsToKeep) {
            let unitAmount;
            let unitsToSend = {};

            for (const unitType in unitObject) {
                if (unitObject[unitType] > 0) {
                    // If the value is greater than 0, add to the unitsToSend object
                    unitsToSend[unitType] = unitObject[unitType];
                } else if (unitObject[unitType] === -1 && villageData[unitType] >= 0) {
                    // If the value is -1, use the value from unchangedTroopData if available
                    if (unitsToKeep[unitType] >= 0) {
                        unitAmount = (villageData[unitType] - unitsToKeep[unitType]) > 0 ? (villageData[unitType] - unitsToKeep[unitType]) : 0; // hope this works
                    } else {
                        unitAmount = 0;
                        console.error("Too many -1, idk whats going on")
                    }
                    unitsToSend[unitType] = unitAmount;
                }
            }

            return unitsToSend;
        }

        // Helper: Function to generate a link from villageIds
        function generateLink(villageId1, villageId2, unitObject, villageData, unitsToKeep) {
            let completeLink = getCurrentURL();
            if (twSDK.sitterId.length > 0) {
                completeLink += `?${twSDK.sitterId}&village=${villageId1}&screen=place&target=${villageId2}`;
            } else {
                completeLink += `?village=${villageId1}&screen=place&target=${villageId2}`;
            }



            const unitsToSend = calculateUnitsToSend(unitObject, villageData, unitsToKeep);

            for (const unitType in unitsToSend) {
                completeLink += `&${unitType}=${unitsToSend[unitType]}`;
            }

            return completeLink;
        }

        // Helper: Returns the slowest unit speed of the units to send
        function getSlowestSpeed(unitsToSend, unitInfo) {
            const unitSpeeds = [];
            for (const unitType in unitsToSend) {
                if (unitsToSend[unitType] === -1 || unitsToSend[unitType] > 0) {
                    if (DEBUG) console.debug(`${scriptInfo} Unit type: ${unitType}  Speed ${unitInfo[unitType]?.speed}`);
                    const speed = parseInt(unitInfo[unitType]?.speed) || 0;
                    unitSpeeds.push(speed);
                }
            }
            return Math.max(...unitSpeeds, 0); // Return the highest speed, or 0 if the array is empty
        }
        function getSlowestUnit(unitsToSend, unitInfo) {
            let slowestUnit = "";
            let slowestSpeed = 0;
            for (const unitType in unitsToSend) {
                if (unitsToSend[unitType] === -1 || unitsToSend[unitType] > 0) {
                    if (DEBUG) console.debug(`${scriptInfo} Unit type: ${unitType}  Speed ${unitInfo[unitType]?.speed}`);
                    const speed = parseInt(unitInfo[unitType]?.speed) || 0;
                    if (speed > slowestSpeed) {
                        slowestSpeed = speed;
                        slowestUnit = unitType;
                    }
                }
            }
            return slowestUnit;
        }

        // Helper: Villages array to dictionary, to quickly search with coordinates
        function villageArrayToDict(villageArray) {
            let dict = {};
            let playerPoints;
            for (let i = 0; i < villageArray.length; i++) {
                let key = villageArray[i][2] + '|' + villageArray[i][3]; //assuming x is at arr[i][2] and y is at arr[i][3]
                let playerId = villageArray[i][4]; //assuming player id is at arr[i][4]
                if (parseInt(playerId) === 0) {
                    playerPoints = 9999999999; // barbs get alot of points to always avoid ratio filter
                } else {
                    playerPoints = allPlayers.get(playerId)[3]; //assuming player points is at index 3 in the player array
                }
                dict[key] = [villageArray[i][0], villageArray[i][5], playerPoints]; //assuming id is at arr[i][0] and points is at arr[i][5]
            }
            return dict;
        }

        // Helper: Creates village map that maps villageid to village coords
        function createVillageMap(villageArray) {
            let villageMap = new Map();
            for (let i = 0; i < villageArray.length; i++) {
                let villageId = villageArray[i][0];
                let villageCoord = villageArray[i][2] + '|' + villageArray[i][3];
                villageMap.set(parseInt(villageId), villageCoord);
            }
            return villageMap;
        }

        // Helper:  Get Village ID from a coordinate
        function getVillageIdFromCoord(coord) {
            try {
                let village = villageData[coord];
                return village[0];
            } catch (error) {
                console.warn(`No village found for coordinate ${coord}`);
            }
        }

        // Helper: Get village points from village.txt with coordinates
        function getVillagePointsFromCoord(coord) {
            try {
                let village = villageData[coord];
                return village[1];
            } catch (error) {
                console.warn(`No village found for coordinate ${coord}`);
            }
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Helper: Create a function to count the frequency of each value in the remaining value arrays
        function getCounts(array) {
            let counts = new Map();

            array.forEach((subArray) => {
                subArray.slice(1).forEach((object) => {
                    let villageId = object.villageId;  // Renamed variable

                    if (!counts.has(villageId)) {
                        counts.set(villageId, 1);
                    } else {
                        let updatedCount = counts.get(villageId);
                        counts.set(villageId, updatedCount + 1);
                    }
                });
            });

            return counts;
        }

        // Helper: Check if coord exists as village
        function checkIfVillageExists(coord) {
            return coord in villageData;
        }

        //  Helper: Get current URL
        function getCurrentURL() {
            return window.location.protocol + "//" + window.location.host + window.location.pathname;;
        }

        // Helper: Get minimum amount of catapults to send depending on if fakeLimit is active
        function getMinAmountOfCatapults(playerVillagePoints, fakeLimit) {
            let reqCatapults = 1;
            if (fakeLimit === 0) {
                return reqCatapults;
            } else {
                // Get the required amount of pop and calculate the next higher amount of catapults to meet the demand
                reqCatapults = Math.floor(((playerVillagePoints * (fakeLimit / 100)) + (TROOP_POP.catapult - 1)) / TROOP_POP.catapult);
                // If the required catapult amount is 0 we still need at least 1 to send a fake
                return (reqCatapults > 0) ? reqCatapults : 1;
            }
        }

        function clearButtons() {
            // Fetch the 'open_tabs' div where buttons will be appended
            let openTabsDiv = document.getElementById("open_tabs");

            // Reset the buttons
            openTabsDiv.innerHTML = `                    <div>
            <h2 id="h2_tabs"><center style="margin:10px"><u>${twSDK.tt('Open Tabs')}</u></center></h2>
        </div>
        <div id="exportWBFG">
            <button id="exportPlanFG" class="btn ra-mb10">${twSDK.tt('Export WB')}</button>
        </div>`;
            // Make the 'open_tabs' div invisible
            openTabsDiv.style.display = "none";

        }

        function createSendButtons(URIs) {
            // Get the number of attacks per button
            let nrSplit = parseInt(getLocalStorage().attack_per_button);
            let delay = parseInt(getLocalStorage().delay);

            if (DEBUG) console.debug(`${scriptInfo} Number of attacks per button: ${nrSplit}`);

            // Fetch the 'open_tabs' div where buttons will be appended
            let openTabsDiv = document.getElementById("open_tabs");

            // Reset the buttons
            clearButtons();
            jQuery('#exportPlanFG').on('click', function () {
                if (DEBUG) console.debug(`${scriptInfo} Export Plan`);
                exportAttacks();
                UI.InfoMessage(twSDK.tt('Exported and copied to clipboard'));
            });

            // Calculate the number of required buttons
            let nrButtons = Math.ceil(URIs.length / nrSplit);
            if (DEBUG) console.debug(`${scriptInfo} Required number of buttons: ${nrButtons}`);


            // Create and append buttons
            for (let i = 0; i < nrButtons; i++) {
                let button = document.createElement('button');
                // Add CSS classes to the button
                button.classList.add('btn', 'btn-confirm-yes', 'sb-mb5');

                let start = i * nrSplit + 1; // calculate starting index for display
                let end = Math.min(URIs.length, start + nrSplit - 1); // calculate ending index, don't exceed total URIs

                // Label for the button
                button.textContent = `[ ${start}-${end} ]`;

                // Add a click event listener to each button
                button.addEventListener('click', function () {
                    // Set button to grey after it's clicked
                    this.classList.remove('btn-confirm-yes');
                    this.classList.add('btn-confirm-clicked');
                    // Open each link in new tab
                    URIs.slice(start - 1, end).forEach((link, index) => {  // adjust start for zero-based index
                        setTimeout(() => {
                            window.open(link);
                            // Find the corresponding attack and set its 'sent' property to true
                            let attack = ALL_ATTACKS.find(attack => attack.link === link);
                            if (attack) {
                                attack.sent = true;
                            }
                        }, index * delay);
                    })
                });
                // Add an additional event listener to prevent the "Enter" key from triggering the button
                button.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        // Prevent the default behavior for the "Enter" key
                        event.preventDefault();
                    }
                });

                // Append button to 'open_tabs' div
                openTabsDiv.appendChild(button);
            }
            // Make the 'open_tabs' div visible
            openTabsDiv.style.display = "block";
        }

        // Helper: Render groups select
        function renderGroupsFilter() {
            const groupId = getLocalStorage().chosen_group;
            let groupsFilter = `
		<select name="group-filter" id="GroupsFilter">
	`;

            for (const [_, group] of Object.entries(groups.result)) {
                const { group_id, name } = group;
                const isSelected = parseInt(group_id) === parseInt(groupId) ? 'selected' : '';
                if (name !== undefined) {
                    groupsFilter += `
				<option value="${group_id}" ${isSelected}>
					${name}
				</option>
			`;
                }
            }

            groupsFilter += `
		</select>
	`;

            return groupsFilter;
        }

        // Helper: Render send spy select
        function renderSpySelect() {
            const sendSpy = getLocalStorage().send_spy;
            let contentSpySelect = `
            <select id="SendSpy">
            `;

            if (sendSpy === "yes") {
                contentSpySelect += `
                <option value="yes" selected>${twSDK.tt("Yes")}</option>
                <option value="no">${twSDK.tt("No")}</option>
                `
            } else {
                contentSpySelect += `
                <option value="yes">${twSDK.tt("Yes")}</option>
                <option value="no" selected>${twSDK.tt("No")}</option>
                `
            }

            contentSpySelect += `</select>`;
            return contentSpySelect;
        }

        // Helper function to check array equality
        function isEqual(arr1, arr2) {
            return arr1[0] === arr2[0] && arr1[1] === arr2[1];
        }

        // Helper: Render unit selection type
        function renderUnitSelectionType() {
            const unitSelectionType = getLocalStorage().unit_selection_type;
            let contentUnitSelectionType = `
            <select id="UnitSelectionType">
            `;

            if (unitSelectionType === "dynamically") {
                contentUnitSelectionType += `
                <option value="dynamically" selected>${twSDK.tt("dynamically")}</option>
                <option value="manually">${twSDK.tt("manually")}</option>
                `;
            } else {
                contentUnitSelectionType += `
                <option value="dynamically">${twSDK.tt("dynamically")}</option>
                <option value="manually" selected>${twSDK.tt("manually")}</option>
                `;
            }

            contentUnitSelectionType += `</select>`;
            return contentUnitSelectionType;
        }

        //Helper: Render dynamic unit selection
        function renderDynamicUnitSelection() {
            const spySelect = renderSpySelect();
            const unitSelectionType = getLocalStorage().unit_selection_type;
            const keepCatapults = getLocalStorage().keep_catapults;
            let visibility;
            if (unitSelectionType === "dynamically") {
                visibility = `style="display: block;"`
            } else {
                visibility = `style="display: none;"`
            }
            let contentDynamicUnitSelection = `
            <div class="ra-mb10" id="dynamic-unit" ${visibility}>
                <div class="sb-grid sb-grid-2">
                    <fieldset class="sb-fieldset">
                        <legend>${twSDK.tt('Send Spy?')}</legend>
                        ${spySelect}
                    </fieldset>
                    <fieldset class="sb-fieldset">
                        <legend>${twSDK.tt('Keep Catapults')}</legend>
                        <input id="KeepCatapults" type="number" value="${keepCatapults}">
                    </fieldset>
                </div>
            </div>
            `;

            return contentDynamicUnitSelection;
        }

        //Helper: Render manual unit selection
        function renderManualUnitSelection() {
            const unitSelectionType = getLocalStorage().unit_selection_type;
            let visibility;
            if (unitSelectionType === "dynamically") {
                visibility = `style="display: none;"`
            } else {
                visibility = `style="display: block;"`
            }
            const units = game_data.units;
            let contentManualUnitSelection = "";
            const unitsToIgnore = ['militia', 'snob'];
            let unitTableSend = buildUnitsPicker(unitsToIgnore, "send", 'number');
            let unitTableKeep = buildUnitsPicker(unitsToIgnore, "keep", 'number');


            contentManualUnitSelection = `
            <div class="ra-mb10" id="manual-unit" ${visibility}>
                <fieldset class="sb-fieldset">
                    <legend>${twSDK.tt('Enter units to send (-1 for all troops)')}</legend>
                    ${unitTableSend}
                </fieldset>
                <fieldset class="sb-fieldset">
                    <legend>${twSDK.tt('Enter units to keep (-1 for all troops)')}</legend>
                    ${unitTableKeep}
                </fieldset>
            </div>
            `;

            return contentManualUnitSelection;
        }

        //Helper: Render Arrival time selection
        function renderArrivalTimeSelector() {
            let contentArrivalTimeSelector = `
                <fieldset class="sb-fieldset" id="arrivalTimeFieldset">
                    <legend>${twSDK.tt("Arrival time")}</legend>
                    <div class="sb-grid sb-grid-5 ra-mb10">
                        <div>
                            <input type="datetime-local" id="startDateTime" required>
                        </div>
                        <div>
                            <input type="datetime-local" id="endDateTime" required>
                        </div>
                        <div>
                            <button type="button" class="add-entry-btn" id="addTimeEntry">+</button>
                        </div>
                        <div>
                            <button type="button" class="add-entry-btn deleteAllEntries" id="deleteAllEntries">${twSDK.tt("Delete all arrival times")}</button>
                        </div>
                        <div class="ra-tac">
                            <button id="resetInput" class="add-entry-btn deleteAllEntries" >${twSDK.tt('Reset Input')}</button>
                        </div>
                    </div>
                </fieldset>
            `;
            return contentArrivalTimeSelector;
        }
        // Helper: Fetch village groups
        async function fetchVillageGroups() {
            let fetchGroups = '';
            if (game_data.player.sitter > 0) {
                fetchGroups = game_data.link_base_pure + `groups&mode=overview&ajax=load_group_menu&t=${game_data.player.id}`;
            } else {
                fetchGroups = game_data.link_base_pure + 'groups&mode=overview&ajax=load_group_menu';
            }
            const villageGroups = await jQuery.get(fetchGroups).then((response) => response).catch((error) => {
                UI.ErrorMessage('Error fetching village groups!');
                console.error(`${scriptInfo} Error:`, error);
            }
            );

            return villageGroups;
        }
        function formatLocalizedTime(date) {
            return date.toLocaleDateString(undefined, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
            });
        }
        // Helper: Fetch home troop counts for current group
        async function fetchTroopsForCurrentGroup(groupId) {
            const mobileCheck = jQuery('#mobileHeader').length > 0;
            const troopsForGroup = await jQuery
                .get(
                    game_data.link_base_pure +
                    `overview_villages&mode=combined&group=${groupId}&page=-1`
                )
                .then(async (response) => {
                    const htmlDoc = jQuery.parseHTML(response);
                    const homeTroops = [];

                    if (mobileCheck) {
                        let table = jQuery(htmlDoc).find('#combined_table tr.nowrap');
                        for (let i = 0; i < table.length; i++) {
                            let objTroops = {};
                            let villageId = parseInt(
                                table[i]
                                    .getElementsByClassName('quickedit-vn')[0]
                                    .getAttribute('data-id')
                            );
                            let listTroops = Array.from(
                                table[i].getElementsByTagName('img')
                            )
                                .filter((e) => e.src.includes('unit'))
                                .map((e) => ({
                                    name: e.src
                                        .split('unit_')[1]
                                        .replace('@2x.png', ''),
                                    value: parseInt(
                                        e.parentElement.nextElementSibling.innerText
                                    ),
                                }));
                            listTroops.forEach((item) => {
                                objTroops[item.name] = item.value;
                            });

                            objTroops.villageId = villageId;
                            objTroops.coord = villageMap.get(parseInt(villageId));

                            homeTroops.push(objTroops);
                        }
                    } else {
                        const combinedTableRows = jQuery(htmlDoc).find(
                            '#combined_table tr.nowrap'
                        );
                        const combinedTableHead = jQuery(htmlDoc).find(
                            '#combined_table tr:eq(0) th'
                        );

                        const combinedTableHeader = [];

                        // collect possible buildings and troop types
                        jQuery(combinedTableHead).each(function () {
                            const thImage = jQuery(this).find('img').attr('src');
                            if (thImage) {
                                let thImageFilename = thImage.split('/').pop();
                                thImageFilename = thImageFilename.replace('.png', '');
                                combinedTableHeader.push(thImageFilename);
                            } else {
                                combinedTableHeader.push(null);
                            }
                        });

                        // collect possible troop types
                        combinedTableRows.each(function () {
                            let rowTroops = {};

                            combinedTableHeader.forEach((tableHeader, index) => {
                                if (tableHeader) {
                                    if (tableHeader.includes('unit_')) {
                                        const villageId = jQuery(this)
                                            .find('td:eq(1) span.quickedit-vn')
                                            .attr('data-id');
                                        const unitType = tableHeader.replace(
                                            'unit_',
                                            ''
                                        );
                                        rowTroops = {
                                            ...rowTroops,
                                            villageId: parseInt(villageId),
                                            [unitType]: parseInt(
                                                jQuery(this)
                                                    .find(`td:eq(${index})`)
                                                    .text()
                                            ),
                                        };
                                    }
                                }
                            });
                            rowTroops.coord = villageMap.get(parseInt(rowTroops.villageId));
                            homeTroops.push(rowTroops);
                        });
                    }

                    return homeTroops;
                })
                .catch((error) => {
                    UI.ErrorMessage(
                        twSDK.tt('There was an error while fetching the data!')
                    );
                    console.error(`${scriptInfo} Error:`, error);
                });

            return troopsForGroup;
        }

        // Function to initialize date and time entries from local storage
        function initializeSavedEntries() {
            const localStorageObject = getLocalStorage();
            const { arrival_times } = localStorageObject;

            const entriesTable = document.createElement('table');
            entriesTable.classList.add('entries-table');
            entriesTable.id = 'arrivalEntryTable';

            // Add table headers
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
        <th class="ra-tac">${twSDK.tt('From')}</th>
        <th class="ra-tac">${twSDK.tt('To')}</th>
        <th class="ra-tac">${twSDK.tt('Delete Entry')}</th>
    `;
            entriesTable.appendChild(headerRow);

            if (arrival_times && arrival_times.length > 0) {
                entriesTable.style.display = 'table'; // Make the table visible

                arrival_times.forEach((timeSpan, index) => {
                    const newEntryRow = document.createElement('tr');
                    newEntryRow.classList.add('entry-row');

                    const startTime = formatLocalizedTime(new Date(timeSpan[0]));
                    const endTime = formatLocalizedTime(new Date(timeSpan[1]));

                    newEntryRow.innerHTML = `
                <td class="entry-start">${startTime}</td>
                <td class="entry-end">${endTime}</td>
                <td class="ra-tac"><button class="delete-entry-btn" id="btn-${timeSpan[0]}-${timeSpan[1]}">X</button></td>
            `;

                    entriesTable.appendChild(newEntryRow);
                });
            } else {
                entriesTable.style.display = 'none'; // Hide the table if there are no entries
            }

            document.getElementById('arrivalTimeFieldset').appendChild(entriesTable);
        }

        function resetInput() {
            localStorageObject = getLocalStorage();
            const defaultSettings = {
                chosen_group: 0,
                attack_per_button: DEFAULT_ATTACKS_PER_BUTTON,
                delay: DEFAULT_DELAY,
                unit_selection_type: localStorageObject.unit_selection_type,
                max_attacks_per_village: DEFAULT_MAX_ATTACKS_PER_VILLAGE,
                send_spy: 'yes',
                keep_catapults: 0,
                units_to_send: {},
                units_to_keep: {},
                arrival_times: localStorageObject.arrival_times,
                target_coordinates: [],
                filter_ratio: false,
                avoid_nightbonus: true,
                buffer_nightbonus: NIGHT_BONUS_OFFSET,
            };

            // Initialize units_to_send and units_to_keep with each unit set to 0
            game_data.units.forEach(unit => {
                defaultSettings.units_to_send[unit] = 0;
                defaultSettings.units_to_keep[unit] = 0;
            });



            saveLocalStorage(defaultSettings);
            const fakeGeneratorDiv = document.getElementById('FakeGenerator');
            if (fakeGeneratorDiv) {
                fakeGeneratorDiv.remove();
            }
            renderUI();
            addEventHandlers();
        }

        // Service: Function to get settings from localStorage
        function getLocalStorage() {
            const localStorageSettings = localStorage.getItem('sbFakegeneratorSettings');

            expectedSettings = [
                'chosen_group',
                'attack_per_button',
                'delay',
                'unit_selection_type',
                'max_attacks_per_village',
                'send_spy',
                'keep_catapults',
                'units_to_send',
                'units_to_keep',
                'arrival_times',
                'target_coordinates',
                'filter_ratio',
                'avoid_nightbonus',
                'buffer_nightbonus'
            ]
            let missingSettings = []
            if (localStorageSettings) {
                // Check if all expected settings are present in localStorage
                missingSettings = expectedSettings.filter(setting => !localStorageSettings.includes(setting));
            }

            if (localStorageSettings && missingSettings.length === 0) {
                // If settings exist in localStorage, parse and return the object
                return JSON.parse(localStorageSettings);
            } else {
                // If no settings found, create an object with default values
                const defaultSettings = {
                    chosen_group: 0,
                    attack_per_button: DEFAULT_ATTACKS_PER_BUTTON,
                    delay: DEFAULT_DELAY,
                    unit_selection_type: 'dynamically',
                    max_attacks_per_village: DEFAULT_MAX_ATTACKS_PER_VILLAGE,
                    send_spy: 'yes',
                    keep_catapults: 0,
                    units_to_send: {},
                    units_to_keep: {},
                    arrival_times: [],
                    target_coordinates: [],
                    filter_ratio: false,
                    avoid_nightbonus: true,
                    buffer_nightbonus: NIGHT_BONUS_OFFSET,
                };

                // Initialize units_to_send and units_to_keep with each unit set to 0
                game_data.units.forEach(unit => {
                    defaultSettings.units_to_send[unit] = 0;
                    defaultSettings.units_to_keep[unit] = 0;
                });
                saveLocalStorage(defaultSettings);

                return defaultSettings;
            }
        }

        //Service: Function to save settings to localStorage
        function saveLocalStorage(settingsObject) {
            // Stringify and save the settings object
            localStorage.setItem('sbFakegeneratorSettings', JSON.stringify(settingsObject));
        }

        // Service: Fetch world config and needed data
        async function fetchWorldConfigData() {
            try {
                const worldUnitInfo = await twSDK.getWorldUnitInfo();
                const villages = await twSDK.worldDataAPI('village');
                const players = await twSDK.worldDataAPI('player');
                const worldConfig = await twSDK.getWorldConfig();
                return { players, villages, worldUnitInfo, worldConfig };
            } catch (error) {
                UI.ErrorMessage(
                    twSDK.tt('There was an error while fetching the data!')
                );
                console.error(`${scriptInfo} Error:`, error);
            }
        }

        // Copied and edited from twSDK by RedAlert to be able to call it twice and get different IDs and to not have the checked stuff
        // Some cleaned up version of this should be in the sdk probably
        function buildUnitsPicker(unitsToIgnore, id_prefix, type = 'checkbox') {
            let unitsTable = ``;

            let thUnits = ``;
            let tableRow = ``;

            game_data.units.forEach((unit) => {
                if (!unitsToIgnore.includes(unit)) {

                    thUnits += `
                        <th class="ra-text-center">
                            <label for="${id_prefix}_unit_${unit}">
                                <img src="/graphic/unit/unit_${unit}.png">
                            </label>
                        </th>
                    `;

                    tableRow += `
                        <td class="ra-text-center">
                            <input name="ra_chosen_units" type="${type}" id="${id_prefix}_unit_${unit}" class="ra-unit-selector" value="0" />
                        </td>
                    `;
                }
            });

            unitsTable = `
                <table class="ra-table ra-table-v2" width="100%" id="${id_prefix}_raUnitSelector">
                    <thead>
                        <tr>
                            ${thUnits}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            ${tableRow}
                        </tr>
                    </tbody>
                </table>
            `;

            return unitsTable;
        }
    }
);