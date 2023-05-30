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
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
    label.onSetActiveEmp(label._id);
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
        className={`${classes.label} card d-flex px-3 py-2 w-100 ${
          label.active ? "tree_active border border-0" : "tree_hover"
        } ${label.highLight && "tree_highlight"}`}
        style={{ borderLeft: `3px solid ${label.color ? label.color : "red"}` }}
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

  let highLight = false;
  if (select == treeData._id) {
    highLight = true;
  }

  return (
    <TreeView
      aria-label="customized"

      expanded={selectCheck && selectCheck !== highLight ? [treeData._id] : []}
      defaultCollapseIcon={<MinusSquare />}
      defa
      defaultExpandIcon={<PlusSquare />}
      defaultEndIcon={<CloseSquare />}
    >
      <StyledTreeItem
        nodeId={treeData._id}
        label={{
          title: `${treeData.name} (${treeData.address.country})`,
          color: colorHandler(treeData),
          _id: treeData._id,
          onSetActiveEmp,
          active,
          highLight,
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
              selectCheck={highLight ? false : true}
            />
          ))}
      </StyledTreeItem>
    </TreeView>
  );
}
