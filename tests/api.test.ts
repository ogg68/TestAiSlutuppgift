import { expect, request, test, APIRequestContext } from '@playwright/test';
import { LoginPage } from "../pages/loginPage";
import { StorePage } from "../pages/storePage";

const urlStoreApi = "/api/v1";
const userName = "John Doe";
let apiContext: APIRequestContext;
let loginPage: LoginPage;
let storePage: StorePage;
let password: string;
//Products: Apple = "1", Banana = "2", Orange = "3", Grape = "4", Bicycle = "5", SamsungS5 = "6", ToyTrain = "7", CupOfCoffee = "8", Chair = "9", TV = "10"
const product = {
    id: "1",
    name: "Apple",
    priceWVat: 15,
    vat: 3,
    quantity: "5",
}

//ersätt request...
test.beforeAll(async () => {
    apiContext = await request.newContext({
        baseURL: "https://hoff.is/store2/api/",
    })
})


test.beforeEach(async ({ page }) => {
    // No Need to first do login, but its here, just in case:    
    loginPage = new LoginPage(page);
    await loginPage.goto();
    if (process.env.STORE_USER_PASSWORD !== undefined) {
        password = process.env.STORE_USER_PASSWORD;
    }
    await loginPage.login(userName, "sup3rs3cr3t", "Business");
    //await loginPage.login('Ola', password, "Business");

    //then open the main page:
    storePage = new StorePage(page);
    //await page.goto("/store2/");
})

test("get all products", async () => {
    const response = await apiContext.get("v1/product/list");
    const respProdsInfo = await response.json();
    //console.log(respProdsInfo);

    expect(respProdsInfo.products[1].id).toBe(2);
    expect(respProdsInfo.products[1].name).toBe("Banana");
})

// https://hoff.is/store2/api/v1/price/n <- change number n from 1-10
test("get product 3", async () => {
    const response = await apiContext.get("v1/price/3");
    const respProdInfo = await response.json();

    expect(respProdInfo.name).toBe("Orange");
    expect(respProdInfo.price).toBe(34);
})

test("add product to cart and verify receipt", async ({ page }) => {
    // first move to the page:
    await page.goto("/store2/");

    // get the API price for the product:
    const response = await apiContext.get(`v1/price/${product.id}`);
    const respData = await response.json();
    //console.log(respProdInfo);
    const respDataName = respData.name;
    const respDataPrice = respData.price;
    //console.log(`Product Name: ${respProdName} Product Price: ${respProdPrice}`);

    expect(respDataName).toBe(product.name);
    expect(respDataPrice).toBe(product.priceWVat);

    // add a product with a quantity to cart and buy:
    await storePage.addProductInCart(product.id, product.quantity);
    await storePage.buyProduct("John Doe", "Torpet 56");

    // calculate total price, depending on user role (not tested here):
    const priceTotalInclVat = parseInt(product.quantity) * product.priceWVat;                   // role consumer incl vat
    const priceTotalExclVat = parseInt(product.quantity) * (product.priceWVat - product.vat);   // role business excl. vat
    //console.log("priceTotal = " + priceTotalWoVat);

    // verify:
    await expect(page.locator("#receiptItems"))
        .toContainText(`${product.quantity} x ${product.name} - $${priceTotalExclVat}`);
    
    await expect(page.getByTestId("receiptGrandTotal"))
        .toContainText(priceTotalExclVat.toString());

})