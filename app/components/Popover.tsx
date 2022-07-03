import React, { useState } from "react";

import { Popover as MantinePopover } from "@mantine/core";

interface Props {
  triggerLabel: string | React.ReactNode;
  children: React.ReactNode;
  placement?: "start" | "center" | "end";
}

const Popover = ({ children, triggerLabel, placement = "start" }: Props) => {
  const [opened, setOpened] = useState(false);

  return (
    <MantinePopover
      opened={opened}
      onClose={() => setOpened(false)}
      target={
        <button
          onClick={() => setOpened((o) => !o)}
          className=" text-sm text-gray-600"
        >
          {triggerLabel}
        </button>
      }
      width={300}
      position="bottom"
      placement={placement}
      withArrow
      shadow="lg"
      zIndex={10}
    >
      {children}
    </MantinePopover>
  );
};

export default Popover;
