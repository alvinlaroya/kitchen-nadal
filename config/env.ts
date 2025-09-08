
const ENV = {
  dev: {
    API_ENDPOINT: 'https://dummyjson.com/recipes',
  },
  prod: {
    API_ENDPOINT: 'https://dummyjson.com/recipes',
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  }
  return ENV.prod;
};

export default getEnvVars();
