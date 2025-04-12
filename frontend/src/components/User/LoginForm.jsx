import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { login } from "../../features/User/userSlice";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import * as Yup from "yup";
import { showAlert } from "../../features/alertSlice";
import { v4 as uuidv4 } from 'uuid';


// ✅ Validation schema for login form using Yup
const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});

const LoginForm = ({ dispatch, isSubmitting, setIsSubmitting }) => {
  // ✅ Initialize form with React Hook Form and Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginValidationSchema) });

  // ✅ Handle form submission
  const onLoginSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await dispatch(login(data)).unwrap();
      dispatch(showAlert({
        id: uuidv4(),
        type: "success",
        message: "User Logged in Successfully"
      }))
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onLoginSubmit)} className="authForm">
      {/* Email Input Field */}
      <div className="inputGroup">
        <MailOutlineIcon />
        <input
          {...register("email")}
          type="email"
          placeholder="Email Address"
          className={errors.email ? "errorField" : ""}
        />
        {errors.email && <div className="errorMessage">{errors.email.message}</div>}
      </div>

      {/* Password Input Field */}
      <div className="inputGroup">
        <LockOpenIcon />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className={errors.password ? "errorField" : ""}
        />
        {errors.password && <div className="errorMessage">{errors.password.message}</div>}
      </div>

      {/* Forgot Password Link */}
      <Link to="/password/forgot">Forgot Password?</Link>

      {/* Submit Button */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
