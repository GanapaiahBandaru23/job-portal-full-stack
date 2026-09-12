import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import Header from '../Header'

import './index.css'

const MyApplications = () => {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    getApplications()
  }, [])

  const getApplications = async () => {
    try {
      const token = Cookies.get('jwt_token')

      const response = await fetch(
        'https://job-portal-full-stack-vxtg.onrender.com/applications',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(
          'Failed to fetch applications',
        )
      }

      const data = await response.json()

      setApplications(data)
    } catch (error) {
      console.log(
        'APPLICATIONS ERROR:',
        error,
      )

      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="my-applications-page">

        <Header />

        <div className="applications-container">
          <p>Loading...</p>
        </div>

      </div>
    )
  }

  if (isError) {
    return (
      <div className="my-applications-page">

        <Header />

        <div className="applications-container">

          <h1>My Applications</h1>

          <div className="no-applications">

            <h2>
              Something Went Wrong
            </h2>

            <p>
              We could not fetch your
              applications.
            </p>

            <button
              type="button"
              className="view-job-button"
              onClick={getApplications}
            >
              Retry
            </button>

          </div>

        </div>

      </div>
    )
  }

  return (
    <div className="my-applications-page">

      <Header />

      <div className="applications-container">

        <h1>
          My Applications
        </h1>

        {applications.length === 0 ? (

          <div className="no-applications">

            <h2>
              No Applications Yet
            </h2>

            <p>
              You haven't applied for any jobs.
            </p>

            <button
              type="button"
              className="view-job-button"
              onClick={() => navigate('/jobs')}
            >
              Find Jobs
            </button>

          </div>

        ) : (

          <ul className="applications-list">

            {applications.map(application => (

              <li
                key={application.id}
                className="application-card"
              >

                <h2>
                  {application.title}
                </h2>

                <p>
                  🏢 {application.company_name}
                </p>

                <p>
                  📍 {application.location}
                </p>

                <p>
                  💼 {application.job_type}
                </p>

                <p>
                  🎓 {application.experience}
                </p>

                <p>
                  💰 ₹
                  {application.salary_min / 100000}
                  {' '}LPA - ₹
                  {application.salary_max / 100000}
                  {' '}LPA
                </p>

                <p>
                  📅 Applied on:{' '}

                  {new Date(
                    application.applied_at,
                  ).toLocaleDateString()}
                </p>

                <p>
                  Status:

                  <span className="status">
                    {application.status}
                  </span>
                </p>

                <button
                  type="button"
                  className="view-job-button"
                  onClick={() =>
                    navigate(
                      `/jobs/${application.job_id}`,
                    )
                  }
                >
                  View Job
                </button>

              </li>

            ))}

          </ul>

        )}

      </div>

    </div>
  )
}

export default MyApplications