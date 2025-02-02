import fs from 'fs';
import path from 'path';
import toml from '@iarna/toml';

const configFileName = 'config.toml';

interface Config {
  GENERAL: {
    PORT: number;
    SIMILARITY_MEASURE: string;
    KEEP_ALIVE: string;
  };
  API_KEYS: {
    OPENAI: string;
    GROQ: string;
    ANTHROPIC: string;
    GEMINI: string;
  };
  API_ENDPOINTS: {  
    OLLAMA: string;
    LMSTUDIO: string;
    SEARXNG: string;
  };
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const loadConfig = () =>
  toml.parse(
    fs.readFileSync(path.join(__dirname, `../${configFileName}`), 'utf-8'),
  ) as any as Config;

export const getPort = () => loadConfig().GENERAL.PORT;

export const getSimilarityMeasure = () =>
  loadConfig().GENERAL.SIMILARITY_MEASURE;

export const getKeepAlive = () => loadConfig().GENERAL.KEEP_ALIVE;

export const getOpenaiApiKey = () => loadConfig().API_KEYS.OPENAI;

export const getGroqApiKey = () => loadConfig().API_KEYS.GROQ;

export const getAnthropicApiKey = () => loadConfig().API_KEYS.ANTHROPIC;

export const getGeminiApiKey = () => loadConfig().API_KEYS.GEMINI;

export const getSearxngApiEndpoint = () =>
  process.env.SEARXNG_API_URL || loadConfig().API_ENDPOINTS.SEARXNG;

export const getOllamaApiEndpoint = () => loadConfig().API_ENDPOINTS.OLLAMA;

export const getLMStudioApiEndpoint = () => loadConfig().API_ENDPOINTS.LMSTUDIO;

export const updateConfig = (config: RecursivePartial<Config>) => {
  const currentConfig = loadConfig();

  for (const key in currentConfig) {
    if (!config[key]) config[key] = {};

    if (typeof currentConfig[key] === 'object' && currentConfig[key] !== null) {
      for (const nestedKey in currentConfig[key]) {
        if (
          !config[key][nestedKey] &&
          currentConfig[key][nestedKey] &&
          config[key][nestedKey] !== ''
        ) {
          config[key][nestedKey] = currentConfig[key][nestedKey];
        }
      }
    } else if (currentConfig[key] && config[key] !== '') {
      config[key] = currentConfig[key];
    }
  }

  /*
export const updateConfig = (config: RecursivePartial<Config>) => {
  const currentConfig = loadConfig();

  // Merge existing config with new values
  const mergedConfig: RecursivePartial<Config> = {
    GENERAL: {
      ...currentConfig.GENERAL,
      ...config.GENERAL,
    },
    API_KEYS: {
      ...currentConfig.API_KEYS,
      ...config.API_KEYS,
    },
    API_ENDPOINTS: {
      ...currentConfig.API_ENDPOINTS,
      ...config.API_ENDPOINTS,
    },
  };
*/

  fs.writeFileSync(
    path.join(__dirname, `../${configFileName}`),
    toml.stringify(config),
  );
};
