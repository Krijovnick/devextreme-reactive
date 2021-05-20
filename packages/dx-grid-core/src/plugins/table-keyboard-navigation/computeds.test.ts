import { TABLE_FILTER_TYPE, TABLE_HEADING_TYPE } from '@devexpress/dx-grid-core';
import { getNextFocusedElement, applyEnterAction, applyEscapeAction } from './computeds';

const generateElements = (tableColumns, tableBodyRows, extraParts, tagName?, click?) => {
    const elements = extraParts.reduce((prev, p) => {
        prev[p] = [];
        if(p === 'toolbar' || p === 'paging') {
            prev[p]['none'] = [{}, {}, {}];
        } else {
            if(!tagName) {
                tableColumns.forEach((c) => {
                    prev[p][c.key] = [{}, {}];
                });
            } else {
                tableColumns.forEach((c) => {
                    prev[p][c.key] = [{}, { tagName: tagName, click: click }];
                });
            }
        }
        return prev;
    }, []);
    tableBodyRows.forEach((r) => {
        elements[r.key] = [];
        if(!tagName) {
            tableColumns.forEach((c) => {
                elements[r.key][c.key] = [{}, {}];
            });
        } else {
            tableColumns.forEach((c) => {
                elements[r.key][c.key] = [{}, { tagName: tagName, click: click }];
            });
        }
    });
    return elements;
};
const tableColumns = [
    { key: 'test_column_1' },
    { key: 'test_column_2' }, 
    { key: 'test_column_3' },
    { key: 'test_column_4' }
] as any;
const tableBodyRows = [
    { key: 'test_row_1' },
    { key: 'test_row_2' },
    { key: 'test_row_3' }
] as any;

describe("No focused element", () => {
    const key = 'Tab';
    const shiftKey = false;
    it('should return element from toolbar', () => {
        const elements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar', TABLE_FILTER_TYPE.toString(), TABLE_HEADING_TYPE.toString()]);
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, shiftKey);
        expect(element).toEqual({
            rowKey: 'toolbar',
            columnKey: 'none',
            index: 0,
            part: 'toolbar'
        });
    });

    it('should return cell from header', () => {
        const header = TABLE_HEADING_TYPE.toString();
        const elements = generateElements(tableColumns, tableBodyRows, 
            [TABLE_FILTER_TYPE.toString(), header]);
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, shiftKey);
        expect(element).toEqual({
            rowKey: header,
            columnKey: 'test_column_1',
            index: 0,
            part: header
        });
    });

    it('should not be errors if there is no elements', () => {
        const element = getNextFocusedElement(tableColumns, tableBodyRows, [], key, shiftKey);
        expect(element).toBe(undefined);
    });

    it('should not return element if key pressed is not tab', () => {
        const elements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar', TABLE_FILTER_TYPE.toString(), TABLE_HEADING_TYPE.toString()]);
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'Enter', shiftKey);
        expect(element).toBe(undefined);
    });
});

describe("Focused element in the toolbar", () => {
    const focusedElement = {
        rowKey: 'toolbar',
        columnKey: 'none',
        index: 1,
        part: 'toolbar',
    };
    const key = 'Tab';
    const shiftKey = false;

    it('should return next element, tab key pressed', () => {
        const elements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar', TABLE_FILTER_TYPE.toString(), TABLE_HEADING_TYPE.toString()]);
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: 'toolbar',
            columnKey: 'none',
            index: 2,
            part: 'toolbar'
        });
    });

    it('should return prev element, tab + shift key pressed', () => {
        const elements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar', TABLE_FILTER_TYPE.toString(), TABLE_HEADING_TYPE.toString()]);
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, true, focusedElement);
        expect(element).toEqual({
            rowKey: 'toolbar',
            columnKey: 'none',
            index: 0,
            part: 'toolbar'
        });
    });

    it('should not return element, arrow left key', () => {
        const elements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar', TABLE_FILTER_TYPE.toString(), TABLE_HEADING_TYPE.toString()]);
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'ArrowLeft', shiftKey, focusedElement);
        expect(element).toBe(undefined);
    });

    it('should return cell from header, focused element is last element in the toolbar', () => {
        const focusedElement = {
            rowKey: 'toolbar',
            columnKey: 'none',
            index: 2,
            part: 'toolbar',
        };
        const header = TABLE_HEADING_TYPE.toString();
        const elements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar', TABLE_FILTER_TYPE.toString(), header]);
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: header,
            columnKey: 'test_column_1',
            index: 1,
            part: header
        });
    });
});

