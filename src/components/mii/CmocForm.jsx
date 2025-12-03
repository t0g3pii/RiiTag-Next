import { Alert, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

function CmocForm({
  value,
  handleChange,
  handleBlur,
  error,
  touched,
  disabled,
}) {
  return (
    <>
      <Alert variant="warning" className="text-start">
        The Check Mii Out Channel integration is currently disabled while the
        WiiLink team is reworking CMOC. Editing CMOC Miis is temporarily not
        available.
      </Alert>
      <Form.Group className="text-center" controlId="cmoc-entry-no">
        <Form.Label>Check Mii Out Channel Entry Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Check Mii Out Channel Entry Number"
          name="cmocEntryNo"
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={!!error}
          isValid={touched && !error}
          value={value}
          disabled={disabled}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        <Form.Text className="text-muted">
          You can browse all Miis from the Check Mii Out Channel on{' '}
          <a
            href="https://mii.rc24.xyz/"
            rel="noopener noreferrer"
            target="_blank"
          >
            mii.rc24.xyz
          </a>
          . The entry number can be entered with or without dashes
        </Form.Text>
      </Form.Group>
    </>
  );
}

CmocForm.propTypes = {
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
  touched: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
};

CmocForm.defaultProps = {
  error: null,
  disabled: false,
};

export default CmocForm;
