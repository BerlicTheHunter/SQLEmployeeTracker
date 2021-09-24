//*...............Required Packages...............*\\
const inquirer= require("inquirer");
const fs= require("fs");
const mysql= require("mysql2");
const cTable = require("console.table");
const { Console } = require("console");

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user:"" , // 'mysql user here,
    password:"", //'mysql password here,
    database: 'tracker_db'
  },
  console.log(`Database Connection Complete`)
);
// Main Pormpt Menu
const mainMenuPrompt = () => {
  inquirer
  .prompt([
    {
      type: "list",
      message: "What Would You Like To DO?",
      name: "mainMenu",
      choices: ["View All Departments","View All Roles","View All Employees","Add A Department","Add A Role","Add An Employee","Update An Employee"] 
    }
  ])
  .then((response) =>{
    switch (response.mainMenu){
      case "View All Departments":
        db.query('SELECT department.id, department.department_name AS department FROM department', async function (err, results) {
          console.table(results);
          await mainMenuPrompt();
          return;
        });
        break;

      case "View All Roles":
        db.query('SELECT roles.id, roles.title, roles.salary, department.department_name AS department FROM roles JOIN department ON roles.department_id = department.id ', async function (err, results) {
          console.table(results);
          await mainMenuPrompt();
          return;
        });
        break;

      case "View All Employees":
        db.query('SELECT employee.id, employee.first_name, employee.last_name, CONCAT(m.first_name," ", m.last_name) AS manager , roles.title, roles.salary, department.department_name FROM employee JOIN roles ON employee.roles_id = roles.id JOIN department ON roles.department_id = department.id LEFT JOIN employee m ON m.id = employee.manager_id ', async function (err, results) {
          if(err){
            console.log(err);
          }
          console.table(results);
          await mainMenuPrompt();
          return;
        });
        break;

      case "Add A Department":
        addDepartment();
        break;
      
      case "Add A Role":
        addRole();
        break;

      case "Add An Employee":
        addEmployee(); 
        break;

      case "Update An Employee":
        updateEmployee();
        break;  

      default:
        console.log('other choice');
        break;
    };
  });
};
// SQL Query to Add a Department
const addDepartment = () => {
 inquirer
 .prompt([
   {
    type: "input",
    message: "Please Input New Department Name",
    name: "newDepartment"
  }
 ])
 .then((response) =>{
   db.query(`INSERT INTO department (department_name) VALUES ("`+response.newDepartment+`")`, async function(err, results){
    if(err){
      console.log(err.sqlMessage);
      for(let i=0; i<5; i++) {
        console.log(" ");  
      }; 
    };
    if(!err){
      console.log("Department Added");
      for(let i=0; i<5; i++) {
        console.log(" ");  
      }; 
    };
    await mainMenuPrompt();
    return;
   });
  });
};
// SQL Query to Add a Role
const addRole = () => {
  inquirer
  .prompt([
    {
      type: "input",
      message: "What Is The Title For The New Role?",
      name:"newRoleTitle"
    },
    {
      type: "input",
      message: "What Is The Salary For The New Role",
      name: "newRoleSalary",
    },
    {
      type: "input",
      message: "Which Department Will The Role Fall Under?",
      name: "newRoleDepart"
    }
  ])
  .then((response) =>{
    db.query(`INSERT INTO roles (title,salary,department_id) VALUES ("`+response.newRoleTitle+`","`+response.newRoleSalary+`",(SELECT id FROM department WHERE department_name ='`+response.newRoleDepart+`'))`, async function(err, results){
      if(err){
        console.log(err.sqlMessage);
        for(let i=0; i<5; i++) {
          console.log(" ");  
        }; 
      };
      if(!err){
        console.log("New Role Added");
        for(let i=0; i<5; i++) {
          console.log(" ");  
        }; 
      };
      await mainMenuPrompt();
      return;
     });
  });
};
//  SQL Query to Add an Employee
const addEmployee = () =>{
  inquirer
    .prompt([
      {
        type: "input",
        message: "What Is The Employee's First Name?",
        name:"newFirstName"
      },
      {
        type: "input",
        message: "What Is The Employee's Last Name?",
        name: "newLastName",
      },
      {
        type: "input",
        message: "What Title Will The New Employee Have?",
        name: "newEmpRole"
      },
      {
        type: "input",
        message: "What Is The Managers Last Name?",
        name: "newEmpManager",
      },
    ])
    .then((response) =>{
      let managerId = "Starter";
      console.log(response);
      db.query(`SELECT id FROM employee WHERE last_name='`+response.newEmpManager+`'`, async function(err,results){
       managerId= results[0].id;
     
        db.query(`INSERT INTO employee (first_name,last_name,roles_id,manager_id) VALUES ("`+response.newFirstName+`","`+response.newLastName+`",(SELECT id FROM roles WHERE title ='`+response.newEmpRole+`'),`+managerId+`)`, async function(err, results){
          if(err){
            console.log(err.sqlMessage);
            for(let i=0; i<5; i++) {
              console.log(" ");  
            }; 
          };
          if(!err){
            console.log("New Role Added");
            for(let i=0; i<5; i++) {
              console.log(" ");  
            };
            
          };
          await mainMenuPrompt();
          return;
        });
      });

    });
};
// SQL Query to Update and Employee
const updateEmployee = () =>{
  inquirer
    .prompt([
      {
        type: "input",
        message: "First Name of the Employee To Update?",
        name:"updateFirstName"
      },
      {
        type: "input",
        message: "Last Name of thr Employee To Update?",
        name: "updateLastName",
      },
      {
        type: "input",
        message: "What Is The Employee's New Title?",
        name: "updateEmpRole"
      }
    ])
    .then((response) =>{
      let rolesId = "Starter";
      console.log(response);
      db.query(`SELECT id FROM roles WHERE title='`+response.updateEmpRole+`'`, async function(err,results){
       console.log(results);
        rolesId= results[0].id;
     
        db.query(`UPDATE employee SET roles_id = `+rolesId+` WHERE first_name = "`+response.updateFirstName+`" AND last_name = "`+response.updateLastName+`"`, async function(err, results){
          if(err){
            console.log(err.sqlMessage);
            for(let i=0; i<5; i++) {
              console.log(" ");  
            }; 
          };
          if(!err){
            console.log("Role Updated");
            for(let i=0; i<5; i++) {
              console.log(" ");  
            };
            
          };
          await mainMenuPrompt();
          return;
        });
      });

    });
};


// Initial Funtion Call
mainMenuPrompt();
