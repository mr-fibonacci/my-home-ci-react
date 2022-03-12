import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import Profile from "../profiles/Profile";
import Property from "./Property";

const PropertyPage = () => {
  const { id } = useParams();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [propertyData, setPropertyData] = useState({
    results: [{ profile: {} }],
  });
  const property = propertyData.results[0];
  const { profile, description } = property;
  const { name, image } = profile;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/properties/${id}/`);
        setPropertyData({ results: [data] });
        setHasLoaded(true);
      } catch (err) {}
    };

    setHasLoaded(false);
    handleMount();
  }, [id]);

  return hasLoaded ? (
    <>
      <Property
        {...property}
        profile_name={name}
        profile_image={image}
        setProperties={setPropertyData}
        propertyPage
      />
      <Card className="mb-3 shadow">
        <Card.Body>{description}</Card.Body>
      </Card>
      <Profile {...profile} />
    </>
  ) : (
    <Asset spinner />
  );
};

export default PropertyPage;
