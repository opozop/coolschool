// CourseStudents
CourseStudents.join(Students, "studentId", "student", ["sortName"]);

// Relatives
Relatives.join(Parents, "parentId", "relative", ["sortName"]);

// Courses
Courses.join(Years, "yearId", "year", ["year"]);
Courses.join(Services, "serviceId", "service", ["name", "code"]);
Courses.join(Subjects, "subjectId", "subject", ["name", "code"]);
Courses.join(Teachers, "teacherId", "teacher", ["sortName"]);

