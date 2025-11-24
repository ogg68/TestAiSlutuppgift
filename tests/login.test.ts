import { expect, test } from '@playwright/test';
import { LoginPage } from "../pages/loginPage";

//Username: any name...
//Password: STORE_PASSWORD from playwright.yml and from Github.com/Settings/Actions secrets/Repo Secret
let password: string;

test("Login Fail wrongPwd", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("wrongUser", "wrongPwd", "Consumer");

    await expect(page.getByTestId("error-message")).toContainText("Incorrect password");
  });


test("Login Succesful Consumer", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    if (process.env.STORE_PASSWORD !== undefined){
        password = process.env.STORE_PASSWORD;
    }
    //await loginPage.login("joe", password, "Consumer");
    await loginPage.login("joe", "sup3rs3cr3t", "Consumer");
    
    await expect(page).toHaveURL("/store2/");
  });


  test("Logout Succesful", async({page}) => {
    //first do login:
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    if (process.env.STORE_USER_PASSWORD !== undefined){
        password = process.env.STORE_USER_PASSWORD;
    }
    //await loginPage.login("joe", password, "Consumer");
    await loginPage.login("joe", "sup3rs3cr3t", "Consumer");
    await expect(page).toHaveURL("/store2/");

    //then do logout:
    await loginPage.logout();
    await expect(page).toHaveURL("/login/");
  })