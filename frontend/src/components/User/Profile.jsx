import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Metadata from '../layout/Metadata';
import Loader from '../layout/Loader/Loader';
import './Profile.css';

const Profile = () => {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) return <Loader />;

  return (
    <>
      <Metadata title={`${user?.name}'s Profile`} />

      <div className="profileContainer">
        <div className="profileLeft">
          <h1>My Profile</h1>
          <img
            src={user?.avatar?.url || '/defaultAvatar.png'}
            alt={user?.name || 'User Avatar'}
          />
          <Link to="/me/update" className="btn">Edit Profile</Link>
        </div>

        <div className="profileRight">
          <div className="profileField">
            <h4>Full Name</h4>
            <p>{user?.name}</p>
          </div>
          <div className="profileField">
            <h4>Email</h4>
            <p>{user?.email}</p>
          </div>
          <div className="profileField">
            <h4>Joined On</h4>
            <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="profileLinks">
            <Link to="/orders" className="btn">My Orders</Link>
            <Link to="/password/update" className="btn">Change Password</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
