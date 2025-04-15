
import axios, { AxiosResponse, AxiosError } from 'axios';

interface Callbacks {
  successCallback?: (response: any) => void;
  failureCallback?: (error: any) => void;
  finalCallback?: () => void;
}

const httpBase = {
  baseURL: 'http://localhost:3000/kb',
  
  async request(
    method: string,
    url: string,
    data?: any,
    callbacks?: Callbacks
  ) {
    try {
      const response: AxiosResponse = await axios({
        method,
        url: `${this.baseURL}${url}`,
        data,
      });

      if (callbacks?.successCallback) {
        callbacks.successCallback(response.data);
      }
      
      return response.data;
    } catch (error) {
      if (callbacks?.failureCallback) {
        callbacks.failureCallback(error as AxiosError);
      }
      throw error;
    } finally {
      if (callbacks?.finalCallback) {
        callbacks.finalCallback();
      }
    }
  },

  get(url: string, callbacks?: Callbacks) {
    return this.request('GET', url, undefined, callbacks);
  },

  post(url: string, data: any, callbacks?: Callbacks) {
    return this.request('POST', url, data, callbacks);
  },

  put(url: string, data: any, callbacks?: Callbacks) {
    return this.request('PUT', url, data, callbacks);
  },

  delete(url: string, callbacks?: Callbacks) {
    return this.request('DELETE', url, undefined, callbacks);
  },
};

export default httpBase;
