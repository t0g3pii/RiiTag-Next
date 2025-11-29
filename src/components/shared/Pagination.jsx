import PropTypes from 'prop-types';

function Pagination({ currentPage, totalPages, handlePageClick }) {
  const pageNumbers = [];
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    pageNumbers.push(pageNumber);
  }

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center mt-3">
        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => handlePageClick({ selected: Math.max(0, currentPage - 1) })}
            disabled={currentPage === 0}
          >
            &lt; Previous
          </button>
        </li>

        {pageNumbers.map((number) => (
          <li key={number} className={`page-item ${currentPage === number - 1 ? 'active' : ''}`}>
            <button
            type="button"
            className="page-link"
            onClick={() => handlePageClick({ selected: number - 1 })}
          >
            {number}
          </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => handlePageClick({ selected: Math.min(totalPages - 1, currentPage + 1) })}
            disabled={currentPage === totalPages - 1}
          >
            Next &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired,
};

export default Pagination;
