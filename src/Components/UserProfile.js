import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Avatar,
  TextField,
  Button,
  Modal,
  Box,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";

const UserProfileForm = () => {
  const [user, setUser] = useState({
    userId: null,
    employeeId: "",
    userImagePath: "",
    userFirstName: "",
    userLastName: "",
    userLocation: "",
    userDepartment: "",
    userTitle: "",
    userEmail: "",
    userPhoneNumber: "",
  });

  const [initialUser, setInitialUser] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const forgotpassword = localStorage.getItem("forgotpassword");
    if (forgotpassword === "1") {
      setPasswordModalOpen(true);
    }
    if (userId) {
      fetchUserData(userId);
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    if (name === "currentPassword") {
      setCurrentPassword(value);
      setPasswordError("");
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7243/userprofile/GetUserById/${user.userId}`
      );

      const savedPassword = response.data.userPassword;

      if (currentPassword !== savedPassword) {
        setPasswordError("Current password is incorrect");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }

      const updatePasswordData = {
        NewPassword: newPassword,
      };

      await axios.put(
        `https://localhost:7243/userprofile/UpdateUserPassword/${user.userId}`,
        updatePasswordData
      );

      toast.success("Password Updated Successfully");
      setPasswordModalOpen(false);
      localStorage.removeItem("forgotpassword");
    } catch (error) {
      toast.error("Error while Updating Password");
      console.error("Error updating password:", error);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `https://localhost:7243/userprofile/GetUserById/${userId}`
      );
      setUser(response.data);
      setInitialUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

  const handleImageChange = (e) => {
    const selectedImageFile = e.target.files[0];

    if (selectedImageFile) {
      // Check if the selected file is of an allowed type
      if (!ALLOWED_IMAGE_TYPES.includes(selectedImageFile.type)) {
        toast.error("Invalid image format. Please select a JPEG or PNG image.");
        return;
      }

      // Check if the selected file exceeds the maximum size
      if (selectedImageFile.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error("Image size exceeds the maximum allowed size (5MB).");
        return;
      }

      const selectedImage = URL.createObjectURL(selectedImageFile);

      setImageFile(selectedImageFile);
      setShowConfirm(true);

      setUser((prevUser) => ({
        ...prevUser,
        userImagePath: selectedImage,
      }));
    }
  };

  const handleFormDataSubmit = async (e) => {
    e.preventDefault();

    if (!user.userId) {
      console.error("User ID is not available.");
      return;
    }

    const formData = new FormData();
    formData.append("userFirstName", user.userFirstName);
    formData.append("userLastName", user.userLastName);
    formData.append("userLocation", user.userLocation);
    formData.append("userDepartment", user.userDepartment);
    formData.append("userTitle", user.userTitle);
    formData.append("userEmail", user.userEmail);
    formData.append("userPhoneNumber", user.userPhoneNumber);

    try {
      await axios.put(
        `https://localhost:7243/userprofile/UpdateUserData/${user.userId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("User Profile Successfully updated");
    } catch (error) {
      toast.error("Error updating user data:", error);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    if (!user.userId) {
      console.error("User ID is not available.");
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", imageFile);

    try {
      await axios.put(
        `https://localhost:7243/userprofile/UpdateUserImage/${user.userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const userId = localStorage.getItem("userId");
      if (userId) {
        fetchUserData(userId);
      }

      setShowConfirm(false);
    } catch (error) {
      console.error("Error updating user image:", error);
    }
  };

  const handleCancel = () => {
    setUser(initialUser);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 6, marginTop: 5 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Avatar
              alt="User Profile"
              src={`https://localhost:7243/uploads/user/${user.userImagePath}`}
              sx={{ width: 150, height: 150 }}
            />
            <div style={{ marginTop: 16 }}>
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="fileImg"
              />
              <label htmlFor="fileImg">
                <Button variant="outlined" component="span">
                  <EditIcon />
                  Change Photo
                </Button>
              </label>
              {showConfirm && (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleImageSubmit}
                    style={{ marginLeft: 15, marginTop: 10 }}
                  >
                    <CheckIcon />
                    Confirm
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setShowConfirm(false);
                      setUser((prevUser) => ({
                        ...prevUser,
                        userImagePath: initialUser.userImagePath,
                      }));
                    }}
                    style={{ marginLeft: 15, marginTop: 10 }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={8}>
            <div className="user-profile-fields">
              <span style={{ float: "right" }}>
                {" "}
                Employee ID :{" "}
                <strong style={{ fontSize: "24px" }}>
                  {" "}
                  {user.employeeId}{" "}
                </strong>
              </span>
              <TextField
                label="First Name"
                fullWidth
                name="userFirstName"
                value={user.userFirstName}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                className="user-profile-field"
              />
              <TextField
                label="Last Name"
                fullWidth
                name="userLastName"
                value={user.userLastName}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                className="user-profile-field"
              />
              <TextField
                select
                label="Location"
                fullWidth
                name="userLocation"
                value={user.userLocation}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                className="user-profile-field"
              >
                <MenuItem value="Chennai">Chennai</MenuItem>
                <MenuItem value="Coimbatore">Coimbatore</MenuItem>
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Noida">Noida</MenuItem>
              </TextField>
              <TextField
                label="Department"
                fullWidth
                name="userDepartment"
                value={user.userDepartment}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                className="user-profile-field"
              />
              <TextField
                label="Title"
                fullWidth
                name="userTitle"
                value={user.userTitle}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                className="user-profile-field"
              />
              <TextField
                label="Email Address"
                fullWidth
                name="userEmail"
                value={user.userEmail}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                className="user-profile-field"
              />
              <TextField
                label="Phone Number"
                fullWidth
                name="userPhoneNumber"
                value={user.userPhoneNumber}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                className="user-profile-field"
              />
              <div className="user-profile-buttons" style={{ marginTop: 25 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ marginRight: "3%" }}
                  onClick={handleFormDataSubmit}
                  className="user-profile-button"
                >
                  Update
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ marginRight: "3%" }}
                  onClick={handleCancel}
                  className="user-profile-button"
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setPasswordModalOpen(true)}
                  className="user-profile-button"
                >
                  Update Password
                </Button>
              </div>
            </div>
            <Modal
              open={passwordModalOpen}
              onClose={() => setPasswordModalOpen(false)}
              aria-labelledby="password-modal-title"
              aria-describedby="password-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  p: 3,
                  bgcolor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={() => setPasswordModalOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </div>
                <h2 style={{ paddingBottom: 20 }} id="password-modal-title">
                  Update Password
                </h2>
                <TextField
                  label="Current Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  name="currentPassword"
                  onChange={handlePasswordChange}
                  error={passwordError !== ""}
                  helperText={passwordError}
                  style={{ marginBottom: 10 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  name="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  style={{ marginBottom: 10 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handlePasswordChange}
                  style={{ marginBottom: 10 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePasswordUpdate}
                  fullWidth
                  style={{ marginTop: 20 }}
                >
                  Update Password
                </Button>
              </Box>
            </Modal>
          </Grid>
        </Grid>
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default UserProfileForm;
