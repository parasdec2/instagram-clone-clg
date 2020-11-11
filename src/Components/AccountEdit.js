// import React from "react";
// import "./css/AccountEdit.css";
// function AccountEdit() {
//   return (
//     <div className="accountEdit">
//       <div className="accountEdit_Left">
//         <h3>Left</h3>
//       </div>
//       <div className="accountEdit_Right">
//         <h3>Right</h3>
//       </div>
//     </div>
//   );
// }

// export default AccountEdit;

import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import EditProfile from "./EditProfile";
import { Email } from "@material-ui/icons";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%",
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "100vh",
    marginTop: "10px",
    padding: "5px",
    border: "1px solid gray",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function AccountEdit() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
        textColor="black"
        indicatorColor="primary"
      >
        <Tab
          label="Edit Profile"
          {...a11yProps(0)}
          style={{ borderRightColor: "black" }}
        />
        <Tab label="Change Password" {...a11yProps(1)} />
        <Tab label="Email Address" {...a11yProps(2)} />
        <Tab label="Diable Account" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <EditProfile />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* <EmailEdit /> */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
    </div>
  );
}
