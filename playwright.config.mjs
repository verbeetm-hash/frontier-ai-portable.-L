import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests',testMatch:'frontier-cloudflare.spec.mjs',
 timeout:200000,retries:1,workers:1,
 use:{browserName:'chromium',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'},
 reporter:[['list'],['html',{open:'never',outputFolder:'playwright-report'}]]
});