describe('Focused element in the header', () => {
    const header = TABLE_HEADING_TYPE.toString();
    const key = 'Tab';
    const shiftKey = false;
    const elements = generateElements(tableColumns, tableBodyRows, 
        ['paging', 'toolbar', TABLE_FILTER_TYPE.toString(), header]);

    it('should return next element in the cell, tab key pressed', () => {
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_2',
            index: 0,
            part: header,
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: header,
            columnKey: 'test_column_2',
            index: 1,
            part: header
        });
    });

    it('should return prev element in the cell, tab + shift key pressed', () => {
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_2',
            index: 1,
            part: header,
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, true, focusedElement);
        expect(element).toEqual({
            rowKey: header,
            columnKey: 'test_column_1',
            index: 1,
            part: header
        });
    });

    it('should return next cell, tab key pressed', () => {
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_2',
            index: 1,
            part: header,
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: header,
            columnKey: 'test_column_3',
            index: 0,
            part: header
        });
    });

    it('should return prev cell, tab + shift pressed', () => {
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_2',
            index: 0,
            part: header,
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, true, focusedElement);
        expect(element).toEqual({
            rowKey: header,
            columnKey: 'test_column_1',
            index: 1,
            part: header
        });
    });

    it('should return first cell from filter, tab key pressed', () => {
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_4',
            index: 1,
            part: header,
        };
        const filter = TABLE_FILTER_TYPE.toString();
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: filter,
            columnKey: 'test_column_1',
            index: 1,
            part: filter
        });
    });

    it('should return last cell from toolbar, tab + shift pressed', () => {
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_1',
            index: 0,
            part: header,
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, true, focusedElement);
        expect(element).toEqual({
            rowKey: 'toolbar',
            columnKey: 'none',
            index: 2,
            part: 'toolbar'
        });
    });

    it('should return prev cell, arrow left key pressed', () => {
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_2',
            index: 0,
            part: header,
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'ArrowLeft', shiftKey, focusedElement);
        expect(element).toEqual(undefined);
    });

    it('should not return cell, arrow up key pressed', () => {
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_2',
            index: 1,
            part: header,
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'ArrowUp', shiftKey, focusedElement);
        expect(element).toBe(undefined);
    });

    it('should not return cell, some another key pressed', () => {
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_2',
            index: 1,
            part: header,
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'SomeKey', shiftKey, focusedElement);
        expect(element).toBe(undefined);
    });

    it('should return cell from filter, tab key pressed, cell contains input component', () => {
        const filter = TABLE_FILTER_TYPE.toString();
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar', filter, header], "INPUT");
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_4',
            index: 0,
            part: header,
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, generatedElements, 'Tab', shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: filter,
            columnKey: 'test_column_1',
            index: 0,
            part: filter
        });
    });

    it('should return cell from filter, tab key pressed, cell contain span component', () => {
        const filter = TABLE_FILTER_TYPE.toString();
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar', filter, header], "SPAN");
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_4',
            index: 0,
            part: header,
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, generatedElements, 'Tab', shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: filter,
            columnKey: 'test_column_1',
            index: 0,
            part: filter
        });
    });

    it('should return next cell, tab key pressed, cell containes input component', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar', header], "INPUT");
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_2',
            index: 0,
            part: header,
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, generatedElements, 'Tab', shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: header,
            columnKey: 'test_column_3',
            index: 0,
            part: header
        });
    });

    it('should return prev cell, tab + shift key pressed, cell containes input component', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar', header], "INPUT");
        const focusedElement = {
            rowKey: header,
            columnKey: 'test_column_2',
            index: 0,
            part: header,
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, generatedElements, 'Tab', true, focusedElement);
        expect(element).toEqual({
            rowKey: header,
            columnKey: 'test_column_1',
            index: 0,
            part: header
        });
    });
});

