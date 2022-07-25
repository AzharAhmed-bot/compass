import { gSchema$CalendarList } from "@core/types/gcal";
import { Schema_CalendarList } from "@core/types/calendar.types";

const MapCalendarList = {
  toCompass(gcalList: gSchema$CalendarList): Schema_CalendarList {
    const primaryGcal = gcalList.items?.filter((c) => {
      return c.primary === true;
    })[0];

    const mapped = {
      google: {
        items: [primaryGcal],
      },
    };

    // @ts-ignore
    return mapped;
  },
};

export { MapCalendarList };
