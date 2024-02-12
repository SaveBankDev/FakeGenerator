// __tests__/renderGroupsFilter.test.js
const { JSDOM } = require('jsdom');
const { renderGroupsFilter } = require('../src/your-code'); // Make sure to adjust the path

describe('renderGroupsFilter function', () => {
    test('renders the groups filter correctly', () => {
        // Mock localStorage
        Object.defineProperty(global, 'localStorage', {
            value: {
                getItem: jest.fn(() => '1'), // Assuming group_id is '1'
            },
            writable: true,
        });

        // Mock groups result
        const groupsResult = {
            '1': { group_id: 1, name: 'Group 1' },
            '2': { group_id: 2, name: 'Group 2' },
        };

        // Mock groups module
        jest.mock('../src/your-groups-module', () => ({ result: groupsResult }));

        // Set up the DOM
        const dom = new JSDOM();
        global.document = dom.window.document;

        // Render the groups filter
        const groupsFilter = renderGroupsFilter();

        // Expectations
        expect(groupsFilter).toContain('<option value="1" selected>Group 1</option>');
        expect(groupsFilter).toContain('<option value="2">Group 2</option>');
    });
});
