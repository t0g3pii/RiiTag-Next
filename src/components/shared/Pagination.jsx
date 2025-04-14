import styles from './Pagination.module.css';

import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';

function Pagination({ currentPage, totalPages, handlePageClick }) {
  return (
    <ReactPaginate
      containerClassName={styles.pagination}
      breakClassName={styles.pageItem}
      breakLinkClassName={styles.pageLink}
      pageClassName={styles.pageItem}
      pageLinkClassName={styles.pageLink}
      activeClassName={styles.active}
      disabledClassName={styles.disabled}
      previousClassName={styles.pageItem}
      previousLinkClassName={styles.pageLink}
      nextClassName={styles.pageItem}
      nextLinkClassName={styles.pageLink}
      breakLabel="..."
      nextLabel="Next >"
      forcePage={currentPage}
      onPageChange={handlePageClick}
      pageRangeDisplayed={5}
      pageCount={totalPages}
      previousLabel="< Previous"
      renderOnZeroPageCount={null}
    />
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired,
};

export default Pagination;
