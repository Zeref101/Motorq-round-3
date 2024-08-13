import settings from "/public/icons/image.png";
import task from "/public/icons/task.png";
import search from "/public/icons/search.png";

export const DriverLinks = [
  {
    link: "/dashboard",
    imgUrl: settings,
    label: "Dashboard",
  },
  {
    link: "/assignment_req",
    imgUrl: task,
    label: "Requests",
  },
];
export const AdminLinks = [
  {
    link: "/search-drivers",
    imgUrl: search,
    label: "search",
  },
  {
    link: "/vehicleToDriver",
    imgUrl: "",
    label: "assign",
  },
  {
    link: "/unassign",
    imgUrl: "",
    label: "unassign",
  },
];
