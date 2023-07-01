import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GET_CATEGORIES,
  GET_COLLECTION,
  GET_COLLECTIONS,
} from "../../constant";
import { DataGrid, Markdown } from "../index";
import { start, done } from "../../store/loaderSlice";
import { convertTimestamp } from "../../utils/convertTimestamp";
import { snackbarStart } from "../../store/SnackbarSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UploadIcon from "@mui/icons-material/Upload";
import { Autocomplete, InputBase, TextField } from "@mui/material";
import i18next from "i18next";
import { renderHTMLCell } from "../../utils/renderHTMLCell";

const DashboardCollections = () => {
  const { token } = useSelector((state) => state.user);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [collectionsData, setCollectionsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  // Create category
  const [formStatus, setFormStatus] = useState(false);
  const [createCollection, setCreateCollection] = useState(false);
  const [image, setImage] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [imageName, setImageName] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [categoryValue, setCategoryValue] = useState(null);

  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    {
      field: "name",
      headerName: t("collectionsDashboard.name"),
      width: 200,
    },
    {
      field: "category",
      headerName: t("collectionsDashboard.category"),
      width: 200,
    },
    {
      field: "desc",
      headerName: t("collectionsDashboard.desc"),
      width: 200,
      renderCell: (params) => renderHTMLCell(params.value),
    },
    {
      field: "volume",
      headerName: t("collectionsDashboard.volume"),
      width: 80,
    },
    {
      field: "owner",
      headerName: t("collectionsDashboard.owner"),
      width: 150,
    },
    {
      field: "publishedAt",
      headerName: t("collectionsDashboard.publishedAt"),
      width: 200,
    },
  ];
  const rows = collectionsData?.map((collection) => {
    return {
      id: collection?._id,
      category: collection?.category?.name[i18next.language],
      name: collection?.name,
      desc: collection?.description,
      volume: collection?.volume,
      owner: collection?.addedBy?.name,
      publishedAt: convertTimestamp(collection?.publishedAt),
    };
  });
  const categoryOptions = categoryData?.map((category) => {
    return {
      id: category?._id,
      label: category?.name[i18next.language],
    };
  });
  const deleteUsers = () => {
    dispatch(start());
    const deleteUser = async (id) => {
      try {
        await axios({
          method: "delete",
          url: `${GET_COLLECTION}/${id}`,
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {},
        });
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("collectionsDashboard.deletedMessage"),
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
    if (
      name.trim().length > 1 &&
      value.trim().length > 1 &&
      categoryValue?.label?.length > 1
    ) {
      dispatch(start());
      if (!imageError) {
        try {
          const { data } = await axios({
            method: "post",
            url: GET_COLLECTION,
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
            data: {
              image,
              name: name,
              description: value,
              categoryId: categoryValue?.id,
            },
          });
          getEmpty()
          dispatch(done());
          setFormStatus(false);
          dispatch(
            snackbarStart({
              text: t("collectionsDashboard.createdMessage"),
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
      } else {
        dispatch(
          snackbarStart({
            text: t("collectionsDashboard.imageInfo"),
            severity: "error",
          })
        );
      }
    } else {
      dispatch(
        snackbarStart({
          text: t("collectionsDashboard.fieldsTwoCharacter"),
          severity: "error",
        })
      );
    }
  };
  const handleUpdateCategory = async () => {
    if (name.trim()?.length > 1 && value?.trim()?.length > 1) {
      dispatch(start());
      try {
        await axios({
          method: "put",
          url: `${GET_COLLECTION}/${selectedIds[0]}`,
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {
            image,
            name: name,
            description: value,
            categoryId: categoryValue?.id,
          },
        });
        dispatch(done());
        getEmpty();
        setFormStatus(false);
        dispatch(
          snackbarStart({
            text: t("collectionsDashboard.editedMessage"),
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
    } else {
      dispatch(
        snackbarStart({
          text: t("collectionsDashboard.fieldsTwoCharacter"),
          severity: "error",
        })
      );
    }
  };
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file.size <= 5300000 && file.type.split("/")[0] === "image") {
      setImageName(file?.name);
      setImageError(false);
      setFileToBase(file);
    } else {
      dispatch(
        snackbarStart({
          text: t("collectionsDashboard.imageInfo"),
          severity: "error",
        })
      );
      setImageError(true);
    }
  };
  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };
  const getData = async () => {
    dispatch(start());
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: `${GET_COLLECTIONS}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-auth-token": token,
        },
        data: {},
      });
      setCollectionsData(data1);
      dispatch(done());
    } catch (err) {
      console.log(err);
      dispatch(done());
      navigate("/");
    }
  };
  const getCategories = async () => {
    dispatch(start());
    try {
      const { data } = await axios({
        method: "get",
        url: `${GET_CATEGORIES}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {},
      });
      setCategoryData(data);
      dispatch(done());
    } catch (err) {
      console.log(err);
      dispatch(done());
    }
  };

  const handleAddCategory = () => {
    setFormStatus(true);
    setCreateCollection(true);
    getEmpty();
  };
  const handleEditCategory = () => {
    if (selectedIds.length === 1) {
      getEmpty();
      setFormStatus(true);
      setCreateCollection(false);
      const text = collectionsData?.find(
        (collection) => collection._id === selectedIds[0]
      );
      setName(text?.name);
      setValue(text?.description);
      setCategoryValue({
        label: text?.category?.name[i18next.language],
        id: text?.category?._id,
      });
    } else {
      dispatch(
        snackbarStart({
          text: "You must select only one element",
          severity: "error",
        })
      );
    }
  };

  const onRowsSelectionHandler = (ids) => {
    setSelectedIds(ids);
  };
  const handleOptionChange = (event, newValue) => {
    setCategoryValue(newValue);
  };
  const getEmpty = () => {
    setImage([]);
    setName("");
    setCategoryValue(null);
    setValue("");
    setImageName("");
  };
  const handleCancel = () => {
    setFormStatus(false);
    getEmpty();
    setSelectedIds([]);
  };
  useEffect(() => {
    getData();
    getCategories();
  }, []);

  return (
    <section className="pt-20 dashboard-users">
      <div className="container">
        <div className="dashboard-users-box">
          <div className="top mt-10 mb-3">
            <h1 className="text-3xl text-center">
              {t("dashboard.collections")}
            </h1>
          </div>
          <div className="center mb-12">
            <div className="top flex gap-x-3 text-white dark:text-black my-3">
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
                {t("collectionsDashboard.newCollection")}
              </button>
              <button
                onClick={handleEditCategory}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("collectionsDashboard.editCollection")}
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
            <div className="form flex justify-center items-center flex-col gap-y-4 py-3">
              <h1 className="text-center text-3xl">
                {t("collectionsDashboard.collection")}
              </h1>
              <div className="flex gap-y-3 flex-col items-center justify-center">
                <label htmlFor="upload-image" className="ml-2 cursor-pointer">
                  <div className="w-full h-[200px] rounded-md border-4 border-dashed flex items-center justify-center">
                    <div className=" w-2/3 flex flex-col gap-y-4 items-center justify-center">
                      <span className="text-5xl">
                        <UploadIcon fontSize="inherit" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-center">
                          {t("collectionsDashboard.imageInfo")}
                        </span>
                        <span className="text-center !text-green-500">
                          {imageName}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        id="upload-image"
                        name="upload-image"
                        onChange={handleImage}
                        className="w-0 h-0 opacity-0"
                      />
                    </div>
                  </div>
                </label>
                <h2>{t("collectionsDashboard.name")}: </h2>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={t("collectionsDashboard.name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                />
                <h2>{t("collectionsDashboard.category")}: </h2>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={categoryOptions}
                  sx={{ width: 300 }}
                  defaultValue={categoryValue?.label}
                  value={categoryValue?.label}
                  onChange={handleOptionChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("collectionsDashboard.selectCategory")}
                    />
                  )}
                  className="category-input bg-white dark:bg-black dark:!text-white"
                />
                <h2>{t("collectionsDashboard.description")}: </h2>
                <Markdown value={value} setValue={setValue} />
              </div>
              <div className="flex gap-x-3">
                <button
                  onClick={
                    createCollection
                      ? handleCreateCategory
                      : handleUpdateCategory
                  }
                  className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase text-white dark:text-black"
                >
                  {createCollection ? t("create") : t("update")}
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

export default DashboardCollections;
