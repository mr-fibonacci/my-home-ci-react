import React, { useEffect, useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import Asset from "../../components/Asset";
import styles from "../../styles/ProfilePage.module.css";

const ProfileEditForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [hasLoaded, setHasLoaded] = useState(false);

  const setCurrentUser = useSetCurrentUser();
  const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState({});

  const hasFetchedProfileData = !!Object.keys(profileData).length;
  const { image, name, phone_number, email, description } = profileData;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}/`);
        const { image, name, phone_number, email, description, is_owner } =
          data;

        if (is_owner) {
          setProfileData({
            image,
            name,
            phone_number,
            email,
            description,
          });
        } else {
          history.goBack();
        }
      } catch (err) {
      } finally {
        setHasLoaded(true);
      }
    };

    setHasLoaded(false);
    handleMount();
  }, [id, history]);

  const handleChange = (e) => {
    setProfileData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const imageInput = useRef(null);
  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setProfileData({
        ...profileData,
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
    formData.append("name", name);
    formData.append("phone_number", phone_number);
    formData.append("email", email);
    formData.append("description", description);

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      history.push(`/profiles/${id}`);
    } catch (err) {
      console.log(err.request.responseText);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return hasLoaded ? (
    hasFetchedProfileData ? (
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-0 text-center">
          <Row>
            <Col>
              <Image
                className={`mb-3 ${styles.ProfileImage}`}
                roundedCircle
                src={image}
              />
            </Col>
          </Row>
          <div>
            <Form.Label className="btn btn-dark" htmlFor="image-upload">
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
        <Row>
          <Col sm={6}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
              />
            </Form.Group>
            {errors?.name?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Col>

          <Col sm={6}>
            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                type="number"
                name="phone_number"
                value={phone_number || ""}
                onChange={handleChange}
              />
            </Form.Group>
            {errors?.phone_number?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Col>
        </Row>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </Form.Group>
        {errors?.email?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
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
            <Button
              variant="dark"
              className="mb-2"
              block
              onClick={() => history.goBack()}
            >
              cancel
            </Button>
          </Col>
          <Col sm={6}>
            <Button variant="dark" className="mb-2" block type="submit">
              save
            </Button>
          </Col>
        </Row>
      </Form>
    ) : (
      <Asset noResults message="No profile found with the given id." />
    )
  ) : (
    <Asset spinner />
  );
};

export default ProfileEditForm;
