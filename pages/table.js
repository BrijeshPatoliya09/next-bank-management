import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import Tree from "../component/tree/Tree";
import { withSessionSsr } from "../helper/session";
import { ToastContainer, toast } from "react-toastify";
import BankShowEdit from "../component/bank/BankShowEdit";
import EmployeeCreate from "../component/employee/EmployeeCreate";
import EmployeeTable from "../component/employee/EmployeeTable";

const table = ({ data, empData }) => {
  const [activeEmployee, setActiveEmployeeData] = useState(
    empData[0].bankInfo[0]._id
  );
  const [employeeData, setEmployeeData] = useState([]);
  const [bankData, setBankData] = useState(empData[0].bankInfo);
  const [empModel, setEmpModel] = useState(0);
  const [empEdit, setEmpEdit] = useState("");
  const [empCount, setEmpCount] = useState("");
  const [empType, setEmpType] = useState(false);

  const getEmployeeData = async (page = 0, sort = { name: "asc" }) => {
    const res = await fetch(
      `${process.env.baseUrl}/api/employee/getEmployeesData`,
      {
        method: "POST",
        body: JSON.stringify({ activeEmployee, page, sort }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    setEmployeeData(data.data.empData);
    setBankData(data.data.bankData);
    setEmpCount(data.data.count);
    if (
      activeEmployee == empData[0].bankInfo[0]._id &&
      empData[0].employeeType == 1
    ) {
      setEmpType(true);
    } else {
      setEmpType(false);
    }
  };

  useEffect(() => {
    getEmployeeData();
  }, [activeEmployee]);

  return (
    <>
      <Layout>
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                  <h6 className="text-white text-capitalize ps-3">Bank Tree</h6>
                </div>
              </div>
              <div className="card-body px-3 pb-2">
                {data.map((item) => (
                  <Tree
                    key={item._id}
                    treeData={item}
                    onSetActiveEmp={setActiveEmployeeData}
                    empId={activeEmployee}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <BankShowEdit bankData={bankData[0]} onGetEmpData={getEmployeeData} />
        {empModel == 0 && (
          <EmployeeTable
            employeeData={employeeData}
            onSetEmpModel={setEmpModel}
            onSetEmpEdit={setEmpEdit}
            onGetEmpData={getEmployeeData}
            empCount={empCount}
            empType={empType}
          />
        )}
        {empModel == 1 && (
          <EmployeeCreate
            onSetEmpModel={setEmpModel}
            bankId={activeEmployee}
            onGetEmpData={getEmployeeData}
            empEdit={empEdit}
          />
        )}
        <ToastContainer />
      </Layout>
    </>
  );
};

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const user = req.session.user;

  if (user) {
    const empRes = await fetch(`${process.env.baseUrl}/api/employee/getData`, {
      method: "PUT",
      body: JSON.stringify({ userId: user.userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const empData = await empRes.json();

    const res = await fetch(`${process.env.baseUrl}/api/bank/getTreeData`, {
      method: "PUT",
      body: JSON.stringify({
        bankData: {
          address: empData.data[0].bankInfo[0].address,
          level: empData.data[0].bankInfo[0].level,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    return {
      props: {
        data: data.data,
        empData: empData.data,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
});

export default table;
