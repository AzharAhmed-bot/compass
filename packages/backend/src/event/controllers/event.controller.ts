import express from "express";

import { ReqBody, Res } from "@compass/core/src/types/express.types";
import { OAuthDTO } from "@compass/core/src/types/auth.types";
import { GCAL_PRIMARY } from "@common/constants/backend.constants";
import { Event$NoId, Params$DeleteMany } from "@core/types/event.types";
import { Collections } from "@common/constants/collections";
import mongoService from "@common/services/mongo.service";
import { Logger } from "@common/logger/common.logger";
import { getGcal } from "@auth/services/google.auth.service";
import syncService from "@sync/services/sync.service";
import {
  updateNextSyncToken,
  updateResourceId,
} from "@sync/services/sync.helpers";

import eventService from "../services/event.service";

const logger = Logger("app:event.service");
class EventController {
  create = async (req: ReqBody<Event$NoId>, res: Res) => {
    const userId = res.locals.user.id;

    if (req.body instanceof Array) {
      const response = await eventService.createMany(userId, req.body);
      res.promise(Promise.resolve(response));
    } else {
      const response = await eventService.create(userId, req.body);
      res.promise(Promise.resolve(response));
    }
  };

  delete = async (req: express.Request, res: Res) => {
    const userId = res.locals.user.id;
    const eventId: string = req.params.id;
    const deleteResponse = await eventService.deleteById(userId, eventId);
    res.promise(Promise.resolve(deleteResponse));
  };

  deleteMany = async (
    // req: ReqBody<{ key: string; ids: string[] }>,
    req: ReqBody<Params$DeleteMany>,
    res: Res
  ) => {
    const userId = res.locals.user.id;
    //TODO validate body
    const deleteResponse = await eventService.deleteMany(userId, req.body);
    res.promise(Promise.resolve(deleteResponse));
  };

  import = async (req: express.Request, res: Res) => {
    const userId: string = res.locals.user.id;

    const userExists = await mongoService.recordExists(Collections.USER, {
      _id: mongoService.objectId(userId),
    });
    if (userExists) {
      logger.debug(`Deleting events for clean import for user: ${userId}`);
      await eventService.deleteAllByUser(userId);
    }

    const gcal = await getGcal(userId);

    const importEventsResult = await eventService.import(userId, gcal);

    const tokenUpdateResult = await updateNextSyncToken(
      userId,
      importEventsResult.nextSyncToken
    );

    const oauth: OAuthDTO = await mongoService.db
      .collection(Collections.OAUTH)
      .findOne({ user: userId });

    // use this existing oauth.state as the channelId,
    // so you can use it to identify
    // this channel for future sync updates
    const channelId = oauth.state;

    const watchResult = await syncService.startWatchingChannel(
      gcal,
      GCAL_PRIMARY,
      channelId
    );
    const resourceIdInit = await updateResourceId(
      oauth.state,
      watchResult.resourceId
    );

    const fullResults = {
      events: importEventsResult,
      tokenUpdate: tokenUpdateResult,
      watch: watchResult,
      resourceIdSave: resourceIdInit,
    };
    res.promise(Promise.resolve(fullResults));
  };

  readById = async (req: express.Request, res: Res) => {
    const userId = res.locals.user.id;
    const eventId: string = req.params.id;
    const response = await eventService.readById(userId, eventId);
    res.promise(Promise.resolve(response));
  };

  readAll = async (req: express.Request, res: Res) => {
    const userId = res.locals.user.id;
    const usersEvents = await eventService.readAll(userId, req.query);
    res.promise(Promise.resolve(usersEvents));
  };

  update = async (req: ReqBody<Event$NoId>, res: Res) => {
    /* 
    TODO validate: 
     - that no id in body (cuz id is immutable and will cause mongo err)
    */
    const userId = res.locals.user.id;
    const event = req.body;
    const eventId: string = req.params.id;
    const response = await eventService.updateById(userId, eventId, event);
    res.promise(Promise.resolve(response));
  };

  updateMany = async (req: ReqBody<Event[]>, res: Res) => {
    const userId = res.locals.user.id;
    const events = req.body;
    const response = await eventService.updateMany(userId, events);
    res.promise(Promise.resolve(response));
  };
}

export default new EventController();