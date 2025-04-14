import { Col, Container, Row, Table } from 'react-bootstrap';
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';
import ENV from '@/lib/constants/environmentVariables';
import styles from '@/styles/modules/editor-text.module.scss';
import prisma from '@/lib/db';
import { isBlank } from '@/lib/utils/utils';

export async function getStaticProps() {
    const about = await prisma.sys.findUnique({
        where: {
            key: 'friends',
        },
    });

    return {
        props: {
            about: isBlank(about?.value)
                ? '<i>No about text defined...</i>'
                : about.value,
        },
        revalidate: 1,
    };
}

function FriendPage({ about }) {
    return (
        <Container>
            <NextSeo
                title="Friend Codes"
                openGraph={{
                    url: `${ENV.BASE_URL}/friends`,
                }}
            />

            <Row>
                <Col>
                    <h1>Friend Codes</h1>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Table striped bordered hover variant="dark" style={{textAlign: "center"}}>
                        <thead>
                            <tr>
                                <th>Discord</th>
                                <th>PNID</th>
                                <th>Wii</th>
                                <th>MK-Wii</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>t0g3pii</td>
                                <td>t0g3pii</td>
                                <td>8895 2587 6336 6319</td>
                                <td>N/A</td>
                            </tr>
                            <tr>
                                <td>Example 1</td>
                                <td>PNID-test</td>
                                <td>Wii-test</td>
                                <td>MKWii-test</td>
                            </tr>
                            <tr>
                                <td>Example 2</td>
                                <td>PNID-test</td>
                                <td>N/A</td>
                                <td>N/A</td>
                            </tr>
                            <tr>
                                <td>Example 3</td>
                                <td>N/A</td>
                                <td>N/A</td>
                                <td>N/A</td>
                            </tr>
                            <tr>
                                <td>Example 4</td>
                                <td>N/A</td>
                                <td>Wii-test</td>
                                <td>N/A</td>
                            </tr>
                            <tr>
                                <td>Example 4</td>
                                <td>N/A</td>
                                <td>Wii-test</td>
                                <td>MKWii-test</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

FriendPage.propTypes = {
    about: PropTypes.string.isRequired,
};

export default FriendPage;
