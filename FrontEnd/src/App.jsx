
import React from 'react'


import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Home from './components/Home'
import Jobs from './components/Jobs'
import ProtectedRoute from './components/ProtectedRoute'
import JobDetails from './components/JobDetails'
import MyApplications from './components/MyApplications'


const App = () => {

  return (

    <BrowserRouter>

      <Routes>
        {/* Register */}
        <Route
          path="/register"
          element={<RegisterForm />}
        />

        {/* Login */}

        <Route
          path="/login"
          element={<LoginForm />}
        />


        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
              
          
          }
        />

        <Route
          path="/jobs"
          element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />

        <Route
          path="/jobs/:id"
          element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        }
      />


        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        {/* Unknown URL */}

        <Route
          path="*"
          element={
            <Navigate to="/login" replace />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App
