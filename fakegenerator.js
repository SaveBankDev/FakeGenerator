/* javascript:$.getScript('https://dl.dropboxusercontent.com/scl/fi/nsgrlm82n8iv3sl3uj0i2/fakegenerator.js?rlkey=6iyvpi8kwrnv1q3y0aq3j0l34&dl=0');
* Script Name: Fake Generator
* Version: v0.1
* Last Updated: 2024-01-02
* Author: SaveBank
* Author Contact: Discord: savebank
* Contributor: RedAlert 
* Approved: N/A
* Approved Date: N/A
* Mod: N/A
*/


// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;
if (typeof BIG_SERVER !== 'boolean') BIG_SERVER = false;

// Global variable
var DEFAULT_ATTACKSPERBUTTON = 20;
var COORD_REGEX = (BIG_SERVER) ? /\d{1,3}\|\d{1,3}/g : /\d\d\d\|\d\d\d/g; // Different regex depending on player input if the server is too big for the strict regex
var NIGHT_BONUS_OFFSET = 5 * 60 * 1000;  // 5 minutes before Night bonus to give players time to send the attacks
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
        version: 'v0.1',
        author: 'SaveBank',
        authorUrl: '',
        helpLink: '',
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
        await twSDK.init(scriptConfig);
        const scriptInfo = twSDK.scriptInfo();
        const isValidScreen = twSDK.checkValidLocation('screen');
        const isValidMode = twSDK.checkValidLocation('mode');
        const groups = await fetchVillageGroups();
        const { villages, worldUnitInfo, worldConfig } = await fetchWorldConfigData();



        // Entry point
        (async function () {
            try {
                // Check that we are on the correct screen and mode
                if (!isValidScreen && !isValidMode) {
                    // Redirect to correct screen if necessary
                    UI.InfoMessage(twSDK.tt('Redirecting...'));
                    twSDK.redirectTo('overview_villages&combined');
                } else {
                    renderUI();
                    addEventHandlers();
                }
            } catch (error) {
                UI.ErrorMessage(twSDK.tt('There was an error!'));
                console.error(`${scriptInfo} Error:`, error);
            }
        })();



        /* TODO UI
        User Input:
        - Target coordinates
        - Group to send from
        - Tabs to open in one Button (Check if number is high enough to not have 1000 buttons)
        Output:
        - Number of Fakes generated / Number of total possible Fakes
        - Buttons to open Fakes in new tab to send (Prefill troop amount: 1 Spy and min amount of Cats)
        */
        function renderUI() {
            const groupsFilter = renderGroupsFilter();
            const spySelect = renderSpySelect();

            const content = `
        <div class="ra-fake-generator" id="raFakeGenerator">
            <h2>${twSDK.tt(scriptConfig.scriptData.name)}</h2>
        <div class="ra-fake-generator-data">
        <div class="ra-mb15">
			<div class="ra-grid">
                <div>
                    <label>${twSDK.tt('Group')}</label>
                    ${groupsFilter}
                </div>
                <div>
                    <label>${twSDK.tt('Send Spy?')}</label>
                    ${spySelect}
                </div>
				<div class="number-input">
					<label>${twSDK.tt('Attacks per Button')}</label>
					<input id="raAttPerBut" type="number" value="${DEFAULT_ATTACKSPERBUTTON}">
				</div>
            </div>
		</div>
		<div class="ra-mb15">
			<a href="javascript:void(0);" id="calculateFakes" class="btn btn-confirm-yes onclick="">
				${twSDK.tt('Calculate Fakes')}
			</a>
		</div>
		    <div class="ra-mb15">
		        <textarea id="coordInput" style="width: 100%" class="ra-textarea" placeholder="${twSDK.tt('Insert target coordinates here')}"></textarea>
		    </div>
        </div>
        <div>
            <div id="open_tabs" style="display: none;" class="ra-mb15">
                <h2 id="h2_tabs"><center style="margin:10px"><u>Open Tabs</u></center></h2>
            </div>
        </div>
            <small>
                <strong>
                    ${twSDK.tt(scriptConfig.scriptData.name)} ${scriptConfig.scriptData.version}
                </strong> -
                <a href="${scriptConfig.scriptData.authorUrl}" target="_blank" rel="noreferrer noopener">
                    ${scriptConfig.scriptData.author}
                </a> -
                <a href="${scriptConfig.scriptData.helpLink}" target="_blank" rel="noreferrer noopener">
                    ${twSDK.tt('Help')}
                </a>
            </small>
        </div>
        <style>
            .ra-fake-generator { position: relative; display: block; width: auto; height: auto; clear: both; margin: 0 auto 15px; padding: 10px; border: 1px solid #603000; box-sizing: border-box; background: #f4e4bc; }
			.ra-fake-generator * { box-sizing: border-box; }
			.ra-fake-generator input[type="text"] { width: 100%; padding: 5px 10px; border: 1px solid #000; font-size: 16px; line-height: 1; }
			.ra-fake-generator label { font-weight: 600 !important; margin-bottom: 5px; display: block; }
			.ra-fake-generator select { width: 100%; padding: 5px 10px; border: 1px solid #000; font-size: 16px; line-height: 1; }
            .ra-fake-generator input[type="number"] { width: 100%; padding: 5px 10px; border: 1px solid #000; font-size: 16px; line-height: 1; }
			.ra-fake-generator .btn-confirm-yes { padding: 3px; }
            .number-input { display: flex; flex-direction: column; width: 100%; }
            .number-input label { white-space: nowrap; }
            .number-input input { width: 100%; }

			${mobiledevice ? '.ra-fake-generator { margin: 5px; border-radius: 10px; } .ra-fake-generator h2 { margin: 0 0 10px 0; font-size: 18px; } .ra-fake-generator .ra-grid { grid-template-columns: 1fr } .ra-fake-generator .ra-grid > div { margin-bottom: 15px; } .ra-fake-generator .btn { margin-bottom: 8px; margin-right: 8px; } .ra-fake-generator select { height: auto; } .ra-fake-generator input[type="text"] { height: auto; } .ra-hide-on-mobile { display: none; }' : '.ra-fake-generator .ra-grid { display: grid; grid-template-columns: 150px 1fr 100px 150px 150px; grid-gap: 0 20px; }'}

			/* Helpers */
			.ra-mb15 { margin-bottom: 15px; }

        </style>
    `;

            if (jQuery('.ra-fake-generator').length < 1) {
                if (mobiledevice) {
                    jQuery('#mobileContent').prepend(content);
                } else {
                    jQuery('#contentContainer').prepend(content);
                }
            } else {
                jQuery('.ra-fake-generator-data').html(body);
            }
        }

        // Add event handlers and data storage
        function addEventHandlers() {
            // For the Group select menu
            jQuery('#raGroupsFilter').on('change', function (e) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} selected group ID: `, e.target.value);
                }
                localStorage.setItem(`${scriptConfig.scriptData.prefix}_chosen_group`, e.target.value);
            });
            // For the Attacks per Button Option
            localStorage.setItem(`${scriptConfig.scriptData.prefix}_AttPerBut`, localStorage.getItem(`${scriptConfig.scriptData.prefix}_AttPerBut`) ?? DEFAULT_ATTACKSPERBUTTON)
            jQuery('#raAttPerBut').val(localStorage.getItem(`${scriptConfig.scriptData.prefix}_AttPerBut`) ?? DEFAULT_ATTACKSPERBUTTON)
            jQuery('#raAttPerBut').on('change', function (e) {
                e.target.value = e.target.value.replace(/\D/g, '')
                if (DEBUG) {
                    console.debug(`${scriptInfo} Attacks per Button: `, e.target.value);
                }
                if (e.target.value < 1 || isNaN(parseInt(e.target.value))) {
                    jQuery('#raAttPerBut').val(DEFAULT_ATTACKSPERBUTTON);
                    e.target.value = DEFAULT_ATTACKSPERBUTTON;
                }
                localStorage.setItem(`${scriptConfig.scriptData.prefix}_AttPerBut`, e.target.value);
            });
            // For the Send spy select menu
            jQuery('#raSendSpy').on('change', function (e) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} Send Spy: `, e.target.value);
                }
                localStorage.setItem(`${scriptConfig.scriptData.prefix}_send_spy`, e.target.value);
            });
            //  For the coord input text area
            jQuery('#coordInput').on('change', function (e) {
                const coordinates = this.value.match(COORD_REGEX);
                if (coordinates) {
                    this.value = coordinates.join(' ');
                    jQuery('#coordInput').text(coordinates.length);
                } else {
                    this.value = '';
                    jQuery('#coordInput').text(0);
                }
            });
            // For the Calculate Fakes Button
            jQuery('#calculateFakes').on('click', async function (e) {
                e.preventDefault();

                let player_villages;
                let target_coords = [];

                target_coords = jQuery('#coordInput').val().trim().match(COORD_REGEX);
                if (target_coords.length === 0) {
                    UI.ErrorMessage(twSDK.tt('No target coordinates!'));
                    return;
                }
                const groupId = localStorage.getItem(`${scriptConfig.scriptData.prefix}_chosen_group`) ?? 0;

                if (DEBUG) {
                    console.debug(`${scriptInfo} Target coordinates: `, target_coords);
                    console.debug(`${scriptInfo} worldConfig: `, worldConfig);
                    console.debug(`${scriptInfo} worldUnitInfo: `, worldUnitInfo);
                    console.debug(`${scriptInfo} village.txt villages: `, villages); // Risky
                }

                try {
                    player_villages = await fetchTroopsForCurrentGroup(parseInt(groupId));
                    if (DEBUG) {
                        console.debug(`${scriptInfo} Player villages: `, player_villages);
                    }
                } catch (error) {
                    UI.ErrorMessage(twSDK.tt('There was an error!'));
                    console.error(`${scriptInfo} Error:`, error);
                }

                for (player_village of player_villages) {
                    points = getVillagePoints(player_village.villageId)
                    player_village.points = points;
                }

                if (DEBUG) {
                    console.debug(`${scriptInfo} Player villages with points: `, player_villages);
                }


                calculateFakes(player_villages, target_coords, worldConfig.config.night, parseInt(worldConfig.config.unit_speed), parseInt(worldConfig.config.speed),
                    parseInt(worldConfig.config.game.fake_limit), parseInt(worldUnitInfo.config.catapult.speed));

            });
        }

        /*  Main calculation function
            Input:
            player_villages
            target_coords
            world_config (unitSpeed, worldSpeed, night[active, start_hour, end_hour], fake_limit)
            cat_speed 

            Calculation:
            TODO 
        */
        function calculateFakes(player_villages, target_coords, night_info, unit_speed, world_speed, fake_limit, cat_speed) {

            const actual_cat_speed = cat_speed * (unit_speed * world_speed);
            allCombinations = getAllPossibleCombinations(player_villages, target_coords, actual_cat_speed, night_info, fake_limit);
            if (DEBUG) {
                console.debug(`${scriptInfo} All calculated Combinations: `, allCombinations);
            }




            return;
        }

        // All possible combinations of player village and target  coords with consideration of arrival time outside the night bonus and minimum catapult am
        function getAllPossibleCombinations(player_villages, target_coords, unit_speed, night_info, fake_limit) {
            let result = {};
            let current_time = Date.now();
            let minCat = 0;
            let validArrivalTime = false;
            for (let target_coord of target_coords) {
                result[target_coord] = [];
                for (let player_village of player_villages) {
                    distance = twSDK.calculateDistance(player_village.coord, target_coord);
                    travel_time = twSDK.getTravelTimeInSecond(distance, unit_speed) * 1000;
                    // Check if arrival time would be in night bonus
                    validArrivalTime = checkValidArrivalTime(parseInt(night_info.start_hour), parseInt(night_info.end_hour), (current_time + travel_time))
                    // Check the minimum amount of needed catapults 
                    minCat = getMinAmountOfCatapults(player_village.points, fake_limit);
                    // If the attack has a valid arrival time and the player village has enough catapults add it to our result 
                    if (validArrivalTime && player_village.catapult >= minCat) {
                        result[target_coord] = result[target_coord].push(player_village);
                    }
                }
            }
            return result;
        }

        // Helper: Get village points from village.txt with villageId
        function getVillagePoints(villageId) {
            for (village of villages) {
                // If we find the matching villageId in the village.txt we return the points of the village
                if (villageId === village[0]) {
                    if (DEBUG) {
                        console.debug(`${scriptInfo} Found matching villageIds: `, villageId, village[0]);
                    }
                    return village[5];
                }
            }
            return 0; // This should never happen
        }

        // Helper: Get minimum amount of catapults to send depending on if fake_limit is active
        function getMinAmountOfCatapults(player_village_points, fake_limit) {
            if (fake_limit === 0) {
                return 1;
            } else {
                // Get the required amount of pop and calculate the next higher amount of catapults to meet the demand
                req_catapults = Math.floor(((player_village_points * (fake_limit / 100)) + (TROOP_POP.catapult - 1)) / TROOP_POP.catapult);
                // If the required catapult amount is 0 we still need at least 1 to send a fake
                return (req_catapults > 0) ? req_catapults : 1;
            }
        }

        // Helper: Checks if the arrival time is not in the night bonus
        function checkValidArrivalTime(start_hour, end_hour, timestamp) {
            const time = new Date(timestamp);
            const currentHour = time.getHours();
            const currentMinutes = time.getMinutes();

            const check_start_nb = start_hour - (NIGHT_BONUS_OFFSET / 60); // We want to arrive shortly before the night bonus to give the player time to send the attacks
            const check_end_nb = end_hour;

            if (check_end_nb <= check_start_nb) {
                return ((currentHour + currentMinutes / 60) >= check_end_nb && (currentHour + currentMinutes / 60) < check_start_nb);
            } else {
                // If the nigth bonus spans across midnight
                return ((currentHour + currentMinutes / 60) >= check_end_nb || (currentHour + currentMinutes / 60) < check_start_nb);
            }
        }

        // TODO finish cleaning up and completing html/css
        // Helper: Create send buttons
        function createSendButtons(created_send_links, nr_split) {
            let number_of_buttons = Math.ceil(created_send_links.length / nr_split);
            let ms_delay = parseInt(document.getElementById('delay_tabs').value);

            ms_delay = Number.isNaN(ms_delay) == true || ms_delay < 200 ? 200 : ms_delay;
            for (let i = 0; i < number_of_buttons; i++) {
                let button_lower_fake_number = i * nr_split;
                let button_upper_fake_number = i * nr_split + nr_split;

                if (i * nr_split + nr_split > created_send_links.length) {
                    button_upper_fake_number = created_send_links.length;
                }

                let send_button = document.createElement('button');
                send_button.classList = 'btn evt-confirm-btn btn-confirm-yes open_tab';
                send_button.innerText = '[ ' + button_lower_fake_number + ' - ' + button_upper_fake_number + ' ]';
                send_button.style.margin = '5px';

                send_button.onclick = function () {
                    let created_send_links_for_this_button = created_send_links.slice(button_lower_fake_number, button_upper_fake_number);
                    send_button.classList.remove('evt-confirm-btn');
                    send_button.classList.remove('btn-confirm-yes');
                    send_button.classList.add('btn-confirm-no');

                    for (let j = 0; j < created_send_links_for_this_button.length; j++) {
                        window.setTimeout(() => {
                            window.open(created_send_links_for_this_button[j], '_blank');
                            if (DEBUG) {
                                console.debug(`${scriptInfo} Current time: `, new Date().getTime());
                            }
                        }, ms_delay * j);
                    }

                    $('.open_tab').prop('disabled', true);
                    window.setTimeout(() => {
                        $('.open_tab').prop('disabled', false);
                    }, ms_delay * (button_upper_fake_number - button_lower_fake_number));

                }

                document.getElementById('div_open_tabs').appendChild(send_button);
            }
        }

        // Helper: Render groups select
        function renderGroupsFilter() {
            const groupId = localStorage.getItem(`${scriptConfig.scriptData.prefix}_chosen_group`) ?? 0;
            let groupsFilter = `
		<select name="ra_groups_filter" id="raGroupsFilter">
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
            const sendSpy = localStorage.getItem(`${scriptConfig.scriptData.prefix}_send_spy`) ?? "yes";
            let contentSpySelect = `
            <select id="raSendSpy">
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
    }
);