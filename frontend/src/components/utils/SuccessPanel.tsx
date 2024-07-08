import { Alert, AlertIcon, AlertTitle, Text, Stack, useColorModeValue, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface SuccessPanelProps {
  message: ReactNode;
}

/**
 * Render a success panel
 * @param param0
 * @returns
 */
const SuccessPanel: React.FC<SuccessPanelProps> = ({ message }) => {
  // Use color mode to adapt to dark/light themes
  const bgColor = useColorModeValue('green.50', 'green.900');
  const borderColor = useColorModeValue('green.200', 'green.700');
  const iconColor = useColorModeValue('green.500', 'green.300');
  const titleColor = useColorModeValue('green.700', 'green.400');

  return (
    <Alert
      className='chakra-panel'
      status="success"
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
            Success:
          </AlertTitle>
        </Flex>
        <Text fontSize="md" color={titleColor}>
          {message}
        </Text>
      </Stack>
    </Alert>
  );
};

export default SuccessPanel;
