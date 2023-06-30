import * as React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AdjustIcon from "@mui/icons-material/Adjust";
import { alpha, styled } from "@mui/material/styles";
import TreeView from "@mui/lab/TreeView";
import TreeItem, {
  useTreeItem,
  TreeItemProps,
  treeItemClasses,
} from "@mui/lab/TreeItem";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";

function MinusSquare(props) {
  return (
    <>
      <RemoveCircleOutlineIcon style={{ width: 20, height: 20 }} />
    </>
  );
}

function PlusSquare(props) {
  return (
    <>
      <AddCircleOutlineIcon style={{ width: 20, height: 20 }} />
    </>
  );
}

function CloseSquare(props) {
  return (
    <>
      <AdjustIcon style={{ width: 20, height: 20 }} />
    </>
  );
}

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    color,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const { handleExpansion, handleSelection, preventSelection } =
    useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
    label.expandHandler();
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
    label.onSetActiveEmp({ bankId: label._id, ifsc: label.ifscCode });
    handleExpansionClick(event);
  };

  return (
    <div
      className="d-flex align-items-center mt-3"
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      <div onClick={handleExpansionClick} className="pe-2">
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={`${classes.label} d-flex px-3 py-2 w-100 ${
          label.active ? "tree_active border border-0" : "tree_hover"
        } ${label.highLight ? (!label.active ? "tree_highlight" : "") : ""}`}
        style={{
          borderLeft: `3px solid ${label.color ? label.color : "red"}`,
          borderRadius: "8px",
        }}
      >
        {label.color ? label.title : label}
      </Typography>
    </div>
  );
});

function CustomTreeItem(props) {
  return <TreeItem ContentComponent={CustomContent} {...props} />;
}

const StyledTreeItem = styled((props) => <CustomTreeItem {...props} />)(
  ({ label: { color } }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      "& .close": {
        opacity: 0.3,
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 6,
      paddingLeft: 40,
      borderLeft: `2px solid ${color ? color : "red"}`,
      fontSize: 34,
    },
    [`& .${treeItemClasses.content}`]: {
      marginLeft: 6,
      paddingLeft: 40,
      borderLeft: `2px solid ${color ? color : "red"}`,
      fontSize: 34,
    },
  })
);

export default function Tree({
  treeData,
  onSetActiveEmp,
  empId,
  select,
  selectCheck,
}) {
  let highLight = false;
  if (select.length > 0) {
    if (select[0]._id == treeData._id) {
      highLight = true;
    }
  }

  const [expand, setExpand] = useState([]);

  const expandHandler = () => {
    if (expand.length > 0) {
      setExpand([]);
    } else {
      setExpand([treeData._id]);
    }
  };

  const colorHandler = (data) => {
    let color;

    if (data.level == 1) {
      color = "#3a5d8c";
    } else if (data.level == 2) {
      color = "#699ebf";
    } else if (data.level == 3) {
      color = "#f2d22e";
    } else if (data.level == 4) {
      color = "#f2bb77";
    } else {
      color = "#a66946";
    }

    return color;
  };

  let active = false;
  if (empId == treeData._id) {
    active = true;
  } else {
    active = false;
  }

  let addName = "";
  if (treeData.level == 1 || treeData.level == 2) {
    addName = treeData.address.country;
  } else if (treeData.level == 3) {
    addName = treeData.address.state;
  } else if (treeData.level == 4) {
    addName = treeData.address.city;
  } else {
    addName = treeData.address.zone;
  }

  return (
    <>
      <TreeView
        aria-label="customized"
        expanded={
          expand.length > 0
            ? expand
            : selectCheck &&
              selectCheck !== highLight &&
              select[0].level !== treeData.level
            ? [treeData._id]
            : expand
        }
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
      >
        <StyledTreeItem
          nodeId={treeData._id}
          label={{
            title: `${treeData.name} (${addName})`,
            color: colorHandler(treeData),
            _id: treeData._id,
            ifscCode: treeData.ifscCode,
            onSetActiveEmp,
            active,
            highLight,
            expandHandler,
          }}
        >
          {treeData.children.length > 0 &&
            treeData.children.map((item) => (
              <Tree
                key={item._id}
                treeData={item}
                onSetActiveEmp={onSetActiveEmp}
                empId={empId}
                select={highLight ? "" : select}
                selectCheck={
                  select.length > 0
                    ? select[0].level == treeData.level || highLight
                      ? false
                      : true
                    : false
                }
              />
            ))}
        </StyledTreeItem>
      </TreeView>
    </>
  );
}
