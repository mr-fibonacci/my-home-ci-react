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
    results: [{}],
  });
  const property = propertyData.results[0];
  const hasFetchedProperty = !!Object.keys(property).length;

  const description = property.description;
  const name = property?.profile?.name;
  const image = property?.profile?.image;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/properties/${id}/`);
        setPropertyData({ results: [data] });
      } catch (err) {
      } finally {
        setHasLoaded(true);
      }
    };

    setHasLoaded(false);
    handleMount();
  }, [id]);

  return hasLoaded ? (
    hasFetchedProperty ? (
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
        <Profile {...property?.profile} />
      </>
    ) : (
      <Asset noResults message="No property found with the given id." />
    )
  ) : (
    <Asset spinner />
  );
};

export default PropertyPage;
