import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import Avatar from "../../components/Avatar";

const Property = ({
  id,
  is_owner,
  address,
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
  setProperties,
}) => {
  const history = useHistory();
  const currentUser = useCurrentUser();

  const handleEdit = () => {
    history.push(`/properties/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/properties/${id}/`);
      history.goBack();
    } catch (err) {
      // console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { property: id });
      setProperties((prevProperties) => ({
        ...prevProperties,
        results: prevProperties.results.map((property) => {
          return property.id === id
            ? {
                ...property,
                likes_count: property.likes_count + 1,
                like_id: data.id,
              }
            : property;
        }),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setProperties((prevProperties) => ({
        ...prevProperties,
        results: prevProperties.results.map((property) => {
          return property.id === id
            ? {
                ...property,
                likes_count: property.likes_count - 1,
                like_id: null,
              }
            : property;
        }),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  const profileBar = (
    <Link className="ml-3" to={`/profiles/${profile_id}`}>
      <div className="bg-white p-2 rounded opaque">
        <Avatar height={39} src={profile_image} text={profile_name} />
      </div>
    </Link>
  );

  const likeBar = (
    <div className="mr-3 bg-white rounded opaque hoverable">
      {is_owner ? (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>You can't like your own properties!</Tooltip>}
        >
          <i className="fas fa-heart p-3" />
        </OverlayTrigger>
      ) : like_id ? (
        <i className="fas fa-heart p-3 text-danger" onClick={handleUnlike} />
      ) : currentUser ? (
        <i className="fas fa-heart p-3" onClick={handleLike} />
      ) : (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Log in to like properties!</Tooltip>}
        >
          <i className="fas fa-heart p-3" />
        </OverlayTrigger>
      )}
    </div>
  );

  const addressBar = (
    <div className="position-absolute w-100 fixed-bottom mb-3">
      <div className="bg-white p-2 rounded text-truncate opaque mx-3">
        <i className="fas fa-map-marker-alt text-danger" />
        {address}
      </div>
    </div>
  );

  const cardBody = (
    <Card.Body className="p-3">
      <div className="d-flex justify-content-around">
        <div>
          <i className="fas fa-euro-sign" />
          {price}
        </div>
        <div>
          {property_type === "house" ? (
            <i className="fas fa-home" />
          ) : (
            <i className="fas fa-city" />
          )}
          {property_type}
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
  );

  return (
    <Card className="mb-3 shadow text-center">
      <div className="position-relative">
        <div className="position-absolute mt-3 w-100 d-flex justify-content-between">
          {profileBar}
          {likeBar}
        </div>
        <Link to={`/properties/${id}`}>
          {addressBar}
          <Card.Img src={image} />
        </Link>
      </div>
      {cardBody}
    </Card>
  );
};

export default Property;
