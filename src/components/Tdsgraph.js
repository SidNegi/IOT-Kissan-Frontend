import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

class CustomLineChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.fetchData();
    // Refresh data
    this.interval = setInterval(this.fetchData, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchData = () => {
    fetch('https://api.thingspeak.com/channels/2474084/feeds.json?results=100n')
      .then(response => response.json())
      .then(data => {
        // Extract TDS data from the response (field3)
        const tdsData = data.feeds.map(feed => ({
          time: new Date(feed.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tds: parseFloat(feed.field3), // Extract TDS data from field3
        }));
        // console.log('Fetched data:', tdsData); // Log fetched data to console
        this.setState({ data: tdsData });
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  render() {
    const { chartWidth, chartHeight, chartMargin } = this.props;

    return (
      <ResponsiveContainer width={chartWidth} height={chartHeight}>
        <AreaChart
          data={this.state.data}
          margin={chartMargin}
        >
          <CartesianGrid strokeDasharray="1 1" strokeOpacity={0.5} />
          <XAxis dataKey="time" label={{ value: 'Time', position: 'insideBottom', offset: -10 }} />
          <YAxis
            label={{ value: 'TDS', angle: -90, position: 'insideLeft', offset: -10 }}
            domain={[0, 1500]} // Set the domain to [0, 1500]
            ticks={[...Array(61).keys()].map(val => val * 25)} // Generate ticks from 0 to 1500 with interval of 25
            />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="tds" stroke="#8884d8" fill="url(#colorGradient)" />
          {/* Define gradient */}
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="black" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="black" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}

CustomLineChart.defaultProps = {
  chartWidth: 1000,
  chartHeight: 315,
  chartMargin: {
    top: 30,
    right: 30,
    left: 20,
    bottom: 5,
  },
};

export default CustomLineChart;