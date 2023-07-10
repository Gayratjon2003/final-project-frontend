import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { GET_USERS } from "../../constant";
import { DataGrid } from "../index";
import { start, done } from "../../store/loaderSlice";
import { convertTimestamp } from "../../utils/convertTimestamp";
import { snackbarStart } from "../../store/SnackbarSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";

const DashboardUsers = () => {
  const { user, token } = useSelector((state) => state.user);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const deleteUsers = () => {
    dispatch(start());
    const deleteUser = async (id) => {
      try {
        await axios({
          method: "delete",
          url: `${GET_USERS}/${id}`,
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {},
        });
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("usersDashboard.deletedMessage"),
            severity: "success",
          })
        );
        getData();
      } catch (err) {
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("somethingWentWrong"),
            severity: "error",
          })
        );
        console.log(err);
      }
    };
    selectedIds?.map((el) => {
      deleteUser(el);
    });
    dispatch(done());
    setSelectedIds([]);
  };
  const blockUsers = () => {
    dispatch(start());
    const blockUser = async (id) => {
      try {
        await axios({
          method: "put",
          url: `${GET_USERS}/${id}`,
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {
            status: "Blocked",
            isAdmin: user?.isAdmin,
          },
        });
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("usersDashboard.blockedMessage"),
            severity: "success",
          })
        );
        getData();
      } catch (err) {
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("somethingWentWrong"),
            severity: "error",
          })
        );
        console.log(err);
      }
    };
    selectedIds?.map((el) => {
      blockUser(el);
    });
    dispatch(done());
    setSelectedIds([]);
  };
  const unBlockUsers = () => {
    dispatch(start());
    const unBlockUser = async (id) => {
      try {
        await axios({
          method: "put",
          url: `${GET_USERS}/${id}`,
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {
            status: "Active",
            isAdmin: user?.isAdmin,
          },
        });
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("usersDashboard.unBlockedMessage"),
            severity: "success",
          })
        );
        getData();
      } catch (err) {
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("somethingWentWrong"),
            severity: "error",
          })
        );
        console.log(err);
      }
    };
    selectedIds?.map((el) => {
      unBlockUser(el);
    });
    dispatch(done());
    setSelectedIds([]);
  };
  const makeAdminUsers = () => {
    dispatch(start());
    const makeAdminUser = async (id) => {
      try {
        await axios({
          method: "put",
          url: `${GET_USERS}/${id}`,
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {
            status: user?.status,
            isAdmin: true,
          },
        });
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("usersDashboard.makeAdminMessage"),
            severity: "success",
          })
        );
        getData();
      } catch (err) {
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("somethingWentWrong"),
            severity: "error",
          })
        );
        console.log(err);
      }
    };
    selectedIds?.map((el) => {
      makeAdminUser(el);
    });
    dispatch(done());
    setSelectedIds([]);
  };
  const removeAdminUsers = () => {
    dispatch(start());
    const removeAdminUser = async (id) => {
      try {
        await axios({
          method: "put",
          url: `${GET_USERS}/${id}`,
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {
            status: user?.status,
            isAdmin: false,
          },
        });
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("usersDashboard.removeAdminMessage"),
            severity: "success",
          })
        );
        getData();
      } catch (err) {
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("somethingWentWrong"),
            severity: "error",
          })
        );
        console.log(err);
      }
    };
    selectedIds?.map((el) => {
      removeAdminUser(el);
    });
    dispatch(done());
    setSelectedIds([]);
  };
  const getData = async () => {
    dispatch(start());
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: `${GET_USERS}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-auth-token": token,
        },
        data: {},
      });
      setUsers(data1);
      dispatch(done());
    } catch (err) {
      console.log(err);
      dispatch(done());
      navigate("/");
    }
  };
  const onRowsSelectionHandler = (ids) => {
    setSelectedIds(ids);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    {
      field: "name",
      headerName: t("usersDashboard.name"),
      width: 200,
    },
    {
      field: "email",
      headerName: t("usersDashboard.email"),
      width: 200,
    },
    {
      field: "isAdmin",
      headerName: t("usersDashboard.role"),
      width: 120,
    },

    {
      field: "registeredTime",
      headerName: t("usersDashboard.registeredTime"),
      width: 140,
    },
    {
      field: "lastLoginTime",
      headerName: t("usersDashboard.lastLoginTime"),
      width: 140,
    },
    {
      field: "status",
      headerName: t("usersDashboard.status"),
      width: 140,
    },
  ];
  const rows = users?.map((user) => {
    return {
      id: user?._id,
      name: user?.name,
      email: user?.email,
      isAdmin: user?.isAdmin ? t("admin") : t("notAdmin"),
      registeredTime: convertTimestamp(user?.registerTime),
      lastLoginTime: convertTimestamp(user?.lastLoginTime),
      status: user?.status ? t("active") : t("blocked"),
    };
  });
  const headers = columns?.map((item) => {
    return {
      label: item?.headerName,
      key: item?.field,
    };
  });
  useEffect(() => {
    getData();
  }, []);
  return (
    <section className="pt-20 dashboard-users">
      <div className="container">
        <div className="dashboard-users-box">
          <div className="top mt-10 mb-3">
            <h1 className="text-3xl text-center max-sm:text-2xl">
              {t("dashboard.users")}
            </h1>
          </div>
          <div className="center mb-12 max-sm:text-sm">
            <div className="top flex gap-x-3 text-white dark:text-black my-3 gap-3 flex-wrap max-sm:flex-col max-sm:items-center">
              <button
                onClick={blockUsers}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("usersDashboard.block")}
              </button>
              <button
                onClick={unBlockUsers}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("usersDashboard.unBlock")}
              </button>
              <button
                onClick={deleteUsers}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("usersDashboard.delete")}
              </button>
              <button
                onClick={makeAdminUsers}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("usersDashboard.makeAnAdmin")}
              </button>
              <button
                onClick={removeAdminUsers}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("usersDashboard.removeAdmin")}
              </button>
              <CSVLink data={rows} headers={headers} filename={"Users.csv"}>
                <button className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase">
                  {t("exportToCsv")}
                </button>
              </CSVLink>
            </div>
            <DataGrid
              rows={rows}
              columns={columns}
              title={""}
              checkboxSelection={true}
              selectedIds={selectedIds}
              sx={{
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                  outline: "none !important",
                },
              }}
              onRowsSelectionHandler={onRowsSelectionHandler}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardUsers;
