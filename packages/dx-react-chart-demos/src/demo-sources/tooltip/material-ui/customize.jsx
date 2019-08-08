import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  BarSeries,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { EventTracker } from '@devexpress/dx-react-chart';

const data = [
  { year: '1950', value: 2.525 },
  { year: '1960', value: 3.018 },
  { year: '1970', value: -3.682 },
  { year: '1980', value: 4.440 },
  { year: '1990', value: 5.310 },
  { year: '2000', value: -6.127 },
  { year: '2010', value: 6.930 },
];
const SheetBase = ({ classes, ...restProps }) => (
  <Tooltip.Sheet {...restProps} className={classes.sheet} />
);
const Sheet = withStyles({
  sheet: {
    background: '#17a2b8',
    border: '1px solid #343a40',
  },
})(SheetBase);

const Overlay = value => (props) => {
  const placement = value < 0 ? 'left' : 'right';
  const style = value < 0 ? { marginRight: 9 } : {};
  return (
    <Tooltip.Overlay {...props} placement={placement} style={style} />
  );
};

const ArrowBase = value => ({ classes, ...restProps }) => {
  const className = value > 0 ? classes.right : classes.left;
  return (
    <Tooltip.Arrow {...restProps} className={className} />
  );
};
const Arrow = value => withStyles({
  right: {
    '&::after': {
      background: '#17a2b8',
      border: '1px solid #343a40',
    },
  },
  left: {
    left: '135%',
    '&::after': {
      background: '#17a2b8',
      border: '1px solid #343a40',
      left: 0,
    },
  },
})(ArrowBase(value));

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data,
      value: null,
    };

    this.onChange = (target) => {
      if (target) {
        this.setState({ value: data[target.point].value });
      }
    };
  }

  render() {
    const { data: chartData, value } = this.state;

    return (
      <Paper>
        <Chart
          data={chartData}
          rotated
        >
          <ArgumentAxis />
          <ValueAxis />

          <BarSeries
            valueField="value"
            argumentField="year"
          />
          <EventTracker />
          <Tooltip
            sheetComponent={Sheet}
            overlayComponent={Overlay(value)}
            arrowComponent={Arrow(value)}
            onTargetItemChange={this.onChange}
          />
        </Chart>
      </Paper>
    );
  }
}
