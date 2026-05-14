import { useState, useEffect } from 'react';

const useSlowLoading = (isLoading, delay = 2000) => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsSlow(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSlow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return isSlow;
};

export default useSlowLoading;
