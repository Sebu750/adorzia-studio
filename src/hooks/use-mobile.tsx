import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
<<<<<<< HEAD
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Media query setup - only on mount
=======
  }, []);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

  return !!isMobile;
}
