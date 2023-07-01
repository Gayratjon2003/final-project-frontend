import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
const FreeSolo = ({ data, defaultVal, onChange, placeholder }) => (
  <Autocomplete
    multiple
    sx={{width: 300}}
    id="tags-filled"
    options={data.map((option) => option)}
    defaultValue={ defaultVal}
    freeSolo
    onChange={onChange}
    className="custom-free-solo"
    renderTags={(value, getTagProps) =>
      value.map((option, index) => (
        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
      ))
    }
    renderInput={(params) => (
      <TextField
        {...params}
        variant="filled"
        label={placeholder}
        placeholder={placeholder}
      />
    )}
  />
);
export default FreeSolo;
