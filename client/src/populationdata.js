import React, { useState } from 'react';
import axios from 'axios';

const PopulationData = () => {
  const [populationData, setPopulationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const timestamp = new Date().getTime();
      const response = await axios.get(`https://www.toontownrewritten.com/api/population?ts=${timestamp}`,{
        headers: {
          'User-Agent': 'ttr population analysis (https://github.com/chrisboudreau1999/ttrpopulationstats)'
        }
      }
      );
      setPopulationData(response.data);

      // Send the fetched data to the backend server
      await axios.post('http://localhost:5000/api/savePopulation', response.data);
    } catch (error) {
      console.error('Error fetching population data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
