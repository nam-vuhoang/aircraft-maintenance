import React from 'react';
import GanttChart from './components/GanttChart/GanttChart';
import { ChakraProvider, Heading } from '@chakra-ui/react';
import { TaskGroup } from './models/TaskGroup';

const taskGroups: TaskGroup[] = [
  {
    name: 'Group 1',
    tasks: [
      { id: 1, name: 'Task 1', start: new Date('2024-07-01'), end: new Date('2024-07-05'), type: 1 },
      { id: 2, name: 'Task 2', start: new Date('2024-07-03'), end: new Date('2024-07-10'), type: 2 },
    ],
  },
  {
    name: 'Group 2',
    tasks: [
      { id: 3, name: 'Task 3', start: new Date('2024-07-08'), end: new Date('2024-07-12'), type: 1 },
      { id: 4, name: 'Task 4', start: new Date('2024-07-10'), end: new Date('2024-07-15'), type: 2 },
    ],
  },
];

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <div>
        <Heading as="h1" size="lg" textAlign="center" my={4}>
          Gantt Chart
        </Heading>
        <GanttChart taskGroups={taskGroups} />
      </div>
    </ChakraProvider>
  );
};

export default App;
