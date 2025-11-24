import { Page, Locator } from '@playwright/test';

export class LoginPage {

  //Selectors:
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly roleField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly logoutButton:Locator;

  //Constants:
  private readonly loginUrl = "/login/";
  private readonly storeUrl = "/store2/";

  // init all locators:
  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.roleField = page.locator("#role");                 // from selectOption: <select id="role">
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId("error-message");
    this.logoutButton = page.getByRole('button', { name: 'Log Out' });
  }


  // use this webpage with base URL from config file:
  async goto() {
    await this.page.goto(this.loginUrl);
  }


  // set user type (Consumer or Business):
  async setRole(role: string = "Business"){
    await this.roleField.selectOption(role);
  }


  // login user:
  async login(username: string = '', password: string, role: string = "Business") {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    this.setRole(role);
    await this.loginButton.click();
  }
  

  async logout(){
    await this.logoutButton.click();
  }

}
