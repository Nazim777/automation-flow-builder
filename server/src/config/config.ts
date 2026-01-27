interface Config {
  MONGO_URI: string;
  PORT: number | string;
  EMAIL_PASS:string;
  EMAIL_USER:string;
  
}

const config: Record<string, Config> = {
  production: {
    MONGO_URI: process.env.MONGO_URI || "",
    PORT: process.env.PORT || "",
    EMAIL_PASS: process.env.EMAIL_PASS || "",
    EMAIL_USER: process.env.EMAIL_USER || ""
  },
  default: {
    MONGO_URI: "mongodb://localhost:27017/automation",
    PORT: 5000,
    EMAIL_PASS:'1234',
    EMAIL_USER:'user@gmail.com'
  },
};

export const getConfig = (env: string): Config => {
  return config[env] || config.default;
};