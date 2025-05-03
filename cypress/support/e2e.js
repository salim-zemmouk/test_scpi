import './commands'
import 'cypress-mochawesome-reporter/register';
// Cypress.Commands.add('DemoError', () => {
//     Cypress.on('uncaught:exception', (err, runnable) => {
//         if (err.message.includes('demo is not defined')) {
//             return false; // Ignore l'erreur
//         }
//         return true;
//     });
// });