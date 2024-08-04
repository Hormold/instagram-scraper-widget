import axios, { AxiosRequestConfig, Method } from "axios";
import { HttpsProxyAgent } from "hpagent";

type ResponseType = "json" | "text" | "blob" | "arraybuffer";

interface AdvancedAxiosOptions
  extends Omit<AxiosRequestConfig, "method" | "responseType"> {
  method?: Method;
  responseType?: ResponseType;
  proxy?: {
    host: string;
    port: number;
    auth?: {
      username: string;
      password: string;
    };
  };
}

/**
 * Advanced Axios function with additional features including HTTP proxy support
 * @param url The URL to fetch from
 * @param options Advanced options for the Axios request
 * @returns Promise resolving to the processed response data and headers
 */
export const advancedFetch = async <T = any>(
  url: string,
  proxy: string,
  options: AdvancedAxiosOptions = {}
): Promise<{ data: T; headers: AxiosRequestConfig["headers"] }> => {
  const {
    method = "GET",
    headers = {},
    data,
    timeout = 10000,
    responseType = "json",
    ...restOptions
  } = options;

  // Prepare Axios config
  const config: AxiosRequestConfig = {
    url,
    method,
    headers,
    data,
    timeout,
    responseType,
    httpsAgent: new HttpsProxyAgent({ proxy }),
    ...restOptions,
  };

  try {
    const response = await axios(config);
    return {
      data: response.data,
      headers: response.headers,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`HTTP error! status: ${error.response.status}`);
    }
    throw error;
  }
};

export function extractKeyValuePairs(
  cookieString: string
): Record<string, string> {
  const pairs = cookieString.split(/,\s(?=[^;]+=[^;]+)/);
  const result: Record<string, string> = {};

  for (const pair of pairs) {
    const [keyValue] = pair.split(/;\s/);
    const [key, ...valueParts] = keyValue.split("=");
    const value = valueParts.join("="); // Rejoin in case the value contains '='
    if (key) result[key.trim()] = value.trim();
  }

  return result;
}
