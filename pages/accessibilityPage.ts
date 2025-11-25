import { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export class AccessibilityPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Critical accessibility checks:
     * Missing labels, button names, link names, focus order etc.
     */
    async analyzeCriticalRules() {
        return await new AxeBuilder({ page: this.page })
            .withRules([
                'label',                    // alla inputs ska ha label
                'button-name',              // saknar text?
                'link-name',                // saknar text?
                'focus-order-semantics',    // ger problem för tangentbordsanvändare
                'aria-roles',               // 
                'duplicate-id',             // är sidan korrekt uppmärkt
                'html-has-lang',            // 
            ])
            .analyze();
    }


    /**
     * HTML tabindex attribute check
     */
    async analyzeTabindexRules() {       
        return await new AxeBuilder({ page: this.page })
        .withRules("tabindex")           // ger problem för tangentbordsanvändare
        .analyze();
    }


    /**
     * Helper for custom rule sets
     */
    async analyzeCustomRules(rules: string[]) {
        return await new AxeBuilder({ page: this.page })
            .withRules(rules)
            .analyze();
    }


    /**
     * Analyze everything (full Axe scan)
     */
    async analyzeAll() {
        return await new AxeBuilder({ page: this.page }).analyze();
    }

    /**
     * Analyze filtered by not relevant rules:
     */
    async analyzeFiltered() {
        return await new AxeBuilder({ page: this.page })
            .disableRules([
                'color-contrast',
                'region',
                'frame-title',
                'meta-viewport',
                'document-title'
            ])
            .analyze();
    }
}
