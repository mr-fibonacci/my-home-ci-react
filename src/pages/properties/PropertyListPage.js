import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosReq } from "../../api/axiosDefaults";
import {
  cityOptions,
  contractOptions,
  fetchMoreData,
  propertyOptions,
} from "../../utils/utils";
import Asset from "../../components/Asset";
import Property from "./Property";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const PropertyListPage = ({ profile_id }) => {
  const currentUser = useCurrentUser();
  const [formData, setFormData] = useState({
    city: "",
    property_type: "",
    contract: "",
    max_price: 700000,
  });
  const { city, property_type, contract, max_price } = formData;
  const isRent = contract === "rent";

  const [properties, setProperties] = useState({
    results: [],
  });

  const [hasLoaded, setHasLoaded] = useState(false);

  const onChange = (e) =>
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      max_price: isRent ? 5000 : 700000,
    }));
  }, [isRent]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { city, property_type, contract, max_price } = formData;
      try {
        const { data } = await axiosReq.get(
          `/properties/?city=${city}&property_type=${property_type}&contract=${contract}&max_price=${max_price}&likes__owner__profile=${profile_id}`
        );
        setProperties(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err.request.responseText);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchProperties();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    currentUser,
    formData,
    city,
    property_type,
    contract,
    max_price,
    profile_id,
  ]);

  return (
    <>
      <Form>
        <Row>
          <Col sm={4}>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                as="select"
                name="city"
                onChange={onChange}
                value={city}
              >
                <option value="">any...</option>
                {cityOptions.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group controlId="propertyType">
              <Form.Label>Property type</Form.Label>
              <Form.Control
                as="select"
                name="property_type"
                onChange={onChange}
                value={property_type}
              >
                <option value="">any...</option>
                {propertyOptions.map((propertyOption) => (
                  <option key={propertyOption}>{propertyOption}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group controlId="contractType">
              <Form.Label>Contract type</Form.Label>
              <Form.Control
                as="select"
                name="contract"
                onChange={onChange}
                value={contract}
              >
                <option value="">any...</option>
                {contractOptions.map((contractOption) => (
                  <option key={contractOption}>{contractOption}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="maxPrice">
              <Form.Label>Max price: {max_price}</Form.Label>
              <Form.Control
                type="range"
                min={isRent ? 500 : 100000}
                step={isRent ? 500 : 50000}
                max={isRent ? 5000 : 700000}
                name="max_price"
                onChange={onChange}
                value={max_price}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      {hasLoaded ? (
        properties.results.length ? (
          <InfiniteScroll
            children={properties.results.map((property) => {
              const { id } = property;
              return (
                <Property
                  key={id}
                  {...property}
                  setProperties={setProperties}
                />
              );
            })}
            dataLength={properties.results.length}
            loader={<Asset spinner />}
            hasMore={!!properties.next}
            next={() => fetchMoreData(properties, setProperties)}
          />
        ) : (
          <Asset
            noResults
            message="No properties found matching given criteria."
          />
        )
      ) : (
        <Asset spinner />
      )}
    </>
  );
};

export default PropertyListPage;
