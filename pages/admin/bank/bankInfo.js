import React from "react";

const bankInfo = () => {
  return (
    <>
      <div className="row bank-reg">
        <div className="col-12 d-flex">
          <div className="col-6 px-2 me-2">
            <BankTree
              data={data}
              setActiveEmployeeData={setActiveEmployeeData}
              activeEmployee={activeEmployee.bankId}
              select={treeSelectBox}
            />
          </div>
          <div className="col-6 px-2">
            <BankShowEdit
              bankData={bankData[0]}
              onGetEmpData={getEmployeeData}
              empType={empType}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default bankInfo;
