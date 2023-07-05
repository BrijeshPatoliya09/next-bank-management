import { withSessionSsr } from "../../helper/session";

export default function Home({ dashboardData }) {
  return (
    <>
      <div className="dashboard">
        {/* <div className="row">
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
            <div className="card">
              <div className="card-header p-3 pt-2">
                <div className="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                  <i className="material-icons opacity-10">assignment_ind</i>
                </div>
                <div className="text-end pt-1">
                  <p className="text-sm mb-0 text-capitalize">Total Employee</p>
                  <h4 className="mb-0">$53k</h4>
                </div>
              </div>
              <hr className="dark horizontal my-0" />
              <div className="card-footer p-3">
                <p className="mb-0">
                  <span className="text-success text-sm font-weight-bolder">
                    +55%
                  </span>
                  than lask week
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
            <div className="card">
              <div className="card-header p-3 pt-2">
                <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                  <i className="material-icons opacity-10">person</i>
                </div>
                <div className="text-end pt-1">
                  <p className="text-sm mb-0 text-capitalize">Total Users</p>
                  <h4 className="mb-0">2,300</h4>
                </div>
              </div>
              <hr className="dark horizontal my-0" />
              <div className="card-footer p-3">
                <p className="mb-0">
                  <span className="text-success text-sm font-weight-bolder">
                    +3%
                  </span>
                  than lask month
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
            <div className="card">
              <div className="card-header p-3 pt-2">
                <div className="icon icon-lg icon-shape bg-gradient-success shadow-success text-center border-radius-xl mt-n4 position-absolute">
                  <i className="material-icons opacity-10">monetization_on</i>
                </div>
                <div className="text-end pt-1">
                  <p className="text-sm mb-0 text-capitalize">
                    Total Loan Provided
                  </p>
                  <h4 className="mb-0">3,462</h4>
                </div>
              </div>
              <hr className="dark horizontal my-0" />
              <div className="card-footer p-3">
                <p className="mb-0">
                  <span className="text-danger text-sm font-weight-bolder">
                    -2%
                  </span>
                  than yesterday
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6">
            <div className="card">
              <div className="card-header p-3 pt-2">
                <div className="icon icon-lg icon-shape bg-gradient-info shadow-info text-center border-radius-xl mt-n4 position-absolute">
                  <i className="material-icons opacity-10">group</i>
                </div>
                <div className="text-end pt-1">
                  <p className="text-sm mb-0 text-capitalize">
                    Total Transaction Done
                  </p>
                  <h4 className="mb-0">$103,430</h4>
                </div>
              </div>
              <hr className="dark horizontal my-0" />
              <div className="card-footer p-3">
                <p className="mb-0">
                  <span className="text-success text-sm font-weight-bolder">
                    +5%
                  </span>
                  than yesterday
                </p>
              </div>
            </div>
          </div>
        </div> */}
        <div className="row my-4">
          <div>
            <h2>Bank Data</h2>
          </div>
          {dashboardData.totalBanks.type == 0 && (
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2 bank-detail">
              <div class="cookieCard">
                <p class="align-items-center cookieHeading d-flex d-flex">
                  <i class="bi bi-bank2 fs-1 me-3"></i>Total Sub Banks
                </p>
                <h2 className="text-white fs-1 text-center">
                  {dashboardData.totalBanks.totalSubBanks}
                </h2>
              </div>
            </div>
          )}
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-cash-stack fs-1 me-3"></i>Total Balance
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.totalFunds}
              </h2>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2 bank-loans">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-piggy-bank-fill fs-1 me-3"></i>Total Loan Amount
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.loan.totalLoanAmount}
              </h2>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2 bank-trans">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi bi-cash-coin fs-1 me-3"></i>Total Transaction
                Amount
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.transaction.totalTransactionAmount}
              </h2>
            </div>
          </div>
        </div>
        <div className="row my-4">
          <div>
            <h2>Employee Data</h2>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-piggy-bank-fill fs-1 me-3"></i>Total Employees
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.employees.totalEmp}
              </h2>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-piggy-bank-fill fs-1 me-3"></i>Total Active
                Employees
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.employees.activeEmp}
              </h2>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-piggy-bank-fill fs-1 me-3"></i>Total Deactive
                Employees
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.employees.inactiveEmp}
              </h2>
            </div>
          </div>
        </div>
        {dashboardData.totalBanks.type == 1 && (
          <div className="row my-4 bank-detail">
            <div>
              <h2>Users Data</h2>
            </div>
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
              <div class="cookieCard">
                <p class="align-items-center cookieHeading d-flex">
                  <i class="bi bi-person-badge fs-1 me-3"></i>Total Users
                </p>
                <h2 className="text-white fs-1 text-center">
                  {dashboardData.totalBanks.totalUsers}
                </h2>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
              <div class="cookieCard">
                <p class="align-items-center cookieHeading d-flex">
                  <i class="bi bi-person-badge fs-1 me-3"></i>Total Pending
                  Users
                </p>
                <h2 className="text-white fs-1 text-center">
                  {dashboardData.totalBanks.pendingUsers}
                </h2>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
              <div class="cookieCard">
                <p class="align-items-center cookieHeading d-flex">
                  <i class="bi bi-person-badge fs-1 me-3"></i>Total Confirmed
                  Users
                </p>
                <h2 className="text-white fs-1 text-center">
                  {dashboardData.totalBanks.confirmedUsers}
                </h2>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
              <div class="cookieCard">
                <p class="align-items-center cookieHeading d-flex">
                  <i class="bi bi-person-badge fs-1 me-3"></i>Total Rejected
                  Users
                </p>
                <h2 className="text-white fs-1 text-center">
                  {dashboardData.totalBanks.rejectedUsers}
                </h2>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-4">
              <div class="cookieCard">
                <p class="align-items-center cookieHeading d-flex">
                  <i class="bi bi-person-badge fs-1 me-3"></i>Total Deactive
                  Users
                </p>
                <h2 className="text-white fs-1 text-center">
                  {dashboardData.totalBanks.closedUsers}
                </h2>
              </div>
            </div>
          </div>
        )}
        <div className="row my-4 bank-loans">
          <div>
            <h2>Loan Data</h2>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-piggy-bank-fill fs-1 me-3"></i>Total Loan
                Provided
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.loan.totalLoan}
              </h2>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-piggy-bank-fill fs-1 me-3"></i>Total Pending
                Loans
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.loan.pendingLoans}
              </h2>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-piggy-bank-fill fs-1 me-3"></i>Total Confirmed
                Loans
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.loan.confirmLoans}
              </h2>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-piggy-bank-fill fs-1 me-3"></i>Total Rejected
                Loans
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.loan.rejectedLoans}
              </h2>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-4">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-piggy-bank-fill fs-1 me-3"></i>Total Closed
                Loans
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.loan.closedLoans}
              </h2>
            </div>
          </div>
        </div>
        <div className="row my-4 bank-trans">
          <div>
            <h2>Transactions Data</h2>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-cash-coin fs-1 me-3"></i>Total Transactions
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.transaction.totalTrans}
              </h2>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-cash-coin fs-1 me-3"></i>Total Pending
                Transactions
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.transaction.pendingTrans}
              </h2>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-cash-coin fs-1 me-3"></i>Total Confirmed
                Transactions
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.transaction.confirmedTrans}
              </h2>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-2">
            <div class="cookieCard">
              <p class="align-items-center cookieHeading d-flex">
                <i class="bi bi-cash-coin fs-1 me-3"></i>Total Rejected
                Transactions
              </p>
              <h2 className="text-white fs-1 text-center">
                {dashboardData.transaction.rjectedTrans}
              </h2>
            </div>
          </div>
        </div>
        {/* <div className="row my-4">
          <div className="col-lg-8 col-md-6 mb-md-0 mb-4">
            <div className="card">
              <div className="card-header pb-0">
                <div className="row">
                  <div className="col-lg-6 col-7">
                    <h6>Projects</h6>
                    <p className="text-sm mb-0">
                      <i
                        className="fa fa-check text-info"
                        aria-hidden="true"
                      ></i>
                      <span className="font-weight-bold ms-1">30 done</span>
                      this month
                    </p>
                  </div>
                  <div className="col-lg-6 col-5 my-auto text-end">
                    <div className="dropdown float-lg-end pe-4">
                      <a
                        className="cursor-pointer"
                        id="dropdownTable"
                        aria-expanded="false"
                      >
                        <i className="fa fa-ellipsis-v text-secondary"></i>
                      </a>
                      <ul
                        className="dropdown-menu px-2 py-3 ms-sm-n4 ms-n5"
                        aria-labelledby="dropdownTable"
                      >
                        <li>
                          <a
                            className="dropdown-item border-radius-md"
                            href="#"
                          >
                            Action
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item border-radius-md"
                            href="#"
                          >
                            Another action
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item border-radius-md"
                            href="#"
                          >
                            Something else here
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body px-0 pb-2">
                <div className="table-responsive">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Companies
                        </th>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                          Members
                        </th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Budget
                        </th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                          Completion
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="d-flex px-2 py-1">
                            <div>
                              <img
                                src="/assets/image/admin/small-logos/logo-xd.svg"
                                className="avatar avatar-sm me-3"
                                alt="xd"
                              />
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <h6 className="mb-0 text-sm">
                                Material XD Version
                              </h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="avatar-group mt-2">
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Ryan Tompson"
                            >
                              <img
                                src="/assets/image/admin/team-1.jpg"
                                alt="team1"
                              />
                            </a>
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Romina Hadid"
                            >
                              <img
                                src="/assets/image/admin/team-2.jpg"
                                alt="team2"
                              />
                            </a>
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Alexander Smith"
                            >
                              <img
                                src="/assets/image/admin/team-3.jpg"
                                alt="team3"
                              />
                            </a>
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Jessica Doe"
                            >
                              <img
                                src="/assets/image/admin/team-4.jpg"
                                alt="team4"
                              />
                            </a>
                          </div>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <span className="text-xs font-weight-bold">
                            $14,000
                          </span>
                        </td>
                        <td className="align-middle">
                          <div className="progress-wrapper w-75 mx-auto">
                            <div className="progress-info">
                              <div className="progress-percentage">
                                <span className="text-xs font-weight-bold">
                                  60%
                                </span>
                              </div>
                            </div>
                            <div className="progress">
                              <div
                                className="progress-bar bg-gradient-info w-60"
                                role="progressbar"
                                aria-valuenow="60"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex px-2 py-1">
                            <div>
                              <img
                                src="/assets/image/admin/small-logos/logo-atlassian.svg"
                                className="avatar avatar-sm me-3"
                                alt="atlassian"
                              />
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <h6 className="mb-0 text-sm">
                                Add Progress Track
                              </h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="avatar-group mt-2">
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Romina Hadid"
                            >
                              <img
                                src="/assets/image/admin/team-2.jpg"
                                alt="team5"
                              />
                            </a>
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Jessica Doe"
                            >
                              <img
                                src="/assets/image/admin/team-4.jpg"
                                alt="team6"
                              />
                            </a>
                          </div>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <span className="text-xs font-weight-bold">
                            $3,000
                          </span>
                        </td>
                        <td className="align-middle">
                          <div className="progress-wrapper w-75 mx-auto">
                            <div className="progress-info">
                              <div className="progress-percentage">
                                <span className="text-xs font-weight-bold">
                                  10%
                                </span>
                              </div>
                            </div>
                            <div className="progress">
                              <div
                                className="progress-bar bg-gradient-info w-10"
                                role="progressbar"
                                aria-valuenow="10"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex px-2 py-1">
                            <div>
                              <img
                                src="/assets/image/admin/small-logos/logo-slack.svg"
                                className="avatar avatar-sm me-3"
                                alt="team7"
                              />
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <h6 className="mb-0 text-sm">
                                Fix Platform Errors
                              </h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="avatar-group mt-2">
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Romina Hadid"
                            >
                              <img
                                src="/assets/image/admin/team-3.jpg"
                                alt="team8"
                              />
                            </a>
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Jessica Doe"
                            >
                              <img
                                src="/assets/image/admin/team-1.jpg"
                                alt="team9"
                              />
                            </a>
                          </div>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <span className="text-xs font-weight-bold">
                            Not set
                          </span>
                        </td>
                        <td className="align-middle">
                          <div className="progress-wrapper w-75 mx-auto">
                            <div className="progress-info">
                              <div className="progress-percentage">
                                <span className="text-xs font-weight-bold">
                                  100%
                                </span>
                              </div>
                            </div>
                            <div className="progress">
                              <div
                                className="progress-bar bg-gradient-success w-100"
                                role="progressbar"
                                aria-valuenow="100"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex px-2 py-1">
                            <div>
                              <img
                                src="/assets/image/admin/small-logos/logo-spotify.svg"
                                className="avatar avatar-sm me-3"
                                alt="spotify"
                              />
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <h6 className="mb-0 text-sm">
                                Launch our Mobile App
                              </h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="avatar-group mt-2">
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Ryan Tompson"
                            >
                              <img
                                src="/assets/image/admin/team-4.jpg"
                                alt="user1"
                              />
                            </a>
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Romina Hadid"
                            >
                              <img
                                src="/assets/image/admin/team-3.jpg"
                                alt="user2"
                              />
                            </a>
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Alexander Smith"
                            >
                              <img
                                src="/assets/image/admin/team-4.jpg"
                                alt="user3"
                              />
                            </a>
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Jessica Doe"
                            >
                              <img
                                src="/assets/image/admin/team-1.jpg"
                                alt="user4"
                              />
                            </a>
                          </div>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <span className="text-xs font-weight-bold">
                            $20,500
                          </span>
                        </td>
                        <td className="align-middle">
                          <div className="progress-wrapper w-75 mx-auto">
                            <div className="progress-info">
                              <div className="progress-percentage">
                                <span className="text-xs font-weight-bold">
                                  100%
                                </span>
                              </div>
                            </div>
                            <div className="progress">
                              <div
                                className="progress-bar bg-gradient-success w-100"
                                role="progressbar"
                                aria-valuenow="100"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex px-2 py-1">
                            <div>
                              <img
                                src="/assets/image/admin/small-logos/logo-jira.svg"
                                className="avatar avatar-sm me-3"
                                alt="jira"
                              />
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <h6 className="mb-0 text-sm">
                                Add the New Pricing Page
                              </h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="avatar-group mt-2">
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Ryan Tompson"
                            >
                              <img
                                src="/assets/image/admin/team-4.jpg"
                                alt="user5"
                              />
                            </a>
                          </div>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <span className="text-xs font-weight-bold">$500</span>
                        </td>
                        <td className="align-middle">
                          <div className="progress-wrapper w-75 mx-auto">
                            <div className="progress-info">
                              <div className="progress-percentage">
                                <span className="text-xs font-weight-bold">
                                  25%
                                </span>
                              </div>
                            </div>
                            <div className="progress">
                              <div
                                className="progress-bar bg-gradient-info w-25"
                                role="progressbar"
                                aria-valuenow="25"
                                aria-valuemin="0"
                                aria-valuemax="25"
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex px-2 py-1">
                            <div>
                              <img
                                src="/assets/image/admin/small-logos/logo-invision.svg"
                                className="avatar avatar-sm me-3"
                                alt="invision"
                              />
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <h6 className="mb-0 text-sm">
                                Redesign New Online Shop
                              </h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="avatar-group mt-2">
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Ryan Tompson"
                            >
                              <img
                                src="/assets/image/admin/team-1.jpg"
                                alt="user6"
                              />
                            </a>
                            <a
                              href="#"
                              className="avatar avatar-xs rounded-circle"
                              title="Jessica Doe"
                            >
                              <img
                                src="/assets/image/admin/team-4.jpg"
                                alt="user7"
                              />
                            </a>
                          </div>
                        </td>
                        <td className="align-middle text-center text-sm">
                          <span className="text-xs font-weight-bold">
                            $2,000
                          </span>
                        </td>
                        <td className="align-middle">
                          <div className="progress-wrapper w-75 mx-auto">
                            <div className="progress-info">
                              <div className="progress-percentage">
                                <span className="text-xs font-weight-bold">
                                  40%
                                </span>
                              </div>
                            </div>
                            <div className="progress">
                              <div
                                className="progress-bar bg-gradient-info w-40"
                                role="progressbar"
                                aria-valuenow="40"
                                aria-valuemin="0"
                                aria-valuemax="40"
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="card h-100">
              <div className="card-header pb-0">
                <h6>Orders overview</h6>
                <p className="text-sm">
                  <i
                    className="fa fa-arrow-up text-success"
                    aria-hidden="true"
                  ></i>
                  <span className="font-weight-bold">24%</span> this month
                </p>
              </div>
              <div className="card-body p-3">
                <div className="timeline timeline-one-side">
                  <div className="timeline-block mb-3">
                    <span className="timeline-step">
                      <i className="material-icons text-success text-gradient">
                        notifications
                      </i>
                    </span>
                    <div className="timeline-content">
                      <h6 className="text-dark text-sm font-weight-bold mb-0">
                        $2400, Design changes
                      </h6>
                      <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
                        22 DEC 7:20 PM
                      </p>
                    </div>
                  </div>
                  <div className="timeline-block mb-3">
                    <span className="timeline-step">
                      <i className="material-icons text-danger text-gradient">
                        code
                      </i>
                    </span>
                    <div className="timeline-content">
                      <h6 className="text-dark text-sm font-weight-bold mb-0">
                        New order #1832412
                      </h6>
                      <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
                        21 DEC 11 PM
                      </p>
                    </div>
                  </div>
                  <div className="timeline-block mb-3">
                    <span className="timeline-step">
                      <i className="material-icons text-info text-gradient">
                        shopping_cart
                      </i>
                    </span>
                    <div className="timeline-content">
                      <h6 className="text-dark text-sm font-weight-bold mb-0">
                        Server payments for April
                      </h6>
                      <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
                        21 DEC 9:34 PM
                      </p>
                    </div>
                  </div>
                  <div className="timeline-block mb-3">
                    <span className="timeline-step">
                      <i className="material-icons text-warning text-gradient">
                        credit_card
                      </i>
                    </span>
                    <div className="timeline-content">
                      <h6 className="text-dark text-sm font-weight-bold mb-0">
                        New card added for order #4395133
                      </h6>
                      <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
                        20 DEC 2:20 AM
                      </p>
                    </div>
                  </div>
                  <div className="timeline-block mb-3">
                    <span className="timeline-step">
                      <i className="material-icons text-primary text-gradient">
                        key
                      </i>
                    </span>
                    <div className="timeline-content">
                      <h6 className="text-dark text-sm font-weight-bold mb-0">
                        Unlock packages for development
                      </h6>
                      <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
                        18 DEC 4:54 AM
                      </p>
                    </div>
                  </div>
                  <div className="timeline-block">
                    <span className="timeline-step">
                      <i className="material-icons text-dark text-gradient">
                        payments
                      </i>
                    </span>
                    <div className="timeline-content">
                      <h6 className="text-dark text-sm font-weight-bold mb-0">
                        New order #9583120
                      </h6>
                      <p className="text-secondary font-weight-bold text-xs mt-1 mb-0">
                        17 DEC
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const user = req.session.admin;

  if (user) {
    const homeRes = await fetch(
      `${process.env.apiUrl}/admin/dashboard/getData`,
      {
        method: "PUT",
        body: JSON.stringify({ userId: user.userId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const homeData = await homeRes.json();

    return {
      props: {
        dashboardData: homeData.data,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/admin/auth/login",
        permanent: false,
      },
    };
  }
});
