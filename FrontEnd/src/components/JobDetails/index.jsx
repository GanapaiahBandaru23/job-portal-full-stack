import {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import Header from '../Header'

import './index.css'

const JobDetails = () => {
  const {id} = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const [isApplying, setIsApplying] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState('')

  useEffect(() => {
    getJobDetails()
  }, [id])

  const getJobDetails = async () => {
    setIsLoading(true)
    setIsError(false)

    try {
      const response = await fetch(
        `https://job-portal-full-stack-vxtg.onrender.com/jobs/${id}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch job details')
      }

      const data = await response.json()

      setJob(data)
    } catch (error) {
      console.log('JOB DETAILS ERROR:', error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = async () => {
    setIsApplying(true)

    try {
      const token = Cookies.get('jwt_token')

      const response = await fetch(
        'https://job-portal-full-stack-vxtg.onrender.com/applications',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            user_id: 1,
            job_id: id,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        setApplicationStatus('success')
      } else if (response.status === 400) {
        setApplicationStatus('already-applied')
      } else {
        setApplicationStatus('error')
      }
    } catch (error) {
      console.log('APPLY ERROR:', error)
      setApplicationStatus('error')
    } finally {
      setIsApplying(false)
    }
  }

  const handleBackHome = () => {
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className="job-details-page">
        <Header />

        <div className="job-details-container">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (isError || job === null) {
    return (
      <div className="job-details-page">
        <Header />

        <div className="job-details-container">
          <h2>Job not found</h2>
        </div>
      </div>
    )
  }

  const salaryMin = job.salary_min / 100000
  const salaryMax = job.salary_max / 100000

  return (
    <div className="job-details-page">

      <Header />

      <div className="job-details-container">

        <h1 className="job-details-title">
          {job.title}
        </h1>

        <h2 className="job-details-company">
          {job.company_name}
        </h2>

        <div className="job-details-info">
          <p>📍 {job.location}</p>
          <p>💼 {job.job_type}</p>
          <p>🎓 {job.experience}</p>

          <p>
            💰 ₹{salaryMin} LPA - ₹{salaryMax} LPA
          </p>
        </div>

        <div className="details-section">
          <h3>Job Description</h3>

          <p>
            {job.description}
          </p>
        </div>

        <div className="details-section">
          <h3>Skills Required</h3>

          <p>
            {job.skills}
          </p>
        </div>

        <button
            type="button"
            className="apply-button"
            onClick={handleApply}
            disabled={isApplying}
            >
            {isApplying ? 'Applying...' : 'Apply Now'}
        </button>
      </div>


      {/* APPLICATION SUCCESS CARD */}

      {applicationStatus !== '' && (
        <div className="application-overlay">

          <div className="application-card">

            {applicationStatus === 'success' && (
              <>
                <div className="success-icon">
                  ✓
                </div>

                <h2>
                  Application Submitted!
                </h2>

                <p>
                  Your application has been
                  successfully submitted.
                </p>

                <button
                  type="button"
                  className="back-home-button"
                  onClick={handleBackHome}
                >
                  Back to Home
                </button>
              </>
            )}


            {applicationStatus === 'already-applied' && (
              <>
                <div className="already-icon">
                  !
                </div>

                <h2>
                  Already Applied
                </h2>

                <p>
                  You have already applied for
                  this job.
                </p>

                <button
                  type="button"
                  className="back-home-button"
                  onClick={handleBackHome}
                >
                  Back to Home
                </button>
              </>
            )}


            {applicationStatus === 'error' && (
              <>
                <div className="error-icon">
                  ×
                </div>

                <h2>
                  Something Went Wrong
                </h2>

                <p>
                  We couldn't submit your
                  application. Please try again.
                </p>

                <button
                  type="button"
                  className="back-home-button"
                  onClick={() =>
                    setApplicationStatus('')
                  }
                >
                  Try Again
                </button>
              </>
            )}

          </div>

        </div>
      )}

    </div>
  )
}

export default JobDetails