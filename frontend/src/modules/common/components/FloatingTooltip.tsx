import React, { useState, useRef, useEffect } from 'react';
import { useFloating, offset, flip, shift, Placement, inline } from '@floating-ui/react-dom';
import { Box, Text, BoxProps } from '@chakra-ui/react';

interface FloatingTooltipProps extends BoxProps {
  tooltip: unknown;
  tooltipPlacement?: Placement;
  tooltipLeft?: string | number;
  tooltipTop?: string | number;
  children: React.ReactNode;
}

const FloatingTooltip: React.FC<FloatingTooltipProps> = ({
  tooltip,
  tooltipPlacement = 'top',
  tooltipTop,
  tooltipLeft,
  children,
  ...boxProps
}) => {
  // State to manage the visibility of the tooltip
  const [isVisible, setIsVisible] = useState(false);

  // References for the reference element (trigger) and the floating element (tooltip)
  const referenceRef = useRef(null);
  const floatingRef = useRef(null);

  // useFloating hook to manage the positioning of the tooltip
  const { x, y, strategy, refs, update } = useFloating({
    placement: tooltipPlacement,
    middleware: [
      offset(10), // Offset the tooltip by 10 pixels
      flip(), // Flip the tooltip to the opposite side if it overflows
      shift({ padding: 8 }), // Shift the tooltip to fit within the viewport
      inline(), // Use inline positioning
    ],
  });

  // useEffect to update the references and position when the tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      refs.setReference(referenceRef.current);
      refs.setFloating(floatingRef.current);
      update(); // Recalculate the position
    }
  }, [isVisible, refs, update]);

  // Function to get the content of the tooltip
  const getContentValue = () => {
    const contentValue = typeof tooltip === 'function' ? tooltip() : tooltip;
    if (typeof contentValue === 'object') {
      return JSON.stringify(tooltip, null, 2); // Convert to JSON string if tooltip is an object
    }
    return contentValue; // Return as is if tooltip is a string or other type
  };

  // Event handlers to show and hide the tooltip
  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    // Container for the reference element
    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ref={referenceRef}>
      {children}
      {isVisible && (
        // Tooltip element positioned absolutely based on the calculated values
        <Box
          ref={floatingRef}
          style={{
            position: strategy,
            top: tooltipTop ?? y ?? 0,
            left: tooltipLeft ?? x ?? 0,
          }}
          p={2}
          borderRadius="md"
          zIndex="tooltip"
          bg="gray.700"
          color="white"
          whiteSpace="pre-wrap" // Always use pre-wrap for whiteSpace
          {...boxProps}
        >
          <Text>{getContentValue()}</Text>
        </Box>
      )}
    </Box>
  );
};

export default FloatingTooltip;
