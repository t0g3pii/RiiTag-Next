import path from 'node:path';
import { ncWithSession } from '@/lib/routing';
import HTTP_CODE from '@/lib/constants/httpStatusCodes';
import { isBlank } from '@/lib/utils/utils';
import prisma from '@/lib/db';
import { makeBanner } from '@/lib/riitag/banner';
import { isValidMiiType, MII_TYPE } from '@/lib/constants/miiType';
import { isValidGuestMii } from '@/lib/constants/forms/guestMiis';
import logger from '@/lib/logger';
import { CACHE } from '@/lib/constants/filePaths';
import { saveFile } from '@/lib/utils/fileUtils';
import {
  getMiiHexDataFromCMOC,
  getMiiHexDataFromDataOrUrl,
  getMiiHexDataFromNNID,
  getMiiHexDataFromPNID,
  getMiiFromHexData,
} from '@/lib/riitag/mii';

async function updateMii(request, response) {
  const {
    miiType,
    guestMii,
    cmocEntryNo,
    uploadMethod,
    nnid,
    pnid,
    miiDataOrUrl,
  } = request.body;
  const username = request.session?.username;

  if (!username) {
    return response
      .status(HTTP_CODE.UNAUTHORIZED)
      .json({ error: 'Unauthorized' });
  }

  if (isBlank(miiType) || !isValidMiiType(miiType)) {
    return response
      .status(HTTP_CODE.BAD_REQUEST)
      .send({ error: 'Invalid data' });
  }

  let user;
  switch (miiType) {
    case MII_TYPE.GUEST: {
      if (isBlank(guestMii) || !isValidGuestMii(guestMii)) {
        return response
          .status(HTTP_CODE.BAD_REQUEST)
          .send({ error: 'Invalid data' });
      }
      try {
        user = await prisma.user.update({
          where: {
            username,
          },
          data: {
            mii_type: MII_TYPE.GUEST,
            mii_data: guestMii,
          },
        });
      } catch (error) {
        logger.error(error);
        return response
          .status(HTTP_CODE.BAD_REQUEST)
          .send({ error: 'Invalid data' });
      }
      break;
    }
    case MII_TYPE.CMOC: {
      try {
        const miiHexData = await getMiiHexDataFromCMOC(cmocEntryNo);
        user = await prisma.user.update({
          where: {
            username,
          },
          data: {
            mii_type: MII_TYPE.CMOC,
            cmoc_entry_no: cmocEntryNo.replaceAll('-', ''),
            mii_data: miiHexData,
          },
        });
      } catch (error) {
        logger.error(error);
        return response
          .status(HTTP_CODE.BAD_REQUEST)
          .send({ error: 'Invalid data' });
      }
      break;
    }
    case MII_TYPE.UPLOAD: {
      if (isBlank(uploadMethod)) {
        return response
          .status(HTTP_CODE.BAD_REQUEST)
          .send({ error: 'Invalid data' });
      }

      let miiHexData;

      try {
        switch (uploadMethod) {
          case 'nnid': {
            if (isBlank(nnid)) {
              return response
                .status(HTTP_CODE.BAD_REQUEST)
                .send({ error: 'Invalid data' });
            }
            miiHexData = await getMiiHexDataFromNNID(nnid);
            break;
          }
          case 'pnid': {
            if (isBlank(pnid)) {
              return response
                .status(HTTP_CODE.BAD_REQUEST)
                .send({ error: 'Invalid data' });
            }
            miiHexData = await getMiiHexDataFromPNID(pnid);
            break;
          }
          case 'data_or_url': {
            if (isBlank(miiDataOrUrl)) {
              return response
                .status(HTTP_CODE.BAD_REQUEST)
                .send({ error: 'Invalid data' });
            }
            miiHexData = await getMiiHexDataFromDataOrUrl(miiDataOrUrl);
            break;
          }
          default: {
            return response
              .status(HTTP_CODE.BAD_REQUEST)
              .send({ error: 'Invalid data' });
          }
        }

        user = await prisma.user.update({
          where: {
            username,
          },
          data: {
            mii_type: MII_TYPE.UPLOAD,
            mii_data: miiHexData,
          },
        });

        // Direkt nach dem Speichern das gerenderte Mii aktualisieren,
        // damit die Vorschau sofort das neue Bild zeigt.
        try {
          const filepath = path.resolve(CACHE.MIIS, `${user.username}.png`);
          const miiImage = await getMiiFromHexData(miiHexData);
          await saveFile(filepath, miiImage);
        } catch (renderError) {
          logger.error(renderError);
        }
      } catch (error) {
        logger.error(error);
        return response
          .status(HTTP_CODE.BAD_REQUEST)
          .send({ error: 'Invalid data' });
      }
      break;
    }
    default: {
      return response
        .status(HTTP_CODE.BAD_REQUEST)
        .send({ error: 'Invalid data' });
    }
  }

  if (user.show_mii === true) {
    makeBanner(user);
  }

  return response.status(HTTP_CODE.OK).send();
}

const handler = ncWithSession().post(updateMii);

export default handler;
