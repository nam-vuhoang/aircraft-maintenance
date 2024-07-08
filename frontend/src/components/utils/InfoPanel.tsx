import { Alert, AlertIcon, AlertTitle, Text, Stack, useColorModeValue, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface InfoPanelProps {
  message: ReactNode;
}

/**
 * Render an info panel
 * @param param0
 * @returns
 */
const InfoPanel: React.FC<InfoPanelProps> = ({ message }) => {
  // Use color mode to adapt to dark/light themes
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.200', 'blue.700');
  const iconColor = useColorModeValue('blue.500', 'blue.300');
  const titleColor = useColorModeValue('blue.700', 'blue.400');

  return (
    <Alert
      className="chakra-panel"
      status="info"
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      boxShadow="lg"
      p={4}
    >
      <Stack spacing={3}>
        <Flex align="center">
          <AlertIcon boxSize="6" color={iconColor} />
          <AlertTitle ml={2} fontSize="lg" fontWeight="bold" color={titleColor}>
            Info:
          </AlertTitle>
        </Flex>
        <Text fontSize="md" color={titleColor}>
          {message}
        </Text>
      </Stack>
    </Alert>
  );
};

export default InfoPanel;
