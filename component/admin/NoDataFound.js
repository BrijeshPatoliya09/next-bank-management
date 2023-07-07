import Image from "next/image";
import React from "react";

const NoDataFound = () => {
  return (
    <tr>
      <td colSpan={14} className="py-5">
        <Image
          src="/assets/image/admin/nodata.png"
          height={200}
          width={200}
          alt="no-data-found"
        ></Image>
      </td>
    </tr>
  );
};

export default NoDataFound;
