
import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import EnhancedCourseCreationForm from "@/components/courses/EnhancedCourseCreationForm";

const AddCourse = () => {
  const navigate = useNavigate();

  const handleSuccess = (courseData: any) => {
    // Navigate to the new course page
    navigate(`/courses/${courseData.id}`);
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  return (
    <AppLayout>
      <EnhancedCourseCreationForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </AppLayout>
  );
};

export default AddCourse;
