export interface Course {
    id: string;
    name: string;
    credits: number;
    grade: string;
  }
  
  export interface Semester {
    id: string;
    name: string;
    courses: Course[];
    color?: string;
  }
  
  export interface GradeScale {
    [key: string]: number;
  }
  
  export const calculateGPA = (courses: Course[], gradeScale: GradeScale): number => {
    let totalCredits = 0;
    let totalGradePoints = 0;
  
    courses.forEach((course) => {
      totalCredits += course.credits;
      totalGradePoints += course.credits * gradeScale[course.grade];
    });
  
    return totalCredits === 0 ? 0 : totalGradePoints / totalCredits;
  };
  
  export const calculateCGPA = (semesters: Semester[], gradeScale: GradeScale): number => {
    const allCourses = semesters.flatMap(semester => semester.courses);
    return calculateGPA(allCourses, gradeScale);
  };
  
  