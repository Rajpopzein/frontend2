import axios  from "axios";
import React, { useState } from "react";
import { Modal, TextField } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const API_URL = import.meta.env.VITE_API_URL;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreateGroupPopup = ({ open, handleClose, users, currentuser, setSelectedGroup, setAllgroup }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [name, setGroupName] = useState("");
  const [description, setDescription] = useState("");

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log("event", value);
    // Ensure selectedUsers contains unique entries
    const updatedSelection = value.map((username) =>
      users.find((user) => user.username === username)
    );
    console.log("updatedSelection", selectedUsers);
    const select = updatedSelection
    setSelectedUsers(select);
  };

  const fetchGroup = async () => {
    try {
      const data = await axios.get(
        `${API_URL}/group/getAllGroups/${currentuser}`
      );
      setSelectedGroup(data.data.data[0]);
      setAllgroup(data.data.data);
      console.log("chat history", data);
    } catch (error) {
      console.log(error);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Selected Users:", selectedUsers);
    const formData = {
      name,
      description,
      members: selectedUsers.map((data) => data.userid),
      createdBy: currentuser,
    };
    console.log("Form Data:", formData);

    try {
      const data = await axios.post(`${API_URL}/group/createGroup`, formData);
      if (data.status === 200) {
        console.log("Group created successfully");
        setDescription("");
        setGroupName("");
        setSelectedUsers([]);
        fetchGroup()
        handleClose(false);
      }
    } catch (e) {
      console.log(e);
    }

    // Add your API call logic here
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="create-group-modal"
      aria-describedby="create-group-modal-description"
      className="popup-main"
    >
      <div className="Model">
        <h2>Create a Group</h2>
        <form onSubmit={handleSubmit} className="flex">
          <TextField
            placeholder="Group name"
            className="input-filed"
            value={name}
            onChange={(e) => setGroupName(e.target.value)}
            required
            name="groupName"
          />
          <TextField
            placeholder="Description"
            className="input-filed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            required
            name="description"
          />
          <FormControl sx={{ mb: 1 }}>
            <InputLabel id="demo-multiple-checkbox-label">Members</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={selectedUsers.map((user) => user?.username)}
              onChange={handleChange}
              input={<OutlinedInput label="Members" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              name="members"
            >
              {users.map((user, index) => (
                <MenuItem key={index} value={user?.username} >
                  <Checkbox
                    checked={selectedUsers.some(
                      (selectedUser) => selectedUser.username === user.username
                    )}
                  />
                  <ListItemText primary={user.username} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="btn-sec">
            <button type="submit" className="popup-btn primary">
              Create Group
            </button>
            <button
              type="button"
              className="popup-btn secondary"
              onClick={() => handleClose(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateGroupPopup;
