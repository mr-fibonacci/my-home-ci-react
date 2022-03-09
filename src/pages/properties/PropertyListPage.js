import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosReq } from "../../api/axiosDefaults";
import {
  cityOptions,
  contractOptions,
  propertyOptions,
} from "../../utils/utils";

const PropertyListPage = () => {
  const [formData, setFormData] = useState({
    city: "",
    property_type: "",
    contract: "",
    max_price: 400000,
  });
  const [properties, setProperties] = useState({
    results: [],
  });
  const { max_price } = formData;
  useEffect(() => {
    const fetchProperties = async () => {
      const { city, property_type, contract, max_price } = formData;
      try {
        const { data } = await axiosReq.get(
          `/properties/?city=${city}&property_type=${property_type}&contract=${contract}&max_price=${max_price}`
        );
        setProperties(data);
      } catch (err) {}
    };
    fetchProperties();
    return () => {};
  }, [formData]);

  const onChange = (e) =>
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));

  return (
    <Form>
      <Row>
        <Col md={4}>
          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control as="select" name="city" onChange={onChange}>
              <option value="">any...</option>
              {cityOptions.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="propertyType">
            <Form.Label>Property type</Form.Label>
            <Form.Control as="select" name="property_type" onChange={onChange}>
              <option value="">any...</option>
              {propertyOptions.map((propertyOption) => (
                <option key={propertyOption}>{propertyOption}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="contractType">
            <Form.Label>Contract type</Form.Label>
            <Form.Control as="select" name="contract" onChange={onChange}>
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
              min={100000}
              step={50000}
              max={700000}
              name="max_price"
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default PropertyListPage;
