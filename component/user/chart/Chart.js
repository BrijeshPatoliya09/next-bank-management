import React from "react";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Chart = ({ options, series }) => {
  return (
    <ApexChart options={options} series={series} type="line" height={100} />
  );
};

export default Chart;
