const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
inquirer.registerPrompt('recursive', require('inquirer-recursive'));
const path = require("path");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

inquirer
    .prompt([
        {
            type: 'input',
            message: '\n What is the name of your Team Manager?',
            name: 'name'
        },
        {
            type: 'number',
            message: '\nWhat is the Team Manager\'s ID number?',
            name: 'id'
        },
        {
            type: 'input',
            message: '\nWhat is the Team Manager\'s email address?',
            name: 'email'
        },
        {
            type: 'number',
            message: '\nWhat is the Team Manager\'s Office Number?',
            name: 'officeNumber'
        }
    ]).then(function (response) {
        JSON.stringify(response);
        const manager = new Manager(
            response.name,
            response.id,
            response.email,
            response.officeNumber
        );
        employees.push(manager);
        promptNewMember();
    })

function promptNewMember() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: '\nWould you like to add a team member?',
                name: 'addAnotherMember',
                choices: ['Yes', 'No']
            }
        ]).then(function (response) {
            if (response.addAnotherMember === 'Yes') {
                teamPrompt();
            }
            else {
                const html = render(employees);
                // console.log(html);
                return writeFileAsync(outputPath, html, 'utf-8');
            }
        })
        .catch(function (err) {
            console.log(err);
        })
}

function teamPrompt() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: '\nWhat is the Team Member\'s name?',
                name: 'name'
            },
            {
                type: 'number',
                message: `\nWhat is Team Member\'s ID number?`,
                name: 'id'
            },
            {
                type: 'input',
                message: `\nWhat is Team Member\'s email address?`,
                name: 'email'
            },
            {
                type: 'list',
                message: `\nIs the Team Member an Engineer or an Intern?`,
                name: 'type',
                choices: ['Engineer', 'Intern']
            }
        ]).then(function (response) {
            JSON.stringify(response);

            if (response.type === 'Engineer') {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: `\nWhat is ${response.name}'s Github Profile Name?`,
                            name: 'github'
                        }
                    ]).then(function (githubResponse) {
                        JSON.stringify(githubResponse);
                        const engineer = new Engineer(
                            response.name,
                            response.id,
                            response.email,
                            githubResponse.github);
                        employees.push(engineer);
                        promptNewMember();
                    })
            }
            else {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: `\nWhat is ${response.name}'s School?`,
                            name: 'school'
                        }
                    ]).then(function (schoolResponse) {
                        JSON.stringify(schoolResponse);
                        const intern = new Intern(
                            response.name,
                            response.id,
                            response.email,
                            schoolResponse.school
                        );
                        employees.push(intern);
                        promptNewMember();
                    })
            }
        })
}

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
