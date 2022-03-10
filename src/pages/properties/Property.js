import React from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

import Avatar from "../../components/Avatar";

const Property = ({
  id,
  is_owner,
  address,
  city,
  baths,
  beds,
  area,
  property_type,
  ber,
  price,
  like_id,
  image,
  profile_id,
  profile_name,
  profile_image,
}) => {
  return (
    <Card className="mb-3 shadow">
      <div className="position-relative">
        <Card.Img src={image} />
        <Card.ImgOverlay className="d-flex flex-column justify-content-between p-3">
          <div className="d-flex justify-content-between">
            <Link className="mr-3" to={`/profiles/${profile_id}`}>
              <div className="bg-white p-2 rounded opaque">
                <Avatar
                  height={39}
                  src={profile_image}
                  text={`${profile_name}John Smith`}
                />
              </div>
            </Link>
            <div className="bg-white rounded opaque">
              <i className="fas fa-heart p-3" />
            </div>
          </div>
          <div className="bg-white p-2 rounded text-truncate text-center opaque">
            <i className="fas fa-map-marker-alt" />
            {address}
          </div>
        </Card.ImgOverlay>
      </div>
      <Card.Body className="p-3">
        <div className="d-flex justify-content-around text-center">
          <div>
            <i className="fas fa-euro-sign" />
            {price}
          </div>
          <div>
            <i className="fas fa-city" />
            {city}
          </div>
          <div>
            <i className="fas fa-cube" />
            <span className="d-inline-block">{area} m2</span>
          </div>
        </div>
        <div className="d-flex justify-content-around">
          <div>
            <i className="fas fa-bed" />
            {beds}
          </div>
          <div>
            <i className="fas fa-bath" />
            {baths}
          </div>
          <div>
            <i className="fas fa-plug" />
            {ber}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Property;