describe('Focused element in the body of table', () => {
    const shiftKey = false;
    const elements = generateElements(tableColumns, tableBodyRows, 
        ['paging', 'toolbar', TABLE_FILTER_TYPE.toString(), TABLE_HEADING_TYPE.toString()]);
    it('should return next element in the cell, tab key pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'Tab', shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 1,
            part: 'body'
        });
    });

    it('should return prev cell, tab + shift key pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 1,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'Tab', true, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_2',
            columnKey: 'test_column_1',
            index: 1,
            part: 'body'
        });
    });

    it('should return next cell, tab key pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 1,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'Tab', shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_2',
            columnKey: 'test_column_3',
            index: 1,
            part: 'body'
        });
    });

    it('should return prev cell, tab + shift key pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'Tab', true, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_2',
            columnKey: 'test_column_1',
            index: 1,
            part: 'body'
        });
    });

    it('should return last cell from filter, tab + shift key pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_1',
            columnKey: 'test_column_1',
            index: 0,
            part: 'body',
        };
        const filter = TABLE_FILTER_TYPE.toString();
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'Tab', true, focusedElement);
        expect(element).toEqual({
            rowKey: filter,
            columnKey: 'test_column_4',
            index: 1,
            part: filter
        });
    });

    it('should return last cell prev row, tab + shift key pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_1',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'Tab', true, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_1',
            columnKey: 'test_column_4',
            index: 1,
            part: 'body'
        });
    });

    it('should return next elements of last cell', () => {
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_4',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'Tab', shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_2',
            columnKey: 'test_column_4',
            index: 1,
            part: 'body'
        });
    });

    it('should return first element from paging, tab pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_3',
            columnKey: 'test_column_4',
            index: 1,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'Tab', shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: 'paging',
            columnKey: 'none',
            index: 0,
            part: 'paging'
        });
    });

    it('should return next cell, arrow right pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'ArrowRight', shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_2',
            columnKey: 'test_column_3',
            index: 0,
            part: 'body'
        });
    });

    it('should return prev cell, arrow left pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'ArrowLeft', shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_2',
            columnKey: 'test_column_1',
            index: 0,
            part: 'body'
        });
    });

    it('should return cell over current cell, arrow up pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'ArrowUp', shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_1',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body'
        });
    });

    it('should return cell under current cell, arrow down pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'ArrowDown', shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_3',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body'
        });
    });

    it('should not return cell from filter over current cell, arrow up pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_1',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body',
        };
        const filter = TABLE_FILTER_TYPE.toString();
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'ArrowUp', shiftKey, focusedElement);
        expect(element).toEqual(undefined);
    });

    it('should not return element under current cell, under is paging, arrow down pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_3',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'ArrowDown', shiftKey, focusedElement);
        expect(element).toBe(undefined);
    });

    it('should not return element, focused cell is extreme right, arrow right pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_4',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'ArrowRight', shiftKey, focusedElement);
        expect(element).toBe(undefined);
    });

    it('should not return element, focused cell is extreme left, arrow left pressed', () => {
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_1',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, 'ArrowLeft', shiftKey, focusedElement);
        expect(element).toBe(undefined);
    });

    it('should return last cell from header, tab + shift key pressed, cell containes input component', () => {
        const header = TABLE_HEADING_TYPE.toString();
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar', header], "INPUT");
        const focusedElement = {
            rowKey: 'test_row_1',
            columnKey: 'test_column_1',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, generatedElements, 'Tab', true, focusedElement);
        expect(element).toEqual({
            rowKey: header,
            columnKey: 'test_column_4',
            index: 0,
            part: header
        });
    });

    it('should return next cell, tab key pressed, cell containes input component', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar'], "INPUT");
        const focusedElement = {
            rowKey: 'test_row_1',
            columnKey: 'test_column_1',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, generatedElements, 'Tab', shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_1',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body'
        });
    });

    it('should return prev cell, tab + shift key pressed, cell containes input component', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar'], "INPUT");
        const focusedElement = {
            rowKey: 'test_row_1',
            columnKey: 'test_column_3',
            index: 0,
            part: 'body',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, generatedElements, 'Tab', true, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_1',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body'
        });
    });
});

