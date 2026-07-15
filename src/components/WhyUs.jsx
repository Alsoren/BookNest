import "../Styles/WhyUs.css";
import socialMonstersIcon from "../assets/social-monsters.png";
import buildLibMonster from "../assets/build-lib-monster.png";
import exploreMonster from "../assets/explore-monster.png";
import { TbCircleNumber1Filled,TbCircleNumber2Filled,TbCircleNumber3Filled} from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";


function WhyUs() {
  return (
    <div className="whyus-cover">
      <h2 >Neden BookNest</h2>
      <div className="whyus-chart-wrap">
        <div className="whyus-chart">

          <div className="whyus-image">
            <img src={socialMonstersIcon} />
          </div>

          <div id="whyus-chart1" className="whyus-content">
              <h2>Connect with Others</h2>
              <p>
              Join a community of book lovers, share your thoughts, and discover
              new recommendations from readers around the world.
              </p>
          </div>
        </div>

        <div className="whyus-chart">
            <div className="whyus-image">
              <img src={buildLibMonster} />
            </div>

          <div id="whyus-chart2" className="whyus-content">
              <h2>Build Your Own Library</h2>
              <p>
              Organize your favorite books, keep track of your reading progress,
              and create a personal library that grows with you.
              </p>
          </div>
        </div>

        <div id="whyus-chart3" className="whyus-chart">
            <div className="whyus-image">
              <img src={exploreMonster} />
            </div>

          <div className="whyus-content">
              <h2>Explore New Books</h2>
              <p>
              Browse thousands of books across different genres and find your next
              great read with ease.
              </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default WhyUs;