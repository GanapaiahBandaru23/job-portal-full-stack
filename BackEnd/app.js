const express = require('express')
const mysql = require('mysql2')

require('dotenv').config()
const fs = require('fs')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())


// MySQL Connection

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync('C:/Users/ganap/Downloads/isrgrootx1.pem'),
  },
})



// JWT Secret
const JWT_SECRET = 'MY_SECRET_KEY'


// Database Connection
db.connect(err => {
  if (err) {
    console.log('DB NOT CONNECTED')
    console.log(err.message)
    return
  }

  console.log('DB SUCCESSFULLY CONNECTED')
})


// ========================================
// JWT AUTHENTICATION MIDDLEWARE
// ========================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token not provided',
    })
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: 'Invalid token',
      })
    }

    req.user = user

    next()
  })
}


// ========================================
// REGISTER
// ========================================

app.post('/register', async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
  } = req.body

  try {
    const hashedPassword = await bcrypt.hash(
      password,
      10,
    )

    const sql = `
      INSERT INTO users
      (first_name, last_name, email, password)
      VALUES (?, ?, ?, ?)
    `

    db.query(
      sql,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
      ],
      (err, result) => {
        if (err) {
          console.log('REGISTER ERROR:', err.message)

          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
              message: 'Email already exists',
            })
          }

          return res.status(500).json({
            message: 'Registration failed',
          })
        }

        res.status(201).json({
          message: 'Registration successful',
          userId: result.insertId,
        })
      },
    )
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Registration failed',
    })
  }
})


// ========================================
// LOGIN
// ========================================

app.post('/login', (req, res) => {
  const {
    email,
    password,
  } = req.body

  const sql = `
    SELECT *
    FROM users
    WHERE email = ?
  `

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Login failed',
      })
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const user = results[0]

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password,
      )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: '1h',
      },
    )

    res.status(200).json({
      message: 'Login successful',
      token: token,
    })
  })
})


// ========================================
// GET ALL JOBS
// ========================================

app.get('/jobs', (req, res) => {
  const sql = `
    SELECT *
    FROM jobs
    ORDER BY created_at DESC
  `

  db.query(sql, (err, results) => {
    if (err) {
      console.log('JOBS FETCH ERROR:', err.message)

      return res.status(500).json({
        message: 'Failed to fetch jobs',
      })
    }

    res.status(200).json(results)
  })
})


// ========================================
// GET SINGLE JOB
// ========================================

app.get('/jobs/:id', (req, res) => {
  const {id} = req.params

  const sql = `
    SELECT *
    FROM jobs
    WHERE id = ?
  `

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.log('JOB DETAILS ERROR:', err.message)

      return res.status(500).json({
        message: 'Failed to fetch job details',
      })
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: 'Job not found',
      })
    }

    res.status(200).json(results[0])
  })
})


// ========================================
// APPLY FOR JOB
// ========================================

app.post(
  '/applications',
  authenticateToken,
  (req, res) => {

    const userId = req.user.id

    const {job_id} = req.body

    const sql = `
      INSERT INTO applications
      (user_id, job_id)
      VALUES (?, ?)
    `

    db.query(
      sql,
      [userId, job_id],
      (err, result) => {

        if (err) {
          console.log(
            'APPLICATION ERROR:',
            err.message,
          )

          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
              message: 'Already applied',
            })
          }

          return res.status(500).json({
            message: 'Failed to apply for job',
          })
        }

        res.status(201).json({
          message:
            'Application submitted successfully',
          applicationId: result.insertId,
        })
      },
    )
  },
)


// ========================================
// MY APPLICATIONS
// ========================================



app.get(
  '/applications',
  authenticateToken,
  (req, res) => {

    console.log('Logged in user ID:', req.user.id)

    const userId = req.user.id

    const sql = `
      SELECT
        applications.id,
        applications.user_id,
        applications.job_id,
        applications.status,
        applications.applied_at,

        jobs.title,
        jobs.company_name,
        jobs.location,
        jobs.job_type,
        jobs.experience,
        jobs.salary_min,
        jobs.salary_max,
        jobs.description,
        jobs.skills

      FROM applications

      INNER JOIN jobs
        ON applications.job_id = jobs.id

      WHERE applications.user_id = ?

      ORDER BY applications.applied_at DESC
    `

    db.query(sql, [userId], (err, results) => {

      if (err) {
        console.log('MY APPLICATIONS ERROR:', err.message)

        return res.status(500).json({
          message: 'Failed to fetch applications',
        })
      }

      console.log('Applications returned:', results)

      res.status(200).json(results)
    })
  },
)


// ========================================
// START SERVER
// ========================================

app.listen(3000, () => {
  console.log(
    'Server running on http://localhost:3000',
  )
})