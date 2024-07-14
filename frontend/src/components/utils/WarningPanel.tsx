import { Alert, AlertIcon, AlertTitle, Text, Stack, useColorModeValue, Flex, AlertProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface WarningPanelProps extends AlertProps {
  message: ReactNode;
}

/**
 * Render a warning panel
 * @param param0
 * @returns
 */
const WarningPanel: React.FC<WarningPanelProps> = ({ message, ...alertProps }) => {
  // Use color mode to adapt to dark/light themes
  const bgColor = useColorModeValue('yellow.50', 'yellow.800');
  const borderColor = useColorModeValue('yellow.300', 'yellow.600');
  const iconColor = useColorModeValue('yellow.500', 'yellow.300');
  const titleColor = useColorModeValue('yellow.700', 'yellow.400');

  return (
    <Alert
      className="chakra-panel"
      status="warning"
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      p={4}
      {...alertProps}
    >
      <Stack spacing={3}>
        <Flex align="center">
          <AlertIcon boxSize="6" color={iconColor} />
          <AlertTitle ml={2} fontSize="lg" fontWeight="bold" color={titleColor}>
            Warning:
          </AlertTitle>
        </Flex>
        <Text fontSize="md" color={titleColor}>
          {message}
        </Text>
      </Stack>
    </Alert>
  );
};

export default WarningPanel;
