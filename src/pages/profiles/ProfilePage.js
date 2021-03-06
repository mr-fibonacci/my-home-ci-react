import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import Property from "../properties/Property";

import styles from "../../styles/ProfilePage.module.css";
import { MoreDropdown } from "../../components/MoreDropdown";

const ProfilePage = () => {
  const history = useHistory();
  const { id } = useParams();
  const [hasLoaded, setHasLoaded] = useState(false);

  const [activeKey, setActiveKey] = useState("posted");
  const [profile, setProfile] = useState({});
  const [postedProperties, setPostedProperties] = useState({ results: [] });
  const [likedProperties, setLikedProperties] = useState({ results: [] });

  const hasFetchedProfile = !!Object.keys(profile).length;
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
      } catch (err) {
        // console.log(err);
      } finally {
        setHasLoaded(true);
      }
    };

    fetchData();
  }, [id]);
  return (
    <>
      {hasLoaded ? (
        hasFetchedProfile ? (
          <>
            <Card className="text-center">
              {is_owner && (
                <MoreDropdown
                  standalone
                  handleEdit={() => history.push(`/profiles/${id}/edit`)}
                />
              )}
              <Row>
                <Col className="my-auto" lg={6}>
                  <Image
                    className={`p-3 ${styles.ProfileImage}`}
                    src={image}
                    fluid
                    roundedCircle
                  />
                </Col>
                <Col className="my-auto" lg={6}>
                  <Card.Body className="pb-0">
                    {name ? (
                      <Card.Title>
                        <i className="fas fa-id-badge" />
                        {name}
                      </Card.Title>
                    ) : (
                      <Card.Text>
                        <i className="fas fa-id-badge" />
                        <span className="font-italic">blank</span>
                      </Card.Text>
                    )}

                    <Card.Text>
                      <i className="fas fa-phone-alt" />
                      {phone_number || (
                        <span className="font-italic">blank</span>
                      )}
                    </Card.Text>
                    <Card.Text>
                      <i className="fas fa-envelope" />
                      {email || <span className="font-italic">blank</span>}
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
              <Card.Body className="pt-lg-0">
                <hr className="d-none d-lg-block" />
                <Card.Text>
                  <i className="fas fa-comment-alt fa-flip-horizontal" />
                  {description || <span className="font-italic">blank</span>}
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
                  loader={<Asset spinner />}
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
                      noResults
                      message={`No results found, ${
                        profile?.name || "the user"
                      } hasn't posted yet.`}
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
                    loader={<Asset spinner />}
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
                          noResults
                          message={`No results found, ${
                            profile?.name || "the user"
                          } hasn't liked a property yet.`}
                        />
                      )}
                    </Container>
                  </InfiniteScroll>
                </Tab>
              ) : null}
            </Tabs>
          </>
        ) : (
          <Asset noResults message="No profile found with the given id." />
        )
      ) : (
        <Asset spinner />
      )}
    </>
  );
};

export default ProfilePage;
