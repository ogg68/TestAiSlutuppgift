import { Page, Locator, expect } from '@playwright/test';

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

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.roleField = page.locator("#role");                 // selectOption: <select id="role">
    //this.roleField = page.getByLabel("Select Role");      //ska funka också
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId("error-message");
    this.logoutButton = page.getByRole('button', { name: 'Log Out' });
  }

  async goto() {
    await this.page.goto(this.loginUrl);         // use base URL from config file: 'https://hoff.is/login/'
    //await expect(this.usernameField).toBeVisible();       //ska funka också ihop med ovan rad
  }

  /** Hämta alla option-värden (text) */
  async getRoleOptions(): Promise<string[]> {
    return await this.roleField.locator('option').allTextContents();
  }

  /** Kontrollera att alternativen är som förväntat */
  async assertRoleOptions(expectedValues: string[]) {
    const actualValues = await this.getRoleOptions();
    await expect(actualValues).toEqual(expectedValues);
  }

  /** Hämta vilket värde som är valt just nu */
  async getSelectedRole(): Promise<string | null> {
    return await this.roleField.inputValue();   // returns 'value'-attribute "Consumer", "Business"
  }

  async setRole(role: string = "Business"){         //"Consumer", Business
    await this.roleField.selectOption(role);
  }

  async login(username: string = '', password: string, role: string = "Business") { //= 'sup3rs3cr3t'
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    this.setRole(role);
    await this.loginButton.click();
  }
  
  async logout(){
    await this.logoutButton.click();
  }

  /** Kontrollera vilket alternativ som är valt */
  async assertSelectedRole(expectedValue: string) {
    const selected = await this.getSelectedRole();
    await expect(selected).toBe(expectedValue);
  }

  async assertSuccessfulLogin() {
    // Exempel på något som visar att man loggats in (justera efter sajten)
    await expect(this.page).toHaveURL(this.storeUrl);     // "https://hoff.is/store2/""
  }

  async assertFailedLogin() {
    // Exempel: felmeddelande på sidan
    //const errorMessage = this.page.locator('text=Please fill in all fields.');
    //await expect(errorMessage).toBeVisible();
    //or
    await expect(this.errorMessage).toContainText("bla");
    //or
    //await expect(this.page.getByTestId('error-message')).toContainText('Incorrect password');
  }

  async assertFailedLogin2() {
    await expect(this.errorMessage).toHaveText("bla");
    //or
    //await expect(this.page.getByTestId('error-message')).toContainText('Please fill in all fields.');
  }
}
