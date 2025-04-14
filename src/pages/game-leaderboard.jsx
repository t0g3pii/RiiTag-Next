import { Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';
import { getGameLeaderboard, getGameLeaderboardSearch } from '@/lib/riitag/leaderboard';
import GameLeaderboardCard from '@/components/leaderboard/GameLeaderboardCard';
import { TOTAL_GAMES_ON_LEADERBOARD } from '@/lib/constants/miscConstants';
import Pagination from '@/components/shared/Pagination';
import ENV from '@/lib/constants/environmentVariables';

const limit = TOTAL_GAMES_ON_LEADERBOARD;

export async function getServerSideProps({ query }) {
  let { page, search } = query;
  page = page === undefined ? 1 : Number.parseInt(page, 10);
  if (Number.isNaN(page) || page <= 0) {
    page = 1;
  }

  let leaderboard;
  let totalGames;
  if (search === "null" || search === null || search === undefined || search === "") {
    [totalGames, leaderboard] = await getGameLeaderboard(page, limit);
  } else {
    [totalGames, leaderboard] = await getGameLeaderboardSearch(page, limit, search);
  }

  const totalPages = Math.ceil(totalGames / limit);

  return {
    props: {
      page,
      totalPages,
      leaderboard: JSON.parse(JSON.stringify(leaderboard)),
    },
  };
}

function GameLeaderboardPage({ page, totalPages, leaderboard }) {
  const [currentPage, setCurrentPage] = useState(undefined);
  const [games, setGames] = useState(leaderboard);
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback-Wert während SSR
  const actualPage = currentPage ?? page;

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    const searchParameters = new URLSearchParams(window.location.search);
    const searchQuery = searchParameters.get("search");
    updateURLPageParameter(newPage, searchQuery);
  };

  const updateURLPageParameter = (page, search) => {
    const parameters = new URLSearchParams(window.location.search);
    parameters.set('page', page);
    parameters.set('search', search);
    const newURL = `${window.location.pathname}?${parameters.toString()}`;
    window.history.replaceState({}, '', newURL);
    window.location.reload();
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    updateURLPageParameter(1, searchQuery);
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Container>
      <NextSeo
        title="Leaderboard"
        description="See what people have played the most while connected to their RiiTag!"
        canonical={`${ENV.BASE_URL}/game-leaderboard?page=${actualPage}&search=${searchQuery}`}
        openGraph={{
          url: `${ENV.BASE_URL}/game-leaderboard?page=${actualPage}&search=${searchQuery}`,
        }}
      />

      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <form onSubmit={handleFormSubmit} className="d-flex w-100 w-md-50 mx-auto">
            <div className="input-group shadow-sm">
              <input
                type="text"
                className="form-control border-end-0"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search for games..."
                aria-label="Search for games"
              />
              <button className="btn btn-primary rounded-end" type="submit">
                Search
              </button>
            </div>
          </form>
        </Col>
      </Row>

      <br />

      {games.length === 0 ? (
        <Row>
          <Col className="text-center">
            <p className="h2">No games were played yet!</p>
          </Col>
        </Row>
      ) : (
        <>
          <Row className="mb-4 row-cols-1 row-cols-xl-3 row-cols-md-2 g-4">
            {games.map((game, index) => (
              <GameLeaderboardCard
                key={game.game_pk}
                game={game}
                position={limit * (actualPage - 1) + index + 1}
              />
            ))}
          </Row>

          <Pagination
            currentPage={actualPage - 1} // zero-based
            handlePageClick={handlePageClick}
            totalPages={totalPages}
          />
        </>
      )}
    </Container>
  );
}

GameLeaderboardPage.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  leaderboard: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GameLeaderboardPage;
