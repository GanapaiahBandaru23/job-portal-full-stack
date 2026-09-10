import {Link} from 'react-router-dom'

import './index.css'

const JobCard = ({jobDetails}) => {
  const {
    id,
    title,
    company_name,
    location,
    job_type,
    experience,
    salary_min,
    salary_max,
    skills,
  } = jobDetails

  const salaryMin = salary_min / 100000
  const salaryMax = salary_max / 100000

  return (
    <li className="job-card">
      <Link
        to={`/jobs/${id}`}
        className="job-link"
      >
        <div className="job-header">
          <h2 className="job-title">{title}</h2>

          <p className="company-name">
            {company_name}
          </p>
        </div>

        <div className="job-info">
          <p>📍 {location}</p>

          <p>💼 {job_type}</p>

          <p>🎓 {experience}</p>

          <p>
            💰 ₹{salaryMin} LPA - ₹{salaryMax} LPA
          </p>
        </div>

        <div className="job-skills">
          <h3>Skills</h3>

          <p>{skills}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobCard