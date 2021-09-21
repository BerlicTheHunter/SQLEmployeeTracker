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
    user:'', // 'mysql user here,
    password:'' ,//'mysql password here,
    database: 'tracker_db'
  },
  console.log(`Database Connection Complete`)
);

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
        db.query('SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.department_name FROM employee JOIN roles ON employee.roles_id = roles.id JOIN department ON roles.department_id = department.id', async function (err, results) {
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

      default:
        console.log('other choice');
        break;
    };
  });
};

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
    db.query(`INSERT INTO roles (title,salary,department_id) VALUES ("`+response.newRoleTitle+`","`+response.newRoleSalary+`",(SELECT id from department WHERE department_name ='`+response.newRoleDepart+`'))`, async function(err, results){
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
 
// const addEmployee = ()

// const updateEmployee


mainMenuPrompt();
