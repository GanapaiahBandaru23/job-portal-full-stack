import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="home-container">
    <Header />

    <div className="home-page">
      <div className="home-page-content">

        <h1 className="home-heading">
          Find The Job That Fits Your Life
        </h1>

        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>

        <div className="home-buttons">

          <Link to="/jobs">
            <button
              className="find-jobs-button"
              type="button"
            >
              Find Jobs
            </button>
          </Link>

          <Link to="/my-applications">
            <button
              className="my-applications-button"
              type="button"
            >
              My Applications
            </button>
          </Link>

        </div>

      </div>
    </div>
  </div>
)

export default Home