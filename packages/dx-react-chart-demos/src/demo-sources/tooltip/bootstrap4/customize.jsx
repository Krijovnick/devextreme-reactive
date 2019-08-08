import * as React from 'react';
import {
  Chart,
  BarSeries,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
} from '@devexpress/dx-react-chart-bootstrap4';
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

const Sheet = props => (
  <Tooltip.Sheet {...props} className="bg-info border border-dark" />
);

const Overlay = (props) => {
  const placement = props.children.props.children.props.text < 0 ? 'left' : 'right';
  return (
    <Tooltip.Overlay {...props} placement={placement} />
  );
};

const ArrowBase = React.forwardRef(({ classes, ...restProps }, ref) => (
  <Tooltip.Arrow {...restProps} ref={ref} className={classes.arrow} />
));

const Arrow = withStyles({
  arrow: {
    '&::after': { borderRightColor: '#17a2b8!important', borderLeftColor: '#17a2b8!important' },
    '&::before': { borderRightColor: '#343a40!important', borderLeftColor: '#343a40!important' },
  },
})(ArrowBase);

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data,
    };
  }

  render() {
    const { data: chartData } = this.state;

    return (
      <div className="card">
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
          <Tooltip sheetComponent={Sheet} overlayComponent={Overlay} arrowComponent={Arrow} />
        </Chart>
      </div>
    );
  }
}
