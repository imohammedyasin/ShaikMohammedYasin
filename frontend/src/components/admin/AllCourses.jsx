import React, { useState, useEffect } from 'react'
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material'
import axiosInstance from '../common/AxiosInstance'



const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
   },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
   '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
   },
   // hide last border
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));


const AllCourses = () => {
   const [allCourses, setAllCourses] = useState([])

   const allCoursesList = async () => {
      try {
         const res = await axiosInstance.get('api/admin/getallcourses', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllCourses(res.data.data)
         }
         else {
            alert(res.data.message)
         }
      } catch (error) {
         console.error('Error fetching courses:', error);
         alert('Failed to fetch courses. Please try again.');
      }
   }

   useEffect(() => {
      allCoursesList()
      
      // Listen for course updates from other components
      const handleCourseUpdate = () => {
        allCoursesList();
      };
      
      window.addEventListener('courseUpdated', handleCourseUpdate);
      
      return () => {
        window.removeEventListener('courseUpdated', handleCourseUpdate);
      };
   }, [])

   const deleteCourse = async (courseId) => {
      const confirmation = confirm('Are you sure you want to delete')
      if (!confirmation) {
         return;
      }
      try {
         const res = await axiosInstance.delete(`/api/admin/deletecourse/${courseId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
         })
         if (res.data.success) {
            alert(res.data.message)
            await allCoursesList()
            
            // Trigger a global refresh event for other components
            window.dispatchEvent(new CustomEvent('courseUpdated', { 
              detail: { courseId, action: 'delete' } 
            }));
         } else {
            alert("Failed to delete the course")
         }
      } catch (error) {
         console.error('Error deleting course:', error);
         alert('Failed to delete course. Please try again.');
      }
   }
   return (
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
               <TableRow>
                  <StyledTableCell>Cousre ID</StyledTableCell>
                  <StyledTableCell align="center">Course Name</StyledTableCell>
                  <StyledTableCell align="left">Course Educator</StyledTableCell>
                  <StyledTableCell align="center">Course Category</StyledTableCell>
                  <StyledTableCell align="left">Course Price</StyledTableCell>
                  <StyledTableCell align="left">Course Sections</StyledTableCell>
                  <StyledTableCell align="left">Enrolled Students</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {
                  allCourses.length > 0 ? (
                     allCourses.map((Course) => (
                        <StyledTableRow key={Course._id}>
                           <StyledTableCell component="th" scope="row">
                              {Course._id}
                           </StyledTableCell>
                           <StyledTableCell align="center" component="th" scope="row">
                              {Course.C_title}
                           </StyledTableCell>
                           <StyledTableCell align="center" component="th" scope="row">
                              {Course.C_educator}
                           </StyledTableCell>
                           <StyledTableCell align="center" component="th" scope="row">
                              {Course.C_categories}
                           </StyledTableCell>
                           <StyledTableCell align="center" component="th" scope="row">
                              {Course.C_price === 'free' || Course.C_price === '0' || Course.C_price === 0 ? 'Free' : `₹${Course.C_price}`}
                           </StyledTableCell>
                           <StyledTableCell align="center" component="th" scope="row">
                              {Course.sections.length}
                           </StyledTableCell>
                           <StyledTableCell align="center" component="th" scope="row">
                              {Course.enrolled}
                           </StyledTableCell>
                           <StyledTableCell align="center" component="th" scope="row">
                              <Button onClick={() => deleteCourse(Course._id)} size='small' color="error">Delete</Button>
                              {/* <Button size='small' color="info">Update</Button> */}
                           </StyledTableCell>
                        </StyledTableRow>
                     )))
                     :
                     (<p className='px-2'>No users found</p>)
               }
            </TableBody>
         </Table>
      </TableContainer>
   )
}

export default AllCourses
