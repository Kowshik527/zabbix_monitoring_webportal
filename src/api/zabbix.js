import axios from 'axios';

class ZabbixApiClient {
  constructor(url, username, password) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.authToken = null;
  }

  async authenticate() {
    try {
      const response = await axios.post(this.url, {
        jsonrpc: '2.0',
        method: 'user.login',
        params: {
          username: this.username,
          password: this.password,
        },
        id: 1,
      },{
        headers: {
          'Content-Type': 'application/json-rpc',
        },
      }
    );

      if (response.data.result) {
        this.authToken = response.data.result;
        console.log('Authenticated successfully.');
      } else {
        throw new Error('Authentication failed.');
      }
    } catch (error) {
      throw new Error(`Failed to authenticate: ${error.message}`);
    }
  }

  async makeRequest(method, params) {
    try {
      const response = await axios.post(this.url, {
        jsonrpc: '2.0',
        method: method,
        params: params,
        auth: this.authToken,
        id: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json-rpc',
        },
      }
    );
      console.log(response.data.result[0])
      return response.data.result[0]; 
    } catch (error) {
      throw new Error(`API request failed: ${error.message}`);
    }
  }
}

export default ZabbixApiClient;
