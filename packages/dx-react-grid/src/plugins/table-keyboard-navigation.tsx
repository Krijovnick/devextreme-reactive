import * as React from 'react';
import {
 Plugin, TemplateConnector, Getter,
} from '@devexpress/dx-react-core';
import { TABLE_HEADING_TYPE, TABLE_BAND_TYPE, 
  getNextFocusedElement, applyEnterAction, applyEscapeAction } from '@devexpress/dx-grid-core';
import { KeyboardNavigationProps, KeyboardNavigationState } from '../types';

class TableKeyboardNavigationBase extends React.PureComponent<KeyboardNavigationProps, KeyboardNavigationState> {
  elements: any[][] = [];
  tableColumns = [];
  tableBodyRows = [];

  constructor(props) {
    super(props);

    const focusedCell = props.focusedCell || props.defaultFocusedCell;

    this.state = {
      focusedElement: focusedCell ? { part: 'body', index: 0, ...focusedCell } : focusedCell
    }
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  pushRef(ref, key1, key2) {
    const { focusedElement } = this.state;
    if(!this.elements[key1]) {
      this.elements[key1] = [];
    }
    if(!this.elements[key1][key2]) {
      this.elements[key1][key2] = [];
    }
    if(key1 !== 'toolbar' && key1 !== 'paging') { 
      this.elements[key1][key2].push(ref);
    }
    const innerElements = ref.current.querySelectorAll('[tabIndex], input');
    innerElements.forEach(el => {
      this.elements[key1][key2].push(el);
    });

    if(focusedElement && focusedElement.rowKey === key1 && focusedElement.columnKey === key2) {
      this.focus(this.state.focusedElement);
    }
  }

  setRef(ref, key1, key2) {
    if(key1.toString().includes(TABLE_BAND_TYPE.toString())) {
      this.pushRef(ref, TABLE_HEADING_TYPE.toString(), key2);
    } else {
      this.pushRef(ref, key1, key2);
    }
  }

  componentDidMount() {
    this.setupNodeSubscription();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.focusedElement !== this.state.focusedElement) {
      this.focus(this.state.focusedElement);
    }
  }

  setupNodeSubscription() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  static getDerivedStateFromProps(props: KeyboardNavigationProps, state: KeyboardNavigationState): KeyboardNavigationState {
    const focusedCell = props.focusedCell !== undefined ? props.focusedCell : state.focusedElement;
    return {
      focusedElement: focusedCell ? {
        part: 'body',
        index: 0,
        ...focusedCell
      } : focusedCell
    }
  }

  handleKeyDown(event) {
    const { focusedElement } = this.state;
    let nextFocusedElement;

    if(event.key === "Enter") {
      nextFocusedElement = applyEnterAction(this.elements, focusedElement);
    } else if(event.key === "Escape") {
      nextFocusedElement = applyEscapeAction(this.elements, focusedElement);
    } else {
      nextFocusedElement = getNextFocusedElement(this.tableColumns, this.tableBodyRows,
        this.elements, event.key, event.shiftKey, focusedElement);
    }
    if(nextFocusedElement) {      
      if(event.key === 'Tab') {
        event.preventDefault();
      }
      this.setState({
        focusedElement: nextFocusedElement
      });
    }
  }

  focus(element) {
    const { onFocusedCellChanged } = this.props;
    if(!element || !this.elements[element.rowKey] || !this.elements[element.rowKey][element.columnKey]) {
      return;
    }
    const el = this.elements[element.rowKey][element.columnKey][element.index];
    if(el) {
      if(el.focus) {
        el.focus();
      } else {
        el.current.focus();
      }
      if(onFocusedCellChanged && element.part !== 'paging' && element.part !== 'toolbar') {
        onFocusedCellChanged({ rowKey: element.rowKey, columnKey: element.columnKey });
      }
    }
  }
  
  render() {
    return (
      <Plugin
        name="TableKeyboardNavigation"
      >
        <Getter name="keyboardNavigationParams" value={{
          tabIndex: -1,
          setRefForKeyboardNavigation: this.setRef.bind(this)
        }} />
        <TemplateConnector>
        {({ tableColumns, tableBodyRows }) => {
            this.tableColumns = tableColumns;
            this.tableBodyRows = tableBodyRows;
            return null;
          }}
          </TemplateConnector>
      </Plugin>
    );
  }
}

export const TableKeyboardNavigation: React.ComponentType<any> = TableKeyboardNavigationBase;