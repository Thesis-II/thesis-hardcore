import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavA from "../NavA";
import Axios from "axios";

const FinalExam = () => {
  const [studentData, setStudentData] = useState([]);
  const { sectionID } = useParams();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:3001/api/studentList?sectionID=${sectionID}`
        );
        setStudentData(response.data);
      } catch (error) {
        console.error(error);
        alert("An error occurred while fetching student data");
      }
    };

    fetchStudentData();
  }, [sectionID]);

  return (
    <div>
      <NavA />
      <div className='assessment-main-wrapper'>
        <div className='final-sub-wrapper'>
          <div className='sqr1'>
            <div style={{ maxHeight: "620px", overflow: "auto" }}>
              <table className='table-main-wrapper'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>FIRST NAME</th>
                    <th>LAST NAME</th>
                    <th>MENU</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>
                        <button className='dlt-btn'>TAKE</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalExam;
