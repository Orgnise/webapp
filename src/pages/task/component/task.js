import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import moment from 'moment'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import FIcon from '../../../components/ficon'
import {
  solid,
  regular,
  icon
} from '@fortawesome/fontawesome-svg-core/import.macro'

function Task ({ task, item, index }) {
  const color = {
    todo: 'orange',
    'in progress': 'red',
    done: 'green',
    'in review': 'blue'
  }

  // format date
  const date = moment(item.date).format('MMM Do YY')

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cx(
            'group mb-2 flex flex-col px-3 py-2 rounded border-transparent cursor-move items-end transition-all duration-100 ease-linear',
            `bg-${color[task[1].title.toLowerCase()]}-100 hover:bg-${
              color[task[1].title.toLowerCase()]
            }-200 border-l-4 hover:border-${
              color[task[1].title.toLowerCase()]
            }-700 active:border-${color[task[1].title.toLowerCase()]}-700`
          )}
        >
          <div className="flex place-content-between w-full text-sm text-gray-500">
            <p>{item.id}</p>
            <p className="">{date}</p>
          </div>
          <p className="w-full">{item.title}</p>

          <Link
            to={`/comments/${task[1].title}/${item.id}`}
            className="invisible group-hover:visible"
          >
            {/* {item.comments.length > 0 ? `View Comments` : "Add Comment"} */}
            <FIcon
              icon={regular('comment-alt')}
              size="1x"
              className={`text-${color[task[1].title.toLowerCase()]}-600`}
            />
          </Link>
        </div>
      )}
    </Draggable>
  )
}
export default Task
