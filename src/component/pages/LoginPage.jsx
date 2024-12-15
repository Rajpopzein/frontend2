import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import loginImage from "../../assets/rb_2744.png";
import { HiOutlineMailOpen } from "react-icons/hi";
import { FaLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alerts from "../component/Alert";

const API_URL = import.meta.env.VITE_API_URL;
const LoginPage = () => {
  const [activeLogin, setActiveLogin] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [opensnake, setOpensnake] = useState(false);
  const navigate = useNavigate();
  const handleComponentChange = () => {
    setActiveLogin(!activeLogin);
  };

  console.log("handleComponentChange", API_URL);

  // Validation Schemas
  const loginValidationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const signupValidationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    try {
      const logindata = await axios.post(
        `${API_URL}/auth/${activeLogin ? "login" : "register"}`,
        values
      );
      if (activeLogin && logindata.status === 200) {
        localStorage.setItem("token", logindata.data.token);
        setOpensnake({
          open: true,
          message: "Login successfull",
          severity: "success",
        });
      
          navigate("/chat");
      } else {
        setActiveLogin(!activeLogin);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  return (
    <div className="main-login">
      <Alerts snackbars={opensnake} handleSnackbarClose={handleSnackbarClose} />
      <section className="text-section">
        <h1>WW</h1>
      </section>
      <div className="flex login-content">
        <section className="Image-section">
          <img alt="login-img" src={loginImage} />
        </section>
        <section className="form-section">
          {activeLogin ? (
            <div className="login-text">
              <h1>{"Welcome Back :)"}</h1>
              <p className="caption">
                Join the Conversation and Make Every Moment Matter. Chat, Share,
                and Connect—All in One Place
              </p>
            </div>
          ) : (
            <>
              <h1>{"Create Account"}</h1>
              <p className="caption">
                Become a Part of Our Community Today. Sign Up, Connect, and
                Start Sharing Your World.
              </p>
            </>
          )}

          <Formik
            initialValues={
              activeLogin
                ? { email: "", password: "" }
                : { username: "", email: "", password: "", confirmPassword: "" }
            }
            validationSchema={
              activeLogin ? loginValidationSchema : signupValidationSchema
            }
            onSubmit={handleSubmit}
            enableReinitialize // Ensures Formik resets when initialValues change
          >
            {({ isSubmitting, resetForm }) => (
              <Form>
                {activeLogin ? (
                  <>
                    <div className="login-inputs-main ">
                      <Field
                        type="text"
                        name="email"
                        placeholder="Email"
                        className="input-field"
                      />
                      <HiOutlineMailOpen className="input-icon" />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-message"
                    />
                    <div className="login-inputs-main">
                      <Field
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="input-field"
                      />
                      <FaLock className="input-icon" />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                  </>
                ) : (
                  <>
                    <div className="login-inputs-main">
                      <Field
                        type="text"
                        name="username"
                        placeholder="User Name"
                        className="input-field"
                      />
                      <FaUser className="input-icon" />
                    </div>
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="error-message"
                    />
                    <div className="login-inputs-main">
                      <Field
                        type="text"
                        name="email"
                        placeholder="Email"
                        className="input-field"
                      />
                      <HiOutlineMailOpen className="input-icon" />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-message"
                    />
                    <div className="login-inputs-main">
                      <Field
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="input-field"
                      />
                      <FaLock className="input-icon" />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                    <div className="login-inputs-main">
                      <Field
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="input-field"
                      />
                      <GiConfirmed className="input-icon" />
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="error-message"
                    />
                  </>
                )}
                {activeLogin && <p className="caption">Forget Password</p>}
                <div className="btn-container">
                  <button
                    className="primary primary-btn"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {activeLogin ? "Login Now" : "Create Account"}
                  </button>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                      resetForm();
                      handleComponentChange();
                    }}
                  >
                    {activeLogin ? "Create Account" : "Login Now"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
