import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';

export default function PopulationData() {
  const [populationData, setPopulationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchCount, setFetchCount] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const [pData, setPData] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [timeZone, setTimeZone] = useState('America/New_York');

  const timeZones = [
    { label: 'Atlantic Time (AST)', value: 'America/Halifax' },
    { label: 'Eastern Time (EST)', value: 'America/New_York' },
    { label: 'Central Time (CST)', value: 'America/Chicago' },
    { label: 'Mountain Time (MST)', value: 'America/Denver' },
    { label: 'Pacific Time (PST)', value: 'America/Los_Angeles' }
  ];

  const fetchPopulationData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/getPopulation');
      const data = response.data;
      setPopulationData(data);
      setDataCount(data.length); // Set the count of entries
      calculateHourlyAverages(data, timeZone);
    } catch (error) {
      console.error('Error fetching population data:', error);
      setError('Failed to fetch population data.');
    } finally {
      setLoading(false);
    }
  };

  const calculateHourlyAverages = (data, selectedTimeZone) => {
    const hourlyData = {};

    data.forEach(item => {
      const hour = new Date(item.lastUpdated * 1000).toLocaleString('en-US', {
        hour: '2-digit',
        hour12: false,
        timeZone: selectedTimeZone,
      });
      if (!hourlyData[hour]) {
        hourlyData[hour] = { total: 0, count: 0 };
      }
      hourlyData[hour].total += item.totalPopulation;
      hourlyData[hour].count += 1;
    });

    const averages = Object.keys(hourlyData)
      .map(hour => ({
        hour: parseInt(hour), 
        average: Math.round(hourlyData[hour].total / hourlyData[hour].count),
      }))
      .sort((a, b) => a.hour - b.hour);

    setPData(averages.map(item => item.average));
    setXLabels(averages.map(item => `${item.hour}:00`));
  };

  useEffect(() => {
    fetchPopulationData();
  }, [fetchCount, timeZone]);

  const handleTimeZoneChange = (event) => {
    setTimeZone(event.target.value);
    calculateHourlyAverages(populationData, event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Toontown Rewritten Population Data ({dataCount} Entries)
        </h1>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          <div className="w-full lg:w-2/3 flex justify-center">
            {loading && <p className="text-center text-gray-600">Loading...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!loading && !error && (
              <LineChart
                width={500}
                height={300}
                series={[
                  { data: pData, label: 'Average Population' },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
              />
            )}
          </div>
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <label htmlFor="time-zone-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Time Zone:
            </label>
            <select
              id="time-zone-select"
              value={timeZone}
              onChange={handleTimeZoneChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            >
              {timeZones.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
