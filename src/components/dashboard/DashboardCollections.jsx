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
import { Autocomplete, Checkbox, InputBase, TextField } from "@mui/material";
import i18next from "i18next";
import { renderHTMLCell } from "../../utils/renderHTMLCell";
import { CSVLink } from "react-csv";
const DashboardCollections = () => {
  const { token } = useSelector((state) => state.user);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [collectionsData, setCollectionsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  // Create colllection
  const [formStatus, setFormStatus] = useState(false);
  const [createCollection, setCreateCollection] = useState(false);
  const [image, setImage] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [imageName, setImageName] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [categoryValue, setCategoryValue] = useState(null);
  const [strCheckbox, setStrCheckbox] = useState(false);
  const [numCheckbox, setNumCheckbox] = useState(false);
  const [boolCheckbox, setBoolCheckbox] = useState(false);
  const [multiCheckbox, setMultiCheckbox] = useState(false);
  const [dateCheckbox, setDateCheckbox] = useState(false);
  const [formEdit, setFormEdit] = useState(false);
  const [fields, setFields] = useState([]);
  const [str1, setStr1] = useState("");
  const [str2, setStr2] = useState("");
  const [str3, setStr3] = useState("");
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [bool1, setBool1] = useState("");
  const [bool2, setBool2] = useState("");
  const [bool3, setBool3] = useState("");
  const [multi1, setMulti1] = useState("");
  const [multi2, setMulti2] = useState("");
  const [multi3, setMulti3] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [date3, setDate3] = useState("");

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
      field: "description",
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
      description: collection?.description,
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
  const deleteCollection = () => {
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
        handleCancel();
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
  const handleCreateCategory = async (fields) => {
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
              fields,
            },
          });
          handleCancel();
          dispatch(done());
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
  const handleCreateCustomFields = (value) => {
    let array = [];
    if (getLengthToBool(str1)) {
      array.push({ type: "text", name: "str1", label: str1 });
    }
    if (getLengthToBool(str2)) {
      array.push({ type: "text", name: "str2", label: str2 });
    }
    if (getLengthToBool(str3)) {
      array.push({ type: "text", name: "str3", label: str3 });
    }
    if (getLengthToBool(num1)) {
      array.push({ type: "number", name: "num1", label: num1 });
    }
    if (getLengthToBool(num2)) {
      array.push({ type: "number", name: "num2", label: num2 });
    }
    if (getLengthToBool(num3)) {
      array.push({ type: "number", name: "num3", label: num3 });
    }
    if (getLengthToBool(bool1)) {
      array.push({ type: "checkbox", name: "bool1", label: bool1 });
    }
    if (getLengthToBool(bool2)) {
      array.push({ type: "checkbox", name: "bool2", label: bool2 });
    }
    if (getLengthToBool(bool3)) {
      array.push({ type: "checkbox", name: "bool3", label: bool3 });
    }
    if (getLengthToBool(multi1)) {
      array.push({ type: "textarea", name: "multi1", label: multi1 });
    }
    if (getLengthToBool(multi2)) {
      array.push({ type: "textarea", name: "multi2", label: multi2 });
    }
    if (getLengthToBool(multi3)) {
      array.push({ type: "textarea", name: "multi3", label: multi3 });
    }
    if (getLengthToBool(date1)) {
      array.push({ type: "date", name: "date1", label: date1 });
    }
    if (getLengthToBool(date2)) {
      array.push({ type: "date", name: "date2", label: date2 });
    }
    if (getLengthToBool(date3)) {
      array.push({ type: "date", name: "date3", label: date3 });
    }
    if (value === "create") {
      handleCreateCategory(array);
    }
    if (value === "update") {
      handleUpdateCategory(array);
    }
  };
  const handleUpdateCategory = async (fields) => {
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
            fields,
          },
        });
        dispatch(done());
        handleCancel();
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
  const handleAddCollection = () => {
    setFormStatus(true);
    setCreateCollection(true);
    getEmpty();
  };
  const handleEditCollection = () => {
    if (selectedIds.length === 1) {
      setFormStatus(true);
      setFormEdit(true);
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
  const handleViewCollection = () => {
    if (selectedIds.length === 1) {
      getEmpty();
      setFormStatus(true);
      navigate(`/collection/${selectedIds[0]}`);
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
    setSelectedIds([]);
    setStrCheckbox(false);
    setNumCheckbox(false);
    setBoolCheckbox(false);
    setMultiCheckbox(false);
    setDateCheckbox(false);
    setStr1("");
    setStr2("");
    setStr3("");
    setNum1("");
    setNum2("");
    setNum3("");
    setBool1("");
    setBool2("");
    setBool3("");
    setMulti1("");
    setMulti2("");
    setMulti3("");
    setDate1("");
    setDate2("");
    setDate3("");
  };
  const handleCancel = () => {
    setFormStatus(false);
    setFormEdit(false);
    getEmpty();
    setSelectedIds([]);
  };
  const getLengthToBool = (val) => val?.toString()?.trim()?.length > 0;
  useEffect(() => {
    getData();
    getCategories();
  }, []);
  useEffect(() => {
    if (collectionsData?.length > 0 && selectedIds[0]) {
      const newArray = collectionsData?.filter(
        (item) => item._id === selectedIds[0]
      );
      newArray[0]?.fields?.map((item) => {
        if (item.name === "str1") {
          setStr1(item?.label);
          setStrCheckbox(true);
        }
        if (item.name === "str2") {
          setStr2(item?.label);
        }
        if (item.name === "str3") {
          setStr3(item?.label);
        }
        if (item.name === "num1") {
          setNum1(item?.label);
          setNumCheckbox(true);
        }
        if (item.name === "num2") {
          setNum2(item?.label);
        }
        if (item.name === "num3") {
          setNum3(item?.label);
        }
        if (item.name === "bool1") {
          setBool1(item?.label);
          setBoolCheckbox(true);
        }
        if (item.name === "bool2") {
          setBool2(item?.label);
        }
        if (item.name === "bool3") {
          setBool3(item?.label);
        }
        if (item.name === "multi1") {
          setMulti1(item?.label);
          setMultiCheckbox(true);
        }
        if (item.name === "multi2") {
          setMulti2(item?.label);
        }
        if (item.name === "multi3") {
          setMulti3(item?.label);
        }
        if (item.name === "date1") {
          setDate1(item?.label);
          setDateCheckbox(true);
        }
        if (item.name === "date2") {
          setDate2(item?.label);
        }
        if (item.name === "date3") {
          setDate3(item?.label);
        }
      });
    }
  }, [formEdit, collectionsData]);
  const headers = columns?.map((item) => {
    return {
      label: item?.headerName,
      key: item?.field,
    };
  });
  const convertToPlainText = (html) => {
    const element = document.createElement("div");
    element.innerHTML = html;
    return element.innerText;
  };
  const csvData = rows?.map((collection) => {
    return {
      id: collection?.id,
      category: collection?.category,
      name: collection?.name,
      description: convertToPlainText(collection?.description),
      volume: collection?.volume,
      owner: collection?.addedBy?.name,
      publishedAt: convertTimestamp(collection?.publishedAt),
    };
  });
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
                onClick={deleteCollection}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("delete")}
              </button>
              <button
                onClick={handleAddCollection}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("collectionsDashboard.newCollection")}
              </button>
              <button
                onClick={handleEditCollection}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("collectionsDashboard.editCollection")}
              </button>
              <button
                onClick={handleViewCollection}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("collectionsDashboard.viewCollection")}
              </button>
              <CSVLink
                data={csvData}
                headers={headers}
                filename={"collections.csv"}
              >
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
              <div className="fields mt-10">
                <div className="top">
                  <ul className="flex gap-x-3 flex-wrap">
                    <li>
                      <label htmlFor="str">
                        String
                        <Checkbox
                          onChange={(e) => setStrCheckbox(e.target.checked)}
                          checked={strCheckbox}
                          inputProps={{ "aria-label": "controlled" }}
                          id="str"
                        />
                      </label>
                    </li>
                    <li>
                      <label htmlFor="num">
                        Number
                        <Checkbox
                          onChange={(e) => setNumCheckbox(e.target.checked)}
                          checked={numCheckbox}
                          inputProps={{ "aria-label": "controlled" }}
                          id="num"
                        />
                      </label>
                    </li>
                    <li>
                      <label htmlFor="boolean">
                        Boolean
                        <Checkbox
                          onChange={(e) => setBoolCheckbox(e.target.checked)}
                          checked={boolCheckbox}
                          inputProps={{ "aria-label": "controlled" }}
                          id="boolean"
                        />
                      </label>
                    </li>
                    <li>
                      <label htmlFor="multiline">
                        Multiline
                        <Checkbox
                          onChange={(e) => setMultiCheckbox(e.target.checked)}
                          checked={multiCheckbox}
                          inputProps={{ "aria-label": "controlled" }}
                          id="multiline"
                        />
                      </label>
                    </li>
                    <li>
                      <label htmlFor="date">
                        Date
                        <Checkbox
                          onChange={(e) => setDateCheckbox(e.target.checked)}
                          checked={dateCheckbox}
                          inputProps={{ "aria-label": "controlled" }}
                          id="date"
                        />
                      </label>
                    </li>
                  </ul>
                </div>
                <div className="center flex flex-col gap-y-3">
                  {strCheckbox && (
                    <>
                      <label className="flex items-center">
                        <span className="!w-[150px]">String field 1</span>
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          placeholder={"Optional"}
                          value={str1}
                          onChange={(e) => setStr1(e.target.value)}
                          className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                        />
                      </label>
                      {getLengthToBool(str1) && (
                        <label className="flex items-center">
                          <span className="!w-[150px]">String field 2</span>
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder={"Optional"}
                            value={str2}
                            onChange={(e) => setStr2(e.target.value)}
                            className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                          />
                        </label>
                      )}
                      {getLengthToBool(str2) && (
                        <label className="flex items-center">
                          <span className="!w-[150px]">String field 3</span>
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder={"Optional"}
                            value={str3}
                            onChange={(e) => setStr3(e.target.value)}
                            className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                          />
                        </label>
                      )}
                    </>
                  )}
                  {numCheckbox && (
                    <>
                      <label className="flex items-center">
                        <span className="!w-[150px]">Number field 1</span>
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          placeholder={"Optional"}
                          value={num1}
                          onChange={(e) => setNum1(e.target.value)}
                          className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                        />
                      </label>
                      {getLengthToBool(num1) && (
                        <label className="flex items-center">
                          <span className="!w-[150px]">Number field 2</span>
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder={"Optional"}
                            value={num2}
                            onChange={(e) => setNum2(e.target.value)}
                            className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                          />
                        </label>
                      )}
                      {getLengthToBool(num2) && (
                        <label className="flex items-center">
                          <span className="!w-[150px]">Number field 3</span>
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder={"Optional"}
                            value={num3}
                            onChange={(e) => setNum3(e.target.value)}
                            className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                          />
                        </label>
                      )}
                    </>
                  )}
                  {boolCheckbox && (
                    <>
                      <label className="flex items-center">
                        <span className="!w-[150px]">Boolean field 1</span>
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          placeholder={"Optional"}
                          value={bool1}
                          onChange={(e) => setBool1(e.target.value)}
                          className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                        />
                      </label>
                      {getLengthToBool(bool1) && (
                        <label className="flex items-center">
                          <span className="!w-[150px]">Boolean field 2</span>
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder={"Optional"}
                            value={bool2}
                            onChange={(e) => setBool2(e.target.value)}
                            className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                          />
                        </label>
                      )}
                      {getLengthToBool(bool2) && (
                        <label className="flex items-center">
                          <span className="!w-[150px]">Boolean field 3</span>
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder={"Optional"}
                            value={bool3}
                            onChange={(e) => setBool3(e.target.value)}
                            className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                          />
                        </label>
                      )}
                    </>
                  )}
                  {multiCheckbox && (
                    <>
                      <label className="flex items-center">
                        <span className="!w-[150px]">Multiline field 1</span>
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          placeholder={"Optional"}
                          value={multi1}
                          onChange={(e) => setMulti1(e.target.value)}
                          className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                        />
                      </label>
                      {getLengthToBool(multi1) && (
                        <label className="flex items-center">
                          <span className="!w-[150px]">Multiline field 2</span>
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder={"Optional"}
                            value={multi2}
                            onChange={(e) => setMulti2(e.target.value)}
                            className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                          />
                        </label>
                      )}
                      {getLengthToBool(multi2) && (
                        <label className="flex items-center">
                          <span className="!w-[150px]">Multiline field 3</span>
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder={"Optional"}
                            value={multi3}
                            onChange={(e) => setMulti3(e.target.value)}
                            className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                          />
                        </label>
                      )}
                    </>
                  )}
                  {dateCheckbox && (
                    <>
                      <label className="flex items-center">
                        <span className="!w-[150px]">Date field 1</span>
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          placeholder={"Optional"}
                          value={date1}
                          onChange={(e) => setDate1(e.target.value)}
                          className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                        />
                      </label>
                      {getLengthToBool(date1) && (
                        <label className="flex items-center">
                          <span className="!w-[150px]">Date field 2</span>
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder={"Optional"}
                            value={date2}
                            onChange={(e) => setDate2(e.target.value)}
                            className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                          />
                        </label>
                      )}
                      {getLengthToBool(date2) && (
                        <label className="flex items-center">
                          <span className="!w-[150px]">Date field 3</span>
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder={"Optional"}
                            value={date3}
                            onChange={(e) => setDate3(e.target.value)}
                            className="category-input max-w-[300px] dark:!text-white w-full p-2.5"
                          />
                        </label>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-x-3">
                <button
                  onClick={() =>
                    createCollection
                      ? handleCreateCustomFields("create")
                      : handleCreateCustomFields("update")
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
