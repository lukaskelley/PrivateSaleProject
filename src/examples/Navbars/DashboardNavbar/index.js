/* eslint-disable no-shadow */
/* eslint-disable import/no-extraneous-dependencies */
import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

import { injected } from "hooks/connect";
// Material Dashboard 2 React example components

// Custom styles for DashboardNavbar
import { navbar, navbarContainer, navbarRow } from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import { useMaterialUIController, setTransparentNavbar, setMiniSidenav } from "context";

import connectedIcon from "../../../assets/images/connectedIcon.png";

function DashboardNavbar({ absolute, light, isMini }) {
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  const { account, chainId, activate, deactivate } = useWeb3React();
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, fixedNavbar, darkMode } = controller;

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  // Styles for the navbar icons
  // const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
  //   color: () => {
  //     let colorValue = light || darkMode ? white.main : dark.main;

  //     if (transparentNavbar && !light) {
  //       colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
  //     }

  //     return colorValue;
  //   },
  // });

  // Disconnect Function

  async function connect() {
    if (chainId !== 19 || chainId === undefined) {
      console.log(chainId);
    }
    try {
      await activate(injected);
      localStorage.setItem("isWalletConnected", true);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", false);
      window.location.reload();
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
          localStorage.setItem("isWalletConnected", true);
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  // useEffect(() => {
  //   const provider = window.localStorage.getItem("isWalletConnected");
  //   if (provider) activate(injected[provider]);
  // }, []);

  return (
    <AppBar
      style={{ zIndex: "10" }}
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { navbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <IconButton
            size="small"
            disableRipple
            color="inherit"
            onClick={handleMiniSidenav}
            style={{ background: "rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}
          >
            {!miniSidenav ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </IconButton>
        </MDBox>
        <MDBox
          sx={(theme) => navbarRow(theme, { isMini })}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <MDBox color={light ? "white" : "inherit"}>
            {account ? (
              <MDButton color="info" onClick={() => disconnect()}>
                <img
                  src={connectedIcon}
                  alt="connectedIcon"
                  style={{ width: "30px", paddingRight: "6%" }}
                />{" "}
                {account.slice(0, 4)} ... {account.slice(-4)}
              </MDButton>
            ) : (
              <MDButton color="info" onClick={() => connect()}>
                <img
                  src={connectedIcon}
                  alt="connectedIcon"
                  style={{ width: "30px", paddingRight: "6%" }}
                />{" "}
                Connect Wallet
              </MDButton>
            )}
          </MDBox>
        </MDBox>
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
