// pages/AxeAccessibilityPage.ts
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
                'label',
                'button-name',
                'link-name',
                'focus-order-semantics',
                'aria-roles',
                'duplicate-id',
                'html-has-lang',
            ])
            .analyze();
    }

    /**
     * HTML lang attribute check
     */
    async analyzeTabindexRules() {
        // return await new AxeBuilder({ page: this.page })
        //     .withRules(['html-has-lang'])
        //     .analyze();
        
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
}
