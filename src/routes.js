import LaunchDashboard from "layouts/launchDashboard";
import CreatePrivateSale from "layouts/createPrivateSale";
import InvestDashboard from "layouts/investDashboard";

// @mui icons
// eslint-disable-next-line import/no-extraneous-dependencies
import RequestPageIcon from "@mui/icons-material/RequestPage";
import LoyaltyIcon from "@mui/icons-material/Loyalty";

const routes = [
  {
    type: "collapse",
    name: "Launch Dashboard",
    key: "LaunchDashboard",
    icon: <RequestPageIcon />,
    route: "/LaunchDashboard",
    component: <LaunchDashboard />,
  },
  {
    type: "collapse",
    name: "Create PrivateSale",
    key: "CreatePresale",
    icon: <LoyaltyIcon />,
    route: "/createPrivateSale",
    component: <CreatePrivateSale />,
  },
  {
    type: "collapse",
    name: "Invest Dashboard",
    key: "InvestDashboard",
    icon: <LoyaltyIcon />,
    route: "/InvestDashboard",
    component: <InvestDashboard />,
  },
];

export default routes;
