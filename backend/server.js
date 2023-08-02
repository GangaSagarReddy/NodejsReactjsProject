const express = require("express");
// const bcrypt = require("bcrypt")

const cors = require("cors");

const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

const multer = require("multer");
const path = require('path');

const buffer = require('buffer');

app.use(cors());
// app.use(express.static("./public"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Villan@520",
  database: "employee_management_system",
});

const storage = multer.memoryStorage({
    destination:'./uploads',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload=multer({
    storage:storage
})

app.post("/reguser", async (req, res) => {
  const sql = "INSERT INTO reg_user (`name`,`email`,`password`) VALUES (?)";
  // var value=req.body.password;
  // const salt=await bcrypt.genSalt(20);
  // value = await bcrypt.hash(value,salt)
  const values = [req.body.name, req.body.email,req.body.password];

  db.query(sql, [values], (err, data) => {
    if (err) throw err;

    return res.json(data);
  });
});

app.post('/login', (req, res) => {

    const sql = "SELECT * FROM reg_user WHERE `email` = ? AND `password` = ?";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {

        if(err){

             return res.json("Error");

        }

        if(data.length > 0) {

            return res.json("Success")

        }

        else{

            return res.json("Failed")

        }

    })

})
app.get("/api/v1/employees", (req, res) => {
    const sql = "SELECT * FROM employees";
  
    db.query(sql, (err, data) => {
      if (err) throw err;
      const employeesWithImages =

            data.map(employee => {

                if (employee.image) {

                    employee.image =

                        Buffer.from(employee.image, 'binary').toString('base64');

                }

                return employee;

            });

        return res.json(employeesWithImages);
  
      
    });
  });


  app.post("/api/v1/employees", (req, res) => {
    const sql = "INSERT INTO employees (`first_name`,`last_name`,`email_id`,`department`,`salary`,`gender`,`dob`,`image`) VALUES (?)";
    const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.emailId,
        req.body.department,
        req.body.salary,
        req.body.gender,
        req.body.dob,
        req.body.image
    ]
    db.query(sql, [values], (err, data) => {
        if (err)  throw err;
        return res.json(data);
    })
})

app.get("/api/v1/employees/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employees WHERE ID = ?";
  db.query(sql, [id], (err, data) => {
    if (err) throw err;
    const employeesWithImages =

            data.map(employee => {

                if (employee.image) {

                    employee.image =

                        Buffer.from(employee.image, 'binary').toString('base64');

                }

                return employee;

            });

        return res.json(employeesWithImages);
  
  });
});

app.put("/api/v1/employees/:id", (req, res) => {
  const sql = "UPDATE employees SET `first_name` = ?,`last_name` = ?,`email_id` = ?,`department` = ?,`salary` = ?,`gender` = ?,`dob` = ?,`image` = ? WHERE ID = ?";
  const values = [req.body.firstName, req.body.lastName, req.body.emailId, req.body.department, req.body.salary, req.body.gender, req.body.dob, req.body.image]
  const id = req.params.id;
  db.query(sql, [...values, id], (err, data) => {
      if (err) throw err;
      return res.json(data);
  })
})


app.delete("/api/v1/employees/:id", (req, res) => {
  const sql = "DELETE FROM employees WHERE ID = ?";

  const id = req.params.id;

  db.query(sql, [id], (err, data) => {
    if (err) throw err;

    return res.json(data);
  });
});

app.listen(8090, () => {
  console.log("listening");
});