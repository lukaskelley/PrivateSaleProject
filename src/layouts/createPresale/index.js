/* eslint-disable radix */
/* eslint-disable no-loss-of-precision */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState } from "react";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
//  Customize the DoodNftStaking CSS
import TextField from "@mui/material/TextField";
import { DatePicker, Checkbox, Modal, Spin, message } from "antd";

import config from "config/config";
import STANDARDPRESALEFACTORYABI from "../../assets/abi/STANDARDPRESALEFACTORYABI.json";

const ethers = require("ethers");

function CreatePresale() {
  const Provider = new ethers.providers.Web3Provider(window.ethereum);
  const Signer = Provider.getSigner();

  const StandardPresaleFactoryContract = new ethers.Contract(
    config.StandardPresaleFactory,
    STANDARDPRESALEFACTORYABI,
    Signer
  );

  const [loading, setLoading] = useState(false);
  const [contributionState, setContributionState] = useState(true);
  const [dateState, setDateState] = useState(true);
  const [createState, setCreateState] = useState(true);
  const [dateValidation, setDateValidation] = useState(false);
  const [startDateValidation, setStartDateValidation] = useState(false);
  const [contributionValidation, setContributionValidation] = useState(false);

  const [tokenPrice, setTokenPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [minContributionAmount, setMinContributionAmount] = useState(0);
  const [maxContributionAmount, setMaxContributionAmount] = useState(0);
  const [startDateStamp, setStartDateStamp] = useState("");
  const [startDate, setStartDate] = useState(0);
  const [endDateStamp, setEndDateStamp] = useState("");
  const [endDate, setEndDate] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    const token_price = document.getElementById("tokenPrice").value;
    const total_Amount = document.getElementById("totalAmount").value;
    const min_Contribution = document.getElementById("minContribution").value;
    const max_Contribution = document.getElementById("maxContribution").value;

    const contributionCheckBox = document.getElementById("contributioncheckbox");
    const endTimeCheckBox = document.getElementById("endtimecheckbox");

    if (contributionCheckBox.checked && endTimeCheckBox.checked) {
      if (startDate < endDate && min_Contribution < max_Contribution) {
        setDateValidation(false);
        setContributionValidation(false);
        setTokenPrice(token_price);
        setTotalAmount(total_Amount);
        setMinContributionAmount(min_Contribution);
        setMaxContributionAmount(max_Contribution);
        setIsModalOpen(true);
      } else if (startDate > endDate) {
        setDateValidation(true);
      } else if (min_Contribution > max_Contribution) {
        setContributionValidation(true);
      }
    } else if (contributionCheckBox.checked && !endTimeCheckBox.checked) {
      if (min_Contribution < max_Contribution) {
        setDateValidation(false);
        setContributionValidation(false);
        setTokenPrice(token_price);
        setTotalAmount(total_Amount);
        setMinContributionAmount(min_Contribution);
        setMaxContributionAmount(max_Contribution);
        setEndDate(0);
        setEndDateStamp("Max");
        setIsModalOpen(true);
      } else {
        setContributionValidation(true);
      }
    } else if (!contributionCheckBox.checked && endTimeCheckBox.checked) {
      if (startDate < endDate) {
        setDateValidation(false);
        setContributionValidation(false);
        setTokenPrice(token_price);
        setTotalAmount(total_Amount);
        setMinContributionAmount(0);
        setMaxContributionAmount(0);
        setIsModalOpen(true);
      } else {
        setDateValidation(true);
      }
    } else if (!contributionCheckBox.checked && !endTimeCheckBox.checked) {
      setDateValidation(false);
      setContributionValidation(false);
      setTokenPrice(token_price);
      setTotalAmount(total_Amount);
      setMinContributionAmount(0);
      setMaxContributionAmount(0);
      setIsModalOpen(true);
      setEndDate(0);
      setEndDateStamp("Max");
    }
  };

  const onChangeStartDate = (value, dateString) => {
    const token_Price = document.getElementById("tokenPrice").value;
    const total_Amount = document.getElementById("totalAmount").value;
    const currentTime = new Date();
    const currentTimeStamp = parseInt((new Date(currentTime).getTime() / 1000).toFixed(0));
    const datum = parseInt((new Date(dateString).getTime() / 1000).toFixed(0));
    const event = new Date(datum * 1000);
    if (datum > currentTimeStamp) {
      setStartDate(datum);
      setStartDateStamp(event.toString());
      setStartDateValidation(false);
    } else {
      setStartDateValidation(true);
    }
    token_Price > 0 && total_Amount > 0 && datum > currentTimeStamp
      ? setCreateState(false)
      : setCreateState(true);
  };

  const onChangeEndDate = (dateString) => {
    const datum = parseInt((new Date(dateString).getTime() / 1000).toFixed(0));
    const event = new Date(datum * 1000);

    setEndDate(datum);
    setEndDateStamp(event.toString());
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const settingContribution = (e) => {
    setContributionState(!e.target.checked);
  };

  const settingDate = (e) => {
    setDateState(!e.target.checked);
    if (!e.target.checked) {
      setEndDate(0);
      setEndDateStamp("");
    }
  };

  const createSaleState = () => {
    const token_Price = document.getElementById("tokenPrice").value;
    const total_Amount = document.getElementById("totalAmount").value;

    token_Price > 0 && total_Amount > 0 && startDate > 0
      ? setCreateState(false)
      : setCreateState(true);
  };

  const confirmFunc = async () => {
    setLoading(true);
    const isNative = true;
    // eslint-disable-next-line
    await StandardPresaleFactoryContract.create(
      ethers.BigNumber.from(tokenPrice * 1000000),
      ethers.BigNumber.from(totalAmount * 1000000),
      ethers.BigNumber.from(startDate),
      endDate === 0 ? ethers.BigNumber.from(0) : ethers.BigNumber.from(endDate - startDate),
      ethers.utils.parseEther(minContributionAmount.toString()),
      maxContributionAmount === 0
        ? "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        : ethers.utils.parseEther(maxContributionAmount.toString()),
      isNative,
      {
        value: ethers.utils.parseEther("0.01"),
      }
    ).then(() => {
      setLoading(false);
      setIsModalOpen(false);
      message.success("Created Successful");
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox style={{ minHeight: "500px" }} pt={7}>
        <Card>
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
              Create LaunchPad
            </MDTypography>
          </MDBox>
          <Grid container spacing={1} py={2}>
            <Grid item xs={12} xl={8} md={8} m={3} style={{ justifyContent: "center" }}>
              <TextField
                style={{ width: "100%", marginTop: "1%" }}
                id="tokenPrice"
                label="Token Price"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={createSaleState}
              />
              <TextField
                style={{ width: "100%", marginTop: "5%" }}
                id="totalAmount"
                label="Total Amount"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={createSaleState}
              />
              <Checkbox
                id="contributioncheckbox"
                style={{ marginTop: "3%" }}
                onChange={settingContribution}
              >
                <MDTypography variant="h7" textAlign="center" style={{ width: "100%" }}>
                  Setting Min & Max Contribution
                </MDTypography>
              </Checkbox>
              <Grid container spacing={1}>
                <Grid item xs={12} xl={6} md={6} mt={1} style={{ justifyContent: "center" }}>
                  <TextField
                    style={{ width: "100%", marginTop: "5%" }}
                    id="minContribution"
                    label="Min.Contribution (BNB)"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={contributionState}
                  />
                </Grid>
                <Grid item xs={12} xl={6} md={6} mt={1} style={{ justifyContent: "center" }}>
                  <TextField
                    style={{ width: "100%", marginTop: "5%" }}
                    id="maxContribution"
                    label="Max.Contribution (BNB)"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={contributionState}
                  />
                </Grid>
                {contributionValidation && (
                  <MDTypography variant="h6" textAlign="left" color="error">
                    Max Contribution must be greater than Min Contribution!
                  </MDTypography>
                )}
              </Grid>
              <Checkbox id="endtimecheckbox" style={{ marginTop: "3%" }} onChange={settingDate}>
                <MDTypography variant="h7" textAlign="center" style={{ width: "100%" }}>
                  Setting Date
                </MDTypography>
              </Checkbox>
              <Grid container spacing={1}>
                <Grid item xs={12} xl={6} md={6} mt={1} style={{ justifyContent: "center" }}>
                  <DatePicker
                    showTime
                    placeholder="Start Date"
                    id="startDate"
                    onChange={onChangeStartDate}
                    style={{ width: "100%", padding: "10px", borderRadius: "7px" }}
                  />
                </Grid>
                <Grid item xs={12} xl={6} md={6} mt={1} style={{ justifyContent: "center" }}>
                  <DatePicker
                    showTime
                    placeholder="End Date"
                    onChange={onChangeEndDate}
                    style={{ width: "100%", padding: "10px", borderRadius: "7px" }}
                    disabled={dateState}
                  />
                </Grid>
                {dateValidation && (
                  <MDTypography variant="h6" textAlign="left" color="error">
                    The end date must be greater than the start time!
                  </MDTypography>
                )}
                {startDateValidation && (
                  <MDTypography variant="h6" textAlign="left" color="error">
                    The start date must be greater than the current time!
                  </MDTypography>
                )}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              xl={3}
              md={3}
              m={3}
              style={{ width: "90%", justifyContent: "center" }}
            >
              <MDTypography variant="h4" textAlign="center" style={{ width: "100%" }}>
                Cost : 0.1BNB
              </MDTypography>

              <MDButton
                mx={2}
                px={2}
                color="info"
                style={{ width: "100%" }}
                disabled={createState}
                onClick={showModal}
              >
                <MDTypography
                  variant="h6"
                  color="white"
                  textAlign="center"
                  style={{ width: "100%" }}
                >
                  Create LaunchPad
                </MDTypography>
              </MDButton>
            </Grid>
          </Grid>
        </Card>
      </MDBox>
      <Modal
        style={{ zIndex: "999999" }}
        closable={false}
        open={isModalOpen}
        width={600}
        footer={[
          <>
            {loading ? (
              <>
                <MDButton color="info" disabled="true">
                  <Spin style={{ width: "60px" }} />
                </MDButton>
                <MDButton onClick={handleCancel}>Cancel</MDButton>
              </>
            ) : (
              <>
                <MDButton color="info" onClick={confirmFunc}>
                  Confirm
                </MDButton>
                <MDButton onClick={handleCancel}>Cancel</MDButton>
              </>
            )}
          </>,
        ]}
        className="createPresaleModal"
      >
        <MDTypography variant="h3" color="dark" textAlign="left" style={{ width: "100%" }} pb={2}>
          Create LaunchPad
        </MDTypography>
        <MDTypography
          variant="h7"
          color="info"
          textAlign="left"
          fontWeight="bold"
          style={{ width: "100%", display: "flex" }}
        >
          Token Amount :
          <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
            {tokenPrice}
          </MDTypography>
        </MDTypography>
        <MDTypography
          variant="h7"
          color="info"
          textAlign="left"
          fontWeight="bold"
          style={{ width: "100%", display: "flex" }}
        >
          Total Supply :
          <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
            {totalAmount}
          </MDTypography>
        </MDTypography>
        <MDTypography
          variant="h7"
          color="info"
          textAlign="left"
          style={{ width: "100%", display: "flex" }}
          fontWeight="bold"
        >
          Min.Contribution (BNB) :
          <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
            {minContributionAmount}
          </MDTypography>
        </MDTypography>
        <MDTypography
          variant="h7"
          color="info"
          fontWeight="bold"
          textAlign="left"
          style={{ width: "100%", display: "flex" }}
        >
          Max.Contribution (BNB) :
          <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
            {maxContributionAmount === 0 ? "Max" : maxContributionAmount}
          </MDTypography>
        </MDTypography>
        <MDTypography
          variant="h7"
          color="info"
          fontWeight="bold"
          textAlign="left"
          style={{ width: "100%", display: "flex" }}
        >
          Start Date :
          <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
            {startDateStamp}
          </MDTypography>
        </MDTypography>

        <MDTypography
          variant="h7"
          color="info"
          fontWeight="bold"
          textAlign="left"
          style={{ width: "100%", display: "flex" }}
        >
          End Date :
          <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
            {endDateStamp}
          </MDTypography>
        </MDTypography>
      </Modal>
    </DashboardLayout>
  );
}

export default CreatePresale;
