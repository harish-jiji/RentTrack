import Carousel from 'react-bootstrap/Carousel';
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";

function Slides() {
  return (
    <Carousel>
      <Carousel.Item>
        <img src={image1} className="d-block w-100" />
        <Carousel.Caption>
          <h3>Scenic Lakeside Vacation Rental</h3>
          <p>Beautiful lakeside cabin, a perfect getaway property for vacations or short-term rentals, offering a serene and relaxing escape.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img src={image2} className="d-block w-100" />
        <Carousel.Caption>
          <h3>Modern City Apartment</h3>
          <p>luxurious, modern apartment with stunning city views, perfect for urban professionals or those seeking a sleek, contemporary living space.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img src={image3} className="d-block w-100" />
        <Carousel.Caption>
          <h3>Cozy Suburban Family Home</h3>
          <p>Charming suburban house with a garden and white picket fence, an ideal choice for families or anyone looking for a comfortable home in a quiet neighborhood.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Slides;
