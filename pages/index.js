import React from "react";

const home = () => {
  return (
    <>
      <h1>Home Page</h1>
    </>
  );
};

export const getServerSideProps = () => {
  return {
    redirect: {
      destination: "/user",
      permanent: false,
    },
  };
};

export default home;
