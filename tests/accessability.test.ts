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


test.describe("homepage accessability", () => {

    // just make a simple & "not" critical test, - here tabindex:
    test("test accessability tabindex", async ({ page }) => {

        const result = await accessPage.analyzeTabindexRules();

        expect(result.violations, JSON.stringify(result, null, 2))
            .toHaveLength(0);
    });

    // test of some other accessability rules
    test("test accessability others", async ({ page }) => {

        const result = await accessPage.analyzeCustomRules([
            "page-has-heading-one",
            "form-field-multiple-labels",
            "heading-order",
        ]);

        expect(result.violations, JSON.stringify(result, null, 2))
            .toHaveLength(0);
    });


    // should not have any automatically detectable accessibility issues
    test("test accessability critical", async ({ page }) => {
        // analys all:
        //const accessibilityScanResultAll = await accessPage.analyzeAll();

        // analys all except for filtered:
        //const accessibilityScanResultsFiltered = await accessPage.analyzeFiltered();

        // analys all only filtered with relevant and critical rules:
        const result = await accessPage.analyzeCriticalRules();
        
        expect(result.violations, JSON.stringify(result, null, 2))
            .toHaveLength(0);

    });

});