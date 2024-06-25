import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PopulationData = () => {
  const [populationData, setPopulationData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await axios.get(`https://www.toontownrewritten.com/api/population?ts=${timestamp}`);
        setPopulationData(response.data);
      } catch (error) {
        console.error('Error fetching population data:', error);
      }
    };
  
    fetchData();
  }, []);

  if (!populationData) {
    return <div>Loading...</div>;
  }

  const {
    lastUpdated,
    totalPopulation,
    populationByDistrict,
    statusByDistrict
  } = populationData;

  return (
    <div>
      <h2>Toontown Rewritten Population Data</h2>
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
    </div>
  );
};

export default PopulationData;