describe('Focused element in the paging', () => {
    const key = 'Tab';
    const shiftKey = false;
    const elements = generateElements(tableColumns, tableBodyRows, 
        ['paging', 'toolbar', TABLE_FILTER_TYPE.toString(), TABLE_HEADING_TYPE.toString()]);
    const focusedElement = {
        rowKey: 'paging',
        columnKey: 'none',
        index: 1,
        part: 'paging',
    };
    it('should return next element, tab pressed', () => {
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, shiftKey, focusedElement);
        expect(element).toEqual({
            rowKey: 'paging',
            columnKey: 'none',
            index: 2,
            part: 'paging',
        });
    });

    it('should return prev element, tab + shift pressed', () => {
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, true, focusedElement);
        expect(element).toEqual({
            rowKey: 'paging',
            columnKey: 'none',
            index: 0,
            part: 'paging',
        });
    });

    it('should return body last cell element, tab + shift pressed', () => {
        const focusedElement = {
            rowKey: 'paging',
            columnKey: 'none',
            index: 0,
            part: 'paging',
        };
        const element = getNextFocusedElement(tableColumns, tableBodyRows, elements, key, true, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_3',
            columnKey: 'test_column_4',
            index: 1,
            part: 'body',
        });
    });
});

describe('Enter action', () => {
    it('should return input from cell on action on cell', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
        ['paging', 'toolbar'], "INPUT");
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body'
        };
        const element = applyEnterAction(generatedElements, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 1,
            part: 'body'
        });
    });

    it('should return cell on enter action on input', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
        ['paging', 'toolbar'], "INPUT");
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 1,
            part: 'body'
        };
        const element = applyEnterAction(generatedElements, focusedElement)
        expect(element).toEqual({
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body'
        });
    });

    it('should return span from cell on action on cell', () => {
        const click = jest.fn();
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
        ['paging', 'toolbar'], "SPAN", click);
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body'
        };
        const element = applyEnterAction(generatedElements, focusedElement);
        expect(element).toEqual({
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 1,
            part: 'body'
        });
        expect(click).toBeCalled();
    });

    it('should not return focused element on action on span', () => {
        const click = jest.fn();
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
        ['paging', 'toolbar'], "SPAN", click);
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 1,
            part: 'body'
        };
        const element = applyEnterAction(generatedElements, focusedElement);
        expect(element).toBe(undefined);
        expect(click).not.toBeCalled();
    });

    it('should not return focused element on action on cell with other elements', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
        ['paging', 'toolbar']);
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 1,
            part: 'body'
        };
        const element = applyEnterAction(generatedElements, focusedElement);
        expect(element).toBe(undefined);
    });

    it('should not return focused element on action on cell, cell empty', () => {
        const generatedElements =  []
        tableBodyRows.forEach((r) => {
            generatedElements[r.key] = [];
                tableColumns.forEach((c) => {
                    generatedElements[r.key][c.key] = [{}];
                });
        });

        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body'
        };
        const element = applyEnterAction(generatedElements, focusedElement);
        expect(element).toBe(undefined);
    });

    it('should not return focused element, current focused element is undefined', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar'], "INPUT");
        const element = applyEnterAction(generatedElements);
        expect(element).toEqual(undefined);
    })
});

describe('Excape action', () => {
    it('should return cell on escape action on input', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
        ['paging', 'toolbar'], "INPUT");
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 1,
            part: 'body'
        };
        const element = applyEscapeAction(generatedElements, focusedElement)
        expect(element).toEqual({
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body'
        });
    });

    it('should not return focused element on escape action on cell', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar'], "INPUT");
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body'
        };
        const element = applyEscapeAction(generatedElements, focusedElement)
        expect(element).toBe(undefined);
    });

    it('should not return focused element on escape action on span', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar'], "SPAN");
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 1,
            part: 'body'
        };
        const element = applyEscapeAction(generatedElements, focusedElement)
        expect(element).toBe(undefined);
    });

    it('should not return focused element on escape action on cell with other elements', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar']);
        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 1,
            part: 'body'
        };
        const element = applyEscapeAction(generatedElements, focusedElement)
        expect(element).toBe(undefined);
    });

    it('should not return focused element on action on cell, cell empty', () => {
        const generatedElements =  []
        tableBodyRows.forEach((r) => {
            generatedElements[r.key] = [];
                tableColumns.forEach((c) => {
                    generatedElements[r.key][c.key] = [{}];
                });
        });

        const focusedElement = {
            rowKey: 'test_row_2',
            columnKey: 'test_column_2',
            index: 0,
            part: 'body'
        };
        const element = applyEscapeAction(generatedElements, focusedElement);
        expect(element).toBe(undefined);
    });

    it('should not return focused element, focusedElement is undefined', () => {
        const generatedElements = generateElements(tableColumns, tableBodyRows, 
            ['paging', 'toolbar'], "INPUT");;
        const element = applyEscapeAction(generatedElements)
        expect(element).toEqual(undefined);
    });
});