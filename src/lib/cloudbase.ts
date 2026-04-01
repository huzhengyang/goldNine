import cloudbase from "@cloudbase/js-sdk";

// CloudBase 初始化
const app = cloudbase.init({
  env: process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID || "",
});

export const auth = app.auth();
export const db = app.database();
export const storage = app.uploadFile();
export const functions = app.functions();

export default app;
