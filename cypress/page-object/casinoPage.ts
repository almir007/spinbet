export class CasinoPage {

    // locators
    hamburgerMenu() {
        return cy.get('[data-testid="hamburger-container"]');
    }

    casinoIcon() {
        return cy.get('[class*="switcher-text"]').contains('Casino');
    }

    // cannot type in entry using this element even though it's input type as it is being covered by another element:
    casinoSearchButton() {
        return cy.get('input[type="text"][placeholder="Search"]');
    }

    noResultsFoundLabelText() {
        return cy.get('div[class]').contains('No results found');
    }

    searchGameResult() {
        return cy.get('[class*="game-tile"]')
    }

    //interactions
    clickHamburgerMenu() {
        this.hamburgerMenu().click();

    }

    clickCasinoIcon() {
        this.casinoIcon().click();
    }

    searchForCasinoGame(gameName: string) {
        this.casinoSearchButton().parent().find('img').type(gameName);
    }

    // assertions
    verifyCasinoSearchButton() {
        this.casinoSearchButton().should('be.visible');
    }

    verifyNoResultsFound() {
        this.noResultsFoundLabelText().should('be.visible');
    }

    verifySearchResults(gameName: string, numberOfResults: number) {
        this.searchGameResult().contains(gameName).should('have.length', numberOfResults);
    }

    waitForNoResultsFoundToDisappear() {
        this.noResultsFoundLabelText().should('not.exist');
    }

    verifyMultipleSearchResults(gameName: string) {
        cy.get('.css-evhda').each(($el) => {
            // Check if each element contains "Mountain"
            cy.wrap($el).should('contain.text', gameName);
        });
    }
}