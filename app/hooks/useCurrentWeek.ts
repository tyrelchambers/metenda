import { addWeeks, endOfWeek, startOfWeek, subWeeks } from "date-fns";

import { useState } from "react";

export const useCurrentWeek = (date) => {
  const [state, setState] = useState<{ startOfWeek: Date; endOfWeek: Date }>({
    startOfWeek: startOfWeek(date),
    endOfWeek: endOfWeek(date),
  });

  const nextWeek = () => {
    setState({
      startOfWeek: startOfWeek(addWeeks(state.startOfWeek, 1)),
      endOfWeek: endOfWeek(addWeeks(state.endOfWeek, 1)),
    });
  };

  const previousWeek = () => {
    setState({
      startOfWeek: startOfWeek(subWeeks(state.startOfWeek, 1)),
      endOfWeek: endOfWeek(subWeeks(state.endOfWeek, 1)),
    });
  };

  return {
    startOfWeek: state.startOfWeek,
    endOfWeek: state.endOfWeek,
    nextWeek,
    previousWeek,
  };
};
