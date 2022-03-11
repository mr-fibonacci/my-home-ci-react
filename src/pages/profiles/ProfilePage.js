import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Image,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import Property from "../properties/Property";

const ProfilePage = () => {
  const { id } = useParams();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activeKey, setActiveKey] = useState("posted");
  const [profile, setProfile] = useState({});
  const [postedProperties, setPostedProperties] = useState({ results: [] });
  const [likedProperties, setLikedProperties] = useState({ results: [] });

  const { image, name, phone_number, email, description, is_owner } = profile;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: profile },
          { data: postedProperties },
          { data: likedProperties },
        ] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          axiosReq.get(`/properties/?owner__profile=${id}`),
          axiosReq.get(`/properties/?likes__owner__profile=${id}`),
        ]);
        setActiveKey("posted");
        setProfile(profile);
        setPostedProperties(postedProperties);
        setLikedProperties(likedProperties);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    fetchData();
  }, [id]);
  return (
    <>
      {hasLoaded ? (
        <>
          <Card className="text-center">
            <Row>
              <Col className="my-auto" lg={6}>
                <Image
                  className="p-3"
                  style={{ maxHeight: 350, margin: "auto" }}
                  src={image}
                  fluid
                  roundedCircle
                />
              </Col>
              <Col className="my-auto" lg={6}>
                <Card.Body className="pb-0">
                  <Card.Title>
                    <i className="fas fa-id-badge" />
                    {name}
                  </Card.Title>
                  <Card.Text>
                    <i className="fas fa-phone-alt" />
                    {phone_number}
                  </Card.Text>
                  <Card.Text>
                    <i className="fas fa-envelope" />
                    {email}
                  </Card.Text>
                </Card.Body>
              </Col>
            </Row>
            <Card.Body className="pt-0">
              <hr className="d-none d-lg-block" />
              <Card.Text>
                <i className="fas fa-comment-alt" />
                {description}
              </Card.Text>
            </Card.Body>
          </Card>
          <hr />
          <Tabs
            variant="pills"
            activeKey={activeKey}
            onSelect={(k) => setActiveKey(k)}
          >
            <Tab eventKey="posted" title="posted">
              <hr />
              <InfiniteScroll
                dataLength={postedProperties?.results.length}
                next={() =>
                  fetchMoreData(postedProperties, setPostedProperties)
                }
                hasMore={!!postedProperties.next}
                loader={<Asset children={<Spinner animation="border" />} />}
              >
                {postedProperties?.results.length ? (
                  postedProperties?.results.map((property) => (
                    <Property
                      key={property.id}
                      {...property}
                      setProperties={setPostedProperties}
                    />
                  ))
                ) : (
                  <Asset
                    children={<NoResults />}
                    message={`No results found, ${profile?.owner} hasn't posted yet.`}
                  />
                )}
              </InfiniteScroll>
            </Tab>
            {is_owner ? (
              <Tab eventKey="liked" title="liked">
                <hr />
                <InfiniteScroll
                  dataLength={likedProperties?.results.length}
                  next={() =>
                    fetchMoreData(likedProperties, setLikedProperties)
                  }
                  hasMore={!!likedProperties.next}
                  loader={<Asset children={<Spinner animation="border" />} />}
                >
                  <Container fluid>
                    {likedProperties?.results.length ? (
                      likedProperties?.results.map((property) => (
                        <Property
                          key={property.id}
                          {...property}
                          setProperties={setLikedProperties}
                        />
                      ))
                    ) : (
                      <Asset
                        children={<NoResults />}
                        message={`No profiles found, no users are following ${profile?.owner} yet.`}
                      />
                    )}
                  </Container>
                </InfiniteScroll>
              </Tab>
            ) : null}
          </Tabs>
        </>
      ) : (
        <Asset spinner />
      )}
    </>
  );
};

export default ProfilePage;
