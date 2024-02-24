'use client';

import { ListWithCards } from '@/types';
import { ListForm } from './list-form';
import { ListItem } from './list-item';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type, draggableId } = result;

    if (destination.index === source.index) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // User moves a list
    if (type === 'list') {
      const reorderedLists = reorder(orderedData, destination.index, source.index).map(
        (list, index) => ({ ...list, order: index })
      );

      // Trigger server action
      setOrderedData(reorderedLists);
    }

    // User moves a card
    if (type === 'card') {
      let newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find((list) => list.id === source.droppableId);
      const destinationList = newOrderedData.find((list) => list.id === destination.droppableId);

      if (!sourceList || !destinationList) {
        return;
      }

      // Check if cards exist on the source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exist on the destination list
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(sourceList.cards, source.index, destination.index);

        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
        // Trigger server action
      } else {
        // Moving the card to another list

        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);

        // Update the order for each card in the source list
        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // Update the order for each card in the destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId='lists'
        type='list'
        direction='horizontal'
      >
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='flex gap-x-3 h-full'
          >
            {orderedData.map((list, index) => {
              return (
                <ListItem
                  key={list.id}
                  index={index}
                  data={list}
                />
              );
            })}
            {provided.placeholder}
            <ListForm />
            <div className='flex-shrink-0 w-1' />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
