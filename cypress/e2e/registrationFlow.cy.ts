import {Homepage} from "../page-object/homePage";

const homepage = new Homepage();

describe('Registration Flow', () => {

    beforeEach(() => {
        cy.visit('');
        // added intercept to wait for the country details to be displayed
        cy.intercept('GET', 'https://www.spinbet.com/api/countries?portalId=1').as('getCountryDetails');
        homepage.clickSignUpButton();
        cy.wait('@getCountryDetails').then((interception: any) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        // Get the country details based on the IP address
        cy.fixture('countries').then((countries) => {
            cy.request('https://whois.spinbet.com/').then((response) => {
                expect(response.status).to.eq(200);
                const countryCode = response.body.countryCode;
                const countryDetails = countries[countryCode];
                cy.wrap(countryDetails).as('countryDetails');
            });
        });
    });

    it('should allow user to populate the form', () => {
        const timestamp: string = Date.now().toString().substring(0, 6);  // Extract first 6 digits
        const username: string = `TestUser${timestamp}`;
        const email: string = `email${timestamp}@test.com`;
        const password: string = timestamp;
        const day: string = '15';
        const month: string = '06';
        const year: string = '1990';
        const phoneNumber: string = '123 456 789';

        // Populate the registration form
        homepage.populateRegistrationForm(username, email, password, day, month, year, phoneNumber);

        // Verify the entered values
        homepage.verifyUsernameFieldValue(username);
        homepage.verifyEmailFieldValue(email);
        homepage.togglePasswordVisibility();
        homepage.verifyPasswordField(password);
        homepage.verifyDateOfBirthDayFieldValue(day);
        homepage.verifyDateOfBirthMonthFieldValue(month);
        homepage.verifyDateOfBirthYearFieldValue(year);
        cy.get('@countryDetails').then((details: any) => {
            homepage.verifyPhoneNumberFieldValue(details.phoneCode + ' ' + phoneNumber);/**/
        });
        //Check the terms and conditions checkbox
        homepage.checkOrUncheckedTermsAndConditionsCheckbox();
    });

    it('should prepopulate country, currency and country code based in IP', () => {
        cy.get('@countryDetails').then((details: any) => {
            homepage.verifyCountryFieldContainsSpecificCountryName(details.name);
            homepage.verifyCurrencyFieldContainsSpecificCurrency(details.currency);
            homepage.verifyCountryCodeContainsSpecificCountryCode(details.countryCode);
        });
    });

    it('should prepopulate currency and country code upon changing country', () => {
        cy.fixture('countries').then((countries) => {
            cy.get('@countryDetails').then((details: any) => {
                homepage.selectCountryFromDropdown(details.name, countries.DZ.name);
                homepage.verifyCountryFieldContainsSpecificCountryName(countries.DZ.name);
                homepage.verifyCurrencyFieldContainsSpecificCurrency(countries.DZ.currency);
                homepage.verifyCountryCodeContainsSpecificCountryCode(countries.DZ.countryCode);
            });
        });
    });

    it('should display error messages and red outlined fields for required fields', () => {
        homepage.clickOnRegisterButton();
        homepage.verifyRegistrationRequiredFieldsOutlinedInRed();
        homepage.verifyErrorMessageForRequiredField();
    });

    it('should check for date of birth validation messages ', () => {
        homepage.dateOfBirthDayField().type('33');
        homepage.dateOfBirthMonthField().type('33');
        homepage.verifyInvalidDateOfBirthErrorMessage();
        homepage.dateOfBirthYearField().type('33');
        homepage.dateOfBirthMonthField().click();
        homepage.verifyInvalidDayMonthYearErrorMessage(homepage.errorMessages.invalidDayEntry);
        homepage.dateOfBirthDayField().clear().type('3');
        homepage.dateOfBirthMonthField().click();
        homepage.verifyInvalidDayMonthYearErrorMessage(homepage.errorMessages.invalidMonthEntry);
        homepage.dateOfBirthMonthField().clear().type('3');
        homepage.dateOfBirthDayField().click();
        homepage.verifyInvalidDayMonthYearErrorMessage(homepage.errorMessages.invalidYearEntry);
        homepage.dateOfBirthYearField().clear().type('2020');
        homepage.dateOfBirthDayField().click();
        homepage.verifyInvalidDayMonthYearErrorMessage(homepage.errorMessages.olderThan18);
        homepage.dateOfBirthYearField().clear().type('2222');
        homepage.dateOfBirthDayField().click();
        homepage.verifyInvalidDayMonthYearErrorMessage(homepage.errorMessages.futureDate);
    });

    it('should check for email validation message', () => {
        //enter invalid email
        homepage.emailField().type('test.com');
        homepage.passwordField().click(); // Click on password field to remove focus from email field
        homepage.verifyInvalidEntryErrorMessage(homepage.errorMessages.incorrectEmail);
    });

    it('should check for password field validation and hide password button', () => {
        homepage.passwordField().type('12345');
        homepage.dateOfBirthDayField().click();
        homepage.verifyInvalidEntryErrorMessage(homepage.errorMessages.minimumPasswordCharacters);
        homepage.togglePasswordVisibility();
        homepage.togglePasswordVisibility(false);
    });

    it('should allow user to change a currency', () => {
        cy.fixture('countries').then((countries) => {
            cy.get('@countryDetails').then((details: any) => {
                homepage.verifyCountryFieldContainsSpecificCountryName(details.name);
                homepage.selectASpecificCurrency(details.currency, countries.US.currency);
                homepage.currencyField().contains(countries.US.currency).should('be.visible');
            });
        });
    });

    it('should allow user to enter a promo code', () => {
        const promoCode: string = Date.now().toString().substring(0, 6);
        homepage.clickOnPromoCodeTextButton();
        homepage.enterPromoCode(promoCode);
        homepage.verifyPromoCodeFieldEntry(promoCode)
    });

    it('should allow user check/uncheck communication box', () => {
        homepage.checkOrCommunicationsCheckbox();
        homepage.checkOrCommunicationsCheckbox(true);
    });

    it('should allow user to open terms and conditions', () => {
        homepage.clickOnTermsAndConditionsLink();
        cy.url().should('include', '/policies/terms');
        homepage.verifyPoliciesAndInfoHeader();
    });
});