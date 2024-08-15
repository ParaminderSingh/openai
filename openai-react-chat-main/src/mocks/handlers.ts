import { http, HttpResponse } from 'msw'
 
export const handlers = [
  
  http.get('/conversations', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json(
        [
            {
                "id": 1723334104284,
                "gid": 0,
                "timestamp": 1723334104284,
                "title": "sdkj",
                "model": "gpt-4o",
                "systemPrompt": "You are a helpful assistant.",
                "messages": "[]"
            },
            {
                "id": 1723262356084,
                "gid": 0,
                "timestamp": 1723262356084,
                "title": "",
                "model": "gpt-4o",
                "systemPrompt": "You are a helpful assistant.",
                "messages": "[]"
            },
            {
                "id": 1723262348154,
                "gid": 0,
                "timestamp": 1723262348154,
                "title": "fwefwef",
                "model": "gpt-4o",
                "systemPrompt": "You are a helpful assistant.",
                "messages": "[]"
            },
            {
                "id": 1723262345726,
                "gid": 0,
                "timestamp": 1723262345726,
                "title": "wfwefwef",
                "model": "gpt-4o",
                "systemPrompt": "You are a helpful assistant.",
                "messages": "[]"
            },
            {
                "id": 1723262343529,
                "gid": 0,
                "timestamp": 1723262343529,
                "title": "dewdwed",
                "model": "gpt-4o",
                "systemPrompt": "You are a helpful assistant.",
                "messages": "[]"
            },
            {
                "id": 1723262341455,
                "gid": 0,
                "timestamp": 1723262341455,
                "title": "wdwd'",
                "model": "gpt-4o",
                "systemPrompt": "You are a helpful assistant.",
                "messages": "[]"
            },
            {
                "id": 1723262337920,
                "gid": 0,
                "timestamp": 1723262337920,
                "title": "dwdsd",
                "model": "gpt-4o",
                "systemPrompt": "You are a helpful assistant.",
                "messages": "[]"
            },
            {
                "id": 1723262335355,
                "gid": 0,
                "timestamp": 1723262335355,
                "title": "adsdfs",
                "model": "gpt-4o",
                "systemPrompt": "You are a helpful assistant.",
                "messages": "[]"
            },
            {
                "id": 1723262313818,
                "gid": 0,
                "timestamp": 1723262313818,
                "title": "ljlkj",
                "model": "gpt-4o",
                "systemPrompt": "You are a helpful assistant.",
                "messages": "[]"
            },
            {
                "id": 1723262307912,
                "gid": 0,
                "timestamp": 1723262307912,
                "title": "kjhk",
                "model": "gpt-4o",
                "systemPrompt": "You are a helpful assistant.",
                "messages": "[]"
            },
            {
                "id": 1722992325671,
                "gid": 0,
                "timestamp": 1722992325671,
                "title": "vghgh",
                "model": "gpt-4o",
                "systemPrompt": "You are a helpful assistant.",
                "messages": "[]"
            },
            {
                "id": 1722992313008,
                "gid": 0,
                "timestamp": 1722992313008,
                "title": ".,",
                "model": "gpt-4o",
                "systemPrompt": "You are a helpful assistant.",
                "messages": "[]"
            }
        ])
  }),

  http.post('/sendChatMessage', ()=> {
    return HttpResponse.json({
        "body": {
            "chat_user_id": 0,
            "chat_message_content": "This is a real response from API",
            "user_conversation_id": 0,
        },
        "ok": 200,
    })
  }),

  http.get('/conversation_messages/id', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
        conversation_id: 1,
        messages: [
            {
                id: '1',
                role: 'user',
                messageType: 'Normal',
                content: 'Explain quantum computing in simple terms? Param test',
                name: '',
                fileDataRef: ''
            },
            {
                id: '1',
                role: 'system',
                messageType: 'Normal',
                content: 'Certainly! Quantum computing is a new type of computing that relies on the principles of quantum physics. Traditional computers, like the one you might be using right now, use bits to store and process information. These bits can represent either a 0 or a 1. In contrast, quantum computers use quantum bits, or qubits.Unlike bits, qubits can represent not only a 0 or a 1 but also a superposition of both states simultaneously. This means that a qubit can be in multiple states at once, which allows quantum computers to perform certain calculations much faster and more efficientl',
                name: '',
                fileDataRef: ''
            },
            {
                id: '1',
                role: 'user',
                messageType: 'Normal',
                content: 'What are three great applications of quantum computing?',
                name: '',
                fileDataRef: ''
            },
            {
                id: '1',
                role: 'system',
                messageType: 'Normal',
                content: 'Three great applications of quantum computing are: Optimization of complex problems, Drug Discovery and Cryptography.',
                name: '',
                fileDataRef: ''
            },
            {
                id: '1',
                role: 'user',
                messageType: 'Normal',
                content: 'Explain quantum computing in simple terms',
                name: '',
                fileDataRef: ''
            },
            {
                id: '1',
                role: 'system',
                messageType: 'Normal',
                content: 'Explain quantum computing in simple terms',
                name: '',
                fileDataRef: ''
            }
        
        ]
    })
  }),

  http.get('/userRole', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json([{
      id: '1',
      timestamp: '',
      title: 'abc',
      firstName: 'John',
      lastName: 'Maverick',

      gid: '',
      systemPrompt: 'ABC',
      messages: '', // stringified ChatMessage[]
      marker: true,
    },
    {
        id: '1',
        timestamp: '',
        title: 'abc',
        firstName: 'John',
        lastName: 'Maverick',
  
        gid: '',
        systemPrompt: 'ABC',
        messages: '', // stringified ChatMessage[]
        marker: true,
      },
      {
        id: '1',
        timestamp: '',
        title: 'abc',
        firstName: 'John',
        lastName: 'Maverick',
  
        gid: '',
        systemPrompt: 'ABC',
        messages: '', // stringified ChatMessage[]
        marker: true,
      },
      {
        id: '1',
        timestamp: '',
        title: 'abc',
        firstName: 'John',
        lastName: 'Maverick',
  
        gid: '',
        systemPrompt: 'ABC',
        messages: '', // stringified ChatMessage[]
        marker: true,
      }])
  }),
]