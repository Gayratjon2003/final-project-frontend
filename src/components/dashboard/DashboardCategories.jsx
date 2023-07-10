import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { GET_CATEGORIES } from "../../constant";
import { DataGrid } from "../index";
import { start, done } from "../../store/loaderSlice";
import { snackbarStart } from "../../store/SnackbarSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { InputBase } from "@mui/material";
const DashboardCategories = () => {
  const { token } = useSelector((state) => state.user);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [categoryEn, setCategoryEn] = useState("");
  const [categoryUz, setCategoryUz] = useState("");
  const [formStatus, setFormStatus] = useState(false);
  const [createCategory, setCreateCategory] = useState(true);

  const deleteUsers = () => {
    dispatch(start());
    const deleteUser = async (id) => {
      try {
        await axios({
          method: "delete",
          url: `${GET_CATEGORIES}/${id}`,
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {},
        });
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("categoriesDashboard.deletedMessage"),
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
  const handleCreateCategory = async () => {
    if (categoryEn.trim().length > 1 && categoryUz.trim().length > 1) {
      dispatch(start());
      try {
        await axios({
          method: "post",
          url: GET_CATEGORIES,
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {
            name: {
              en: categoryEn,
              uz: categoryUz,
            },
          },
        });
        dispatch(done());
        setFormStatus(false);
        dispatch(
          snackbarStart({
            text: t("categoriesDashboard.createdMessage"),
            severity: "success",
          })
        );
        getData();
        setSelectedIds([]);
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
      setCategoryEn("");
      setCategoryUz("");
    } else {
      dispatch(
        snackbarStart({
          text: t("categoriesDashboard.fieldsTwoCharacter"),
          severity: "error",
        })
      );
    }
  };
  const handleUpdateCategory = async () => {
    if (categoryEn.trim().length > 1 && categoryUz.trim().length > 1) {
      dispatch(start());
      try {
        await axios({
          method: "put",
          url: `${GET_CATEGORIES}/${selectedIds[0]}`,
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {
            name: {
              en: categoryEn,
              uz: categoryUz,
            },
          },
        });
        dispatch(done());
        setFormStatus(false);
        setSelectedIds([]);
        dispatch(
          snackbarStart({
            text: t("categoriesDashboard.editedMessage"),
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
      setCategoryEn("");
      setCategoryUz("");
    } else {
      dispatch(
        snackbarStart({
          text: t("categoriesDashboard.fieldsTwoCharacter"),
          severity: "error",
        })
      );
    }
  };
  const getData = async () => {
    dispatch(start());
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: `${GET_CATEGORIES}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-auth-token": token,
        },
        data: {},
      });
      setCategoriesData(data1);
      dispatch(done());
    } catch (err) {
      console.log(err);
      dispatch(done());
      navigate("/");
    }
  };
  const handleAddCategory = () => {
    setFormStatus(true);
    setCreateCategory(true);
  };
  const handleEditCategory = () => {
    if (selectedIds.length === 1) {
      setFormStatus(true);
      setCreateCategory(false);
      const text = categoriesData?.find(
        (category) => category._id === selectedIds[0]
      );
      setCategoryEn(text?.name?.en);
      setCategoryUz(text?.name?.uz);
    } else {
      dispatch(
        snackbarStart({
          text: "You must select only one element",
          severity: "error",
        })
      );
    }
  };
  const handleCancel = () => {
    setFormStatus(false);
    setCategoryEn("");
    setCategoryUz("");
    setSelectedIds([]);
  };
  const onRowsSelectionHandler = (ids) => {
    setSelectedIds(ids);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    {
      field: "name",
      headerName: t("categoriesDashboard.name"),
      width: 200,
    },
  ];
  const rows = categoriesData?.map((category) => ({
    id: category._id,
    name: category?.name[i18n.language],
  }));
  useEffect(() => {
    getData();
  }, []);
  return (
    <section className="pt-20 dashboard-users">
      <div className="container">
        <div className="dashboard-users-box">
          <div className="top mt-10 mb-3">
            <h1 className="text-3xl text-center max-sm:text-2xl">
              {t("dashboard.categories")}
            </h1>
          </div>
          <div className="center mb-12">
            <div className="top flex gap-x-3 text-white dark:text-black my-3 gap-3 flex-wrap max-sm:flex-col max-sm:items-center max-sm:text-sm">
              <button
                onClick={deleteUsers}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("delete")}
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("categoriesDashboard.newCategory")}
              </button>
              <button
                onClick={handleEditCategory}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("categoriesDashboard.editCategory")}
              </button>
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
          {formStatus && (
            <div className="form flex justify-center items-center flex-col gap-y-4 my-3">
              <h1 className="text-center text-3xl">
                {t("categoriesDashboard.categoryName")}
              </h1>
              <div className="flex gap-x-3">
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={t("categoriesDashboard.en")}
                  value={categoryEn}
                  onChange={(e) => setCategoryEn(e.target.value)}
                  className="category-input dark:!text-white w-[200px] p-2.5"
                />
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={t("categoriesDashboard.uz")}
                  value={categoryUz}
                  onChange={(e) => setCategoryUz(e.target.value)}
                  className="category-input dark:!text-white w-[200px] p-2.5"
                />
              </div>
              <div className="flex gap-x-3">
                <button
                  onClick={
                    createCategory ? handleCreateCategory : handleUpdateCategory
                  }
                  className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase text-white dark:text-black"
                >
                  {createCategory ? t("create") : t("update")}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase text-white dark:text-black"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardCategories;
