const config = {
  webConfig: {
    title: "test",
    copyright: "Copyright"
  },
  dev: {
    baseURL: "/mock"
  },
  prod: {
    baseURL: "/"
  }
};

export const webConfig = config.webConfig;
export default (process.env.NODE_ENV === "production"
  ? config.prod
  : config.dev);
