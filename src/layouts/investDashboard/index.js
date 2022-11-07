/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { Link } from "react-router-dom";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Cards from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import { Card, Progress, Switch, Spin } from "antd";
import MDButton from "components/MDButton";

import config from "config/config";
import noIMG from "../../assets/images/noIMG.png";
import STANDARDPRESALEABI from "../../assets/abi/STANDARDPRESALEABI.json";
import PRESALEFACTORYMANAGERABI from "../../assets/abi/PRESALEFACTORYMANAGERABI.json";
import CountDown from "./CountDown";

const ethers = require("ethers");

function InvestDashboard() {
  const { account } = useWeb3React();
  const [presaleArray, setPresaleArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState(false);

  const Provider = new ethers.providers.Web3Provider(window.ethereum);
  const Signer = Provider.getSigner();
  const presaleFactoryContract = new ethers.Contract(
    config.PresaleFactoryManager,
    PRESALEFACTORYMANAGERABI,
    Signer
  );

  const array = [];
  const getPresaleData = async () => {
    setLoading(true);
    await presaleFactoryContract.getAllPresales().then(async (data) => {
      if (data.length === 0) {
        setDataState(false);
        setLoading(false);
      } else {
        setDataState(true);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.length; i++) {
          const standardFactoryContract = new ethers.Contract(
            data[i].presaleAddress,
            STANDARDPRESALEABI,
            Signer
          );
          // eslint-disable-next-line no-await-in-loop, camelcase
          const live_state = await standardFactoryContract.getIsLive();
          // eslint-disable-next-line no-underscore-dangle, camelcase, no-await-in-loop
          const remain_amount = await standardFactoryContract.getRemainingTokens();
          // eslint-disable-next-line no-await-in-loop, no-underscore-dangle, camelcase
          const start_Time = await standardFactoryContract._startTime();
          // eslint-disable-next-line no-underscore-dangle, no-await-in-loop
          const period = await standardFactoryContract._period();
          // eslint-disable-next-line no-await-in-loop, camelcase, no-underscore-dangle
          const logo_url = await standardFactoryContract._logoUrl();
          console.log(Number(start_Time), Number(period));

          array.push({
            contractAddress: data[i].presaleAddress.toString(),
            liveState: live_state,
            logoUrl: logo_url,
            startTimeStamp: Number(start_Time),
            endTimeStamp: Number(start_Time) + Number(period),
            tokenPrice: Number(data[i].tokenPrice) / 1000000,
            totalAmount: Number(data[i].totalMaxAmount) / 1000000,
            minContriAmount: Number(data[i].minInvestAmount),
            maxContriAmount: Number(data[i].maxInvestAmount),
            remainAmount: Number(remain_amount) / 1000000,
          });
        }
      }
    });
    console.log(array[0].startTimeStamp, array[0].endTimeStamp);
    setPresaleArray(array);
    setLoading(false);
  };

  useEffect(async () => {
    account && getPresaleData();
  }, [account]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox style={{ minHeight: "500px" }} pt={7}>
        <Cards>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="error"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white" textAlign="center">
              Invest Dashboard
            </MDTypography>
          </MDBox>
          {account ? (
            <>
              {loading ? (
                <Spin style={{ margin: "4%" }} />
              ) : (
                <>
                  {dataState ? (
                    <Grid container spacing={1} py={5} px={1}>
                      {presaleArray.map((presale, index) => (
                        <Grid
                          item
                          xs={12}
                          xl={4}
                          md={6}
                          sm={6}
                          mt={3}
                          style={{
                            justifyContent: "center",
                            width: "100%",
                            display: "flex",
                          }}
                          key={index}
                        >
                          <Card
                            hoverable
                            style={{
                              boxShadow: "0 0 30px 0 rgb(0 0 0 / 5%)",
                              border: "0",
                              width: 340,
                              borderRadius: "10px",
                            }}
                          >
                            <MDBox
                              style={{ width: "100%", display: "flex", justifyContent: "center" }}
                            >
                              <img
                                alt="example"
                                src={presale.logoUrl === "" ? noIMG : presale.logoUrl}
                                style={{ width: "50%", borderRadius: "50%" }}
                              />
                            </MDBox>
                            <MDTypography variant="h4" color="error" textAlign="center" mt={1}>
                              {presale && presale.contractAddress.slice(0, 10)}...{" "}
                              {presale && presale.contractAddress.slice(-5)}
                            </MDTypography>
                            <Grid container spacing={1} py={1}>
                              <Grid
                                item
                                xs={6}
                                xl={6}
                                md={6}
                                sm={6}
                                mt={3}
                                style={{
                                  justifyContent: "start",
                                  width: "100%",
                                  display: "flex",
                                }}
                              >
                                <Switch
                                  style={{ marginTop: "4%" }}
                                  checkedChildren="On"
                                  unCheckedChildren="Off"
                                  checked={presale.liveState}
                                />
                              </Grid>
                              <Grid
                                item
                                xs={6}
                                xl={6}
                                md={6}
                                sm={6}
                                mt={3}
                                style={{
                                  justifyContent: "end",
                                  width: "100%",
                                  display: "flex",
                                }}
                              >
                                <MDButton color="light" mt={3}>
                                  Verified
                                </MDButton>
                              </Grid>
                            </Grid>
                            <Progress
                              percent={parseFloat(
                                ((presale.totalAmount - presale.remainAmount) /
                                  presale.totalAmount) *
                                  100
                              ).toFixed(2)}
                              status="active"
                            />
                            <MDTypography variant="h6" color="error" textAlign="center" mt={2}>
                              {parseFloat(
                                (presale.totalAmount - presale.remainAmount) / presale.tokenPrice
                              ).toFixed(2)}{" "}
                              / {parseFloat(presale.totalAmount / presale.tokenPrice).toFixed(2)}{" "}
                              BNB
                            </MDTypography>
                            <CountDown
                              startTime={presale.startTimeStamp}
                              EndTime={presale.endTimeStamp}
                            />
                            <Link to={`/presale/${presale.contractAddress}`}>
                              <MDButton color="error" mt={3} style={{ width: "100%" }}>
                                {" "}
                                <MDTypography variant="h7" color="light">
                                  See Project Detail
                                </MDTypography>
                              </MDButton>
                            </Link>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <>
                      {" "}
                      <MDTypography
                        variant="h6"
                        color="dark"
                        textAlign="center"
                        p={3}
                        style={{ width: "100%" }}
                      >
                        No Data
                        <br />
                      </MDTypography>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <MDTypography
              variant="h6"
              color="dark"
              textAlign="center"
              style={{ width: "100%" }}
              p={3}
            >
              Please Connect Wallet
              <br />
            </MDTypography>
          )}
        </Cards>
      </MDBox>
    </DashboardLayout>
  );
}

export default InvestDashboard;
