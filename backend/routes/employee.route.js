const express = require('express');
const app = express();
const employeeRoute = express.Router();
const mysql = require('mysql');

// MySQL configuration
const connection = mysql.createConnection({

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
function Employee(id, first_name, last_name, email, phone) {
  this.id = id;
  this.first_name = first_name;
  this.last_name = last_name;
  this.email = email;
  this.phone = phone;
}

// Add Employee
employeeRoute.route('/create').post((req, res, next) => {
  const employee = new Employee(
    null,
    req.body.first_name,
    req.body.last_name,
    req.body.email,
    req.body.phone
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
        return new Employee(row.id, row.first_name, row.last_name, row.email, row.phone);
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
      const employee = new Employee(row.id, row.first_name, row.last_name, row.email, row.phone);
      res.json(employee);
    }
  });
});

// Update employee
employeeRoute.route('/update/:id').put((req, res,next) => {
  const employee = new Employee(
    req.params.id,
    req.body.first_name,
    req.body.last_name,
    req.body.email,
    req.body.phone
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
