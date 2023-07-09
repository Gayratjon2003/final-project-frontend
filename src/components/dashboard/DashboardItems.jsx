import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GET_CATEGORIES,
  GET_COLLECTION,
  GET_ITEMS,
  GET_ITEMS_ADMIN,
  GET_TAGS,
} from "../../constant";
import { DataGrid, Markdown, FreeSolo } from "../index";
import { start, done } from "../../store/loaderSlice";
import { convertTimestamp } from "../../utils/convertTimestamp";
import { snackbarStart } from "../../store/SnackbarSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UploadIcon from "@mui/icons-material/Upload";
import { Autocomplete, Checkbox, Input, InputBase, TextField } from "@mui/material";
import i18next from "i18next";
import { renderHTMLCell } from "../../utils/renderHTMLCell";
const DashboardItems = ({ id }) => {
  const { user, token } = useSelector((state) => state.user);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [itemsData, setItemsData] = useState([]);
  const [tagsData, setTagsData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [collectionsData, setCollectionsData] = useState([]);
  // Create items
  const [formStatus, setFormStatus] = useState(false);
  const [createItems, setCreateItems] = useState(false);
  const [image, setImage] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [imageName, setImageName] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [tagsValue, setTagsValue] = useState([]);
  const [formEdit, setFormEdit] = useState(false);
  const [itemsFields, setItemsFields] = useState([]);
  const [fields, setFields] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const checkEmptyValues = () => {
    return name.trim().length > 1 && author.trim().length > 1;
  };
  const deleteItems = () => {
    dispatch(start());
    const deleteItem = async (id) => {
      try {
        await axios({
          method: "delete",
          url: `${GET_ITEMS}/${id}`,
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {},
        });
        dispatch(done());
        dispatch(
          snackbarStart({
            text: t("itemsDashboard.deletedMessage"),
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
      deleteItem(el);
    });
    dispatch(done());
    setSelectedIds([]);
  };
  const handleCreateItem = async (fields) => {
    if (checkEmptyValues()) {
      dispatch(start());
      if (!imageError) {
        try {
          const { data } = await axios({
            method: "post",
            url: GET_ITEMS,
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
            data: {
              image,
              name: name,
              author: author,
              collectionId: id,
              tags: tagsValue,
              values: fields,
            },
          });
          handleCancel();
          dispatch(done());
          dispatch(
            snackbarStart({
              text: t("itemsDashboard.createdMessage"),
              severity: "success",
            })
          );
          getData();
          getTags();
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

  const handleUpdateItem = async (fields) => {
    if (checkEmptyValues()) {
      dispatch(start());
      try {
        await axios({
          method: "put",
          url: `${GET_ITEMS}/${selectedIds[0]}`,
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          data: {
            image,
            name: name,
            author: author,
            collectionId: id,
            tags: tagsValue,
            values: fields,
          },
        });
        dispatch(done());
        handleCancel();
        dispatch(
          snackbarStart({
            text: t("itemsDashboard.editedMessage"),
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
  const getEmpty = () => {
    setImage([]);
    setImageName("");
    setName("");
    setAuthor("");
    setTagsValue([]);
    setSelectedIds([]);
  };
  const getData = async () => {
    dispatch(start());
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: `${GET_ITEMS}?collectionId=${id}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-auth-token": token,
        },
        data: {},
      });
      setItemsFields(data1);
      if (
        Array.isArray(data1[0]?.customFields?.fields) &&
        data1[0]?.customFields?.fields.length !== 0
      ) {
        setColumns(
          data1[0]?.customFields?.fields?.map((item) => {
            return {
              field: item?.name,
              headerName: item?.label,
              width: 200,
            };
          })
        );
      }
      const newArray = data1?.map((arr) => {
        const childArray = arr?.customFields?.values?.map((item) => {
          if (typeof item?.value === "object") {
            return {
              [item?.name]: item?.value
                ?.map((item) => `#${item}`)
                .toString()
                .replaceAll(",", " "),
              width: 200,
            };
          } else {
            return {
              [item?.name]: item?.value,
              width: 220,
            };
          }
        });
        const result = {};
        for (let obj of childArray) {
          const key = Object.keys(obj)[0];
          const value = obj[key];
          result[key] = value;
        }
        return result;
      });
      setRows(newArray);
      setItemsData(data1);
      dispatch(done());
    } catch (err) {
      console.log(err);
      dispatch(done());
      navigate("/");
    }
  };
  const getCollection = async () => {
    dispatch(start());
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: `${GET_COLLECTION}/${id}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-auth-token": token,
        },
        data: {},
      });
      setCollectionsData(data1)
      dispatch(done());
    } catch (err) {
      console.log(err);
      dispatch(done());
      navigate("/");
    }
  };

  const getTags = async () => {
    dispatch(start());
    try {
      const { data } = await axios({
        method: "get",
        url: `${GET_TAGS}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {},
      });
      setTagsData(data);
      dispatch(done());
    } catch (err) {
      console.log(err);
      dispatch(done());
    }
  };

  const handleAddItem = () => {
    setFormStatus(true);
    setCreateItems(true);
  };
  const handleEditItem = () => {
    if (selectedIds.length === 1) {
      setFormStatus(true);
      setCreateItems(false);
      setFormEdit(true);
      const text = itemsData?.find((item) => item._id === selectedIds[0]);
      setName(text?.name);
      setAuthor(text?.author);
      setTagsValue(text?.tags);
    } else {
      dispatch(
        snackbarStart({
          text: "You must select only one element",
          severity: "error",
        })
      );
    }
  };
  const handleViewItem = () => {
    if (selectedIds.length === 1) {
      setFormStatus(true);
      setCreateItems(false);
      setFormEdit(true);
      navigate(`/item/${selectedIds[0]}`)
    } else {
      dispatch(
        snackbarStart({
          text: "You must select only one element",
          severity: "error",
        })
      );
    }
  };
  useEffect(() => {
    getData();
    getTags();
    getCollection();
  }, []);
  useEffect(()=> {
    setFields(collectionsData?.fields);
      setIsOwner(collectionsData?.addedBy?._id === user._id || user?.isAdmin);
  },[token, collectionsData])
  const onRowsSelectionHandler = (ids) => {
    setSelectedIds(ids);
  };
  const handleTagsChange = (event, newValue) => {
    setTagsValue(newValue);
  };
  const handleCancel = () => {
    getEmpty();
    setFormStatus(false);
    setFormEdit(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.length > 0) {
      let arr = [];
      for (let i = 0; i < e.target.length - 1; i++) {
        if (e.target[i].type !== "checkbox" && e.target[i].name?.length !== 0) {
          arr.push({
            type: e.target[i].type,
            name: e.target[i].name,
            value: e.target[i].value,
            label: e.target[i].labels[0]?.textContent,
          });
        } else if (
          e.target[i].type === "checkbox" &&
          e.target[i].name?.length !== 0
        ) {
          arr.push({
            type: e.target[i].type,
            name: e.target[i].name,
            value: e.target[i].checked,
            label: e.target[i].labels[0]?.textContent,
          });
        }
      }
      if (formEdit) {
        handleUpdateItem(arr);
      } else {
        handleCreateItem(arr);
      }
    }
  };
  useEffect(() => {
    if (itemsFields?.length > 0 && selectedIds[0]) {
      const newArray = itemsFields?.filter(
        (item) => item._id === selectedIds[0]
      );
      setCustomFields(newArray[0]?.customFields?.values);
    } else {
      setCustomFields(fields);
    }
  }, [formEdit, itemsFields, fields]);
  return (
    <section className="pt-20 dashboard-users">
      <div className="container">
        <div className="dashboard-users-box">
          
          <div className="center mb-12">
            {isOwner && (
              <div className="top flex gap-x-3 text-white dark:text-black my-3">
                <button
                  onClick={deleteItems}
                  className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
                >
                  {t("delete")}
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
                >
                  {t("itemsDashboard.newItem")}
                </button>
                <button
                  onClick={handleEditItem}
                  className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
                >
                  {t("itemsDashboard.editItem")}
                </button>
                <button
                  onClick={handleViewItem}
                  className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
                >
                  {t("itemsDashboard.viewItem")}
                </button>
              </div>
            )}
            <DataGrid
              rows={rows}
              columns={columns}
              title={t("dashboard.items")}
              checkboxSelection={isOwner}
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
                {t("itemsDashboard.item")}
              </h1>
              <h1 className="text-center text-3xl">{}</h1>
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
                <h2>{t("itemsDashboard.name")}: </h2>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={t("itemsDashboard.name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                />
                <h2>{t("author")}: </h2>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={t("author")}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                />
                <h2>{t("itemsDashboard.tags")}: </h2>
                <FreeSolo
                  data={tagsData}
                  defaultVal={tagsValue}
                  onChange={handleTagsChange}
                  placeholder={t("itemsDashboard.tags")}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col text-black font-bold dark:text-white gap-y-2 mb-3">
                  {customFields?.map((field) => {
                    if (field.type === "text") {
                      return (
                        <label
                          aria-label={field.label}
                          htmlFor={field.name}
                          key={field.name}
                          className="flex flex-col items-center"
                        >
                          {field.label}
                          <Input
                            type="text"
                            name={field.name}
                            id={field.name}
                            placeholder={field.label}
                            defaultValue={formEdit ? field?.value : ""}
                            className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                          />
                        </label>
                      );
                    } else if (field.type === "textarea") {
                      return (
                        <label
                          aria-label={field.label}
                          htmlFor={field.name}
                          key={field.name}
                          className="flex flex-col items-center"
                        >
                          {field.label}
                          <textarea
                            name={field.name}
                            id={field.name}
                            defaultValue={formEdit ? field?.value : ""}
                            placeholder={field.label}
                            className="custom-field-textarea w-[300px] min-h-[100px] p-2 font-normal"
                          ></textarea>
                        </label>
                      );
                    } else if (field.type === "number") {
                      return (
                        <label
                          aria-label={field.label}
                          htmlFor={field.name}
                          key={field.name}
                          className="flex flex-col items-center"
                        >
                          {field.label}

                          <Input
                            type="number"
                            name={field.name}
                            id={field.name}
                            placeholder={field.label}
                            defaultValue={formEdit ? field?.value : ""}
                            className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                          />
                        </label>
                      );
                    } else if (field.type === "checkbox") {
                      return (
                        <label
                          aria-label={field.label}
                          htmlFor={field.name}
                          key={field.name}
                          className="flex items-center gap-x-2"
                        >
                          {field.label}
                          <input 
                            type="checkbox"
                            name={field.name}
                            id={field.name}
                            defaultChecked={formEdit ? field?.value : ""}
                          />
                        </label>
                      );
                    } else if (field.type === "date") {
                      return (
                        <label
                          aria-label={field.label}
                          htmlFor={field.name}
                          key={field.name}
                          className="flex flex-col items-center"
                        >
                          {field.label}
                          <input
                            type="date"
                            name={field.name}
                            id={field.name}
                            defaultValue={formEdit ? field?.value : ""}
                            className="date-field p-1 font-normal"
                          />
                        </label>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
                <div className="flex gap-x-3">
                  <button
                    type="submit"
                    className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase text-white dark:text-black"
                  >
                    {createItems ? t("create") : t("update")}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase text-white dark:text-black"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="fields-form mt-20"></div>
        </div>
      </div>
    </section>
  );
};

export default DashboardItems;
