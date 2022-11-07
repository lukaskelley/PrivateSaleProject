/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Link } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Cards from "@mui/material/Card";
import MDTypography from "components/MDTypography";
//  Customize the DoodNftStaking CSS
import MDButton from "components/MDButton";

import { Modal, Input, Spin, Card } from "antd";

import config from "config/config";
import STANDARDPRESALEABI from "../../assets/abi/STANDARDPRESALEABI.json";
import PRESALEFACTORYMANAGERABI from "../../assets/abi/PRESALEFACTORYMANAGERABI.json";

const ethers = require("ethers");

const { TextArea } = Input;
function LaunchDashboard() {
  const { account, chainId } = useWeb3React();

  const [presaleArray, setPresaleArray] = useState([]);
  const [modalpresaleArray, setModalPresaleArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  const Provider = new ethers.providers.Web3Provider(window.ethereum);
  const Signer = Provider.getSigner();
  const presaleFactoryContract = new ethers.Contract(
    config.PresaleFactoryManager,
    PRESALEFACTORYMANAGERABI,
    Signer
  );

  const getPresaleData = async () => {
    setLoading(true);
    // eslint-disable-next-line camelcase
    const presale_Array = [];
    await presaleFactoryContract.getAllPresales().then(async (data) => {
      if (data.length === 0) {
        setDataState(false);
        setLoading(false);
      } else {
        setDataState(true);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.length; i++) {
          const startDateEvent = new Date(Number(data[i].startTime) * 1000).toString();
          const endDateEvent = new Date(
            (Number(data[i].startTime) + Number(data[i].period)) * 1000
          ).toString();
          presale_Array.push({
            contractAddress: data[i].presaleAddress.toString(),
            // eslint-disable-next-line camelcase
            startTime: startDateEvent,
            // eslint-disable-next-line camelcase
            endTime: endDateEvent,
            tokenPrice: Number(data[i].tokenPrice) / 1000000,
            totalAmount: Number(data[i].totalMaxAmount) / 1000000,
            minContriAmount: Number(data[i].minInvestAmount),
            maxContriAmount: Number(data[i].maxInvestAmount),
          });
        }
      }
      // eslint-disable-next-line no-plusplus
    });
    setPresaleArray(presale_Array);
    setLoading(false);
  };

  const publishInfo = async () => {
    setPublishLoading(true);
    const logoLink = document.getElementById("logoLink").value;
    const websiteLink = document.getElementById("websiteLink").value;
    const telegramLink = document.getElementById("telegramLink").value;
    const twitterLink = document.getElementById("twitterLink").value;
    const facebookLink = document.getElementById("facebookLink").value;
    const otherLink = document.getElementById("otherLink").value;
    const description = document.getElementById("description").value;
    const presaleContract = new ethers.Contract(
      modalpresaleArray.contractAddress,
      STANDARDPRESALEABI,
      Signer
    );

    await presaleContract
      .setInformation(
        logoLink,
        websiteLink,
        telegramLink,
        twitterLink,
        facebookLink,
        otherLink,
        description
      )
      .then(() => {
        setPublishLoading(false);
        // eslint-disable-next-line no-use-before-define
        setIsSuccessModalOpen(true);
      });
  };

  useEffect(async () => {
    account && (await getPresaleData());
  }, [account]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSuccessCancel = () => {
    setIsSuccessModalOpen(false);
  };

  const showModal = (index) => {
    setModalPresaleArray(presaleArray[index]);
    setIsModalOpen(true);
  };

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
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white" textAlign="center">
              My sale contracts
            </MDTypography>
          </MDBox>
          {account ? (
            <>
              {loading ? (
                <Spin style={{ margin: "4%" }} />
              ) : (
                <>
                  {dataState ? (
                    <Grid container spacing={3} py={1} px={2}>
                      {presaleArray.map((presale, index) => (
                        <Grid
                          item
                          xs={12}
                          xl={6}
                          md={6}
                          mt={3}
                          key={index}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Card
                            style={{ borderRadius: "8px" }}
                            hoverable
                            onClick={() => showModal(index)}
                          >
                            <MDTypography
                              variant="h6"
                              color="dark"
                              textAlign="center"
                              style={{ width: "100%" }}
                            >
                              PrivateSale Address :{" "}
                              {presale && presale.contractAddress.slice(0, 10)}...{" "}
                              {presale && presale.contractAddress.slice(-5)}
                            </MDTypography>
                            <MDTypography
                              variant="h6"
                              color="dark"
                              textAlign="center"
                              style={{ width: "100%" }}
                            >
                              Start Date : {presale.startTime}
                              <br />
                            </MDTypography>
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
      <Modal
        closable={false}
        open={isModalOpen}
        width={800}
        footer={[<MDButton onClick={handleCancel}>Cancel</MDButton>]}
        className="launchdasboardModal"
      >
        <MDTypography variant="h4" color="dark" textAlign="left" style={{ width: "80%" }} pb={1}>
          PrivateSale
        </MDTypography>
        <MDTypography
          variant="h7"
          fontWeight="bold"
          color="info"
          textAlign="left"
          style={{ width: "100%", display: "flex" }}
        >
          PrivateSale Address :
        </MDTypography>
        <MDTypography variant="h7" color="dark" textAlign="left" fontWeight="regular">
          {modalpresaleArray && modalpresaleArray.contractAddress}
        </MDTypography>
        <Grid container spacing={1} mt={3}>
          <Grid item xs={12} xl={6} md={6} mt={1} style={{ justifyContent: "center" }}>
            <MDTypography variant="h4" color="dark" textAlign="left" fontWeight="bold">
              PrivateSale Parameters
            </MDTypography>
            <MDTypography
              variant="h7"
              fontWeight="bold"
              color="info"
              pb={2}
              textAlign="left"
              style={{ width: "100%", display: "flex" }}
            >
              TokenPrice :
              <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
                {modalpresaleArray.tokenPrice}
              </MDTypography>
            </MDTypography>
            <MDTypography
              variant="h7"
              fontWeight="bold"
              color="info"
              pb={2}
              textAlign="left"
              style={{ width: "100%", display: "flex" }}
            >
              TotalAmount :
              <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
                {modalpresaleArray.totalAmount}
              </MDTypography>
            </MDTypography>
            <MDTypography
              variant="h7"
              fontWeight="bold"
              color="info"
              textAlign="left"
              style={{ width: "100%", display: "flex" }}
            >
              Min. / Max.Contribution :
              <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
                {modalpresaleArray.minContriAmount} / {modalpresaleArray.maxContriAmount} BNB
              </MDTypography>
            </MDTypography>

            <MDTypography
              variant="h7"
              fontWeight="bold"
              color="info"
              pb={2}
              textAlign="left"
              style={{ width: "100%", display: "flex" }}
            >
              StartDate :
              <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
                {modalpresaleArray.startTime}
              </MDTypography>
            </MDTypography>
            <MDTypography
              variant="h7"
              fontWeight="bold"
              color="info"
              textAlign="left"
              mb={4}
              style={{ width: "100%", display: "flex" }}
            >
              EndDate :
              <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
                {modalpresaleArray.endTime}
              </MDTypography>
            </MDTypography>

            <MDTypography variant="h7" color="white" textAlign="center" style={{ width: "100%" }}>
              <Link
                to={`https://privatesale-work.netlify.app/privatesale/${modalpresaleArray.contractAddress}/${chainId}`}
              >
                https://privatesale-work.netlify.app/privatesale/{" "}
                {modalpresaleArray.contractAddress}
              </Link>
            </MDTypography>
          </Grid>
          <Grid item xs={12} xl={6} md={6} mt={1} style={{ justifyContent: "center" }}>
            <MDTypography
              variant="h4"
              color="dark"
              textAlign="left"
              style={{ width: "100%" }}
              pb={3}
            >
              Edit Description
            </MDTypography>
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              id="logoLink"
              label="Logo IMG Link"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              id="websiteLink"
              placeholder="https://.."
              label="Website"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              id="telegramLink"
              placeholder="https://t.me/.."
              label="Telegram"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />{" "}
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              id="twitterLink"
              placeholder="https://twitter/.."
              label="Twitter"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />{" "}
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              id="facebookLink"
              placeholder="https://Facebook/.."
              label="Facebook"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />{" "}
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              id="otherLink"
              label="OtherLink"
              placeholder="https://.."
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />{" "}
            <TextArea
              rows={4}
              id="description"
              style={{ borderRadius: "8px", marginBottom: "5%" }}
              placeholder="Description"
            />
            {!publishLoading ? (
              <MDButton color="info" onClick={() => publishInfo()}>
                <MDTypography
                  variant="h7"
                  color="white"
                  textAlign="center"
                  style={{ width: "100%" }}
                >
                  Publish
                </MDTypography>
              </MDButton>
            ) : (
              <MDButton color="info">
                <MDTypography
                  variant="h7"
                  color="white"
                  textAlign="center"
                  style={{ width: "80px" }}
                >
                  <Spin />
                </MDTypography>
              </MDButton>
            )}
          </Grid>
        </Grid>
      </Modal>
      <Modal
        style={{ zIndex: "999999" }}
        closable={false}
        open={isSuccessModalOpen}
        width={500}
        footer={[<MDButton onClick={handleSuccessCancel}>Ok</MDButton>]}
      >
        <MDTypography
          variant="h3"
          color="success"
          textAlign="center"
          style={{ width: "100%" }}
          pb={2}
        >
          Created Successful !
        </MDTypography>
      </Modal>
    </DashboardLayout>
  );
}

export default LaunchDashboard;
