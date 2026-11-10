import { useEffect, useState } from "react";
import { dateKey, msUntilNextMidnight } from "./game/dailyProgress";

/**
 * Today's local date (YYYY-MM-DD), kept up to date while the app stays open. A tab or an installed
 * phone app can stay open for days, so the date is re-checked at the next local midnight and every
 * time the player comes back to the app (tab visible again, window focused, page restored).
 * Setting an unchanged value does not re-render anything.
 */
export function useToday(): string {
  const [today, setToday] = useState(() => dateKey(new Date()));

  useEffect(() => {
    let timer: number | undefined;

    const update = () => setToday(dateKey(new Date()));
    const schedule = () => {
      window.clearTimeout(timer);
      // One second past midnight, so the new date is certainly in effect.
      timer = window.setTimeout(refresh, msUntilNextMidnight(new Date()) + 1000);
    };
    function refresh() {
      update();
      schedule();
    }

    schedule();
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, []);

  return today;
}
