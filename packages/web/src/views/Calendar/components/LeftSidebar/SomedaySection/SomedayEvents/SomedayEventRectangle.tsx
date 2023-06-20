import React from "react";
import { Categories_Event, Schema_Event } from "@core/types/event.types";
import { AlignItems, JustifyContent } from "@web/components/Flex/styled";
import { FlexDirections } from "@web/components/Flex/styled";
import { Flex } from "@web/components/Flex";
import { Text } from "@web/components/Text";
import { Util_Sidebar } from "@web/views/Calendar/hooks/draft/sidebar/useSidebarUtil";

import { StyledMigrateArrow } from "./styled";

interface Props {
  category: Categories_Event;
  event: Schema_Event;
  onMigrate: Util_Sidebar["onMigrate"];
}

export const SomedayEventRectangle = ({
  category,
  event,
  onMigrate,
}: Props) => {
  const target = category === Categories_Event.SOMEDAY_WEEK ? "week" : "month";

  return (
    <>
      <Flex
        alignItems={AlignItems.CENTER}
        direction={FlexDirections.ROW}
        justifyContent={JustifyContent.SPACE_BETWEEN}
      >
        <Text size={15}>{event.title}</Text>

        <Flex>
          <StyledMigrateArrow
            onClick={(e) => {
              e.stopPropagation();
              onMigrate(event, category, "back");
            }}
            role="button"
            title={`Migrate to previous ${target}`}
          >
            {"<"}
          </StyledMigrateArrow>
          <StyledMigrateArrow
            onClick={(e) => {
              e.stopPropagation();
              onMigrate(event, category, "forward");
            }}
            role="button"
            title={`Migrate to next ${target}`}
          >
            {">"}
          </StyledMigrateArrow>
        </Flex>
      </Flex>
    </>
  );
};
