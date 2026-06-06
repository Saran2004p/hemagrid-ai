import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const usePageTransition = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('enter');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('exit');
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === 'exit') {
      setTransitionStage('enter');
      setDisplayLocation(location);
    }
  };

  return { displayLocation, transitionStage, handleAnimationEnd };
};