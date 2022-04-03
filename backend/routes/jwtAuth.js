const router = require("express").Router();
const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

/* Registering */
router.post("/register", validInfo, async (req, res) => {
  try {
    // 1. Destructure the req.body (name, email, password)
    const { firstname, lastname, email, password } = req.body;
    const subjects = [];

    // 2. Check if user exist (if user exist then throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    // if user already exists in database
    if (user.rows.length !== 0) {
      return res.status(401).send(null); // Unauthenticated
    }

    // 3. Bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Enter the new user inside our database
    const newUser = await ((subjects.length > 0) ? pool.query(
      "INSERT INTO users (user_name, user_email, user_password, user_subject) VALUES ($1, $2, $3, $4) RETURNING *",
      [firstname+lastname, email, bcryptPassword, subjects]
    ) : pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [firstname+lastname, email, bcryptPassword])
    );

    // 5. generating our JWT token
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.log('hit');
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* Login */

router.post("/login", validInfo, async (req, res) => {
  try {
    // 1. Destructure the req.body
    const { email, password } = req.body;

    // 2. Check if user doesn't exist (if not hten we throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or email is incorrect.");
    }

    // 3. Check if incoming password is the same the database password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );
    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // 4. Give the JWT Token
    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.log("rrr",err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;