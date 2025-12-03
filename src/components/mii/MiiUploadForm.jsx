import PropTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';

function MiiUploadForm({ setFieldValue, error, values, errors }) {
  const handleFileChange = (event) => {
    setFieldValue('file', event.currentTarget.files[0]);
  };

  return (
    <>
      <Form.Group controlId="uploadMethod" className="mb-3">
        <Form.Label>Choose how you want to provide your Mii</Form.Label>
        <Row>
          <Col xs={12} md={6}>
            <Form.Check
              type="radio"
              id="upload-method-nnid"
              name="uploadMethod"
              label="Fetch from NNID"
              value="nnid"
              checked={values.uploadMethod === 'nnid'}
              onChange={(event) =>
                setFieldValue('uploadMethod', event.currentTarget.value)
              }
            />
            <Form.Check
              type="radio"
              id="upload-method-pnid"
              name="uploadMethod"
              label="Fetch from PNID"
              value="pnid"
              checked={values.uploadMethod === 'pnid'}
              onChange={(event) =>
                setFieldValue('uploadMethod', event.currentTarget.value)
              }
            />
          </Col>
          <Col xs={12} md={6}>
            <Form.Check
              type="radio"
              id="upload-method-data-or-url"
              name="uploadMethod"
              label="Mii Data/File/Mii Studio URL"
              value="data_or_url"
              checked={values.uploadMethod === 'data_or_url'}
              onChange={(event) =>
                setFieldValue('uploadMethod', event.currentTarget.value)
              }
            />
            <Form.Check
              type="radio"
              id="upload-method-qr-or-file"
              name="uploadMethod"
              label="Scan/Upload Mii QR Code or MAE file"
              value="qr_or_file"
              checked={values.uploadMethod === 'qr_or_file'}
              onChange={(event) =>
                setFieldValue('uploadMethod', event.currentTarget.value)
              }
            />
          </Col>
        </Row>
      </Form.Group>

      {values.uploadMethod === 'nnid' && (
        <Form.Group controlId="nnid" className="mb-3">
          <Form.Label>Nintendo Network ID (NNID)</Form.Label>
          <Form.Control
            type="text"
            name="nnid"
            value={values.nnid}
            isInvalid={!!errors.nnid}
            onChange={(event) => setFieldValue('nnid', event.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.nnid}
          </Form.Control.Feedback>
          <Form.Text>
            Your Nintendo Network ID will be sent to the Mii Renderer API to fetch your Mii.
          </Form.Text>
        </Form.Group>
      )}

      {values.uploadMethod === 'pnid' && (
        <Form.Group controlId="pnid" className="mb-3">
          <Form.Label>Nintendo Account ID (PNID)</Form.Label>
          <Form.Control
            type="text"
            name="pnid"
            value={values.pnid}
            isInvalid={!!errors.pnid}
            onChange={(event) => setFieldValue('pnid', event.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.pnid}
          </Form.Control.Feedback>
          <Form.Text>
            Your Pretendo Account ID will be sent to the Mii Renderer API to
            fetch your Mii.
          </Form.Text>
        </Form.Group>
      )}

      {values.uploadMethod === 'data_or_url' && (
        <Form.Group controlId="miiDataOrUrl" className="mb-3">
          <Form.Label>Mii data, file or Mii Studio URL</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="miiDataOrUrl"
            value={values.miiDataOrUrl}
            isInvalid={!!errors.miiDataOrUrl}
            onChange={(event) =>
              setFieldValue('miiDataOrUrl', event.target.value)
            }
            placeholder="Paste Mii hex data, a Mii Studio URL or other supported data here."
          />
          <Form.Control.Feedback type="invalid">
            {errors.miiDataOrUrl}
          </Form.Control.Feedback>
          <Form.Text>
            This input will be sent to the Mii Renderer API. Exact formats are
            documented in the API docs at{' '}
            <a
              href="https://mii-unsecure.ariankordi.net/swagger/index.html"
              rel="noopener noreferrer"
              target="_blank"
            >
              Mii Renderer Swagger
            </a>
            .
          </Form.Text>
        </Form.Group>
      )}

      {values.uploadMethod === 'qr_or_file' && (
        <Form.Group controlId="miiFile" className="mb-3">
          <Form.Label>Upload your Mii binary file or QR code.</Form.Label>
          <Form.Control
            accept=".jpg,.mae"
            name="file"
            type="file"
            isInvalid={!!error}
            onChange={handleFileChange}
          />
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
          <Form.Text>
            Some QR codes may not be supported. Known working codes are from
            3DS, Wii U, Miitomo, Tomodachi Life and Miitopia (.jpg). Known
            working binary files are in Wii format (.mae).
          </Form.Text>
        </Form.Group>
      )}
    </>
  );
}

MiiUploadForm.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  error: PropTypes.string,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

MiiUploadForm.defaultProps = {
  error: null,
};

export default MiiUploadForm;
