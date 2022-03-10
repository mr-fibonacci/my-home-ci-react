import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
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
            <div className="bg-white rounded opaque hoverable">
              {is_owner ? (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>You can't like your own properties!</Tooltip>
                  }
                >
                  <i className="fas fa-heart p-3" />
                </OverlayTrigger>
              ) : like_id ? (
                <i
                  className="fas fa-heart p-3 text-danger"
                  onClick={handleUnlike}
                />
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
          </div>
          <div className="bg-white p-2 rounded text-truncate text-center opaque">
            <i className="fas fa-map-marker-alt text-danger" />
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
    </Card>
  );
};

export default Property;
