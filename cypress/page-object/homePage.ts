export class Homepage {

    errorMessages = {
        username: "Username is required.",
        email: "Email is required.",
        password: "Password is required.",
        dateOfBirth: "Date of birth is required.",
        phoneNumber: "mobileNumberIsRequired",
        incorrectEmail: "Email format is incorrect.",
        invalidDateOfBirth: "Invalid numeric values for year, month, or day.",
        invalidDayEntry: "Invalid day. Day should be between 1 and 30.",
        invalidMonthEntry: "Invalid month. Month should be between 1 and 12.",
        invalidYearEntry: "Invalid year. Year should be 1900 or later.",
        olderThan18: "You must be at least 18 years old.",
        futureDate: "Date of birth cannot be in the future.",
        minimumPasswordCharacters: "Password should be at least 6 characters."
    }

    // locators
    signUpButton() {
        return cy.contains('span.text.Primary', 'Sign up');
    }

    cloudFlareText() {
        return cy.contains('p', 'SpinBet is protected by Cloudflare. Cloudflare')
    }

    usernameField() {
        return cy.get('#Username');
    }

    emailField() {
        return cy.get('[data-testid="email-input"]');
    }

    passwordField() {
        return cy.get('#Password');
    }

    dateOfBirthDayField() {
        return cy.get('input[name="day"]');
    }

    dateOfBirthMonthField() {
        return cy.get('input[name="month"]');
    }

    dateOfBirthYearField() {
        return cy.get('input[name="year"]');
    }

    phoneNumberField() {
        return cy.get('[data-testid="mobilePhone"]');
    }

    mobilePhoneErrorMessage() {
        return cy.get('span.BodyText-b3');
    }

    countryField() {
        return cy.get('p.css-cpe057');
    }

    currencyField() {
        return cy.get('p.css-cpe057');
    }

    countryCode() {
        return cy.get('h5.Heading-h5');
    }

    countryDropdownContainer() {
        return cy.get('[class*="dropdown-list-container"]');
    }

    errorMessagesText() {
        return cy.get('[class*="error-message"]');
    }

    dateOfBirthErrorMessage() {
        return cy.get('span[role="alert"]');
    }

    registerButton() {
        return cy.contains('span.text.Primary', 'Register');
    }

    termsAndConditionsFieldText() {
        return cy.get('span').contains('I agree and understand the Terms & Conditions')
    }

    communicationsFieldText() {
        return cy.get('span').contains('I want to receive free spins, free bets and exclusive promotions on all communication channels.')
    }

    passwordToggleIcon() {
        return cy.get('img[alt="show-password"]');
    }

    policiesAndInfoHeader() {
        return cy.contains('h1.css-1reg1b8', 'Policies & Info');
    }

    promoCodeTextButton() {
        return cy.get('img[alt="Promo code"]');
    }

    promoCodeField() {
        return cy.get('input[name="promoCode"]');
    }

    //interactions
    clickSignUpButton() {
        this.signUpButton().should("be.visible").click();
    }

    clickOnRegisterButton() {
        this.registerButton().should("be.visible").click();
    }

    clickOnPromoCodeTextButton() {
        this.promoCodeTextButton().should("be.visible").click();
    }

    // removing attribute target to open in the same tab as cypress doesn't support opening in a new tab
    clickOnTermsAndConditionsLink() {
        this.cloudFlareText().scrollIntoView().should("be.visible")
            .siblings('a')
            .should("be.visible")
            .invoke('removeAttr', 'target')
            .click();

        // code below doesn't work or for similar elements as the element is hidden, doing a force click does interact with a different element
        /*cy.contains('a', 'Terms & Conditions')
            .scrollIntoView()
            .invoke('removeAttr', 'target')
            .click();*/
    }

    selectCountryFromDropdown(currentCountrySelection: string, countryName: string) {
        this.countryField().contains(currentCountrySelection).click();
        this.countryDropdownContainer().should("be.visible").contains(countryName).click();
    }

    selectASpecificCurrency(currentCurrency: string, currency: string) {
        this.verifyCurrencyFieldContainsSpecificCurrency(currentCurrency);
        this.currencyField().contains(currentCurrency).click();
        this.countryDropdownContainer().should("be.visible").contains(currency).click();
    }

    enterPromoCode(promoCode: string) {
        this.promoCodeField().type(promoCode);
    }

    /**
     * password is hidden by default, the first click should show the password
     */
    togglePasswordVisibility(toggleVisibility: boolean = true) {
        this.passwordToggleIcon().click();
        if (toggleVisibility) {
            // show password:  type should change to 'text'
            this.passwordField().should('have.attr', 'type', 'text');
        } else {
            // hide password:  type should change back to 'password'
            this.passwordField().should('have.attr', 'type', 'password');
        }
    }

    //Check or uncheck the terms and conditions checkbox, considering the default state is unchecked
    checkOrUncheckedTermsAndConditionsCheckbox(isChecked: boolean = false) {
        const checkbox = this.communicationsFieldText().should("be.visible")
            .siblings('span')
            .should('be.visible')
            .find('input*[type="checkbox"]');
        if (isChecked) {
            checkbox.should('not.be.checked').click().should('be.checked');
        } else {
            checkbox.should('be.checked').click().should('not.be.checked');

        }
    }

    //Check or uncheck the communications checkbox, considering the default state is unchecked
    checkOrCommunicationsCheckbox(isChecked: boolean = false) {
        const checkbox = this.termsAndConditionsFieldText().should("be.visible")
            .siblings('span')
            .should('be.visible')
            .find('input*[type="checkbox"]');
        if (isChecked) {
            checkbox.should('be.checked').click().should('not.be.checked');
        } else {
            checkbox.should('not.be.checked').click().should('be.checked');
        }
    }

    populateRegistrationForm(username: string, email: string, password: string, day: string, month: string, year: string, phoneNumber: string) {
        this.usernameField().should("be.visible").type(username);
        this.emailField().should("be.visible").type(email);
        this.passwordField().should("be.visible").type(password);
        this.dateOfBirthDayField().should("be.visible").type(day);
        this.dateOfBirthMonthField().should("be.visible").type(month);
        this.dateOfBirthYearField().should("be.visible").type(year);
        this.phoneNumberField().should("be.visible").type(phoneNumber);
    }

    //assertions
    verifyUsernameFieldValue(username: string) {
        this.usernameField().should('have.value', username);
    }

    verifyEmailFieldValue(email: string) {
        this.emailField().should("be.visible").should("have.value", email);
    }

    verifyPasswordField(password: string) {
        this.passwordField().should("be.visible").should("have.value", password);
    }

    verifyDateOfBirthDayFieldValue(day: string) {
        this.dateOfBirthDayField().scrollIntoView().should("be.visible").should("have.value", day);
    }

    verifyDateOfBirthMonthFieldValue(month: string) {
        this.dateOfBirthMonthField().scrollIntoView().should("be.visible").should("have.value", month);
    }

    verifyDateOfBirthYearFieldValue(year: string) {
        this.dateOfBirthYearField().scrollIntoView().should("be.visible").should("have.value", year);
    }

    verifyPhoneNumberFieldValue(phoneNumber: string) {
        this.phoneNumberField().scrollIntoView().should("be.visible").should("have.value", phoneNumber);
    }

    verifyCountryFieldContainsSpecificCountryName(countryName: string) {
        this.countryField().should("be.visible").contains(countryName);
    }

    verifyCurrencyFieldContainsSpecificCurrency(currency: string) {
        this.currencyField().should("be.visible").contains(currency);
    }

    verifyCountryCodeContainsSpecificCountryCode(countryCode: string) {
        this.countryCode().should("be.visible").contains(countryCode);
    }

    verifyRegistrationRequiredFieldsOutlinedInRed() {
        this.usernameField().scrollIntoView().should("be.visible").should("have.css", "border-color", "rgb(228, 66, 30)");
        this.emailField().scrollIntoView().should("be.visible").should("have.css", "border-color", "rgb(228, 66, 30)");
        this.passwordField().scrollIntoView().should("be.visible").should("have.css", "border-color", "rgb(228, 66, 30)");
        this.dateOfBirthDayField().should("be.visible").should("have.css", "border-color", "rgb(228, 66, 30)");
        this.dateOfBirthMonthField().should("be.visible").should("have.css", "border-color", "rgb(228, 66, 30)");
        this.dateOfBirthYearField().should("be.visible").should("have.css", "border-color", "rgb(228, 66, 30)");
        this.phoneNumberField().should("be.visible").should("have.css", "border-color", "rgb(228, 66, 30)");
        // don't have a unique identifier, using a workaround
        this.termsAndConditionsFieldText().should("be.visible")
            .parent('label')
            .should('be.visible')
            .find('.css-qc0ao1 input[type="checkbox"]')
            .should('not.be.checked')
            .parent('span')
            .should('have.css', 'border-color', 'rgb(228, 66, 30)');
    }

    verifyErrorMessageForRequiredField() {
        this.errorMessagesText().should("be.visible").contains(this.errorMessages.username);
        this.errorMessagesText().should("be.visible").contains(this.errorMessages.email);
        this.errorMessagesText().should("be.visible").contains(this.errorMessages.password);
        this.dateOfBirthErrorMessage().should("be.visible").contains(this.errorMessages.dateOfBirth);
        this.mobilePhoneErrorMessage().should("be.visible").contains(this.errorMessages.phoneNumber);
    }

    verifyInvalidEntryErrorMessage(errorMessage: string) {
        this.errorMessagesText().should("be.visible").contains(errorMessage);
    }

    verifyInvalidDateOfBirthErrorMessage() {
        this.dateOfBirthErrorMessage().should("be.visible").contains(this.errorMessages.invalidDateOfBirth);
    }

    verifyInvalidDayMonthYearErrorMessage(errorMessage: string) {
        this.dateOfBirthErrorMessage().should("be.visible").contains(errorMessage);
    }

    verifyPoliciesAndInfoHeader() {
        this.policiesAndInfoHeader().should("be.visible");
    }

    verifyPromoCodeFieldEntry(promoCode: string) {
        this.promoCodeField().should("be.visible").should("have.value", promoCode);
    }
}