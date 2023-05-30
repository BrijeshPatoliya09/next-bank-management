import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import { withSessionSsr } from "../helper/session";
import { ToastContainer, toast } from "react-toastify";
import BankShowEdit from "../component/bank/BankShowEdit";
import EmployeeCreate from "../component/employee/EmployeeCreate";
import EmployeeTable from "../component/employee/EmployeeTable";
import BankTree from "../component/bank/BankTree";

const table = ({ data, empData, treeSelectBox }) => {
  const [activeEmployee, setActiveEmployeeData] = useState(
    empData[0].bankInfo[0]._id
  );
  const [employeeData, setEmployeeData] = useState([]);
  const [bankData, setBankData] = useState(empData[0].bankInfo);
  const [empModel, setEmpModel] = useState(0);
  const [empEdit, setEmpEdit] = useState("");
  const [empCount, setEmpCount] = useState("");
  const [empType, setEmpType] = useState(false);

  //EmployeTable
  const [departmentSelect, setDepartmentSelect] = useState([]);

  const getEmployeeData = async (
    page = 0,
    sort = { name: "asc" },
    filter = {
      name: "",
      department: "",
      joinningDate: [],
    }
  ) => {
    const res = await fetch(
      `${process.env.baseUrl}/api/employee/getEmployeesData`,
      {
        method: "POST",
        body: JSON.stringify({ activeEmployee, page, sort, filter }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    setEmployeeData(data.data.empData);
    setBankData(data.data.bankData);
    setEmpCount(data.data.count);
    setDepartmentSelect(
      data.data.departmentSelect.map((item) => item.department)
    );
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
        <BankTree
          data={data}
          setActiveEmployeeData={setActiveEmployeeData}
          activeEmployee={activeEmployee}
          select={treeSelectBox}
        />
        <BankShowEdit bankData={bankData[0]} onGetEmpData={getEmployeeData} />
        {empModel == 0 && (
          <EmployeeTable
            employeeData={employeeData}
            onSetEmpModel={setEmpModel}
            onSetEmpEdit={setEmpEdit}
            onGetEmpData={getEmployeeData}
            empCount={empCount}
            empType={empType}
            departmentSelect={departmentSelect}
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
        data: data.data.newData,
        treeSelectBox: data.data.selectBox,
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
