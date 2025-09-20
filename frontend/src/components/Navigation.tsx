import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>TheraFlow</h2>
        <p>Therapy Scheduling & Attendance</p>
      </div>
      <ul className="nav-links">
        <li>
          <Link 
            to="/" 
            className={isActive('/') ? 'active' : ''}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/sessions" 
            className={isActive('/sessions') ? 'active' : ''}
          >
            Sessions
          </Link>
        </li>
        <li>
          <Link 
            to="/therapists" 
            className={isActive('/therapists') ? 'active' : ''}
          >
            Therapists
          </Link>
        </li>
        <li>
          <Link 
            to="/patients" 
            className={isActive('/patients') ? 'active' : ''}
          >
            Patients
          </Link>
        </li>
        <li>
          <Link 
            to="/attendance" 
            className={isActive('/attendance') ? 'active' : ''}
          >
            Attendance
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;