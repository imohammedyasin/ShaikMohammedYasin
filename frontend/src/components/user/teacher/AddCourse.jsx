import React, { useState, useContext } from 'react';
import { Box, Paper, Typography, TextField, Button, Divider, MenuItem, IconButton } from '@mui/material';
import { UserContext } from '../../../App';
import axiosInstance from '../../common/AxiosInstance';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const AddCourse = () => {
   const user = useContext(UserContext);
   const [addCourse, setAddCourse] = useState({
      userId: user.userData._id,
      C_educator: '',
      C_title: '',
      C_categories: '',
      C_price: '',
      C_description: '',
      sections: [],
   });
   const [thumbnail, setThumbnail] = useState(null);
   const [thumbnailPreview, setThumbnailPreview] = useState(null);
   const [sectionErrors, setSectionErrors] = useState([]);
   const navigate = useNavigate();
   const [successOpen, setSuccessOpen] = useState(false);
   const [successMsg, setSuccessMsg] = useState('');
   const [loading, setLoading] = useState(false);
   const [errorMsg, setErrorMsg] = useState('');

   const handleChange = (e) => {
      const { name, value } = e.target;
      setAddCourse({ ...addCourse, [name]: value });
   };

   const handleCourseTypeChange = (e) => {
      setAddCourse({ ...addCourse, C_categories: e.target.value });
   };

   const addInputGroup = () => {
      setAddCourse({
         ...addCourse,
         sections: [
            ...addCourse.sections,
            {
               S_title: '',
               S_description: '',
               S_content: null,
            },
         ],
      });
   };

   const handleChangeSection = (index, e) => {
      const updatedSections = [...addCourse.sections];
      const sectionToUpdate = updatedSections[index];
      const errors = [...sectionErrors];

      if (e.target.name.endsWith('S_content')) {
         const file = e.target.files[0];
         if (file && file.type !== 'video/mp4') {
            errors[index] = 'Only .mp4 video files are allowed.';
            setSectionErrors(errors);
            sectionToUpdate.S_content = null;
            setAddCourse({ ...addCourse, sections: updatedSections });
            return;
         } else {
            errors[index] = '';
         }
         sectionToUpdate.S_content = file;
      } else {
         sectionToUpdate[e.target.name] = e.target.value;
      }
      setSectionErrors(errors);
      setAddCourse({ ...addCourse, sections: updatedSections });
   };

   const removeInputGroup = (index) => {
      const updatedSections = [...addCourse.sections];
      updatedSections.splice(index, 1);
      setAddCourse({
         ...addCourse,
         sections: updatedSections,
      });
   };

   const handleThumbnailChange = (e) => {
      const file = e.target.files[0];
      setThumbnail(file);
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => setThumbnailPreview(reader.result);
         reader.readAsDataURL(file);
      } else {
         setThumbnailPreview(null);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setErrorMsg('');
      // Check for .mp4 errors before submit
      let hasError = false;
      const errors = [...sectionErrors];
      addCourse.sections.forEach((section, idx) => {
         if (!section.S_content || (section.S_content && section.S_content.type !== 'video/mp4')) {
            errors[idx] = 'Only .mp4 video files are allowed.';
            hasError = true;
         }
      });
      setSectionErrors(errors);
      if (hasError) return;

      const formData = new FormData();
      if (thumbnail) {
         formData.append('thumbnail', thumbnail);
      }
      Object.keys(addCourse).forEach((key) => {
         if (key === 'sections') {
            addCourse[key].forEach((section, index) => {
               if (section.S_content instanceof File) {
                  formData.append(`S_content`, section.S_content);
               }
               formData.append(`S_title`, section.S_title);
               formData.append(`S_description`, section.S_description);
            });
         } else if (key === 'C_categories') {
            formData.append('C_categories', addCourse[key]);
         } else {
            formData.append(key, addCourse[key]);
         }
      });

      try {
         const res = await axiosInstance.post('/api/user/addcourse', formData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
               'Content-Type': 'multipart/form-data',
            },
         });

         if (res.status === 201) {
            if (res.data.success) {
               setSuccessMsg(res.data.message);
               setSuccessOpen(true);
               setTimeout(() => navigate('/dashboard?tab=home'), 1200);
            } else {
               setErrorMsg(res.data.message || 'Failed to create course');
            }
         } else {
            setErrorMsg('Unexpected response status: ' + res.status);
         }
      } catch (error) {
         setErrorMsg(error.response?.data?.message || (error.message ? error.message : 'An error occurred while creating the course, only .mp4 videos can be uploaded'));
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         <Snackbar open={successOpen} autoHideDuration={1200} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <MuiAlert elevation={6} variant="filled" onClose={() => setSuccessOpen(false)} severity="success">
               {successMsg}
            </MuiAlert>
         </Snackbar>
         <Snackbar open={!!errorMsg} autoHideDuration={3000} onClose={() => setErrorMsg('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <MuiAlert elevation={6} variant="filled" onClose={() => setErrorMsg('')} severity="error">
               {errorMsg}
            </MuiAlert>
         </Snackbar>
         <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
               <Typography variant="h5" fontWeight={700} mb={2} color="var(--gold-primary)">Upload New Course</Typography>
               <Divider sx={{ mb: 3 }} />
               <form onSubmit={handleSubmit}>
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                     <Button
                        variant="contained"
                        component="label"
                        startIcon={<CloudUploadIcon />}
                        sx={{
                           bgcolor: '#2563EB',
                           color: '#fff',
                           fontWeight: 700,
                           borderRadius: 2,
                           px: 3,
                           py: 1.5,
                           boxShadow: '0 4px 12px rgba(37,99,235,0.08)',
                           textTransform: 'none',
                           fontSize: 16,
                           '&:hover': { bgcolor: '#1749B1' }
                        }}
                     >
                        Upload Thumbnail
                        <input
                           type="file"
                           accept="image/*"
                           hidden
                           onChange={handleThumbnailChange}
                        />
                     </Button>
                     {thumbnailPreview && (
                        <Box sx={{
                           width: 80,
                           height: 80,
                           borderRadius: 2,
                           overflow: 'hidden',
                           border: '2px solid #2563EB',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           bgcolor: '#F3F4F6',
                        }}>
                           <img src={thumbnailPreview} alt="Thumbnail Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                     )}
                  </Box>
                  <Select
                     labelId="course-category-label"
                     id="course-category-select"
                     name="C_categories"
                     value={addCourse.C_categories}
                     onChange={handleCourseTypeChange}
                     fullWidth
                     required
                     displayEmpty
                     renderValue={(selected) => selected ? selected : <span style={{ color: '#aaa' }}>Select course category</span>}
                     inputProps={{ 
                        'aria-label': 'Select course category',
                        'aria-describedby': 'course-category-helper'
                     }}
                     MenuProps={{
                        PaperProps: {
                           'aria-label': 'Course category options',
                           sx: {
                              '& .MuiMenuItem-root': {
                                 '&:focus': {
                                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                 }
                              }
                           }
                        }
                     }}
                     sx={{
                        mb: 2,
                        background: '#f5f7fa',
                        borderRadius: 2,
                        color: 'var(--text-primary)',
                        '& .MuiOutlinedInput-notchedOutline': {
                           borderColor: '#e3eafc'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                           borderColor: '#1976d2'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                           borderColor: '#1976d2'
                        },
                        '& .MuiSelect-icon': {
                           color: '#1976d2'
                        }
                     }}
                  >
                     <MenuItem value="" disabled aria-label="Please select a course category">
                        <em>Select course category</em>
                     </MenuItem>
                     <MenuItem value="Development">Development</MenuItem>
                     <MenuItem value="Business">Business</MenuItem>
                     <MenuItem value="Finance & Accounting">Finance & Accounting</MenuItem>
                     <MenuItem value="IT & Software">IT & Software</MenuItem>
                     <MenuItem value="Office Productivity">Office Productivity</MenuItem>
                     <MenuItem value="Personal Development">Personal Development</MenuItem>
                     <MenuItem value="Design">Design</MenuItem>
                     <MenuItem value="Marketing">Marketing</MenuItem>
                     <MenuItem value="Lifestyle">Lifestyle</MenuItem>
                     <MenuItem value="Photography & Video">Photography & Video</MenuItem>
                     <MenuItem value="Health & Fitness">Health & Fitness</MenuItem>
                     <MenuItem value="Music">Music</MenuItem>
                     <MenuItem value="Teaching & Academics">Teaching & Academics</MenuItem>
                     <MenuItem value="Finance">Finance</MenuItem>
                     <MenuItem value="Entrepreneurship">Entrepreneurship</MenuItem>
                     <MenuItem value="Communication">Communication</MenuItem>
                     <MenuItem value="Management">Management</MenuItem>
                     <MenuItem value="Sales">Sales</MenuItem>
                     <MenuItem value="Strategy">Strategy</MenuItem>
                     <MenuItem value="Operations">Operations</MenuItem>
                     <MenuItem value="Project Management">Project Management</MenuItem>
                     <MenuItem value="Business Law">Business Law</MenuItem>
                     <MenuItem value="Data Analytics">Data Analytics</MenuItem>
                     <MenuItem value="Home Business">Home Business</MenuItem>
                     <MenuItem value="Human Resources">Human Resources</MenuItem>
                     <MenuItem value="Industry">Industry</MenuItem>
                     <MenuItem value="Media">Media</MenuItem>
                     <MenuItem value="Real Estate">Real Estate</MenuItem>
                     <MenuItem value="Web Development">Web Development</MenuItem>
                     <MenuItem value="Mobile Apps">Mobile Apps</MenuItem>
                     <MenuItem value="Programming">Programming</MenuItem>
                     <MenuItem value="Game Development">Game Development</MenuItem>
                     <MenuItem value="Databases">Databases</MenuItem>
                     <MenuItem value="Software Testing">Software Testing</MenuItem>
                     <MenuItem value="Software Engineering">Software Engineering</MenuItem>
                     <MenuItem value="Development Tools">Development Tools</MenuItem>
                     <MenuItem value="E-commerce">E-commerce</MenuItem>
                     <MenuItem value="IT Certification">IT Certification</MenuItem>
                     <MenuItem value="Network & Security">Network & Security</MenuItem>
                     <MenuItem value="Hardware">Hardware</MenuItem>
                     <MenuItem value="Operating Systems">Operating Systems</MenuItem>
                     <MenuItem value="Microsoft">Microsoft</MenuItem>
                     <MenuItem value="Apple">Apple</MenuItem>
                     <MenuItem value="Google">Google</MenuItem>
                     <MenuItem value="SAP">SAP</MenuItem>
                     <MenuItem value="Intuit">Intuit</MenuItem>
                     <MenuItem value="Salesforce">Salesforce</MenuItem>
                     <MenuItem value="Oracle">Oracle</MenuItem>
                     <MenuItem value="Personal Transformation">Personal Transformation</MenuItem>
                     <MenuItem value="Leadership">Leadership</MenuItem>
                     <MenuItem value="Productivity">Productivity</MenuItem>
                     <MenuItem value="Personal Finance">Personal Finance</MenuItem>
                     <MenuItem value="Career Development">Career Development</MenuItem>
                     <MenuItem value="Parenting & Relationships">Parenting & Relationships</MenuItem>
                     <MenuItem value="Happiness">Happiness</MenuItem>
                     <MenuItem value="Religion & Spirituality">Religion & Spirituality</MenuItem>
                     <MenuItem value="Personal Brand Building">Personal Brand Building</MenuItem>
                     <MenuItem value="Creativity">Creativity</MenuItem>
                     <MenuItem value="Influence">Influence</MenuItem>
                     <MenuItem value="Self Esteem">Self Esteem</MenuItem>
                     <MenuItem value="Stress Management">Stress Management</MenuItem>
                     <MenuItem value="Memory & Study Skills">Memory & Study Skills</MenuItem>
                     <MenuItem value="Motivation">Motivation</MenuItem>
                     <MenuItem value="Web Design">Web Design</MenuItem>
                     <MenuItem value="Graphic Design">Graphic Design</MenuItem>
                     <MenuItem value="Design Tools">Design Tools</MenuItem>
                     <MenuItem value="User Experience">User Experience</MenuItem>
                     <MenuItem value="Game Design">Game Design</MenuItem>
                     <MenuItem value="Design Thinking">Design Thinking</MenuItem>
                     <MenuItem value="3D & Animation">3D & Animation</MenuItem>
                     <MenuItem value="Fashion">Fashion</MenuItem>
                     <MenuItem value="Architectural Design">Architectural Design</MenuItem>
                     <MenuItem value="Interior Design">Interior Design</MenuItem>
                     <MenuItem value="Digital Marketing">Digital Marketing</MenuItem>
                     <MenuItem value="Search Engine Optimization">Search Engine Optimization</MenuItem>
                     <MenuItem value="Social Media Marketing">Social Media Marketing</MenuItem>
                     <MenuItem value="Branding">Branding</MenuItem>
                     <MenuItem value="Marketing Fundamentals">Marketing Fundamentals</MenuItem>
                     <MenuItem value="Analytics & Automation">Analytics & Automation</MenuItem>
                     <MenuItem value="Public Relations">Public Relations</MenuItem>
                     <MenuItem value="Advertising">Advertising</MenuItem>
                     <MenuItem value="Video & Mobile Marketing">Video & Mobile Marketing</MenuItem>
                     <MenuItem value="Content Marketing">Content Marketing</MenuItem>
                     <MenuItem value="Non-Digital Marketing">Non-Digital Marketing</MenuItem>
                     <MenuItem value="Growth Hacking">Growth Hacking</MenuItem>
                     <MenuItem value="Product Marketing">Product Marketing</MenuItem>
                     <MenuItem value="Affiliate Marketing">Affiliate Marketing</MenuItem>
                     <MenuItem value="Arts & Crafts">Arts & Crafts</MenuItem>
                     <MenuItem value="Food & Beverage">Food & Beverage</MenuItem>
                     <MenuItem value="Beauty & Makeup">Beauty & Makeup</MenuItem>
                     <MenuItem value="Travel">Travel</MenuItem>
                     <MenuItem value="Gaming">Gaming</MenuItem>
                     <MenuItem value="Home Improvement">Home Improvement</MenuItem>
                     <MenuItem value="Pet Care & Training">Pet Care & Training</MenuItem>
                     <MenuItem value="Digital Photography">Digital Photography</MenuItem>
                     <MenuItem value="Photography Fundamentals">Photography Fundamentals</MenuItem>
                     <MenuItem value="Portraits">Portraits</MenuItem>
                     <MenuItem value="Landscape">Landscape</MenuItem>
                     <MenuItem value="Black & White">Black & White</MenuItem>
                     <MenuItem value="Photography Tools">Photography Tools</MenuItem>
                     <MenuItem value="Mobile Photography">Mobile Photography</MenuItem>
                     <MenuItem value="Travel Photography">Travel Photography</MenuItem>
                     <MenuItem value="Commercial Photography">Commercial Photography</MenuItem>
                     <MenuItem value="Wedding Photography">Wedding Photography</MenuItem>
                     <MenuItem value="Wildlife Photography">Wildlife Photography</MenuItem>
                     <MenuItem value="Video Design">Video Design</MenuItem>
                     <MenuItem value="Fitness">Fitness</MenuItem>
                     <MenuItem value="General Health">General Health</MenuItem>
                     <MenuItem value="Sports">Sports</MenuItem>
                     <MenuItem value="Nutrition">Nutrition</MenuItem>
                     <MenuItem value="Yoga">Yoga</MenuItem>
                     <MenuItem value="Mental Health">Mental Health</MenuItem>
                     <MenuItem value="Dieting">Dieting</MenuItem>
                     <MenuItem value="Self Defense">Self Defense</MenuItem>
                     <MenuItem value="Safety & First Aid">Safety & First Aid</MenuItem>
                     <MenuItem value="Dance">Dance</MenuItem>
                     <MenuItem value="Meditation">Meditation</MenuItem>
                     <MenuItem value="Instruments">Instruments</MenuItem>
                     <MenuItem value="Production">Production</MenuItem>
                     <MenuItem value="Music Fundamentals">Music Fundamentals</MenuItem>
                     <MenuItem value="Vocal">Vocal</MenuItem>
                     <MenuItem value="Music Techniques">Music Techniques</MenuItem>
                     <MenuItem value="Music Software">Music Software</MenuItem>
                     <MenuItem value="Engineering">Engineering</MenuItem>
                     <MenuItem value="Humanities">Humanities</MenuItem>
                     <MenuItem value="Math">Math</MenuItem>
                     <MenuItem value="Science">Science</MenuItem>
                     <MenuItem value="Online Education">Online Education</MenuItem>
                     <MenuItem value="Social Science">Social Science</MenuItem>
                     <MenuItem value="Language Learning">Language Learning</MenuItem>
                     <MenuItem value="Teacher Training">Teacher Training</MenuItem>
                     <MenuItem value="Test Prep">Test Prep</MenuItem>
                  </Select>
                  <TextField
                     label="Course Title"
                     name="C_title"
                     value={addCourse.C_title}
                     onChange={handleChange}
                     fullWidth
                     required
                     variant="outlined"
                     sx={{ mb: 2 }}
                  />
                  <TextField
                     label="Course Educator"
                     name="C_educator"
                     value={addCourse.C_educator}
                     onChange={handleChange}
                     fullWidth
                     required
                     variant="outlined"
                     sx={{ mb: 2 }}
                  />
                  <TextField
                     label="Course Price (Rs.)"
                     name="C_price"
                     value={addCourse.C_price}
                     onChange={handleChange}
                     fullWidth
                     required
                     variant="outlined"
                     sx={{ mb: 2 }}
                     placeholder="For free course, enter 0"
                     type="number"
                     inputProps={{ min: 0 }}
                  />
                  <TextField
                     label="Course Description"
                     name="C_description"
                     value={addCourse.C_description}
                     onChange={handleChange}
                     fullWidth
                     required
                     multiline
                     minRows={3}
                     variant="outlined"
                     sx={{ mb: 3 }}
                     placeholder="Enter Course description"
                  />
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="h6" fontWeight={600} mb={2} color="var(--gold-primary)">Course Sections</Typography>
                  {addCourse.sections.map((section, index) => (
                     <Paper key={index} elevation={2} sx={{ mb: 3, p: 2, borderRadius: 2, position: 'relative', background: 'var(--tertiary-dark)', border: '2px solid var(--gold-primary)' }}>
                        <IconButton
                           size="small"
                           onClick={() => removeInputGroup(index)}
                           sx={{ position: 'absolute', top: 8, right: 8, color: 'var(--error)', background: '#fff', border: '1.5px solid #2563EB', boxShadow: '0 2px 8px rgba(37,99,235,0.08)', '&:hover': { background: '#2563EB', color: '#fff' } }}
                        >
                           <DeleteIcon />
                        </IconButton>
                        <TextField
                           label="Section Title"
                           name="S_title"
                           value={section.S_title}
                           onChange={(e) => handleChangeSection(index, e)}
                           fullWidth
                           required
                           variant="outlined"
                           sx={{ mb: 2 }}
                        />
                        <TextField
                           label="Section Description"
                           name="S_description"
                           value={section.S_description}
                           onChange={(e) => handleChangeSection(index, e)}
                           fullWidth
                           required
                           multiline
                           minRows={2}
                           variant="outlined"
                           sx={{ mb: 2 }}
                        />
                        <Button
                           variant="contained"
                           component="label"
                           startIcon={<CloudUploadIcon />}
                           fullWidth
                           sx={{ mb: 1, borderRadius: 2, bgcolor: '#2563EB', color: '#fff', fontWeight: 700, textTransform: 'none', fontSize: 15, boxShadow: '0 2px 8px rgba(37,99,235,0.08)', '&:hover': { bgcolor: '#1749B1' } }}
                        >
                           Upload Section Video (.mp4)
                           <input
                              type="file"
                              name="S_content"
                              accept="video/mp4"
                              hidden
                              onChange={(e) => handleChangeSection(index, e)}
                              required
                           />
                        </Button>
                        {sectionErrors[index] && (
                           <Typography variant="body2" color="error" sx={{ mb: 1, fontWeight: 600 }}>
                              {sectionErrors[index]}
                           </Typography>
                        )}
                     </Paper>
                  ))}
                  <Button
                     startIcon={<AddCircleOutlineIcon />}
                     variant="contained"
                     onClick={addInputGroup}
                     sx={{
                        mb: 3,
                        background: 'linear-gradient(90deg, var(--gold-primary) 0%, var(--gold-accent) 100%)',
                        color: 'var(--primary-dark)',
                        fontWeight: 700,
                        borderRadius: 2,
                        border: '2px solid var(--gold-primary)',
                        boxShadow: 'var(--shadow)',
                        '&:hover': {
                           background: 'linear-gradient(90deg, var(--gold-secondary) 0%, var(--gold-primary) 100%)',
                           color: 'var(--primary-dark)',
                           boxShadow: 'var(--shadow-hover)'
                        }
                     }}
                  >
                     Add Section
                  </Button>
                  <Divider sx={{ mb: 3 }} />
                  <Button
                     type="submit"
                     variant="contained"
                     fullWidth
                     disabled={loading}
                     sx={{ background: 'linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-accent) 100%)', color: 'var(--primary-dark)', fontWeight: 700, borderRadius: 2, py: 1.5, fontSize: 16 }}
                  >
                     {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: 8 }}></span>Submitting...</span> : 'Submit Course'}
                  </Button>
               </form>
            </Paper>
         </Box>
      </>
   );
};

export default AddCourse;
