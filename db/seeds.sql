INSERT INTO department (id, department_name)
VALUES (001, "Management"),
       (002, "Engineering"),
       (003, "Production");
INSERT INTO roles (id, title, salary,department_id)
VALUES (001, "Plant Manager", 250000.00, 001),
       (002, "Process Engineer", 100000.00,002),
       (003, "Control Operator", 75000.00, 003);       

INSERT INTO employee (id, first_name, last_name, roles_id, manager_id)
VALUES (001, "Roger", "Riffy",001,null),
       (002, "Brandon", "Sorrell",002,001),
       (003, "Ron", "Swanson",003,002);      