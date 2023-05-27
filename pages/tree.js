import Layout from "../component/Layout";
import * as React from "react";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { alpha, styled } from "@mui/material/styles";
import TreeView from "@mui/lab/TreeView";
import TreeItem, {
  useTreeItem,
  TreeItemProps,
  treeItemClasses,
} from "@mui/lab/TreeItem";
import { Typography } from "@mui/material";

function MinusSquare(props) {
  return (
    <>
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
      </SvgIcon>
    </>
  );
}

function PlusSquare(props) {
  return (
    <>
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
      </SvgIcon>
    </>
  );
}

function CloseSquare(props) {
  return (
    <>
      <SvgIcon
        className="close"
        fontSize="inherit"
        style={{ width: 14, height: 14 }}
        {...props}
      >
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
      </SvgIcon>
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
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="d-flex align-items-center"
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className="pe-2">
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={`${classes.label} card d-flex px-3 py-2`}
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
  ({ color }) => ({
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
      // marginLeft: 6,
      // paddingLeft: 40,
      borderLeft: `2px solid ${color ? color : "red"}`,
      // fontSize: 34,
    },
  })
);

function CustomizedTreeView({ treeData }) {
  return (
    // <TreeView
    //   aria-label="customized"
    //   //   defaultExpanded={["2"]}
    //   defaultCollapseIcon={<MinusSquare />}
    //   defaultExpandIcon={<PlusSquare />}
    //   defaultEndIcon={<CloseSquare />}
    // >
    //   <StyledTreeItem nodeId="1" label="Main">
    //     <StyledTreeItem nodeId="2" label="Hello" />
    //     <StyledTreeItem
    //       nodeId="3"
    //       color="green"
    //       label={{ title: "Subtree with children", color: "green" }}
    //     >
    //       <StyledTreeItem nodeId="6" label="Hello" />
    //       <StyledTreeItem nodeId="7" label="Sub-subtree with children">
    //         <StyledTreeItem nodeId="9" label="Child 1" />
    //         <StyledTreeItem nodeId="10" label="Child 2" />
    //         <StyledTreeItem nodeId="11" label="Child 3" />
    //       </StyledTreeItem>
    //       <StyledTreeItem nodeId="8" label="Hello" />
    //     </StyledTreeItem>
    //     <StyledTreeItem nodeId="4" label="World" />
    //     <StyledTreeItem nodeId="5" label="Something something" />
    //   </StyledTreeItem>
    // </TreeView>

    <TreeView
      aria-label="customized"
      //   defaultExpanded={["2"]}
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      defaultEndIcon={<CloseSquare />}
    >
      <StyledTreeItem
        nodeId="1"
        label={`${treeData.name} ${treeData.address.country}`}
      >
        {treeData.children.length > 0 &&
          treeData.children.map((item) => (
            <CustomizedTreeView treeData={treeData.children} />
          ))}
      </StyledTreeItem>
    </TreeView>
  );
}

const tree = () => {
  return (
    <>
      <a
        class="btn btn-primary"
        data-bs-toggle="offcanvas"
        href="#offcanvasExample"
        role="button"
        aria-controls="offcanvasExample"
      >
        Link with href
      </a>
      <button
        class="btn btn-primary"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample"
      >
        Button with data-bs-target
      </button>

      <div
        class="offcanvas offcanvas-start"
        tabindex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasExampleLabel">
            Offcanvas
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <div>
            Some text as placeholder. In real life you can have the elements you
            have chosen. Like, text, images, lists, etc.
          </div>
          <div class="dropdown mt-3">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Dropdown button
            </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default tree;
