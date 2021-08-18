import { h } from 'preact';
import { forwardRef, useMemo } from 'preact/compat';
import { useState } from 'preact/hooks';
import define from 'preact-custom-element';

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
  useDraggable,
  DragOverlay,
  DragStartEvent,
  defaultDropAnimation,
  closestCorners,
} from '@dnd-kit/core';

import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import tw, { styled } from 'twin.macro';

import useBallot from '../stores/useBallot';

const ProjectItemSortable = ({
  slug,
  ...rest
}: {
  slug: string;
  items: string[];
  group: string;
  index: number;
}) => {
  const { setNodeRef, listeners } = useSortable({
    id: slug,
    data: { ...rest },
  });

  return (
    <DraggableItem ref={setNodeRef} {...listeners}>
      {slug}
    </DraggableItem>
  );
};

const ProjectItem = ({
  slug,
  ...rest
}: {
  slug: string;
  items: string[];
  group: string;
}) => {
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: slug,
    data: { ...rest },
  });

  return (
    <DraggableItem ref={setNodeRef} {...listeners} isDragging={isDragging}>
      {slug}
    </DraggableItem>
  );
};

const TopProjectsList = (props: any) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'top-projects',
    data: { group: 'top-projects' },
  });

  return (
    <DroppableArea isOver={isOver} ref={setNodeRef}>
      {props.children}
    </DroppableArea>
  );
};

const ApprovedProjectsList = (props: any) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'approved-projects',
    data: { group: 'approved-projects' },
  });

  return (
    <DroppableArea isOver={isOver} ref={setNodeRef}>
      {props.children}
    </DroppableArea>
  );
};

const BallotList = () => {
  const ballotItems = useBallot((state) => state.ballotItems);
  const approvedProjects = useMemo(
    () => ballotItems.map((item) => item.slug),
    [ballotItems]
  );

  const [topProjects, setTopProjects] = useState<string[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

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
    setActiveSlug(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const { data } = active;

    console.log(active, over);

    if (over && data.current.group !== over.data.current.group) {
      const oldGroup = data.current.items;
      const [newGroup, setNewGroup] =
        oldGroup === approvedProjects
          ? [topProjects, setTopProjects]
          : [approvedProjects, () => {}];

      if (over.data.current.index) {
        newGroup.splice(over.data.current.index + 1, 0, active.id);
        console.log(newGroup);
        setNewGroup(newGroup);
      } else {
        newGroup.push(active.id);
        setNewGroup(newGroup);
      }
      // useBallot.setState((state) => {
      //   const clone = [...state.ballotItems];
      //   const oldIndex = active.data.current.index;
      //   const newIndex = over.data.current.index;
      //   return { ballotItems: arrayMove(clone, oldIndex, newIndex) };
      // });
    }

    setActiveSlug(null);
  };

  return (
    <BallotItemsContainer>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <DragOverlay
          zIndex={1020}
          dropAnimation={{
            ...defaultDropAnimation,
            dragSourceOpacity: 0.5,
          }}
        >
          {activeSlug && <DraggableItem>{activeSlug}</DraggableItem>}
        </DragOverlay>
        <SortableContext
          strategy={verticalListSortingStrategy}
          items={topProjects}
        >
          <TopProjectsList>
            {topProjects.map((slug, index) => (
              <ProjectItemSortable
                slug={slug}
                items={topProjects}
                group="top-projects"
                index={index}
              />
            ))}
          </TopProjectsList>
        </SortableContext>
        <ApprovedProjectsList>
          {approvedProjects.map((slug) => (
            <ProjectItem
              key={slug}
              slug={slug}
              items={approvedProjects}
              group="approved-projects"
            />
          ))}
        </ApprovedProjectsList>
      </DndContext>
    </BallotItemsContainer>
  );
};

const BallotItemsContainer = styled('div')([
  tw`fixed bottom-4 right-4 font-sans overflow-hidden rounded-lg shadow-lg border border-solid border-gray-100 bg-white z-index[1000]`,
  tw`flex flex-col w-72 max-height[min(42rem, calc(100vh - 2rem))]`,
  tw`box-border all:(m-0 p-0 box-sizing[inherit])`,
]);

const DroppableArea = styled(
  'div',
  forwardRef
)([
  tw`flex flex-col gap-2 p-2 min-height[4rem] transition-colors bg-gray-300`,
  ({ isOver }: any) => isOver && tw`bg-stellar-salmon`,
]);

const DraggableItem = styled(
  'div',
  forwardRef
)([
  ({ isDragging }) => isDragging && tw`opacity-25`,
  tw`flex items-center py-2 px-4 rounded-md cursor[grab] text-white bg-stellar-purple z-index[1010] touch-action[none]`,
]);

define(BallotList, 'vote-ballot');
