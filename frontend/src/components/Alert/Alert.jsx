// src/components/Alert.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeAlert } from "../../features/alertSlice";
import '../../styles/Alert.css'


const Alert = () => {
  const alerts = useSelector(state => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    alerts.forEach(alert => {
      setTimeout(() => {
        dispatch(removeAlert(alert.id));
      }, 3000);
    });
  }, [alerts, dispatch]);

  return (
    <div className="alert-container">
      {alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default Alert;

