// cypress/support/commands.ts

// Import Cypress types for TypeScript support
/// <reference types="cypress" />

// Define the mockLocation function
export function mockLocation(latitude: number, longitude: number) {
    return {
        onBeforeLoad(win: Window) {
            cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake(
                (successCallback: PositionCallback, errorCallback: PositionErrorCallback) => {
                    if (latitude != null && longitude != null) {
                        successCallback({
                            coords: {
                                latitude,
                                longitude,
                                accuracy: 1,
                            },
                            timestamp: Date.now(),
                        } as GeolocationPosition);
                    } else {
                        errorCallback({
                            code: 1,
                            message: "User denied Geolocation",
                        } as GeolocationPositionError);
                    }
                }
            );
        },
    };
}

// Add the mockLocation function as a custom Cypress command
Cypress.Commands.add('mockLocation', (latitude: number, longitude: number) => {
    cy.window().then((win) => {
        const mock = mockLocation(latitude, longitude);
        mock.onBeforeLoad(win);
    });
});

// Extend Cypress Chainable interface inline
declare global {
    namespace Cypress {
        interface Chainable {
            mockLocation(latitude: number, longitude: number): void;
        }
    }
}
