/* javascript:$.getScript('https://dl.dropboxusercontent.com/scl/fi/nsgrlm82n8iv3sl3uj0i2/fakegenerator.js?rlkey=6iyvpi8kwrnv1q3y0aq3j0l34&dl=0');
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
            'Fake Generator': 'Fake Generator',
            'Group': 'Group',
            'Attacks per Button': 'Attacks per Button',
            'There was an error!': 'There was an error!',
            'Calculate Fakes': 'Calculate Fakes',
            'Insert target coordinates here': 'Insert target coordinates here',
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
        // const scriptInfo = twSDK.scriptInfo();
        const isValidScreen = twSDK.checkValidLocation('screen');
        const isValidMode = twSDK.checkValidLocation('mode');

        const { worldConfig } = twSDK.getWorldConfig();

        // Entry point
        (async function () {
            try {
                // Check that we are on the correct screen and mode
                if (!isValidScreen && !isValidMode) {
                    // Redirect to correct screen if necessary
                    UI.InfoMessage(twSDK.tt('Redirecting...'));
                    twSDK.redirectTo('overview_villages&combined');
                }
                renderUI();
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
					<label>${twSDK.tt('Attacks per Button')}</label>
					<input id="raAttackPerButton" type="text" value="1">
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
			.ra-fake-generator .btn-confirm-yes { padding: 3px; }

			${mobiledevice ? '.ra-fake-generator { margin: 5px; border-radius: 10px; } .ra-fake-generator h2 { margin: 0 0 10px 0; font-size: 18px; } .ra-fake-generator .ra-grid { grid-template-columns: 1fr } .ra-fake-generator .ra-grid > div { margin-bottom: 15px; } .ra-fake-generator .btn { margin-bottom: 8px; margin-right: 8px; } .ra-fake-generator select { height: auto; } .ra-fake-generator input[type="text"] { height: auto; } .ra-hide-on-mobile { display: none; }' : '.ra-fake-generator .ra-grid { display: grid; grid-template-columns: 150px 1fr 100px 150px 150px; grid-gap: 0 20px; }'}

			/* Normal Table */
			.ra-table { border-collapse: separate !important; border-spacing: 2px !important; }
			.ra-table label,
			.ra-table input { cursor: pointer; margin: 0; }
			.ra-table th { font-size: 14px; }
			.ra-table th,
            .ra-table td { padding: 4px; text-align: center; }
            .ra-table td a { word-break: break-all; }
			.ra-table tr:nth-of-type(2n+1) td { background-color: #fff5da; }
			.ra-table a:focus:not(a.btn) { color: blue; }
			/* Popup Content */
			.ra-popup-content { position: relative; display: block; width: 360px; }
			.ra-popup-content * { box-sizing: border-box; }
			.ra-popup-content label { font-weight: 600 !important; margin-bottom: 5px; display: block; }
			.ra-popup-content textarea { width: 100%; height: 100px; resize: none; }
			/* Helpers */
			.ra-mb15 { margin-bottom: 15px; }
			.ra-mb30 { margin-bottom: 30px; }
			.ra-chosen-command td { background-color: #ffe563 !important; }
			.ra-text-left { text-align: left !important; }
			.ra-text-center { text-align: center !important; }
			.ra-unit-count { display: inline-block; margin-top: 3px; vertical-align: top; }
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

        // Helper: Render groups filter
        function renderGroupsFilter() {
            const groups = fetchVillageGroups();
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
                console.error(`${scriptInfo()} Error:`, error);
            }
            );

            return villageGroups;
        }
    }
);