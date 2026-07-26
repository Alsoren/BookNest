import "../Styles/WhyUs.css";
import socialMonstersIcon from "../assets/social-monsters.png";
import buildLibMonster from "../assets/build-lib-monster.png";
import exploreMonster from "../assets/explore-monster.png";
import {
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  TbCircleNumber3Filled
} from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";

function WhyUs() {
  return (
    <div className="whyus-cover">
      <h2>Neden BookNest?</h2>

      <div className="whyus-chart-wrap">
        <div className="whyus-chart">
          <div className="whyus-image">
            <img
              src={socialMonstersIcon}
              alt="Okuyucu topluluğu"
            />
          </div>

          <div id="whyus-chart1" className="whyus-content">
            <h2>Diğer Okurlarla Bağlantı Kur</h2>
            <p>
              Kitapseverlerden oluşan topluluğumuza katıl, düşüncelerini
              paylaş ve dünyanın dört bir yanındaki okurlardan yeni kitap
              önerileri keşfet.
            </p>
          </div>
        </div>

        <div className="whyus-chart">
          <div className="whyus-image">
            <img
              src={buildLibMonster}
              alt="Kişisel kitaplık oluşturma"
            />
          </div>

          <div id="whyus-chart2" className="whyus-content">
            <h2>Kendi Kitaplığını Oluştur</h2>
            <p>
              Sevdiğin kitapları düzenle, okuma ilerlemeni takip et ve
              seninle birlikte büyüyen kişisel kitaplığını oluştur.
            </p>
          </div>
        </div>

        <div id="whyus-chart3" className="whyus-chart">
          <div className="whyus-image">
            <img
              src={exploreMonster}
              alt="Yeni kitaplar keşfetme"
            />
          </div>

          <div className="whyus-content">
            <h2>Yeni Kitaplar Keşfet</h2>
            <p>
              Farklı kategorilerdeki binlerce kitaba göz at ve sıradaki
              okuyacağın kitabı kolayca bul.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyUs;