import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'clsx';
import ToolbarMUI from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import { getBorder } from '../utils';
import { withKeyboardNavigation } from '@devexpress/dx-react-grid';

const styles = theme => ({
  toolbar: {
    borderBottom: getBorder(theme),
    flex: 'none',
  },
});

const ToolbarBase = ({
  children, classes, className, style, refObject, updateRefForKeyboardNavigation, setFocusedElement, ...restProps
}) => (
  <ToolbarMUI
    style={style}
    className={classNames(classes.toolbar, className)}
    ref={refObject}
    {...restProps}
  >
    {children}
  </ToolbarMUI>
);

ToolbarBase.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

ToolbarBase.defaultProps = {
  className: undefined,
  style: null,
};

export const Toolbar = withKeyboardNavigation('toolbar', 'none')(withStyles(styles, { name: 'Toolbar' })(ToolbarBase));
