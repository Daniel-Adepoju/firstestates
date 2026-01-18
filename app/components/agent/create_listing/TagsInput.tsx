"use client"

import { X } from "lucide-react"
import { useSignals } from "@preact/signals-react/runtime"
import { Signal } from "@preact/signals-react"
import { KeyboardEvent } from "react"
import { tagsSuggestion } from "@lib/constants"

interface TagsInputProps {
  tagsSignal: Signal<string[]>
  maxTags?: number
}

export default function TagsInput({ tagsSignal, maxTags = 6 }: TagsInputProps) {
  useSignals()

  const addTag = (tag: string, tagsSignal: Signal<string[]>, maxTags: number) => {
    const value = tag.trim()

    if (!value || tagsSignal.value.includes(value) || tagsSignal.value.length >= maxTags) {
      return
    }

    tagsSignal.value = [...tagsSignal.value, value]
  }

  const removeTag = (tag: string, tagsSignal: Signal<string[]>) => {
    tagsSignal.value = tagsSignal.value.filter((t) => t !== tag)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget

    if (e.key === "Enter") {
      e.preventDefault()
      addTag(input.value, tagsSignal, maxTags)
      input.value = ""
    }

    if (e.key === "Backspace" && !input.value && tagsSignal.value.length > 0) {
      tagsSignal.value = tagsSignal.value.slice(0, -1)
    }
  }

  //   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
  //     if ((e.key === " " || e.key === "Enter") && !tagsSignal.value.includes(e.currentTarget.value.trim()) && tagsSignal.value.length < maxTags) {
  //       e.preventDefault()
  //       const input = e.target as HTMLInputElement
  //       const tag = input.value.trim()

  //       if (tag) {
  //         tagsSignal.value = [...tagsSignal.value, tag]
  //         input.value = ""
  //       }
  //     }

  //     if (e.key === "Backspace" && !e.currentTarget.value && tagsSignal.value.length > 0) {
  //       tagsSignal.value = tagsSignal.value.slice(0, -1)
  //     }
  //   }

  return (
    <div className="form_group">
      <label
        className="mb-1 font-semibold"
        htmlFor="tags"
      >
        Tags (Optional)
      </label>

      <div className="flex flex-col gap-1 mt-1 space-y-0.5 text-xs text-gray-600 dark:text-neutral-200">
        <span>
          Write in the input and press <b>Enter</b> to add a tag. Press{" "}
          <b>Backspace</b> or click the{" "}
          <b className="border border-black dark:border-white rounded-full px-1">X</b> icon to
          remove it.
        </span>
        <strong>Maximum of {maxTags} tags allowed.</strong>
      </div>

      {/* Tags Suggestion */}

      <div className="w-full flex items-center gap-1">
        <span className="w-fit font-medium mr-2 text-xs text-foreground">Suggestions:</span>
        
        {tagsSuggestion
          .map((item) => (
            <span
              key={item}
              onClick={() => addTag(item, tagsSignal, maxTags)}
              className="flex items-center gap-1 px-4 py-1 mb-0 text-center text-xs cursor-pointer bg-gray-400/20 font-medium text-foreground rounded-lg"
            >
              {item}
            </span>
          ))
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)}
      </div>

      <div className="w-full flex flex-wrap gap-1 border rounded-sm p-2 dark:bg-darkGray dark:text-white outline-2 outline-slate-200 dark:outline-gray-800">
        {tagsSignal.value.map((item) => (
          <div
            key={item}
            className="flex items-center gap-1 px-4 py-1 mb-0 bg-gray-400/20 font-medium text-sm text-foreground rounded-lg"
          >
            <span className="text-center">{item}</span>
            <X
              size={19}
              strokeWidth={4}
              className="cursor-pointer border border-black dark:border-white rounded-full px-1"
              onClick={() => removeTag(item, tagsSignal)}
            />
          </div>
        ))}

        {tagsSignal.value.length < maxTags && (
          <input
            id="tags"
            type="text"
            onKeyDown={handleKeyDown}
            className="flex-1 noborder min-w-[120px]"
          />
        )}
      </div>
    </div>
  )
}
