import { expect, test } from '@playwright/test';
import { LoginPage } from "../pages/loginPage";
import { StorePage } from "../pages/storePage";
import { ApiPage } from "../pages/apiPage";

const userName = "John Doe";
let loginPage: LoginPage;
let storePage: StorePage;
let storeApi: ApiPage;
let password: string;

const product = {
  id: "1",
  name: "Apple",
  priceIncVat: 15,
  vat: 3,
  quantity: "5",
};

test.beforeAll(async () => {
  storeApi = await ApiPage.create(); // New API POM instance
});

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  storePage = new StorePage(page);

  await loginPage.goto();

  if (process.env.STORE_USER_PASSWORD !== undefined) {
        password = process.env.STORE_USER_PASSWORD;
    }
  await loginPage.login(userName, "sup3rs3cr3t", "Business");
  //await loginPage.login('Ola', password, "Business");
});


// ---------------------------------------------------------------------
// GET ALL PRODUCTS
// ---------------------------------------------------------------------
test("get all products", async () => {
  const productList = await storeApi.listProducts();

  expect(productList.products[1].id).toBe(2);
  expect(productList.products[1].name).toBe("Banana");
});


// ---------------------------------------------------------------------
// GET PRODUCT PRICE
// ---------------------------------------------------------------------
test("get product 3", async () => {
  const prod = await storeApi.getProductPrice(3);

  expect(prod.name).toBe("Orange");
  expect(prod.price).toBe(34);
});


// ---------------------------------------------------------------------
// ADD PRODUCT TO CART + VERIFY RECEIPT
// ---------------------------------------------------------------------
test("add product to cart and verify receipt", async ({ page }) => {
  await storePage.goto();

  // --- API price check ---
  const apiProd = await storeApi.getProductPrice(product.id);
  //console.log(`Product Name: ${apiProd.name}, Price: ${apiProd.price}`);
  
  expect(apiProd.name).toBe(product.name);
  expect(apiProd.price).toBe(product.priceIncVat);

  // --- Add product via UI ---
  await storePage.addProductInCart(product.id, product.quantity);
  await storePage.buyProduct("John Doe", "Torpet 56");

  // --- Consumer role → excl VAT (not tested here) ---
  const totalInclVat = parseInt(product.quantity) * product.priceIncVat;
  // --- Business role → excl VAT ---
  const totalExVat = parseInt(product.quantity) * (product.priceIncVat - product.vat);

  await expect(page.locator("#receiptItems"))
    .toContainText(`${product.quantity} x ${product.name} - $${totalExVat}`);

  await expect(page.getByTestId("receiptGrandTotal"))
    .toContainText(totalExVat.toString());
});
