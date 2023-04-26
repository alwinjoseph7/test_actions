const express = require('express');
const app = express();
const employeeRoute = express.Router();
const mysql = require('mysql');

// MySQL configuration
const connection = mysql.createConnection({
  host: 'test-db.cemgmqk1r12v.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'infernape99',
  database: 'test_db'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error occurs while connecting to the database, ', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Employee model
function Employee(id, name, email, designation, phoneNumber) {
  this.id = id;
  this.name = name;
  this.email = email;
  this.designation = designation;
  this.phoneNumber = phoneNumber;
}

// Add Employee
employeeRoute.route('/create').post((req, res, next) => {
  const employee = new Employee(
    null,
    req.body.name,
    req.body.email,
    req.body.designation,
    req.body.phoneNumber
  );

  connection.query('INSERT INTO employees SET ?', employee, (error, result) => {
    if (error) {
      return next(error);
    } else {
      res.json(result);
    }
  });
});

// Get All Employees
employeeRoute.route('/').get((req, res, next) => {
  connection.query('SELECT * FROM employees', (error, results) => {
    if (error) {
      return next(error);
    } else {
      const employees = results.map((row) => {
        return new Employee(row.id, row.name, row.email, row.designation, row.phoneNumber);
      });
      res.json(employees);
    }
  });
});

// Get single employee
employeeRoute.route('/read/:id').get((req, res, next) => {
  connection.query('SELECT * FROM employees WHERE id = ?', [req.params.id], (error, results) => {
    if (error) {
      return next(error);
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Employee not found' });
    } else {
      const row = results[0];
      const employee = new Employee(row.id, row.name, row.email, row.designation, row.phoneNumber);
      res.json(employee);
    }
  });
});

// Update employee
employeeRoute.route('/update/:id').put((req, res,next) => {
  const employee = new Employee(
    req.params.id,
    req.body.name,
    req.body.email,
    req.body.designation,
    req.body.phoneNumber
  );

  connection.query('UPDATE employees SET ? WHERE id = ?', [employee, req.params.id], (error, result) => {
    if (error) {
      return next(error);
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Employee not found' });
    } else {
      res.json(result);
    }
  });
});

// Delete employee
employeeRoute.route('/delete/:id').delete((req, res, next) => {
  connection.query('DELETE FROM employees WHERE id = ?', [req.params.id], (error, result) => {
    if (error) {
      return next(error);
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Employee not found' });
    } else {
      res.json(result);
    }
  });
});

module.exports = employeeRoute;
