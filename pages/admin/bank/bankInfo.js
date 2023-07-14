import React, { useEffect, useState } from "react";
import { withSessionSsr } from "../../../helper/session";
import BankTree from "../../../component/admin/bank/BankTree";
import BankShowEdit from "../../../component/admin/bank/BankShowEdit";
import { getTreeData } from "../../../helper/common";

const bankInfo = ({ data, empData, treeSelectBox }) => {
  const [activeEmployee, setActiveEmployeeData] = useState({
    bankId: empData[0].bankInfo[0]._id,
    ifsc: empData[0].bankInfo[0].ifscCode,
  });
  const [treeData, setTreeData] = useState(data);
  const [empType, setEmpType] = useState(false);
  const [bankData, setBankData] = useState(empData[0].bankInfo);

  const getBankData = async () => {
    const res = await fetch(`${process.env.apiUrl}/admin/bank/getTableData`, {
      method: "POST",
      body: JSON.stringify({
        activeEmployee: activeEmployee.bankId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setBankData(data.data);

    if (
      activeEmployee.bankId == empData[0].bankInfo[0]._id &&
      empData[0].employeeType == 1
    ) {
      setEmpType(true);
    } else {
      setEmpType(false);
    }
  };

  useEffect(() => {
    getBankData();
  }, [activeEmployee]);

  return (
    <>
      <div className="row bank-reg">
        <div className="col-12 d-flex">
          <BankTree
            data={treeData}
            setActiveEmployeeData={setActiveEmployeeData}
            activeEmployee={activeEmployee.bankId}
            select={treeSelectBox}
          />
        </div>
      </div>
      <div className="row bank-reg">
        <div className="col-12 d-flex">
          <BankShowEdit
            bankData={bankData[0]}
            empType={empType}
            empBankData={empData[0].bankInfo[0]}
            onSetTree={setTreeData}
          />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const user = req.session.admin;

  if (user) {
    const empRes = await fetch(`${process.env.apiUrl}/admin/employee/getData`, {
      method: "PUT",
      body: JSON.stringify({ userId: user.userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const empData = await empRes.json();

    const data = await getTreeData(
      empData.data[0].bankInfo[0].address,
      empData.data[0].bankInfo[0].level
    );

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
        destination: "/admin/auth/login",
        permanent: false,
      },
    };
  }
});

export default bankInfo;
