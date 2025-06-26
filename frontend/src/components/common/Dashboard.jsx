import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import UserHome from "./UserHome"
import { Container } from '@mui/material';
import AddCourse from '../user/teacher/AddCourse';
import EnrolledCourses from '../user/student/EnrolledCourses';
import { useSearchParams } from 'react-router-dom';

const Dashboard = () => {
   const [selectedComponent, setSelectedComponent] = useState('home');
   const [searchParams, setSearchParams] = useSearchParams();

   const renderSelectedComponent = () => {
      switch (selectedComponent) {
         case 'home':
            return <UserHome />
         case 'addcourse':
           return <AddCourse />
         case 'enrolledcourses':
           return <EnrolledCourses />
         default:
            return <UserHome />
      }
   };

   const handleOptionClick = (option) => {
      setSelectedComponent(option);
      setSearchParams({ tab: option });
   };

   const handleDashboardClick = () => {
      setSelectedComponent('home');
      setSearchParams({ tab: 'home' });
   };

   useEffect(() => {
      const tab = searchParams.get('tab');
      if (tab && ['home', 'addcourse', 'enrolledcourses'].includes(tab)) {
         setSelectedComponent(tab);
      }
   }, [searchParams]);

   return (
      <>
         <NavBar onOptionClick={handleOptionClick} onDashboardClick={handleDashboardClick} />
         <Container sx={{ mt: 3 }}>
            {renderSelectedComponent()}
         </Container>
      </>
   );
};

export default Dashboard;


