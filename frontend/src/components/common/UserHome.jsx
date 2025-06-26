import React, { useContext, useEffect, useState } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { UserContext } from '../../App';
import TeacherHome from '../user/teacher/TeacherHome';
import AdminHome from '../admin/AdminHome';
import StudentHome from '../user/student/StudentHome';

const UserHome = () => {
   const user = useContext(UserContext);
   const [loading, setLoading] = useState(false);
   
   let content;
   
   if (!user || !user.userData) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
         </Box>
      );
   }
   
   switch (user.userData.type) {
      case "Teacher":
         content = <TeacherHome />
         break;
      case "Admin":
         content = <AdminHome />
         break;
      case "Student":
         content = <StudentHome />
         break;
      default:
         content = (
            <Box sx={{ textAlign: 'center', py: 4 }}>
               <Typography variant="h6" color="#6B7280">
                  Unknown user type. Please contact support.
               </Typography>
            </Box>
         );
         break;
   }

   return (
      <Container maxWidth="xl">
         {content}
      </Container>
   );
};

export default UserHome;
