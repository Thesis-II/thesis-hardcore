import { useState } from "react";
import { Link } from "react-router-dom";
import NavA from "../NavA";

const L1Test1 = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  let textToRead =
    "Once, on a sunny day, a crow found a pitcher. The crow was thirsty. It used a stone to drop into the pitcher and get the water it needed.";

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const readAloud = () => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    const spanElements = document.querySelectorAll(".words-controller");
    const replacementTexts = [];

    spanElements.forEach((spanElement, index) => {
      const placeholder = `blank`;
      replacementTexts.push(spanElement.textContent);
      textToRead = textToRead.replace(replacementTexts[index], placeholder);
    });

    utterance.text = textToRead;
    speechSynthesis.speak(utterance);

    replacementTexts.forEach((replacementText) => {
      textToRead = textToRead.replace(`blank`, replacementText);
    });
  };

  return (
    <div>
      <NavA />
      <div className='class-section-main'>
        <div className='class-section-wrapper'>
          <div className='class-section-sidebar'>
            <div className='class-section-sidebar-wrapper'>
              <div className='class-sidebar-header'>
                <h1>Activities</h1>
              </div>
              <div className='class-sidebar-menu'>
                <ul>
                  <li>
                    <div className='class-sidebar-semi-container'>
                      <h3>
                        <div
                          onClick={toggleDropdown}
                          className='h2-lesson-control'>
                          Activity 1
                        </div>
                        {isDropdownOpen && (
                          <div className='dropdown-content'>
                            <div className='lesson-links-control'>
                              <Link className='link-css-control' to='/lesson1'>
                                The Crow and the Pitcher
                              </Link>
                            </div>
                            <div className='lesson-links-control'>
                              <Link className='link-css-control' to='/l1t1'>
                                Test: The Crow and the Pitcher
                              </Link>
                            </div>
                          </div>
                        )}
                      </h3>
                    </div>
                  </li>
                  <li>
                    <Link to='/unit2'>
                      <div className='class-sidebar-semi-container'>
                        <h2>Activity 2</h2>
                        <p>&#x1F512;</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to='/unit3'>
                      <div className='class-sidebar-semi-container'>
                        <h2>Activity 3</h2>
                        <p>&#x1F512;</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to='/unit4'>
                      <div className='class-sidebar-semi-container'>
                        <h2>Activity 4</h2>
                        <p>&#x1F512;</p>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='class-section-content'>
            <div className='class-test-main-wrapper'>
              <div className='class-test-box-1'>The Crow and the Pitcher</div>
              <div className='class-test-box-2'>
                Once, on a <span className='words-controller'>sunny</span> day,
                a crow <span className='words-controller'>found</span> a
                pitcher. The crow was{" "}
                <span className='words-controller'>thirsty</span>. It used a
                stone to drop into the pitcher and get the{" "}
                <span className='words-controller'>water</span> it needed.
              </div>
              <div className='class-test-box-3'>
                <button
                  className='class-test-button-control'
                  onClick={readAloud}>
                  Read Aloud
                </button>
              </div>
              <div className='class-test-box-4'>
                <table className='class-test-table'>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Menu</th>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default L1Test1;
