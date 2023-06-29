import React from "react";
import { Carousel } from "react-responsive-carousel";

const index = () => {
  return (
    <>
      <div
        className="slider-area slider-height"
        data-background="assets/image/user/hero/h1_hero.jpg"
      >
        <div className="slider-active">
          <Carousel>
            <div className="single-slider">
              <div className="slider-cap-wrapper">
                <div className="hero__caption">
                  <p data-animation="fadeInLeft" data-delay=".2s">
                    Achieve your financial goal
                  </p>
                  <h1 data-animation="fadeInLeft" data-delay=".5s">
                    Small Business Loans For Daily Expenses.
                  </h1>
                  <a
                    href="apply.html"
                    className="btn hero-btn"
                    data-animation="fadeInLeft"
                    data-delay=".8s"
                  >
                    Apply for Loan
                  </a>
                </div>
                <div className="hero__img">
                  <img src="assets/image/user/hero/hero_img.jpg" alt="" />
                </div>
              </div>
            </div>
            <div className="single-slider">
              <div className="slider-cap-wrapper">
                <div className="hero__caption">
                  <p data-animation="fadeInLeft" data-delay=".2s">
                    Achieve your financial goal
                  </p>
                  <h1 data-animation="fadeInLeft" data-delay=".5s">
                    Small Business Loans For Daily Expenses.
                  </h1>
                  <a
                    href="apply.html"
                    className="btn hero-btn"
                    data-animation="fadeInLeft"
                    data-delay=".8s"
                  >
                    Apply for Loan
                  </a>
                </div>
                <div className="hero__img">
                  <img src="assets/image/user/hero/hero_img2.jpg" alt="" />
                </div>
              </div>
            </div>
          </Carousel>
        </div>
        <div className="slider-footer section-bg d-none d-sm-block">
          <div className="footer-wrapper">
            <div className="single-caption">
              <div className="single-img">
                <img src="assets/image/user/hero/hero_footer.png" alt="" />
              </div>
            </div>
            <div className="single-caption">
              <div className="caption-icon">
                <span className="flaticon-clock"></span>
              </div>
              <div className="caption">
                <p>Quick & Easy Loan</p>
                <p>Approvals</p>
              </div>
            </div>
            <div className="single-caption">
              <div className="caption-icon">
                <span className="flaticon-like"></span>
              </div>
              <div className="caption">
                <p>Quick & Easy Loan</p>
                <p>Approvals</p>
              </div>
            </div>
            <div className="single-caption">
              <div className="caption-icon">
                <span className="flaticon-money"></span>
              </div>
              <div className="caption">
                <p>Quick & Easy Loan</p>
                <p>Approvals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="about-low-area section-padding2">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="about-caption mb-50">
                <div className="section-tittle mb-35">
                  <span>About Our Company</span>
                  <h2>Building a Brighter financial Future & Good Support.</h2>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  oeiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut eniminixm, quis nostrud exercitation ullamco laboris nisi
                  ut aliquip exeaoauat. Duis aute irure dolor in reprehe.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  oeiusmod tempor incididunt ut labore et dolore magna aliq.
                </p>
                <a href="apply.html" className="btn">
                  Apply for Loan
                </a>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="about-img ">
                <div className="about-font-img d-none d-lg-block">
                  <img src="/assets/image/user/gallery/about2.png" alt="" />
                </div>
                <div className="about-back-img ">
                  <img src="/assets/image/user/gallery/about1.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="services-area pt-150 pb-150"
        data-background="/assets/image/user/gallery/section_bg02.jpg"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-10">
              <div className="section-tittle text-center mb-80">
                <span>Services that we are providing</span>
                <h2>High Performance Services For All Industries.</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-cat text-center mb-50">
                <div className="cat-icon">
                  <span className="bi bi-briefcase"></span>
                </div>
                <div className="cat-cap">
                  <h5>
                    <a href="services.html">Business Loan</a>
                  </h5>
                  <p>
                    Consectetur adipisicing elit, sed doeiusmod tempor
                    incididunt ut labore et dolore
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-cat text-center mb-50">
                <div className="cat-icon">
                  <span className="bi bi-shop"></span>
                </div>
                <div className="cat-cap">
                  <h5>
                    <a href="services.html">Commercial Loans</a>
                  </h5>
                  <p>
                    Consectetur adipisicing elit, sed doeiusmod tempor
                    incididunt ut labore et dolore
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-cat text-center mb-50">
                <div className="cat-icon">
                  <span className="bi bi-cone-striped"></span>
                </div>
                <div className="cat-cap">
                  <h5>
                    <a href="services.html">Construction Loans</a>
                  </h5>
                  <p>
                    Consectetur adipisicing elit, sed doeiusmod tempor
                    incididunt ut labore et dolore
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-cat text-center mb-50">
                <div className="cat-icon">
                  <span className="bi bi-briefcase"></span>
                </div>
                <div className="cat-cap">
                  <h5>
                    <a href="services.html">Business Loan</a>
                  </h5>
                  <p>
                    Consectetur adipisicing elit, sed doeiusmod tempor
                    incididunt ut labore et dolore
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="support-company-area section-padding3 fix">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="support-location-img mb-50">
                <img src="assets/image/user/gallery/single2.jpg" alt="" />
                <div className="support-img-cap">
                  <span>Since 1992</span>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="right-caption">
                <div className="section-tittle">
                  <span>Why Choose Our Company</span>
                  <h2>We Promise Sustainable Future For You.</h2>
                </div>
                <div className="support-caption">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud.
                  </p>
                  <div className="select-suport-items">
                    <label className="single-items">
                      Aorem ipsum dgolor sitnfd amet dfgbn fbsdg
                      <input type="checkbox" checked="checked active" />
                      <span className="checkmark"></span>
                    </label>
                    <label className="single-items">
                      Consectetur adipisicing bfnelit, sedb dvbnfo
                      <input type="checkbox" checked="checked active" />
                      <span className="checkmark"></span>
                    </label>
                    <label className="single-items">
                      Eiusmod tempor incididunt vmgldupout labore
                      <input type="checkbox" checked="checked active" />
                      <span className="checkmark"></span>
                    </label>
                    <label className="single-items">
                      Admkde mibvnim veniam, quivds cnostrud.
                      <input type="checkbox" checked="checked active" />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div
          className="application-area pt-150 pb-140"
          data-background="/assets/image/user/gallery/section_bg03.jpg"
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-10">
                <div className="section-tittle section-tittle2 text-center mb-45">
                  <span>Apply in Three Easy Steps</span>
                  <h2>Easy Application Process For Any Types of Loan</h2>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-9 col-xl-8">
                <form action="#" className="search-box">
                  <div className="select-form">
                    <div className="select-itms">
                      <select name="select" id="select1">
                        <option value="">Select Amount</option>
                        <option value="">$120</option>
                        <option value="">$700</option>
                        <option value="">$750</option>
                        <option value="">$250</option>
                      </select>
                    </div>
                  </div>
                  <div className="select-form">
                    <div className="select-itms">
                      <select name="select" id="select1">
                        <option value="">Duration Month</option>
                        <option value="">7 Days</option>
                        <option value="">10 Days</option>
                        <option value="">14 Days Days</option>
                        <option value="">20 Days</option>
                      </select>
                    </div>
                  </div>
                  <div className="input-form">
                    <input type="text" placeholder="Return Amount" />
                  </div>
                  <div className="search-form">
                    <a href="apply.html">Apply for Loan</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div> */}
      <div className="team-area section-padding30">
        <div className="container">
          <div className="row justify-content-center">
            <div className="cl-xl-7 col-lg-8 col-md-10">
              <div className="section-tittle text-center mb-70">
                <span>Our Loan Section Team Mambers</span>
                <h2>Take a look to our professional team members.</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="single-team mb-30">
                <div className="team-img">
                  <img src="/assets/image/user/gallery/home_blog1.png" alt="" />
                  <div className="team-social">
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fas fa-globe"></i>
                      </a>
                    </li>
                  </div>
                </div>
                <div className="team-caption">
                  <h3>
                    <a href="#">Bruce Roberts</a>
                  </h3>
                  <p>Volunteer leader</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="single-team mb-30">
                <div className="team-img">
                  <img src="/assets/image/user/gallery/home_blog2.png" alt="" />
                  <div className="team-social">
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fas fa-globe"></i>
                      </a>
                    </li>
                  </div>
                </div>
                <div className="team-caption">
                  <h3>
                    <a href="#">Bruce Roberts</a>
                  </h3>
                  <p>Volunteer leader</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="single-team mb-30">
                <div className="team-img">
                  <img src="/assets/image/user/gallery/home_blog3.png" alt="" />
                  <div className="team-social">
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fas fa-globe"></i>
                      </a>
                    </li>
                  </div>
                </div>
                <div className="team-caption">
                  <h3>
                    <a href="#">Bruce Roberts</a>
                  </h3>
                  <p>Volunteer leader</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="single-team mb-30">
                <div className="team-img">
                  <img src="/assets/image/user/gallery/home_blog4.png" alt="" />
                  <div className="team-social">
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fas fa-globe"></i>
                      </a>
                    </li>
                  </div>
                </div>
                <div className="team-caption">
                  <h3>
                    <a href="#">Bruce Roberts</a>
                  </h3>
                  <p>Volunteer leader</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="testimonial-area t-bg testimonial-padding">
        <div className="container ">
          <div className="row d-flex justify-content-center">
            <div className="col-xl-11 col-lg-11 col-md-9">
              <div className="h1-testimonial-active">
                <Carousel>
                  <div className="single-testimonial text-center">
                    <div className="testimonial-caption ">
                      <div className="testimonial-top-cap">
                        <img
                          src="/assets/image/user/gallery/testimonial.png"
                          alt=""
                        />
                        <p>
                          Logisti Group is a representative logistics operator
                          providing full range of ser of customs clearance and
                          transportation worl.
                        </p>
                      </div>
                      <div className="testimonial-founder d-flex align-items-center justify-content-center">
                        <div className="founder-img">
                          <img
                            src="/assets/image/user/testmonial/Homepage_testi.png"
                            alt=""
                          />
                        </div>
                        <div className="founder-text">
                          <span>Jessya Inn</span>
                          <p>Co Founder</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="single-testimonial text-center">
                    <div className="testimonial-caption ">
                      <div className="testimonial-top-cap">
                        <img
                          src="/assets/image/user/gallery/testimonial.png"
                          alt=""
                        />
                        <p>
                          Logisti Group is a representative logistics operator
                          providing full range of ser of customs clearance and
                          transportation worl.
                        </p>
                      </div>
                      <div className="testimonial-founder d-flex align-items-center justify-content-center">
                        <div className="founder-img">
                          <img
                            src="/assets/image/user/testmonial/Homepage_testi.png"
                            alt=""
                          />
                        </div>
                        <div className="founder-text">
                          <span>Jessya Inn</span>
                          <p>Co Founder</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="home-blog-area section-padding30">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-10">
              <div className="section-tittle text-center mb-70">
                <span>News form our latest blog</span>
                <h2>News from around the world selected by us.</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="single-blogs mb-30">
                <div className="blog-images">
                  <img src="/assets/image/user/gallery/blog1.png" alt="" />
                </div>
                <div className="blog-captions">
                  <span>January 28, 2020</span>
                  <h2>
                    <a href="blog_details.html">
                      The advent of pesticides brought in its benefits and
                      pitfalls.
                    </a>
                  </h2>
                  <p>October 6, a2020by Steve</p>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="single-blogs mb-30">
                <div className="blog-images">
                  <img src="/assets/image/user/gallery/blog2.png" alt="" />
                </div>
                <div className="blog-captions">
                  <span>January 28, 2020</span>
                  <h2>
                    <a href="blog_details.html">
                      The advent of pesticides brought in its benefits and
                      pitfalls.
                    </a>
                  </h2>
                  <p>October 6, a2020by Steve</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
