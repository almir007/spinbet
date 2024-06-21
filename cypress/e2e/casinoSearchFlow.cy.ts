import {CasinoPage} from "../page-object/casinoPage";

const casinoPage = new CasinoPage();
describe('Casino Search Flow', () => {
    it('should allow user to navigate to the page', () => {
        cy.visit('');
        casinoPage.clickHamburgerMenu();
        casinoPage.clickCasinoIcon();
        casinoPage.verifyCasinoSearchButton();
    });
});

describe('Casino Search Entry', () => {
    beforeEach(() => {
        cy.visit('/casino');
    });

    it('should display no results found', () => {
        casinoPage.verifyCasinoSearchButton();
        casinoPage.searchForCasinoGame(Date.now().toString());
        casinoPage.verifyNoResultsFound();
    });

    it('should display single search result', () => {
        casinoPage.searchForCasinoGame('Sweet Bonanza Dice');
        casinoPage.waitForNoResultsFoundToDisappear();
        casinoPage.verifySearchResults('Sweet Bonanza Dice', 1);
    });

    it('should display multiple search results', () => {
        casinoPage.searchForCasinoGame('Mountain');
        casinoPage.waitForNoResultsFoundToDisappear();
        casinoPage.verifyMultipleSearchResults('Mountain');
    });
});