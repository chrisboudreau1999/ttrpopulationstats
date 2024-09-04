import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PopulationData = () => {
  const [populationData, setPopulationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchCount, setFetchCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const timestamp = new Date().getTime();
      const response = await axios.get(`https://www.toontownrewritten.com/api/population?ts=${timestamp}`, {
        headers: {
          'User-Agent': 'ttr population analysis (https://github.com/chrisboudreau1999/ttrpopulationstats)'
        }
      });
      setPopulationData(response.data);
      await axios.post('http://localhost:5000/api/savePopulation', response.data);
      setFetchCount(prevCount => prevCount + 1); 
    } catch (error) {
      console.error('Error fetching population data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const now = new Date();
    const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    const msUntilNextHour = nextHour - now;

    const timeoutId = setTimeout(() => {
      fetchData();
      const intervalId = setInterval(fetchData, 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, msUntilNextHour);
    return () => clearTimeout(timeoutId);
  }, []);

  const {
    lastUpdated,
    totalPopulation,
    populationByDistrict,
    statusByDistrict
  } = populationData || {};

  return (
    <div>
      <h2>Toontown Rewritten Population Data</h2>
      <button onClick={fetchData}>Fetch Population Data</button>
      <p>Fetch Count: {fetchCount}</p> {}
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {populationData && (
        <>
          <p>Last Updated: {new Date(lastUpdated * 1000).toLocaleString()}</p>
          <p>Total Population: {totalPopulation}</p>

          <h3>Population by District:</h3>
          <ul>
            {Object.keys(populationByDistrict).map(district => (
              <li key={district}>
                {district}: {populationByDistrict[district]}
                {statusByDistrict[district] === 'online' ? ' (Online)' : ' (Offline)'}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default PopulationData;
