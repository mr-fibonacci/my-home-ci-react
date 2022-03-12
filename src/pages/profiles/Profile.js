import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

const Profile = ({ id, image, name, phone_number, email, description }) => {
  return (
    <Link to={`/profiles/${id}`}>
      <Card className="mb-3 shadow text-center">
        <Card.Body className="pb-0">
          <Card.Title className="text-center">
            Interested? We'd love to hear from you!
          </Card.Title>
          <hr />
        </Card.Body>
        <Container>
          <Row className="d-flex justify-content-center">
            <Col xs={5} sm={4} className="my-auto">
              <Image src={image} roundedCircle fluid />
            </Col>
            <Col className="my-auto">
              <Card.Body className="px-0 p-0">
                <Card.Text>
                  <i className="fas fa-id-badge" />
                  {name}
                </Card.Text>
                <Card.Text>
                  <i className="fas fa-phone-alt" />
                  {phone_number}
                </Card.Text>
                <Card.Text className="d-none d-sm-block">
                  <i className="fas fa-envelope" />
                  {email}
                </Card.Text>
              </Card.Body>
            </Col>
          </Row>
          <Card.Text className="d-block d-sm-none">
            <hr />
            <i className="fas fa-envelope" />
            {email}
          </Card.Text>
        </Container>
        <Card.Body className="pt-0">
          <hr />
          <Card.Text>
            <i className="fas fa-comment-alt fa-flip-horizontal" />
            {description}
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default Profile;
