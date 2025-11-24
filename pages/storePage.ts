import { Page, Locator } from '@playwright/test';

export class StorePage {

  // Selectors:
  readonly page: Page;
  readonly productSelectField: Locator;
  readonly productAmountField: Locator;
  readonly addProductButton: Locator;
  readonly productAddedMessage: Locator;
  readonly buyButton: Locator;
  readonly nameField: Locator;
  readonly adressField: Locator;
  readonly buyConfirmButton: Locator;

  // constants:
  private readonly storeUrl = "/store2/";
  
  // init all locators:
  constructor(page: Page) {
    this.page = page;
    this.productSelectField = page.getByTestId('select-product');
    this.productAmountField = page.getByRole('textbox', { name: 'Amount' });
    this.addProductButton = page.getByTestId('add-to-cart-button');
    this.productAddedMessage = page.getByTestId("buy-message");
    this.buyButton = page.getByRole('button', { name: 'Buy' });
    this.nameField = page.getByRole('textbox', { name: 'Name:' });
    this.adressField = page.getByRole('textbox', { name: 'Address:' });
    this.buyConfirmButton = page.getByRole('button', { name: 'Confirm Purchase' });
  }


  // use this webpage with base URL from config file:
  async goto() {
    await this.page.goto(this.storeUrl);
  }


  // add a product in shopping bag:
  async addProductInCart(prodId: string, prodAmount: string = "0"){
    await this.productSelectField.selectOption(prodId);
    await this.productAmountField.fill(prodAmount);

    await this.addProductButton.click();
  }


  // buy product(s) added in bag:
  async buyProduct(customerName: string, customerAdress: string){
    await this.buyButton.click();

    await this.nameField.fill(customerName);
    await this.adressField.fill(customerAdress);
    await this.buyConfirmButton.click();
  }

}