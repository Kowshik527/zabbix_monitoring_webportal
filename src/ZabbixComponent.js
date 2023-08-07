import React, { useState, useEffect } from 'react';
import ZabbixApiClient from './api/zabbix';

const ZabbixComponent = () => {
  const [version, setVersion] = useState('');
  const [otherData, setOtherData] = useState('');

  useEffect(() => {
    const zabbixUrl = 'http://172.17.219.201/zabbix/api_jsonrpc.php';
    const username = 'Admin';
    const password = 'zabbix';

    const fetchZabbixData = async () => {
      const zabbix = new ZabbixApiClient(zabbixUrl, username, password);

      try {
        await zabbix.authenticate();

        const versionData = await zabbix.makeRequest('problem.get', {});
        setVersion(versionData);

        const otherData = await zabbix.makeRequest('host.get', {});
        setOtherData(otherData);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchZabbixData();
  }, []);

  return (
    <div style={styles.container}>
      {/* <h1 style={styles.heading}>Zabbix Problem Monitoring</h1> */}
      <div style={styles.dataContainer}>
        <div style={styles.dataSection}>
          <h2 style={styles.sectionHeading}>Problem Monitoring</h2>
          <ul style={styles.dataList}>
            {version &&
              Object.entries(version).map(([key, value]) => (
                <li key={key} style={styles.listItem}>
                  <strong>{key}</strong>: {JSON.stringify(value)}
                </li>
              ))}
          </ul>
        </div>
        <div style={styles.dataSection}>
          <h2 style={styles.sectionHeading}>Host Data</h2>
          <ul style={styles.dataList}>
            {otherData &&
              Object.entries(otherData).map(([key, value]) => (
                <li key={key} style={styles.listItem}>
                  <strong>{key}</strong>: {JSON.stringify(value)}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '80%',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
  },
  dataContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '20px',
  },
  dataSection: {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sectionHeading: {
    textAlign: 'center',
    marginBottom: '10px',
    color: '#333',
  },
  dataList: {
    listStyleType: 'none',
    padding: '0',
  },
  listItem: {
    marginBottom: '8px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '8px',
  },
};

export default ZabbixComponent;
