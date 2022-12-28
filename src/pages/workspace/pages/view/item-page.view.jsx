import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import Validator from '../../../../helper/validator'
import FIcon from '../../../../components/ficon'
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import useWorkspace from '../../hook/use-workspace.hook'
import CustomDropDown from '../../../../components/custom_dropdown'
import { VerticalEllipse } from '../../../../components/svg-icon/verticle-ellipse'
import CollectionPage from './collection-page.view'

export default function ItemPage ({ item }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const { deleteCollection, updateCollection } = useWorkspace()

  useEffect(() => {
    if (Validator.hasValue(item)) {
      setTitle(item.title)
      setContent(item.content)
    }
  }, [item])

  const onKeyDown = (e) => {
    if (e.metaKey && e.which === 83) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  })

  function handleSubmit (e) {
    e.preventDefault()
    updateCollection({
      id: item.id,
      title,
      content,
      parent: item.parent
    })
  }

  return (
    <div className="flex flex-col gap-8 h-full  py-10">
      <div className="flex items-center place-content-between">
        <FIcon icon={regular('copy')} className="pr-1" />
        <CustomDropDown
          button={
            <div className="h-4">
              <VerticalEllipse />
            </div>
          }
        >
          <div className="flex flex-col gap-2">
            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-all ease-in duration-200"
              onClick={() => {
                deleteCollection(item.id, item.parent)
              }}
            >
              Delete
            </div>
          </div>
        </CustomDropDown>
      </div>
      <div className="flex flex-col">
        <form id={item.id} onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            className="w-full bg-transparent font-semibold text-4xl"
          />
          <textarea
            type="text"
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
            }}
            role="textbox"
            rows={50}
            className="w-full bg-transparent p-2 focus:outline-none"
          />
        </form>
      </div>
    </div>
  )
}
