import { expect, test } from '@playwright/test';
import { LoginPage } from "../pages/loginPage";
import { StorePage } from "../pages/storePage";

let loginPage: LoginPage;
let storePage: StorePage;
let password: string;

test.beforeEach(async ({ page }) => {
    //First do login:
    loginPage = new LoginPage(page);
    await loginPage.goto();
    if (process.env.STORE_USER_PASSWORD !== undefined){
        password = process.env.STORE_USER_PASSWORD;
    }
    await loginPage.login('Ola', 'sup3rs3cr3t', "Business");
    //await loginPage.login('Ola', password, "Business");

    //then open the main page:
    storePage = new StorePage(page);
    await storePage.goto();
})


test.afterEach(async ({}) =>{
    console.log('Done with tests');
})

test("Add and Buy Products", async ({ page }) => {
    //Products: Apple = "1", Banana = "2", Orange = "3", Grape = "4", Bicycle = "5", SamsungS5 = "6", ToyTrain = "7", CupOfCoffee = "8", Chair = "9", TV = "10"
    await storePage.addProductInCart("1", "5");             // product, quantity
    await storePage.addProductInCart("2", "4");

    await storePage.buyProduct("John Doe", "Torpet 56");    //name and adress

    await expect(page.locator('#receiptItems')).toContainText('5 x Apple - $604 x Banana - $73.6');
    await expect(page.getByTestId('receiptGrandTotal')).toContainText('133.6');
    await expect(page.locator('#name')).toContainText('Thank you for your purchase, John Doe');
})