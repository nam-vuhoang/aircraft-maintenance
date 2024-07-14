import { Alert, AlertIcon, AlertProps, AlertTitle, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { serializeError } from 'serialize-error';
import { ReactNode } from 'react';
import logger from '../utils/logger';

interface ErrorPanelProps extends AlertProps {
  error: Error | ReactNode;
}

/**
 * Render an error panel
 * @param param0
 * @returns
 */
const ErrorPanel: React.FC<ErrorPanelProps> = ({ error, ...alertProps }) => {
  logger.error(JSON.stringify(serializeError(error)));
  // Use color mode to adapt to dark/light themes
  const bgColor = useColorModeValue('red.50', 'red.900');
  const borderColor = useColorModeValue('red.200', 'red.700');

  return (
    <Alert
      className="chakra-panel"
      status="error"
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      boxShadow="lg"
      p={4}
      {...alertProps}
    >
      <Stack spacing={3}>
        <Flex align="center">
          <AlertIcon boxSize="6" />
          <AlertTitle ml={2} fontSize="lg" fontWeight="bold">
            Error:
          </AlertTitle>
        </Flex>
        {error instanceof Error ? (
          <>
            <Text fontSize="md">{error.message}</Text>
            <Text fontSize="sm" color="gray.600">
              See error logs for details.
            </Text>
          </>
        ) : (
          <Text fontSize="md">{error}</Text>
        )}
      </Stack>
    </Alert>
  );
};

export default ErrorPanel;
