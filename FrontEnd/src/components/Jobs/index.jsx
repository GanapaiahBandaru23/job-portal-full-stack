
import {useEffect, useState} from 'react'
import {BsSearch} from 'react-icons/bs'
import {ThreeDots} from 'react-loader-spinner'

import Header from '../Header'
import JobCard from '../JobCard'

import './index.css'

const Jobs = () => {
  const [jobsList, setJobsList] = useState([])
  const [filteredJobsList, setFilteredJobsList] = useState([])

  const [searchInput, setSearchInput] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // API CALL
  useEffect(() => {
    getJobs()
  }, [])

  const getJobs = async () => {
    setIsLoading(true)
    setIsError(false)

    try {
      const response = await fetch('https://job-portal-full-stack-vxtg.onrender.com/jobs')

      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }

      const data = await response.json()

      setJobsList(data)
      setFilteredJobsList(data)
    } catch (error) {
      console.log('JOBS FETCH ERROR:', error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  // SEARCH
  const handleSearch = () => {
    const searchText = searchInput.trim().toLowerCase()

    if (searchText === '') {
      setFilteredJobsList(jobsList)
      return
    }

    const filteredJobs = jobsList.filter(eachJob =>
      eachJob.title.toLowerCase().includes(searchText)
    )

    setFilteredJobsList(filteredJobs)
  }

  // ENTER KEY SEARCH
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  // SEARCH BAR
  const renderSearchBar = () => {
    return (
      <div className="search-bar">
        <input
          type="search"
          className="search-input"
          placeholder="Search Jobs"
          value={searchInput}
          onChange={event => setSearchInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          className="search-button"
          onClick={handleSearch}
          aria-label="Search Jobs"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  // NO JOBS
  const renderNoJobsView = () => {
    return (
      <div className="no-jobs-container">
        <h1 className="no-jobs-heading">
          No Jobs Found
        </h1>

        <p className="no-jobs-description">
          We could not find any jobs.
          Try another search.
        </p>
      </div>
    )
  }

  // JOBS LIST
  const renderJobsList = () => {
    if (filteredJobsList.length === 0) {
      return renderNoJobsView()
    }

    return (
      <ul className="jobs-list">
        {filteredJobsList.map(eachJob => (
          <JobCard
            key={eachJob.id}
            jobDetails={eachJob}
          />
        ))}
      </ul>
    )
  }

  // LOADER
  const renderLoader = () => {
    return (
      <div
        className="jobs-loader-container"
        data-testid="loader"
      >
        <ThreeDots
          visible={true}
          height="50"
          width="50"
          color="#ffffff"
          radius="9"
          ariaLabel="three-dots-loading"
        />
      </div>
    )
  }

  // ERROR
  const renderFailureView = () => {
    return (
      <div className="jobs-api-failure-container">
        <h1 className="failure-view-heading">
          Oops! Something Went Wrong
        </h1>

        <p className="failure-view-description">
          We cannot seem to find the jobs right now.
        </p>

        <button
          type="button"
          className="retry-button"
          onClick={getJobs}
        >
          Retry
        </button>
      </div>
    )
  }

  // WHAT TO SHOW
  const renderJobs = () => {
    if (isLoading) {
      return renderLoader()
    }

    if (isError) {
      return renderFailureView()
    }

    return renderJobsList()
  }

  return (
    <div className="jobs-page-container">

      <Header />

      <div className="jobs-page">

        <div className="jobs-container">

          {renderSearchBar()}

          {renderJobs()}

        </div>

      </div>

    </div>
  )
}

export default Jobs