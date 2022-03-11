import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  berOptions,
  cityOptions,
  contractOptions,
  propertyOptions,
} from "../../utils/utils";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { axiosReq } from "../../api/axiosDefaults";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

const PropertyEditForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [propertyData, setPropertyData] = useState({
    image: "",
    address: "",
    city: "",
    property_type: "",
    contract: "",
    price: 0,
    beds: 0,
    baths: 0,
    area: 0,
    ber: "",
    description: "",
  });
  const {
    image,
    address,
    city,
    property_type,
    contract,
    price,
    beds,
    baths,
    area,
    ber,
    description,
  } = propertyData;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/properties/${id}/`);
        const {
          image,
          address,
          city,
          property_type,
          contract,
          price,
          beds,
          baths,
          area,
          ber,
          description,
          is_owner,
        } = data;
        is_owner
          ? setPropertyData({
              image,
              address,
              city,
              property_type,
              contract,
              price,
              beds,
              baths,
              area,
              ber,
              description,
            })
          : history.goBack();
      } catch (err) {}
    };

    handleMount();
  }, [id, history]);

  const handleChange = (e) => {
    setPropertyData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const imageInput = useRef(null);
  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPropertyData({
        ...propertyData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (imageInput.current.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }
    formData.append("address", address);
    formData.append("city", city);
    formData.append("property_type", property_type);
    formData.append("contract", contract);
    formData.append("price", price);
    formData.append("beds", beds);
    formData.append("baths", baths);
    formData.append("area", area);
    formData.append("ber", ber);
    formData.append("description", description);

    try {
      await axiosReq.put(`/properties/${id}/`, formData);
      history.push(`/properties/${id}`);
    } catch (err) {
      console.log(err.request.responseText);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="my-0 text-center">
        <Image className="mw-100 mb-3" rounded src={image} />
        <div>
          <Form.Label className={`btn btn-primary`} htmlFor="image-upload">
            Change the image
          </Form.Label>
        </div>

        <Form.File
          id="image-upload"
          accept="image/*"
          onChange={handleChangeImage}
          ref={imageInput}
        />
      </Form.Group>
      {errors?.image?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Address</Form.Label>
        <Form.Control
          as="textarea"
          rows={1}
          name="address"
          value={address}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.address?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Row>
        <Col sm={6}>
          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              as="select"
              name="city"
              value={city}
              onChange={handleChange}
            >
              <option value="">please choose one...</option>
              {cityOptions.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </Form.Control>
          </Form.Group>
          {errors?.city?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
        <Col sm={6}>
          <Form.Group controlId="propertyType">
            <Form.Label>Property type</Form.Label>
            <Form.Control
              as="select"
              name="property_type"
              value={property_type}
              onChange={handleChange}
            >
              <option value="">please choose one...</option>
              {propertyOptions.map((propertyOption) => (
                <option key={propertyOption}>{propertyOption}</option>
              ))}
            </Form.Control>
          </Form.Group>
          {errors?.property_type?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
          <Form.Group controlId="contractType">
            <Form.Label>Contract type</Form.Label>
            <Form.Control
              as="select"
              name="contract"
              value={contract}
              onChange={handleChange}
            >
              <option value="">please choose one...</option>
              {contractOptions.map((contractOption) => (
                <option key={contractOption}>{contractOption}</option>
              ))}
            </Form.Control>
          </Form.Group>
          {errors?.contract?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
        <Col sm={6}>
          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={price}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.price?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
          <Form.Group controlId="beds">
            <Form.Label>Beds</Form.Label>
            <Form.Control
              type="number"
              name="beds"
              value={beds}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.beds?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
        <Col sm={6}>
          <Form.Group controlId="baths">
            <Form.Label>Baths</Form.Label>
            <Form.Control
              type="number"
              name="baths"
              value={baths}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.baths?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
          <Form.Group controlId="area">
            <Form.Label>Area</Form.Label>
            <Form.Control
              type="number"
              name="area"
              value={area}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.area?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
        <Col sm={6}>
          <Form.Group controlId="berType">
            <Form.Label>BER rating</Form.Label>
            <Form.Control
              as="select"
              name="ber"
              value={ber}
              onChange={handleChange}
            >
              <option value="">please choose one...</option>
              {berOptions.map((berOption) => (
                <option key={berOption}>{berOption}</option>
              ))}
            </Form.Control>
          </Form.Group>
          {errors?.ber?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Row>

      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={description}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.description?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Row>
        <Col sm={6}>
          <Button className="mb-2" block onClick={() => history.goBack()}>
            cancel
          </Button>
        </Col>
        <Col sm={6}>
          <Button className="mb-2" block type="submit">
            save
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PropertyEditForm;
