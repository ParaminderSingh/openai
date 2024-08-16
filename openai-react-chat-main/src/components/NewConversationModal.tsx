import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  CircleStackIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  SpeakerWaveIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import {Theme, UserContext} from '../UserContext';
import ModelSelect from './ModelSelect';
import {EditableField} from "./EditableField";
import './UserSettingsModal.css';
import {OPENAI_DEFAULT_SYSTEM_PROMPT} from "../config";
import ConversationService from "../service/ConversationService";
import {NotificationService} from "../service/NotificationService";
import {useTranslation} from 'react-i18next';
import {Transition} from '@headlessui/react';
import EditableInstructions from './EditableInstructions';
import SpeechSpeedSlider from './SpeechSpeedSlider';
import {useConfirmDialog} from './ConfirmDialog';
import TextToSpeechButton from './TextToSpeechButton';
import {DEFAULT_MODEL} from "../constants/appConstants";

interface UserSettingsModalProps {
  isVisible: boolean;
  handleCreateNewChat: () => void;
  onClose: () => void;
}

const NewConversationModal: React.FC<UserSettingsModalProps> = ({isVisible, handleCreateNewChat, onClose}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [newChatName, setNewChatName] = useState<string>('');

  const handleClose = () => {
    onClose();
  };

  const handleCreateChat = () => {
    handleCreateNewChat(newChatName);
  };

  return (
      <Transition show={isVisible} as={React.Fragment}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
          >
            <div ref={dialogRef}
                 className="flex flex-col bg-white dark:bg-gray-850 rounded-lg w-full max-w-md mx-auto overflow-hidden"
                 style={{minHeight: "150px", minWidth: "20em"}}>
              <div id='user-settings-header'
                   className="flex justify-between items-center border-b border-gray-200 p-4">
                <h1 className="text-lg font-semibold">New Conversation</h1>
                <button onClick={handleClose}
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                  <XMarkIcon className="h-8 w-8" aria-hidden="true"/>
                </button>
              </div>
              <div id='user-settings-content' className="flex flex-col items-center">
                  <br />
                    <div>
                        <input
                            type="text"
                            className={'dark:bg-gray-800 dark:text-gray-100'}
                            value={newChatName}
                            onChange={(e) => setNewChatName(e.target.value)}
                            placeholder="Enter chat name"
                        />
                    </div>
                    <br />
                    <div>
                        <button className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50" onClick={handleCreateChat}>Create</button>
                        <button onClick={handleClose} className="rounded-lg bg-gray-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-gray-800 dark:hover:bg-blue-600 dark:hover:text-slate-50 ml-2">Cancel</button>
                    </div>
                
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>
  );
};

export default NewConversationModal;
