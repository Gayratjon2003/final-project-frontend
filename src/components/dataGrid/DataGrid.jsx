import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export default function DataGridDemo({
  rows,
  columns,
  title,
  checkboxSelection,
  sx,
  onRowsSelectionHandler,
  selectedIds,
}) {
  const handleProcessRowUpdate = (newRow, oldRow) => {};
  const onProcessRowUpdateError = () => {};
  return (
    <Box sx={{ height: 400, width: "100%" }} className="bg-white">
      {title && <h1 className="text-center dark:text-black py-2">{title}</h1>}
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        sx={sx}
        pageSizeOptions={[5]}
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={onProcessRowUpdateError}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick
        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
        rowSelectionModel={selectedIds}
        className="dark:bg-white data-grid dark:!text-black"
      />
    </Box>
  );
}
