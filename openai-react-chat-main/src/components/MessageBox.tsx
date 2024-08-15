// MessageBox.tsx
import React, {
  ChangeEvent,
  FormEvent,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  IMAGE_MIME_TYPES,
  MAX_IMAGE_ATTACHMENTS_PER_MESSAGE,
  MAX_ROWS,
  SNIPPET_MARKERS,
  TEXT_MIME_TYPES,
} from "../constants/appConstants";
import { SubmitButton } from "./SubmitButton";
import { useTranslation } from "react-i18next";
import { ChatService } from "../service/ChatService";
import { PaperClipIcon, StopCircleIcon } from "@heroicons/react/24/outline";
import Tooltip from "./Tooltip";
import FileDataPreview from "./FileDataPreview";
import { FileDataRef } from "../models/FileData";
import { preprocessImage } from "../utils/ImageUtils";

interface MessageBoxProps {
  callApp: Function;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  allowImageAttachment: string;
}

// Methods exposed to clients using useRef<MessageBoxHandles>
export interface MessageBoxHandles {
  clearInputValue: () => void;
  getTextValue: () => string;
  reset: () => void;
  resizeTextArea: () => void;
  focusTextarea: () => void;
  pasteText: (text: string) => void;
}

const MessageBox = forwardRef<MessageBoxHandles, MessageBoxProps>(
  ({ loading, setLoading, callApp, allowImageAttachment }, ref) => {
    const { t } = useTranslation();
    const textValue = useRef("");
    const [isTextEmpty, setIsTextEmpty] = useState(true);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const resizeTimeoutRef = useRef<number | null>(null);
    const [fileDataRef, setFileDataRef] = useState<FileDataRef[]>([]);

    const setTextValue = (value: string) => {
      textValue.current = value;
    };

    const setTextAreaValue = (value: string) => {
      if (textAreaRef.current) {
        textAreaRef.current.value = value;
      }
      setIsTextEmpty(textAreaRef.current?.value.trim() === "");
      debouncedResize();
    };

    useImperativeHandle(ref, () => ({
      // Method to clear the textarea
      clearInputValue: () => {
        clearValueAndUndoHistory(textAreaRef);
      },
      getTextValue: () => {
        return textValue.current;
      },
      reset: () => {
        clearValueAndUndoHistory(textAreaRef);
        setTextValue("");
        setTextAreaValue("");
        setFileDataRef([]);
      },
      resizeTextArea: () => {
        if (textAreaRef.current) {
          textAreaRef.current.style.height = "auto";
        }
      },
      focusTextarea: () => {
        if (textAreaRef.current) {
          textAreaRef.current.focus();
        }
      },
      pasteText: (text: string) => {
        insertTextAtCursorPosition(text);
      },
    }));

    // Function to handle auto-resizing of the textarea
    const handleAutoResize = useCallback(() => {
      if (textAreaRef.current) {
        const target = textAreaRef.current;
        const maxHeight =
          parseInt(getComputedStyle(target).lineHeight || "0", 10) * MAX_ROWS;

        target.style.height = "auto";
        if (target.scrollHeight <= maxHeight) {
          target.style.height = `${target.scrollHeight}px`;
        } else {
          target.style.height = `${maxHeight}px`;
        }
      }
    }, []);

    // Debounced resize function
    const debouncedResize = useCallback(() => {
      if (resizeTimeoutRef.current !== null) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        handleAutoResize();
      }, 100); // Adjust the debounce time as needed
    }, []);

    const handleTextValueUpdated = () => {
      debouncedResize();

      // After resizing, scroll the textarea to the insertion point (end of the pasted text).
      if (textAreaRef.current) {
        const textarea = textAreaRef.current;
        // Check if the pasted content goes beyond the max height (overflow scenario)
        if (textarea.scrollHeight > textarea.clientHeight) {
          // Scroll to the bottom of the textarea
          textarea.scrollTop = textarea.scrollHeight;
        }
      }
    };

    function clearValueAndUndoHistory(
      textAreaRef: React.RefObject<HTMLTextAreaElement>
    ) {
      setFileDataRef([]);
      setTextValue("");
      setTextAreaValue("");
    }

    const insertTextAtCursorPosition = (textToInsert: string) => {
      if (textAreaRef.current) {
        const textArea = textAreaRef.current;
        const startPos = textArea.selectionStart || 0;
        const endPos = textArea.selectionEnd || 0;
        const text = textArea.value;
        const newTextValue =
          text.substring(0, startPos) + textToInsert + text.substring(endPos);

        // Update the state with the new value
        setTextValue(newTextValue);
        setTextAreaValue(newTextValue);

        // Dispatch a new InputEvent for the insertion of text
        // This event should be undoable
        // const inputEvent = new InputEvent('input', {
        //   bubbles: true,
        //   cancelable: true,
        //   inputType: 'insertText',
        //   data: textToInsert,
        // });
        // textArea.dispatchEvent(inputEvent);

        // Move the cursor to the end of the inserted text
        const newCursorPos = startPos + textToInsert.length;
        setTimeout(() => {
          textArea.selectionStart = newCursorPos;
          textArea.selectionEnd = newCursorPos;
          // Scroll to the insertion point after the DOM update
          if (textArea.scrollHeight > textArea.clientHeight) {
            textArea.scrollTop = textArea.scrollHeight;
          }
        }, 0);
      }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (event.clipboardData && event.clipboardData.items) {
        const items = event.clipboardData.items;

        for (const item of items) {
          if (
            item.type.indexOf("image") === 0 &&
            allowImageAttachment !== "no"
          ) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (loadEvent) => {
                if (loadEvent.target !== null) {
                  const base64Data = loadEvent.target.result;

                  if (typeof base64Data === "string") {
                    preprocessImage(file, (base64Data, processedFile) => {
                      setFileDataRef((prevData) => [
                        ...prevData,
                        {
                          id: 0,
                          fileData: {
                            data: base64Data,
                            type: processedFile.type,
                            source: "pasted",
                            filename: "pasted-image",
                          },
                        },
                      ]);
                    });
                    if (allowImageAttachment == "warn") {
                      // todo: could warn user
                    }
                  }
                }
              };
              reader.readAsDataURL(file);
            }
          } else {
          }
        }
      }

      // Get the pasted text from the clipboard
      const pastedText = event.clipboardData.getData("text/plain");

      // Check if the pasted text contains the snippet markers
      const containsBeginMarker = pastedText.includes(SNIPPET_MARKERS.begin);
      const containsEndMarker = pastedText.includes(SNIPPET_MARKERS.end);

      // If either marker is found, just allow the default paste behavior
      if (containsBeginMarker || containsEndMarker) {
        return; // Early return if markers are present
      }

      // Count the number of newlines in the pasted text
      const newlineCount = (pastedText.match(/\n/g) || []).length;

      // Check if there are MAX_ROWS or more newlines
      if (newlineCount >= MAX_ROWS || pastedText.length > 80 * MAX_ROWS) {
        event.preventDefault();
        const modifiedText = `${SNIPPET_MARKERS.begin}\n${pastedText}\n${SNIPPET_MARKERS.end}\n`;
        insertTextAtCursorPosition(modifiedText);
      } else {
        // Allow the default paste behavior to occur
        // The textarea value will be updated automatically
      }
    };

    const checkForSpecialKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      const isEnter = e.key === "Enter";

      if (isEnter) {
        if (e.shiftKey) {
          return;
        } else {
          if (!loading) {
            e.preventDefault();
            if (textAreaRef.current) {
              setTextValue(textAreaRef.current.value);
            }
            callApp(
              textAreaRef.current?.value || "",
              allowImageAttachment === "yes" ? fileDataRef : []
            );
          }
        }
      }
    };

    const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      setIsTextEmpty(textAreaRef.current?.value.trim() === "");
      handleTextValueUpdated();
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (textAreaRef.current) {
        setTextValue(textAreaRef.current.value);
      }
      callApp(
        textAreaRef.current?.value || "",
        allowImageAttachment === "yes" ? fileDataRef : []
      );
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
      }
    };

    const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      ChatService.cancelStream();
      setLoading(false);
    };

    const handleAttachment = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      // Create an input element of type file
      const fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      fileInput.setAttribute("multiple", "");
      const acceptedMimeTypes = (
        allowImageAttachment !== "no" ? IMAGE_MIME_TYPES : []
      )
        .concat(TEXT_MIME_TYPES)
        .join(",");
      fileInput.setAttribute("accept", acceptedMimeTypes);
      fileInput.click();

      // Event listener for file selection
      fileInput.onchange = (e) => {
        const files = fileInput.files;
        if (files) {
          Array.from(files).forEach((file) => {
            // Check if the file is an image
            if (file.type.startsWith("image/")) {
              if (fileDataRef.length >= MAX_IMAGE_ATTACHMENTS_PER_MESSAGE) {
                return;
              }
              preprocessImage(file, (base64Data, processedFile) => {
                setFileDataRef((prev) => [
                  ...prev,
                  {
                    id: 0,
                    fileData: {
                      data: base64Data,
                      type: processedFile.type,
                      source: "filename",
                      filename: processedFile.name,
                    },
                  },
                ]);
                if (allowImageAttachment == "warn") {
                  // todo: could warn user
                }
              });
            }
            // Else, if the file is a text file
            else if (file.type.startsWith("text/")) {
              const reader = new FileReader();

              reader.onloadend = () => {
                const textContent = reader.result as string;
                const formattedText = `File: ${file.name}:\n${SNIPPET_MARKERS.begin}\n${textContent}\n${SNIPPET_MARKERS.end}\n`;
                insertTextAtCursorPosition(formattedText);

                // Focus the textarea and place the cursor at the end of the text
                if (textAreaRef.current) {
                  const textArea = textAreaRef.current;
                  textArea.focus();

                  const newCursorPos = textArea.value.length;

                  // Use setTimeout to ensure the operation happens in the next tick after render reflow
                  setTimeout(() => {
                    textArea.selectionStart = newCursorPos;
                    textArea.selectionEnd = newCursorPos;
                    handleAutoResize();
                    textArea.scrollTop = textArea.scrollHeight;
                  }, 0);
                }
              };

              reader.onerror = (errorEvent) => {
                console.error("File reading error:", errorEvent.target?.error);
              };

              reader.readAsText(file);
            }
          });
        }
      };
    };

    const handleRemoveFileData = (index: number, fileRef: FileDataRef) => {
      setFileDataRef(fileDataRef.filter((_, i) => i !== index));
    };

    return (
      <div
        style={{ position: "sticky" }}
        className="absolute bottom-0 mb-8 ml-3 w-[99%] border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent bg-white dark:bg-gray-900 md:!bg-transparent pt-2"
      >
        <div className="mt-4 flex w-full space-x-2  overflow-x-auto whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
          <button className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
            Regenerate response
          </button>
          <button className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
            Use prompt suggestions
          </button>
          <button className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
            Toggle web search
          </button>
          <button className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
            Select a tone
          </button>
          <button className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
            Improve
          </button>
          <button className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
            Make longer
          </button>
          <button className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
            Explain in simple words
          </button>
          <button className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
            Summarize in three lines
          </button>
          <button className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
            Translate content
          </button>
        </div>

        <form className="mt-2" onSubmit={handleSubmit}>
          <label htmlFor="chat-input" className="sr-only">
            Enter your prompt
          </label>
          <div className="relative">
            <button
              type="button"
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z"></path>
                <path d="M5 10a7 7 0 0 0 14 0"></path>
                <path d="M8 21l8 0"></path>
                <path d="M12 17l0 4"></path>
              </svg>
              <span className="sr-only">Use voice input</span>
            </button>
            {/* Grammarly extension container */}
            <div
              className="flex items-center "
              style={{ flexShrink: 0, minWidth: "fit-content" }}
            >
              {/* Grammarly extension buttons will render here without overlapping */}
            </div>
            <textarea
              id="sendMessageInput"
              name="message"
              tabIndex={0}
              ref={textAreaRef}
              rows={1}
              className="block w-full resize-none rounded-xl border-none bg-gray-200 p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 sm:text-base"
              placeholder="Enter your prompt"
              onKeyDown={checkForSpecialKey}
              onChange={handleTextChange}
              onPaste={handlePaste}
              required
            ></textarea>
            <SubmitButton disabled={isTextEmpty || loading} loading={loading} />
          </div>
        </form>
      </div>
    );
  }
);

export default MessageBox;
