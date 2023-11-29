import React from 'react';
import "./composant.css";
import carousel1 from "../assets/img/carousel1.jpeg";
import carousel2 from "../assets/img/carousel2.jpg";
import carousel3 from "../assets/img/carousel.avif";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Carousel() {

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={carousel1} className="d-block" alt="slide" style={{width:"100%", height: "100%"}}/>
                <div className="carousel-caption d-none d-md-block">
                  <h5>E-Book</h5>
                  <p>Tout un monde de livres</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src={carousel2} className="d-block" alt="slide" style={{width:"100%", height: "10%"}} />
                <div className="carousel-caption d-none d-md-block">
                  <h5>E-Book</h5>
                  <p>Ouvrez les portes de l'imaginaire avec chaque page tournée.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src={carousel3} className="d-block" alt="slide" style={{width:"100%", height: "10%"}}  />
                <div className="carousel-caption d-none d-md-block">
                  <h5>E-Book</h5>
                  <p>Plongez dans une bibliothèque numérique infinie et laissez-vous emporter par des récits qui prennent vie sur votre écran.</p>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}