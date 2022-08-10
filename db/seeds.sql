DELETE FROM department;
DELETE FROM role;
DELETE FROM employee;

USE employees;

INSERT INTO department (name)
VALUES
  ('technical'),
  ('accounting'),
  ('sales');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Lead Engineer', 150000, 1),
  ('Accountant', 100000, 2),
  ('Salesperson', 90000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ('John', 'Sample', 1, NULL),
  ('Jill', 'Test', 2, 1),
  ('Joe', 'Schmoe', 3, 1);
