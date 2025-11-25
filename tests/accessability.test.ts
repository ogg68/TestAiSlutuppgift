//import { expect, Page, test } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { LoginPage } from "../pages/loginPage";
import { StorePage } from "../pages/storePage";
//import AxeBuilder from '@axe-core/playwright';
import { AccessibilityPage } from "../pages/accessibilityPage";

let loginPage: LoginPage;
let storePage: StorePage;
let accessPage: AccessibilityPage;
let password: string;

test.beforeEach(async ({ page }) => {
    //First do login:
    loginPage = new LoginPage(page);
    await loginPage.goto();
    if (process.env.STORE_USER_PASSWORD !== undefined){
        password = process.env.STORE_USER_PASSWORD;
    }
    await loginPage.login("Ola", "sup3rs3cr3t", "Business");
    //await loginPage.login("Ola", password, "Business");

    //then open the main page:
    storePage = new StorePage(page);
    await storePage.goto();

    accessPage = new AccessibilityPage(page);
})

// Helper for critical accessibility rules
// function axeCriticalRules(page: Page) {
//     return new AxeBuilder({ page }).withRules([
//         'label',
//         'button-name',
//         'link-name',
//         'focus-order-semantics',
//         'aria-roles',
//         'duplicate-id',
//         'html-has-lang',
//     ]);
// }

test.describe("homepage accessability", () => {

    // just make a simpl & not critical test, here tabindex:
    test("test accessability tab", async ({ page }) => {

        const result = await accessPage.analyzeTabindexRules();

        //expect(accessibilityScanResults.violations).toEqual([]);
        expect(result.violations, JSON.stringify(result, null, 2))
            .toHaveLength(0);
    });


    // should not have any automatically detectable accessibility issues
    test("test accessability critical", async ({ page }) => {
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
        const result = await accessPage.analyzeCriticalRules();

        //const accessibilityScanResults = await axeCriticalRules(page).analyze();
        // const accessibilityScanResults = await new AxeBuilder({ page })
        //     .withRules([
        //         'label',                    // alla inputs ska ha label!
        //         'button-name',              // saknar text
        //         'link-name',                // saknar text
        //         'focus-order-semantics',    // ger problem för tangentbordsanvändare
        //         'aria-roles',
        //         'duplicate-id',             // är sidan korrekt uppmärkt
        //         'html-has-lang'
        //     ])
        //     .analyze();

        //expect(accessibilityScanResults.violations).toEqual([]);
        //expect(accessibilityScanResults.violations, JSON.stringify(accessibilityScanResults, null, 2))
            //.toHaveLength(0);
        
        expect(result.violations, JSON.stringify(result, null, 2))
            .toHaveLength(0);

    });

});