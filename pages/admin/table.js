import React, { useEffect, useState } from "react";
import AdminLayout from "../../component/admin/AdminLayout";
import { withSessionSsr } from "../../helper/session";
import { ToastContainer, toast } from "react-toastify";
import BankShowEdit from "../../component/admin/bank/BankShowEdit";
import EmployeeCreate from "../../component/admin/employee/EmployeeCreate";
import EmployeeTable from "../../component/admin/employee/EmployeeTable";
import BankTree from "../../component/admin/bank/BankTree";

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

  const [loader, setLoader] = useState(false);

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
    if (!loader) {
      setLoader(true);
      const res = await fetch(
        `${process.env.apiUrl}/admin/employee/getEmployeesData`,
        {
          method: "POST",
          body: JSON.stringify({ activeEmployee, page, sort, filter }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setLoader(false);

      setEmployeeData(data.data.empData);
      setBankData(data.data.bankData);
      setEmpCount(data.data.count);
      setDepartmentSelect(
        data.data.departmentSelect.map((item) => item.department)
      );
    }

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
      <AdminLayout>
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
            bankEmpLoader={loader}
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
      </AdminLayout>
    </>
  );
};

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const user = req.session.user;

  if (user) {
    const empRes = await fetch(`${process.env.apiUrl}/admin/employee/getData`, {
      method: "PUT",
      body: JSON.stringify({ userId: user.userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const empData = await empRes.json();

    const res = await fetch(`${process.env.apiUrl}/admin/bank/getTreeData`, {
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
