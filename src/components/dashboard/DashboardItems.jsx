import axios from "axios";
import React, { useEffect, useState } from "react";
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
import { Autocomplete, InputBase, TextField } from "@mui/material";
import i18next from "i18next";
import { renderHTMLCell } from "../../utils/renderHTMLCell";

const DashboardItems = () => {
  const { token } = useSelector((state) => state.user);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [itemsData, setItemsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [collectionsData, setCollectionsData] = useState([]);
  const [tagsData, setTagsData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  // Create items
  const [formStatus, setFormStatus] = useState(false);
  const [createItems, setCreateItems] = useState(false);
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [imageName, setImageName] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [categoryValue, setCategoryValue] = useState(null);
  const [collectionValue, setCollectionValue] = useState(null);
  const [tagsValue, setTagsValue] = useState([]);

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
      width: 150,
    },
    {
      field: "collection",
      headerName: t("itemsDashboard.collection"),
      width: 150,
    },
    {
      field: "desc",
      headerName: t("collectionsDashboard.desc"),
      width: 200,
      renderCell: (params) => renderHTMLCell(params.value),
    },
    {
      field: "tags",
      headerName: t("itemsDashboard.tags"),
      width: 150,
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
  const rows = itemsData?.map((item) => {
    return {
      id: item?._id,
      category: item?.category?.name[i18next.language],
      collection: item?.collections?.name,
      name: item?.name,
      desc: item?.description,
      tags: item?.tags
        ?.map((item) => `#${item}`)
        .toString()
        .replaceAll(",", " "),
      owner: item?.addedBy?.name,
      publishedAt: convertTimestamp(item?.publishedAt),
    };
  });
  const checkEmptyValues = () => {
    return (
      name.trim().length > 1 &&
      author.trim().length > 1 &&
      value.trim().length > 1 &&
      categoryValue?.label?.length > 1 &&
      collectionValue?.label?.length > 1 &&
      collectionValue?.label?.length > 1
    );
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
  const handleCreateItem = async () => {
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
              categoryId: categoryValue?.id,
              collectionId: collectionValue?.id,
              tags: tagsValue,
              description: value,
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
  const handleUpdateItem = async () => {
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
            categoryId: categoryValue?.id,
            collectionId: collectionValue?.id,
            tags: tagsValue,
            description: value,
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
      console.log("File must be an image and less than 5 MB ");
      setImageError(true);
    }
    console.log(file);
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
    setValue("");
    setAuthor("");
    setCategoryValue(null);
    setCollectionValue(null);
    setTagsValue([]);
    setSelectedIds([])
  };
 
  const getData = async () => {
    dispatch(start());
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: `${GET_ITEMS_ADMIN}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-auth-token": token,
        },
        data: {},
      });
      setItemsData(data1);
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
  const getCollections = async () => {
    dispatch(start());
    try {
      const { data } = await axios({
        method: "get",
        url: `${GET_COLLECTION}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {},
      });
      setCollectionsData(data);
      dispatch(done());
    } catch (err) {
      console.log(err);
      dispatch(done());
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

  const handleAddCategory = () => {
    setFormStatus(true);
    setCreateItems(true);
  };
  const handleEditCategory = () => {
    if (selectedIds.length === 1) {
      setFormStatus(true);
      setCreateItems(false);
      const text = itemsData?.find((item) => item._id === selectedIds[0]);
      setName(text?.name);
      setAuthor(text.author);
      setCategoryValue({
        label: text?.category?.name[i18next.language],
        id: text?.category?._id,
      });
      setCollectionValue({
        label: text?.collections?.name,
        id: text?.collections?._id,
      });
      setTagsValue(text?.tags);
      setValue(text?.description);
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
    getCategories();
    getCollections();
    getTags();
  }, []);
  const onRowsSelectionHandler = (ids) => {
    setSelectedIds(ids);
  };
  const handleOptionChange = (event, newValue) => {
    setCategoryValue(newValue);
  };
  const handleCollectionChange = (event, newValue) => {
    setCollectionValue(newValue);
  };
  const handleTagsChange = (event, newValue) => {
    setTagsValue(newValue);
  };
  const handleCancel = () => {
    getEmpty();
    setFormStatus(false);
  };
  const categoryOptions = categoryData?.map((category) => {
    return {
      id: category?._id,
      label: category?.name[i18next.language],
    };
  });
  const collectionsOptions = collectionsData?.map((collection) => {
    return {
      id: collection?._id,
      label: collection?.name,
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
                onClick={deleteItems}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("delete")}
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
              >
                {t("itemsDashboard.newItem")}
              </button>
              <button
                onClick={handleEditCategory}
                className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
                >
                {t("itemsDashboard.editItem")}
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
              <h1 className="text-center text-3xl">{t("itemsDashboard.item")}</h1>
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
                <h2>{t("itemsDashboard.category")}: </h2>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={categoryOptions}
                  sx={{ width: 300 }}
                  defaultValue={categoryValue?.label}
                  onChange={handleOptionChange}
                  renderInput={(params) => (
                    <TextField {...params} placeholder={t("itemsDashboard.selectCategory")} />
                  )}
                  className="category-input bg-white dark:bg-black dark:!text-white"
                />
                <h2>{t("itemsDashboard.collection")}: </h2>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={collectionsOptions}
                  sx={{ width: 300 }}
                  defaultValue={collectionValue?.label}
                  onChange={handleCollectionChange}
                  renderInput={(params) => (
                    <TextField {...params} placeholder={t("itemsDashboard.selectCollection")} />
                  )}
                  className="category-input bg-white dark:bg-black dark:!text-white"
                />
                <h2>{t("itemsDashboard.tags")}: </h2>
                <FreeSolo
                  data={tagsData}
                  defaultVal={tagsValue}
                  onChange={handleTagsChange}
                  placeholder={t("itemsDashboard.tags")}
                />
                <h2>{t("itemsDashboard.description")}: </h2>
                <Markdown value={value} setValue={setValue} />
              </div>
              <div className="flex gap-x-3">
                <button
                  onClick={createItems ? handleCreateItem : handleUpdateItem}
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardItems;
