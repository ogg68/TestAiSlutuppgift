import { expect, test } from '@playwright/test';
import { LoginPage } from "../pages/loginPage";
import { StorePage } from "../pages/storePage";
import AxeBuilder from '@axe-core/playwright';

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
    await page.goto("/store2/");
})

test.describe('homepage', () => {
    // should not have any automatically detectable accessibility issues
    test('test accessability', async ({ page }) => {
        // analys all:
        //const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        // filtered by not relevant rules:
        // const accessibilityScanResults = await new AxeBuilder({ page })
        //     .disableRules([
        //         'color-contrast',
        //         'region',
        //         'frame-title',
        //         'meta-viewport',
        //         'document-title'
        //     ])
        //     .analyze();

        // filtered with relevant and critical rules:
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withRules([
                'label',                    // alla inputs ska ha label!
                'button-name',              // saknar text
                'link-name',                // saknar text
                'focus-order-semantics',    // ger problem för tangentbordsanvändare
                'tabindex',                 // ger problem för tangentbordsanvändare
                'aria-roles',
                'duplicate-id',             // är sidan korrekt uppmärkt
                //'valid-lang',
                //'html-has-lang'
            ])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('test accessability lang', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
        //.withRules(["label"]).analyze();
        //.withRules(['html-lang', 'image-alt']).analyze();
        .withRules('html-has-lang').analyze();
        //.options({ checks: { 'valid-lang': ['orcish'] } }).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

});