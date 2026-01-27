interface Config {
  MONGO_URI: string;
  PORT: number | string;
  MAILTRAP_PASS:string;
  MAILTRAP_USER:string;
  
}

const config: Record<string, Config> = {
  production: {
    MONGO_URI: process.env.MONGO_URI || "",
    PORT: process.env.PORT || "",
    MAILTRAP_PASS:process.env.MAILTRAP_PASS || "",
    MAILTRAP_USER:process.env.MAILTRAP_USER || ""
  },
  default: {
    MONGO_URI: "mongodb://localhost:27017/automation",
    PORT: 5000,
    MAILTRAP_USER:'user',
    MAILTRAP_PASS:'1234'
  },
};

export const getConfig = (env: string): Config => {
  return config[env] || config.default;
};