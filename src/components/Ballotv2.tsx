import { FunctionComponent, h } from 'preact';
import { forwardRef } from 'preact/compat';
import { useState } from 'preact/hooks';
import define from 'preact-custom-element';

import {
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  defaultDropAnimation,
  closestCorners,
  rectIntersection,
  Active,
  DragStartEvent,
  DragEndEvent,
  CollisionDetection,
} from '@dnd-kit/core';

import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import tw, { styled } from 'twin.macro';

import useBallot from '../stores/useBallot';

const ApprovedProjectItem = (props: { id: string; name: string }) => {
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: props.id,
    data: {
      name: props.name,
      getList: () => useBallot.getState().approvedProjects,
    },
  });

  return (
    <DraggableItem ref={setNodeRef} {...listeners} isDragging={isDragging}>
      {props.name}
    </DraggableItem>
  );
};

const FavoriteProjectItem = (props: {
  id: string;
  name: string;
  index: number;
}) => {
  const { setNodeRef, listeners, isDragging } = useSortable({
    id: props.id,
    data: {
      name: props.name,
      index: props.index,
      getList: () => useBallot.getState().favoriteProjects,
      onDropHandler: (droppedProject: Active) => {
        const {
          isFull,
          favoriteProjects,
          addFavoriteProject,
          moveFavoriteProject,
          removeProject,
        } = useBallot.getState();

        const { id, data } = droppedProject;
        const { name, getList, index } = data.current;

        if (getList() !== favoriteProjects && !isFull()) {
          removeProject(id);
          addFavoriteProject(id, name);
        } else if (index) {
          moveFavoriteProject(index, props.index);
        }
      },
    },
  });

  return (
    <DraggableItem ref={setNodeRef} {...listeners} isDragging={isDragging}>
      {props.name}
    </DraggableItem>
  );
};

const FavoriteProjects = (props: any) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'favorite-projects',
    data: {
      onDropHandler: (droppedProject: Active) => {
        const { favoriteProjects, addFavoriteProject, removeProject, isFull } =
          useBallot.getState();

        const { id, data } = droppedProject;
        const { name, getList } = data.current;

        /* If not in the same list, remove the project from it's own list first. */
        if (favoriteProjects !== getList() && !isFull()) {
          removeProject(id);
          addFavoriteProject(id, name);
        }
      },
    },
  });

  return (
    <DroppableArea isOver={isOver} ref={setNodeRef}>
      {props.children}
    </DroppableArea>
  );
};

const ApprovedProjects: FunctionComponent = (props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'approved-projects',
    data: {
      onDropHandler: (droppedProject: Active) => {
        const { removeProject, addApprovedProject } = useBallot.getState();

        const { id, data } = droppedProject;
        const { name } = data.current;

        removeProject(id);
        addApprovedProject(id, name);
      },
    },
  });

  return (
    <DroppableArea isOver={isOver} ref={setNodeRef}>
      {props.children}
    </DroppableArea>
  );
};

const Ballot = () => {
  const { approvedProjects, favoriteProjects } = useBallot();
  const [draggedProject, setDraggedProject] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor as any),
    useSensor(TouchSensor as any, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedProject(event.active.data.current.name);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.data.current.onDropHandler) {
      over.data.current.onDropHandler(active);
    }

    setDraggedProject(null);
  };

  return (
    <BallotItemsContainer>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={customCollisionDetection}
        autoScroll={false}
      >
        <DragOverlay
          zIndex={1020}
          dropAnimation={{
            ...defaultDropAnimation,
            duration: 100,
            dragSourceOpacity: 0.5,
          }}
        >
          {draggedProject && <DraggableItem>{draggedProject}</DraggableItem>}
        </DragOverlay>

        <SortableContext
          strategy={verticalListSortingStrategy}
          items={favoriteProjects}
        >
          <FavoriteProjects>
            <Title>Favorites</Title>
            {favoriteProjects.map(({ id, name }, index) => (
              <FavoriteProjectItem key={id} id={id} name={name} index={index} />
            ))}
          </FavoriteProjects>
        </SortableContext>

        <ApprovedProjects>
          <Title>Approved</Title>
          {approvedProjects.map(({ id, name }) => (
            <ApprovedProjectItem key={id} id={id} name={name} />
          ))}
        </ApprovedProjects>
      </DndContext>
    </BallotItemsContainer>
  );
};

const customCollisionDetection: CollisionDetection = (rects, rect) => {
  const approvedProjectsRect = rects.filter(
    ([id]) => id === 'approved-projects'
  );

  const isIntersectingApprovedProjects = rectIntersection(
    approvedProjectsRect,
    rect
  );
  if (isIntersectingApprovedProjects) return isIntersectingApprovedProjects;

  const otherRects = rects.filter(([id]) => id !== 'approved-projects');

  return closestCorners(otherRects, rect);
};

const BallotItemsContainer = styled('div')([
  tw`fixed right-0 bottom-0 font-sans overflow-hidden rounded-lg shadow-lg border border-solid border-gray-300 z-index[1000]`,
  tw`flex flex-col w-72 max-height[min(42rem, calc(100vh - 2rem))]`,
  tw`box-border all:(m-0 p-0 box-sizing[inherit])`,
]);

const Title = styled('h3')(
  tw`text-gray-800 transition[margin 250ms ease] not-only-child:(mb-2)`
);

const DroppableArea = styled(
  'div',
  forwardRef
)([
  tw`flex flex-col gap-2 p-4 transition-colors bg-gray-100`,
  tw`not-last:(border-0 border-b border-solid border-gray-300)`,
  ({ isOver }: any) => isOver && tw`bg-gray-200`,
]);

const DraggableItem = styled(
  'div',
  forwardRef
)([
  ({ isDragging }) => isDragging && tw`opacity-25`,
  tw`flex items-center py-2 px-4 rounded-md cursor[grab] text-white bg-stellar-purple z-index[1010] touch-action[none] select-none`,
]);

define(Ballot, 'vote-ballot');
