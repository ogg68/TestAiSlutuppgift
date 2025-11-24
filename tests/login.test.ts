import { expect, test } from '@playwright/test';
import { LoginPage } from "../pages/loginPage";

let password: string;

test('Succesful Login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    if (process.env.STORE_PASSWORD !== undefined){
        password = process.env.STORE_PASSWORD;
    }
    console.log("PWD:", password);
    await loginPage.login('joe', password, "Consumer");
    
    //await loginPage.assertSuccessfulLogin();
    await expect(page).toHaveURL("/store2/");
  });