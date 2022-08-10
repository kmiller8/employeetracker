const inquirer = require('inquirer');
const db = require('./db/connection');

function startQuestions() {
    inquirer.prompt(
        {
            type: 'list',
            name: 'startprompt',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit'],
            validate: optionSelected => {
                if (optionSelected) {
                    return true;
                } else {
                    console.log('You must make a selection')
                    return false;
                }
            }
        }).then((answer) => {
            if (answer.startprompt == "View all departments") {
                viewDepartments();
            } else if (answer.startprompt == "View all roles") {
                viewRoles();
            } else if (answer.startprompt == "View all employees") {
                viewEmployees();
            } else if (answer.startprompt == "Add a department") {
                addDepartment();
            } else if (answer.startprompt == "Add a role") {
                addRole();
            } else if (answer.startprompt == "Add an employee") {
                addEmployee();
            } else if (answer.startprompt == "Update an employee role") {
                chooseEmployee();
            } else {
                console.log("Finished");
                process.exit();
            }
        }
    );
}

function viewDepartments() {
    db.query('SELECT * FROM department', (err, rows) => {
        if (err) {
            console.log('Error: ' + err.message);
            return;
        }
        console.table(rows);
        startQuestions();
    });
}

function viewRoles() {
    db.query('SELECT * FROM role', (err, rows) => {
        if (err) {
            console.log('Error: ' + err.message);
            return;
        }
        console.table(rows);
        startQuestions();
    });
}

function viewEmployees() {
    db.query('SELECT * FROM employee', (err, rows) => {
        if (err) {
            console.log('Error: ' + err.message);
            return;
        }
        console.table(rows);
        startQuestions();
    });
}

function addDepartment() {
    inquirer.prompt(
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the new department name?',
            validate: newDeptName => {
                if (newDeptName) {
                    db.query(`INSERT INTO department (name) VALUES ("${newDeptName}")`, (err) => {
                        if (err) {
                            console.log('Error: ' + err.message);
                            return;
                        }
                        console.log('Success! New department added.');
                    });
                    return true;
                } else {
                    console.log('Your new department must have a name!')
                    return false;
                }
            }
        }).then(() => {
            startQuestions();
        });
}

function addRole() {
    var nameOfRole = "";
    var salaryAmount = "";
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Please enter new role name',
            validate: roleName => {
                if (roleName) {
                    nameOfRole = roleName;
                    return true;
                } else {
                    console.log('You must enter a role name!')
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter new role salary',
            validate: roleSalary => {
                if (roleSalary) {
                    salaryAmount = roleSalary;
                    return true;
                } else {
                    console.log('You must enter a salary!')
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'roleDepartment',
            message: 'Enter new role department',
            validate: roleDepartment => {
                if (roleDepartment) {
                    if (isNaN(roleDepartment)) {
                        console.log('Department ID must be an integer!');
                        return false;
                    }
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${nameOfRole}", ${salaryAmount}, ${roleDepartment})`, (err) => {
                        if (err) {
                            console.log('Error: ' + err.message);
                            return;
                        }
                        console.log('Success! New role added.');
                    });
                    return true;
                } else {
                    console.log('You must enter a department!')
                    return false;
                }
            }
        }]).then(() => {
            startQuestions();
        });
}

function addEmployee() {
    var firstName = "";
    var lastName = "";
    var role = "";
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeFirstName',
            message: 'Please enter employee first name',
            validate: employeeFirstName => {
                if (employeeFirstName) {
                    firstName = employeeFirstName;
                    return true;
                } else {
                    console.log('You must enter a first name!')
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'employeeLastName',
            message: 'Please enter employee last name',
            validate: employeeLastName => {
                if (employeeLastName) {
                    lastName = employeeLastName;
                    return true;
                } else {
                    console.log('You must enter a last name!')
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'employeeRole',
            message: 'Please enter employee role ID',
            validate: employeeRole => {
                if (employeeRole) {
                    if (isNaN(employeeRole)) {
                        console.log('Role ID must be an integer!');
                        return false;
                    }
                    role = employeeRole;
                    return true;
                } else {
                    console.log('You must enter a role!')
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'employeeManager',
            message: 'Please enter employee manager ID',
            validate: employeeManager => {
                if (employeeManager) {
                    if (isNaN(employeeManager)) {
                        console.log('Manager ID must be an integer!');
                        return false;
                    }
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${role}, ${employeeManager})`, (err) => {
                        if (err) {
                            console.log('Error: ' + err.message);
                            return;
                        }
                        console.log('Success! New role added.');
                    });
                    return true;
                } else {
                    console.log('You must enter a manager!')
                    return false;
                }
            }
        }]).then(() => {
            startQuestions();
        });
}

function chooseEmployee() {
    var employeesArr = [];
    var empIDArr = [];
    db.query('SELECT id, first_name, last_name FROM employee', (err, rows) => {
        if (err)
        {
            console.log("Error selecting employees.");
            return;
        }
        for (let i = 0; i < rows.length; i++)
        {
            employeesArr[i] = rows[i].first_name + ' ' + rows[i].last_name + ' (' + rows[i].id + ')'; // Prevents updating wrong employee if two have same name.
            empIDArr[i] = rows[i].id;
        }
        promptForEmployee(employeesArr, empIDArr);
    })
};

function promptForEmployee(employeesArr, empIDArr) {
    var selEmpID = 0; 
    inquirer.prompt({
            type: 'list',
            name: 'updateEmployee',
            message: 'Please select employee to update',
            choices: employeesArr
    }).then((answer) => {
        for (let i = 0; i < employeesArr.length; i++)
        {
            if (answer.updateEmployee == employeesArr[i])
            {
                selEmpID = empIDArr[i];
                break;
            }
        }
        chooseRole(selEmpID);
    })
}

function chooseRole(selEmpID) {
    if (selEmpID == 0) return;
    var rolesArr = [];
    var roleIDArr = [];
    db.query('SELECT id, title FROM role', (err, rows) => {
        if (err)
        {
            console.log("Error selecting roles.");
            return;
        }
        for (let i = 0; i < rows.length; i++)
        {
            rolesArr[i] = rows[i].title + ' (' + rows[i].id + ')'; // Prevents sending wrong role if two have same name.
            roleIDArr[i] = rows[i].id;
        }
        promptForRole(rolesArr, roleIDArr, selEmpID);
    })
}

function promptForRole(rolesArr, roleIDArr, selEmpID)
{
    var selRoleID = 0;
    inquirer.prompt({
        type: 'list',
        name: 'updateEmployeeRole',
        message: 'Please select new employee role',
        choices: rolesArr
    }).then((answer) => {
        for (let i = 0; i < rolesArr.length; i++)
        {
            if (answer.updateEmployeeRole == rolesArr[i])
            {
                selRoleID = roleIDArr[i];
                break;
            }
        }
        assignRole(selRoleID, selEmpID);
    })
};

function assignRole(selRoleID, selEmpID) {
    console.log(" Role ID: " + selRoleID + " Emp ID: " + selEmpID);
    db.query(`UPDATE employee SET role_id=? WHERE (id=?)`, [selRoleID, selEmpID], (err, result) => {
        if (err) {
            console.log('Error: ' + err.message);
            return;
        }
        console.log("Success! Employee role updated. " + result.affectedRows + " row(s) affected.");
    });
    startQuestions();
}

startQuestions();