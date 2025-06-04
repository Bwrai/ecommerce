import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Metadata from '../layout/Metadata';
import Loader from '../layout/Loader/Loader';
import { updatePassword, clearErrors, clearUpdateStatus } from '../../features/User/userSlice';
import { showAlert } from '../../features/alertSlice';

import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import './UpdatePassword.css';

// Validation Schema
const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required('Old password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const preErrorRef = useRef(null);
  const hasUpdatedRef = useRef(false);

  const { isUpdated, error, loading } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.set('oldPassword', data.oldPassword);
    formData.set('newPassword', data.newPassword);
    formData.set('confirmPassword', data.confirmPassword);
    dispatch(updatePassword(formData));
  };

  useEffect(() => {
    if (error && error !== preErrorRef.current) {
      preErrorRef.current = error;
      dispatch(
        showAlert({
          id: uuidv4(),
          type: 'error',
          message: error || 'Password update failed',
        })
      );
      dispatch(clearErrors());
    }

    if (isUpdated && !hasUpdatedRef.current) {
      hasUpdatedRef.current = true;
      dispatch(
        showAlert({
          id: uuidv4(),
          type: 'success',
          message: 'Password successfully updated',
        })
      );
      dispatch(clearUpdateStatus());
      navigate('/account');
    }
  }, [dispatch, error, isUpdated, navigate]);

  if (loading) return <Loader />;

  return (
    <>
      <Metadata title="Change Password" />
      <div className="update-password-wrapper">
        <div className="update-password-card">
          <h2 className="update-password-title">Change Password</h2>
          <form className="update-password-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            {/* Old Password */}
            <div className="update-password-input-group">
              <VpnKeyIcon className="update-password-icon" />
              <input
                type="password"
                placeholder="Old Password"
                {...register('oldPassword')}
                autoComplete="current-password"
              />
            </div>
            {errors.oldPassword && <p className="error-msg">{errors.oldPassword.message}</p>}

            {/* New Password */}
            <div className="update-password-input-group">
              <LockOpenIcon className="update-password-icon" />
              <input
                type="password"
                placeholder="New Password"
                {...register('newPassword')}
                autoComplete="new-password"
              />
            </div>
            {errors.newPassword && <p className="error-msg">{errors.newPassword.message}</p>}

            {/* Confirm Password */}
            <div className="update-password-input-group">
              <LockIcon className="update-password-icon" />
              <input
                type="password"
                placeholder="Confirm Password"
                {...register('confirmPassword')}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword.message}</p>}

            <button type="submit" className="update-password-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;


// import Metadata from '../layout/Metadata'
// import React, { useEffect, useRef, useState } from 'react';
// import VpnKeyIcon from '@mui/icons-material/VpnKey';
// import LockOpenIcon from '@mui/icons-material/LockOpen';
// import LockIcon from '@mui/icons-material/Lock';
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom';
// import { showAlert } from '../../features/alertSlice';
// import { v4 as uuidv4 } from 'uuid';
// import { clearErrors, clearUpdateStatus, updatePassword } from '../../features/User/userSlice';
// import Loader from '../layout/Loader/Loader';
// import "./UpdatePassword.css"

// const UpdatePassword = () => {

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const preErrorRef = useRef(null);
//     const hasUpdatedRef = useRef(false);
//     const { isUpdated, error, loading } = useSelector((state) => state.user);

//     const [oldPassword, setOldPassword] = useState("")
//     const [newPassword, setNewPassword] = useState("")
//     const [confirmPassword, setConfirmPassword] = useState("")

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.set("oldPassword", oldPassword);
//         formData.set("newPassword", newPassword);
//         formData.set("confirmPassword", confirmPassword);
//         dispatch(updatePassword(formData));
//     }

//     useEffect(() => {
//         if (error && error !== preErrorRef.current) {
//             preErrorRef.current = error;
//             dispatch(showAlert({
//                 id: uuidv4(),
//                 type: "error",
//                 message: "Password update Failed"
//             }))
//             dispatch(clearErrors())
//         }
//         if (isUpdated && !hasUpdatedRef.current) {
//             hasUpdatedRef.current = true;
//             dispatch(showAlert({
//                 id: uuidv4(),
//                 type: "success",
//                 message: "Password successfully updated"
//             }))
//             dispatch(clearUpdateStatus())
//             navigate("/account")
//         }
//     }, [dispatch, error, isUpdated, navigate])

//     if (loading) {
//         return <Loader />
//     }
//     return (
//         <>
//             <Metadata title="Change Password" />
//             <div className='update-password-wrapper'>
//                 <div className='update-password-card'>
//                     <h2 className='update-password-title'>Change Password</h2>
//                     <form
//                         className='update-password-form'
//                         onSubmit={handleSubmit}
//                         autoComplete='off'>
//                         <div className='update-password-input-group'>
//                             <VpnKeyIcon className='update-password-icon' />
//                             <input
//                                 type="password"
//                                 placeholder='Old Password'
//                                 value={oldPassword}
//                                 onChange={(e) => setOldPassword(e.target.value)}
//                                 required
//                                 autoComplete='current-password'
//                             />
//                         </div>

//                         <div className='update-password-input-group'>
//                             <LockOpenIcon className='update-password-icon' />
//                             <input
//                                 type="password"
//                                 placeholder='New Password'
//                                 value={newPassword}
//                                 onChange={(e) => setNewPassword(e.target.value)}
//                                 required
//                                 autoComplete='new-password'
//                             />
//                         </div>

//                         <div className='update-password-input-group'>
//                             <LockIcon className='update-password-icon' />
//                             <input
//                                 type="password"
//                                 placeholder='Confirm Password'
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 required
//                                 autoComplete='new-password'
//                             />
//                         </div>
//                         <button
//                             type='submit'
//                             className='update-password-btn'
//                             disabled={loading}
//                         >
//                             {loading ? "Updating" : "Update Password"}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default UpdatePassword