import { expect, request, test, Page, APIRequestContext } from '@playwright/test';
import { LoginPage } from "../pages/loginPage";
import { StorePage } from "../pages/storePage";

const urlStoreApi = "/api/v1";
let apiContext: APIRequestContext;
let loginPage: LoginPage;
let storePage: StorePage;
let password: string;

//ersätt request...
test.beforeAll(async () => {
//test.beforeEach(async ({ page }) => {
    //No Need to first do login, but its here, just in case:    
    // loginPage = new LoginPage(page);
    // await loginPage.goto();
    // if (process.env.STORE_USER_PASSWORD !== undefined){
    //     password = process.env.STORE_USER_PASSWORD;
    // }
    // await loginPage.login('Ola', 'sup3rs3cr3t', "Business");
    //await loginPage.login('Ola', password, "Business");

    //then open the main page:
    // storePage = new StorePage(page);
    // await page.goto("/store2/");

    apiContext = await request.newContext({
    baseURL: "https://hoff.is/store2/api/",
    })
})

test("get all products", async () => {
    const response = await apiContext.get("v1/product/list");
    const respProdsInfo = await response.json();
    //console.log(await respProdsInfo);

    expect(await respProdsInfo.products[1].id).toBe(2);
    expect(await respProdsInfo.products[1].name).toBe("Banana");
})

// https://hoff.is/store2/api/v1/price/n <- change number n from 1-10
test("get product 3", async () => {
    //Products: Apple = "1", Banana = "2", Orange = "3", Grape = "4", Bicycle = "5", SamsungS5 = "6", ToyTrain = "7", CupOfCoffee = "8", Chair = "9", TV = "10"
    const response = await apiContext.get("v1/price/3");
    const respProdInfo = await response.json();
    //console.log(await respProdInfo);
    //console.log(await respProdInfo.name);

    expect(await respProdInfo.name).toBe("Orange");
    expect(await respProdInfo.price).toBe(34);
})