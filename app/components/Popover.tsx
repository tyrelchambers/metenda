import React, { useState } from "react";

import { Popover as MantinePopover } from "@mantine/core";

interface Props {
  triggerLabel: string | React.ReactNode;
  children: React.ReactNode;
}

const Popover = ({ children, triggerLabel }: Props) => {
  const [opened, setOpened] = useState(false);

  return (
    <MantinePopover
      opened={opened}
      onClose={() => setOpened(false)}
      target={
        <button
          onClick={() => setOpened((o) => !o)}
          className="rounded-lg border-[1px] border-gray-200 bg-gray-100 py-1 px-3 text-sm text-gray-600"
        >
          {triggerLabel}
        </button>
      }
      width={300}
      position="bottom"
      placement="start"
      withArrow
      shadow="lg"
      zIndex={10}
    >
      {children}
    </MantinePopover>
  );
};

export default Popover;
