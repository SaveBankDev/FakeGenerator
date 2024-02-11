/* 
* Script Name: Fake Generator
* Version: v1.0.1
* Last Updated: 2024-01-14
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
if (typeof NIGHT_BONUS_OFFSET !== 'number') NIGHT_BONUS_OFFSET = 15; // 10 minutes before Night bonus to give players time to send the attacks

// Global variable
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


var scriptConfig = {
    scriptData: {
        prefix: 'fakegenerator',
        name: 'Fake Generator',
        version: 'v1.0.1',
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
            'Enter units to send': 'Enter units to send',
            'Enter units to keep': 'Enter units to keep',
            'Coordinates:': 'Coordinates:',
            'Delete all arrival times': 'Delete all arrival times',
            'Arrival time': 'Arrival time',

        },
        en_US: {
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
            'Enter units to send': 'Enter units to send',
            'Enter units to keep': 'Enter units to keep',
            'Coordinates:': 'Coordinates:',
            'Delete all arrival times': 'Delete all arrival times',
            'Arrival time': 'Arrival time',
        },
        de_DE: {
            'Redirecting...': 'Weiterleiten...',
            Help: 'Hilfe',
            'Fake Generator': 'Fake Generator',
            'Group': 'Gruppe',
            'Attacks per Button': 'Angriffe pro Buttton',
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
            'Enter units to send': 'Zu sendende Truppen eingeben',
            'Enter units to keep': 'Zu behaltende Truppen eingeben',
            'Coordinates:': 'Koordinaten',
            'Delete all arrival times': 'Alle Ankunftszeiten löschen',
            'Arrival time': 'Ankunftszeiten'
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
        const groups = await fetchVillageGroups();
        const { villages, worldUnitInfo, worldConfig } = await fetchWorldConfigData();
        const villageData = villageArrayToDict(villages);



        // Entry point
        (async function () {
            try {
                renderUI();
                addEventHandlers();
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
                <div>
                    ${dynamicUnitSelection}
                </div>
                <div>
                    ${manualUnitSelection}
                </div>
                <div class="ra-mb10">
                    ${arrivalTimeSelector}
                </div>
                <div class="ra-mb10">
                    <fieldset class="sb-fieldset">
                        <legend>${twSDK.tt('Coordinates:')}</legend>
                        <textarea id="CoordInput" style="width: 100%" class="ra-textarea" placeholder="${twSDK.tt('Insert target coordinates here')}"></textarea>
                    </fieldset>
                </div>
                <div class="ra-mb10">
                    <a href="javascript:void(0);" id="calculateFakes" class="btn btn-confirm-yes onclick="">
                        ${twSDK.tt('Calculate Fakes')}
                    </a>
                </div>
            </div>
            <div>
                <div id="open_tabs" style="display: none;" class="ra-mb10">
                    <h2 id="h2_tabs"><center style="margin:10px"><u>Open Tabs</u></center></h2>
                </div>
            </div>`;
            const style = `
            <style>
                .fake-generator .btn-confirm-yes { padding: 3px; margin: 5px; }
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
                    width: 80px;
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
                    font-size: 14px;
                    color: white;
                    background: #0bac00;
                    background: linear-gradient(to bottom, #0bac00 0%,#0e7a1e 100%);
                    border: 1px solid;
                    border-color: #006712;
                    border-radius: 3px;
                    cursor: pointer;
                }
                .add-entry-btn:hover {
                    background: #13c600;
                    background: linear-gradient(to bottom, #13c600 0%,#129e23 100%);
                }
                .delete-entry-btn {
                    cursor: pointer;
                    color: red; 
                    font-weight: bold; 
                }
                
                .delete-entry-btn:hover {
                    text-decoration: underline; 
                }
                .sb-arrival-time {
                    background-color: #fff5da;
                    border: 1px solid #c1a264; 
                    border-radius: 4px; 
                    padding: 10px; 
                    display: grid;
                    grid-column-gap: 10px; 
                    align-items: center; 
                }
                #deleteAllEntries {
                    background: #af281d;
                    background: linear-gradient(to bottom, #af281d 0%,#801006 100%);
                }
                #deleteAllEntries:hover {
                    background: #c92722;
                    background: linear-gradient(to bottom, #c92722 0%,#a00d08 100%);
                }
            </style>`;

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

                // Ensure the input is at least 0
                const inputValue = parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : 0;

                jQuery(`#${e.target.id}`).val(inputValue);

                // Use setLocalStorage to update unit value
                let localStorageSettingsUnit = getLocalStorage();
                localStorageSettingsUnit[sendOrKeep][e.target.defaultValue] = inputValue;
                saveLocalStorage(localStorageSettingsUnit);
            }

            // Attach the generic function to all unit number inputs
            jQuery('.ra-unit-selector').on('change', function (e) {
                handleUnitInputChange(e);
            });


            let target_coords = getLocalStorage().target_coordinates;
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
                    jQuery('#CoordInput').text(existingCoordinates.length);
                } else {
                    this.value = '';
                    jQuery('#CoordInput').text(0);
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
                // Remove all entries with the class sb-arrival-time
                jQuery('.sb-arrival-time').remove();

                // Clear saved times in local storage
                const localStorageObject = getLocalStorage();
                localStorageObject.arrival_times = [];
                saveLocalStorage(localStorageObject);
            });
            jQuery('#addTimeEntry').on('click', async function (e) {
                e.preventDefault();

                // Logic to validate and add new entry into the fieldset with the id arrivalTimeFieldset
                const startTimeString = jQuery('#startDateTime').val();
                const endTimeString = jQuery('#endDateTime').val();

                if (startTimeString && endTimeString) {
                    const currentTime = Date.now();
                    const startTime = new Date(startTimeString).getTime();
                    const endTime = new Date(endTimeString).getTime();

                    if (!isNaN(startTime) && !isNaN(endTime) && startTime < endTime && currentTime < endTime) {
                        // Valid entry, proceed to update localStorage
                        const localStorageObject = getLocalStorage();
                        localStorageObject.arrival_times.push([startTime, endTime]);
                        saveLocalStorage(localStorageObject);

                        // Create a new <div class="sb-grid sb-grid-5 sb-arrival-time"> for the new entry
                        const newEntryDiv = jQuery('<div class="sb-grid sb-grid-5 sb-arrival-time ra-mb10"></div>');
                        newEntryDiv.append(`<div>${formatTime(new Date(startTime))}</div>`);
                        newEntryDiv.append(`<div>${formatTime(new Date(endTime))}</div>`);
                        newEntryDiv.append('<div class="delete-entry-btn">X</div>');
                        newEntryDiv.append('<div></div>'); // Empty div
                        newEntryDiv.append('<div></div>'); // Empty div
                        jQuery('#arrivalTimeFieldset').append(newEntryDiv);

                        // Event handler for the delete entry button
                        newEntryDiv.find('.delete-entry-btn').on('click', function () {
                            newEntryDiv.remove();
                            const updatedLocalStorage = getLocalStorage();
                            updatedLocalStorage.arrival_times = updatedLocalStorage.arrival_times.filter(timeSpan => !isEqual(timeSpan, [startTime, endTime]));
                            saveLocalStorage(updatedLocalStorage);
                        });
                    } else {
                        // Invalid entry, handle accordingly (e.g., show an error message)
                        console.log('Invalid entry. Please check the selected times.');
                    }
                } else {
                    // Invalid entry, handle accordingly (e.g., show an error message)
                    console.log('Invalid entry. Please select both start and end times.');
                }
            });
            // For the Calculate Fakes Button
            jQuery('#calculateFakes').on('click', async function (e) {
                e.preventDefault();

                let playerVillages;
                let targetCoords = [];

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
                    console.debug(`${scriptInfo} village.txt villages: `, villages); // Risky
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

                calculateFakes(playerVillages, targetCoords, worldConfig.config.night, parseInt(worldConfig.config.game.fake_limit), parseFloat(worldUnitInfo.config.catapult.speed), spySend);
            });
        }

        /*  Main calculation function
            Input:
            playerVillages
            targetCoords
            world_config (night[active, start_hour, end_hour], fakeLimit)
            catSpeed 
        */
        function calculateFakes(playerVillages, targetCoords, nightInfo, fakeLimit, catSpeed, spySend) {
            // Get start timestamp
            let startTime = new Date().getTime();
            let { amountOfCombinations, allCombinations } = getAllPossibleCombinations(playerVillages, targetCoords, catSpeed, nightInfo, fakeLimit);

            //DEBUG information
            if (DEBUG) {
                console.debug(`${scriptInfo} All calculated Combinations: `, allCombinations);
                console.debug(`${scriptInfo} Amount of possible Combinations: `, amountOfCombinations);
            }
            if (amountOfCombinations === 0) {
                UI.ErrorMessage(twSDK.tt('No Fakes possible!'));
                return;
            }

            //Filter arrays less than 1 in length, meaning only containing the target village
            if (DEBUG) console.debug(`${scriptInfo} Unfiltered length of allCombinations: ${allCombinations.length}`);
            allCombinations = allCombinations.filter((combination) => combination.length > 1);
            // Sort allCombinations array based on the length of sub-arrays in ascending order
            allCombinations.sort((a, b) => a.length - b.length);
            let startingAmountOfComb = allCombinations.length;
            if (DEBUG) console.debug(`${scriptInfo} Filtered length of allCombinations: ${startingAmountOfComb}`);

            /*
            Filter Coordinates where no player villages has been found
            Sort the array in ascending order of value length
            Iterate over the found combinations in the array
            If we have multiple player villages, get the one that is least often used for other future target coords and has been used the least
            and push the coord combination to our result
            If only one Player village has been found, just use that 
            Then subtract the used amount of catapults from the villages catapults and if the village then does not have enough catapults for more fakes, remove it from the remaining arrays
            */

            //Initializing map to count the usage of each playerVillage
            let usedPlayerVillages = new Map();
            playerVillages.forEach((village) => {
                usedPlayerVillages.set(village.villageId, 0);
            });

            //Creating an empty array to store resulting pairs
            let calculatedFakePairs = [];

            // Get counts beforehand and reuse it
            let counts = getCounts(allCombinations);
            let minCat;
            const threshold = 0.10; // 10% threshold

            while (allCombinations.length > 0) {
                let combination = allCombinations.shift();;
                // Next loop if the combination only contains the target village
                if (combination.length < 2) {
                    continue;
                }

                // Sort player villages if there are more than 1 player village for this targetCoord
                if (combination.length > 2) {
                    combination = [combination[0]].concat(combination.slice(1).sort((a, b) => {
                        let villageIdA = a.villageId;
                        let villageIdB = b.villageId;

                        // The villages might not exist in counts
                        let countA = counts.get(villageIdA) || 0;
                        let countB = counts.get(villageIdB) || 0;

                        // Get usage counts
                        let usedCountA = usedPlayerVillages.get(villageIdA) || 0;
                        let usedCountB = usedPlayerVillages.get(villageIdB) || 0;

                        // The number of remaining targets
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
                }

                let chosenVillage = null;
                for (let j = 1; j < combination.length; j++) {
                    let village = combination[j];
                    minCat = getMinAmountOfCatapults(village.points, fakeLimit);
                    // Considering spy amount if spySend is true,  catapult amount and if the pair is already in our results 
                    if (village.catapult >= minCat && !(spySend && village.spy <= 0) && !calculatedFakePairs.some(pair => pair[0] === village && pair[1] === combination[0])) {
                        chosenVillage = village;
                        break;
                    }
                }

                // If no valid village is found, skip to the next combination
                if (!chosenVillage) {
                    continue;
                }

                minCat = getMinAmountOfCatapults(chosenVillage.points, fakeLimit);
                chosenVillage.catapult -= minCat;


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

                // Accounting for spy decrement when spySend is true
                if (spySend && chosenVillage.spy > 0) {
                    chosenVillage.spy -= 1;
                }

                if ((spySend && chosenVillage.spy < 1) || chosenVillage.catapult < minCat) {
                    // loop through allCombinations and remove the chosenVillage from all its occurrences
                    allCombinations = allCombinations.map(combination => {
                        return combination.filter(element => element !== chosenVillage);
                    });
                }
            }
            if (DEBUG) console.debug(`${scriptInfo} Calculated fake pairs: ${calculatedFakePairs}`);
            if (DEBUG) {
                let villageUsages = [];

                for (let villageId of usedPlayerVillages.keys()) {
                    let usage = usedPlayerVillages.get(villageId);
                    villageUsages.push(usage);
                    console.debug(`${scriptInfo} How often each village was used: ${villageId} : ${usage}`);
                }

                // Calculate the median
                villageUsages.sort((a, b) => a - b);

                let median;
                let midIndex = Math.floor(villageUsages.length / 2);

                // If the quantity of the elements is even, the median is the average of the two central elements
                // Otherwise, it's the single central element
                if (villageUsages.length % 2 === 0) {
                    median = (villageUsages[midIndex - 1] + villageUsages[midIndex]) / 2;
                } else {
                    median = villageUsages[midIndex];
                }

                console.debug(`${scriptInfo} Sorted usages ${villageUsages}`);
                console.debug(`${scriptInfo} Median usage of villages: ${median}`);
            }
            let generatedFakeLinks = [];
            for (let pair of calculatedFakePairs) {
                if (spySend) {
                    generatedFakeLinks.push(generateLink(pair[0], getVillageIdFromCoord(pair[1]), getMinAmountOfCatapults(pair[0].points, fakeLimit), 1));
                } else {
                    generatedFakeLinks.push(generateLink(pair[0], getVillageIdFromCoord(pair[1]), getMinAmountOfCatapults(pair[0].points, fakeLimit), 0));
                }
            }

            if (DEBUG) console.debug(`${scriptInfo} One of the generated Links: ${generatedFakeLinks}`);
            // Get end timestamp
            let endTime = new Date().getTime();
            if (DEBUG) console.debug(`${scriptInfo} The script took ${endTime - startTime} milliseconds to calculate ${calculatedFakePairs.length} fake pairs from ${amountOfCombinations} possible combinations.`);
            createSendButtons(generatedFakeLinks);
            if (DEBUG) console.debug(`${scriptInfo} Finished`);

            return;
        }


        // All possible combinations of player village and target  coords with consideration of arrival time outside the night bonus and minimum catapult am
        function getAllPossibleCombinations(playerVillages, targetCoords, unitSpeed, nightInfo, fakeLimit) {
            let allCombinations = [];
            let currentTime = Date.now();
            let minCat = 1;
            let validArrivalTime = false;
            let amountOfCombinations = 0;
            let distance;
            let travelTime;

            for (let targetCoord of targetCoords) {
                let subArray = [targetCoord];
                for (let playerVillage of playerVillages) {
                    distance = twSDK.calculateDistance(playerVillage.coord, targetCoord);
                    travelTime = twSDK.getTravelTimeInSecond(distance, unitSpeed) * 1000;
                    // Check if arrival time would be in night bonus
                    validArrivalTime = checkValidArrivalTime(parseInt(nightInfo.start_hour), parseInt(nightInfo.end_hour), (currentTime + travelTime))
                    // Check the minimum amount of needed catapults 
                    minCat = getMinAmountOfCatapults(playerVillage.points, fakeLimit);
                    // If the attack has a valid arrival time and the player village has enough catapults add it to our subArray
                    if (validArrivalTime && playerVillage.catapult >= minCat) {
                        subArray.push(playerVillage);
                        amountOfCombinations += 1;
                    }
                }
                allCombinations.push(subArray);
            }
            return { amountOfCombinations, allCombinations };
        }

        // Helper: Function to generate a link from villageIds 
        // 'https://de219.die-staemme.de/game.php?village=48766&screen=place&spy=1&catapult=14&x=472&y=523&
        function generateLink(village1, villageId2, catAmount, spyAmount) {
            completeLink = ""
            completeLink += getCurrentURL();
            completeLink += `?village=${village1.villageId}&screen=place&target=${villageId2}&spy=${spyAmount}&catapult=${catAmount}`;
            return completeLink;
        }

        // Helper: Villages array to dictionary, to quickly search with coordinates
        function villageArrayToDict(villageArray) {
            let dict = {};
            for (let i = 0; i < villageArray.length; i++) {
                let key = villageArray[i][2] + '|' + villageArray[i][3]; //assuming x is at arr[i][2] and y is at arr[i][3]
                dict[key] = [villageArray[i][0], villageArray[i][5]];   //assuming id is at arr[i][0] and points is at arr[i][5]
            }
            return dict;
        }

        // Helper:  Get Village ID from a coordinate
        function getVillageIdFromCoord(coord) {
            let village = villageData[coord];
            return village[0];
        }

        // Helper: Get village points from village.txt with coordinates
        function getVillagePointsFromCoord(coord) {
            let village = villageData[coord];
            return village[1];
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

        // Helper: Checks if the arrival time is in the night bonus or not
        function checkValidArrivalTime(start_hour, end_hour, timestamp) {
            const time = new Date(timestamp);
            const currentTotalTime = (time.getHours() + time.getMinutes() / 60);

            // We want to arrive shortly before the night bonus to give the player time to send the attacks
            const checkStartNb = ((start_hour + 24) - (NIGHT_BONUS_OFFSET / 60)) % 24;  // Wrap around when subtracting offsett
            const checkEndNb = end_hour;

            // Check if current time is less than the start of the night bonus or current time is greater than the end of the night bonus.
            if (start_hour === end_hour) {
                return false; // edge case where start and end time are the same
            } else {
                return (currentTotalTime >= checkEndNb && currentTotalTime < checkStartNb);
            }
        }

        function createSendButtons(URIs) {
            // Get the number of attacks per button
            let nrSplit = parseInt(getLocalStorage().attack_per_button);

            if (DEBUG) console.debug(`${scriptInfo} Number of attacks per button: ${nrSplit}`);

            // Fetch the 'open_tabs' div where buttons will be appended
            let openTabsDiv = document.getElementById("open_tabs");

            // Reset the buttons
            openTabsDiv.innerHTML = `<h2 id="h2_tabs"><center style="margin:10px"><u>Open Tabs</u></center></h2>`;

            // Calculate the number of required buttons
            let nrButtons = Math.ceil(URIs.length / nrSplit);
            if (DEBUG) console.debug(`${scriptInfo} Required number of buttons: ${nrButtons}`);


            // Create and append buttons
            for (let i = 0; i < nrButtons; i++) {
                let button = document.createElement('button');
                // Add CSS classes to the button
                button.classList.add('btn', 'btn-confirm-yes');

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
                        setTimeout(() => { window.open(link) }, index * 400);
                    })
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

        // Helper function to format time for display
        function formatTime(time) {
            return new Date(time).toLocaleString();
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
            const unitsToIgnore = ['militia', 'knight', 'snob'];
            let unitTableSend = buildUnitsPicker(game_data.units, unitsToIgnore, "send", 'number');
            let unitTableKeep = buildUnitsPicker(game_data.units, unitsToIgnore, "keep", 'number');


            contentManualUnitSelection = `
            <div class="ra-mb10" id="manual-unit" ${visibility}>
                <fieldset class="sb-fieldset">
                    <legend>${twSDK.tt('Enter units to send')}</legend>
                    ${unitTableSend}
                </fieldset>
                <fieldset class="sb-fieldset">
                    <legend>${twSDK.tt('Enter units to keep')}</legend>
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
                            <button type="button" class="add-entry-btn" id="deleteAllEntries">${twSDK.tt("Delete all arrival times")}</button>
                        </div>
                        <div></div>
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
        // Helper: Fetch home troop counts for current group
        async function fetchTroopsForCurrentGroup(groupId) {
            const mobileCheck = $('#mobileHeader').length > 0;
            const troopsForGroup = await jQuery.get(game_data.link_base_pure + `overview_villages&mode=combined&group=${groupId}&page=-1`).then(async (response) => {
                const htmlDoc = jQuery.parseHTML(response);
                const homeTroops = [];

                if (mobileCheck) {
                    let table = jQuery(htmlDoc).find('#combined_table tr.nowrap');
                    for (let i = 0; i < table.length; i++) {
                        let objTroops = {};
                        let coord = table[i].getElementsByClassName('quickedit-label')[0].innerHTML;
                        let villageId = parseInt(table[i].getElementsByClassName('quickedit-vn')[0].getAttribute('data-id'));
                        let listTroops = Array.from(table[i].getElementsByTagName('img')).filter((e) => e.src.includes('unit')).map((e) => ({
                            name: e.src.split('unit_')[1].replace('@2x.png', ''),
                            value: parseInt(e.parentElement.nextElementSibling.innerText),
                        }));
                        listTroops.forEach((item) => {
                            objTroops[item.name] = item.value;
                        }
                        );
                        objTroops.coord = twSDK.getCoordFromString(coord);
                        objTroops.villageId = villageId;

                        homeTroops.push(objTroops);
                    }
                } else {
                    const combinedTableRows = jQuery(htmlDoc).find('#combined_table tr.nowrap');
                    const combinedTableHead = jQuery(htmlDoc).find('#combined_table tr:eq(0) th');

                    const combinedTableHeader = [];

                    // Collect possible buildings and troop types
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

                    // Collect possible troop types
                    combinedTableRows.each(function () {
                        let rowTroops = {};

                        combinedTableHeader.forEach((tableHeader, index) => {
                            if (tableHeader) {
                                if (tableHeader.includes('unit_')) {
                                    const coord = twSDK.getCoordFromString(jQuery(this).find('td:eq(1) span.quickedit-label').text());
                                    const villageId = jQuery(this).find('td:eq(1) span.quickedit-vn').attr('data-id');
                                    const unitType = tableHeader.replace('unit_', '');
                                    rowTroops = {
                                        ...rowTroops,
                                        villageId: parseInt(villageId),
                                        coord: coord,
                                        [unitType]: parseInt(jQuery(this).find(`td:eq(${index})`).text()),
                                    };
                                }
                            }
                        }
                        );

                        homeTroops.push(rowTroops);
                    });
                }

                return homeTroops;
            }
            ).catch((error) => {
                UI.ErrorMessage(tt('An error occured while fetching troop counts!'));
                console.error(`${scriptInfo} Error:`, error);
            }
            );

            return troopsForGroup;
        }

        // Service: Function to get settings from localStorage
        function getLocalStorage() {
            const localStorageSettings = localStorage.getItem('sbFakegeneratorSettings');

            if (localStorageSettings) {
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
                    target_coordinates: []
                };

                // Initialize units_to_send and units_to_keep with each unit set to 0
                game_data.units.forEach(unit => {
                    defaultSettings.units_to_send[unit] = 0;
                    defaultSettings.units_to_keep[unit] = 0;
                });

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
                const worldConfig = await twSDK.getWorldConfig();
                return { villages, worldUnitInfo, worldConfig };
            } catch (error) {
                UI.ErrorMessage(
                    twSDK.tt('There was an error while fetching the data!')
                );
                console.error(`${scriptInfo} Error:`, error);
            }
        }

        // Copied and edited from twSDK to be able to call it twice and get different IDs
        // Please implement into SDK somehow
        function buildUnitsPicker(selectedUnits, unitsToIgnore, id_prefix, type = 'checkbox') {
            let unitsTable = ``;

            let thUnits = ``;
            let tableRow = ``;

            game_data.units.forEach((unit) => {
                if (!unitsToIgnore.includes(unit)) {
                    let checked = '';
                    if (selectedUnits.includes(unit) && type == "checkbox") {
                        checked = `checked`;
                    }

                    thUnits += `
                        <th class="ra-text-center">
                            <label for="${id_prefix}_unit_${unit}">
                                <img src="/graphic/unit/unit_${unit}.png">
                            </label>
                        </th>
                    `;

                    tableRow += `
                        <td class="ra-text-center">
                            <input name="ra_chosen_units" type="${type}" ${checked} id="${id_prefix}_unit_${unit}" class="ra-unit-selector" value="${unit}" />
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